'use client';

import { useEffect } from 'react';

// Seletores de tudo que o GSAP pode deixar com opacity/transform escondidos.
const HIDDEN_SELECTOR = [
  '[data-hero]',
  '[data-reveal]',
  '[data-reveal-stagger] > *',
  '[data-ab="head"] > *',
  '[data-ab="metric"]',
  '[data-cst="tag"]',
  '[data-cst="line"]',
].join(', ');

const GRACE_MS = 1800;

function forceVisible(el: HTMLElement) {
  const counterFallback = el.getAttribute('data-counter-fallback');
  if (counterFallback && el.textContent !== counterFallback) {
    el.textContent = counterFallback;
  }
  el.style.setProperty('opacity', '1', 'important');
  el.style.setProperty('transform', 'none', 'important');
  el.style.setProperty('visibility', 'visible', 'important');
}

/**
 * Rede de segurança: garante que nenhum conteúdo fique invisível para sempre.
 * Só age em elementos que já entraram na viewport — nunca revela seções
 * futuras antes da hora, apenas corrige uma animação que deveria ter
 * rodado (aba em segundo plano, rAF pausado, erro de JS, device lento)
 * e não rodou dentro de um tempo de tolerância.
 */
export default function RevealFailsafe() {
  useEffect(() => {
    const timers = new Map<Element, number>();

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            if (!timers.has(el)) {
              const id = window.setTimeout(() => {
                if (getComputedStyle(el).opacity !== '1') forceVisible(el);
                else if (el.hasAttribute('data-counter-fallback')) forceVisible(el);
                io.unobserve(el);
                timers.delete(el);
              }, GRACE_MS);
              timers.set(el, id);
            }
          } else {
            const id = timers.get(el);
            if (id) {
              clearTimeout(id);
              timers.delete(el);
            }
          }
        });
      },
      { threshold: 0.1 },
    );

    document
      .querySelectorAll(`${HIDDEN_SELECTOR}, [data-counter-fallback]`)
      .forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      timers.forEach((id) => clearTimeout(id));
    };
  }, []);

  return null;
}
