import React from 'react';
import Nav from './components/nav';
import ScrollStage from './components/scroll-stage';
import AppProof from './components/app-proof';
import { Reveal } from './components/animations';
import { ArrowUpRight } from './components/ui';
import RevealFailsafe from './components/reveal-failsafe';

const featured = [
  {
    n: '01', title: 'LeadFlow Engine', note: 'Backend · NestJS',
    description: 'Uma API recebe leads por webhook, valida os dados, organiza o trabalho no Redis e distribui cada oportunidade entre vendedores em rodízio.',
    stack: 'NestJS · Redis · BullMQ · Prisma · PostgreSQL',
    href: 'https://github.com/7Genesis/leadflow-engine', link: 'Explorar repositório',
  },
  {
    n: '02', title: 'Atendimento SAAE', note: 'Produto em produção · Python',
    description: 'Atendimento por WhatsApp integrado ao GSAN. O chatbot consulta informações, evita solicitações duplicadas e transfere conversas à equipe com contexto.',
    stack: 'Python · Django · Celery · Redis · pytest',
    href: null, link: 'Projeto interno · código da equipe',
  },
  {
    n: '03', title: 'App do cidadão', note: 'Google Play · React Native',
    description: 'Reescrita do aplicativo de Flutter para React Native e TypeScript. Faturas, serviços e chamados em um app com 185 testes automatizados.',
    stack: 'React Native · Expo · TypeScript · 185 testes',
    href: 'https://play.google.com/store/apps/details?id=com.saaejuazeiro.app', link: 'Ver na Google Play',
  },
];

const otherWork = [
  { title: 'CoreAcademy MeetPoint', kind: 'SaaS multi-tenant', href: 'https://novalab.me/meetpoint' },
  { title: 'CreditFlow', kind: 'API · .NET · Clean Architecture', href: 'https://github.com/7Genesis/CreditFlow' },
  { title: 'StockFlow', kind: 'Produto web · Next.js', href: 'https://stockflow-cyan.vercel.app' },
];

const webWork = [
  { title: 'Docctor Med · Jacarepaguá', kind: 'SEO local', href: 'https://docctormedjacarepagua.com.br/odontologia/' },
  { title: 'Docctor Med · Caxias do Sul', kind: 'Performance', href: 'https://docctormedcaxiasdosul.com.br/odontologia/' },
  { title: 'NovaLab', kind: 'Site institucional', href: 'https://novalab.me/' },
  { title: 'StarFit · Transnordestina', kind: 'Página de vendas', href: 'https://starfitpnz.com.br/transnordestina/' },
  { title: 'ConectaLab', kind: 'Captação de leads', href: 'https://lp.novalab.me/conectalab/' },
];

const experience = [
  { period: '2024 — 2025', title: 'Consultor de Vendas', company: 'Grupo Batalha', text: 'Atendimento consultivo, gestão de pipeline no CRM e relacionamento com clientes. A experiência me ensinou a ouvir antes de propor uma solução.' },
  { period: '2025 — 2026', title: 'Assistente de Compras', company: 'Gráfica Copylan', text: 'Negociação com fornecedores, acompanhamento de pedidos e controles operacionais. Redução de cerca de 10% nos custos negociados.' },
  { period: '2026', title: 'Gestor de Tráfego Pago', company: 'NovaLab', text: 'Campanhas de aquisição com Meta Pixel, Conversion API e GTM. Rotina orientada por CPA, CPC, CTR e ROAS.' },
  { period: '2025 — atual', title: 'Desenvolvedor Backend', company: 'Projetos próprios e freelance', text: 'APIs, automações, produtos web e landing pages. Do levantamento do problema ao deploy e acompanhamento.' },
  { period: '2026 — atual', title: 'Estagiário de Desenvolvimento', company: 'SAAE Juazeiro', text: 'Integrações em Python/Django, atendimento por WhatsApp, colaboração em pull requests e reescrita do app do cidadão em React Native.' },
];

const repositories = [
  ['finance-control-api', 'TypeScript', 'API financeira com PostgreSQL, JWT e dashboard Next.js.'],
  ['chatlab', 'Java', 'Hub de atendimento multi-tenant com Spring Boot e PostgreSQL.'],
  ['Sistema-de-Notifica-o-de-Falta-de-gua-por-Bairro', 'Python', 'Ocorrências de falta de água por bairro, com painel e mapa.'],
  ['tinder-pet', 'TypeScript', 'Protótipo de adoção de pets para ONGs.'],
  ['Industry-control-system', 'Java', 'Sugestão de produção com base no estoque e valor dos produtos.'],
  ['Ethan', 'Dart', 'Plataforma B2B de cotação e compras com validação de XML.'],
];

function FolioLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return <div className="folio-label"><span>{n}</span><span>{children}</span></div>;
}

export default function Portfolio() {
  return (
    <main className="portfolio-folio">
      <RevealFailsafe />
      <Nav />
      <ScrollStage />

      <section id="sobre" className="folio-intro">
        <div className="folio-origin" aria-label="A trajetória de Genesis: pessoas, processos e tecnologia">
          <span className="folio-origin__index">CAMPO DE ESTUDO · 01</span>
          <div className="folio-origin__drawing" aria-hidden="true">
            <svg viewBox="0 0 440 420" role="presentation">
              <path d="M54 98 C152 38 157 204 242 180 S311 98 385 136 C441 164 390 264 313 254 S221 209 183 288 C146 366 86 334 54 280" />
              <path className="folio-origin__thread folio-origin__thread--thin" d="M66 103 C155 53 161 215 241 191 S316 111 374 144 C423 173 383 249 313 242 S219 218 174 292 C140 349 98 327 65 276" />
              <circle cx="54" cy="98" r="8" /><circle cx="242" cy="180" r="8" /><circle cx="313" cy="254" r="8" /><circle cx="54" cy="280" r="8" />
            </svg>
            <span className="folio-origin__label folio-origin__label--one">pessoas</span>
            <span className="folio-origin__label folio-origin__label--two">processos</span>
            <span className="folio-origin__label folio-origin__label--three">software</span>
          </div>
          <span className="folio-origin__caption">Do atendimento à arquitetura.<br />O fio sempre foi entender como as coisas funcionam.</span>
        </div>
        <div className="folio-intro__copy">
          <FolioLabel n="01">De onde eu venho</FolioLabel>
          <Reveal>
            <h2>Antes do código, <i>o problema.</i></h2>
            <p className="folio-intro__lead">Passei por vendas, compras e marketing antes de encontrar na tecnologia uma forma de resolver as coisas que eu via de perto.</p>
            <p>Hoje curso Ciência da Computação e Engenharia de Software. No SAAE de Juazeiro, trabalho em sistemas usados por moradores e pela equipe de atendimento. Gosto de entender o fluxo inteiro: quem precisa, o que acontece com os dados e como saber se a solução funcionou.</p>
          </Reveal>
          <div className="folio-intro__facts">
            <div><strong>185</strong><span>testes automatizados no app</span></div>
            <div><strong>8 mil</strong><span>linhas migradas de Dart</span></div>
            <div><strong>10+</strong><span>repositórios públicos</span></div>
          </div>
        </div>
      </section>

      <section id="projetos" className="folio-projects">
        <div className="folio-section-head">
          <FolioLabel n="02">Trabalho selecionado</FolioLabel>
          <Reveal><h2>Software em uso.<br /><i>Problemas resolvidos.</i></h2></Reveal>
        </div>

        <div className="folio-project-list">
          {featured.map((project) => (
            <article className="folio-project" key={project.n}>
              <span className="folio-project__number">{project.n}</span>
              <div className="folio-project__main">
                <span className="folio-project__note">{project.note}</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="folio-project__bottom">
                  <span>{project.stack}</span>
                  {project.href ? <a href={project.href} target="_blank" rel="noreferrer">{project.link}<ArrowUpRight /></a> : <span className="folio-private">{project.link}</span>}
                </div>
              </div>
              <div className="folio-project__gesture" aria-hidden="true">
                {project.n === '01' ? <span className="gesture-flow"><i>entrada</i><b>→</b><i>fila</i><b>→</b><i>entrega</i></span> : project.n === '02' ? <span className="gesture-chat"><i>morador</i><b>↗</b><i>equipe</i></span> : <span className="gesture-app"><i>185</i><small>checks</small></span>}
              </div>
            </article>
          ))}
        </div>

        <AppProof />

        <div className="folio-indexes">
          <div>
            <span className="folio-indexes__heading">Outros sistemas</span>
            {otherWork.map((item) => <a key={item.title} href={item.href} target="_blank" rel="noreferrer"><span>{item.title}</span><small>{item.kind}</small><ArrowUpRight /></a>)}
          </div>
          <div>
            <span className="folio-indexes__heading">Web para clientes</span>
            {webWork.map((item) => <a key={item.title} href={item.href} target="_blank" rel="noreferrer"><span>{item.title}</span><small>{item.kind}</small><ArrowUpRight /></a>)}
          </div>
        </div>
      </section>

      <section id="stack" className="folio-stack">
        <div className="folio-stack__intro">
          <FolioLabel n="03">Ferramentas</FolioLabel>
          <Reveal><h2>O que uso<br />para <i>fazer acontecer.</i></h2></Reveal>
        </div>
        <div className="folio-stack__columns">
          <div><span>01 / SERVIÇOS</span><h3>Backend</h3><p>Node.js · NestJS · Python · Django · .NET · REST · JWT</p></div>
          <div><span>02 / DADOS</span><h3>Persistência</h3><p>PostgreSQL · Redis · Prisma · SQL · Celery · BullMQ</p></div>
          <div><span>03 / PRODUTO</span><h3>Aplicações</h3><p>TypeScript · React · React Native · Expo · Next.js · Docker</p></div>
        </div>
      </section>

      <section id="percurso" className="folio-career">
        <div className="folio-career__head">
          <FolioLabel n="04">Percurso</FolioLabel>
          <Reveal><h2>Uma coisa levou<br />à <i>outra.</i></h2></Reveal>
          <p>Atender pessoas me levou a entender processos. Entender processos me levou a automatizá-los.</p>
        </div>
        <div className="folio-timeline">
          {experience.map((item, index) => (
            <article key={item.title}>
              <span className="folio-timeline__index">0{index + 1}</span>
              <span className="folio-timeline__period">{item.period}</span>
              <div><h3>{item.title}</h3><span>{item.company}</span></div>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <div className="folio-study">
          <span>EM PARALELO</span>
          <div><strong>Ciência da Computação</strong><small>Estácio · cursando</small></div>
          <div><strong>Engenharia de Software</strong><small>Unigrande · cursando</small></div>
          <div><strong>Análise de Dados</strong><small>EBAC · em andamento</small></div>
          <div><strong>Power BI · Data Science</strong><small>Data Science Academy · concluído</small></div>
        </div>
      </section>

      <section id="github" className="folio-github">
        <div className="folio-github__head"><FolioLabel n="05">Caderno aberto</FolioLabel><Reveal><h2>Outras coisas<br />que <i>construí.</i></h2></Reveal></div>
        <div className="folio-repos">
          {repositories.map(([name, language, description]) => (
            <a key={name} href={`https://github.com/7Genesis/${name}`} target="_blank" rel="noreferrer"><span>{language}</span><strong>{name}</strong><p>{description}</p><ArrowUpRight /></a>
          ))}
        </div>
        <a className="folio-all-repos" href="https://github.com/7Genesis?tab=repositories" target="_blank" rel="noreferrer">Ver todos os repositórios <ArrowUpRight /></a>
      </section>

      <footer id="contato" className="folio-footer">
        <FolioLabel n="06">Próxima conversa</FolioLabel>
        <div className="folio-footer__content"><h2>Tem um problema<br />interessante?</h2><a href="https://wa.me/5574998055726?text=Ol%C3%A1%20Genesis%2C%20vim%20pelo%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar%21" target="_blank" rel="noreferrer">Me conta. <ArrowUpRight /></a></div>
        <div className="folio-footer__bottom"><span>Genesis Melo · Desenvolvedor Full Stack Júnior</span><div><a href="https://www.linkedin.com/in/genesis-melo/" target="_blank" rel="noreferrer">LinkedIn</a><a href="mailto:genesis.melo4398@hotmail.com">E-mail</a><span>© {new Date().getFullYear()}</span></div></div>
      </footer>
    </main>
  );
}
