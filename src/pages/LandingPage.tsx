import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/navigation/Footer';
import { ServiceGraphic } from '../components/common/ServiceGraphic';
import { CleanerVisual } from '../components/common/CleanerVisual';
import { BookingModal } from '../components/bookings/BookingModal';
import { getActiveServices } from '../features/bookings/bookingService';
import { formatRupiah } from '../lib/supabase';
import { useAuth } from '../features/auth/AuthContext';
import { Service } from '../types';
import {
  ArrowRight,
  CalendarCheck,
  Clock,
  Shield,
  Check,
  Search,
  Sparkles,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    let mounted = true;
    const loadServices = async () => {
      setIsLoadingServices(true);
      const res = await getActiveServices();
      if (mounted) {
        setServices(res.data);
        setIsLoadingServices(false);
      }
    };
    loadServices();
    return () => {
      mounted = false;
    };
  }, []);

  const handleStartBooking = (service: Service) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedService(service);
    setIsBookingModalOpen(true);
  };

  const filteredServices = categoryFilter === 'all'
    ? services
    : services.filter((s) => s.category === categoryFilter);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F1]">
      <Navbar />

      <main className="flex-1">
        {/* =========================================================================
            HERO SECTION with Person Cleaning Visual & Indonesian Market Rates
            ========================================================================= */}
        <section className="relative overflow-hidden pt-10 pb-20 md:pt-16 md:pb-28">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#A6C7A5]/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#285A43]/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Indonesian Value Proposition */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#285A43]/10 text-[#285A43] text-xs font-semibold">
                  <img
                    src="/assets/aistudio/logo_d6f115d4.png"
                    alt="CleanHome"
                    className="w-4 h-4 object-contain"
                  />
                  <span>Jasa Kebersihan Hunian Profesional Indonesia</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-luxury font-bold text-[#173C32] tracking-tight leading-[1.15]">
                  Hunian Bersih Menyeluruh, <br />
                  <span className="italic text-[#285A43]">Keseharian Lebih Nyaman.</span>
                </h1>

                <p className="text-base sm:text-lg text-[#68756D] leading-relaxed max-w-xl">
                  Nikmati suasana rumah dan apartemen yang bersih, sehat, dan segar tanpa repot. CleanHome memudahkan Anda memesan petugas kebersihan terlatih dengan tarif transparan mulai Rp 65.000 per jam, jadwal fleksibel, dan konfirmasi reservasi cepat.
                </p>

                {/* CTAs */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <a
                    href="#layanan"
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-[#285A43] hover:bg-[#173C32] rounded-xl transition-all shadow-sm focus-clean"
                  >
                    <span>Pilih Layanan & Reservasi</span>
                    <ArrowRight className="w-4 h-4 text-[#A6C7A5]" />
                  </a>
                  <Link
                    to={user ? '/dashboard' : '/register'}
                    className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-[#173C32] bg-white hover:bg-[#FAF8F1] border border-[#285A43]/20 rounded-xl transition-all focus-clean"
                  >
                    <span>{user ? 'Buka Dashboard Pelanggan' : 'Daftar Akun Pelanggan'}</span>
                  </Link>
                </div>

                {/* Verified Practical Market Pricing Highlights */}
                <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#285A43]/10 text-xs text-[#24332A]">
                  <div className="p-3 bg-white rounded-xl border border-[#285A43]/10 space-y-1">
                    <p className="font-bold text-[#173C32] text-sm">Layanan Standar</p>
                    <p className="text-[#68756D]">Rp 60.000 sampai Rp 180.000 per jam</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#285A43]/10 space-y-1">
                    <p className="font-bold text-[#173C32] text-sm">Deep Cleaning</p>
                    <p className="text-[#68756D]">Rp 15.000 sampai Rp 35.000 per m²</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#285A43]/10 space-y-1">
                    <p className="font-bold text-[#173C32] text-sm">Paket Borongan</p>
                    <p className="text-[#68756D]">Pembersihan total hingga Rp 4.000.000+</p>
                  </div>
                </div>
              </div>

              {/* Right Column: User-Requested Person Cleaning Visual Asset */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border border-[#285A43]/15 shadow-xl bg-white p-2">
                  <CleanerVisual className="h-full min-h-[380px]" />
                  <div className="mt-2 p-3 bg-[#FAF8F1] rounded-xl border border-[#285A43]/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#237A4B]" />
                      <span className="font-medium text-[#173C32]">Petugas Siap Bertugas</span>
                    </div>
                    <span className="text-[#68756D]">Peralatan & Cairan Ramah Lingkungan</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SERVICES SECTION (Rupiah Pricing)
            ========================================================================= */}
        <section id="layanan" className="py-20 bg-white border-y border-[#285A43]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#285A43]">
                  Pilihan Paket & Tarif Resmi Indonesia
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#173C32] mt-1">
                  Katalog Layanan Kebersihan
                </h2>
                <p className="text-sm text-[#68756D] mt-2 max-w-xl">
                  Seluruh tarif tertera transparan dalam Rupiah tanpa biaya siluman. Biaya dikunci langsung dalam database saat konfirmasi reservasi.
                </p>
              </div>

              {/* Segmented Category Filter */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#FAF8F1] rounded-xl border border-[#285A43]/10 shrink-0">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    categoryFilter === 'all'
                      ? 'bg-[#285A43] text-white shadow-xs'
                      : 'text-[#68756D] hover:text-[#173C32]'
                  }`}
                >
                  Semua Layanan
                </button>
                <button
                  onClick={() => setCategoryFilter('residential')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    categoryFilter === 'residential'
                      ? 'bg-[#285A43] text-white shadow-xs'
                      : 'text-[#68756D] hover:text-[#173C32]'
                  }`}
                >
                  Hunian & Kamar
                </button>
                <button
                  onClick={() => setCategoryFilter('specialized')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    categoryFilter === 'specialized'
                      ? 'bg-[#285A43] text-white shadow-xs'
                      : 'text-[#68756D] hover:text-[#173C32]'
                  }`}
                >
                  Area Khusus (Dapur & Toilet)
                </button>
                <button
                  onClick={() => setCategoryFilter('deep-cleaning')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    categoryFilter === 'deep-cleaning'
                      ? 'bg-[#285A43] text-white shadow-xs'
                      : 'text-[#68756D] hover:text-[#173C32]'
                  }`}
                >
                  Deep Cleaning Borongan
                </button>
              </div>
            </div>

            {/* Service Cards Grid in Rupiah */}
            {isLoadingServices ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="rounded-2xl border border-[#285A43]/10 overflow-hidden animate-pulse">
                    <div className="h-48 bg-[#EFECE6]" />
                    <div className="p-6 space-y-3">
                      <div className="h-5 bg-[#EFECE6] rounded w-2/3" />
                      <div className="h-4 bg-[#EFECE6] rounded w-full" />
                      <div className="pt-4 flex justify-between items-center">
                        <div className="h-6 bg-[#EFECE6] rounded w-24" />
                        <div className="h-8 bg-[#EFECE6] rounded w-28" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="p-12 text-center bg-[#FAF8F1] rounded-2xl border border-[#285A43]/10">
                <p className="text-base font-semibold text-[#173C32]">
                  Layanan pada kategori ini sedang tidak tersedia.
                </p>
                <p className="text-xs text-[#68756D] mt-1">
                  Silakan pilih filter lain atau hubungi dukungan CleanHome.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className="clean-card flex flex-col justify-between overflow-hidden group"
                  >
                    <div>
                      {/* Resilient Organic Graphic */}
                      <ServiceGraphic slug={service.slug} name={service.name} className="h-48" />

                      <div className="p-6 space-y-3">
                        <div className="flex items-center justify-between text-xs text-[#68756D]">
                          <span className="capitalize">{service.category === 'residential' ? 'Hunian' : service.category === 'specialized' ? 'Area Khusus' : 'Pembersihan Total'}</span>
                          <span className="num-tabular font-medium">{service.duration_minutes} Menit</span>
                        </div>

                        <h3 className="text-xl font-bold font-serif-luxury text-[#173C32] group-hover:text-[#285A43] transition-colors">
                          {service.name}
                        </h3>

                        <p className="text-xs text-[#68756D] leading-relaxed line-clamp-3">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-3 border-t border-[#285A43]/10 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-[#68756D] block">Mulai Dari</span>
                        <span className="text-xl font-bold text-[#285A43] num-tabular">
                          {formatRupiah(service.price)}
                        </span>
                      </div>

                      <button
                        onClick={() => handleStartBooking(service)}
                        className="px-4 py-2 text-xs font-semibold text-white bg-[#285A43] hover:bg-[#173C32] rounded-xl transition-all shadow-sm focus-clean flex items-center gap-1.5"
                      >
                        <span>Pesan Sekarang</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* =========================================================================
            HOW IT WORKS (Indonesian)
            ========================================================================= */}
        <section id="cara-kerja" className="py-20 bg-[#FAF8F1]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#285A43]">
                Alur Pemesanan Praktis
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#173C32]">
                Tiga Langkah Mudah Menuju Rumah Bersih
              </h2>
              <p className="text-sm text-[#68756D]">
                Jadwalkan kunjungan tim kebersihan CleanHome dengan alur yang jelas dan terpercaya.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-white border border-[#285A43]/10 shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#285A43]/10 text-[#285A43] flex items-center justify-center font-bold text-lg font-serif-luxury">
                  01
                </div>
                <h3 className="text-lg font-bold text-[#173C32]">Pilih Paket Layanan</h3>
                <p className="text-xs text-[#68756D] leading-relaxed">
                  Tentukan jenis pembersihan sesuai kondisi rumah Anda, mulai dari pembersihan harian per jam hingga deep cleaning borongan.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-white border border-[#285A43]/10 shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#285A43]/10 text-[#285A43] flex items-center justify-center font-bold text-lg font-serif-luxury">
                  02
                </div>
                <h3 className="text-lg font-bold text-[#173C32]">Tentukan Jadwal & Alamat</h3>
                <p className="text-xs text-[#68756D] leading-relaxed">
                  Pilih tanggal pengerjaan di masa mendatang, tentukan jam kedatangan, dan masukkan alamat hunian Anda beserta catatan khusus.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-white border border-[#285A43]/10 shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#285A43]/10 text-[#285A43] flex items-center justify-center font-bold text-lg font-serif-luxury">
                  03
                </div>
                <h3 className="text-lg font-bold text-[#173C32]">Pantau Melalui Dashboard</h3>
                <p className="text-xs text-[#68756D] leading-relaxed">
                  Cek status pengerjaan secara real-time, kelola riwayat pemesanan, atau batalkan jadwal secara mandiri jika diperlukan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            ABOUT SECTION
            ========================================================================= */}
        <section id="tentang" className="py-20 bg-white border-t border-[#285A43]/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#285A43]">
              Tentang CleanHome
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#173C32]">
              Solusi Kebersihan Hunian Modern di Indonesia
            </h2>
            <p className="text-sm sm:text-base text-[#68756D] leading-relaxed">
              CleanHome dirancang khusus untuk memenuhi standar kebersihan keluarga Indonesia. Kami menghubungkan pemilik rumah dan apartemen dengan layanan kebersihan higienis yang menggunakan peralatan lengkap dan cairan pembersih berkualitas. Setiap transaksi dilindungi pencatatan harga tetap agar Anda merasa aman dan puas.
            </p>
          </div>
        </section>

        {/* =========================================================================
            FINAL CALL TO ACTION
            ========================================================================= */}
        <section id="kontak" className="py-20 bg-gradient-to-br from-[#173C32] to-[#285A43] text-white relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative space-y-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#A6C7A5]">
              Mulai Hari Ini
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-white">
              Ingin Hunian Anda Kembali Bersih dan Segar?
            </h2>
            <p className="text-sm sm:text-base text-white/80 max-w-xl mx-auto leading-relaxed">
              Daftar akun sekarang dan jadwalkan kunjungan petugas kebersihan CleanHome sesuai waktu luang Anda.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={user ? '/dashboard' : '/register'}
                className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-[#173C32] bg-white hover:bg-[#FAF8F1] rounded-xl transition-all shadow-md focus-clean"
              >
                {user ? 'Buka Dashboard Reservasi' : 'Daftar Akun Pelanggan'}
              </Link>
              <a
                href="#layanan"
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all focus-clean"
              >
                Lihat Rincian Tarif
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Booking Modal */}
      <BookingModal
        service={selectedService}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
};
