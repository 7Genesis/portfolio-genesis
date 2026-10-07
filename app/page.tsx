import React from 'react';
import Nav from './components/nav';
import ScrollStage from './components/scroll-stage';
import About from './components/about';
import Constellation from './components/constellation';
import { Reveal, RevealStagger } from './components/animations';
import { ArrowUpRight } from './components/ui';
import RevealFailsafe from './components/reveal-failsafe';

// Rótulo de seção (estilo editorial: linha + texto em caixa alta)
function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] ${className}`}>
      <span className="h-px w-10 bg-current opacity-40" />
      {children}
    </div>
  );
}

interface Project {
  title: string;
  tag: string;
  desc: string;
  /** Sem link = código privado (mostra a nota no lugar do CTA). */
  href?: string;
  cta?: string;
  note?: string;
  secondaryNote?: string;
}

// Projetos full stack, com APIs e serviços backend em primeiro plano.
const systems: Project[] = [
  {
    title: 'LeadFlow Engine',
    tag: 'Backend · NestJS',
    desc: 'API que recebe leads por webhook, enfileira no Redis e distribui entre vendedores em rodízio, com painel Bull Board. NestJS, Prisma e PostgreSQL.',
    href: 'https://github.com/7Genesis/leadflow-engine',
    cta: 'Ver código no GitHub',
  },
  {
    title: 'Plataforma de atendimento do SAAE',
    tag: 'Backend · Python',
    desc: 'Plataforma de atendimento por WhatsApp com chatbot integrado ao GSAN, encaminhamento para atendente, painel e pesquisa de satisfação. Python, Django, Celery e Redis.',
    note: 'Código privado da equipe',
  },
  {
    title: 'App do cidadão do SAAE',
    tag: 'Mobile',
    desc: 'Publicado na Google Play. Reescrito de Flutter para React Native (Expo) e TypeScript, com 185 testes automatizados. Faturas, serviços e chamados.',
    href: 'https://play.google.com/store/apps/details?id=com.saaejuazeiro.app',
    cta: 'Ver na Google Play',
    secondaryNote: 'Código privado da equipe',
  },
  {
    title: 'CoreAcademy MeetPoint',
    tag: 'Backend · SaaS',
    desc: 'Plataforma white-label e multi-tenant com cursos, comunidades, chat, vagas, eventos, pagamentos e proteção de dados sensíveis. NestJS, Prisma e React.',
    href: 'https://novalab.me/meetpoint',
    cta: 'Ver demonstração',
  },
  {
    title: 'CreditFlow',
    tag: 'Backend · .NET',
    desc: 'API de propostas de crédito em .NET 10, organizada com Clean Architecture, FluentValidation e testes xUnit.',
    href: 'https://github.com/7Genesis/CreditFlow',
    cta: 'Ver código no GitHub',
  },
  {
    title: 'StockFlow',
    tag: 'SaaS · Next.js',
    desc: 'Sistema multiempresa de estoque com solicitações, aprovações, fornecedores e importação de NF-e (XML). Next.js e Prisma.',
    href: 'https://stockflow-cyan.vercel.app',
    cta: 'Ver demonstração',
  },
];

// Sites e landing pages no ar
const sites: Project[] = [
  {
    title: 'Docctor Med Jacarepaguá',
    tag: 'Landing Page',
    desc: 'Página de alta conversão para clínica odontológica, otimizada para captação de leads e SEO local.',
    href: 'https://docctormedjacarepagua.com.br/odontologia/',
    cta: 'Acessar site',
  },
  {
    title: 'NovaLab',
    tag: 'Web',
    desc: 'Site da agência de marketing digital, com apresentação de serviços e foco em captação de clientes.',
    href: 'https://novalab.me/',
    cta: 'Acessar site',
  },
  {
    title: 'Docctor Med Caxias',
    tag: 'Performance',
    desc: 'Implementação de alta performance integrada a campanhas de tráfego pago (Google Ads) para aquisição.',
    href: 'https://docctormedcaxiasdosul.com.br/odontologia/',
    cta: 'Acessar site',
  },
  {
    title: 'StarFit — Transnordestina',
    tag: 'Landing Page',
    desc: 'Página de vendas para academia, com modalidades, planos e integração direta com WhatsApp para conversão.',
    href: 'https://starfitpnz.com.br/transnordestina/',
    cta: 'Acessar site',
  },
  {
    title: 'ConectaLab',
    tag: 'Growth',
    desc: 'Landing page de captação para programa de crescimento empresarial gamificado, com níveis de evolução e CTA para WhatsApp.',
    href: 'https://lp.novalab.me/conectalab/',
    cta: 'Acessar site',
  },
];

// Experiências profissionais (mesmo texto do LinkedIn)
const experiences = [
  {
    role: 'Estagiário de Desenvolvimento de Software',
    org: 'SAAE Juazeiro · Água e Esgoto',
    period: 'Ago 2026 — Atual',
    desc: 'Plataforma de atendimento por WhatsApp em Python/Django, com chatbot de IA integrado ao GSAN, painel de atendimento e testes com pytest. Reescrita do app do cidadão em React Native (Expo) e TypeScript. APIs REST e pull requests com code review.',
  },
  {
    role: 'Desenvolvedor Backend — projetos próprios e freelance',
    org: 'Projetos próprios e freelance',
    period: 'Dez 2025 — Atual',
    desc: 'Sites e landing pages para clientes, LeadFlow Engine (webhooks, fila e round-robin), StockFlow (estoque multiempresa) e APIs REST com JWT, em camadas, sobre PostgreSQL.',
  },
  {
    role: 'Gestor de Tráfego Pago (Meta Ads)',
    org: 'NovaLab · Marketing Digital',
    period: 'Abr — Ago 2026',
    desc: 'Campanhas com funil completo, públicos lookalike e remarketing, rastreamento com Meta Pixel, Conversion API e GTM, e acompanhamento de CPA, CPC, CTR e ROAS.',
  },
  {
    role: 'Assistente de Compras',
    org: 'Gráfica Copylan',
    period: 'Dez 2025 — Fev 2026',
    desc: 'Compras com 8 a 15 fornecedores e 5 a 10 pedidos por semana. Cotação e negociação que reduziram custos em cerca de 10%, com controles e dashboards em Excel.',
  },
  {
    role: 'Consultor de Vendas',
    org: 'Grupo Batalha',
    period: 'Mai 2024 — Dez 2025',
    desc: 'Atendimento consultivo de até 20 clientes por dia, ticket médio de R$ 2 mil a R$ 6 mil e faturamento mensal de R$ 60 mil a R$ 120 mil, com pipeline em CRM.',
  },
];

const education = [
  { t: 'Ciência da Computação', s: 'Estácio · cursando (2029)' },
  { t: 'Engenharia de Software', s: 'Unigrande · cursando (2029)' },
];

const courses = [
  { t: 'Análise de Dados (Python, SQL, ETL)', s: 'EBAC · em andamento' },
  { t: 'Power BI — Data Science', s: 'Data Science Academy · concluído' },
  { t: 'Fundamentos de Java', s: 'LinkedIn Learning · concluído' },
];

// Mais código no GitHub (os projetos principais estão na seção de projetos)
const repos = [
  {
    name: 'finance-control-api',
    lang: 'TypeScript',
    desc: 'Controle financeiro pessoal: API em Node.js, Express e PostgreSQL com JWT e front em Next.js com dashboard.',
  },
  {
    name: 'chatlab',
    lang: 'Java',
    desc: 'Backend multi-tenant de um hub de atendimento: Java 21, Spring Boot 4, PostgreSQL e Flyway (em desenvolvimento).',
  },
  {
    name: 'Sistema-de-Notifica-o-de-Falta-de-gua-por-Bairro',
    lang: 'Python',
    desc: 'Ocorrências de falta de água por bairro, com dashboard e mapa, para o SAAE Juazeiro. Python e Django.',
  },
  {
    name: 'tinder-pet',
    lang: 'TypeScript',
    desc: 'Protótipo de plataforma de adoção de pets para ONGs: match entre adotante e ONG e chat.',
  },
  {
    name: 'Industry-control-system',
    lang: 'Java',
    desc: 'Sugestão de produção por valor a partir do estoque de matérias-primas. Java, Quarkus, PostgreSQL e React.',
  },
  {
    name: 'Ethan',
    lang: 'Dart',
    desc: 'Plataforma B2B de compras: cotação, propostas de fornecedores e validação fiscal (XML). Flutter e Firebase.',
  },
];

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

// Cartão de projeto: com link vira <a>; sem link (código privado) vira <div>.
function ProjectCard({ p }: { p: Project }) {
  const base =
    'group flex flex-col rounded-3xl border border-[#0a0a0a]/15 bg-[#f4f1ea] p-8 transition-all duration-300';
  const body = (
    <>
      <div className="mb-8 flex items-start justify-between">
        <span className="rounded-full border border-[#0a0a0a]/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#0a0a0a]/60">
          {p.tag}
        </span>
        {p.href && (
          <span className="text-[#0a0a0a]/40 transition-all group-hover:text-[#0a0a0a] group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
            <ArrowUpRight className="h-6 w-6" />
          </span>
        )}
      </div>
      <h3 className="text-2xl font-black tracking-tight">{p.title}</h3>
      <p className="mt-3 flex-grow text-sm leading-relaxed text-[#0a0a0a]/65">{p.desc}</p>
      <span
        className={`mt-8 text-sm ${p.href ? 'font-bold' : 'font-semibold text-[#0a0a0a]/45'}`}
      >
        {p.href ? p.cta : p.note}
      </span>
      {p.secondaryNote && (
        <span className="mt-2 text-xs font-medium text-[#0a0a0a]/45">{p.secondaryNote}</span>
      )}
    </>
  );

  if (p.href) {
    return (
      <a
        href={p.href}
        target="_blank"
        rel="noreferrer"
        className={`${base} hover:-translate-y-1 hover:border-[#0a0a0a]/40`}
      >
        {body}
      </a>
    );
  }
  return <div className={base}>{body}</div>;
}

// ==========================================
// PÁGINA PRINCIPAL (Server Component)
// ==========================================
export default function Portfolio() {
  return (
    <main className="bg-[#0a0a0a] font-sans">
      <RevealFailsafe />
      <Nav />

      {/* Abertura cinematográfica que apresenta backend, frontend e entrega. */}
      <ScrollStage />

      {/* SOBRE + RESULTADOS — bloco esmeralda */}
      <About />

      {/* PROJETOS — bloco creme */}
      <section id="projetos" className="bg-[#ece8de] py-28 text-[#0a0a0a]">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <Eyebrow className="text-[#0a0a0a]">Projetos</Eyebrow>
            <h2 className="headline mt-6 max-w-3xl text-5xl font-black md:text-7xl">
              Sistemas que eu construí.
            </h2>
            <p className="font-display mt-6 max-w-2xl text-2xl italic leading-snug text-[#0a0a0a]/70 md:text-3xl">
              APIs, integrações e sistemas backend: veja o problema, as tecnologias e o código disponível.
            </p>
          </Reveal>

          <RevealStagger className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {systems.map((p) => (
              <ProjectCard key={p.title} p={p} />
            ))}
          </RevealStagger>

          <Reveal className="mt-24">
            <Eyebrow className="text-[#0a0a0a]">Sites e landing pages no ar</Eyebrow>
          </Reveal>

          <RevealStagger className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sites.map((p) => (
              <ProjectCard key={p.title} p={p} />
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* SKILLS — constelação em bloco preto */}
      <section id="skills" className="relative overflow-hidden bg-[#0a0a0a] py-28">
        <div className="starfield pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <Reveal>
            <Eyebrow className="text-emerald-400">Stack & Skills</Eyebrow>
            <h2 className="headline mt-6 max-w-4xl text-5xl font-black text-white md:text-7xl">
              Uma constelação de skills.
            </h2>
            <p className="font-display mt-6 max-w-2xl text-2xl italic leading-snug text-white/60 md:text-3xl">
              Foco em APIs e serviços backend, com experiência complementar em dados,
              integrações e aplicações web e mobile.
            </p>
          </Reveal>
          <Constellation />
        </div>
      </section>

      {/* EXPERIÊNCIA & FORMAÇÃO — bloco esmeralda */}
      <section id="experiencia" className="bg-[#053b2c] py-28 text-[#f2efe6]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-16 lg:grid-cols-[1.3fr_1fr]">
            {/* Experiência */}
            <div>
              <Reveal>
                <Eyebrow className="text-emerald-300">Experiência Profissional</Eyebrow>
              </Reveal>
              <RevealStagger className="mt-12 border-t border-[#f2efe6]/15">
                {experiences.map((e) => (
                  <div
                    key={e.role + e.org}
                    className="grid gap-1 border-b border-[#f2efe6]/15 py-7 md:grid-cols-[1fr_auto] md:items-baseline md:gap-6"
                  >
                    <div>
                      <h3 className="text-xl font-black tracking-tight md:text-2xl">{e.role}</h3>
                      <span className="mt-1 block font-display text-lg italic text-emerald-300">
                        {e.org}
                      </span>
                      <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#f2efe6]/70">
                        {e.desc}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[#f2efe6]/50 md:text-right">
                      {e.period}
                    </span>
                  </div>
                ))}
              </RevealStagger>
            </div>

            {/* Formação & Cursos */}
            <div>
              <Reveal>
                <Eyebrow className="text-emerald-300">Formação & Cursos</Eyebrow>
              </Reveal>
              <RevealStagger className="mt-12 space-y-4">
                {education.map((f) => (
                  <div
                    key={f.t}
                    className="rounded-2xl border border-[#f2efe6]/15 bg-[#f2efe6]/[0.04] p-6"
                  >
                    <h4 className="text-lg font-black">{f.t}</h4>
                    <p className="mt-1 text-sm text-[#f2efe6]/60">{f.s}</p>
                  </div>
                ))}
                {courses.map((c) => (
                  <div
                    key={c.t}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-[#f2efe6]/10 bg-[#f2efe6]/[0.02] px-6 py-4"
                  >
                    <span className="text-sm font-semibold">{c.t}</span>
                    <span className="whitespace-nowrap text-xs text-[#f2efe6]/50">{c.s}</span>
                  </div>
                ))}
              </RevealStagger>
            </div>
          </div>
        </div>
      </section>

      {/* GITHUB — bloco creme */}
      <section id="github" className="bg-[#ece8de] py-28 text-[#0a0a0a]">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <Eyebrow className="text-[#0a0a0a]">Código no GitHub</Eyebrow>
            <h2 className="headline mt-6 max-w-3xl text-5xl font-black md:text-7xl">
              Mais projetos e estudos.
            </h2>
          </Reveal>

          <RevealStagger className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {repos.map((repo) => (
              <a
                key={repo.name}
                href={`https://github.com/7Genesis/${repo.name}`}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col rounded-3xl border border-[#0a0a0a]/15 bg-[#f4f1ea] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#0a0a0a]/40"
              >
                <div className="mb-6 flex items-start justify-between gap-3">
                  <h3 className="line-clamp-1 text-lg font-black tracking-tight">{repo.name}</h3>
                  <GitHubIcon />
                </div>
                <p className="flex-grow text-sm leading-relaxed text-[#0a0a0a]/65 line-clamp-4">
                  {repo.desc}
                </p>
                <span className="mt-6 text-xs font-bold uppercase tracking-wide text-[#0a0a0a]/50">
                  {repo.lang}
                </span>
              </a>
            ))}
          </RevealStagger>

          <Reveal className="mt-12">
            <a
              href="https://github.com/7Genesis?tab=repositories"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 text-base font-bold underline-offset-4 hover:underline"
            >
              Ver todos os repositórios
              <ArrowUpRight />
            </a>
          </Reveal>
        </div>
      </section>

      {/* CTA FINAL — bloco preto */}
      <footer className="relative overflow-hidden bg-[#0a0a0a] py-28">
        <div className="starfield pointer-events-none absolute inset-0 opacity-40" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/15 blur-[130px]" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <h2 className="headline text-5xl font-black text-white md:text-8xl">
              Vamos construir algo
              <br />
              <span className="font-display italic font-normal text-emerald-400">juntos</span>?
            </h2>
            <p className="mx-auto mt-8 max-w-xl text-lg text-white/60">
              Em busca de oportunidades júnior Full Stack, com foco especial em backend, APIs e
              integrações. Também aberto a projetos freelance e a trabalho remoto, híbrido ou presencial.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/5574998055726?text=Ol%C3%A1%20Genesis%2C%20vim%20pelo%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar%21"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-white px-9 py-4 text-lg font-bold text-[#0a0a0a] transition-all hover:bg-white/85"
              >
                Falar no WhatsApp
              </a>
              <a
                href="https://www.linkedin.com/in/genesis-melo/"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/20 px-9 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10"
              >
                LinkedIn
              </a>
              <a
                href="mailto:genesis.melo4398@hotmail.com"
                className="rounded-full border border-white/20 px-9 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10"
              >
                E-mail
              </a>
            </div>
          </Reveal>

          <p className="mt-16 text-sm text-white/30">
            © {new Date().getFullYear()} Genesis Melo · Desenvolvedor Full Stack Júnior
          </p>
        </div>
      </footer>
    </main>
  );
}
