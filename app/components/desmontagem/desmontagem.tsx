"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { CREDITS, type ModalName } from "./content";
import { ContatoModal } from "./contato-modal";
import { CurriculoModal } from "./curriculo-modal";
import { ExperienciaModal } from "./experiencia-modal";
import { PerfilModal } from "./perfil-modal";
import { ProjetosModal } from "./projetos-modal";
import SimpleSite from "./simple-site";
import type { Fonts } from "./screens";
import "./desmontagem.css";

// a cena (three.js) fica em um pacote separado e só é baixada no modo 3D
const Stage3D = dynamic(() => import("./stage-3d"), { ssr: false });

type Detected = { mode: "pending" | "3d" | "simple"; capable: boolean };

const SERVER: Detected = { mode: "pending", capable: false };
let cached: Detected | null = null;

function hasWebgl() {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}

/** Decide uma vez, no navegador, se o aparelho roda a versão 3D. */
function detect(): Detected {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const wide = window.innerWidth >= 860;
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const weak = (nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) <= 2 || !!nav.connection?.saveData;
  const param = new URLSearchParams(window.location.search).get("modo");
  const gl = hasWebgl();
  const capable = wide && gl;
  if (param === "simples") return { mode: "simple", capable };
  if (param === "3d" && gl) return { mode: "3d", capable: true };
  return { mode: capable && !calm && !weak ? "3d" : "simple", capable };
}

const subscribe = () => () => {};
const getSnapshot = () => (cached ??= detect());
const getServerSnapshot = () => SERVER;

type Props = { className?: string; fonts: Fonts };

export default function Desmontagem({ className = "", fonts }: Props) {
  const detected = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [forced, setForced] = useState<"3d" | "simple" | null>(null);
  const [modal, setModal] = useState<ModalName | null>(null);
  const openModal = useCallback((m: ModalName) => setModal(m), []);
  const closeModal = useCallback(() => setModal(null), []);
  const toSimple = useCallback(() => {
    setForced("simple");
    window.scrollTo({ top: 0 });
  }, []);
  const to3d = useCallback(() => {
    setForced("3d");
    window.scrollTo({ top: 0 });
  }, []);

  const mode = forced ?? detected.mode;

  return (
    <div className={`dm ${className}`} data-mode={mode}>
      {mode === "3d" ? (
        <Stage3D fonts={fonts} onModal={openModal} onFail={toSimple} onSimple={toSimple} />
      ) : (
        <SimpleSite onModal={openModal} on3d={detected.capable ? to3d : undefined} />
      )}

      {mode === "pending" ? (
        <div className="dm-boot" aria-hidden="true">
          <div className="dm-ld">
            <span className="dm-logo">
              genesis<i>.</i>melo
            </span>
            <p>Montando o MacBook…</p>
          </div>
        </div>
      ) : null}

      <footer className="dm-foot">
        <p>
          Modelos 3D sob licença{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">
            CC BY 4.0
          </a>{" "}
          (Sketchfab):{" "}
          {CREDITS.map((c, i) => (
            <span key={c.work}>
              “{c.work}”, de {c.author}
              {i < CREDITS.length - 1 ? "; " : "."}
            </span>
          ))}{" "}
          Capturas de tela e textos são do próprio portfólio.
        </p>
        <p>© Genesis Melo · Juazeiro, BA</p>
      </footer>

      <CurriculoModal open={modal === "cv"} onClose={closeModal} />
      <ContatoModal open={modal === "msg"} onClose={closeModal} />
      <PerfilModal open={modal === "perfil"} onClose={closeModal} />
      <ProjetosModal open={modal === "projetos"} onClose={closeModal} />
      <ExperienciaModal open={modal === "experiencia"} onClose={closeModal} onModal={openModal} />
    </div>
  );
}
