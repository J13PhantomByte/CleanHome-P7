import React, { useEffect, useState } from 'react';
import { getActiveServices } from '../features/bookings/bookingService';
import { formatRupiah } from '../lib/supabase';
import { Service } from '../types';
import { ServiceGraphic } from '../components/common/ServiceGraphic';
import { BookingModal } from '../components/bookings/BookingModal';
import { Search, Clock, ArrowRight, Info } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [detailService, setDetailService] = useState<Service | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchServices = async () => {
      setIsLoading(true);
      const res = await getActiveServices();
      if (mounted) {
        setServices(res.data);
        setIsLoading(false);
      }
    };
    fetchServices();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredServices = services.filter((service) => {
    const matchesCategory =
      selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenBooking = (service: Service) => {
    setSelectedService(service);
    setIsBookingModalOpen(true);
    setDetailService(null);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 bg-white rounded-2xl border border-[#285A43]/10 shadow-xs">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#285A43]">
            Katalog Layanan & Tarif Indonesia
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#173C32]">
            Daftar Layanan Kebersihan
          </h1>
          <p className="text-xs sm:text-sm text-[#68756D]">
            Tarif standar berkisar Rp 60.000 sampai Rp 180.000 per jam, dan deep cleaning mulai Rp 15.000 sampai Rp 35.000 per meter persegi.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari jenis pembersihan..."
            className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F1] border border-[#285A43]/20 rounded-xl focus-clean placeholder:text-[#68756D]/60"
          />
          <Search className="w-4 h-4 text-[#68756D] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors focus-clean ${
            selectedCategory === 'all'
              ? 'bg-[#285A43] text-white shadow-2xs'
              : 'bg-white text-[#68756D] border border-[#285A43]/10 hover:text-[#173C32]'
          }`}
        >
          Semua Layanan ({services.length})
        </button>
        <button
          onClick={() => setSelectedCategory('residential')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors focus-clean ${
            selectedCategory === 'residential'
              ? 'bg-[#285A43] text-white shadow-2xs'
              : 'bg-white text-[#68756D] border border-[#285A43]/10 hover:text-[#173C32]'
          }`}
        >
          Hunian & Kamar
        </button>
        <button
          onClick={() => setSelectedCategory('specialized')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors focus-clean ${
            selectedCategory === 'specialized'
              ? 'bg-[#285A43] text-white shadow-2xs'
              : 'bg-white text-[#68756D] border border-[#285A43]/10 hover:text-[#173C32]'
          }`}
        >
          Area Khusus (Dapur & Toilet)
        </button>
        <button
          onClick={() => setSelectedCategory('deep-cleaning')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors focus-clean ${
            selectedCategory === 'deep-cleaning'
              ? 'bg-[#285A43] text-white shadow-2xs'
              : 'bg-white text-[#68756D] border border-[#285A43]/10 hover:text-[#173C32]'
          }`}
        >
          Deep Cleaning Borongan
        </button>
      </div>

      {/* Services Grid in Rupiah */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-white rounded-2xl border border-[#285A43]/10 animate-pulse" />
          ))}
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#285A43]/10 space-y-2">
          <p className="text-base font-semibold text-[#173C32]">Tidak ada layanan yang sesuai</p>
          <p className="text-xs text-[#68756D]">
            Silakan ganti kata kunci pencarian atau reset filter kategori.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="clean-card overflow-hidden flex flex-col justify-between"
            >
              <div>
                <ServiceGraphic slug={service.slug} name={service.name} className="h-44" />
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#68756D]">
                    <span className="capitalize">{service.category === 'residential' ? 'Hunian' : service.category === 'specialized' ? 'Area Khusus' : 'Pembersihan Total'}</span>
                    <span className="num-tabular font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#285A43]" />
                      {service.duration_minutes} Menit
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-serif-luxury text-[#173C32]">
                    {service.name}
                  </h3>

                  <p className="text-xs text-[#68756D] leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-3 border-t border-[#285A43]/10 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#68756D] block">Tarif Mulai</span>
                  <span className="text-xl font-bold text-[#285A43] num-tabular">
                    {formatRupiah(service.price)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDetailService(service)}
                    className="p-2 text-xs font-semibold text-[#173C32] hover:bg-[#FAF8F1] border border-[#285A43]/15 rounded-xl transition-all focus-clean"
                    title="Lihat rincian paket"
                  >
                    <Info className="w-4 h-4 text-[#285A43]" />
                  </button>
                  <button
                    onClick={() => handleOpenBooking(service)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#285A43] hover:bg-[#173C32] rounded-xl transition-all shadow-sm focus-clean flex items-center gap-1.5"
                  >
                    <span>Pesan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal in Rupiah */}
      {detailService && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#285A43]/15 overflow-hidden">
            <ServiceGraphic slug={detailService.slug} name={detailService.name} className="h-44" />
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#285A43]">
                  Rincian Spesifikasi Layanan
                </span>
                <h3 className="text-xl font-bold font-serif-luxury text-[#173C32]">
                  {detailService.name}
                </h3>
              </div>

              <p className="text-xs text-[#24332A] leading-relaxed">
                {detailService.description}
              </p>

              <div className="p-4 bg-[#FAF8F1] rounded-xl space-y-2 text-xs border border-[#285A43]/10">
                <div className="flex justify-between">
                  <span className="text-[#68756D]">Kategori:</span>
                  <span className="font-semibold text-[#173C32] capitalize">{detailService.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68756D]">Estimasi Durasi:</span>
                  <span className="font-semibold text-[#173C32] num-tabular">{detailService.duration_minutes} Menit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68756D]">Ketersediaan:</span>
                  <span className="font-semibold text-[#237A4B]">Aktif Tersedia</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#285A43]/10">
                  <span className="text-[#68756D]">Tarif Tetap:</span>
                  <span className="font-bold text-base text-[#285A43] num-tabular">
                    {formatRupiah(detailService.price)}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  onClick={() => setDetailService(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#68756D] hover:text-[#173C32]"
                >
                  Tutup
                </button>
                <button
                  onClick={() => handleOpenBooking(detailService)}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#285A43] hover:bg-[#173C32] rounded-xl shadow-sm focus-clean"
                >
                  Jadwalkan Layanan Ini
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        service={selectedService}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
};
