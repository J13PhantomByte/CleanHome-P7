import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Service, Booking, Profile } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

// Detect if real Supabase credentials are configured
export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseUrl.includes('supabase.co') &&
    !supabaseUrl.includes('your-project-ref') &&
    !supabaseAnonKey.includes('your-supabase')
);

/**
 * Format currency to Rupiah Indonesia (Rp)
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Fallback seed services in Rupiah reflecting authentic Indonesian cleaning market rates
export const DEMO_SERVICES: Service[] = [
  {
    id: 'c1e48342-990a-40a2-9fa9-6f10d65b7901',
    name: 'Pembersihan Rumah Standar',
    slug: 'general-home-cleaning',
    description: 'Pembersihan menyeluruh seluruh ruangan: menyapu, mengepel lantai, pembersihan debu perabot, sanitasi permukaan sering disentuh, dan pembuangan sampah. Tarif standar Rp 75.000 per jam.',
    price: 150000, // 2 jam x Rp 75.000
    image_url: null,
    category: 'residential',
    duration_minutes: 120,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'c1e48342-990a-40a2-9fa9-6f10d65b7902',
    name: 'Pembersihan Dapur Intensif',
    slug: 'deep-kitchen-cleaning',
    description: 'Pembersihan kerak minyak kompor, saringan exhaust hood, dinding keramik backsplash, sterilisasi bak cuci piring, dan lap kabinet luar. Tarif Rp 85.000 per jam.',
    price: 170000, // 2 jam x Rp 85.000
    image_url: null,
    category: 'specialized',
    duration_minutes: 120,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'c1e48342-990a-40a2-9fa9-6f10d65b7903',
    name: 'Sanitasi & Kerak Kamar Mandi',
    slug: 'bathroom-sanitization',
    description: 'Pembersihan nat lantai dan dinding keramik, pengikisan kerak air dan sabun pada kaca shower, disinfeksi kloset standar higienis, serta pemolesan cermin dan keran. Tarif Rp 90.000 per jam.',
    price: 180000, // 2 jam x Rp 90.000
    image_url: null,
    category: 'specialized',
    duration_minutes: 120,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'c1e48342-990a-40a2-9fa9-6f10d65b7904',
    name: 'Kamar Tidur & Pergantian Sprei',
    slug: 'bedroom-linen-refresh',
    description: 'Vakum kasur untuk pengurangan tungau debu, perapian dan pergantian sprei bersih, pembersihan kolong ranjang, lap lemari pakaian, dan penyegaran udara kamar. Tarif Rp 65.000 per jam.',
    price: 130000, // 2 jam x Rp 65.000
    image_url: null,
    category: 'residential',
    duration_minutes: 120,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'c1e48342-990a-40a2-9fa9-6f10d65b7905',
    name: 'Ruang Keluarga & Perawatan Sofa',
    slug: 'living-room-carpet-care',
    description: 'Pembersihan serat sofa kain dan karpet menggunakan vakum berkekuatan tinggi, pengelapan kabinet TV dan rak buku, pembersihan sudut plin lantai, dan aromaterapi alami. Tarif Rp 80.000 per jam.',
    price: 160000, // 2 jam x Rp 80.000
    image_url: null,
    category: 'residential',
    duration_minutes: 120,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'c1e48342-990a-40a2-9fa9-6f10d65b7906',
    name: 'Deep Cleaning Menyeluruh (Paket Borongan)',
    slug: 'full-move-in-deep-cleaning',
    description: 'Pembersihan total pasca renovasi atau persiapan pindah hunian. Mencakup detail rel jendela, ventilasi, bagian dalam lemari kosong, noda cat/semen halus, dan disinfeksi total. Paket borongan mulai Rp 25.000 per meter persegi atau paket borongan hunian.',
    price: 1250000, // Paket borongan dasar hunian standar 50 m²
    image_url: null,
    category: 'deep-cleaning',
    duration_minutes: 240,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
];

// Initialize real Supabase client or safe fallback client
export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : createClient('https://mock-cleanhome-supabase.co', 'mock-anon-key-preview', {
      auth: {
        persistSession: false,
      },
    });

/**
 * Information Disclosure Prevention: Safe Error Sanitizer
 * Strips database internals, SQL queries, stack traces, and internal schema details.
 */
export function sanitizeErrorMessage(error: unknown): string {
  if (!error) return 'Terjadi kendala tidak terduga. Silakan coba kembali.';

  const message = typeof error === 'string' 
    ? error 
    : (error as { message?: string }).message || '';

  const lower = message.toLowerCase();

  // Authentication error mapping
  if (lower.includes('invalid login credentials') || lower.includes('invalid_grant')) {
    return 'Email atau kata sandi yang Anda masukkan salah.';
  }
  if (lower.includes('user already registered') || lower.includes('already exists')) {
    return 'Alamat email ini sudah terdaftar. Silakan masuk.';
  }
  if (lower.includes('email not confirmed')) {
    return 'Alamat email Anda belum diverifikasi. Silakan periksa kotak masuk email Anda.';
  }
  if (lower.includes('password should be at least')) {
    return 'Kata sandi minimal 8 karakter.';
  }
  if (lower.includes('jwt expired') || lower.includes('token is expired')) {
    return 'Sesi Anda telah kedaluwarsa. Silakan masuk kembali.';
  }
  if (lower.includes('row-level security') || lower.includes('permission denied')) {
    return 'Akses ditolak. Anda tidak memiliki izin untuk mengakses data ini.';
  }
  if (lower.includes('network') || lower.includes('failed to fetch')) {
    return 'Koneksi jaringan terputus. Pastikan sambungan internet Anda aktif.';
  }

  // Generic safe message (prevents SQL table, column or constraint leaking)
  return 'Permintaan Anda belum dapat diselesaikan saat ini. Silakan coba kembali beberapa saat lagi.';
}
