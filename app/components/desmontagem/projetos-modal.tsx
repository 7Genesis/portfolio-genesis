"use client";

import { PROJECTS } from "./content";
import { ModalShell } from "./modal-shell";
import { ProjectCard } from "./project-card";

export function ProjetosModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <ModalShell open={open} onClose={onClose} label="Todos os projetos de Genesis Melo" title="Todos os projetos" wide>
      {open ? (
        <div className="dm-cards modal">
          {PROJECTS.map((p) => (
            <ProjectCard key={p.id} p={p} />
          ))}
        </div>
      ) : null}
    </ModalShell>
  );
}
