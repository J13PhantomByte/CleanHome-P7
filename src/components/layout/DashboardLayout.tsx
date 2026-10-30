import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import {
  LayoutDashboard,
  Sparkle,
  CalendarCheck,
  User,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Database,
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user, profile, signOut, isConfigured } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navItems = [
    { label: 'Ringkasan', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Jelajah Layanan & Tarif', href: '/dashboard/services', icon: Sparkle },
    { label: 'Reservasi Saya', href: '/dashboard/bookings', icon: CalendarCheck },
    { label: 'Profil Saya', href: '/dashboard/profile', icon: User },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
    navigate('/');
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Pelanggan';

  return (
    <div className="min-h-screen bg-[#FAF8F1] flex flex-col md:flex-row">
      {/* Desktop Sidebar (260px) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#285A43]/10 shrink-0 select-none">
        {/* Brand with User Logo */}
        <div className="h-20 px-6 flex items-center border-b border-[#285A43]/10">
          <Link to="/" className="flex items-center gap-3 text-xl font-serif-luxury font-bold text-[#173C32] focus-clean">
            <img
              src="/assets/aistudio/logo_d6f115d4.png"
              alt="CleanHome Logo"
              className="w-9 h-9 object-contain"
            />
            <span>CleanHome</span>
          </Link>
        </div>

        {/* User Card */}
        <div className="p-4 mx-3 my-4 rounded-xl bg-[#FAF8F1] border border-[#285A43]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#285A43] text-white flex items-center justify-center font-bold text-sm">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#173C32] truncate">{displayName}</p>
              <p className="text-xs text-[#68756D] truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#285A43] text-white shadow-sm'
                    : 'text-[#24332A] hover:bg-[#FAF8F1] hover:text-[#173C32]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#A6C7A5]' : 'text-[#68756D]'}`} />
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Database Status Indicator */}
        <div className="p-4 mx-3 mb-3 rounded-xl bg-[#F4F1EA] border border-[#285A43]/10 text-xs text-[#68756D] space-y-1.5">
          <div className="flex items-center justify-between font-medium text-[#173C32]">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#285A43]" />
              Database Provider
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#285A43]/10 text-[#285A43]">
              {isConfigured ? 'Supabase Live' : 'Mode Demo'}
            </span>
          </div>
          <p className="text-[11px] leading-tight">
            {isConfigured
              ? 'Terhubung aman ke Supabase PostgreSQL dengan RLS aktif.'
              : 'Konfigurasi .env.local untuk menghubungkan proyek Supabase Anda.'}
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#285A43]/10 space-y-2">
          <Link
            to="/"
            className="flex items-center justify-between px-3.5 py-2 text-xs font-medium text-[#68756D] hover:text-[#173C32] rounded-lg hover:bg-[#FAF8F1]"
          >
            <span>Kembali ke Beranda</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-[#B42318] hover:bg-[#B42318]/10 rounded-lg transition-colors focus-clean disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            <span>{isLoggingOut ? 'Keluar...' : 'Keluar Akun'}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-[#285A43]/10">
        <Link to="/" className="flex items-center gap-2.5 text-lg font-serif-luxury font-bold text-[#173C32]">
          <img
            src="/assets/aistudio/logo_d6f115d4.png"
            alt="CleanHome Logo"
            className="w-7 h-7 object-contain"
          />
          <span>CleanHome</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-[#24332A] hover:bg-[#FAF8F1] rounded-lg"
          aria-label={mobileMenuOpen ? 'Tutup navigasi' : 'Buka navigasi'}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#285A43]/10 p-4 space-y-3">
          <div className="pb-3 border-b border-[#285A43]/10">
            <p className="font-semibold text-sm text-[#173C32]">{displayName}</p>
            <p className="text-xs text-[#68756D]">{user?.email}</p>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-[#285A43] text-white' : 'text-[#24332A]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="pt-2 border-t border-[#285A43]/10 flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-medium text-[#68756D] py-1"
            >
              Kembali ke Beranda
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="text-left text-xs font-semibold text-[#B42318] py-1 flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar Akun</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
