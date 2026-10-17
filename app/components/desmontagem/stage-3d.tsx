"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CODES, CV_URL, DOTS, LABELS, SCROLL_SCREENS, STEPS, type ModalName } from "./content";
import { ActionLink } from "./ui";
import type { Fonts } from "./screens";
import type { SceneHandle, SlideInfo } from "./scene";

type Props = {
  fonts: Fonts;
  onModal: (m: ModalName) => void;
  /** a cena não pôde ser criada (WebGL, rede ou memória): cai para a versão simples */
  onFail: () => void;
  onSimple: () => void;
};

/** Experiência 3D: o notebook e o celular desmontam conforme a rolagem. A cena só é carregada aqui. */
export default function Stage3D({ fonts, onModal, onFail, onSimple }: Props) {
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const capRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const ticksRef = useRef<HTMLDivElement>(null);
  const handle = useRef<SceneHandle | null>(null);

  const [chapter, setChapter] = useState(0);
  const [slide, setSlide] = useState<SlideInfo | null>(null);
  const [pct, setPct] = useState(0);
  const [ready, setReady] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;
    let h: SceneHandle | undefined;
    (async () => {
      try {
        const { createScene } = await import("./scene");
        const stage = stageRef.current;
        const track = trackRef.current;
        const canvas = canvasRef.current;
        if (cancelled || !stage || !track || !canvas) return;
        const created = await createScene({
          canvas,
          stage,
          container: track,
          copy: copyRef.current as HTMLElement,
          cap: capRef.current as HTMLElement,
          code: codeRef.current as HTMLElement,
          blur: blurRef.current as HTMLElement,
          marker: markerRef.current as HTMLElement,
          ticks: ticksRef.current as HTMLElement,
          labels: Array.from(stage.querySelectorAll<HTMLElement>("[data-lbl]")),
          fonts,
          onLoad: (f) => setPct(Math.round(f * 100)),
          onReady: () => {
            setReady(true);
            timer = window.setTimeout(() => setGone(true), 900);
          },
          onChapter: setChapter,
          onSlide: setSlide,
        });
        if (cancelled) {
          created.dispose();
          return;
        }
        h = created;
        handle.current = created;
      } catch {
        if (!cancelled) onFail();
      }
    })();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      h?.dispose();
      handle.current = null;
    };
  }, [fonts, onFail]);

  const goTo = useCallback((i: number) => handle.current?.goTo(i), []);

  // régua inferior: clicar ou arrastar leva a rolagem até aquele ponto; setas, Home e End também funcionam
  const dragging = useRef(false);
  const seekFromPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const t = ticksRef.current;
    if (!t) return;
    const r = t.getBoundingClientRect();
    handle.current?.seek((e.clientX - r.left) / Math.max(1, r.width));
  };
  const onScrubKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const now = Number(e.currentTarget.getAttribute("aria-valuenow") ?? 0) / 100;
    const keys: Record<string, number> = { ArrowRight: now + 0.03, ArrowUp: now + 0.03, ArrowLeft: now - 0.03, ArrowDown: now - 0.03, PageDown: now + 0.12, PageUp: now - 0.12, Home: 0, End: 1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    handle.current?.seek(keys[e.key]);
  };
  const step = STEPS[chapter];

  return (
    <section
      ref={trackRef}
      className="dm-track"
      style={{ height: `${SCROLL_SCREENS * 100}vh` }}
      aria-label="Portfólio interativo: role para desmontar o notebook e o celular"
    >
      <div ref={stageRef} className="dm-stage">
        {!gone && (
          <div className={`dm-load${ready ? " off" : ""}`} role="status">
            <div className="dm-ld">
              <span className="dm-logo">
                genesis<i>.</i>melo
              </span>
              <p>{pct < 100 ? "Montando o MacBook…" : "Pronto"}</p>
              <div className="dm-bar">
                <i style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>
        )}
        <div className="dm-grain" aria-hidden="true" />
        <canvas ref={canvasRef} className="dm-gl" aria-hidden="true" />

        <header className="dm-head">
          <span className="dm-logo">
            genesis<i>.</i>melo
          </span>
          <nav aria-label="Principal">
            <button type="button" onClick={() => onModal("projetos")}>
              Projetos
            </button>
            <button type="button" onClick={() => onModal("experiencia")}>
              Experiência
            </button>
            <button type="button" onClick={() => onModal("msg")}>
              Contato
            </button>
            <button type="button" className="dm-alt" onClick={onSimple}>
              Versão simples
            </button>
            <a
              className="dm-cv"
              href={CV_URL}
              onClick={(e) => {
                e.preventDefault();
                onModal("cv");
              }}
            >
              Currículo (PDF)
            </a>
          </nav>
        </header>

        <p className="dm-sr" aria-live="polite">
          {step.kicker}: {step.title}
        </p>

        <div ref={copyRef} className="dm-copy">
          {STEPS.map((s, i) => {
            const on = i === chapter;
            const Title = i === 0 ? "h1" : "h2";
            return (
              <div key={s.n} data-n={s.n} className={`dm-step${on ? " on" : ""}`} aria-hidden={!on} inert={!on}>
                <small>{s.kicker}</small>
                <Title>{s.title}</Title>
                {s.role ? <div className="dm-role">{s.role}</div> : null}
                <p>{s.text}</p>
                {s.chips ? (
                  <div className="dm-chips">
                    {s.chips.map((c) => (
                      <span key={c}>{c}</span>
                    ))}
                  </div>
                ) : null}
                {s.actions ? (
                  <div className="dm-btns">
                    {s.actions.map((a) => (
                      <ActionLink key={a.label} action={a} onModal={onModal} onGoto={goTo} />
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div ref={capRef} className="dm-cap" aria-hidden="true">
          <small>{step.kicker}</small>
          <b>{step.title}</b>
        </div>
        <div className="dm-sl" aria-hidden="true" style={{ opacity: slide ? 1 : 0 }}>
          {slide ? (
            <>
              <i>
                {slide.i + 1}/{slide.n}
              </i>{" "}
              · {slide.label}
            </>
          ) : null}
        </div>

        {LABELS.map((l) => (
          <div key={l.b} className="dm-lbl" data-lbl aria-hidden="true">
            <b>{l.b}</b> · {l.t}
          </div>
        ))}

        <div className="dm-gridov" aria-hidden="true" />
        <div ref={blurRef} className="dm-blurov" aria-hidden="true" />
        <div className="dm-vig" aria-hidden="true" />

        <div ref={codeRef} className="dm-code" aria-hidden="true">
          <b>JS</b>
          <span dangerouslySetInnerHTML={{ __html: CODES[chapter] }} />
        </div>

        <div
          className="dm-scrub"
          role="slider"
          tabIndex={0}
          aria-label="Progresso da apresentação (arraste ou use as setas)"
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={0}
          onPointerDown={(e) => {
            dragging.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            seekFromPointer(e);
          }}
          onPointerMove={(e) => {
            if (dragging.current) seekFromPointer(e);
          }}
          onPointerUp={() => {
            dragging.current = false;
          }}
          onPointerCancel={() => {
            dragging.current = false;
          }}
          onKeyDown={onScrubKey}
        >
          <div className="dm-t" ref={ticksRef}>
            {Array.from({ length: 57 }, (_, i) => (
              <i key={i} className={i % 8 === 0 ? "big" : undefined} />
            ))}
            <div className="dm-m" ref={markerRef} />
          </div>
        </div>

        <nav className="dm-dots" aria-label="Capítulos">
          {DOTS.map((d, i) => (
            <button key={d} type="button" className={i === chapter ? "on" : undefined} aria-current={i === chapter ? "step" : undefined} onClick={() => goTo(i)}>
              {d}
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}
