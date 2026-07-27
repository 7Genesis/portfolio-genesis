'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Counter from './counter';
import { Pill } from './ui';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Serviços da agência (especificação NovaLab)
const services = [
  {
    n: '01',
    title: 'Tráfego Pago',
    desc: 'Gestão de Meta Ads e Google Ads com foco em ROAS, estruturação de funis e escala previsível.',
  },
  {
    n: '02',
    title: 'Landing Pages de Alta Conversão',
    desc: 'Páginas rápidas e persuasivas, otimizadas para captação de leads e vendas diretas.',
  },
  {
    n: '03',
    title: 'Otimização com IA',
    desc: 'Automação de criativos, análise preditiva e agilidade operacional impulsionada por IA.',
  },
  {
    n: '04',
    title: 'SEO & Analytics',
    desc: 'SEO técnico e local, rastreamento de eventos e dashboards para decisão orientada a dados.',
  },
  {
    n: '05',
    title: 'Criativos & Branding',
    desc: 'Identidade visual e criativos de performance que comunicam valor e aumentam o CTR.',
  },
  {
    n: '06',
    title: 'Automação & Integração',
    desc: 'Fluxos automatizados, CRM e integrações que conectam marketing, vendas e operação.',
  },
];

export default function NovaLabShowcase() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-nl="head"] > *', {
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: '[data-nl="head"]', start: 'top 85%', once: true },
        });

        gsap.from('[data-nl="service"]', {
          opacity: 0,
          y: 40,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: '[data-nl="services"]', start: 'top 80%', once: true },
        });

        gsap.from('[data-nl="metric"]', {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: '[data-nl="metrics"]', start: 'top 85%', once: true },
        });
      });
    },
    { scope },
  );

  return (
    <section
      id="novalab"
      ref={scope}
      className="relative overflow-hidden bg-[#053b2c] py-28 text-[#f2efe6]"
    >
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* CABEÇALHO */}
        <div data-nl="head" className="max-w-4xl">
          <div className="mb-8 flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
            <span className="h-px w-10 bg-emerald-300/60" />
            Agência de Marketing
          </div>

          <h2 className="headline text-6xl font-black md:text-8xl">
            Nova<span className="text-emerald-300">Lab</span>
          </h2>

          <p className="font-display dropcap mt-8 max-w-3xl text-3xl italic leading-tight text-[#f2efe6]/90 md:text-4xl">
            Performance, tráfego e Inteligência Artificial que transformam
            investimento em receita previsível.
          </p>

          <p className="mt-6 max-w-2xl leading-relaxed text-[#f2efe6]/70">
            Agência focada em growth para negócios que querem escalar. Unimos
            gestão de tráfego, engenharia de conversão e automação com IA para
            reduzir CPA, aumentar o ROAS e gerar demanda qualificada de forma
            consistente.
          </p>

          <div className="mt-10">
            <Pill href="https://novalab.me/" variant="light">
              Conhecer a NovaLab
            </Pill>
          </div>
        </div>

        {/* SERVIÇOS — lista editorial */}
        <div data-nl="services" className="mt-20 border-t border-[#f2efe6]/15">
          {services.map((s) => (
            <div
              key={s.n}
              data-nl="service"
              className="group grid grid-cols-1 gap-2 border-b border-[#f2efe6]/15 py-8 transition-colors hover:bg-[#f2efe6]/[0.03] md:grid-cols-[auto_1fr_1.4fr] md:items-baseline md:gap-10"
            >
              <span className="font-display text-2xl italic text-emerald-300/80">
                {s.n}
              </span>
              <h3 className="text-2xl font-black tracking-tight md:text-3xl">
                {s.title}
              </h3>
              <p className="max-w-xl leading-relaxed text-[#f2efe6]/70">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* MÉTRICAS */}
        <div className="mt-20">
          <div className="mb-8 flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
            <span className="h-px w-10 bg-emerald-300/60" />
            Resultados reais
          </div>

          <div
            data-nl="metrics"
            className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-[#f2efe6]/15 bg-[#f2efe6]/15 sm:grid-cols-2 lg:grid-cols-4"
          >
            <div data-nl="metric" className="bg-[#053b2c] p-8">
              <p className="headline text-4xl font-black md:text-5xl">
                <Counter value={203588} prefix="R$ " decimals={2} />
              </p>
              <p className="mt-3 text-sm text-[#f2efe6]/70">
                Faturamento gerado em vendas com otimização extrema de ROAS.
              </p>
            </div>
            <div data-nl="metric" className="bg-[#053b2c] p-8">
              <p className="headline text-4xl font-black text-emerald-300 md:text-5xl">
                <Counter value={3.87} prefix="R$ " decimals={2} />
              </p>
              <p className="mt-3 text-sm text-[#f2efe6]/70">
                Custo por compra em grandes eventos e lançamentos.
              </p>
            </div>
            <div data-nl="metric" className="bg-[#053b2c] p-8">
              <p className="headline text-4xl font-black md:text-5xl">
                <Counter value={5.1} prefix="R$ " decimals={2} suffix="–6,30" />
              </p>
              <p className="mt-3 text-sm text-[#f2efe6]/70">
                Custo por conversa na captação de leads de alto ticket.
              </p>
            </div>
            <div data-nl="metric" className="bg-[#053b2c] p-8">
              <p className="headline text-4xl font-black text-emerald-300 md:text-5xl">
                <Counter value={100} suffix="%" />
              </p>
              <p className="mt-3 text-sm text-[#f2efe6]/70">
                Campanhas orientadas a dados, do criativo ao pós-venda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
