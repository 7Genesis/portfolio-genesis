'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ==========================================
// runReveal: à prova de falhas.
// Anima só quando a aba está visível. Se a página carrega em
// segundo plano (aba oculta), o conteúdo NÃO é escondido — fica
// visível — e a animação roda quando a aba ganha foco.
// Retorna um cleanup para o listener.
// ==========================================
export function runReveal(build: () => void): () => void {
  if (typeof document === 'undefined' || document.visibilityState === 'visible') {
    build();
    return () => {};
  }
  const onVis = () => {
    if (document.visibilityState === 'visible') {
      document.removeEventListener('visibilitychange', onVis);
      build();
    }
  };
  document.addEventListener('visibilitychange', onVis);
  return () => document.removeEventListener('visibilitychange', onVis);
}

// ==========================================
// Reveal: anima um bloco ao entrar na viewport
// (estilo gsap.com — fade + slide suave)
// ==========================================
interface RevealProps {
  children: React.ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  duration?: number;
  as?: 'div' | 'section' | 'span' | 'li';
}

export function Reveal({
  children,
  className,
  y = 48,
  delay = 0,
  duration = 1,
  as = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      let cleanup = () => {};
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        cleanup = runReveal(() => {
          gsap.from(ref.current, {
            opacity: 0,
            y,
            duration,
            delay,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 88%',
              once: true,
            },
          });
        });
      });
      return () => cleanup();
    },
    { scope: ref },
  );

  return React.createElement(as, { ref, className }, children);
}

// ==========================================
// RevealStagger: anima filhos em sequência
// (aplica em cards de um grid — efeito cascata)
// ==========================================
interface RevealStaggerProps {
  children: React.ReactNode;
  className?: string;
  y?: number;
  stagger?: number;
}

export function RevealStagger({
  children,
  className,
  y = 56,
  stagger = 0.12,
}: RevealStaggerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = ref.current?.children;
      if (!items) return;
      const mm = gsap.matchMedia();
      let cleanup = () => {};
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        cleanup = runReveal(() => {
          gsap.from(items, {
            opacity: 0,
            y,
            duration: 0.9,
            ease: 'power3.out',
            stagger,
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 85%',
              once: true,
            },
          });
        });
      });
      return () => cleanup();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
