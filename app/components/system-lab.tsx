'use client';

import { useState, type KeyboardEvent } from 'react';
import { ArrowUpRight } from './ui';

const projects = [
  {
    id: 'leadflow',
    number: '01',
    name: 'LeadFlow Engine',
    kind: 'Backend · NestJS',
    story:
      'Leads chegam por webhook. A API valida os dados, organiza o trabalho numa fila e distribui cada oportunidade em rodízio entre vendedores.',
    stack: ['NestJS', 'Redis', 'Prisma', 'PostgreSQL'],
    steps: [
      { title: 'Lead recebido', detail: 'Webhook' },
      { title: 'Dados validados', detail: 'NestJS · DTO' },
      { title: 'Trabalho enfileirado', detail: 'Redis · BullMQ' },
      { title: 'Lead distribuído', detail: 'Rodízio entre vendedores' },
    ],
    href: 'https://github.com/7Genesis/leadflow-engine',
    cta: 'Ver código no GitHub',
  },
  {
    id: 'atendimento',
    number: '02',
    name: 'Atendimento SAAE',
    kind: 'Backend · Python',
    story:
      'Uma conversa começa no WhatsApp. O chatbot entende a solicitação, consulta o GSAN e, quando necessário, encaminha o atendimento para a equipe com o contexto.',
    stack: ['Python', 'Django', 'Celery', 'Redis'],
    steps: [
      { title: 'Morador chama', detail: 'WhatsApp' },
      { title: 'Pedido entendido', detail: 'Chatbot com IA' },
      { title: 'Informação consultada', detail: 'GSAN · Celery' },
      { title: 'Equipe dá sequência', detail: 'Atendimento humano' },
    ],
    href: null,
    cta: 'Sistema interno · código da equipe',
  },
  {
    id: 'app-cidadao',
    number: '03',
    name: 'App do cidadão SAAE',
    kind: 'Mobile · React Native',
    story:
      'O aplicativo conecta moradores aos serviços do SAAE. Reescrevi a experiência em React Native e TypeScript; o app está publicado na Google Play e tem 185 testes automatizados.',
    stack: ['React Native', 'TypeScript', 'API REST', '185 testes'],
    steps: [
      { title: 'Morador acessa', detail: 'Faturas · serviços' },
      { title: 'App organiza', detail: 'React Native' },
      { title: 'API responde', detail: 'TypeScript · REST' },
      { title: 'Disponível na loja', detail: 'Google Play' },
    ],
    href: 'https://play.google.com/store/apps/details?id=com.saaejuazeiro.app',
    cta: 'Ver o aplicativo',
  },
] as const;

export default function SystemLab() {
  const [activeId, setActiveId] = useState<(typeof projects)[number]['id']>('leadflow');
  const active = projects.find((project) => project.id === activeId) ?? projects[0];

  function moveTabFocus(event: KeyboardEvent<HTMLDivElement>) {
    if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const currentIndex = tabs.indexOf(document.activeElement as HTMLButtonElement);
    const delta = event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1;
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? tabs.length - 1
        : (currentIndex + delta + tabs.length) % tabs.length;
    tabs[nextIndex]?.focus();
    tabs[nextIndex]?.click();
  }

  return (
    <section aria-label="Veja como funcionam alguns projetos" className="system-lab mt-20">
      <div className="system-lab__heading">
        <div>
          <span className="system-lab__eyebrow">Um pouco dos bastidores</span>
          <h3>Do problema até a solução.</h3>
        </div>
        <p>Escolha um projeto e acompanhe o caminho que os dados percorrem.</p>
      </div>

      <div className="system-lab__layout">
        <div className="system-lab__selector">
          <div className="system-lab__tabs" role="tablist" aria-label="Projetos em destaque" onKeyDown={moveTabFocus}>
            {projects.map((project) => (
              <button
                key={project.id}
                type="button"
                role="tab"
                aria-selected={project.id === active.id}
                aria-controls="system-lab-panel"
                id={`system-tab-${project.id}`}
                className={`system-lab__tab${project.id === active.id ? ' is-active' : ''}`}
                onClick={() => setActiveId(project.id)}
              >
                <span className="system-lab__tab-number">{project.number}</span>
                <span className="system-lab__tab-copy">
                  <span>{project.name}</span>
                  <small>{project.kind}</small>
                </span>
                <span className="system-lab__tab-arrow" aria-hidden="true">↗</span>
              </button>
            ))}
          </div>

          <div
            className="system-lab__story"
            role="tabpanel"
            id="system-lab-panel"
            aria-labelledby={`system-tab-${active.id}`}
            tabIndex={0}
            key={active.id}
          >
            <span className="system-lab__eyebrow">{active.kind}</span>
            <h4>{active.name}</h4>
            <p>{active.story}</p>
            <div className="system-lab__stack" aria-label="Tecnologias e resultados">
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

        <div className="system-lab__glass" aria-label={`Etapas do projeto ${active.name}`}>
          <div className="system-lab__glass-reflection" aria-hidden="true" />
          <p className="system-lab__map-caption">O caminho da informação</p>
          <div className="system-lab__route" key={active.id}>
            {active.steps.map((step, index) => (
              <div className="system-lab__route-item" key={step.title}>
                <div className={`system-lab__node${index === active.steps.length - 1 ? ' is-final' : ''}${index % 2 ? ' is-offset' : ''}`}>
                  <span className="system-lab__node-dot" aria-hidden="true" />
                  <strong>{step.title}</strong>
                  <small>{step.detail}</small>
                </div>
                {index < active.steps.length - 1 && (
                  <div className="system-lab__connector" aria-hidden="true">
                    <span className="system-lab__connector-line" />
                    <span className="system-lab__traveler" />
                    <span className="system-lab__connector-arrow">→</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <span className="system-lab__glass-note" aria-hidden="true">feito para resolver problemas reais</span>
        </div>
      </div>
    </section>
  );
}
