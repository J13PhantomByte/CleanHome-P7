import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { forgotPasswordSchema } from '../schemas';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = forgotPasswordSchema.safeParse({ email });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || 'Email tidak valid');
      return;
    }

    setIsSubmitting(true);
    await requestPasswordReset(email);
    setIsSubmitting(false);
    // Always show neutral confirmation to prevent email enumeration
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F1] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3 text-2xl font-serif-luxury font-bold text-[#173C32] focus-clean">
          <img
            src="/assets/aistudio/logo_d6f115d4.png"
            alt="CleanHome"
            className="w-11 h-11 object-contain"
          />
          <span>CleanHome</span>
        </Link>
        <h2 className="mt-4 text-2xl sm:text-3xl font-serif-luxury font-bold text-[#173C32]">
          Pemulihan Kata Sandi
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#68756D]">
          Masukkan alamat email akun Anda untuk menerima instruksi pengaturan ulang kata sandi.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl shadow-sm border border-[#285A43]/10 space-y-6">
          {isSubmitted ? (
            <div className="py-4 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#237A4B]/10 text-[#237A4B] flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#173C32]">Instruksi Terkirim</h3>
                <p className="text-xs text-[#68756D] leading-relaxed">
                  Jika alamat email tersebut terdaftar dalam sistem CleanHome, kami telah mengirimkan tautan pemulihan kata sandi. Silakan periksa folder inbox dan spam Anda.
                </p>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#285A43] hover:bg-[#173C32] rounded-xl transition-all shadow-sm focus-clean"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Halaman Masuk</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p className="p-3 rounded-lg bg-[#B42318]/10 text-xs text-[#B42318]">
                  {error}
                </p>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#24332A] mb-1">
                  Alamat Email Terdaftar
                </label>
                <div className="relative">
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#285A43]/20 bg-white focus-clean pl-10"
                    required
                  />
                  <Mail className="w-4 h-4 text-[#68756D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#285A43] hover:bg-[#173C32] rounded-xl transition-all shadow-sm focus-clean disabled:opacity-50"
              >
                {isSubmitting ? 'Mengirimkan Tautan...' : 'Kirim Tautan Pemulihan'}
              </button>

              <div className="pt-2 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-[#68756D] hover:text-[#173C32]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali ke Halaman Masuk</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
