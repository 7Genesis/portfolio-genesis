'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { runReveal } from './animations';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Tags de capacidade, posicionadas como uma constelação (estilo Editions).
// x/y em % dentro do container; size dá hierarquia visual.
const tags = [
  { label: '/node.js', x: 30, y: 22, size: 'lg' },
  { label: '/postgresql', x: 66, y: 14, size: 'sm' },
  { label: '/prisma', x: 12, y: 44, size: 'sm' },
  { label: '/typescript', x: 50, y: 40, size: 'lg' },
  { label: '/docker', x: 82, y: 38, size: 'sm' },
  { label: '/apis-rest', x: 72, y: 56, size: 'md' },
  { label: '/jwt', x: 22, y: 66, size: 'sm' },
  { label: '/next.js', x: 45, y: 72, size: 'md' },
  { label: '/.net', x: 63, y: 82, size: 'sm' },
  { label: '/python', x: 15, y: 86, size: 'md' },
  { label: '/power-bi', x: 88, y: 74, size: 'sm' },
] as const;

// Cadeia de conexões (índices dos tags) para desenhar as linhas.
const links: [number, number][] = [
  [0, 1],
  [0, 3],
  [1, 4],
  [3, 4],
  [3, 5],
  [2, 3],
  [3, 7],
  [7, 8],
  [7, 9],
  [5, 8],
  [4, 10],
  [2, 6],
  [6, 7],
];

const sizeClass: Record<string, string> = {
  sm: 'text-lg md:text-xl',
  md: 'text-2xl md:text-3xl',
  lg: 'text-3xl md:text-5xl',
};

export default function Constellation() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      let cleanup = () => {};
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        cleanup = runReveal(() => {
          // linhas surgem
          gsap.from('[data-cst="line"]', {
            opacity: 0,
            duration: 1,
            stagger: 0.05,
            ease: 'power2.out',
            scrollTrigger: { trigger: scope.current, start: 'top 70%', once: true },
          });
          // tags aparecem
          gsap.from('[data-cst="tag"]', {
            opacity: 0,
            scale: 0.8,
            y: 20,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: { trigger: scope.current, start: 'top 70%', once: true },
          });
          // float contínuo e sutil
          gsap.utils.toArray<HTMLElement>('[data-cst="tag"]').forEach((el, i) => {
            gsap.to(el, {
              y: '+=12',
              duration: 3 + (i % 4) * 0.6,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
              delay: i * 0.15,
            });
          });
        });
      });
      return () => cleanup();
    },
    { scope },
  );

  return (
    <div
      ref={scope}
      className="relative mx-auto mt-14 h-[520px] w-full max-w-5xl md:h-[620px]"
    >
      {/* linhas de conexão */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        {links.map(([a, b], i) => (
          <line
            key={i}
            data-cst="line"
            x1={tags[a].x}
            y1={tags[a].y}
            x2={tags[b].x}
            y2={tags[b].y}
            stroke="currentColor"
            strokeWidth="0.12"
            className="text-white/20"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      {/* tags */}
      {tags.map((t) => (
        <span
          key={t.label}
          data-cst="tag"
          style={{ left: `${t.x}%`, top: `${t.y}%` }}
          className={`font-display absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap italic text-white/85 ${sizeClass[t.size]}`}
        >
          {t.label}
        </span>
      ))}
    </div>
  );
}
