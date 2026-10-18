"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import City from "./city";
import { SECTIONS } from "./sections";

/**
 * Navegação por seções (modo jogo) — correções sobre a referência:
 * 1. Um gesto de wheel = exatamente uma seção (acumulador com threshold + cooldown).
 * 2. Setas/PageUp/PageDown mudam de seção de verdade (na referência só movem o foco do menu).
 * 3. Transição rápida (600 ms) sem "câmera" longa que parece travada.
 * 4. Painéis com mais conteúdo rolam por dentro: a troca de seção só acontece
 *    quando o painel chega na borda (scroll interno nativo nunca é sequestrado).
 * 5. Mobile (<lg) usa fluxo nativo de scroll, sem hijack.
 */
export default function Game() {
  const [idx, setIdx] = useState(0);
  const [gameMode, setGameMode] = useState(false);
  const lockUntil = useRef(0);
  const acc = useRef(0);
  const touchY = useRef<number | null>(null);
  const count = SECTIONS.length;

  const go = useCallback(
    (n: number) => {
      lockUntil.current = Date.now() + 650;
      setIdx((p) => Math.max(0, Math.min(count - 1, n)));
    },
    [count]
  );

  const step = useCallback(
    (d: number) => {
      const now = Date.now();
      if (now < lockUntil.current) return;
      lockUntil.current = now + 650;
      acc.current = 0;
      setIdx((p) => Math.max(0, Math.min(count - 1, p + d)));
    },
    [count]
  );

  // painel rolável sob o ponteiro ainda pode rolar nesta direção?
  const panelCanScroll = (target: EventTarget | null, dir: number) => {
    const el = (target as HTMLElement | null)?.closest?.("[data-scroll]");
    if (!el) return false;
    const s = el as HTMLElement;
    return dir > 0
      ? s.scrollTop + s.clientHeight < s.scrollHeight - 4
      : s.scrollTop > 4;
  };

  // modo jogo só no desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setGameMode(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // hash inicial (#projetos etc.)
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const i = SECTIONS.findIndex((s) => s.id === hash);
    if (i > 0) setIdx(i);
  }, []);

  useEffect(() => {
    if (gameMode) {
      history.replaceState(null, "", `#${SECTIONS[idx].id}`);
    }
  }, [idx, gameMode]);

  // wheel / teclado / touch — apenas no modo jogo
  useEffect(() => {
    if (!gameMode) return;

    const onWheel = (e: WheelEvent) => {
      const dir = e.deltaY > 0 ? 1 : -1;
      if (panelCanScroll(e.target, dir)) return; // rolagem interna nativa
      e.preventDefault();
      acc.current += e.deltaY;
      if (Math.abs(acc.current) >= 50) step(dir);
    };

    const onKey = (e: KeyboardEvent) => {
      const handled: Record<string, () => void> = {
        ArrowDown: () => step(1),
        ArrowRight: () => step(1),
        PageDown: () => step(1),
        ArrowUp: () => step(-1),
        ArrowLeft: () => step(-1),
        PageUp: () => step(-1),
        Home: () => go(0),
        End: () => go(count - 1),
        Escape: () => step(-1),
      };
      const fn = handled[e.key];
      if (fn) {
        e.preventDefault();
        fn();
        return;
      }
      const n = Number.parseInt(e.key, 10);
      if (n >= 1 && n <= count) go(n - 1);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchY.current = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (touchY.current == null) return;
      const dy = touchY.current - e.changedTouches[0].clientY;
      touchY.current = null;
      if (Math.abs(dy) < 48) return;
      const dir = dy > 0 ? 1 : -1;
      if (panelCanScroll(e.target, dir)) return;
      step(dir);
    };

    const onMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      document.documentElement.style.setProperty("--px", `${(-nx * 16).toFixed(1)}px`);
      document.documentElement.style.setProperty("--py", `${(-ny * 9).toFixed(1)}px`);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [gameMode, step, go, count]);

  return (
    <main className="relative">
      {/* marca fixa */}
      <header className="fixed left-5 top-5 z-40 lg:left-10 lg:top-8">
        <p className="font-display text-base font-bold tracking-[0.08em] text-white lg:text-lg">
          GENESIS MELO
        </p>
        <p className="mt-0.5 font-mono text-[10px] tracking-[0.18em] text-white/50 lg:text-[11px]">
          DESENVOLVEDOR FULL STACK
        </p>
      </header>

      {/* navegação lateral (desktop) */}
      <nav
        aria-label="Seções"
        className="fixed bottom-0 left-6 top-0 z-40 hidden flex-col justify-center gap-3 lg:flex"
      >
        {SECTIONS.map((s, i) => {
          const active = i === idx;
          return (
            <button
              key={s.id}
              onClick={() => go(i)}
              aria-current={active ? "true" : undefined}
              className={`group flex items-baseline gap-3 text-left transition-colors ${
                active ? "text-white" : "text-white/35 hover:text-white/75"
              }`}
            >
              <span className="font-mono text-[10px]">{s.num}</span>
              <span
                className={`font-display font-bold uppercase tracking-wide transition-all duration-300 ${
                  active ? "text-2xl underline underline-offset-4" : "text-sm"
                }`}
              >
                {s.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* palco */}
      <div className={gameMode ? "game-stage" : ""}>
        {SECTIONS.map((s, i) => {
          const active = i === idx;
          return (
            <section
              key={s.id}
              id={s.id}
              data-active={gameMode ? active : true}
              className="game-section relative min-h-screen overflow-hidden lg:min-h-0"
              aria-hidden={gameMode ? !active : undefined}
            >
              <div className="scene absolute inset-0">
                <div className="scene-art h-full w-full">
                  <City variant={s.scene} />
                </div>
              </div>
              {/* scrim de legibilidade no lado do conteúdo */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(7,6,15,0.25)_30%,rgba(7,6,15,0.62)_62%,rgba(7,6,15,0.82))] lg:bg-[linear-gradient(90deg,rgba(7,6,15,0)_30%,rgba(7,6,15,0.45)_52%,rgba(7,6,15,0.8)_100%)]" />
              <div
                data-scroll={gameMode ? "" : undefined}
                className="relative z-10 lg:flex lg:h-full lg:flex-col lg:overflow-y-auto"
              >
                <div className="mx-auto w-full max-w-xl px-6 py-28 lg:my-auto lg:ml-auto lg:mr-[6vw] lg:min-h-0 lg:px-0">
                  {s.content}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* barra de dicas (desktop) */}
      <footer className="fixed inset-x-0 bottom-0 z-40 hidden items-center justify-between px-10 pb-5 font-mono text-[11px] text-white/45 lg:flex">
        <span>↑↓ mudar de seção · scroll avança · esc volta</span>
        <span className="text-white/70">
          {SECTIONS[idx].num} <span className="text-white/35">/ 07</span>
        </span>
      </footer>

      {/* navegação inferior (mobile) */}
      <nav
        aria-label="Seções"
        className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 gap-3 rounded-full border border-white/10 bg-[#07060f]/70 px-4 py-2 backdrop-blur-sm lg:hidden"
      >
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-label={s.label}
            className="font-mono text-[10px] text-white/60 transition-colors hover:text-white"
          >
            {s.num}
          </a>
        ))}
      </nav>
    </main>
  );
}
