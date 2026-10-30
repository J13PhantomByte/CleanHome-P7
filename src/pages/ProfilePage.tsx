import React, { useState, useEffect } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { profileSchema } from '../schemas';
import { User, Mail, Phone, MapPin, CheckCircle, AlertCircle, Save, ShieldCheck } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, profile, updateProfile, isConfigured } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setAddress(profile.address || '');
    } else if (user?.user_metadata?.full_name) {
      setFullName(user.user_metadata.full_name);
    }
  }, [profile, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);
    setErrors({});

    const validation = profileSchema.safeParse({ fullName, phone, address });
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
    const result = await updateProfile({ fullName, phone, address });
    setIsSubmitting(false);

    if (result.error) {
      setServerError(result.error);
    } else {
      setSuccessMessage('Profil pelanggan berhasil diperbarui!');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 sm:p-8 bg-white rounded-2xl border border-[#285A43]/10 shadow-xs space-y-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#285A43]">
          Pengaturan Akun & Kontak
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#173C32]">
          Profil Pelanggan
        </h1>
        <p className="text-xs sm:text-sm text-[#68756D]">
          Kelola informasi nama pemesan, kontak telepon, dan alamat hunian default untuk reservasi kebersihan.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#285A43]/10 shadow-xs space-y-6">
        {successMessage && (
          <div className="p-4 rounded-xl bg-[#237A4B]/10 border border-[#237A4B]/20 flex items-center gap-2.5 text-xs text-[#237A4B]">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {serverError && (
          <div className="p-4 rounded-xl bg-[#B42318]/10 border border-[#B42318]/20 flex items-center gap-2.5 text-xs text-[#B42318]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email (Read-only Auth Boundary) */}
          <div>
            <label className="block text-xs font-semibold text-[#24332A] mb-1">
              Alamat Email (Akun Utama)
            </label>
            <div className="relative">
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#285A43]/10 bg-[#FAF8F1] text-[#68756D] pl-10 cursor-not-allowed select-none"
              />
              <Mail className="w-4 h-4 text-[#68756D] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <p className="mt-1 text-[11px] text-[#68756D]">
              Email terikat pada sesi Supabase Auth Anda dan hanya dapat diubah melalui prosedur verifikasi email resmi.
            </p>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-[#24332A] mb-1">
              Nama Lengkap Pemesan
            </label>
            <div className="relative">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nama Anda..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#285A43]/20 bg-white focus-clean pl-10"
                required
              />
              <User className="w-4 h-4 text-[#68756D] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {errors.fullName && <p className="mt-1 text-xs text-[#B42318]">{errors.fullName}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-[#24332A] mb-1">
              Nomor Telepon / WhatsApp
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contoh: +62 812-3456-7890"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#285A43]/20 bg-white focus-clean pl-10"
              />
              <Phone className="w-4 h-4 text-[#68756D] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {errors.phone && <p className="mt-1 text-xs text-[#B42318]">{errors.phone}</p>}
            <p className="mt-1 text-[11px] text-[#68756D]">
              Digunakan oleh tim kebersihan untuk koordinasi kedatangan di lokasi.
            </p>
          </div>

          {/* Default Address */}
          <div>
            <label className="block text-xs font-semibold text-[#24332A] mb-1">
              Alamat Hunian Default
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Nama jalan, nomor rumah, perumahan / apartemen, unit, lantai..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#285A43]/20 bg-white focus-clean"
              />
            </div>
            {errors.address && <p className="mt-1 text-xs text-[#B42318]">{errors.address}</p>}
            <p className="mt-1 text-[11px] text-[#68756D]">
              Alamat ini akan otomatis terisi saat Anda membuat jadwal reservasi baru.
            </p>
          </div>

          {/* RLS Security Trust Marker */}
          <div className="p-3.5 rounded-xl bg-[#FAF8F1] border border-[#285A43]/10 flex items-center gap-2.5 text-xs text-[#68756D]">
            <ShieldCheck className="w-4 h-4 text-[#285A43] shrink-0" />
            <span>
              Data profil Anda dilindungi oleh aturan PostgreSQL Row Level Security (RLS) dan hanya dapat dibaca oleh Anda sendiri.
            </span>
          </div>

          {/* Save Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#285A43] hover:bg-[#173C32] rounded-xl transition-all shadow-sm focus-clean disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-[#A6C7A5]" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
