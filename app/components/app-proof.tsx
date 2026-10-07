'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ArrowUpRight } from './ui';

const screens = [
  {
    id: 'inicio',
    label: 'Início',
    src: '/evidence/saae-inicio.jpg',
    alt: 'Tela inicial do aplicativo SAAE Cidadão com atalhos para faturas, serviços, chamados e atendimento.',
    caption: 'A tela inicial reúne as rotas mais usadas pelo morador.',
  },
  {
    id: 'servicos',
    label: 'Serviços',
    src: '/evidence/saae-servicos.jpg',
    alt: 'Tela de serviços do aplicativo SAAE Cidadão com opções para religação de água e desobstrução.',
    caption: 'Na área de serviços, o morador pode abrir e acompanhar solicitações.',
  },
] as const;

export default function AppProof() {
  const [activeId, setActiveId] = useState<(typeof screens)[number]['id']>('inicio');
  const active = screens.find((screen) => screen.id === activeId) ?? screens[0];

  return (
    <section className="app-proof" aria-labelledby="app-proof-title">
      <div className="app-proof__visual">
        <figure className="app-proof__device" key={active.id}>
          <span className="app-proof__device-detail" aria-hidden="true" />
          <Image src={active.src} alt={active.alt} width={920} height={2000} sizes="(max-width: 650px) 62vw, 300px" />
          <figcaption>{active.caption}</figcaption>
        </figure>
        <span className="app-proof__seal">CAPTURA<br />DO APP</span>
      </div>

      <div className="app-proof__copy">
        <span className="app-proof__eyebrow">EVIDÊNCIA DE PRODUTO · GOOGLE PLAY</span>
        <h3 id="app-proof-title">O app do cidadão,<br /><i>em uso real.</i></h3>
        <p>Contribuí para reescrever o aplicativo do SAAE de Flutter para React Native e TypeScript. Ele reúne faturas, serviços e chamados; a versão publicada tem 185 testes automatizados.</p>
        <div className="app-proof__controls" aria-label="Escolha uma tela do aplicativo">
          {screens.map((screen) => (
            <button key={screen.id} type="button" aria-pressed={screen.id === active.id} onClick={() => setActiveId(screen.id)}>
              <span>{screen.label}</span><span aria-hidden="true">{screen.id === active.id ? '●' : '○'}</span>
            </button>
          ))}
        </div>
        <a className="app-proof__source" href="https://play.google.com/store/apps/details?id=com.saaejuazeiro.app" target="_blank" rel="noreferrer">
          Abrir ficha oficial no Google Play <ArrowUpRight />
        </a>
        <small>As telas são da ficha pública do app. A publicação pertence ao SAAE Juazeiro.</small>
      </div>
    </section>
  );
}
