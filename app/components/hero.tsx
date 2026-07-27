'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight } from './ui';
import { runReveal } from './animations';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

export default function Hero() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      let cleanup = () => {};
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        cleanup = runReveal(() => {
          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
          tl.from('[data-hero="eyebrow"]', { opacity: 0, y: 16, duration: 0.4 })
            .from(
              '[data-hero="line"]',
              { opacity: 0, yPercent: 108, duration: 0.7, stagger: 0.08 },
              '-=0.15',
            )
            .from('[data-hero="sub"]', { opacity: 0, y: 20, duration: 0.5 }, '-=0.35')
            .from(
              '[data-hero="cta"]',
              { opacity: 0, y: 16, duration: 0.4, stagger: 0.08 },
              '-=0.3',
            );

          // parallax suave do brilho ao rolar
          gsap.to('[data-hero="glow"]', {
            yPercent: 30,
            ease: 'none',
            scrollTrigger: {
              trigger: scope.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });
        });
      });
      return () => cleanup();
    },
    { scope },
  );

  return (
    <section
      id="inicio"
      ref={scope}
      className="relative flex min-h-screen items-center overflow-hidden bg-[#0a0a0a] px-6 pt-28 pb-16"
    >
      {/* céu estrelado + brilho */}
      <div className="starfield pointer-events-none absolute inset-0 opacity-70" />
      <div
        data-hero="glow"
        className="pointer-events-none absolute -top-1/4 left-1/2 h-[80vh] w-[80vh] -translate-x-1/2 rounded-full bg-emerald-500/15 blur-[140px]"
      />
      <div className="pointer-events-none absolute right-0 top-1/4 h-[50vh] w-[50vh] rounded-full bg-blue-600/10 blur-[130px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a0a0a] to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div
          data-hero="eyebrow"
          className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-xs font-semibold tracking-wide text-white/80">
            Disponível para novos projetos
          </span>
        </div>

        <h1 className="headline text-[19vw] font-black text-white sm:text-[15vw] lg:text-[11rem]">
          <span className="block overflow-hidden">
            <span data-hero="line" className="block">
              Genesis
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-hero="line" className="block">
              Melo<span className="text-emerald-400">.</span>
            </span>
          </span>
        </h1>

        <p
          data-hero="sub"
          className="font-display mt-8 max-w-3xl text-3xl italic leading-tight text-white/85 md:text-5xl"
        >
          Desenvolvedor Full Stack — construo APIs escaláveis, interfaces modernas
          e integrações com <span className="text-emerald-400">IA</span>.
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <a
            data-hero="cta"
            href="https://wa.me/5511939281926?text=Ol%C3%A1%20Genesis%2C%20vim%20pelo%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar%21"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-bold text-[#0a0a0a] transition-all hover:bg-white/85"
          >
            <WhatsAppIcon />
            Falar no WhatsApp
          </a>
          <a
            data-hero="cta"
            href="https://github.com/7Genesis?tab=repositories"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-base font-semibold text-white transition-all hover:bg-white/10"
          >
            Repositórios
            <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
