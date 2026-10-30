import { supabase, isSupabaseConfigured, DEMO_SERVICES, sanitizeErrorMessage } from '../../lib/supabase';
import { Service, Booking } from '../../types';

const LOCAL_STORAGE_BOOKINGS_KEY = 'cleanhome_demo_bookings';

const INITIAL_DEMO_BOOKINGS: Booking[] = [
  {
    id: 'b-991',
    user_id: 'demo-sarah-user-id',
    service_id: 'c1e48342-990a-40a2-9fa9-6f10d65b7901',
    scheduled_at: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days in future
    service_address: 'Jl. Kemang Dahlia No. 18, Jakarta Selatan',
    notes: 'Mohon fokus pada area dapur dan debu di atas lemari tinggi.',
    status: 'pending',
    price_snapshot: 150000,
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    service: DEMO_SERVICES[0],
  },
  {
    id: 'b-992',
    user_id: 'demo-sarah-user-id',
    service_id: 'c1e48342-990a-40a2-9fa9-6f10d65b7903',
    scheduled_at: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    service_address: 'Jl. Kemang Dahlia No. 18, Jakarta Selatan',
    notes: null,
    status: 'completed',
    price_snapshot: 180000,
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    service: DEMO_SERVICES[2],
  },
];

/**
 * Fetch all active services available for booking
 */
export async function getActiveServices(): Promise<{ data: Service[]; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { data: DEMO_SERVICES, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('services')
      .select('id, name, slug, description, price, image_url, category, duration_minutes, is_active, created_at, updated_at')
      .eq('is_active', true)
      .order('price', { ascending: true });

    if (error) {
      return { data: DEMO_SERVICES, error: sanitizeErrorMessage(error) };
    }

    if (!data || data.length === 0) {
      return { data: DEMO_SERVICES, error: null };
    }

    return { data: data as Service[], error: null };
  } catch (err) {
    return { data: DEMO_SERVICES, error: sanitizeErrorMessage(err) };
  }
}

/**
 * Fetch bookings belonging strictly to the authenticated user
 */
export async function getUserBookings(userId: string): Promise<{ data: Booking[]; error: string | null }> {
  if (!userId) {
    return { data: [], error: 'Identitas pengguna tidak ditemukan' };
  }

  if (!isSupabaseConfigured) {
    const stored = localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY);
    if (!stored) {
      localStorage.setItem(LOCAL_STORAGE_BOOKINGS_KEY, JSON.stringify(INITIAL_DEMO_BOOKINGS));
      return { data: INITIAL_DEMO_BOOKINGS, error: null };
    }
    try {
      const parsed: Booking[] = JSON.parse(stored);
      // Filter strictly by user_id to honor authorization boundaries even in demo
      const userFiltered = parsed.filter((b) => b.user_id === userId);
      return { data: userFiltered, error: null };
    } catch {
      return { data: INITIAL_DEMO_BOOKINGS, error: null };
    }
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        user_id,
        service_id,
        scheduled_at,
        service_address,
        notes,
        status,
        price_snapshot,
        created_at,
        updated_at,
        service:services(id, name, slug, description, price, category, duration_minutes)
      `)
      .eq('user_id', userId)
      .order('scheduled_at', { ascending: false });

    if (error) {
      return { data: [], error: sanitizeErrorMessage(error) };
    }

    // Map Supabase foreign relation format safely
    const formatted: Booking[] = (data || []).map((row: any) => ({
      ...row,
      service: Array.isArray(row.service) ? row.service[0] : row.service,
    }));

    return { data: formatted, error: null };
  } catch (err) {
    return { data: [], error: sanitizeErrorMessage(err) };
  }
}

/**
 * Create a new booking with trusted price snapshot and future date enforcement
 */
export async function createBooking(params: {
  userId: string;
  serviceId: string;
  scheduledAt: string;
  serviceAddress: string;
  notes?: string;
}): Promise<{ data: Booking | null; error: string | null }> {
  const { userId, serviceId, scheduledAt, serviceAddress, notes } = params;

  if (!userId) {
    return { data: null, error: 'Akses ditolak: sesi tidak valid.' };
  }

  // Trusted Date Boundary: Reject past dates
  const scheduledTime = new Date(scheduledAt).getTime();
  if (isNaN(scheduledTime) || scheduledTime < Date.now() - 60000) {
    return { data: null, error: 'Jadwal reservasi tidak boleh berada di waktu lampau.' };
  }

  // Derive trusted price from active service record (never trust client-supplied price)
  let trustedPrice = 65.0;
  let serviceName = 'General Home Cleaning';
  let serviceObj: Service = DEMO_SERVICES[0];

  const matchedDemo = DEMO_SERVICES.find((s) => s.id === serviceId);
  if (matchedDemo) {
    trustedPrice = matchedDemo.price;
    serviceName = matchedDemo.name;
    serviceObj = matchedDemo;
  }

  if (isSupabaseConfigured) {
    try {
      const { data: serviceRecord, error: serviceErr } = await supabase
        .from('services')
        .select('id, name, price, slug, description, category, duration_minutes')
        .eq('id', serviceId)
        .eq('is_active', true)
        .single();

      if (serviceErr || !serviceRecord) {
        return { data: null, error: 'Layanan kebersihan yang dipilih tidak ditemukan atau sedang tidak aktif.' };
      }

      trustedPrice = Number(serviceRecord.price);
      serviceName = serviceRecord.name;
      serviceObj = serviceRecord as Service;
    } catch {
      return { data: null, error: 'Gagal memverifikasi rincian tarif layanan.' };
    }
  }

  const newBookingPayload = {
    user_id: userId,
    service_id: serviceId,
    scheduled_at: scheduledAt,
    service_address: serviceAddress.trim(),
    notes: notes?.trim() || null,
    status: 'pending' as const, // Strict enforcement: client cannot self-assign confirmed/completed
    price_snapshot: trustedPrice,
  };

  if (!isSupabaseConfigured) {
    const newBooking: Booking = {
      ...newBookingPayload,
      id: 'b-' + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      service: serviceObj,
    };

    const currentBookings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY) || '[]');
    const updated = [newBooking, ...currentBookings];
    localStorage.setItem(LOCAL_STORAGE_BOOKINGS_KEY, JSON.stringify(updated));

    return { data: newBooking, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert(newBookingPayload)
      .select(`
        id,
        user_id,
        service_id,
        scheduled_at,
        service_address,
        notes,
        status,
        price_snapshot,
        created_at,
        updated_at
      `)
      .single();

    if (error) {
      return { data: null, error: sanitizeErrorMessage(error) };
    }

    const created: Booking = {
      ...(data as Booking),
      service: serviceObj,
    };

    return { data: created, error: null };
  } catch (err) {
    return { data: null, error: sanitizeErrorMessage(err) };
  }
}

/**
 * Cancel an active pending or confirmed booking
 */
export async function cancelBooking(bookingId: string, userId: string): Promise<{ success: boolean; error: string | null }> {
  if (!bookingId || !userId) {
    return { success: false, error: 'Parameter pembatalan tidak lengkap.' };
  }

  if (!isSupabaseConfigured) {
    const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY) || '[]');
    const updated = stored.map((b: Booking) => {
      if (b.id === bookingId && b.user_id === userId) {
        return { ...b, status: 'cancelled', updated_at: new Date().toISOString() };
      }
      return b;
    });
    localStorage.setItem(LOCAL_STORAGE_BOOKINGS_KEY, JSON.stringify(updated));
    return { success: true, error: null };
  }

  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId)
      .eq('user_id', userId)
      .in('status', ['pending', 'confirmed']);

    if (error) {
      return { success: false, error: sanitizeErrorMessage(error) };
    }

    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: sanitizeErrorMessage(err) };
  }
}
