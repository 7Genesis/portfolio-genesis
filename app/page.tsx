import React from 'react';
import Nav from './components/nav';
import Hero from './components/hero';
import NovaLabShowcase from './components/novalab';
import { Reveal, RevealStagger } from './components/animations';

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

// ==========================================
// COMPONENTE: Faixa Rotativa de Tecnologias
// ==========================================
const techStack = [
  { name: '.NET', highlight: true, description: 'Projetos Backend' },
  { name: 'IA & LLMs', highlight: true, description: 'Otimização e Agilidade' },
  { name: 'TypeScript', highlight: false },
  { name: 'Node.js', highlight: false },
  { name: 'Python', highlight: false, description: 'Data & Automação' },
  { name: 'Next.js', highlight: false },
  { name: 'PostgreSQL', highlight: false },
  { name: 'Prisma ORM', highlight: false },
  { name: 'Docker', highlight: false },
  { name: 'React', highlight: false },
];

function TechMarquee() {
  return (
    <div className="w-full bg-slate-900/50 py-5 overflow-hidden flex relative border-y border-slate-800/50 backdrop-blur-sm">
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-marquee {
          animation: scroll 30s linear infinite;
        }
      `}</style>

      <div className="flex w-max animate-scroll-marquee hover:[animation-play-state:paused]">
        {[...Array(2)].map((_, index) => (
          <div key={index} className="flex gap-8 items-center px-4">
            {techStack.map((tech, i) => (
              <div
                key={`${index}-${i}`}
                className={`flex items-center gap-2 whitespace-nowrap rounded-md px-5 py-2 text-sm font-semibold transition-all cursor-default
                  ${
                    tech.highlight
                      ? 'bg-blue-900/20 text-blue-400 border border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                      : 'bg-slate-800/40 text-slate-400 border border-slate-700/50 hover:bg-slate-700 hover:text-slate-200'
                  }`}
              >
                <span>{tech.name}</span>
                {tech.description && (
                  <span className="text-xs font-normal opacity-60 ml-1 hidden sm:inline-block">
                    — {tech.description}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-950 to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-950 to-transparent"></div>
    </div>
  );
}

// ==========================================
// ÍCONES SVG
// ==========================================
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

// ==========================================
// PÁGINA PRINCIPAL (Server Component)
// ==========================================
export default async function Portfolio() {
  const repos = await getGithubRepos();

  return (
    <main className="min-h-screen bg-slate-950 font-sans selection:bg-blue-500/30">
      <Nav />

      {/* HERO SECTION (animado) */}
      <Hero />

      {/* FAIXA ROTATIVA */}
      <TechMarquee />

      {/* NOVALAB — AGÊNCIA DE MARKETING */}
      <NovaLabShowcase />

      {/* PROJETOS EM PRODUÇÃO */}
      <section id="projetos" className="max-w-6xl mx-auto px-6 py-24">
        <Reveal className="mb-12">
          <h3 className="text-sm font-black tracking-widest text-emerald-500 uppercase mb-2">Impacto Real</h3>
          <h2 className="text-3xl font-bold text-white md:text-4xl">Projetos em Produção</h2>
          <p className="text-slate-400 mt-3 max-w-2xl">Aplicações reais desenvolvidas e implementadas operando no mercado.</p>
        </Reveal>

        <RevealStagger className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Docctor Med Jacarepaguá */}
          <a href="https://docctormedjacarepagua.com.br/odontologia/" target="_blank" rel="noreferrer" className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl p-8 hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px] rounded-full group-hover:bg-emerald-500/10 transition-colors"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <h4 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">Docctor Med Jacarepaguá</h4>
              <ExternalLinkIcon />
            </div>
            <p className="text-slate-400 leading-relaxed mb-6 flex-grow relative z-10 text-sm">
              Landing Page de alta conversão para clínica odontológica. Otimizada para captação de leads e SEO local.
            </p>
            <div className="flex items-center justify-between mt-auto relative z-10">
              <span className="text-xs font-semibold px-3 py-1 bg-emerald-900/30 text-emerald-400 border border-emerald-500/20 rounded-md">GmS</span>
              <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">Acessar Sistema</span>
            </div>
          </a>

          {/* Docctor Med Caxias do Sul */}
          <a href="https://docctormedcaxiasdosul.com.br/odontologia/" target="_blank" rel="noreferrer" className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl p-8 hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px] rounded-full group-hover:bg-emerald-500/10 transition-colors"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <h4 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">Docctor Med Caxias</h4>
              <ExternalLinkIcon />
            </div>
            <p className="text-slate-400 leading-relaxed mb-6 flex-grow relative z-10 text-sm">
              Implementação de alta performance integrada a campanhas de tráfego pago (Google Ads) para aquisição.
            </p>
            <div className="flex items-center justify-between mt-auto relative z-10">
              <span className="text-xs font-semibold px-3 py-1 bg-emerald-900/30 text-emerald-400 border border-emerald-500/20 rounded-md">GmS</span>
              <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">Acessar Sistema</span>
            </div>
          </a>

          {/* MeetPoint */}
          <a href="https://novalab.me/meetpoint" target="_blank" rel="noreferrer" className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl p-8 hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] rounded-full group-hover:bg-blue-500/10 transition-colors"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <h4 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">MeetPoint</h4>
              <ExternalLinkIcon />
            </div>
            <p className="text-slate-400 leading-relaxed mb-6 flex-grow relative z-10 text-sm">
              Hub de links e automação operacional. Atuação Full Stack focada em arquitetura de Backend e UX.
            </p>
            <div className="flex items-center justify-between mt-auto relative z-10">
              <span className="text-xs font-semibold px-3 py-1 bg-blue-900/30 text-blue-400 border border-blue-500/20 rounded-md">Full Stack</span>
              <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">Acessar Sistema</span>
            </div>
          </a>
        </RevealStagger>
      </section>

      {/* REPOSITÓRIOS GITHUB */}
      <section id="github" className="border-t border-slate-800/50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-sm font-black tracking-widest text-blue-500 uppercase mb-2">Open Source & Estudos</h3>
              <h2 className="text-3xl font-bold text-white md:text-4xl">Atividades Recentes no GitHub</h2>
            </div>
          </Reveal>

          <RevealStagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {repos.length > 0 ? (
              repos.map((repo) => (
                <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer" className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 group">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">{repo.name}</h4>
                    <GitHubIcon />
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">{repo.description || 'Repositório de desenvolvimento.'}</p>
                </a>
              ))
            ) : (
              <p className="text-slate-500 italic col-span-3">Carregando repositórios...</p>
            )}
          </RevealStagger>
        </div>
      </section>

      {/* TRAJETÓRIA */}
      <section id="trajetoria" className="bg-slate-900/20 max-w-6xl mx-auto px-6 py-24 border-t border-slate-800/50">
        <Reveal>
          <h3 className="text-sm font-black tracking-widest text-slate-500 uppercase mb-8">Trajetória & Formação</h3>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-16">
          <Reveal className="space-y-10">
            <div className="relative pl-6 border-l border-slate-800">
              <h4 className="text-xl font-bold text-white">Estrategista de Growth & Tráfego</h4>
              <span className="text-blue-400 text-sm font-semibold block mb-3">NovaLab</span>
              <p className="text-slate-400">Escala de campanhas, funis de captação e análise de dados para suporte à tomada de decisão.</p>
            </div>
            <div className="relative pl-6 border-l border-slate-800">
              <h4 className="text-xl font-bold text-white">Desenvolvedor</h4>
              <span className="text-slate-400 text-sm font-semibold block mb-3">Autônomo</span>
              <p className="text-slate-400">Construção de APIs REST, modelagem multi-tenant e integração de IA para agilidade operacional.</p>
            </div>
          </Reveal>
          <Reveal className="space-y-6">
            <div className="p-6 bg-slate-900/40 rounded-lg border border-slate-800">
              <h5 className="font-bold text-white text-lg">Ciência da Computação</h5>
              <p className="text-slate-400 mt-1">Estácio</p>
            </div>
            <div className="p-6 bg-slate-900/40 rounded-lg border border-slate-800">
              <h5 className="font-bold text-white text-lg">Engenharia de Software</h5>
              <p className="text-slate-400 mt-1">UniGrande</p>
            </div>
            <div className="p-6 bg-slate-900/40 rounded-lg border border-slate-800">
              <h5 className="font-bold text-white text-lg">Análise de Dados (Python, SQL)</h5>
              <p className="text-slate-400 mt-1">EBAC</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA FINAL / FOOTER */}
      <footer className="border-t border-slate-800/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-10 text-center md:p-16">
            <h2 className="text-3xl font-black tracking-tighter text-white md:text-5xl">
              Vamos construir seu próximo resultado?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              Do código à campanha — engenharia e growth em um só lugar para
              escalar o seu negócio.
            </p>
            <a
              href="https://wa.me/5511939281926?text=Ol%C3%A1%20Genesis%2C%20vim%20pelo%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar%21"
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-emerald-600 px-8 py-4 font-bold text-white transition-all hover:bg-emerald-500 shadow-[0_0_30px_rgba(5,150,105,0.25)]"
            >
              Falar no WhatsApp
            </a>
          </Reveal>

          <p className="mt-12 text-center text-sm text-slate-600">
            © {new Date().getFullYear()} Genesis Melo · Engenharia de Software & Growth
          </p>
        </div>
      </footer>
    </main>
  );
}
