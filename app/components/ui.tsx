import React from 'react';

export const ArrowUpRight = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

interface PillProps {
  href: string;
  children: React.ReactNode;
  /** 'light' = pill claro (para fundos escuros); 'dark' = pill escuro (para fundos claros) */
  variant?: 'light' | 'dark';
  external?: boolean;
  className?: string;
}

export function Pill({
  href,
  children,
  variant = 'dark',
  external = true,
  className = '',
}: PillProps) {
  const styles =
    variant === 'light'
      ? 'bg-white text-[#0a0a0a] hover:bg-white/85'
      : 'bg-[#0a0a0a] text-white hover:bg-[#0a0a0a]/85 border border-black/10';

  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className={`group inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition-all ${styles} ${className}`}
    >
      {children}
      <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        <ArrowUpRight />
      </span>
    </a>
  );
}
