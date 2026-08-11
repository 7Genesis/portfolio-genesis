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
const SCREENS = 5;
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

const WHATSAPP =
  'https://wa.me/5511939281926?text=Ol%C3%A1%20Genesis%2C%20vim%20pelo%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar%21';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

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

    // No celular carregamos um arquivo mais leve (3,5 MB contra 7,1 MB). A
    // escolha é feita aqui, e não por <source media>, porque o WebKit avalia
    // aquele atributo de forma inconsistente.
    if (window.matchMedia('(max-width: 768px)').matches) {
      film.src = '/stage-mobile.mp4';
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

    const read = () => {
      const scrollable = el.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return 0;
      return Math.min(1, Math.max(0, -el.getBoundingClientRect().top / scrollable));
    };

    const onScroll = () => {
      target = read();
      if (reduced) {
        current = target;
        paint(current);
      }
    };
    const onSeeked = () => {
      seeking = false;
    };

    const tick = () => {
      current += (target - current) * EASING;
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
            } catch {
              seeking = false;
            }
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };

    film?.addEventListener('seeked', onSeeked);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    if (reduced) paint(target);
    else raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
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
        className="fixed left-0 top-0 z-50 h-0.5 w-0 bg-emerald-400"
        role="progressbar"
        aria-label="Progresso da apresentação"
      />

      <section
        id="inicio"
        ref={stage}
        style={{ height: `${SCREENS * 100}vh` }}
        className="relative bg-[#0a0a0a]"
      >
        {/* O poster também vai como fundo do palco: se o vídeo falhar em
            decodificar, sobra o primeiro quadro em vez de um retângulo preto. */}
        <div
          className="sticky top-0 h-screen overflow-hidden bg-[#0a0a0a] bg-cover bg-center"
          style={{ backgroundImage: 'url(/stage-poster.jpg)' }}
        >
          <video
            ref={video}
            className="absolute inset-0 h-full w-full object-cover"
            poster="/stage-poster.jpg"
            preload="auto"
            muted
            playsInline
            aria-hidden
          >
            {/* Nunca chamamos play(): quem move o vídeo é a rolagem. */}
            <source src="/stage.mp4" type="video/mp4" />
          </video>

          {/* Escurecimento nas bordas: o texto precisa de contraste sobre qualquer frame. */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-[#0a0a0a]/80 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-56 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
          <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(120%_120%_at_50%_45%,transparent_45%,rgba(10,10,10,0.75)_100%)]" />

          {/* Painel de abertura — o hero de sempre, que sai deslizando */}
          <div ref={heroPanel} className="absolute inset-0 z-30 flex items-center px-6">
            {/* Véu à esquerda: a foto tem um monitor claro justamente onde o
                texto cai. Sem isso o parágrafo some no branco. Fica dentro do
                painel para desaparecer junto com ele. */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/90 via-[#0a0a0a]/55 to-transparent" />

            <div ref={heroText} className="relative mx-auto w-full max-w-6xl will-change-transform">
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

              <h1 className="headline text-[19vw] font-black text-white drop-shadow-[0_4px_40px_rgba(0,0,0,0.6)] sm:text-[15vw] lg:text-[11rem]">
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
                className="font-display mt-8 max-w-3xl text-3xl italic leading-tight text-white/85 drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)] md:text-5xl"
              >
                Desenvolvedor Full Stack — construo APIs escaláveis, interfaces modernas e
                integrações com <span className="text-emerald-400">IA</span>.
              </p>

              <div className="mt-12 flex flex-wrap items-center gap-4">
                <a
                  data-hero="cta"
                  href={WHATSAPP}
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
                  className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
                >
                  Repositórios
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
                className="absolute left-1/2 top-1/2 w-[90vw] max-w-5xl text-center opacity-0 transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none"
              >
                {/* Véu atrás do texto: os frames de código são claros e
                    quebrados, e a frase sumia dentro deles. */}
                <div className="pointer-events-none absolute -inset-x-[15%] -inset-y-[60%] bg-[radial-gradient(ellipse_at_center,rgba(10,10,10,0.82)_0%,rgba(10,10,10,0.55)_45%,transparent_72%)]" />

                <p className="relative mb-4 text-xs font-black uppercase tracking-[0.35em] text-emerald-400">
                  {phrase.index}
                </p>
                <h2 className="headline relative text-5xl font-black leading-[0.95] text-white drop-shadow-[0_4px_40px_rgba(0,0,0,0.65)] md:text-8xl">
                  {phrase.lead}{' '}
                  <span className="font-display font-normal italic text-emerald-400">
                    {phrase.accent}
                  </span>
                  .
                </h2>
              </div>
            ))}
          </div>

          <div
            ref={cue}
            className="pointer-events-none absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70 transition-opacity duration-500"
          >
            Role para entrar
            <span className="mt-2 block animate-bounce motion-reduce:animate-none">↓</span>
          </div>
        </div>
      </section>
    </>
  );
}
