"use client";

import { CV_URL, EXPERIENCE } from "./content";
import { ModalShell } from "./modal-shell";
import type { ModalName } from "./content";

export function ExperienciaModal({ open, onClose, onModal }: { open: boolean; onClose: () => void; onModal: (m: ModalName) => void }) {
  return (
    <ModalShell open={open} onClose={onClose} label="Experiência de Genesis Melo" title="Experiência">
      <ol className="dm-timeline">
        {EXPERIENCE.map((e) => (
          <li key={e.what}>
            <span>{e.when}</span>
            <b>{e.what}</b>
            {e.detail ? <p>{e.detail}</p> : null}
          </li>
        ))}
      </ol>
      <div className="dm-btns">
        <a
          className="dm-b dm-p"
          href={CV_URL}
          onClick={(ev) => {
            ev.preventDefault();
            onModal("cv");
          }}
        >
          Ver currículo
        </a>
        <button className="dm-b" type="button" onClick={() => onModal("projetos")}>
          Ver projetos
        </button>
      </div>
    </ModalShell>
  );
}
