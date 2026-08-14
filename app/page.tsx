import React from 'react';
import Nav from './components/nav';
import ScrollStage from './components/scroll-stage';
import About from './components/about';
import Constellation from './components/constellation';
import { Reveal, RevealStagger } from './components/animations';
import { ArrowUpRight } from './components/ui';
import RevealFailsafe from './components/reveal-failsafe';

// ==========================================
// INTEGRAÇÃO COM A API DO GITHUB (ISR)
// ==========================================
interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string;
  topics: string[];
}

async function getGithubRepos(): Promise<Repo[]> {
  try {
    const res = await fetch('https://api.github.com/users/7Genesis/repos?sort=updated&per_page=3', {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Erro ao buscar repositórios:', error);
    return [];
  }
}

// Rótulo de seção (estilo editorial: linha + texto em caixa alta)
function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] ${className}`}>
      <span className="h-px w-10 bg-current opacity-40" />
      {children}
    </div>
  );
}

const projects = [
  {
    title: 'Docctor Med Jacarepaguá',
    tag: 'Landing Page',
    desc: 'Página de alta conversão para clínica odontológica, otimizada para captação de leads e SEO local.',
    href: 'https://docctormedjacarepagua.com.br/odontologia/',
  },
  {
    title: 'NovaLab',
    tag: 'Web',
    desc: 'Site da agência de marketing digital, com apresentação de serviços e foco em captação de clientes.',
    href: 'https://novalab.me/',
  },
  {
    title: 'Docctor Med Caxias',
    tag: 'Performance',
    desc: 'Implementação de alta performance integrada a campanhas de tráfego pago (Google Ads) para aquisição.',
    href: 'https://docctormedcaxiasdosul.com.br/odontologia/',
  },
  {
    title: 'MeetPoint',
    tag: 'Full Stack',
    desc: 'Hub de links e automação operacional. Atuação Full Stack focada em arquitetura de Backend e UX.',
    href: 'https://novalab.me/meetpoint',
  },
  {
    title: 'StarFit — Transnordestina',
    tag: 'Landing Page',
    desc: 'Página de vendas para academia, com modalidades, planos e integração direta com WhatsApp para conversão.',
    href: 'https://starfitpnz.com.br/transnordestina/',
  },
  {
    title: 'ConectaLab',
    tag: 'Growth',
    desc: 'Landing page de captação para programa de crescimento empresarial gamificado, com níveis de evolução e CTA para WhatsApp.',
    href: 'https://lp.novalab.me/conectalab/',
  },
];

// Experiências profissionais (currículo)
const experiences = [
  {
    role: 'Estagiário de Engenharia da Computação',
    org: 'SAAE Juazeiro · Água e Esgoto',
    period: '2026 — Atual',
    desc: 'Apoio no desenvolvimento e manutenção de software, administração e atualização de bancos de dados, participação em projetos com metodologia ágil Scrum, testes e correção de sistemas e elaboração de documentação técnica.',
  },
  {
    role: 'Desenvolvedor Backend / Full Stack',
    org: 'Autônomo · Tecnologia',
    period: '2024 — Atual',
    desc: 'APIs REST em Node.js e TypeScript, integração frontend (Next.js) e backend via Prisma ORM, automação de rotinas e modelagem de bancos PostgreSQL.',
  },
  {
    role: 'Gestor de Tráfego Meta',
    org: 'NovaLab · Marketing Digital',
    period: '2026 — Atual',
    desc: 'Campanhas de tráfego pago no Meta Ads, funis de vendas, análise de CPC/CTR/CPA/ROAS, testes A/B e dashboards de KPIs para decisão orientada por dados.',
  },
  {
    role: 'Auxiliar de Compras',
    org: 'Copylan · Administrativo',
    period: '2025 — 2026',
    desc: 'Negociações estratégicas com economia direta de 10% e dashboards em Excel Avançado para monitoramento de estoque e indicadores.',
  },
  {
    role: 'Consultor de Vendas',
    org: 'Batalha Serviços Adm.',
    period: '2024 — 2025',
    desc: 'Atendimento consultivo multicanal, ticket médio de R$ 2–6 mil e gestão de pipeline em CRM contribuindo para faturamento mensal de até R$ 120 mil.',
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

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

// ==========================================
// PÁGINA PRINCIPAL (Server Component)
// ==========================================
export default async function Portfolio() {
  const repos = await getGithubRepos();

  return (
    <main className="bg-[#0a0a0a] font-sans">
      <RevealFailsafe />
      <Nav />

      {/* HERO — palco cinematográfico: vídeo dirigido pela rolagem */}
      <ScrollStage />

      {/* SOBRE + RESULTADOS — bloco esmeralda */}
      <About />

      {/* PROJETOS — bloco creme */}
      <section id="projetos" className="bg-[#ece8de] py-28 text-[#0a0a0a]">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <Eyebrow className="text-[#0a0a0a]">Impacto Real</Eyebrow>
            <h2 className="headline mt-6 max-w-3xl text-5xl font-black md:text-7xl">
              Projetos em produção.
            </h2>
            <p className="font-display mt-6 max-w-2xl text-2xl italic leading-snug text-[#0a0a0a]/70 md:text-3xl">
              Aplicações reais desenvolvidas e operando no mercado.
            </p>
          </Reveal>

          <RevealStagger className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <a
                key={p.title}
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col rounded-3xl border border-[#0a0a0a]/15 bg-[#f4f1ea] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#0a0a0a]/40"
              >
                <div className="mb-8 flex items-start justify-between">
                  <span className="rounded-full border border-[#0a0a0a]/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#0a0a0a]/60">
                    {p.tag}
                  </span>
                  <span className="text-[#0a0a0a]/40 transition-all group-hover:text-[#0a0a0a] group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                    <ArrowUpRight className="h-6 w-6" />
                  </span>
                </div>
                <h3 className="text-2xl font-black tracking-tight">{p.title}</h3>
                <p className="mt-3 flex-grow text-sm leading-relaxed text-[#0a0a0a]/65">
                  {p.desc}
                </p>
                <span className="mt-8 text-sm font-bold">Acessar sistema</span>
              </a>
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
              Backend, dados e frontend conectados num só sistema — do banco de
              dados à interface.
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
                    key={e.role}
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
            <Eyebrow className="text-[#0a0a0a]">Open Source & Estudos</Eyebrow>
            <h2 className="headline mt-6 max-w-3xl text-5xl font-black md:text-7xl">
              Atividade recente no GitHub.
            </h2>
          </Reveal>

          <RevealStagger className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {repos.length > 0 ? (
              repos.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col rounded-3xl border border-[#0a0a0a]/15 bg-[#f4f1ea] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#0a0a0a]/40"
                >
                  <div className="mb-6 flex items-start justify-between">
                    <h3 className="text-lg font-black tracking-tight line-clamp-1">{repo.name}</h3>
                    <GitHubIcon />
                  </div>
                  <p className="flex-grow text-sm leading-relaxed text-[#0a0a0a]/65 line-clamp-3">
                    {repo.description || 'Repositório de desenvolvimento.'}
                  </p>
                </a>
              ))
            ) : (
              <p className="col-span-3 italic text-[#0a0a0a]/50">Carregando repositórios...</p>
            )}
          </RevealStagger>
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
              Desenvolvedor Full Stack disponível para novos projetos e início
              imediato.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/5511939281926?text=Ol%C3%A1%20Genesis%2C%20vim%20pelo%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar%21"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-white px-9 py-4 text-lg font-bold text-[#0a0a0a] transition-all hover:bg-white/85"
              >
                Falar no WhatsApp
              </a>
              <a
                href="https://www.linkedin.com/in/genesis-melo"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/20 px-9 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10"
              >
                LinkedIn
              </a>
            </div>
          </Reveal>

          <p className="mt-16 text-sm text-white/30">
            © {new Date().getFullYear()} Genesis Melo · Desenvolvedor Full Stack
          </p>
        </div>
      </footer>
    </main>
  );
}
