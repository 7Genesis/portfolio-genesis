"use client";

import Image from "next/image";
import { useState } from "react";
import { GITHUB, LINKEDIN } from "./content";
import { ModalShell } from "./modal-shell";

/** Cartão do perfil. O LinkedIn não deixa o perfil ser exibido dentro de outro site, então o cartão resume e leva ao perfil. */
export function PerfilModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(LINKEDIN);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copie o link do perfil:", LINKEDIN);
    }
  };
  return (
    <ModalShell open={open} onClose={onClose} label="Perfil de Genesis Melo no LinkedIn" title="Perfil · LinkedIn">
      <div className="dm-profile">
        <Image src="/genesis-melo.jpg" alt="Foto de Genesis Melo" width={96} height={96} />
        <div>
          <h3>Genesis Melo</h3>
          <p className="dm-role">Desenvolvedor Backend e Full Stack Júnior</p>
          <p className="dm-hint">Juazeiro, BA · busco vaga remota Full Stack ou Backend</p>
        </div>
      </div>
      <ul className="dm-facts">
        <li>Estagiário Full Stack no SAAE Juazeiro (desde ago/2026)</li>
        <li>App do cidadão na Google Play, com 185 testes automatizados</li>
        <li>Projetos próprios com CI: LeadFlow Engine, StockFlow e CreditFlow</li>
      </ul>
      <div className="dm-btns">
        <a className="dm-b dm-p" href={LINKEDIN} target="_blank" rel="noopener noreferrer">
          Abrir perfil no LinkedIn
        </a>
        <button className="dm-b" type="button" onClick={copy}>
          {copied ? "Link copiado ✓" : "Copiar link"}
        </button>
        <a className="dm-b" href={GITHUB} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </div>
    </ModalShell>
  );
}
