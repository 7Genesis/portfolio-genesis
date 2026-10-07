'use client';

import { useState } from 'react';

const links = [
  { label: 'Projetos', href: '#projetos' },
  { label: 'Percurso', href: '#percurso' },
  { label: 'Ferramentas', href: '#stack' },
  { label: 'Código', href: '#github' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="folio-nav">
      <nav className="folio-nav__inner" aria-label="Navegação principal">
        <a href="#inicio" className="folio-nav__brand"><span>g/m</span><small>notas sobre<br />software & produto</small></a>
        <span className="folio-nav__edition">PORTFÓLIO · 2026</span>
        <div className="folio-nav__links">
          {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
          <a className="folio-nav__contact" href="#contato">Contato <span>↗</span></a>
        </div>
        <button className="folio-nav__toggle" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? 'Fechar menu' : 'Abrir menu'}>
          {open ? 'FECHAR −' : 'MENU +'}
        </button>
      </nav>
      {open && <div className="folio-nav__mobile">{links.map((link) => <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}<span>↗</span></a>)}<a href="#contato" onClick={() => setOpen(false)}>Contato<span>↗</span></a></div>}
    </header>
  );
}
