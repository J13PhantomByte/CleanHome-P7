import React from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/navigation/Footer';
import { FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F1]">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 sm:p-12 rounded-2xl border border-[#285A43]/10 shadow-xs space-y-8">
            <div className="space-y-2 border-b border-[#285A43]/10 pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#285A43]/10 text-[#285A43] text-xs font-semibold">
                <FileText className="w-3.5 h-3.5" />
                <span>Ketentuan Penggunaan Platform</span>
              </div>
              <h1 className="text-3xl font-serif-luxury font-bold text-[#173C32]">
                Syarat dan Ketentuan Layanan CleanHome
              </h1>
              <p className="text-xs text-[#68756D]">
                Terakhir diperbarui: Oktober 2026
              </p>
            </div>

            <div className="space-y-6 text-sm text-[#24332A] leading-relaxed">
              <section className="space-y-2">
                <h2 className="text-lg font-bold text-[#173C32]">1. Ketentuan Umum</h2>
                <p>
                  Dengan mendaftar akun atau memesan layanan melalui CleanHome, Anda menyetujui untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak menyetujui salah satu poin ketentuan, Anda tidak diperkenankan menggunakan layanan platform kami.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-bold text-[#173C32]">2. Akun Pelanggan</h2>
                <p>
                  Pelanggan bertanggung jawab untuk menjaga kerahasiaan kata sandi akun dan aktivitas yang dilakukan melalui akun tersebut. Setiap informasi yang didaftarkan (nama, email, nomor telepon, alamat) harus akurat dan benar.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-bold text-[#173C32]">3. Prosedur Reservasi & Tarif</h2>
                <p>
                  Tarif layanan yang tertera pada saat reservasi dikonfirmasi adalah tarif tetap yang dicatat dalam snapshot transaksi database. Jadwal reservasi tidak dapat dipilih di masa lampau dan tunduk pada ketersediaan tim kebersihan CleanHome.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-bold text-[#173C32]">4. Kebijakan Pembatalan</h2>
                <p>
                  Pelanggan dapat melakukan pembatalan reservasi melalui dashboard akun secara mandiri selama status reservasi masih berada dalam status <strong className="text-[#173C32]">Menunggu (Pending)</strong> atau <strong className="text-[#173C32]">Dikonfirmasi (Confirmed)</strong>. Reservasi yang telah berjalan atau selesai tidak dapat dibatalkan.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-bold text-[#173C32]">5. Batasan Tanggung Jawab</h2>
                <p>
                  CleanHome berkomitmen memberikan layanan kebersihan terbaik dan menjaga integritas hunian pelanggan. Pelanggan diimbau untuk mengamankan barang berharga dan dokumen sensitif sebelum tim kebersihan tiba di lokasi layanan.
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
