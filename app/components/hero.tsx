'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export default function Hero() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.from('[data-hero="eyebrow"]', { opacity: 0, y: 20, duration: 0.7 })
        .from(
          '[data-hero="line"]',
          { opacity: 0, yPercent: 120, duration: 1.1, stagger: 0.12 },
          '-=0.3',
        )
        .from(
          '[data-hero="sub"]',
          { opacity: 0, y: 24, duration: 0.9 },
          '-=0.6',
        )
        .from(
          '[data-hero="desc"]',
          { opacity: 0, y: 24, duration: 0.9 },
          '-=0.7',
        )
        .from(
          '[data-hero="cta"]',
          { opacity: 0, y: 20, duration: 0.7, stagger: 0.1 },
          '-=0.6',
        );
      });
    },
    { scope },
  );

  return (
    <section
      id="inicio"
      ref={scope}
      className="relative max-w-6xl mx-auto px-6 pt-36 pb-20"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10">
        <div
          data-hero="eyebrow"
          className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-slate-800 bg-slate-900/60 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs font-semibold tracking-wide text-slate-300">
            Disponível para novos projetos
          </span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-6 leading-[0.95]">
          <span className="block overflow-hidden">
            <span data-hero="line" className="block">
              Genesis Melo<span className="text-blue-500">.</span>
            </span>
          </span>
        </h1>

        <h2
          data-hero="sub"
          className="text-2xl md:text-3xl font-light text-slate-300 mb-6 max-w-3xl leading-relaxed"
        >
          Engenheiro de Software &{' '}
          <span className="font-semibold text-white">Estrategista de Growth</span>.
        </h2>

        <p
          data-hero="desc"
          className="text-lg text-slate-400 leading-relaxed max-w-2xl mb-12 font-medium"
        >
          Projeto arquiteturas escaláveis, implemento soluções de IA para
          agilidade operacional e desenvolvo sistemas de alta performance
          integrados a funis avançados de aquisição.
        </p>

        <div className="flex flex-wrap gap-4">
          <a
            data-hero="cta"
            href="https://wa.me/5511939281926?text=Ol%C3%A1%20Genesis%2C%20vim%20pelo%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar%21"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3.5 rounded-md font-bold hover:bg-emerald-500 transition-all shadow-[0_0_20px_rgba(5,150,105,0.2)] hover:shadow-[0_0_30px_rgba(5,150,105,0.4)]"
          >
            <WhatsAppIcon />
            Falar no WhatsApp
          </a>
          <a
            data-hero="cta"
            href="https://github.com/7Genesis?tab=repositories"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-blue-600/10 text-blue-400 border border-blue-500/30 px-8 py-3.5 rounded-md font-bold hover:bg-blue-600/20 transition-all"
          >
            <GitHubIcon />
            Acessar Repositórios
          </a>
        </div>
      </div>
    </section>
  );
}
