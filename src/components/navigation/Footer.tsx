import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Clock, ShieldCheck, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#173C32] text-[#FAF8F1] pt-16 pb-12 border-t border-[#285A43]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-white/10">
          {/* Brand & Purpose with Logo */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-3 text-2xl font-serif-luxury font-bold text-white focus-clean">
              <img
                src="/assets/aistudio/logo_d6f115d4.png"
                alt="CleanHome Logo"
                className="w-10 h-10 object-contain brightness-110"
              />
              <span>CleanHome</span>
            </Link>
            <p className="text-sm text-[#A6C7A5] leading-relaxed">
              Platform layanan kebersihan hunian profesional Indonesia. Menghadirkan kenyamanan, kesegaran menyeluruh, dan ketenangan pikiran untuk setiap keluarga.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A6C7A5] mb-4">
              Layanan & Pemesanan
            </h4>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>
                <a href="#layanan" className="hover:text-white transition-colors">
                  Daftar Layanan & Tarif
                </a>
              </li>
              <li>
                <a href="#cara-kerja" className="hover:text-white transition-colors">
                  Alur Pemesanan
                </a>
              </li>
              <li>
                <a href="#tentang" className="hover:text-white transition-colors">
                  Tentang CleanHome
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Portal Pelanggan
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A6C7A5] mb-4">
              Kebijakan & Privasi
            </h4>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Syarat & Ketentuan Layanan
                </Link>
              </li>
              <li className="flex items-center gap-2 text-xs text-[#A6C7A5] pt-2">
                <ShieldCheck className="w-4 h-4 text-[#A6C7A5]" />
                <span>Proteksi Data Pelanggan Aktif</span>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A6C7A5] mb-4">
              Layanan Bantuan Pelanggan
            </h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#A6C7A5] shrink-0" />
                <span>support@cleanhome.id</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#A6C7A5] shrink-0" />
                <span>0812-3456-7890 (WhatsApp)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#A6C7A5] shrink-0" />
                <span>Senin sampai Minggu: 08:00 sampai 18:00 WIB</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
          <p>© {new Date().getFullYear()} CleanHome Indonesia. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privasi</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
