import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { registerSchema } from '../schemas';
import { Eye, EyeOff, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setErrors({});

    const validation = registerSchema.safeParse({
      fullName,
      email,
      password,
      confirmPassword,
      termsAccepted,
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
    const result = await signUp(email, password, fullName);
    setIsSubmitting(false);

    if (result.error) {
      setServerError(result.error);
      return;
    }

    if (result.requiresVerification) {
      setNeedsVerification(true);
    } else {
      navigate('/dashboard', { replace: true });
    }
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
          Daftar Akun Baru
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#68756D]">
          Bergabunglah dengan CleanHome untuk kemudahan reservasi hunian bersih.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl shadow-sm border border-[#285A43]/10 space-y-6">
          {needsVerification ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#237A4B]/10 text-[#237A4B] flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-[#173C32]">Pendaftaran Berhasil!</h3>
                <p className="text-xs text-[#68756D] leading-relaxed">
                  Tautan konfirmasi telah dikirimkan ke <strong className="text-[#173C32]">{email}</strong>. Silakan periksa inbox email Anda untuk mengaktifkan akun sebelum masuk.
                </p>
              </div>
              <Link
                to="/login"
                className="inline-block w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#285A43] hover:bg-[#173C32] rounded-xl transition-all shadow-sm focus-clean"
              >
                Kembali ke Halaman Masuk
              </Link>
            </div>
          ) : (
            <>
              {serverError && (
                <div className="p-3.5 rounded-xl bg-[#B42318]/10 border border-[#B42318]/20 flex items-start gap-2.5 text-xs text-[#B42318]">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{serverError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#24332A] mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Sarah Jenkins"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#285A43]/20 bg-white focus-clean placeholder:text-[#68756D]/50"
                    required
                  />
                  {errors.fullName && <p className="mt-1 text-xs text-[#B42318]">{errors.fullName}</p>}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-xs font-semibold text-[#24332A] mb-1">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#285A43]/20 bg-white focus-clean placeholder:text-[#68756D]/50"
                    required
                  />
                  {errors.email && <p className="mt-1 text-xs text-[#B42318]">{errors.email}</p>}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-xs font-semibold text-[#24332A] mb-1">
                    Kata Sandi (Minimal 8 Karakter, 1 Huruf & 1 Angka)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#285A43]/20 bg-white focus-clean pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#68756D] hover:text-[#173C32] focus-clean"
                      aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-[#B42318]">{errors.password}</p>}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-xs font-semibold text-[#24332A] mb-1">
                    Konfirmasi Kata Sandi
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#285A43]/20 bg-white focus-clean"
                    required
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-[#B42318]">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Terms Acceptance */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-1 w-4 h-4 text-[#285A43] border-[#285A43]/30 rounded focus:ring-[#285A43]"
                    />
                    <span className="text-xs text-[#68756D] leading-relaxed">
                      Saya menyetujui{' '}
                      <Link to="/terms" target="_blank" className="text-[#285A43] underline font-medium">
                        Syarat & Ketentuan Layanan
                      </Link>{' '}
                      dan{' '}
                      <Link to="/privacy" target="_blank" className="text-[#285A43] underline font-medium">
                        Kebijakan Privasi
                      </Link>{' '}
                      CleanHome.
                    </span>
                  </label>
                  {errors.termsAccepted && (
                    <p className="mt-1 text-xs text-[#B42318]">{errors.termsAccepted}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#285A43] hover:bg-[#173C32] rounded-xl transition-all shadow-sm focus-clean flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Mendaftarkan Akun...' : 'Daftar Akun'}</span>
                  <ArrowRight className="w-4 h-4 text-[#A6C7A5]" />
                </button>
              </form>

              <div className="pt-4 border-t border-[#285A43]/10 text-center text-xs text-[#68756D]">
                Sudah memiliki akun CleanHome?{' '}
                <Link to="/login" className="font-semibold text-[#285A43] hover:underline focus-clean">
                  Masuk Sekarang
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
