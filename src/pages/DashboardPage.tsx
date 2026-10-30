import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { getActiveServices, getUserBookings, cancelBooking } from '../features/bookings/bookingService';
import { formatRupiah } from '../lib/supabase';
import { Service, Booking } from '../types';
import { ServiceGraphic } from '../components/common/ServiceGraphic';
import { BookingModal } from '../components/bookings/BookingModal';
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  Plus,
  ArrowRight,
  MapPin,
  Calendar,
  XCircle,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);

  const customerName = profile?.full_name || user?.user_metadata?.full_name || 'Pelanggan';

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    const [servicesRes, bookingsRes] = await Promise.all([
      getActiveServices(),
      getUserBookings(user.id),
    ]);
    setServices(servicesRes.data);
    setBookings(bookingsRes.data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Derived stats strictly calculated from customer's actual authorized records
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
  const completedBookings = bookings.filter((b) => b.status === 'completed').length;
  const availableServices = services.filter((s) => s.is_active).length;

  const handleStartBooking = (service: Service) => {
    setSelectedService(service);
    setIsBookingModalOpen(true);
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!user) return;
    const confirmCancel = window.confirm(
      'Apakah Anda yakin ingin membatalkan jadwal reservasi ini?'
    );
    if (!confirmCancel) return;

    setCancellingBookingId(bookingId);
    await cancelBooking(bookingId, user.id);
    await loadData();
    setCancellingBookingId(null);
  };

  const recentBookings = bookings.slice(0, 3);

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#237A4B]/10 text-[#237A4B]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Dikonfirmasi
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-700">
            <Clock className="w-3.5 h-3.5" />
            Sedang Dikerjakan
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Selesai
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-red-50 text-[#B42318]">
            <XCircle className="w-3.5 h-3.5" />
            Dibatalkan
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#285A43]/10 text-[#285A43]">
            <Clock className="w-3.5 h-3.5" />
            Menunggu Konfirmasi
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 bg-white rounded-2xl border border-[#285A43]/10 shadow-xs">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#285A43]">
            Portal Pelanggan CleanHome
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#173C32]">
            Selamat Datang, {customerName}!
          </h1>
          <p className="text-xs sm:text-sm text-[#68756D]">
            Siap menikmati hunian yang bersih, rapi, dan nyaman hari ini?
          </p>
        </div>

        <button
          onClick={() => {
            if (services.length > 0) handleStartBooking(services[0]);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-[#285A43] hover:bg-[#173C32] rounded-xl transition-all shadow-sm focus-clean whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4 text-[#A6C7A5]" />
          <span>Buat Reservasi Baru</span>
        </button>
      </div>

      {/* Dashboard Overview Metrics in Rupiah context */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-[#285A43]/10 shadow-2xs space-y-2">
          <span className="text-xs font-medium text-[#68756D]">Total Reservasi Saya</span>
          <p className="text-3xl font-bold font-serif-luxury text-[#173C32] num-tabular">
            {totalBookings}
          </p>
          <p className="text-[11px] text-[#68756D]">Sepanjang riwayat akun</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#285A43]/10 shadow-2xs space-y-2">
          <span className="text-xs font-medium text-[#68756D]">Menunggu Konfirmasi</span>
          <p className="text-3xl font-bold font-serif-luxury text-[#285A43] num-tabular">
            {pendingBookings}
          </p>
          <p className="text-[11px] text-[#68756D]">Jadwal menunggu petugas</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#285A43]/10 shadow-2xs space-y-2">
          <span className="text-xs font-medium text-[#68756D]">Layanan Selesai</span>
          <p className="text-3xl font-bold font-serif-luxury text-[#237A4B] num-tabular">
            {completedBookings}
          </p>
          <p className="text-[11px] text-[#68756D]">Pembersihan tuntas</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#285A43]/10 shadow-2xs space-y-2">
          <span className="text-xs font-medium text-[#68756D]">Katalog Layanan</span>
          <p className="text-3xl font-bold font-serif-luxury text-[#173C32] num-tabular">
            {availableServices}
          </p>
          <p className="text-[11px] text-[#68756D]">Paket aktif dari database</p>
        </div>
      </div>

      {/* Recent Bookings Section */}
      <div className="p-6 sm:p-8 bg-white rounded-2xl border border-[#285A43]/10 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif-luxury font-bold text-[#173C32]">
              Reservasi Terkini
            </h2>
            <p className="text-xs text-[#68756D]">
              Pantau jadwal kedatangan petugas dan status pengerjaan hunian Anda.
            </p>
          </div>
          <Link
            to="/dashboard/bookings"
            className="text-xs font-semibold text-[#285A43] hover:underline flex items-center gap-1 focus-clean"
          >
            <span>Semua Reservasi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 bg-[#FAF8F1] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : recentBookings.length === 0 ? (
          <div className="py-12 text-center bg-[#FAF8F1] rounded-xl border border-dashed border-[#285A43]/20 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#285A43]/10 text-[#285A43] flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[#173C32]">Belum Ada Reservasi Aktif</p>
              <p className="text-xs text-[#68756D] max-w-sm mx-auto">
                Anda belum memiliki pesanan aktif. Pilih salah satu layanan di bawah untuk memesan kunjungan kebersihan.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="p-4 sm:p-5 rounded-xl border border-[#285A43]/10 bg-[#FAF8F1]/50 hover:bg-[#FAF8F1] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm sm:text-base text-[#173C32]">
                      {booking.service?.name || 'Layanan Kebersihan'}
                    </span>
                    {getStatusBadge(booking.status)}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#68756D]">
                    <span className="flex items-center gap-1 num-tabular">
                      <Calendar className="w-3.5 h-3.5 text-[#285A43]" />
                      {new Date(booking.scheduled_at).toLocaleDateString('id-ID', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1 num-tabular">
                      <Clock className="w-3.5 h-3.5 text-[#285A43]" />
                      Pukul{' '}
                      {new Date(booking.scheduled_at).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      WIB
                    </span>
                    <span className="flex items-center gap-1 max-w-xs truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#285A43]" />
                      {booking.service_address}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#285A43]/10">
                  <span className="text-base font-bold text-[#285A43] num-tabular">
                    {formatRupiah(booking.price_snapshot)}
                  </span>

                  {(booking.status === 'pending' || booking.status === 'confirmed') && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={cancellingBookingId === booking.id}
                      className="text-xs font-semibold text-[#B42318] hover:text-[#912018] px-3 py-1.5 rounded-lg border border-[#B42318]/20 hover:bg-[#B42318]/10 transition-colors focus-clean disabled:opacity-50"
                    >
                      {cancellingBookingId === booking.id ? 'Membatalkan...' : 'Batalkan'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Services in Rupiah */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif-luxury font-bold text-[#173C32]">
              Rekomendasi Paket Layanan
            </h2>
            <p className="text-xs text-[#68756D]">
              Tarif transparan dalam Rupiah dengan durasi terencana.
            </p>
          </div>
          <Link
            to="/dashboard/services"
            className="text-xs font-semibold text-[#285A43] hover:underline flex items-center gap-1 focus-clean"
          >
            <span>Katalog Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.slice(0, 3).map((service) => (
            <div
              key={service.id}
              className="clean-card overflow-hidden flex flex-col justify-between"
            >
              <div>
                <ServiceGraphic slug={service.slug} name={service.name} className="h-40" />
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#68756D]">
                    <span className="capitalize">{service.category === 'residential' ? 'Hunian' : service.category === 'specialized' ? 'Area Khusus' : 'Pembersihan Total'}</span>
                    <span className="num-tabular">{service.duration_minutes} Menit</span>
                  </div>
                  <h3 className="font-bold text-base font-serif-luxury text-[#173C32]">
                    {service.name}
                  </h3>
                  <p className="text-xs text-[#68756D] line-clamp-2">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-[#285A43]/10 flex items-center justify-between">
                <span className="font-bold text-lg text-[#285A43] num-tabular">
                  {formatRupiah(service.price)}
                </span>
                <button
                  onClick={() => handleStartBooking(service)}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-[#285A43] hover:bg-[#173C32] rounded-xl transition-all shadow-sm focus-clean"
                >
                  Pesan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        service={selectedService}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onBookingSuccess={() => {
          loadData();
        }}
      />
    </div>
  );
};
