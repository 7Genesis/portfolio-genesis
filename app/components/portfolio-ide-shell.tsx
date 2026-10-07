'use client';

import { type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type ReactNode, useEffect, useRef, useState } from 'react';
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
  const [folderOpen, setFolderOpen] = useState(true);
  const [outlineOpen, setOutlineOpen] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedCommand, setSelectedCommand] = useState(0);
  const explorerButtonRef = useRef<HTMLButtonElement>(null);
  const paletteInputRef = useRef<HTMLInputElement>(null);
  const commandCenterRef = useRef<HTMLButtonElement>(null);

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

  useEffect(() => {
    const handleShortcuts = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen(true);
        setExplorerOpen(false);
        setQuery('');
        setSelectedCommand(0);
        return;
      }
      if (event.key !== 'Escape') return;
      if (paletteOpen) {
        setPaletteOpen(false);
        commandCenterRef.current?.focus();
      } else if (explorerOpen) {
        setExplorerOpen(false);
        explorerButtonRef.current?.focus();
      }
      if (terminalOpen) setTerminalOpen(false);
    };
    window.addEventListener('keydown', handleShortcuts);
    return () => window.removeEventListener('keydown', handleShortcuts);
  }, [explorerOpen, paletteOpen, terminalOpen]);

  useEffect(() => {
    if (paletteOpen) paletteInputRef.current?.focus();
  }, [paletteOpen]);

  useEffect(() => {
    if (!paletteOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [paletteOpen]);

  const navigate = (id: string) => {
    setActive(id);
    setExplorerOpen(false);
    if (paletteOpen) {
      setPaletteOpen(false);
      commandCenterRef.current?.focus();
    }
    else if (window.matchMedia('(max-width: 900px)').matches) explorerButtonRef.current?.focus();
    document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };

  const activeFile = FILES.find((file) => file.id === active) ?? FILES[0];
  const previewText = activeFile.preview.join(' ');
  const commands = [
    ...FILES.map((file) => ({ label: `Abrir ${file.name}`, detail: `Ir para ${file.id === 'inicio' ? 'o início' : file.id}`, run: () => navigate(file.id) })),
    { label: 'Abrir LeadFlow Engine', detail: 'Projeto de backend com NestJS, Redis e PostgreSQL', run: () => navigate('projetos') },
    { label: 'Abrir app do cidadão', detail: 'Aplicativo React Native publicado na Google Play', run: () => navigate('projetos') },
    { label: 'Ver landing pages', detail: 'Páginas publicadas e projetos web', run: () => navigate('landing-pages') },
    { label: 'Abrir terminal de exemplo', detail: 'Mostrar uma requisição de integração', run: () => { setTerminalOpen(true); setPaletteOpen(false); commandCenterRef.current?.focus(); } },
    { label: 'Abrir GitHub', detail: 'Ver repositórios e código', run: () => navigate('github') },
    { label: 'Ir para contato', detail: 'Encontrar e-mail e redes', run: () => navigate('contato') },
  ];
  const filteredCommands = commands.filter((command) => `${command.label} ${command.detail}`.toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR')));
  const runSelectedCommand = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (filteredCommands.length) setSelectedCommand((current) => (current + 1) % filteredCommands.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (filteredCommands.length) setSelectedCommand((current) => (current - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (event.key === 'Enter' && filteredCommands[selectedCommand]) {
      event.preventDefault();
      filteredCommands[selectedCommand].run();
    }
  };

  return (
    <div className="portfolio-ide-shell">
      <header className="portfolio-ide__titlebar">
        <div className="portfolio-ide__window-controls" aria-hidden="true"><i /><i /><i /></div>
        <div className="portfolio-ide__menubar" aria-hidden="true"><span>File</span><span>Edit</span><span>Selection</span><span>View</span><span>Go</span><span>Run</span><span>Terminal</span><span>Help</span></div>
        <button ref={commandCenterRef} className="portfolio-ide__command" type="button" onClick={() => { setPaletteOpen(true); setQuery(''); setSelectedCommand(0); }} aria-label="Abrir busca e comandos" aria-haspopup="dialog" aria-expanded={paletteOpen}>
          ⌕ <span>portfolio-genesis</span><small>⌘ / Ctrl K</small>
        </button>
        <div className="portfolio-ide__window-actions" aria-hidden="true"><span>▱</span><span>□</span><span>×</span></div>
      </header>

      <div className="portfolio-ide__workspace">
        <aside className="portfolio-ide__activity" aria-label="Atividade">
          <button ref={explorerButtonRef} className="portfolio-ide__activity-button is-active" type="button" onClick={() => setExplorerOpen((open) => !open)} aria-label={explorerOpen ? 'Fechar explorador' : 'Abrir explorador'} aria-expanded={explorerOpen}>▤</button>
          <button className="portfolio-ide__activity-button" type="button" onClick={() => { setQuery(''); setSelectedCommand(0); setPaletteOpen(true); }} aria-label="Buscar seções e comandos" aria-haspopup="dialog" aria-expanded={paletteOpen}>⌕</button>
          <button className="portfolio-ide__activity-button" type="button" onClick={() => navigate('github')} aria-label="Abrir repositórios no GitHub">⑂</button>
          <button className="portfolio-ide__activity-button" type="button" onClick={() => navigate('stack')} aria-label="Abrir tecnologias">▧</button>
          <span className="portfolio-ide__activity-spacer" /><button className="portfolio-ide__activity-button" type="button" onClick={() => setTerminalOpen((open) => !open)} aria-label={terminalOpen ? 'Fechar terminal de exemplo' : 'Abrir terminal de exemplo'} aria-expanded={terminalOpen}>⚙</button>
        </aside>

        <aside className={'portfolio-ide__explorer' + (explorerOpen ? ' is-open' : '')} aria-label="Explorador do portfólio">
          <div className="portfolio-ide__explorer-title">EXPLORADOR</div>
          <div className="portfolio-ide__root"><span>⌄</span> PORTFOLIO-GENESIS</div>
          <button className="portfolio-ide__folder" type="button" aria-expanded={folderOpen} onClick={() => setFolderOpen((open) => !open)}><span>{folderOpen ? '⌄' : '›'}</span> perfil</button>
          {folderOpen && <nav className="portfolio-ide__files" aria-label="Arquivos do portfólio">
            {FILES.map((file) => (
              <a key={file.id} href={'#' + file.id} onClick={(event) => { event.preventDefault(); navigate(file.id); }} className={'portfolio-ide__file portfolio-ide__file--' + file.tone + (active === file.id ? ' is-active' : '')} aria-current={active === file.id ? 'page' : undefined}>
                <span>{file.ext}</span>{file.name}
              </a>
            ))}
          </nav>}
          <button className="portfolio-ide__outline" type="button" aria-expanded={outlineOpen} onClick={() => setOutlineOpen((open) => !open)}><span>{outlineOpen ? '⌄' : '›'}</span> ESTRUTURA</button>
          {outlineOpen && <div className="portfolio-ide__outline-items"><button className="portfolio-ide__outline-row" type="button" onClick={() => navigate('inicio')}>Genesis Melo</button><button className="portfolio-ide__outline-row" type="button" onClick={() => navigate('sobre')}>Sobre mim</button></div>}
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

      {paletteOpen && (
        <div className="portfolio-ide__palette-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) { setPaletteOpen(false); commandCenterRef.current?.focus(); } }}>
          <section className="portfolio-ide__palette" role="dialog" aria-modal="true" aria-labelledby="portfolio-ide-palette-title" onKeyDown={(event) => {
            if (event.key !== 'Tab') return;
            const items = event.currentTarget.querySelectorAll<HTMLElement>('input:not([disabled]), button:not([disabled])');
            const first = items[0];
            const last = items[items.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
          }}>
            <h2 id="portfolio-ide-palette-title">Ir para arquivo ou comando</h2>
            <label className="portfolio-ide__palette-search"><span aria-hidden="true">⌕</span><input ref={paletteInputRef} value={query} onChange={(event) => { setQuery(event.target.value); setSelectedCommand(0); }} onKeyDown={runSelectedCommand} placeholder="Busque uma seção, projeto ou ação..." aria-label="Buscar comandos" aria-describedby="portfolio-ide-command-selection" /><kbd>ESC</kbd></label>
            <span className="sr-only" id="portfolio-ide-command-selection" aria-live="polite">{filteredCommands[selectedCommand]?.label ?? 'Nenhum resultado'}</span>
            <div className="portfolio-ide__command-list" aria-label="Resultados da busca" aria-live="polite">
              {filteredCommands.length ? filteredCommands.map((command, index) => (
                <button key={command.label} type="button" className={selectedCommand === index ? 'is-selected' : ''} onMouseEnter={() => setSelectedCommand(index)} onClick={command.run}><span>{command.label}</span><small>{command.detail}</small><kbd>↵</kbd></button>
              )) : <p className="portfolio-ide__command-empty">Nenhuma seção ou comando encontrado.</p>}
            </div>
            <footer><span>↑ ↓ navegar</span><span>↵ abrir</span><span>esc fechar</span></footer>
          </section>
        </div>
      )}

      <footer className="portfolio-ide__statusbar">
        <div><span>⎇ main</span><span>Genesis Melo · Desenvolvedor Full Stack Júnior</span></div>
        <div><span>TypeScript</span><span>UTF-8</span><a href="https://github.com/7Genesis" target="_blank" rel="noreferrer">GitHub ↗</a><button type="button" onClick={() => setTerminalOpen((open) => !open)} aria-expanded={terminalOpen}>›_ Terminal</button></div>
      </footer>

      <AssistantOrbits />

      {explorerOpen && <button className="portfolio-ide__scrim" type="button" aria-label="Fechar explorador" onClick={() => { setExplorerOpen(false); explorerButtonRef.current?.focus(); }} />}
    </div>
  );
}
