import React, { useEffect, useState } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { getUserBookings, cancelBooking, getActiveServices } from '../features/bookings/bookingService';
import { formatRupiah } from '../lib/supabase';
import { Booking, BookingStatus, Service } from '../types';
import { BookingModal } from '../components/bookings/BookingModal';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Plus,
} from 'lucide-react';

export const BookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelFeedback, setCancelFeedback] = useState<string | null>(null);

  // New Booking Modal state
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [selectedServiceForNew, setSelectedServiceForNew] = useState<Service | null>(null);

  const fetchAll = async () => {
    if (!user) return;
    setIsLoading(true);
    const [bRes, sRes] = await Promise.all([
      getUserBookings(user.id),
      getActiveServices(),
    ]);
    setBookings(bRes.data);
    setServices(sRes.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, [user]);

  const handleCancel = async (bookingId: string) => {
    if (!user) return;
    const confirmed = window.confirm(
      'Apakah Anda yakin ingin membatalkan jadwal reservasi ini?'
    );
    if (!confirmed) return;

    setCancellingId(bookingId);
    setCancelFeedback(null);
    const res = await cancelBooking(bookingId, user.id);
    setCancellingId(null);

    if (res.error) {
      setCancelFeedback(res.error);
    } else {
      setCancelFeedback('Reservasi berhasil dibatalkan.');
      fetchAll();
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking((prev) => (prev ? { ...prev, status: 'cancelled' } : null));
      }
    }
  };

  const filteredBookings = statusFilter === 'all'
    ? bookings
    : bookings.filter((b) => b.status === statusFilter);

  const getStatusBadge = (status: BookingStatus) => {
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

  const handleCreateNew = () => {
    if (services.length > 0) {
      setSelectedServiceForNew(services[0]);
      setIsNewBookingModalOpen(true);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 bg-white rounded-2xl border border-[#285A43]/10 shadow-xs">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#285A43]">
            Riwayat & Status Pengerjaan
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#173C32]">
            Reservasi Saya
          </h1>
          <p className="text-xs sm:text-sm text-[#68756D]">
            Daftar seluruh jadwal kunjungan kebersihan hunian yang pernah Anda ajukan.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-[#285A43] hover:bg-[#173C32] rounded-xl transition-all shadow-sm focus-clean whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4 text-[#A6C7A5]" />
          <span>Buat Reservasi Baru</span>
        </button>
      </div>

      {cancelFeedback && (
        <div className="p-4 rounded-xl bg-[#285A43]/10 border border-[#285A43]/20 flex items-center justify-between text-xs text-[#173C32]">
          <span>{cancelFeedback}</span>
          <button
            onClick={() => setCancelFeedback(null)}
            className="text-[#68756D] hover:text-[#173C32] font-semibold"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors focus-clean ${
            statusFilter === 'all'
              ? 'bg-[#285A43] text-white shadow-2xs'
              : 'bg-white text-[#68756D] border border-[#285A43]/10 hover:text-[#173C32]'
          }`}
        >
          Semua ({bookings.length})
        </button>
        <button
          onClick={() => setStatusFilter('pending')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors focus-clean ${
            statusFilter === 'pending'
              ? 'bg-[#285A43] text-white shadow-2xs'
              : 'bg-white text-[#68756D] border border-[#285A43]/10 hover:text-[#173C32]'
          }`}
        >
          Menunggu ({bookings.filter((b) => b.status === 'pending').length})
        </button>
        <button
          onClick={() => setStatusFilter('confirmed')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors focus-clean ${
            statusFilter === 'confirmed'
              ? 'bg-[#285A43] text-white shadow-2xs'
              : 'bg-white text-[#68756D] border border-[#285A43]/10 hover:text-[#173C32]'
          }`}
        >
          Dikonfirmasi ({bookings.filter((b) => b.status === 'confirmed').length})
        </button>
        <button
          onClick={() => setStatusFilter('completed')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors focus-clean ${
            statusFilter === 'completed'
              ? 'bg-[#285A43] text-white shadow-2xs'
              : 'bg-white text-[#68756D] border border-[#285A43]/10 hover:text-[#173C32]'
          }`}
        >
          Selesai ({bookings.filter((b) => b.status === 'completed').length})
        </button>
        <button
          onClick={() => setStatusFilter('cancelled')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors focus-clean ${
            statusFilter === 'cancelled'
              ? 'bg-[#285A43] text-white shadow-2xs'
              : 'bg-white text-[#68756D] border border-[#285A43]/10 hover:text-[#173C32]'
          }`}
        >
          Dibatalkan ({bookings.filter((b) => b.status === 'cancelled').length})
        </button>
      </div>

      {/* Bookings List in Rupiah */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-[#285A43]/10 animate-pulse" />
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#285A43]/10 space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF8F1] text-[#68756D] flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#173C32]">Tidak Ada Reservasi Ditemukan</h3>
            <p className="text-xs text-[#68756D] max-w-sm mx-auto">
              Tidak ada data reservasi dengan filter status yang dipilih.
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#285A43] hover:bg-[#173C32] rounded-xl shadow-sm focus-clean"
          >
            Pesan Layanan Sekarang
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="p-5 sm:p-6 bg-white rounded-2xl border border-[#285A43]/10 shadow-2xs hover:border-[#285A43]/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-base text-[#173C32]">
                    {b.service?.name || 'Layanan Pembersihan Rumah'}
                  </h3>
                  {getStatusBadge(b.status)}
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-[#68756D]">
                  <span className="flex items-center gap-1.5 num-tabular">
                    <Calendar className="w-3.5 h-3.5 text-[#285A43]" />
                    {new Date(b.scheduled_at).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1.5 num-tabular">
                    <Clock className="w-3.5 h-3.5 text-[#285A43]" />
                    Pukul{' '}
                    {new Date(b.scheduled_at).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    WIB
                  </span>
                  <span className="flex items-center gap-1.5 max-w-md truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#285A43]" />
                    {b.service_address}
                  </span>
                </div>

                {b.notes && (
                  <p className="text-xs text-[#24332A] bg-[#FAF8F1] px-3 py-1.5 rounded-lg border border-[#285A43]/10 max-w-xl">
                    <span className="font-semibold text-[#173C32]">Catatan:</span> {b.notes}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#285A43]/10">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-[#68756D] block">Snapshot Tarif</span>
                  <span className="text-lg font-bold text-[#285A43] num-tabular">
                    {formatRupiah(b.price_snapshot)}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedBooking(b)}
                  className="px-3.5 py-2 text-xs font-semibold text-[#173C32] bg-[#FAF8F1] hover:bg-[#EFECE6] border border-[#285A43]/15 rounded-xl transition-colors focus-clean"
                >
                  Rincian
                </button>

                {(b.status === 'pending' || b.status === 'confirmed') && (
                  <button
                    onClick={() => handleCancel(b.id)}
                    disabled={cancellingId === b.id}
                    className="px-3.5 py-2 text-xs font-semibold text-[#B42318] hover:bg-[#B42318]/10 border border-[#B42318]/20 rounded-xl transition-colors focus-clean disabled:opacity-50"
                  >
                    {cancellingId === b.id ? 'Memproses...' : 'Batalkan'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Detail Modal in Rupiah */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#285A43]/15 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#285A43]/10">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#285A43]">
                  Rincian Reservasi
                </span>
                <h3 className="text-lg font-bold font-serif-luxury text-[#173C32]">
                  {selectedBooking.service?.name || 'Layanan Kebersihan'}
                </h3>
              </div>
              <div>{getStatusBadge(selectedBooking.status)}</div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-[#FAF8F1]">
                <span className="text-[#68756D]">Kode Reservasi:</span>
                <span className="font-mono text-[#173C32]">{selectedBooking.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#FAF8F1]">
                <span className="text-[#68756D]">Jadwal Kunjungan:</span>
                <span className="font-semibold text-[#173C32] num-tabular">
                  {new Date(selectedBooking.scheduled_at).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#FAF8F1]">
                <span className="text-[#68756D]">Alamat Hunian:</span>
                <span className="font-semibold text-[#173C32] text-right max-w-[220px]">
                  {selectedBooking.service_address}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#FAF8F1]">
                <span className="text-[#68756D]">Waktu Diajukan:</span>
                <span className="font-mono text-[#68756D] num-tabular">
                  {new Date(selectedBooking.created_at).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-[#68756D]">Total Terkunci (Snapshot):</span>
                <span className="font-bold text-base text-[#285A43] num-tabular">
                  {formatRupiah(selectedBooking.price_snapshot)}
                </span>
              </div>
            </div>

            {selectedBooking.notes && (
              <div className="p-3 bg-[#FAF8F1] rounded-xl text-xs space-y-1 border border-[#285A43]/10">
                <span className="font-semibold text-[#173C32]">Catatan Khusus:</span>
                <p className="text-[#68756D]">{selectedBooking.notes}</p>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between border-t border-[#285A43]/10">
              {(selectedBooking.status === 'pending' || selectedBooking.status === 'confirmed') ? (
                <button
                  onClick={() => handleCancel(selectedBooking.id)}
                  disabled={cancellingId === selectedBooking.id}
                  className="px-3.5 py-2 text-xs font-semibold text-[#B42318] hover:bg-[#B42318]/10 rounded-lg transition-colors"
                >
                  {cancellingId === selectedBooking.id ? 'Memproses...' : 'Batalkan Reservasi'}
                </button>
              ) : (
                <div />
              )}
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#285A43] hover:bg-[#173C32] rounded-xl shadow-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Booking Modal */}
      <BookingModal
        service={selectedServiceForNew}
        isOpen={isNewBookingModalOpen}
        onClose={() => setIsNewBookingModalOpen(false)}
        onBookingSuccess={() => {
          fetchAll();
        }}
      />
    </div>
  );
};
