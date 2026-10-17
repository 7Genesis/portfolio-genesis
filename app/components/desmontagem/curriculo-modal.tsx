"use client";

import { useRef, useState } from "react";
import { CV_FILE, CV_URL } from "./content";
import { useModal } from "./use-modal";

type Props = { open: boolean; onClose: () => void };

/** Mostra o currículo na tela; baixar é uma escolha dentro do modal. */
export function CurriculoModal({ open, onClose }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // o PDF só é carregado na primeira abertura e fica no cache do iframe depois
  const [seen, setSeen] = useState(false);
  if (open && !seen) setSeen(true);

  useModal(open, onClose, boxRef, closeRef);

  return (
    <div
      className={`dm-cvm${open ? " on" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Currículo de Genesis Melo"
      aria-hidden={!open}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dm-cvbox" ref={boxRef}>
        <div className="dm-cvhead">
          <span>Currículo · Genesis Melo</span>
          <div className="dm-cvbtns">
            <a className="dm-b dm-p" href={CV_URL} download={CV_FILE} tabIndex={open ? 0 : -1}>
              Baixar PDF
            </a>
            <a className="dm-b" href={CV_URL} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>
              Abrir em nova aba
            </a>
            <button className="dm-b" type="button" ref={closeRef} onClick={onClose} tabIndex={open ? 0 : -1}>
              Fechar ✕
            </button>
          </div>
        </div>
        {seen ? <iframe title="Currículo em PDF" src={`${CV_URL}#view=FitH`} /> : null}
      </div>
    </div>
  );
}
