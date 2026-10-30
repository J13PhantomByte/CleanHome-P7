import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { resetPasswordSchema } from '../schemas';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setErrors({});

    const validation = resetPasswordSchema.safeParse({ password, confirmPassword });
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
    const result = await updatePassword(password);
    setIsSubmitting(false);

    if (result.error) {
      setServerError(result.error);
      return;
    }

    setIsSuccess(true);
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
          Atur Ulang Kata Sandi
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#68756D]">
          Masukkan kata sandi baru untuk akun CleanHome Anda.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl shadow-sm border border-[#285A43]/10 space-y-6">
          {isSuccess ? (
            <div className="py-4 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#237A4B]/10 text-[#237A4B] flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#173C32]">Kata Sandi Berhasil Diperbarui</h3>
                <p className="text-xs text-[#68756D]">
                  Anda sekarang dapat menggunakan kata sandi baru untuk masuk ke dashboard CleanHome.
                </p>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#285A43] hover:bg-[#173C32] rounded-xl transition-all shadow-sm focus-clean"
              >
                Masuk ke Akun
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

              <div>
                <label className="block text-xs font-semibold text-[#24332A] mb-1">
                  Kata Sandi Baru
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#68756D] hover:text-[#173C32]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-[#B42318]">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#24332A] mb-1">
                  Konfirmasi Kata Sandi Baru
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#285A43] hover:bg-[#173C32] rounded-xl transition-all shadow-sm focus-clean disabled:opacity-50"
              >
                {isSubmitting ? 'Memperbarui Kata Sandi...' : 'Perbarui Kata Sandi'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
