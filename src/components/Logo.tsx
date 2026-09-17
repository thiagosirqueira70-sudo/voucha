import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export default function Logo({ size = 'md', showTagline = false }: LogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Ícone Vetorial: Balão de Testemunho com Play + V de Validação */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg shadow-orange-500/20 text-white ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5/9 h-5/9"
        >
          {/* Balão com formato institucional */}
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          {/* Símbolo de play / validação interno */}
          <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tight text-white ${textSizes[size]}`}>
            Voucha
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
            Business
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] text-slate-400 font-medium tracking-wide">
            Testemunhos & Prova Social RGPD
          </span>
        )}
      </div>
    </div>
  );
}