import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F1] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 flex items-center justify-center mb-6">
        <img
          src="/assets/aistudio/logo_d6f115d4.png"
          alt="CleanHome"
          className="w-16 h-16 object-contain"
        />
      </div>
      <span className="text-xs font-semibold uppercase tracking-wider text-[#285A43]">
        Halaman Tidak Ditemukan (404)
      </span>
      <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#173C32] mt-2 mb-4">
        Halaman yang Anda Cari Tidak Ada
      </h1>
      <p className="text-sm text-[#68756D] max-w-md mb-8">
        Halaman yang Anda tuju mungkin telah dipindahkan, dihapus, atau alamat URL yang dimasukkan salah.
      </p>

      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#285A43] hover:bg-[#173C32] rounded-xl transition-all shadow-sm focus-clean"
        >
          <Home className="w-4 h-4 text-[#A6C7A5]" />
          <span>Kembali ke Beranda</span>
        </Link>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#173C32] bg-white border border-[#285A43]/20 hover:bg-[#FAF8F1] rounded-xl transition-all focus-clean"
        >
          <span>Dashboard Pelanggan</span>
        </Link>
      </div>
    </div>
  );
};
