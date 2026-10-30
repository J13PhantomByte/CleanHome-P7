# Supabase Database & Security Documentation — CleanHome

Dokumentasi arsitektur database Supabase, konfigurasi Row Level Security (RLS), dan instruksi migrasi untuk CleanHome.

---

## 1. Skema Database

CleanHome menggunakan PostgreSQL yang dikelola melalui Supabase:

### A. Tabel `profiles`
Menyimpan profil pelanggan yang terhubung langsung dengan `auth.users(id)`.
- `id` (UUID, Primary Key, Foreign Key -> `auth.users.id` ON DELETE CASCADE)
- `full_name` (TEXT, 2-100 karakter)
- `phone` (TEXT, nomor kontak)
- `address` (TEXT, alamat layanan pelanggan)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### B. Tabel `services`
Menyimpan katalog layanan kebersihan yang aktif.
- `id` (UUID, Primary Key, DEFAULT `gen_random_uuid()`)
- `name` (TEXT, 3-100 karakter)
- `slug` (TEXT UNIQUE)
- `description` (TEXT)
- `price` (NUMERIC(10,2) NOT NULL CHECK price >= 0)
- `image_url` (TEXT)
- `category` (TEXT)
- `duration_minutes` (INTEGER)
- `is_active` (BOOLEAN DEFAULT true)
- `created_at` / `updated_at` (TIMESTAMPTZ)

### C. Tabel `bookings`
Menyimpan data reservasi kebersihan milik pelanggan.
- `id` (UUID, Primary Key)
- `user_id` (UUID REFERENCES `auth.users(id)` ON DELETE CASCADE)
- `service_id` (UUID REFERENCES `public.services(id)` ON DELETE RESTRICT)
- `scheduled_at` (TIMESTAMPTZ NOT NULL)
- `service_address` (TEXT NOT NULL, 5-255 karakter)
- `notes` (TEXT)
- `status` (ENUM: `pending`, `confirmed`, `in_progress`, `completed`, `cancelled`)
- `price_snapshot` (NUMERIC(10,2) NOT NULL) — Mengunci harga transaksi saat pemesanan agar tidak terpengaruh jika harga katalog berubah di kemudian hari
- `created_at` / `updated_at` (TIMESTAMPTZ)

---

## 2. Row Level Security (RLS) & Kebijakan Hak Akses

Seluruh tabel dilindungi oleh PostgreSQL Row Level Security:

1. **`profiles`**:
   - `SELECT`: Hanya pemilik akun (`auth.uid() = id`). Pengunjung atau pengguna lain diblokir total.
   - `UPDATE`: Hanya pemilik akun (`auth.uid() = id`).

2. **`services`**:
   - `SELECT`: Terbuka untuk umum (publik anonim & pengguna terautentikasi) dengan batasan `is_active = true`.
   - Modifikasi `INSERT`/`UPDATE`/`DELETE`: Diblokir dari client public anon key; hanya dapat dilakukan oleh backend terverifikasi atau service role.

3. **`bookings`**:
   - `SELECT`: Hanya pengguna yang memiliki booking tersebut (`auth.uid() = user_id`).
   - `INSERT`: Pengguna terautentikasi hanya dapat membuat booking untuk dirinya sendiri (`auth.uid() = user_id`) dan status wajib `'pending'` (mencegah eskalasi status menjadi 'confirmed' atau 'completed' dari browser).
   - `UPDATE`: Pengguna hanya diperbolehkan membatalkan booking miliknya yang masih berstatus `pending` atau `confirmed` menjadi `cancelled`.

---

## 3. Cara Menerapkan Migrasi di Supabase

### Langkah 1: Buka Supabase Dashboard
1. Masuk ke [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Buat proyek baru atau pilih proyek yang sudah ada.

### Langkah 2: Buka SQL Editor
1. Di panel kiri, klik **SQL Editor**.
2. Klik **New Query**.
3. Salin seluruh isi file `supabase/migrations/20261028000001_initial_cleanhome_schema.sql` dan tempel ke SQL Editor.
4. Klik tombol **Run**.

### Langkah 3: Eksekusi Seed Data
1. Buat New Query baru.
2. Salin isi `supabase/seed.sql` dan tempel ke SQL Editor.
3. Klik tombol **Run**.

### Langkah 4: Ambil Kredensial API
1. Masuk ke menu **Project Settings** -> **API**.
2. Salin:
   - **Project URL** -> masukkan ke `VITE_SUPABASE_URL` di `.env.local`
   - **Project API Keys (anon / public)** -> masukkan ke `VITE_SUPABASE_PUBLISHABLE_KEY` di `.env.local`
