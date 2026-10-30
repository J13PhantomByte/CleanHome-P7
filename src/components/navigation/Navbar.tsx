import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { Menu, X, ArrowRight, UserCircle } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, profile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F1]/95 backdrop-blur-md border-b border-[#285A43]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Zone 1: Brand Wordmark with User Uploaded Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 text-2xl font-serif-luxury font-bold tracking-tight text-[#173C32] whitespace-nowrap shrink-0 focus-clean"
          >
            <img
              src="/assets/aistudio/logo_d6f115d4.png"
              alt="CleanHome Logo"
              className="w-10 h-10 object-contain drop-shadow-xs"
            />
            <span>CleanHome</span>
          </Link>

          {/* Zone 2: Navigation Links (Indonesian Language) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#24332A]">
            <Link to="/" className="hover:text-[#285A43] transition-colors whitespace-nowrap shrink-0">
              Beranda
            </Link>
            <a href="#layanan" className="hover:text-[#285A43] transition-colors whitespace-nowrap shrink-0">
              Layanan & Tarif
            </a>
            <a href="#cara-kerja" className="hover:text-[#285A43] transition-colors whitespace-nowrap shrink-0">
              Cara Pemesanan
            </a>
            <a href="#tentang" className="hover:text-[#285A43] transition-colors whitespace-nowrap shrink-0">
              Tentang Kami
            </a>
            <a href="#kontak" className="hover:text-[#285A43] transition-colors whitespace-nowrap shrink-0">
              Bantuan
            </a>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#285A43] hover:bg-[#173C32] rounded-xl transition-all shadow-sm focus-clean whitespace-nowrap shrink-0"
              >
                <UserCircle className="w-4 h-4 text-[#A6C7A5]" />
                <span>{profile?.full_name?.split(' ')[0] || 'Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-[#24332A] hover:text-[#285A43] transition-colors focus-clean whitespace-nowrap shrink-0"
                >
                  Masuk Akun
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-[#285A43] hover:bg-[#173C32] rounded-xl transition-all shadow-sm focus-clean whitespace-nowrap shrink-0"
                >
                  Daftar Sekarang
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#24332A] hover:bg-[#A6C7A5]/20 focus-clean"
              aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#285A43]/10 bg-[#FAF8F1] px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2 text-base font-medium text-[#24332A]">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/60"
            >
              Beranda
            </Link>
            <a
              href="#layanan"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/60"
            >
              Layanan & Tarif
            </a>
            <a
              href="#cara-kerja"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/60"
            >
              Cara Pemesanan
            </a>
            <a
              href="#tentang"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/60"
            >
              Tentang Kami
            </a>
            <a
              href="#kontak"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/60"
            >
              Bantuan
            </a>
          </nav>

          <div className="pt-4 border-t border-[#285A43]/10 flex flex-col gap-2.5">
            {user ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 text-sm font-semibold text-white bg-[#285A43] rounded-xl"
              >
                Masuk ke Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-medium text-[#24332A] border border-[#285A43]/20 rounded-xl bg-white"
                >
                  Masuk Akun
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold text-white bg-[#285A43] rounded-xl shadow-sm"
                >
                  Daftar Sekarang
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
