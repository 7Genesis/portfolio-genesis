'use client';

import { useEffect, useState } from 'react';

const links = [
  { label: 'Início', href: '#inicio' },
  { label: 'NovaLab', href: '#novalab' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'GitHub', href: '#github' },
  { label: 'Trajetória', href: '#trajetoria' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#inicio" className="text-lg font-black tracking-tight text-white">
          GM<span className="text-blue-500">.</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="https://wa.me/5511939281926?text=Ol%C3%A1%20Genesis%2C%20vim%20pelo%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar%21"
          target="_blank"
          rel="noreferrer"
          className="rounded-md bg-emerald-600 px-5 py-2 text-sm font-bold text-white transition-all hover:bg-emerald-500"
        >
          Contato
        </a>
      </nav>
    </header>
  );
}
