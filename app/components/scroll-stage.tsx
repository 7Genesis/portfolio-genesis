'use client';

import { useCallback, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight } from './ui';
import { runReveal } from './animations';

/**
 * Hero cinematográfico: o vídeo de fundo é rebobinado pela rolagem.
 *
 * A seção é alta só para criar distância de rolagem; dentro dela um bloco
 * `sticky` prende o vídeo na tela. A posição da rolagem vira o tempo do vídeo,
 * então a câmera avança conforme a pessoa rola — e para quando ela para.
 * O vídeo nunca toca sozinho.
 *
 * Substitui <Hero />. O hero antigo continua em hero.tsx, intacto.
 */

/** Altura do palco, em telas cheias. Mais alto = avanço mais lento. */
const SCREENS = 4;
/** Quanto da distância restante é percorrida por quadro. Menor = mais macio. */
const EASING = 0.16;
/** Se um seek não completa nesse tempo, liberamos o próximo para não travar. */
const SEEK_TIMEOUT_MS = 150;

/** Quando o painel de abertura sai deslizando para os lados. */
const HERO_EXIT = { start: 0.14, end: 0.2 };

const PHRASES = [
  { start: 0.26, end: 0.44, index: '01 — Backend', lead: 'APIs que', accent: 'aguentam' },
  { start: 0.5, end: 0.68, index: '02 — Frontend', lead: 'Interfaces que', accent: 'respondem' },
  { start: 0.74, end: 0.94, index: '03 — Entrega', lead: 'Do commit', accent: 'ao ar' },
];

/** Interpola 0→1 dentro de uma faixa, com corte nas pontas. */
function ramp(value: number, start: number, end: number) {
  return Math.min(1, Math.max(0, (value - start) / (end - start)));
}

export default function ScrollStage() {
  const stage = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const heroPanel = useRef<HTMLDivElement>(null);
  const heroText = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const cue = useRef<HTMLDivElement>(null);
  const phraseRefs = useRef<(HTMLDivElement | null)[]>([]);

  /**
   * Escreve direto no DOM em vez de usar estado do React: seriam ~60
   * re-renderizações por segundo.
   */
  const paint = useCallback((p: number) => {
    if (bar.current) bar.current.style.width = `${(p * 100).toFixed(2)}%`;
    if (cue.current) cue.current.style.opacity = p > 0.02 ? '0' : '1';

    const exit = ramp(p, HERO_EXIT.start, HERO_EXIT.end);
    if (heroPanel.current) {
      heroPanel.current.style.opacity = String(1 - exit);
      heroPanel.current.style.pointerEvents = exit < 0.85 ? '' : 'none';
    }
    if (heroText.current) {
      heroText.current.style.transform = `translateX(-${(exit * 60).toFixed(1)}vw)`;
    }

    PHRASES.forEach((phrase, i) => {
      const el = phraseRefs.current[i];
      if (!el) return;
      const on = p >= phrase.start && p < phrase.end;
      el.style.opacity = on ? '1' : '0';
      el.style.transform = `translate(-50%, ${on ? '-50%' : '-42%'})`;
    });
  }, []);

  /**
   * O Safari do iOS não decodifica um vídeo que nunca tocou: o elemento fica
   * vazio e o currentTime não produz quadro nenhum. Um play() seguido de
   * pause() acorda o decodificador — depois disso o seek funciona.
   *
   * Com muted + playsInline o autoplay costuma passar, mas nem sempre; por
   * isso repetimos na primeira interação, que é quando o navegador libera.
   */
  useEffect(() => {
    const film = video.current;
    if (!film) return;

    // No celular usamos um clipe vertical, enquadrado para retrato — recortar
    // o de 16:9 jogaria fora justamente as laterais da cena. A escolha é feita
    // aqui, e não por <source media>, porque o WebKit avalia aquele atributo
    // de forma inconsistente.
    if (window.matchMedia('(max-width: 768px)').matches) {
      film.src = '/stage-mobile.mp4';
      film.poster = '/stage-poster-mobile.jpg';
      const palco = film.parentElement;
      if (palco) palco.style.backgroundImage = 'url(/stage-poster-mobile.jpg)';
    }

    let primed = false;
    const prime = () => {
      if (primed) return;
      const attempt = film.play();
      if (attempt?.then) {
        attempt
          .then(() => {
            film.pause();
            film.currentTime = 0;
            primed = true;
          })
          .catch(() => {
            /* autoplay bloqueado: tentamos de novo no primeiro toque */
          });
      }
    };

    film.load();
    film.addEventListener('loadedmetadata', prime);
    film.addEventListener('canplay', prime);
    window.addEventListener('touchstart', prime, { once: true, passive: true });
    window.addEventListener('pointerdown', prime, { once: true });
    prime();

    return () => {
      film.removeEventListener('loadedmetadata', prime);
      film.removeEventListener('canplay', prime);
      window.removeEventListener('touchstart', prime);
      window.removeEventListener('pointerdown', prime);
    };
  }, []);

  useEffect(() => {
    const el = stage.current;
    const film = video.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let target = 0;
    let current = 0;
    let seeking = false;
    let seekStartedAt = 0;
    let raf = 0;
    let seekWatchdog = 0;
    let inView = false;

    const read = () => {
      const scrollable = el.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return 0;
      return Math.min(1, Math.max(0, -el.getBoundingClientRect().top / scrollable));
    };

    const schedule = () => {
      if (!reduced && inView && !raf) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = read();
      if (reduced) {
        current = target;
        paint(current);
      } else {
        schedule();
      }
    };
    const onSeeked = () => {
      seeking = false;
      window.clearTimeout(seekWatchdog);
      schedule();
    };

    const tick = () => {
      raf = 0;
      current += (target - current) * EASING;
      const settled = Math.abs(target - current) < 0.0005;
      if (settled) current = target;
      paint(current);

      if (film && film.readyState >= 1 && film.duration) {
        if (seeking && performance.now() - seekStartedAt > SEEK_TIMEOUT_MS) seeking = false;
        if (!seeking) {
          const t = current * film.duration;
          if (Math.abs(film.currentTime - t) > 0.01) {
            seeking = true;
            seekStartedAt = performance.now();
            try {
              film.currentTime = t;
              window.clearTimeout(seekWatchdog);
              seekWatchdog = window.setTimeout(() => {
                if (!seeking) return;
                seeking = false;
                schedule();
              }, SEEK_TIMEOUT_MS);
            } catch {
              seeking = false;
            }
          }
        }
      }

      if (!settled) schedule();
    };

    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) {
        target = read();
        if (!reduced) schedule();
        else onScroll();
      } else {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        window.clearTimeout(seekWatchdog);
        seeking = false;
      }
    }, { rootMargin: '80px 0px' });
    visibility.observe(el);

    film?.addEventListener('seeked', onSeeked);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    paint(target);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(seekWatchdog);
      visibility.disconnect();
      film?.removeEventListener('seeked', onSeeked);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [paint]);

  // Mesma entrada do hero antigo, preservada.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      let cleanup = () => {};
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        cleanup = runReveal(() => {
          gsap
            .timeline({ defaults: { ease: 'power3.out' } })
            .from('[data-hero="eyebrow"]', { opacity: 0, y: 16, duration: 0.4 })
            .from(
              '[data-hero="line"]',
              { opacity: 0, yPercent: 108, duration: 0.7, stagger: 0.08 },
              '-=0.15',
            )
            .from('[data-hero="sub"]', { opacity: 0, y: 20, duration: 0.5 }, '-=0.35')
            .from('[data-hero="cta"]', { opacity: 0, y: 16, duration: 0.4, stagger: 0.08 }, '-=0.3');
        });
      });
      return () => cleanup();
    },
    { scope: heroPanel },
  );

  return (
    <>
      <div
        ref={bar}
        className="fixed left-0 top-0 z-[60] h-0.5 w-0 bg-[#748568]"
        role="progressbar"
        aria-label="Progresso da apresentação"
      />

      <section
        id="inicio"
        ref={stage}
        style={{ height: `${SCREENS * 100}vh` }}
        className="scroll-stage relative bg-[#eeeae0]"
      >
        {/* O poster também vai como fundo do palco: se o vídeo falhar em
            decodificar, sobra o primeiro quadro em vez de um retângulo preto. */}
        <div
          className="hero-stage sticky top-0 h-screen overflow-hidden bg-[#eeeae0]"
          style={{ backgroundImage: 'url(/stage-poster.jpg)' }}
        >
          <video
            ref={video}
            className="hero-stage__film absolute right-[5vw] top-[14vh] h-[72vh] w-[48vw] rounded-[48%_48%_1.5rem_1.5rem] object-cover object-center opacity-90 shadow-[0_30px_90px_rgba(41,48,35,0.18)]"
            poster="/stage-poster.jpg"
            preload="metadata"
            muted
            playsInline
            aria-hidden
          >
            {/* Nunca chamamos play(): quem move o vídeo é a rolagem. */}
            <source src="/stage.mp4" type="video/mp4" />
          </video>

          <div className="hero-stage__wash pointer-events-none absolute inset-0 z-10" />
          <div className="hero-stage__ghost pointer-events-none absolute inset-x-0 top-[16%] z-10 select-none text-center" aria-hidden="true">GENESIS</div>

          {/* Painel de abertura — o hero de sempre, que sai deslizando */}
          <div ref={heroPanel} className="absolute inset-0 z-30 flex items-center px-6 md:px-[9vw]">
            <div ref={heroText} className="relative mx-auto w-full max-w-7xl will-change-transform">
              <div
                data-hero="eyebrow"
                className="hero-stage__availability mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-md"
              >
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#748568]" />
                </span>
                <span className="text-xs font-semibold tracking-wide">
                  Aberto a oportunidades júnior
                </span>
              </div>

              <h1 className="hero-stage__title headline max-w-[8ch] text-[18vw] font-black sm:text-[13vw] lg:text-[9rem]">
                <span className="block overflow-hidden">
                  <span data-hero="line" className="block">
                    Genesis
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span data-hero="line" className="block">
                    Melo<span className="text-[#748568]">.</span>
                  </span>
                </span>
              </h1>

              <p
                data-hero="sub"
                className="font-display mt-6 max-w-[34rem] text-2xl italic leading-tight text-[#34372f]/85 md:text-4xl"
              >
                Desenvolvedor Full Stack Júnior com foco em backend, APIs e soluções com{' '}
                  <span className="text-[#748568]">IA</span>.
              </p>

              <div className="mt-12 flex flex-wrap items-center gap-4">
                <a
                  data-hero="cta"
                  href="#projetos"
                  className="group inline-flex items-center gap-2 rounded-full bg-[#263025] px-7 py-3.5 text-base font-bold text-[#f5f2e9] transition-all hover:bg-[#3a4637]"
                >
                  Ver projetos
                  <ArrowUpRight />
                </a>
                <a
                  data-hero="cta"
                  href="https://www.linkedin.com/in/genesis-melo/"
                  target="_blank"
                  rel="noreferrer"
                  className="hero-stage__secondary group inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-base font-semibold backdrop-blur-sm transition-all"
                >
                  LinkedIn
                  <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                    <ArrowUpRight />
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Frases que aparecem conforme a câmera avança */}
          <div className="pointer-events-none absolute inset-0 z-20">
            {PHRASES.map((phrase, i) => (
              <div
                key={phrase.index}
                ref={(el) => {
                  phraseRefs.current[i] = el;
                }}
                /* A centralização vive no transform inline: as classes de
                   translate do Tailwind v4 usam a propriedade `translate`, que
                   se somaria a este transform e jogaria a frase para fora. */
                style={{ transform: 'translate(-50%, -42%)' }}
                className="hero-stage__phrase absolute left-1/2 top-1/2 w-[90vw] max-w-5xl text-center opacity-0 transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none"
              >
                <p className="relative mb-4 text-xs font-black uppercase tracking-[0.35em] text-[#748568]">
                  {phrase.index}
                </p>
                <h2 className="headline relative text-5xl font-black leading-[0.95] text-[#263025] md:text-8xl">
                  {phrase.lead}{' '}
                  <span className="font-display font-normal italic text-[#748568]">
                    {phrase.accent}
                  </span>
                  .
                </h2>
              </div>
            ))}
          </div>

          <div
            ref={cue}
            className="pointer-events-none absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-[#53584d]/70 transition-opacity duration-500"
          >
            Role para entrar
            <span className="mt-2 block animate-bounce motion-reduce:animate-none">↓</span>
          </div>
        </div>
      </section>
    </>
  );
}
