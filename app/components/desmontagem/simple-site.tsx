"use client";

import { CV_URL, EXPERIENCE, PROJECTS, STACK, STEPS, LINKEDIN, type ModalName } from "./content";
import { ActionLink } from "./ui";
import { ProjectCard } from "./project-card";

type Props = {
  onModal: (m: ModalName) => void;
  /** só aparece quando o aparelho aguenta a experiência 3D */
  on3d?: () => void;
};

/** Versão simples: sem 3D, leve e acessível. Serve celular, economia de energia e quem prefere menos movimento. */
export default function SimpleSite({ onModal, on3d }: Props) {
  const hero = STEPS[0];
  const contact = STEPS[7];
  return (
    <div className="dm-simple">
      <noscript>
        <style>{".dm-boot{display:none!important}"}</style>
      </noscript>
      <header className="dm-shead">
        <span className="dm-logo">
          genesis<i>.</i>melo
        </span>
        <nav aria-label="Principal">
          <a href="#projetos">Projetos</a>
          <a href="#stack">Stack</a>
          <a href="#experiencia">Experiência</a>
          <a href="#contato">Contato</a>
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

      <main>
        <section className="dm-hero" aria-labelledby="dm-h1">
          <small className="dm-kick">Perfil</small>
          <h1 id="dm-h1">{hero.title}</h1>
          <div className="dm-role">{hero.role}</div>
          <p>{hero.text}</p>
          <div className="dm-btns">
            <a className="dm-b dm-p" href="#projetos">
              Ver projetos
            </a>
            <ActionLink action={{ label: "Currículo (PDF)", href: CV_URL, modal: "cv" }} onModal={onModal} />
            <ActionLink action={{ label: "LinkedIn", href: LINKEDIN, modal: "perfil" }} onModal={onModal} />
          </div>
          {on3d ? (
            <button type="button" className="dm-link3d" onClick={on3d}>
              Ver a experiência 3D (notebook e celular desmontando) →
            </button>
          ) : null}
        </section>

        <section id="projetos" className="dm-sec" aria-labelledby="dm-projetos">
          <small className="dm-kick">Projetos</small>
          <h2 id="dm-projetos">O que construí</h2>
          <div className="dm-cards">
            {PROJECTS.map((p) => (
              <ProjectCard key={p.id} p={p} />
            ))}
          </div>
        </section>

        <section id="stack" className="dm-sec" aria-labelledby="dm-stack">
          <small className="dm-kick">Stack</small>
          <h2 id="dm-stack">Do navegador ao banco de dados</h2>
          <div className="dm-stackgrid">
            {STACK.map((g) => (
              <div key={g.group}>
                <h3>{g.group}</h3>
                <div className="dm-chips">
                  {g.items.map((c) => (
                    <span key={c}>{c}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="experiencia" className="dm-sec" aria-labelledby="dm-exp">
          <small className="dm-kick">Experiência</small>
          <h2 id="dm-exp">{STEPS[6].title}</h2>
          <p className="dm-lead">{STEPS[6].text}</p>
          <ol className="dm-timeline">
            {EXPERIENCE.map((e) => (
              <li key={e.what}>
                <span>{e.when}</span>
                <b>{e.what}</b>
                {e.detail ? <p>{e.detail}</p> : null}
              </li>
            ))}
          </ol>
        </section>

        <section id="contato" className="dm-sec" aria-labelledby="dm-contato">
          <small className="dm-kick">Contato</small>
          <h2 id="dm-contato">{contact.title}</h2>
          <p className="dm-lead">{contact.text}</p>
          <div className="dm-btns">
            {contact.actions?.map((a) => <ActionLink key={a.label} action={a} onModal={onModal} />)}
          </div>
        </section>
      </main>
    </div>
  );
}
