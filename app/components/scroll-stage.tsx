'use client';

import { useCallback, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight } from './ui';
import { runReveal } from './animations';

const SCREENS = 3;
const PHRASES = [
  { start: 0.3, end: 0.49, index: '01 — Backend', lead: 'APIs que', accent: 'aguentam' },
  { start: 0.53, end: 0.72, index: '02 — Integração', lead: 'Sistemas que', accent: 'conversam' },
  { start: 0.76, end: 0.96, index: '03 — Entrega', lead: 'Ideias que', accent: 'chegam ao ar' },
];

function ramp(value: number, start: number, end: number) {
  return Math.min(1, Math.max(0, (value - start) / (end - start)));
}

/** Abertura editorial com uma ilustração própria do fluxo do LeadFlow Engine. */
export default function ScrollStage() {
  const stage = useRef<HTMLElement>(null);
  const heroPanel = useRef<HTMLDivElement>(null);
  const heroText = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const cue = useRef<HTMLDivElement>(null);
  const phraseRefs = useRef<(HTMLDivElement | null)[]>([]);

  const paint = useCallback((progress: number) => {
    if (bar.current) bar.current.style.width = `${(progress * 100).toFixed(2)}%`;
    if (cue.current) cue.current.style.opacity = progress > 0.02 ? '0' : '1';

    const exit = ramp(progress, 0.14, 0.2);
    if (heroPanel.current) {
      heroPanel.current.style.opacity = String(1 - exit);
      heroPanel.current.style.pointerEvents = exit < 0.85 ? '' : 'none';
    }
    if (heroText.current) heroText.current.style.transform = `translateX(-${(exit * 48).toFixed(1)}vw)`;

    PHRASES.forEach((phrase, index) => {
      const element = phraseRefs.current[index];
      if (!element) return;
      const active = progress >= phrase.start && progress < phrase.end;
      element.style.opacity = active ? '1' : '0';
      element.style.transform = `translate(-50%, ${active ? '-50%' : '-44%'})`;
      element.setAttribute('aria-hidden', String(!active));
    });
  }, []);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let visible = false;
    let target = 0;

    const read = () => {
      const distance = element.offsetHeight - window.innerHeight;
      return distance <= 0 ? 0 : Math.min(1, Math.max(0, -element.getBoundingClientRect().top / distance));
    };
    const tick = () => {
      frame = 0;
      paint(target);
    };
    const schedule = () => {
      if (!reduced && visible && !frame) frame = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      target = read();
      if (reduced) paint(0);
      else schedule();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) onScroll();
      else if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    }, { rootMargin: '80px 0px' });

    observer.observe(element);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [paint]);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    let cleanup = () => {};
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      cleanup = runReveal(() => {
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .from('[data-hero="eyebrow"]', { opacity: 0, y: 12, duration: 0.45 })
          .from('[data-hero="line"]', { opacity: 0, yPercent: 108, duration: 0.75, stagger: 0.08 }, '-=0.12')
          .from('[data-hero="sub"]', { opacity: 0, y: 16, duration: 0.55 }, '-=0.35')
          .from('[data-hero="cta"]', { opacity: 0, y: 14, duration: 0.4, stagger: 0.08 }, '-=0.25')
          .from('[data-hero="artifact"]', { opacity: 0, x: 28, rotate: 2, duration: 0.8 }, '-=0.55');
      });
    });
    return () => cleanup();
  }, { scope: heroPanel });

  return (
    <>
      <div ref={bar} className="fixed left-0 top-0 z-[60] h-0.5 w-0 bg-[#927258]" role="progressbar" aria-label="Progresso da apresentação" />
      <section id="inicio" ref={stage} style={{ height: `${SCREENS * 100}vh` }} className="scroll-stage relative bg-[#eeeae0]">
        <div className="hero-stage sticky top-0 h-screen overflow-hidden">
          <div className="hero-stage__grain pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="hero-stage__ghost pointer-events-none absolute inset-x-0 top-[13%] z-10 select-none text-center" aria-hidden="true">GENESIS</div>

          <div ref={heroPanel} className="hero-stage__panel absolute inset-0 z-30 flex items-center px-6 md:px-[8vw]">
            <div ref={heroText} className="relative mx-auto grid w-full max-w-7xl items-center gap-8 md:grid-cols-[0.95fr_1.05fr] md:gap-4">
              <div className="relative z-20">
                <div data-hero="eyebrow" className="hero-stage__availability mb-7 inline-flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-[#927258]" />
                  <span className="text-xs font-semibold tracking-wide">Desenvolvimento de software · Brasil</span>
                </div>

                <h1 className="hero-stage__title headline max-w-[8ch] text-[17vw] font-black sm:text-[13vw] md:text-[8.5vw] lg:text-[7.4rem]">
                  <span className="block overflow-hidden"><span data-hero="line" className="block">Genesis</span></span>
                  <span className="block overflow-hidden"><span data-hero="line" className="block">Melo<span className="text-[#927258]">.</span></span></span>
                </h1>

                <p data-hero="sub" className="font-display mt-6 max-w-[31rem] text-2xl italic leading-tight text-[#34372f]/85 md:text-3xl">
                  Full Stack Júnior. Backend em destaque, do primeiro dado à entrega.
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <a data-hero="cta" href="#projetos" className="group inline-flex items-center gap-2 rounded-full bg-[#263025] px-6 py-3 text-sm font-bold text-[#f5f2e9] transition-colors hover:bg-[#3a4637]">
                    Explorar projetos <ArrowUpRight />
                  </a>
                  <a data-hero="cta" href="https://www.linkedin.com/in/genesis-melo/" target="_blank" rel="noreferrer" className="hero-stage__secondary group inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold backdrop-blur-sm transition-all">
                    LinkedIn <ArrowUpRight />
                  </a>
                </div>
              </div>

              <div data-hero="artifact" className="hero-artifact relative mx-auto w-full max-w-[42rem]">
                <div className="hero-artifact__backdrop" aria-hidden="true" />
                <div className="hero-artifact__sheet">
                  <div className="hero-artifact__topline">
                    <span>PROJETO EM DESTAQUE</span>
                    <span>01 / 03</span>
                  </div>
                  <div className="hero-artifact__title-row">
                    <div>
                      <p className="hero-artifact__eyebrow">NestJS · Redis · PostgreSQL</p>
                      <h2>LeadFlow <i>Engine</i></h2>
                    </div>
                    <span className="hero-artifact__mark" aria-hidden="true">↗</span>
                  </div>

                  <svg className="hero-artifact__route" viewBox="0 0 600 235" role="img" aria-labelledby="flow-title flow-desc">
                    <title id="flow-title">Fluxo de distribuição do LeadFlow Engine</title>
                    <desc id="flow-desc">Um lead chega por webhook, passa por validação, entra na fila Redis e segue para o vendedor certo.</desc>
                    <path className="hero-artifact__route-line" d="M82 118 C170 118 157 64 242 64 S326 174 411 174 S483 118 530 118" />
                    <path className="hero-artifact__route-line hero-artifact__route-line--fine" d="M82 128 C170 128 157 74 242 74 S326 184 411 184 S483 128 530 128" />
                    <g className="hero-artifact__node" transform="translate(82 118)">
                      <circle r="35" /><circle className="hero-artifact__node-core" r="7" />
                      <text y="59">WEBHOOK</text>
                    </g>
                    <g className="hero-artifact__node" transform="translate(242 64)">
                      <circle r="35" /><circle className="hero-artifact__node-core" r="7" />
                      <text y="59">VALIDAÇÃO</text>
                    </g>
                    <g className="hero-artifact__node hero-artifact__node--active" transform="translate(411 174)">
                      <circle r="35" /><circle className="hero-artifact__node-core" r="7" />
                      <text y="59">FILA REDIS</text>
                    </g>
                    <g className="hero-artifact__node" transform="translate(530 118)">
                      <circle r="35" /><circle className="hero-artifact__node-core" r="7" />
                      <text y="59">RODÍZIO</text>
                    </g>
                    <circle className="hero-artifact__traveler" r="5"><animateMotion dur="5s" repeatCount="indefinite" path="M82 118 C170 118 157 64 242 64 S326 174 411 174 S483 118 530 118" /></circle>
                  </svg>

                  <div className="hero-artifact__foot">
                    <span>Receber → validar → enfileirar → distribuir</span>
                    <a href="https://github.com/7Genesis/leadflow-engine" target="_blank" rel="noreferrer">Ver código <ArrowUpRight /></a>
                  </div>
                </div>
                <div className="hero-artifact__note">Uma oportunidade por vez.<br />O sistema cuida do caminho.</div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 z-20" aria-live="polite">
            {PHRASES.map((phrase, index) => (
              <div key={phrase.index} ref={(element) => { phraseRefs.current[index] = element; }} style={{ transform: 'translate(-50%, -44%)' }} className="hero-stage__phrase absolute left-1/2 top-1/2 w-[90vw] max-w-5xl text-center opacity-0 transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none" aria-hidden="true">
                <p className="relative mb-4 text-xs font-black uppercase tracking-[0.35em] text-[#927258]">{phrase.index}</p>
                <h2 className="headline relative text-5xl font-black leading-[0.95] text-[#263025] md:text-8xl">
                  {phrase.lead}{' '}<span className="font-display font-normal italic text-[#927258]">{phrase.accent}</span>.
                </h2>
              </div>
            ))}
          </div>

          <div ref={cue} className="pointer-events-none absolute bottom-7 left-1/2 z-20 -translate-x-1/2 text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-[#53584d]/70 transition-opacity duration-500">
            Role para acompanhar <span className="ml-2">↓</span>
          </div>
        </div>
      </section>
    </>
  );
}
