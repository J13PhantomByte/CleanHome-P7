import React from 'react';

interface ServiceGraphicProps {
  slug: string;
  name: string;
  className?: string;
}

export const ServiceGraphic: React.FC<ServiceGraphicProps> = ({ slug, name, className = 'w-full h-48' }) => {
  switch (slug) {
    case 'general-home-cleaning':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#173C32] to-[#285A43] flex items-center justify-center p-6 ${className}`}>
          {/* Subtle architectural lines */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#A6C7A5_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative text-center text-white">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <svg className="w-8 h-8 text-[#A6C7A5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#A6C7A5]">Whole Home Care</span>
          </div>
        </div>
      );

    case 'deep-kitchen-cleaning':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#285A43] to-[#347355] flex items-center justify-center p-6 ${className}`}>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FAF8F1_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative text-center text-white">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <svg className="w-8 h-8 text-[#FAF8F1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#A6C7A5]">Kitchen & Degreasing</span>
          </div>
        </div>
      );

    case 'bathroom-sanitization':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#1E4D3B] to-[#285A43] flex items-center justify-center p-6 ${className}`}>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#A6C7A5_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative text-center text-white">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <svg className="w-8 h-8 text-[#A6C7A5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#FAF8F1]">Sanitized & Descaled</span>
          </div>
        </div>
      );

    case 'bedroom-linen-refresh':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#305F4A] to-[#1E4D3B] flex items-center justify-center p-6 ${className}`}>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#A6C7A5_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative text-center text-white">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <svg className="w-8 h-8 text-[#A6C7A5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#FAF8F1]">Fresh Linens & Air</span>
          </div>
        </div>
      );

    case 'living-room-carpet-care':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#244E3B] to-[#1B3F31] flex items-center justify-center p-6 ${className}`}>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#A6C7A5_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative text-center text-white">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <svg className="w-8 h-8 text-[#A6C7A5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#A6C7A5]">Living Spaces & Fabrics</span>
          </div>
        </div>
      );

    case 'full-move-in-deep-cleaning':
    default:
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#173C32] to-[#204E3F] flex items-center justify-center p-6 ${className}`}>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#A6C7A5_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative text-center text-white">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <svg className="w-8 h-8 text-[#A6C7A5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#FAF8F1]">Deep & Intensive</span>
          </div>
        </div>
      );
  }
};
