# CleanHome — Platform Layanan Kebersihan Hunian Profesional

Selamat datang di repositori resmi **CleanHome**, platform pemesanan layanan kebersihan rumah tinggal dan apartemen yang dirancang dengan arsitektur modern, aman, responsif, dan mengedepankan kenyamanan pelanggan.

---

## 1. Judul & Ringkasan Proyek

**CleanHome** adalah platform web lengkap yang memperkenalkan portofolio layanan kebersihan hunian profesional kepada publik, memfasilitasi pendaftaran dan autentikasi akun pelanggan, serta menyediakan dashboard pelanggan interaktif untuk menjelajah katalog layanan, melakukan reservasi terjadwal, dan mengelola status pengerjaan pembersihan.

Sistem dibangun dari nol (*from scratch*) tanpa ketergantungan pada mockup statis, mengintegrasikan autentikasi berbasis **Supabase Auth**, basis data relasional **Supabase PostgreSQL**, keamanan **Row Level Security (RLS)**, dan antarmuka responsif bernuansa *Organic Green Minimalist*.

---

## 2. Latar Belakang & Tujuan CleanHome

Di tengah kesibukan masyarakat modern, menjaga kebersihan dan sanitasi rumah sering kali menjadi tantangan. CleanHome hadir untuk mengatasi permasalahan:
- Ketidakjelasan tarif pembersihan rumah di pasaran.
- Sulitnya menentukan dan menyesuaikan jadwal kedatangan petugas.
- Kurangnya transparansi riwayat dan status pemesanan layanan.
- Kekhawatiran atas privasi data pribadi alamat hunian pelanggan.

Tujuan utama CleanHome adalah menghadirkan sistem terpercaya di mana pelanggan dapat mengetahui tarif pasti di awal, memilih waktu kunjungan yang fleksibel, dan memiliki kendali penuh atas data serta pemesanan mereka.

---

## 3. Fitur Utama Platform

### A. Pengunjung Umum (Tanpa Akun)
- **Top Bar Contract 3-Zona**: Navigasi bersih dengan wordmark, tautan navigasi tunggal (*single-line*), dan tombol aksi.
- **Hero Interaktif**: Nilai utama hunian bersih (*"A Cleaner Home, A Better Everyday"*), visual interior menawan, dan panggilan aksi (CTA) yang jelas.
- **Katalog Layanan Publik**: Informasi jenis pembersihan (Hunian Umum, Dapur, Kamar Mandi, Kamar Tidur, Ruang Keluarga, hingga Deep Cleaning) lengkap dengan durasi dan tarif yang tersinkronisasi dari database.
- **Alur Pemesanan 3 Langkah (How It Works)**: Edukasi alur layanan yang mudah dipahami.
- **Halaman Legal**: Kebijakan Privasi (*Privacy Policy*) dan Syarat & Ketentuan (*Terms of Service*).

### B. Autentikasi Pelanggan (Supabase Auth)
- **Pendaftaran Akun Baru**: Validasi nama, email, kompleksitas kata sandi (minimal 8 karakter dengan kombinasi huruf dan angka), konfirmasi kata sandi, dan persetujuan syarat ketentuan.
- **Login Akun**: Otentikasi aman dengan proteksi terhadap *credential guessing*, kontrol tampil/sembunyi kata sandi, dan sanitasi galat.
- **Pemulihan Kata Sandi (Password Reset)**: Mekanisme pemulihan yang tidak membocorkan apakah suatu email telah terdaftar (*non-enumerating neutral messaging*).
- **Mode Evaluasi Instan (Demo Mode)**: Dukungan pengujian langsung di lingkungan AI Studio bahkan sebelum menghubungkan kredensial Supabase eksternal.

### C. Dashboard Pelanggan Terautentikasi
- **Salam Personalisasi**: Menampilkan nama pelanggan dan sapaan ramah.
- **Ringkasan Metrik Akurat**: Total reservasi, reservasi menunggu konfirmasi, layanan selesai, dan jumlah katalog aktif yang dihitung langsung dari data transaksi resmi.
- **Reservasi Layanan**: Form pemesanan dengan penolakan jadwal masa lampau, pemilihan jam kedatangan, alamat lengkap, catatan instruksi khusus, dan *price snapshot*.
- **Manajemen Riwayat Pemesanan**: Filter status (*pending*, *confirmed*, *in_progress*, *completed*, *cancelled*), dialog rincian pemesanan, dan fitur pembatalan mandiri yang aman.
- **Profil Pelanggan**: Pengelolaan nama pemesan, kontak WhatsApp/telepon, dan alamat hunian default yang otomatis terisi saat reservasi baru.

---

## 4. Stack Teknologi & Alasan Pemilihan

| Layer | Teknologi | Peran & Alasan Pemilihan |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript | UI berbasis komponen yang kuat, performa tinggi, dan *type-safety* penuh tanpa `any`. |
| **Build Tool** | Vite 8 | Waktu *build* dan *hot reload* super cepat untuk arsitektur SPA modern. |
| **Styling** | Tailwind CSS v4 | Utilitas CSS modern dengan token desain *Organic Green* (`#285A43`, `#173C32`, `#A6C7A5`, `#FAF8F1`). |
| **Routing** | React Router v7 | Manajemen navigasi SPA dengan proteksi rute terautentikasi (`ProtectedRoute`) dan rute tamu (`PublicOnlyRoute`). |
| **Database & Auth** | Supabase (PostgreSQL + Auth) | Otentikasi terstandar industri dan penyimpanan data dengan otorisasi *Row Level Security* (RLS). |
| **Validasi Formulir** | Zod | Deklarasi skema validasi yang ketat dan konsisten baik di lapisan klien maupun batas data. |
| **Ikonografi** | Lucide React | Ikon modern, ringan, dan ramah aksesibilitas. |
| **Pengujian (Testing)** | Vitest + Testing Library | Pengujian otomatis skema validasi, sanitasi galat keamanan, dan batas otorisasi. |

---

## 5. Arsitektur & Struktur Direktori

```text
cleanhome/
├── .env.example                               # Contoh konfigurasi variabel lingkungan
├── index.html                                 # Dokumen HTML utama dengan font Plus Jakarta Sans
├── metadata.json                              # Metadata applet Google 
├── package.json                               # Dependensi npm dan skrip proyek
├── tsconfig.json                              # Konfigurasi TypeScript strict mode
├── vite.config.ts                             # Konfigurasi bundler Vite
├── vitest.config.ts                           # Konfigurasi pengujian Vitest
├── supabase/
│   ├── migrations/
│   │   └── 20261028000001_initial_cleanhome_schema.sql  # DDL skema, relasi, trigger, & RLS
│   ├── seed.sql                               # Data demonstrasi layanan kebersihan
│   └── README.md                              # Panduan konfigurasi Supabase
├── src/
│   ├── App.tsx                                # Konfigurasi rute dan provider utama
│   ├── main.tsx                               # Entrypoint React DOM
│   ├── index.css                              # Desain token & gaya Tailwind v4
│   ├── components/
│   │   ├── common/
│   │   │   └── ServiceGraphic.tsx             # Ilustrasi SVG organik tangguh tanpa broken image
│   │   ├── layout/
│   │   │   └── DashboardLayout.tsx            # Sidebar desktop & navigasi mobile dashboard
│   │   ├── navigation/
│   │   │   ├── Navbar.tsx                     # Top Bar Contract 3-zona
│   │   │   ├── Footer.tsx                     # Footer tenang & tautan legal
│   │   │   └── RouteGuards.tsx                # ProtectedRoute & PublicOnlyRoute
│   │   └── bookings/
│   │       └── BookingModal.tsx               # Modal formulir pemesanan dengan snapshot tarif
│   ├── features/
│   │   ├── auth/
│   │   │   └── AuthContext.tsx                # State manajemen autentikasi & sesi
│   │   └── bookings/
│   │       └── bookingService.ts              # Lapisan data layanan dan reservasi
│   ├── pages/
│   │   ├── LandingPage.tsx                    # Halaman pemasaran publik
│   │   ├── LoginPage.tsx                      # Halaman masuk akun
│   │   ├── RegisterPage.tsx                   # Halaman registrasi pelanggan
│   │   ├── ForgotPasswordPage.tsx             # Halaman lupa kata sandi
│   │   ├── ResetPasswordPage.tsx              # Halaman pembaruan kata sandi
│   │   ├── DashboardPage.tsx                  # Dashboard ringkasan pelanggan
│   │   ├── ServicesPage.tsx                   # Halaman eksplorasi katalog layanan
│   │   ├── BookingsPage.tsx                   # Halaman riwayat dan status reservasi
│   │   ├── ProfilePage.tsx                    # Halaman kelola profil pelanggan
│   │   ├── PrivacyPage.tsx                    # Dokumen Kebijakan Privasi
│   │   ├── TermsPage.tsx                      # Dokumen Syarat dan Ketentuan
│   │   └── NotFoundPage.tsx                   # Halaman 404
│   ├── schemas/
│   │   └── index.ts                           # Skema validasi Zod
│   └── types/
│       └── index.ts                           # Definisi tipe TypeScript
└── tests/
    ├── validation.test.ts                     # Pengujian skema validasi Zod
    ├── security.test.ts                       # Pengujian sanitasi galat & batas keamanan
    └── routes.test.tsx                        # Pengujian rendering rute
```

---

## 6. Autentikasi & Alur Perjalanan Pengguna (User Journey)

```text
Pengunjung Publik
       │
       ▼
[Landing Page] ───► Jelajah Katalog Layanan
       │
       ▼
[Daftar Akun] / [Masuk Akun] (Supabase Auth)
       │
       ▼ (Sesi Terautentikasi Dibuat)
[Dashboard Pelanggan]
       ├──► Lihat Ringkasan Metrik (Total, Pending, Selesai)
       ├──► Pilih Layanan & Jadwalkan Reservasi (Validasi Tanggal Masa Depan)
       ├──► Kunci Snapshot Tarif Layanan (Price Snapshot)
       ├──► Pantau & Batalkan Reservasi (Pending / Confirmed)
       └──► Perbarui Profil & Alamat Hunian Default
       │
       ▼
[Keluar Akun] ──► Sesi Dihapus Bersih ──► Kembali ke Beranda
```

---

## 7. Skema Basis Data & Relasi Relasional

Basis data CleanHome tersusun atas 3 tabel utama di schema `public`:

### 1. `public.profiles`
- `id` (UUID, Primary Key, Foreign Key -> `auth.users(id)` ON DELETE CASCADE)
- `full_name` (TEXT, 2-100 karakter)
- `phone` (TEXT, opsional)
- `address` (TEXT, opsional)
- `created_at` / `updated_at` (TIMESTAMPTZ)

### 2. `public.services`
- `id` (UUID, Primary Key)
- `name` (TEXT, 3-100 karakter)
- `slug` (TEXT UNIQUE)
- `description` (TEXT)
- `price` (NUMERIC(10,2))
- `image_url` (TEXT, opsional)
- `category` (TEXT)
- `duration_minutes` (INTEGER)
- `is_active` (BOOLEAN DEFAULT true)

### 3. `public.bookings`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key -> `auth.users(id)` ON DELETE CASCADE)
- `service_id` (UUID, Foreign Key -> `public.services(id)` ON DELETE RESTRICT)
- `scheduled_at` (TIMESTAMPTZ, waktu reservasi)
- `service_address` (TEXT, alamat hunian)
- `notes` (TEXT, catatan khusus)
- `status` (`pending`, `confirmed`, `in_progress`, `completed`, `cancelled`)
- `price_snapshot` (NUMERIC(10,2)) — **Mengunci harga historis** agar perubahan tarif di katalog tidak merubah data transaksi masa lalu.

---

## 8. Keamanan Database & Kebijakan Row Level Security (RLS)

Seluruh tabel menerapkan isolasi data multi-penyewa (*multi-tenant isolation*) menggunakan PostgreSQL RLS:

1. **Isolasi Profil (`public.profiles`)**:
   - `SELECT`: `auth.uid() = id` (Pengguna hanya dapat melihat profilnya sendiri).
   - `UPDATE`: `auth.uid() = id` (Pengguna hanya dapat mengedit profilnya sendiri).

2. **Katalog Layanan (`public.services`)**:
   - `SELECT`: `is_active = true` (Terbuka untuk umum maupun pengguna terdaftar).
   - Operasi `INSERT`/`UPDATE`/`DELETE`: Diblokir dari client public anon key; hanya dapat dilakukan oleh proses backend atau service-role.

3. **Pemesanan Pelanggan (`public.bookings`)**:
   - `SELECT`: `auth.uid() = user_id` (Pelanggan A tidak bisa melihat pemesanan Pelanggan B).
   - `INSERT`: `auth.uid() = user_id AND status = 'pending'` (Mencegah pelanggan membuat pesanan untuk akun lain atau menetapkan status 'confirmed'/'completed' secara sepihak).
   - `UPDATE`: `auth.uid() = user_id AND status = 'cancelled'` (Pelanggan hanya boleh membatalkan pesanan miliknya yang berstatus 'pending' atau 'confirmed').

---

## 9. Pencegahan Kebocoran Informasi (Information Disclosure Prevention)

Sesuai dengan Bagian 9 Master Prompt, CleanHome menerapkan standar proteksi ketat:
1. **Sanitasi Galat Terpusat (`sanitizeErrorMessage`)**:
   Pesan galat database internal PostgreSQL, nama tabel (`public.profiles`, `bookings`), kode kesalahan (`42P01`), dan sintaks kueri SQL tidak pernah ditampilkan ke antarmuka pengguna. Seluruh galat dipetakan ke pesan ramah bahasa Indonesia.
2. **Perlindungan Enumerasi Akun**:
   Permintaan reset kata sandi selalu menampilkan pesan konfirmasi netral sehingga peretas tidak dapat memindai email yang terdaftar.
3. **Pemisahan Kredensial**:
   Hanya variabel anon `VITE_SUPABASE_PUBLISHABLE_KEY` yang diizinkan di frontend. Kunci berhak istimewa (*service role*) tidak pernah disertakan dalam bundle klien.
4. **Validasi Batas Terpercaya**:
   Pemeriksaan tanggal reservasi masa lampau dan penentuan tarif transaksi diverifikasi pada logika data terpercaya, bukan mengandalkan input mentah dari browser semata.

---

## 10. Prasyarat & Perangkat Lunak

Sebelum memulai instalasi, pastikan sistem Anda telah terpasang:
- **Node.js**: Versi 20.x atau lebih baru (LTS disarankan).
- **npm**: Versi 10.x atau lebih baru.
- **Akun Supabase**: Akun gratis di [supabase.com](https://supabase.com) (opsional jika hanya menguji mode demonstrasi).

---

## 11. Tutorial Instalasi dari Awal

1. Clone atau buka direktori proyek CleanHome:
   ```bash
   cd cleanhome
   ```

2. Pasang semua dependensi proyek:
   ```bash
   npm install
   ```

---

## 12. Tutorial Setup Proyek Supabase

Jika Anda ingin menghubungkan CleanHome ke proyek Supabase milik Anda:

1. Buka [https://supabase.com/dashboard](https://supabase.com/dashboard) dan buat proyek baru (*New Project*).
2. Tentukan nama proyek, password database, dan pilih region terdekat (misal: *Singapore*).
3. Tunggu proses pembuatan proyek selesai (~1-2 menit).
4. Masuk ke menu **Project Settings** -> **API**.
5. Salin dua nilai berikut:
   - **Project URL** (contoh: `https://xyzcompany.supabase.co`)
   - **Project API Keys** -> Ambil kunci dengan label **anon** / **public**.

---

## 13. Instruksi Migrasi Database & Seed Data

1. Di Dashboard Supabase proyek Anda, klik menu **SQL Editor** pada navigasi kiri.
2. Buat kueri baru (**New Query**).
3. Buka file `supabase/migrations/20261028000001_initial_cleanhome_schema.sql` pada proyek ini, salin seluruh kodenya, tempel ke SQL Editor Supabase, lalu klik **Run**.
4. Buat kueri baru lagi, buka file `supabase/seed.sql`, salin isinya, tempel, lalu klik **Run** untuk mengisi katalog layanan kebersihan awal.

---

## 14. Konfigurasi Variabel Lingkungan (.env)

1. Salin template `.env.example` menjadi `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Buka `.env.local` dan isi dengan kredensial Supabase Anda:
   ```env
   VITE_SUPABASE_URL=https://xyzcompany.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

> **Catatan:** Jika variabel lingkungan belum diisi, CleanHome secara cerdas akan mengaktifkan **Mode Demonstrasi Aman**, memungkinkan Anda dan evaluator langsung menguji seluruh alur pendaftaran, pemesanan, dan pengelolaan profil tanpa hambatan!

---

## 15. Menjalankan Server Pengembangan Lokal

Jalankan perintah berikut untuk menyalakan dev server:
```bash
npm run dev
```
Aplikasi akan aktif pada `http://localhost:3000`.

---

## 16. Perintah Build, Lint, Type-Check, dan Testing

### Menjalankan Uji Otomatis (Unit & Integration Tests):
```bash
npm test
```

### Memeriksa Kualitas Tipe (Type-Check / Lint):
```bash
npm run lint
```

### Melakukan Build Produksi:
```bash
npm run build
```

---

## 17. Panduan Pengguna: Pengunjung Umum

1. Buka halaman utama CleanHome di peramban web.
2. Telusuri bagian **Hero** untuk memahami proposisi nilai kebersihan hunian.
3. Gulir ke bagian **Pilihan Paket & Layanan** untuk melihat daftar pembersihan rumah, durasi perkiraan, dan tarif awal.
4. Gunakan filter kategori (*Hunian Umum*, *Area Khusus*, *Deep Cleaning*) untuk mempersempit pilihan.
5. Klik **Pesan Sekarang** pada salah satu kartu layanan. Jika belum masuk akun, Anda akan diarahkan ke halaman login secara aman.

---

## 18. Panduan Pengguna: Pendaftaran & Login

1. Klik tombol **Sign Up** di navigasi atas.
2. Masukkan nama lengkap, alamat email yang valid, kata sandi (minimal 8 karakter kombinasi huruf dan angka), konfirmasi kata sandi, dan centang persetujuan syarat ketentuan.
3. Klik **Daftar Akun**.
4. Setelah terdaftar, masuk menggunakan email dan kata sandi di halaman **Log In**.
5. *(Opsi Evaluator)*: Anda juga dapat mengklik tombol **"Gunakan Akun Demo"** di halaman login untuk langsung masuk tanpa perlu mendaftar.

---

## 19. Panduan Pengguna: Menjelajah Katalog Layanan

1. Setelah masuk, buka menu **Jelajah Layanan** di sidebar dashboard.
2. Gunakan kolom pencarian di bagian atas untuk mencari nama atau deskripsi layanan tertentu.
3. Klik tombol ikon **Info (i)** pada kartu layanan untuk membaca rincian spesifikasi dan durasi kerja.
4. Klik **Pesan** untuk membuka form reservasi interaktif.

---

## 20. Panduan Pengguna: Membuat & Mengelola Reservasi

1. Pada formulir reservasi yang terbuka:
   - Tentukan **Tanggal Layanan** (sistem otomatis menolak tanggal di masa lalu).
   - Pilih **Jam Kedatangan Tim** (08:00, 09:00, 11:00, 13:30, atau 15:30 WIB).
   - Isi atau sesuaikan **Alamat Lengkap Hunian**.
   - Tambahkan catatan khusus (misalnya: keberadaan hewan peliharaan atau area prioritas).
2. Klik **Konfirmasi Reservasi**. Sistem akan mengunci snapshot tarif dan menyimpan status awal sebagai `pending`.
3. Buka menu **Reservasi Saya** untuk melihat seluruh riwayat pemesanan.
4. Jika ingin membatalkan jadwal yang berstatus `pending` atau `confirmed`, klik tombol **Batalkan** dan setujui dialog konfirmasi.

---

## 21. Panduan Pengguna: Memperbarui Profil & Keluar Akun

1. Buka menu **Profil Saya** di sidebar dashboard.
2. Ubah nama pemesan, nomor telepon / WhatsApp, atau alamat hunian default.
3. Klik **Simpan Perubahan**. Notifikasi hijau akan muncul menandakan pembaruan sukses disimpan ke tabel `profiles`.
4. Untuk keluar akun dengan aman, klik tombol **Keluar Akun** di bagian bawah sidebar. Sesi autentikasi akan dihapus dan Anda diarahkan kembali ke beranda.

---

## 22. Panduan Mengatasi Kendala (Troubleshooting)

- **Masalah: Gagal login dengan pesan "Invalid login credentials"**
  - Solusi: Pastikan email dan password yang dimasukkan sesuai. Jika lupa kata sandi, gunakan fitur *Lupa Kata Sandi*.
- **Masalah: Layanan tidak muncul saat menggunakan database pribadi**
  - Solusi: Pastikan Anda telah menjalankan skrip `supabase/seed.sql` di SQL Editor Supabase untuk mengisi tabel `services`.
- **Masalah: Error "permission denied for table bookings"**
  - Solusi: Pastikan skrip migrasi `20261028000001_initial_cleanhome_schema.sql` telah dieksekusi lengkap dengan kebijakan RLS-nya.

---

## 23. Instruksi Deployment ke Produksi

1. Jalankan `npm run build` untuk menghasilkan bundel optimal di folder `dist/`.
2. Di penyedia hosting (Vercel, Cloud Run, Netlify, atau VPS):
   - Atur environment variable: `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY`.
   - Atur pengaturan SPA fallback (semua request rute diarahkan ke `index.html`).
3. Pastikan konfigurasi URL redirect autentikasi di Supabase Dashboard (**Authentication -> URL Configuration**) mengarah ke domain produksi Anda.

---

## 24. Batasan Keamanan & Pertimbangan Produksi

- **Gerbang Pembayaran**: CleanHome tahap ini berfokus pada reservasi jadwal dan penguncian snapshot tarif (*post-pay on site / invoicing*). Integrasi payment gateway (seperti Midtrans atau Stripe) dapat ditambahkan pada tahap selanjutnya.
- **Verifikasi Email di Produksi**: Untuk produksi langsung, pastikan fitur *Confirm email* diaktifkan di panel Supabase Auth dan SMTP kustom (SendGrid/Resend) telah dikonfigurasi.
- **Penyimpanan Kunci**: Variabel anon Supabase aman untuk publik karena seluruh otorisasi dilindungi oleh RLS di level PostgreSQL engine. Jangan pernah menaruh *service_role* key di dalam kode aplikasi klien!

---

## 25. Rencana Pengembangan Mendatang (Future Roadmap)

- Integrasi gerbang pembayaran otomatis (*Payment Gateway*).
- Sistem penugasan (*assignment*) tim cleaner dan pelacakan GPS kedatangan waktu nyata (*real-time ETA*).
- Ulasan dan penilaian bintang pasca-layanan selesai.
- Program langganan mingguan dan bulanan otomatis.

---

## 26. Lisensi

Proyek ini dirilis di bawah lisensi **MIT License**. Hak cipta © 2026 CleanHome Platform.
