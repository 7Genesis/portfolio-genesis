import React from 'react';

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
      next: { revalidate: 3600 } 
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

// ==========================================
// ÍCONES E COMPONENTES
// ==========================================
const GitHubIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>;
const WhatsAppIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>;
const DocumentIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>;

export default async function Portfolio() {
  const repos = await getGithubRepos();

  return (
    <main className="min-h-screen bg-[#020617] font-sans text-white">
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6">Genesis Melo<span className="text-blue-500">.</span></h1>
        <h2 className="text-2xl md:text-3xl font-light text-slate-300 mb-6">Engenheiro de Software & Estrategista de Growth.</h2>
        <p className="text-lg text-slate-400 max-w-2xl mb-12">Projeto arquiteturas escaláveis, implemento soluções de IA para agilidade operacional e desenvolvo sistemas de alta performance integrados a funis avançados de aquisição.</p>
        
        <div className="flex flex-wrap gap-4">
          <a href="https://wa.me/5511939281926" target="_blank" className="flex items-center gap-2 bg-emerald-600 px-8 py-3.5 rounded-md font-bold hover:bg-emerald-500 transition-all">
            <WhatsAppIcon /> Falar no WhatsApp
          </a>
          <a href="https://github.com/7Genesis" target="_blank" className="flex items-center gap-2 bg-blue-600/10 border border-blue-500/30 px-8 py-3.5 rounded-md font-bold">
            <GitHubIcon /> Acessar Repositórios
          </a>
          <a href="/Curriculo_Genesis.docx" download="Curriculo_Genesis.docx" className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-8 py-3.5 rounded-md font-bold hover:bg-slate-700 transition-all">
            <DocumentIcon /> Baixar Currículo
          </a>
        </div>
      </section>

      {/* PROJETOS */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold mb-12">Projetos em Produção</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-8">
            <h4 className="text-2xl font-bold mb-4">Docctor Med Odontologia</h4>
            <p className="text-slate-400">Landing Page de alta conversão otimizada para captação de leads e SEO.</p>
          </div>
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-8">
            <h4 className="text-2xl font-bold mb-4">MeetPoint</h4>
            <p className="text-slate-400">Sistema Full Stack para gestão de hubs de links e automação operacional.</p>
          </div>
        </div>
      </section>

      {/* FOOTER TRAJETÓRIA */}
      <section className="bg-[#0f172a] py-24 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16">
          <div>
            <h3 className="text-sm font-black uppercase text-slate-500 mb-8">Trajetória</h3>
            <div className="space-y-10">
              <div>
                <h4 className="text-xl font-bold">Estrategista de Growth & Tráfego</h4>
                <p className="text-blue-400 text-sm font-semibold">NovaLab</p>
              </div>
              <div>
                <h4 className="text-xl font-bold">Engenheiro de Software</h4>
                <p className="text-slate-400 text-sm font-semibold">Autônomo</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-black uppercase text-slate-500 mb-8">Formação</h3>
            <div className="p-6 bg-[#020617] rounded-lg border border-slate-800 mb-4">
              <h5 className="font-bold">Ciência da Computação</h5>
              <p className="text-slate-400">Estácio</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}