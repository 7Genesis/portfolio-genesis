'use client';

import { useState, type KeyboardEvent } from 'react';
import { ArrowUpRight } from './ui';

const systems = [
  {
    id: 'leadflow',
    number: '01',
    name: 'LeadFlow Engine',
    category: 'Distribuição de leads',
    description:
      'Uma API recebe leads por webhook, coloca o trabalho na fila e distribui cada oportunidade em rodízio entre vendedores.',
    stack: ['NestJS', 'Redis', 'Prisma', 'PostgreSQL'],
    steps: [
      { title: 'Entrada', detail: 'Webhook' },
      { title: 'Validação', detail: 'NestJS · DTO' },
      { title: 'Fila', detail: 'Redis · BullMQ' },
      { title: 'Distribuição', detail: 'Round-robin' },
    ],
    href: 'https://github.com/7Genesis/leadflow-engine',
    cta: 'Explorar código',
  },
  {
    id: 'atendimento',
    number: '02',
    name: 'Atendimento SAAE',
    category: 'WhatsApp + integração',
    description:
      'Uma conversa no WhatsApp atravessa o chatbot, consulta o GSAN e pode seguir para a equipe de atendimento com histórico e contexto.',
    stack: ['Python', 'Django', 'Celery', 'Redis'],
    steps: [
      { title: 'Conversa', detail: 'WhatsApp' },
      { title: 'Assistente', detail: 'Django · IA' },
      { title: 'Integração', detail: 'GSAN · Celery' },
      { title: 'Atendimento', detail: 'Equipe humana' },
    ],
    href: null,
    cta: 'Sistema interno · código privado',
  },
  {
    id: 'app-cidadao',
    number: '03',
    name: 'App do cidadão SAAE',
    category: 'Aplicativo em produção',
    description:
      'O cidadão consulta faturas e serviços pelo aplicativo. A experiência mobile consome APIs REST e já está publicada na Google Play.',
    stack: ['React Native', 'TypeScript', 'API REST', '185 testes'],
    steps: [
      { title: 'Cidadão', detail: 'Faturas · serviços' },
      { title: 'Aplicativo', detail: 'React Native' },
      { title: 'Integração', detail: 'API · TypeScript' },
      { title: 'Publicação', detail: 'Google Play' },
    ],
    href: 'https://play.google.com/store/apps/details?id=com.saaejuazeiro.app',
    cta: 'Ver na Google Play',
  },
] as const;

export default function SystemLab() {
  const [activeId, setActiveId] = useState<(typeof systems)[number]['id']>('leadflow');
  const active = systems.find((system) => system.id === activeId) ?? systems[0];

  function moveTabFocus(event: KeyboardEvent<HTMLDivElement>) {
    if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const currentIndex = tabs.indexOf(document.activeElement as HTMLButtonElement);
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? tabs.length - 1
        : (currentIndex + (event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1) + tabs.length) % tabs.length;
    tabs[nextIndex]?.focus();
    tabs[nextIndex]?.click();
  }

  return (
    <section aria-label="Arquitetura dos projetos em destaque" className="system-lab mt-16">
      <div className="system-lab__topline">
        <span className="system-lab__live-dot" aria-hidden="true" />
        <span>System lab</span>
        <span className="system-lab__topline-right">Fluxo de uma requisição</span>
      </div>

      <div className="system-lab__body">
        <div className="system-lab__selector">
          <p className="system-lab__kicker">Escolha um sistema</p>
          <div className="system-lab__tabs" role="tablist" aria-label="Projetos em destaque" onKeyDown={moveTabFocus}>
            {systems.map((system) => (
              <button
                key={system.id}
                type="button"
                role="tab"
                aria-selected={system.id === active.id}
                aria-controls="system-lab-panel"
                id={`system-tab-${system.id}`}
                className={`system-lab__tab${system.id === active.id ? ' is-active' : ''}`}
                onClick={() => setActiveId(system.id)}
              >
                <span className="system-lab__tab-index">{system.number}</span>
                <span>{system.name}</span>
                <span className="system-lab__tab-arrow" aria-hidden="true">↗</span>
              </button>
            ))}
          </div>

          <div
            className="system-lab__details"
            role="tabpanel"
            id="system-lab-panel"
            aria-labelledby={`system-tab-${active.id}`}
            tabIndex={0}
            key={active.id}
          >
            <p className="system-lab__category">{active.category}</p>
            <h3>{active.name}</h3>
            <p className="system-lab__description">{active.description}</p>
            <div className="system-lab__stack" aria-label="Tecnologias usadas">
              {active.stack.map((tech) => <span key={tech}>{tech}</span>)}
            </div>
            {active.href ? (
              <a className="system-lab__link" href={active.href} target="_blank" rel="noreferrer">
                {active.cta}<ArrowUpRight className="h-4 w-4" />
              </a>
            ) : (
              <span className="system-lab__private">{active.cta}</span>
            )}
          </div>
        </div>

        <div className="system-lab__visual" aria-label={`Fluxo do sistema ${active.name}`}>
          <div className="system-lab__visual-head">
            <span>REQUEST LIFECYCLE</span>
            <span className="system-lab__request-id">REQ_{active.number}_7F2A</span>
          </div>
          <div className="system-lab__pipeline" key={active.id}>
            {active.steps.map((step, index) => (
              <div className="system-lab__step-wrap" key={step.title}>
                <div className={`system-lab__node${index === active.steps.length - 1 ? ' is-destination' : ''}`}>
                  <span className="system-lab__node-index">0{index + 1}</span>
                  <strong>{step.title}</strong>
                  <span className="system-lab__node-detail">{step.detail}</span>
                </div>
                {index < active.steps.length - 1 && (
                  <div className="system-lab__connector" aria-hidden="true">
                    <span className="system-lab__connector-line" />
                    <span className="system-lab__packet" />
                    <span className="system-lab__connector-arrow">›</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="system-lab__log" aria-live="polite">
            <span className="system-lab__log-mark">&gt;_</span>
            <span>{active.steps[0].detail} <b>→</b> {active.steps.at(-1)?.detail}</span>
            <span className="system-lab__log-status">FLOW COMPLETE</span>
          </div>
          <div className="system-lab__corner system-lab__corner--tl" />
          <div className="system-lab__corner system-lab__corner--br" />
        </div>
      </div>
    </section>
  );
}
