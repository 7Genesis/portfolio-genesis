'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from './ui';

const screens = [
  { id: 'inicio', label: 'Início', src: '/evidence/saae-jornada/inicio.png', alt: 'Tela inicial com acesso a faturas, serviços, chamados e atendimento.', title: 'Tudo começa em um lugar.', description: 'A tela inicial reúne os caminhos que o cidadão mais precisa no dia a dia.' },
  { id: 'faturas', label: 'Faturas', src: '/evidence/saae-jornada/faturas.png', alt: 'Tela de faturas mostrando que não há contas em aberto.', title: 'Contas à vista.', description: 'O morador consulta a situação das faturas sem precisar procurar outro canal.' },
  { id: 'servicos', label: 'Serviços', src: '/evidence/saae-jornada/servicos.png', alt: 'Tela de serviços com religação de água e registro de vazamento.', title: 'Solicitações sem complicação.', description: 'Serviços organizados por necessidade, com abertura de chamados pelo aplicativo.' },
  { id: 'atendimento', label: 'Atendimento', src: '/evidence/saae-jornada/atendimento.png', alt: 'Tela de atendimento com horário, chat, telefone e emergências.', title: 'Ajuda no canal certo.', description: 'Horários e canais de contato ficam claros, inclusive para situações urgentes.' },
  { id: 'chat', label: 'Chat', src: '/evidence/saae-jornada/chat.png', alt: 'Tela do chat com opções de segunda via, débitos e suporte humano.', title: 'A conversa continua.', description: 'O chat orienta o cidadão e oferece um caminho para falar com a equipe.' },
] as const;

export default function AppProof() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sceneRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(() => {
      const viewportCenter = window.innerHeight / 2;
      const closest = sceneRefs.current.reduce<{ index: number; distance: number } | null>((best, scene, index) => {
        if (!scene) return best;
        const bounds = scene.getBoundingClientRect();
        const distance = Math.abs((bounds.top + bounds.bottom) / 2 - viewportCenter);
        return !best || distance < best.distance ? { index, distance } : best;
      }, null);
      if (closest) setActiveIndex(closest.index);
    }, { rootMargin: '-30% 0px -30% 0px', threshold: [0, 0.2, 0.5, 0.8] });
    sceneRefs.current.forEach((scene) => { if (scene) observer.observe(scene); });
    return () => observer.disconnect();
  }, []);

  function goTo(index: number) {
    const target = Math.max(0, Math.min(index, screens.length - 1));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    sceneRefs.current[target]?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
  }

  return (
    <section className="app-journey" aria-labelledby="app-journey-title">
      <div className="app-journey__header">
        <div><span className="app-journey__eyebrow">PROJETO REAL · SAAE JUAZEIRO</span><h3 id="app-journey-title">O app do cidadão, <i>tela por tela.</i></h3></div>
        <p>Contribuí para reescrever o aplicativo em React Native e TypeScript. O projeto reúne faturas, serviços e atendimento e conta com 185 testes automatizados.</p>
      </div>
      <div className="app-journey__layout">
        <div className="app-journey__visual" aria-live="off"><div className="app-journey__stage">
          <span className="app-journey__index">{String(activeIndex + 1).padStart(2, '0')} / {String(screens.length).padStart(2, '0')}</span>
          <div className="app-journey__phone">{screens.map((screen, index) => <Image key={screen.id} className={activeIndex === index ? 'is-active' : ''} src={screen.src} alt={activeIndex === index ? screen.alt : ''} aria-hidden={activeIndex !== index} width={1080} height={2408} sizes="(max-width: 780px) 66vw, 270px" priority={index === 0} />)}</div>
        </div></div>
        <div className="app-journey__scenes">{screens.map((screen, index) => <article key={screen.id} data-scene={index} ref={(node) => { sceneRefs.current[index] = node; }} className={`app-journey__scene${activeIndex === index ? ' is-active' : ''}`} aria-label={`Etapa ${index + 1} de ${screens.length}: ${screen.label}`}>
          <span>{String(index + 1).padStart(2, '0')} / {screen.label}</span><h4>{screen.title}</h4><p>{screen.description}</p>
          <div className="app-journey__mobile-image"><Image src={screen.src} alt={screen.alt} width={1080} height={2408} sizes="(max-width: 780px) 72vw, 1px" /></div>
        </article>)}</div>
      </div>
      <div className="app-journey__footer">
        <div className="app-journey__steps" aria-label="Ir para uma etapa do aplicativo">{screens.map((screen, index) => <button type="button" key={screen.id} onClick={() => goTo(index)} aria-label={`Ir para ${screen.label}`} aria-current={activeIndex === index ? 'step' : undefined}><span>{String(index + 1).padStart(2, '0')}</span><span>{screen.label}</span></button>)}</div>
        <div className="app-journey__arrows"><button type="button" onClick={() => goTo(activeIndex - 1)} disabled={activeIndex === 0} aria-label="Etapa anterior">←</button><button type="button" onClick={() => goTo(activeIndex + 1)} disabled={activeIndex === screens.length - 1} aria-label="Próxima etapa">→</button></div>
      </div>
      <div className="app-journey__source"><a href="https://play.google.com/store/apps/details?id=com.saaejuazeiro.app" target="_blank" rel="noopener noreferrer">Ver o app na Google Play <ArrowUpRight /></a><small>Capturas reais do aplicativo. O produto e sua publicação pertencem ao SAAE Juazeiro.</small></div>
    </section>
  );
}
