'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Counter from './counter';
import { runReveal } from './animations';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Números que dá para conferir nos repositórios e no GitHub (24/09/2026)
const metrics = [
  {
    value: 185,
    prefix: '',
    suffix: '',
    decimals: 0,
    label: 'Testes automatizados no app do cidadão do SAAE, escrito em React Native e TypeScript.',
    accent: false,
  },
  {
    value: 1000,
    prefix: '+',
    suffix: '',
    decimals: 0,
    label: 'Contribuições no GitHub nos últimos 12 meses, contando os repositórios privados da equipe.',
    accent: true,
  },
  {
    value: 8,
    prefix: '',
    suffix: ' mil',
    decimals: 0,
    label: 'Linhas de Dart do app antigo reescritas em React Native e TypeScript.',
    accent: false,
  },
  {
    value: 10,
    prefix: '+',
    suffix: '',
    decimals: 0,
    label: 'Projetos com código público no GitHub, de APIs a apps web e mobile.',
    accent: true,
  },
];

export default function About() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      let cleanup = () => {};
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        cleanup = runReveal(() => {
          gsap.from('[data-ab="head"] > *', {
            opacity: 0,
            y: 40,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: { trigger: '[data-ab="head"]', start: 'top 85%', once: true },
          });

          gsap.from('[data-ab="metric"]', {
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: { trigger: '[data-ab="metrics"]', start: 'top 85%', once: true },
          });
        });
      });
      return () => cleanup();
    },
    { scope },
  );

  return (
    <section
      id="sobre"
      ref={scope}
      className="relative overflow-hidden bg-[#053b2c] py-28 text-[#f2efe6]"
    >
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div data-ab="head" className="max-w-4xl">
          <div className="mb-8 flex items-center gap-4">
            <Image
              src="/genesis-melo.jpg"
              alt="Retrato de Genesis Melo"
              width={72}
              height={72}
              className="h-[72px] w-[72px] rounded-full object-cover ring-2 ring-emerald-300/50"
            />
            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
              <span className="h-px w-10 bg-emerald-300/60" />
              Resumo Profissional
            </div>
          </div>

          <h2 className="font-display dropcap text-3xl italic leading-tight text-[#f2efe6]/90 md:text-4xl">
            Desenvolvedor Full Stack Júnior, cursando Ciência da Computação e Engenharia de
            Software — construo chatbots com IA, apps em React Native e APIs em
            Python, Node.js e TypeScript, do banco de dados à interface.
          </h2>

          <p className="mt-6 max-w-2xl leading-relaxed text-[#f2efe6]/70">
            No SAAE de Juazeiro, coloquei em produção uma plataforma de atendimento
            por WhatsApp com IA e reescrevi o app do cidadão, publicado na Google
            Play. Venho de vendas, compras e logística, o que me ajuda a
            entender o problema do negócio antes de escrever código. Trabalho com
            Git, pull requests com code review e testes automatizados.
          </p>
        </div>

        <div className="mt-20">
          <div className="mb-8 flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
            <span className="h-px w-10 bg-emerald-300/60" />
            Principais Resultados
          </div>

          <div
            data-ab="metrics"
            className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-[#f2efe6]/15 bg-[#f2efe6]/15 sm:grid-cols-2 lg:grid-cols-4"
          >
            {metrics.map((m, i) => (
              <div key={i} data-ab="metric" className="bg-[#053b2c] p-8">
                <p
                  className={`headline text-4xl font-black md:text-5xl ${
                    m.accent ? 'text-emerald-300' : 'text-[#f2efe6]'
                  }`}
                >
                  <Counter
                    value={m.value}
                    prefix={m.prefix}
                    suffix={m.suffix}
                    decimals={m.decimals}
                  />
                </p>
                <p className="mt-3 text-sm text-[#f2efe6]/70">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
