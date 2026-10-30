import React from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/navigation/Footer';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F1]">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 sm:p-12 rounded-2xl border border-[#285A43]/10 shadow-xs space-y-8">
            <div className="space-y-2 border-b border-[#285A43]/10 pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#285A43]/10 text-[#285A43] text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Dokumen Kebijakan Resmi</span>
              </div>
              <h1 className="text-3xl font-serif-luxury font-bold text-[#173C32]">
                Kebijakan Privasi CleanHome
              </h1>
              <p className="text-xs text-[#68756D]">
                Terakhir diperbarui: Oktober 2026
              </p>
            </div>

            <div className="space-y-6 text-sm text-[#24332A] leading-relaxed">
              <section className="space-y-2">
                <h2 className="text-lg font-bold text-[#173C32]">1. Pendahuluan</h2>
                <p>
                  CleanHome berkomitmen untuk melindungi dan menghormati privasi data pribadi pengguna platform kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pribadi yang Anda berikan ketika menggunakan layanan kebersihan dan website CleanHome.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-bold text-[#173C32]">2. Informasi yang Kami Kumpulkan</h2>
                <p>Kami hanya mengumpulkan data yang relevan untuk kebutuhan operasional layanan kebersihan:</p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-[#68756D]">
                  <li><strong>Informasi Identitas & Kontak:</strong> Nama lengkap, alamat email, dan nomor telepon aktif.</li>
                  <li><strong>Data Reservasi & Lokasi Layanan:</strong> Alamat hunian pengerjaan layanan kebersihan, waktu kunjungan yang dipilih, dan catatan khusus hunian.</li>
                  <li><strong>Data Autentikasi:</strong> Kredensial akun dikelola secara aman oleh Supabase Auth; kami tidak pernah menyimpan password dalam bentuk plaintext.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-bold text-[#173C32]">3. Keamanan Data & Row Level Security (RLS)</h2>
                <p>
                  Sistem basis data CleanHome menerapkan kebijakan PostgreSQL Row Level Security (RLS) yang ketat. Data profil dan riwayat reservasi Anda hanya dapat diakses oleh akun terautentikasi milik Anda sendiri. Akses lintas pelanggan (cross-tenant access) diblokir secara mutlak pada lapisan database engine.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-bold text-[#173C32]">4. Penggunaan Informasi</h2>
                <p>Informasi Anda digunakan semata-mata untuk:</p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-[#68756D]">
                  <li>Memproses dan mengoordinasikan kunjungan tim kebersihan ke alamat Anda.</li>
                  <li>Menampilkan riwayat reservasi dan status pengerjaan pada dashboard pribadi Anda.</li>
                  <li>Mengirimkan konfirmasi reservasi dan pembaruan penting terkait status layanan.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-bold text-[#173C32]">5. Kontak Kami</h2>
                <p>
                  Jika Anda memiliki pertanyaan mengenai kebijakan privasi atau ingin memperbarui data pribadi Anda, hubungi tim privasi kami di <strong className="text-[#173C32]">support@cleanhome.id</strong>.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
