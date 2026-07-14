import React from 'react';

// Função para buscar repositórios
async function getGithubRepos() {
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

export default async function Portfolio() {
  const repos = await getGithubRepos();

  return (
    <main className="min-h-screen bg-[#020617] font-sans text-white">
      
      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6">
          Genesis Melo<span className="text-blue-500">.</span>
        </h1>
        <h2 className="text-2xl md:text-3xl font-light text-slate-300 mb-6">
          Engenheiro de Software & <span className="font-semibold text-white">Estrategista de Growth</span>.
        </h2>
        <p className="text-lg text-slate-400 max-w-2xl mb-12">
          Projeto arquiteturas escaláveis, implemento soluções de IA para agilidade operacional e desenvolvo sistemas de alta performance integrados a funis avançados de aquisição.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <a href="https://wa.me/5511939281926" target="_blank" className="flex items-center gap-2 bg-emerald-600 px-8 py-3.5 rounded-md font-bold hover:bg-emerald-500 transition-all">
            Falar no WhatsApp
          </a>
          <a href="https://github.com/7Genesis" target="_blank" className="flex items-center gap-2 bg-blue-600/10 border border-blue-500/30 px-8 py-3.5 rounded-md font-bold">
            Repositórios
          </a>
          {/* BOTÃO DE DOWNLOAD IMPLEMENTADO */}
          <a 
            href="/Curriculo_Genesis.docx" 
            download="Curriculo_Genesis.docx" 
            className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-8 py-3.5 rounded-md font-bold hover:bg-slate-700 transition-all cursor-pointer"
          >
            Baixar Currículo
          </a>
        </div>
      </section>

      {/* SEÇÃO IA E TECNOLOGIA */}
      <section className="bg-[#0f172a] py-16 border-y border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-sm font-black uppercase text-slate-500 mb-6">Stack Tecnológica & IA</h3>
          <div className="flex flex-wrap gap-4">
            {['.NET', 'IA & LLMs', 'TypeScript', 'Node.js', 'Python', 'Next.js', 'PostgreSQL', 'Docker'].map((tech) => (
              <span key={tech} className="px-4 py-2 bg-slate-800 rounded-md border border-slate-700 font-semibold text-sm">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* TRAJETÓRIA */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h3 className="text-sm font-black uppercase text-slate-500 mb-8">Trajetória</h3>
        <div className="grid md:grid-cols-2 gap-16">
          <div className="space-y-10">
            <div>
              <h4 className="text-xl font-bold">Engenheiro de Software & Estrategista de IA</h4>
              <p className="text-blue-400 text-sm font-semibold">Autônomo</p>
              <p className="text-slate-400 mt-2">Implementação de fluxos automatizados com IA, arquiteturas REST e otimização operacional.</p>
            </div>
            <div>
              <h4 className="text-xl font-bold">Gestor de Tráfego</h4>
              <p className="text-blue-400 text-sm font-semibold">NovaLab</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}