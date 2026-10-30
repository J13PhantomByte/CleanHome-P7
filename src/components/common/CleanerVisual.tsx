import React from 'react';

interface CleanerVisualProps {
  className?: string;
}

export const CleanerVisual: React.FC<CleanerVisualProps> = ({ className = 'w-full h-full' }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#173C32] via-[#204A3B] to-[#2E6B52] p-6 text-white shadow-lg ${className}`}>
      {/* Subtle organic light circles */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#A6C7A5]/20 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-[#FAF8F1]/10 blur-2xl pointer-events-none" />

      {/* Modern Professional Cleaner Illustration */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[300px]">
        <svg
          viewBox="0 0 400 320"
          className="w-full max-w-[340px] drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Room Interior Details */}
          <rect x="30" y="40" width="100" height="120" rx="4" fill="#A6C7A5" fillOpacity="0.12" stroke="#A6C7A5" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="80" y1="40" x2="80" y2="160" stroke="#A6C7A5" strokeWidth="1.5" strokeOpacity="0.4" />
          <line x1="30" y1="100" x2="130" y2="100" stroke="#A6C7A5" strokeWidth="1.5" strokeOpacity="0.4" />

          {/* Plant on shelf */}
          <rect x="290" y="70" width="80" height="6" rx="3" fill="#A6C7A5" fillOpacity="0.5" />
          <path d="M320 70 L324 50 L336 50 L340 70 Z" fill="#E5E1D8" />
          <path d="M330 50 Q320 30 310 35 Q325 45 330 50 Z" fill="#237A4B" />
          <path d="M330 50 Q340 25 350 32 Q338 43 330 50 Z" fill="#347355" />
          <path d="M330 50 Q330 20 332 20 Q335 35 330 50 Z" fill="#A6C7A5" />

          {/* Sparkles / Clean Sheen */}
          <path d="M120 70 L123 78 L131 81 L123 84 L120 92 L117 84 L109 81 L117 78 Z" fill="#A6C7A5" />
          <path d="M260 110 L262 115 L267 117 L262 119 L260 124 L258 119 L253 117 L258 115 Z" fill="#FAF8F1" />
          <path d="M70 200 L72 205 L77 207 L72 209 L70 214 L68 209 L63 207 L68 205 Z" fill="#A6C7A5" />

          {/* Cleaner Person Body */}
          {/* Hair & Head */}
          <circle cx="200" cy="85" r="28" fill="#F4D3B4" />
          <path d="M174 80 C174 60 184 50 200 50 C216 50 226 60 226 80 C226 72 216 65 200 65 C184 65 174 72 174 80 Z" fill="#3D2314" />
          {/* Face details */}
          <path d="M192 84 Q195 86 198 84" stroke="#87532E" strokeWidth="2" strokeLinecap="round" />
          <path d="M205 84 Q208 86 211 84" stroke="#87532E" strokeWidth="2" strokeLinecap="round" />
          <path d="M197 96 Q201 100 206 96" stroke="#C86D51" strokeWidth="2" strokeLinecap="round" />

          {/* Neck & Collar */}
          <path d="M194 112 L206 112 L206 120 L194 120 Z" fill="#F4D3B4" />

          {/* Uniform Shirt & CleanHome Apron */}
          <path d="M165 124 C175 120 225 120 235 124 L245 220 L155 220 Z" fill="#285A43" />
          {/* White inner polo collar */}
          <path d="M190 122 L200 134 L210 122 Z" fill="#FFFFFF" />
          {/* Apron straps */}
          <path d="M180 122 L185 155 L215 155 L220 122 Z" fill="#347355" />
          {/* Apron Pocket with Logo Mini Leaf */}
          <rect x="185" y="170" width="30" height="28" rx="4" fill="#173C32" />
          <path d="M195 184 Q202 175 205 180 Q203 188 195 184 Z" fill="#A6C7A5" />

          {/* Left Arm holding Microfiber Cleaning Cloth */}
          <path d="M165 128 L140 160 L125 170" stroke="#285A43" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="123" cy="172" r="9" fill="#F4D3B4" />
          {/* Bright Yellow / Green Microfiber Cloth wiping surface */}
          <path d="M110 170 Q118 162 130 168 Q138 178 126 186 Q112 184 110 170 Z" fill="#FBBF24" />
          {/* Motion wipe arcs */}
          <path d="M102 162 Q112 155 120 158" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" />
          <path d="M100 178 Q108 172 116 174" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" />

          {/* Right Arm holding Eco Spray Bottle */}
          <path d="M235 128 L255 155 L270 165" stroke="#285A43" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="272" cy="167" r="9" fill="#F4D3B4" />
          {/* Spray Bottle */}
          <rect x="274" y="165" width="16" height="30" rx="3" fill="#A6C7A5" />
          <path d="M280 155 L284 155 L284 165 L280 165 Z" fill="#FFFFFF" />
          <path d="M284 157 L293 154 L293 161 Z" fill="#173C32" />
          <path d="M298 152 Q305 150 310 148" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="2 3" />
          <path d="M300 156 Q308 158 314 160" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="2 3" />

          {/* Table Surface Being Cleaned */}
          <path d="M40 220 L360 220 L370 235 L30 235 Z" fill="#EFECE6" />
          <rect x="30" y="235" width="340" height="10" fill="#D8D3C8" />
          {/* Table Legs */}
          <rect x="50" y="245" width="14" height="65" rx="2" fill="#87532E" />
          <rect x="336" y="245" width="14" height="65" rx="2" fill="#87532E" />

          {/* Cleaning Caddy / Bucket on floor */}
          <rect x="75" y="260" width="36" height="42" rx="4" fill="#347355" />
          <path d="M73 260 L113 260 L111 267 L75 267 Z" fill="#285A43" />
          <path d="M84 250 L84 260 L92 260 L92 250 Z" fill="#FAF8F1" />
          {/* Cleaning brush & spray in bucket */}
          <rect x="80" y="245" width="8" height="15" rx="2" fill="#F59E0B" />
          <rect x="98" y="240" width="7" height="20" rx="2" fill="#A6C7A5" />

          {/* High Gloss Reflection Line on Polished Floor */}
          <ellipse cx="200" cy="305" rx="140" ry="8" fill="#FFFFFF" fillOpacity="0.08" />
        </svg>

        <div className="mt-2 text-center">
          <p className="text-sm font-semibold text-[#A6C7A5]">
            Petugas Profesional & Terlatih
          </p>
          <p className="text-xs text-white/80 mt-0.5">
            Perawatan higienis dengan peralatan bersih dan cairan pembersih ramah lingkungan
          </p>
        </div>
      </div>
    </div>
  );
};
