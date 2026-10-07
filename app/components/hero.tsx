'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight } from './ui';
import { runReveal } from './animations';

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
      className="relative flex min-h-[82vh] items-center overflow-hidden bg-[#0a0a0a] px-6 pb-20 pt-32 text-white"
    >
      <div className="starfield pointer-events-none absolute inset-0 opacity-50" />
      <div
        data-hero="glow"
        className="pointer-events-none absolute -top-1/4 left-1/3 h-[70vh] w-[70vh] rounded-full bg-emerald-500/15 blur-[140px]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div
            data-hero="eyebrow"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-semibold tracking-wide text-white/80">
              Em busca de oportunidade júnior
            </span>
          </div>

          <h1 className="headline text-6xl font-black tracking-tight sm:text-7xl md:text-8xl">
            <span data-hero="line" className="block">Genesis Melo</span>
          </h1>

          <p
            data-hero="sub"
            className="mt-6 max-w-3xl text-2xl font-semibold leading-tight text-emerald-300 md:text-4xl"
          >
            Desenvolvedor Backend Júnior
          </p>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
            Construo APIs e integrações com Node.js, TypeScript, NestJS, Python e PostgreSQL. Atualmente, desenvolvo soluções digitais no SAAE Juazeiro enquanto curso Ciência da Computação e Engenharia de Software.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              data-hero="cta"
              href="#projetos"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-bold text-[#0a0a0a] transition-colors hover:bg-white/85"
            >
              Ver projetos backend
              <ArrowUpRight />
            </a>
            <a
              data-hero="cta"
              href="https://www.linkedin.com/in/genesis-melo/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              LinkedIn
              <ArrowUpRight />
            </a>
          </div>
        </div>

        <div data-hero="cta" className="mx-auto w-full max-w-sm lg:justify-self-end">
          <Image
            src="/genesis-melo.jpg"
            alt="Retrato profissional de Genesis Melo"
            width={640}
            height={640}
            priority
            className="aspect-square w-full rounded-3xl object-cover object-top ring-1 ring-white/15"
          />
          <p className="mt-3 text-center text-xs text-white/50">Juazeiro, BA</p>
        </div>
      </div>
    </section>
  );
}
