"use client";

import Link from "next/link";
import { memo, useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import {
  CAMADAS,
  ETIQUETAS,
  ITENS,
  ITEM_POR_ID,
  MAPA,
  MODOS,
  TAREFAS,
  type Camada,
  type Estatisticas,
  type ItemId,
  type Modo,
  type Tarefa,
} from "./dados";
import type { Cena, Margens } from "./cena";
import "./anatomia.css";

const SEM_CAMADAS: Record<Camada, boolean> = { dados: false, calor: false, energia: false };
const TODAS_CAMADAS: Record<Camada, boolean> = { dados: true, calor: true, energia: true };
const ZERO: Estatisticas = { cpu: 0, gpu: 0, neural: 0, memoria: 0, ssd: 0, temperatura: 36, potencia: 6, rpm: 0 };

const EXTERNOS = new Set<ItemId>(["tela", "teclado", "trackpad", "carcaca", "falantes", "portas"]);
const pct = (v: number) => `${Math.round(v * 100)}%`;
const corVar = (c: string) => ({ "--c": c }) as CSSProperties;

/** Localização da peça: vista de cima da base, com a frente do notebook para baixo. */
function Mapa({ id }: { id: ItemId }) {
  const cor = ITEM_POR_ID[id].cor;
  return (
    <svg className="an-mapa" viewBox="-8.8 -6.3 17.6 12.6" role="img" aria-label={`Localização de ${ITEM_POR_ID[id].nome} na base do notebook, vista de cima`}>
      <rect x="-7.8" y="-5.5" width="15.6" height="11" rx="1" className="an-mapa-base" />
      {MAPA[id].map(([x, z, w, d], i) => (
        <rect key={i} x={x - w / 2} y={z - d / 2} width={w} height={d} rx="0.15" fill={cor} fillOpacity="0.8" stroke={cor} />
      ))}
      <text x="0" y="-5.85" textAnchor="middle" className="an-mapa-t">
        dobradiça
      </text>
      <text x="0" y="6.15" textAnchor="middle" className="an-mapa-t">
        frente
      </text>
    </svg>
  );
}

const Medidor = ({ nome, valor, cor, onClick }: { nome: string; valor: number; cor: string; onClick?: () => void }) => (
  <button type="button" className="an-med" onClick={onClick} style={corVar(cor)} aria-label={`${nome}: ${pct(valor)}. Selecionar no modelo`}>
    <span>{nome}</span>
    <i role="presentation">
      <b style={{ width: pct(valor) }} />
    </i>
    <em>{pct(valor)}</em>
  </button>
);

type HudProps = { registrar: (fn: (s: Estatisticas) => void) => void; selecionar: (id: ItemId) => void };
const Hud = memo(function Hud({ registrar, selecionar }: HudProps) {
  const [s, setS] = useState<Estatisticas>(ZERO);
  useEffect(() => registrar(setS), [registrar]);
  return (
    <div className="an-hud" aria-live="off">
      <Medidor nome="CPU" valor={s.cpu} cor={ITEM_POR_ID.cpu.cor} onClick={() => selecionar("cpu")} />
      <Medidor nome="GPU" valor={s.gpu} cor={ITEM_POR_ID.gpu.cor} onClick={() => selecionar("gpu")} />
      <Medidor nome="Neural Engine" valor={s.neural} cor={ITEM_POR_ID.neural.cor} onClick={() => selecionar("neural")} />
      <Medidor nome="Memória" valor={s.memoria} cor={ITEM_POR_ID.memoria.cor} onClick={() => selecionar("memoria")} />
      <Medidor nome="SSD" valor={s.ssd} cor={ITEM_POR_ID.ssd.cor} onClick={() => selecionar("ssd")} />
      <dl className="an-num">
        <div>
          <dt>Temperatura</dt>
          <dd>{Math.round(s.temperatura)} °C</dd>
        </div>
        <div>
          <dt>Potência</dt>
          <dd>{Math.round(s.potencia)} W</dd>
        </div>
        <div>
          <dt>Ventoinhas</dt>
          <dd>{s.rpm < 100 ? "paradas" : `${Math.round(s.rpm / 10) * 10} rpm`}</dd>
        </div>
        <div>
          <dt>Banda de memória</dt>
          <dd>{Math.round(s.memoria * 200)} GB/s</dd>
        </div>
      </dl>
    </div>
  );
});

export default function Anatomia() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dicaRef = useRef<HTMLDivElement>(null);
  const topoRef = useRef<HTMLElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const ladoRef = useRef<HTMLElement>(null);
  const etqRefs = useRef<HTMLElement[]>([]);
  const linhaRefs = useRef<{ path: SVGPathElement; ponto: SVGCircleElement }[]>([]);
  const cenaRef = useRef<Cena | null>(null);
  const aoSelecionar = useRef<(id: ItemId | null) => void>(() => {});
  const modoRef = useRef<Modo>("interna");
  const hudFn = useRef<(s: Estatisticas) => void>(() => {});
  const rolagemRef = useRef<HTMLDivElement>(null);
  const tocou = useRef(false);

  const [modo, setModo] = useState<Modo>("interna");
  const [aberta, setAberta] = useState(true);
  const [explodida, setExplodida] = useState(false);
  const [camadas, setCamadas] = useState<Record<Camada, boolean>>(SEM_CAMADAS);
  const [tarefa, setTarefa] = useState<Tarefa>("ocioso");
  const [sel, setSel] = useState<ItemId | null>(null);
  const [autoGiro, setAutoGiro] = useState(false);
  const [pronta, setPronta] = useState(false);
  const [erro, setErro] = useState(false);
  const [folha, setFolha] = useState(false);

  const registrarHud = useCallback((fn: (s: Estatisticas) => void) => {
    hudFn.current = fn;
  }, []);

  const margens = useCallback((): Margens => {
    const host = hostRef.current;
    const lado = ladoRef.current;
    const topo = topoRef.current;
    const dock = dockRef.current;
    if (!host || !lado || !topo || !dock) return { left: 0, right: 0, top: 0, bottom: 0 };
    const h = host.getBoundingClientRect();
    const l = lado.getBoundingClientRect();
    const t = topo.getBoundingClientRect();
    const dk = dock.getBoundingClientRect();
    if (h.width < 900) {
      return { left: 0, right: 0, top: Math.max(t.bottom, dk.bottom) - h.top + 4, bottom: Math.max(0, h.bottom - l.top) + 4 };
    }
    return { left: 0, right: Math.max(0, h.right - l.left) + 8, top: t.bottom - h.top + 4, bottom: Math.max(0, h.bottom - dk.top) + 8 };
  }, []);

  // cria a cena (three.js e gsap só são baixados aqui)
  useEffect(() => {
    let cancelado = false;
    let cena: Cena | null = null;
    const canvas = canvasRef.current;
    const onPerdido = (e: Event) => {
      e.preventDefault();
      setErro(true);
    };
    (async () => {
      try {
        const { criarCena } = await import("./cena");
        if (cancelado || !canvas || !hostRef.current || !dicaRef.current) return;
        cena = criarCena({
          canvas,
          host: hostRef.current,
          etiquetas: etqRefs.current,
          linhas: linhaRefs.current,
          dica: dicaRef.current,
          reduzir: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
          margens,
          inicial: { modo: "interna", aberta: true, explodida: false, camadas: SEM_CAMADAS, tarefa: "ocioso" },
          onSelect: (id) => aoSelecionar.current(id),
          onStats: (s) => hudFn.current(s),
        });
        cenaRef.current = cena;
        canvas.addEventListener("webglcontextlost", onPerdido);
        setPronta(true);
      } catch {
        if (!cancelado) setErro(true);
      }
    })();
    return () => {
      cancelado = true;
      canvas?.removeEventListener("webglcontextlost", onPerdido);
      cena?.dispose();
      cenaRef.current = null;
    };
  }, [margens]);

  // abertura animada: depois de montar, a vista explode sozinha uma vez (se a pessoa ainda não mexeu)
  useEffect(() => {
    if (!pronta || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => {
      if (!tocou.current) setExplodida(true);
    }, 900);
    return () => window.clearTimeout(t);
  }, [pronta]);

  useEffect(() => cenaRef.current?.setModo(modo), [modo, pronta]);
  useEffect(() => cenaRef.current?.setAberta(aberta), [aberta, pronta]);
  useEffect(() => cenaRef.current?.setExplodida(explodida), [explodida, pronta]);
  useEffect(() => cenaRef.current?.setTarefa(tarefa), [tarefa, pronta]);
  useEffect(() => cenaRef.current?.setAutoGiro(autoGiro), [autoGiro, pronta]);
  useEffect(() => {
    for (const c of Object.keys(camadas) as Camada[]) cenaRef.current?.setCamada(c, camadas[c]);
  }, [camadas, pronta]);
  useEffect(() => {
    if (sel) rolagemRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    const t = window.setTimeout(() => cenaRef.current?.atualizarMargens(), 60);
    return () => window.clearTimeout(t);
  }, [sel, folha, pronta]);

  const mexeu = () => {
    tocou.current = true;
  };
  const escolherModo = (m: Modo) => {
    mexeu();
    setModo(m);
    if (m === "externa") {
      setAberta(false);
      setExplodida(false);
      setCamadas(SEM_CAMADAS);
    } else if (m === "interna") {
      setAberta(true);
      setExplodida(false);
      setCamadas(SEM_CAMADAS);
    } else {
      setAberta(true);
      setExplodida(true);
      setCamadas(TODAS_CAMADAS);
    }
  };
  useEffect(() => {
    modoRef.current = modo;
    aoSelecionar.current = (id) => {
      setSel(id);
      if (id) setFolha(true);
      // peça interna escolhida com a carcaça fechada: abre para mostrá-la
      if (id && modoRef.current === "externa" && !EXTERNOS.has(id)) escolherModo("interna");
    };
  });
  const escolherTarefa = (t: Tarefa) => {
    mexeu();
    setTarefa(t);
    if (modo === "externa") escolherModo("fluxo");
  };
  const selecionar = useCallback((id: ItemId | null) => {
    tocou.current = true;
    cenaRef.current?.selecionar(id, true);
  }, []);
  const camera = (fn: (c: Cena) => void) => {
    mexeu();
    if (cenaRef.current) fn(cenaRef.current);
  };

  const item = sel ? ITEM_POR_ID[sel] : null;
  const tarefaAtual = TAREFAS.find((t) => t.id === tarefa);
  const modoAtual = MODOS.find((m) => m.id === modo);

  if (erro) {
    return (
      <main className="an an-sem3d">
        <header className="an-top">
          <Link className="an-voltar" href="/">
            ← Portfólio
          </Link>
          <h1>Anatomia do MacBook Pro com M1 Pro</h1>
        </header>
        <p className="an-aviso">
          Não foi possível iniciar o modelo 3D neste aparelho (falta suporte a WebGL ou a memória acabou). Abaixo está a ficha técnica de cada componente.
        </p>
        <ul className="an-fichas">
          {ITENS.map((i) => (
            <li key={i.id} style={corVar(i.cor)}>
              <h2>{i.nome}</h2>
              <p className="an-cat">{i.categoria}</p>
              <p>{i.funcao}</p>
              <p>{i.fluxo}</p>
              <dl>
                {i.specs.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
      </main>
    );
  }

  return (
    <main className="an" data-modo={modo}>
      <header className="an-top" ref={topoRef}>
        <Link className="an-voltar" href="/">
          <span aria-hidden="true">←</span> Portfólio
        </Link>
        <div className="an-titulo">
          <h1>Anatomia do MacBook Pro</h1>
          <p>Chip Apple M1 Pro · ilustração técnica simplificada</p>
        </div>
        <div className="an-modos" role="group" aria-label="Modo de visualização">
          {MODOS.map((m) => (
            <button key={m.id} type="button" aria-pressed={modo === m.id} onClick={() => escolherModo(m.id)}>
              {m.nome}
            </button>
          ))}
        </div>
      </header>

      <div className="an-palco" ref={hostRef}>
        <canvas
          ref={canvasRef}
          className="an-gl"
          tabIndex={0}
          role="img"
          aria-label="Modelo 3D interativo de um MacBook Pro. Arraste para girar, use a roda do mouse ou dois dedos para aproximar e clique nas peças. Com o teclado: setas giram, mais e menos aproximam."
        />
        <svg className="an-linhas" aria-hidden="true">
          {ETIQUETAS.map((e, i) => (
            <g key={`${e.item}-${e.piece}`} style={corVar(ITEM_POR_ID[e.item].cor)}>
              <path
                ref={(el) => {
                  if (el) (linhaRefs.current[i] ??= {} as { path: SVGPathElement; ponto: SVGCircleElement }).path = el;
                }}
              />
              <circle
                r="3.5"
                ref={(el) => {
                  if (el) (linhaRefs.current[i] ??= {} as { path: SVGPathElement; ponto: SVGCircleElement }).ponto = el;
                }}
              />
            </g>
          ))}
        </svg>
        <div className="an-etiquetas">
          {ETIQUETAS.map((e, i) => (
            <button
              key={`${e.item}-${e.piece}`}
              type="button"
              className="an-etq"
              data-on="0"
              data-sel={sel === e.item ? "1" : "0"}
              style={corVar(ITEM_POR_ID[e.item].cor)}
              ref={(el) => {
                if (el) etqRefs.current[i] = el;
              }}
              onClick={() => selecionar(e.item)}
            >
              {ITEM_POR_ID[e.item].curto}
            </button>
          ))}
        </div>
        <div className="an-dica" ref={dicaRef} aria-hidden="true" />
        {!pronta ? (
          <div className="an-carga" role="status">
            Montando o MacBook…
          </div>
        ) : null}
        <p className="an-ajuda" aria-hidden="true">
          Arraste para girar · role para aproximar · clique nas peças
        </p>
      </div>

      <div className="an-dock" ref={dockRef} role="toolbar" aria-label="Controles do modelo">
        <div className="an-grupo">
          <button type="button" aria-pressed={aberta} onClick={() => (mexeu(), setAberta((v) => !v))}>
            {aberta ? "Fechar carcaça" : "Abrir carcaça"}
          </button>
          <button type="button" aria-pressed={explodida} onClick={() => (mexeu(), setExplodida((v) => !v))}>
            Vista explodida
          </button>
        </div>
        <div className="an-grupo" role="group" aria-label="Animações">
          {CAMADAS.map((c) => (
            <button
              key={c.id}
              type="button"
              className="an-camada"
              style={corVar(c.cor)}
              aria-pressed={camadas[c.id]}
              title={c.texto}
              onClick={() => (mexeu(), setCamadas((v) => ({ ...v, [c.id]: !v[c.id] })))}
            >
              <i aria-hidden="true" />
              {c.nome}
            </button>
          ))}
        </div>
        <div className="an-grupo" role="group" aria-label="Câmera">
          <button type="button" className="an-ico" aria-label="Girar para a esquerda" onClick={() => camera((c) => c.girar(-0.3))}>
            ‹
          </button>
          <button type="button" className="an-ico" aria-label="Girar para a direita" onClick={() => camera((c) => c.girar(0.3))}>
            ›
          </button>
          <button type="button" className="an-ico" aria-label="Afastar" onClick={() => camera((c) => c.zoom(1.2))}>
            −
          </button>
          <button type="button" className="an-ico" aria-label="Aproximar" onClick={() => camera((c) => c.zoom(0.83))}>
            +
          </button>
          <button type="button" aria-pressed={autoGiro} onClick={() => (mexeu(), setAutoGiro((v) => !v))}>
            Giro automático
          </button>
          <button type="button" onClick={() => camera((c) => c.reiniciarVista())}>
            Reiniciar vista
          </button>
        </div>
      </div>

      <aside className="an-lado" ref={ladoRef} data-aberta={folha ? "1" : "0"} aria-label="Detalhes e simulação">
        <button type="button" className="an-alca" aria-expanded={folha} onClick={() => setFolha((v) => !v)}>
          <span aria-hidden="true" />
          {item ? item.nome : "Detalhes e simulação"}
        </button>
        <div className="an-rolagem" ref={rolagemRef}>
          <section className="an-cartao an-info" aria-live="polite">
            {item ? (
              <>
                <div className="an-info-topo" style={corVar(item.cor)}>
                  <p className="an-cat">{item.categoria}</p>
                  <button type="button" className="an-fechar" aria-label="Limpar seleção" onClick={() => selecionar(null)}>
                    ×
                  </button>
                </div>
                <h2 style={corVar(item.cor)}>{item.nome}</h2>
                <h3>Função</h3>
                <p>{item.funcao}</p>
                <h3>No funcionamento</h3>
                <p>{item.fluxo}</p>
                <h3>Especificações</h3>
                <dl className="an-specs">
                  {item.specs.map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
                <h3>Localização</h3>
                <Mapa id={item.id} />
              </>
            ) : (
              <>
                <h2>Explore por dentro</h2>
                <p>
                  Clique em uma peça do modelo, em uma etiqueta ou na lista abaixo para ver função, especificações e onde ela fica. {modoAtual?.dica}
                </p>
              </>
            )}
            <h3>Componentes</h3>
            <ul className="an-lista">
              {ITENS.map((i) => (
                <li key={i.id}>
                  <button type="button" style={corVar(i.cor)} aria-pressed={sel === i.id} onClick={() => selecionar(sel === i.id ? null : i.id)}>
                    <i aria-hidden="true" />
                    {i.curto}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="an-cartao an-sim">
            <h2>Simulação de tarefas</h2>
            <div className="an-tarefas" role="group" aria-label="Tarefa em execução">
              {TAREFAS.map((t) => (
                <button key={t.id} type="button" aria-pressed={tarefa === t.id} onClick={() => escolherTarefa(t.id)}>
                  {t.nome}
                </button>
              ))}
            </div>
            <p className="an-tarefa-txt">{tarefaAtual?.texto}</p>
            <Hud registrar={registrarHud} selecionar={selecionar} />
            <p className="an-nota">Valores simulados para ilustrar o fluxo; não são medições reais.</p>
          </section>
        </div>
      </aside>
    </main>
  );
}
