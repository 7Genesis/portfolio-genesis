"use client";

import Image from "next/image";
import type { Project } from "./content";
import { ActionLink } from "./ui";

/** Cartão de projeto com capturas reais e links. Usado na versão simples e na janela "Todos os projetos". */
export function ProjectCard({ p }: { p: Project }) {
  return (
    <article className="dm-card">
      <small>{p.kind}</small>
      <h3>{p.title}</h3>
      <p>{p.text}</p>
      <div className="dm-chips">
        {p.chips.map((c) => (
          <span key={c}>{c}</span>
        ))}
      </div>
      <div className={`dm-shots${p.phone ? " phone" : ""}`}>
        {p.shots.map((s) => (
          <Image key={s.src} src={s.src} alt={s.alt} width={s.w} height={s.h} sizes={p.phone ? "(max-width:860px) 40vw, 190px" : "(max-width:860px) 78vw, 480px"} loading="lazy" />
        ))}
      </div>
      <div className="dm-btns">
        {p.links.map((l, i) => (
          <ActionLink key={l.href} action={{ label: l.label, href: l.href, primary: i === 0 }} onModal={() => {}} />
        ))}
      </div>
    </article>
  );
}
