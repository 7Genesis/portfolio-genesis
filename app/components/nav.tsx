'use client';

import { useState } from 'react';

const links = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experiência', href: '#experiencia' },
  { label: 'GitHub', href: '#github' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#263025]/[0.07] bg-[#eeeae0]/80 text-[#263025] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <a href="#inicio" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#748568] text-sm font-black text-white">
            GM
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold">Genesis Melo</span>
            <span className="block text-xs text-[#263025]/55">Full Stack Júnior</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-[#263025]/65 transition-colors hover:text-[#748568]"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/5574998055726?text=Ol%C3%A1%20Genesis%2C%20vim%20pelo%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar%21"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[#263025] px-5 py-2 text-sm font-bold text-[#f5f2e9] transition-all hover:bg-[#3a4637]"
          >
            Falar no WhatsApp
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#263025]/15 text-[#263025] md:hidden"
            aria-label="Menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* menu mobile */}
      {open && (
        <div className="border-t border-[#263025]/10 px-5 pb-4 md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-base font-medium text-[#263025]/70 transition-colors hover:text-[#748568]"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
