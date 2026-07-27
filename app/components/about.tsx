'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Counter from './counter';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Resultados reais (baseados no currículo)
const metrics = [
  {
    value: 300,
    prefix: '',
    suffix: 'ms',
    decimals: 0,
    label: 'Tempo de resposta de APIs (100–300ms) após otimização de queries SQL.',
    accent: false,
  },
  {
    value: 15,
    prefix: '+',
    suffix: '%',
    decimals: 0,
    label: 'Taxa de conversão em vendas complexas com atendimento consultivo.',
    accent: true,
  },
  {
    value: 20,
    prefix: '−',
    suffix: '%',
    decimals: 0,
    label: 'Erros de expedição, com otimização de fluxos e rastreabilidade.',
    accent: false,
  },
  {
    value: 100,
    prefix: '',
    suffix: '%',
    decimals: 0,
    label: 'Arquitetura em camadas e autenticação JWT para modularidade e segurança.',
    accent: true,
  },
];

export default function About() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
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
          <div className="mb-8 flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
            <span className="h-px w-10 bg-emerald-300/60" />
            Resumo Profissional
          </div>

          <h2 className="font-display dropcap text-3xl italic leading-tight text-[#f2efe6]/90 md:text-4xl">
            Desenvolvedor com base sólida em Ciência da Computação e especialização
            em Análise de Dados e IA Generativa — construindo interfaces modernas
            com React/Next.js e APIs escaláveis e seguras em Node.js, TypeScript e
            PostgreSQL.
          </h2>

          <p className="mt-6 max-w-2xl leading-relaxed text-[#f2efe6]/70">
            Especialista em automação de processos, integração de webhooks e
            consumo de APIs REST. Aplico Git e metodologias ágeis em projetos reais,
            com foco em arquitetura em camadas e alta performance. Atualmente
            focado em soluções SaaS e na integração de modelos de IA para
            otimização de fluxos operacionais.
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
                    locale={false}
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
