-- ============================================================================
-- Migration: 20261028000001_initial_cleanhome_schema.sql
-- Description: Initial schema for CleanHome (profiles, services, bookings)
-- Author: CleanHome Senior Database Architect
-- ============================================================================

-- Enable pgcrypto for UUID generation if not already present
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. Table: profiles
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL CHECK (char_length(trim(full_name)) >= 2 AND char_length(full_name) <= 100),
    phone TEXT CHECK (phone IS NULL OR char_length(phone) <= 30),
    address TEXT CHECK (address IS NULL OR char_length(address) <= 255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for fast user lookup
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);

-- ----------------------------------------------------------------------------
-- 2. Table: services
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL CHECK (char_length(trim(name)) >= 3 AND char_length(name) <= 100),
    slug TEXT NOT NULL UNIQUE CHECK (char_length(slug) <= 120),
    description TEXT NOT NULL CHECK (char_length(description) <= 1000),
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    image_url TEXT,
    category TEXT NOT NULL DEFAULT 'standard' CHECK (char_length(category) <= 50),
    duration_minutes INTEGER NOT NULL DEFAULT 120 CHECK (duration_minutes > 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for services query performance
CREATE INDEX IF NOT EXISTS idx_services_is_active ON public.services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);

-- ----------------------------------------------------------------------------
-- 3. Table: bookings
-- ----------------------------------------------------------------------------
CREATE TYPE public.booking_status AS ENUM (
    'pending',
    'confirmed',
    'in_progress',
    'completed',
    'cancelled'
);

CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
    scheduled_at TIMESTAMPTZ NOT NULL,
    service_address TEXT NOT NULL CHECK (char_length(trim(service_address)) >= 5 AND char_length(service_address) <= 255),
    notes TEXT CHECK (notes IS NULL OR char_length(notes) <= 500),
    status public.booking_status NOT NULL DEFAULT 'pending',
    price_snapshot NUMERIC(10, 2) NOT NULL CHECK (price_snapshot >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for bookings
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON public.bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_at ON public.bookings(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

-- ----------------------------------------------------------------------------
-- 4. Automatic updated_at Trigger
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_services_updated_at ON public.services;
CREATE TRIGGER set_services_updated_at
    BEFORE UPDATE ON public.services
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_bookings_updated_at ON public.bookings;
CREATE TRIGGER set_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 5. Automatic Profile Creation on User Signup (Auth Hook Trigger)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    raw_name TEXT;
BEGIN
    -- Extract full name from user_metadata, or safely fallback
    raw_name := coalesce(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        split_part(NEW.email, '@', 1),
        'Customer'
    );

    -- Enforce safety length bounds
    raw_name := substr(trim(raw_name), 1, 100);
    IF length(raw_name) < 2 THEN
        raw_name := 'CleanHome Member';
    END IF;

    INSERT INTO public.profiles (id, full_name, phone, address, created_at, updated_at)
    VALUES (
        NEW.id,
        raw_name,
        NULLIF(trim(NEW.raw_user_meta_data->>'phone'), ''),
        NULLIF(trim(NEW.raw_user_meta_data->>'address'), ''),
        timezone('utc'::text, now()),
        timezone('utc'::text, now())
    )
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Safely log and do not block auth creation
        RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 6. Row Level Security (RLS) Configuration
-- ----------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 6A. Profiles Policies
-- Public cannot read profiles
-- Authenticated users can only read their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- Authenticated users can update only their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 6B. Services Policies
-- Anyone (anon and authenticated) can view active services
CREATE POLICY "Anyone can view active services"
    ON public.services
    FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

-- Modifying services is restricted from public clients (handled by backend or admin role)

-- 6C. Bookings Policies
-- Authenticated users can only read their own bookings
CREATE POLICY "Users can view own bookings"
    ON public.bookings
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Authenticated users can create bookings ONLY for their own user_id and with 'pending' status
CREATE POLICY "Users can create own bookings as pending"
    ON public.bookings
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id
        AND status = 'pending'::public.booking_status
    );

-- Authenticated users can update ONLY to 'cancelled' if booking is still 'pending' or 'confirmed'
CREATE POLICY "Users can cancel own pending or confirmed bookings"
    ON public.bookings
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = user_id
        AND status IN ('pending'::public.booking_status, 'confirmed'::public.booking_status)
    )
    WITH CHECK (
        auth.uid() = user_id
        AND status = 'cancelled'::public.booking_status
    );

-- Revoke dangerous permissions from public
REVOKE ALL ON FUNCTION public.handle_updated_at() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.handle_updated_at() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated, service_role;
