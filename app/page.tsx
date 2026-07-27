import React from 'react';
import Nav from './components/nav';
import Hero from './components/hero';
import NovaLabShowcase from './components/novalab';
import Constellation from './components/constellation';
import { Reveal, RevealStagger } from './components/animations';
import { ArrowUpRight } from './components/ui';

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
      <Nav />

      {/* HERO — bloco preto cósmico */}
      <Hero />

      {/* NOVALAB — bloco esmeralda */}
      <NovaLabShowcase />

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

          <RevealStagger className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <Eyebrow className="text-emerald-400">Capacidades</Eyebrow>
            <h2 className="headline mt-6 max-w-4xl text-5xl font-black text-white md:text-7xl">
              Uma constelação de skills.
            </h2>
            <p className="font-display mt-6 max-w-2xl text-2xl italic leading-snug text-white/60 md:text-3xl">
              Engenharia, dados e growth conectados num só sistema — do backend
              ao criativo que converte.
            </p>
          </Reveal>
          <Constellation />
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

      {/* TRAJETÓRIA — bloco esmeralda */}
      <section id="trajetoria" className="bg-[#053b2c] py-28 text-[#f2efe6]">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <Eyebrow className="text-emerald-300">Trajetória & Formação</Eyebrow>
          </Reveal>
          <div className="mt-12 grid gap-16 md:grid-cols-2">
            <Reveal className="space-y-10">
              <div className="border-l border-[#f2efe6]/25 pl-6">
                <h3 className="text-2xl font-black tracking-tight">Estrategista de Growth & Tráfego</h3>
                <span className="mt-1 block font-display text-lg italic text-emerald-300">NovaLab</span>
                <p className="mt-3 text-[#f2efe6]/70">
                  Escala de campanhas, funis de captação e análise de dados para suporte à tomada de decisão.
                </p>
              </div>
              <div className="border-l border-[#f2efe6]/25 pl-6">
                <h3 className="text-2xl font-black tracking-tight">Desenvolvedor</h3>
                <span className="mt-1 block font-display text-lg italic text-[#f2efe6]/60">Autônomo</span>
                <p className="mt-3 text-[#f2efe6]/70">
                  Construção de APIs REST, modelagem multi-tenant e integração de IA para agilidade operacional.
                </p>
              </div>
            </Reveal>
            <Reveal className="space-y-4">
              {[
                { t: 'Ciência da Computação', s: 'Estácio' },
                { t: 'Engenharia de Software', s: 'UniGrande' },
                { t: 'Análise de Dados (Python, SQL)', s: 'EBAC' },
              ].map((f) => (
                <div key={f.t} className="rounded-2xl border border-[#f2efe6]/15 bg-[#f2efe6]/[0.04] p-6">
                  <h4 className="text-lg font-black">{f.t}</h4>
                  <p className="mt-1 text-[#f2efe6]/60">{f.s}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA FINAL — bloco preto */}
      <footer className="relative overflow-hidden bg-[#0a0a0a] py-28">
        <div className="starfield pointer-events-none absolute inset-0 opacity-40" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/15 blur-[130px]" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <h2 className="headline text-5xl font-black text-white md:text-8xl">
              Vamos construir seu
              <br />
              próximo <span className="font-display italic font-normal text-emerald-400">resultado</span>?
            </h2>
            <p className="mx-auto mt-8 max-w-xl text-lg text-white/60">
              Do código à campanha — engenharia e growth em um só lugar para
              escalar o seu negócio.
            </p>
            <div className="mt-10 flex justify-center">
              <a
                href="https://wa.me/5511939281926?text=Ol%C3%A1%20Genesis%2C%20vim%20pelo%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar%21"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-white px-9 py-4 text-lg font-bold text-[#0a0a0a] transition-all hover:bg-white/85"
              >
                Falar no WhatsApp
              </a>
            </div>
          </Reveal>

          <p className="mt-16 text-sm text-white/30">
            © {new Date().getFullYear()} Genesis Melo · Engenharia de Software & Growth
          </p>
        </div>
      </footer>
    </main>
  );
}
