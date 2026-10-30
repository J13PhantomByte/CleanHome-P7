import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { loginSchema } from '../schemas';
import { Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { signIn, loginAsDemoUser, isConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setErrors({});

    const validation = loginSchema.safeParse({ email, password });
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
    const result = await signIn(email, password);
    setIsSubmitting(false);

    if (result.error) {
      setServerError(result.error);
      return;
    }

    navigate(from, { replace: true });
  };

  const handleDemoLogin = () => {
    loginAsDemoUser();
    navigate('/dashboard', { replace: true });
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
          Masuk ke Akun Anda
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#68756D]">
          Kelola reservasi pembersihan hunian dan riwayat layanan Anda.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl shadow-sm border border-[#285A43]/10 space-y-6">
          {/* Quick Demo Mode Banner */}
          {!isConfigured && (
            <div className="p-3.5 rounded-xl bg-[#285A43]/10 border border-[#285A43]/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#173C32]">
                <ShieldCheck className="w-4 h-4 text-[#285A43]" />
                <span>Mode Demonstrasi & Evaluasi Aktif</span>
              </div>
              <p className="text-[11px] text-[#68756D] leading-tight">
                Anda dapat menggunakan akun demo langsung atau mendaftarkan akun baru untuk menguji seluruh fungsionalitas.
              </p>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-2 px-3 text-xs font-semibold text-[#173C32] bg-white hover:bg-[#FAF8F1] border border-[#285A43]/20 rounded-lg transition-colors focus-clean shadow-2xs"
              >
                Gunakan Akun Demo (Sarah Jenkins)
              </button>
            </div>
          )}

          {serverError && (
            <div className="p-3.5 rounded-xl bg-[#B42318]/10 border border-[#B42318]/20 flex items-start gap-2.5 text-xs text-[#B42318]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#24332A]">Kata Sandi</label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#285A43] hover:underline focus-clean"
                >
                  Lupa kata sandi?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#285A43] hover:bg-[#173C32] rounded-xl transition-all shadow-sm focus-clean flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Memverifikasi...' : 'Masuk ke Akun'}</span>
              <ArrowRight className="w-4 h-4 text-[#A6C7A5]" />
            </button>
          </form>

          {/* Registration Link */}
          <div className="pt-4 border-t border-[#285A43]/10 text-center text-xs text-[#68756D]">
            Belum memiliki akun CleanHome?{' '}
            <Link to="/register" className="font-semibold text-[#285A43] hover:underline focus-clean">
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
