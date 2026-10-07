'use client';

import { type CSSProperties, type ReactNode, useEffect, useState } from 'react';
import AssistantOrbits from './assistant-orbits';

const FILES = [
  { id: 'inicio', name: 'README.md', ext: 'MD', tone: 'markdown', preview: ['import', 'Genesis from', '"saae";'] },
  { id: 'sobre', name: 'sobre.md', ext: 'MD', tone: 'markdown', preview: ['const', 'trajeto =', '["vendas", "compras", "tecnologia"];'] },
  { id: 'projetos', name: 'projetos.tsx', ext: 'TSX', tone: 'typescript', preview: ['await', 'entregar(', '"software em uso");'] },
  { id: 'landing-pages', name: 'landing-pages.html', ext: '<>', tone: 'html', preview: ['const', 'foco =', '["mensagem", "conversão"];'] },
  { id: 'stack', name: 'stack.json', ext: '{}', tone: 'json', preview: ['const', 'stack =', '["NestJS", "PostgreSQL", "Redis"];'] },
  { id: 'percurso', name: 'percurso.md', ext: 'MD', tone: 'markdown', preview: ['const', 'aprendizado =', 'experiência.map(entender);'] },
  { id: 'github', name: 'github.md', ext: 'MD', tone: 'markdown', preview: ['git', 'log', '--oneline'] },
  { id: 'contato', name: 'contato.tsx', ext: 'TSX', tone: 'typescript', preview: ['await', 'conversar(', '"próximo desafio");'] },
];

function sectionForScroll() {
  const marker = window.scrollY + Math.max(140, window.innerHeight * 0.24);
  let current = FILES[0].id;
  FILES.forEach(({ id }) => {
    const section = document.getElementById(id);
    if (section && section.getBoundingClientRect().top + window.scrollY <= marker) current = id;
  });
  return current;
}

export default function PortfolioIdeShell({ children }: { children: ReactNode }) {
  const [active, setActive] = useState('inicio');
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setActive(sectionForScroll());
      });
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const navigate = (id: string) => {
    setActive(id);
    setExplorerOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };

  const activeFile = FILES.find((file) => file.id === active) ?? FILES[0];
  const previewText = activeFile.preview.join(' ');

  return (
    <div className="portfolio-ide-shell">
      <header className="portfolio-ide__titlebar">
        <div className="portfolio-ide__window-controls" aria-hidden="true"><i /><i /><i /></div>
        <div className="portfolio-ide__menubar" aria-hidden="true"><span>File</span><span>Edit</span><span>Selection</span><span>View</span><span>Go</span><span>Run</span><span>Terminal</span><span>Help</span></div>
        <div className="portfolio-ide__command">⌕ <span>portfolio-genesis</span><small>⌄</small></div>
        <div className="portfolio-ide__window-actions" aria-hidden="true"><span>▱</span><span>□</span><span>×</span></div>
      </header>

      <div className="portfolio-ide__workspace">
        <aside className="portfolio-ide__activity" aria-label="Atividade">
          <button className="portfolio-ide__activity-button is-active" type="button" onClick={() => setExplorerOpen((open) => !open)} aria-label={explorerOpen ? 'Fechar explorador' : 'Abrir explorador'} aria-expanded={explorerOpen}>▤</button>
          <span aria-hidden="true">⌕</span><span aria-hidden="true">⑂</span><span aria-hidden="true">▧</span>
          <span className="portfolio-ide__activity-spacer" /><span aria-hidden="true">⚙</span>
        </aside>

        <aside className={'portfolio-ide__explorer' + (explorerOpen ? ' is-open' : '')} aria-label="Explorador do portfólio">
          <div className="portfolio-ide__explorer-title">EXPLORADOR</div>
          <div className="portfolio-ide__root"><span>⌄</span> PORTFOLIO-GENESIS</div>
          <div className="portfolio-ide__folder"><span>⌄</span> perfil</div>
          <nav className="portfolio-ide__files" aria-label="Arquivos do portfólio">
            {FILES.map((file) => (
              <a key={file.id} href={'#' + file.id} onClick={(event) => { event.preventDefault(); navigate(file.id); }} className={'portfolio-ide__file portfolio-ide__file--' + file.tone + (active === file.id ? ' is-active' : '')} aria-current={active === file.id ? 'page' : undefined}>
                <span>{file.ext}</span>{file.name}
              </a>
            ))}
          </nav>
          <div className="portfolio-ide__outline"><span>⌄</span> ESTRUTURA</div>
          <div className="portfolio-ide__outline-row">Genesis Melo</div>
          <div className="portfolio-ide__outline-row">Desenvolvedor Full Stack Júnior</div>
        </aside>

        <main className="portfolio-ide__main">
          <nav className="portfolio-ide__tabs" aria-label="Seções do portfólio">
            {FILES.map((file) => (
              <button key={file.id} type="button" aria-current={active === file.id ? 'page' : undefined} onClick={() => navigate(file.id)} className={'portfolio-ide__tab' + (active === file.id ? ' is-active' : '')}>
                <span className={'portfolio-ide__file-icon portfolio-ide__file-icon--' + file.tone}>{file.ext}</span>{file.name}
              </button>
            ))}
          </nav>
          <div className="portfolio-ide__breadcrumb"><span>PORTFOLIO-GENESIS</span><span>›</span><span>perfil</span><span>›</span><strong>{activeFile.name}</strong></div>
          <div className="portfolio-ide__code-preview" role="status" aria-atomic="true" aria-label={`Prévia de código para ${activeFile.name}`}>
            <span className="portfolio-ide__code-line-number">1</span>
            <code key={activeFile.id}><span style={{ '--typed-width': `${previewText.length}ch` } as CSSProperties}><i>{activeFile.preview[0]}</i> {activeFile.preview[1]} <b>{activeFile.preview[2]}</b></span><mark aria-hidden="true" /></code>
            <small>{activeFile.ext === 'MD' ? 'Markdown' : activeFile.ext === '{}' ? 'JSON' : activeFile.ext === '<>' ? 'HTML' : 'TypeScript'}</small>
          </div>
          <div className="portfolio-ide__canvas">{children}</div>
        </main>
      </div>

      {terminalOpen && (
        <section className="portfolio-ide__terminal" aria-label="Terminal com exemplo de integração">
          <div className="portfolio-ide__terminal-tabs"><span>PROBLEMAS</span><span>SAÍDA</span><strong>TERMINAL · EXEMPLO</strong><button type="button" onClick={() => setTerminalOpen(false)} aria-label="Fechar terminal">×</button></div>
          <div className="portfolio-ide__terminal-content"><span><b>$</b> curl -X POST localhost:3000/leads/webhook</span><span className="is-muted">{'{"name":"Ana","email":"ana@empresa.com"}'}</span><span className="is-response">› {'{"success":true,"message":"Lead na fila de processamento."}'}</span></div>
        </section>
      )}

      <footer className="portfolio-ide__statusbar">
        <div><span>⎇ main</span><span>Genesis Melo · Desenvolvedor Full Stack Júnior</span></div>
        <div><span>TypeScript</span><span>UTF-8</span><a href="https://github.com/7Genesis" target="_blank" rel="noreferrer">GitHub ↗</a><button type="button" onClick={() => setTerminalOpen((open) => !open)} aria-expanded={terminalOpen}>›_ Terminal</button></div>
      </footer>

      <AssistantOrbits />

      {explorerOpen && <button className="portfolio-ide__scrim" type="button" aria-label="Fechar explorador" onClick={() => setExplorerOpen(false)} />}
    </div>
  );
}
