import React, { useState, useEffect } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import { Service, Booking } from '../../types';
import { createBooking } from '../../features/bookings/bookingService';
import { bookingSchema } from '../../schemas';
import { formatRupiah } from '../../lib/supabase';
import { X, Calendar, Clock, MapPin, AlertCircle, CheckCircle } from 'lucide-react';

interface BookingModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess?: (newBooking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  service,
  isOpen,
  onClose,
  onBookingSuccess,
}) => {
  const { user, profile } = useAuth();
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('09:00');
  const [serviceAddress, setServiceAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);

  // Auto-populate address from customer profile when opened
  useEffect(() => {
    if (isOpen) {
      if (profile?.address) {
        setServiceAddress(profile.address);
      }
      // Set default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setScheduledDate(tomorrow.toISOString().split('T')[0]);
      setServerError(null);
      setSuccessBooking(null);
      setErrors({});
    }
  }, [isOpen, profile]);

  if (!isOpen || !service) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setServerError('Silakan masuk akun terlebih dahulu untuk melakukan reservasi.');
      return;
    }

    setServerError(null);
    setErrors({});

    // Client-side schema validation using Zod
    const validation = bookingSchema.safeParse({
      serviceId: service.id,
      scheduledDate,
      scheduledTime,
      serviceAddress,
      notes,
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    // Combine date and time to ISO string
    const combinedTimestamp = new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString();

    const result = await createBooking({
      userId: user.id,
      serviceId: service.id,
      scheduledAt: combinedTimestamp,
      serviceAddress,
      notes,
    });

    setIsSubmitting(false);

    if (result.error) {
      setServerError(result.error);
      return;
    }

    if (result.data) {
      setSuccessBooking(result.data);
      if (onBookingSuccess) {
        onBookingSuccess(result.data);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-[#285A43]/15 overflow-hidden">
        {/* Header with CleanHome Logo */}
        <div className="px-6 py-5 bg-[#FAF8F1] border-b border-[#285A43]/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/logo_d6f115d4.png"
              alt="CleanHome"
              className="w-8 h-8 object-contain"
            />
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#285A43] block">
                Reservasi Layanan Kebersihan
              </span>
              <h3 id="booking-modal-title" className="text-lg font-serif-luxury font-bold text-[#173C32]">
                {service.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#68756D] hover:text-[#173C32] hover:bg-[#285A43]/10 focus-clean"
            aria-label="Tutup formulir reservasi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {successBooking ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#237A4B]/10 text-[#237A4B] flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-[#173C32]">Reservasi Berhasil Diajukan!</h4>
                <p className="text-xs text-[#68756D] max-w-sm mx-auto">
                  Jadwal kunjungan kebersihan Anda telah dicatat dalam sistem dengan status{' '}
                  <span className="font-semibold text-[#285A43]">Menunggu Konfirmasi</span>.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F1] rounded-xl text-left text-xs space-y-2 border border-[#285A43]/10">
                <div className="flex justify-between">
                  <span className="text-[#68756D]">Paket Layanan:</span>
                  <span className="font-semibold text-[#173C32]">{service.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68756D]">Jadwal Kunjungan:</span>
                  <span className="font-semibold text-[#173C32] num-tabular">
                    {new Date(successBooking.scheduled_at).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}{' '}
                    pukul{' '}
                    {new Date(successBooking.scheduled_at).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    WIB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68756D]">Alamat Hunian:</span>
                  <span className="font-semibold text-[#173C32] text-right max-w-[220px] truncate">
                    {successBooking.service_address}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#285A43]/10">
                  <span className="text-[#68756D]">Tarif Terkunci (Snapshot):</span>
                  <span className="font-bold text-base text-[#285A43] num-tabular">
                    {formatRupiah(successBooking.price_snapshot)}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 px-4 bg-[#285A43] text-white text-sm font-semibold rounded-xl hover:bg-[#173C32] transition-colors focus-clean shadow-sm"
              >
                Tutup & Lihat Riwayat Reservasi
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {serverError && (
                <div className="p-3.5 rounded-xl bg-[#B42318]/10 border border-[#B42318]/20 flex items-start gap-2.5 text-xs text-[#B42318]">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{serverError}</span>
                </div>
              )}

              {/* Service Price & Duration Summary in Rupiah */}
              <div className="p-3.5 rounded-xl bg-[#FAF8F1] border border-[#285A43]/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#68756D]">Perkiraan Durasi:</span>{' '}
                  <span className="font-semibold text-[#173C32] num-tabular">{service.duration_minutes} Menit</span>
                </div>
                <div>
                  <span className="text-[#68756D]">Tarif Layanan:</span>{' '}
                  <span className="font-bold text-base text-[#285A43] num-tabular">
                    {formatRupiah(service.price)}
                  </span>
                </div>
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#24332A] mb-1">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#285A43]" />
                      Tanggal Kunjungan
                    </span>
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#285A43]/20 bg-white focus-clean"
                    required
                  />
                  {errors.scheduledDate && (
                    <p className="mt-1 text-xs text-[#B42318]">{errors.scheduledDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#24332A] mb-1">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#285A43]" />
                      Jam Kedatangan Petugas
                    </span>
                  </label>
                  <select
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#285A43]/20 bg-white focus-clean"
                  >
                    <option value="08:00">08:00 WIB (Sesi Pagi)</option>
                    <option value="09:00">09:00 WIB (Sesi Pagi)</option>
                    <option value="11:00">11:00 WIB (Sesi Siang)</option>
                    <option value="13:30">13:30 WIB (Sesi Siang)</option>
                    <option value="15:30">15:30 WIB (Sesi Sore)</option>
                  </select>
                  {errors.scheduledTime && (
                    <p className="mt-1 text-xs text-[#B42318]">{errors.scheduledTime}</p>
                  )}
                </div>
              </div>

              {/* Service Address */}
              <div>
                <label className="block text-xs font-semibold text-[#24332A] mb-1">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#285A43]" />
                    Alamat Lengkap Hunian
                  </span>
                </label>
                <textarea
                  rows={2}
                  value={serviceAddress}
                  onChange={(e) => setServiceAddress(e.target.value)}
                  placeholder="Nama jalan, nomor rumah atau apartemen, tower, lantai, patokan..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#285A43]/20 bg-white focus-clean"
                  required
                />
                {errors.serviceAddress && (
                  <p className="mt-1 text-xs text-[#B42318]">{errors.serviceAddress}</p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#24332A] mb-1">
                  Catatan Khusus untuk Petugas (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Ada hewan peliharaan, mohon fokus kerak di wastafel..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#285A43]/20 bg-white focus-clean"
                />
                {errors.notes && <p className="mt-1 text-xs text-[#B42318]">{errors.notes}</p>}
              </div>

              {/* Actions */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#285A43]/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-[#68756D] hover:text-[#173C32] rounded-lg focus-clean"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#285A43] hover:bg-[#173C32] rounded-xl transition-all focus-clean shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Memproses...' : 'Ajukan Reservasi Ini'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
