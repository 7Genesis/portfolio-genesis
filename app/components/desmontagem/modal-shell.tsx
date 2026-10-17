"use client";

import { useRef, type ReactNode } from "react";
import { useModal } from "./use-modal";

type Props = { open: boolean; onClose: () => void; label: string; title: string; wide?: boolean; children: ReactNode };

/** Moldura comum das janelas: título, botão fechar, foco preso e Esc. */
export function ModalShell({ open, onClose, label, title, wide, children }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useModal(open, onClose, boxRef, closeRef);
  return (
    <div
      className={`dm-cvm${open ? " on" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      aria-hidden={!open}
      inert={!open}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`dm-cvbox dm-pop${wide ? " wide" : ""}`} ref={boxRef}>
        <div className="dm-cvhead">
          <span>{title}</span>
          <button className="dm-b" type="button" ref={closeRef} onClick={onClose}>
            Fechar ✕
          </button>
        </div>
        <div className="dm-popbody">{children}</div>
      </div>
    </div>
  );
}
