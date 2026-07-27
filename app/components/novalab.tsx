'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Counter from './counter';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ArrowIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

// Serviços da agência (especificação NovaLab)
const services = [
  {
    title: 'Tráfego Pago',
    desc: 'Gestão de Meta Ads e Google Ads com foco em ROAS, estruturação de funis e escala previsível.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  {
    title: 'Landing Pages de Alta Conversão',
    desc: 'Páginas rápidas e persuasivas, otimizadas para captação de leads e vendas diretas.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
  },
  {
    title: 'Otimização com IA',
    desc: 'Automação de criativos, análise preditiva e agilidade operacional impulsionada por IA.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1 0 8v1a4 4 0 0 1-8 0v-1a4 4 0 0 1 0-8V6a4 4 0 0 1 4-4z" />
        <line x1="12" y1="9" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    title: 'SEO & Analytics',
    desc: 'SEO técnico e local, rastreamento de eventos e dashboards para decisão orientada a dados.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    title: 'Criativos & Branding',
    desc: 'Identidade visual e criativos de performance que comunicam valor e aumentam o CTR.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <circle cx="13.5" cy="6.5" r="2.5" />
        <circle cx="6.5" cy="12" r="2.5" />
        <circle cx="15" cy="15" r="2.5" />
        <path d="M12 2a10 10 0 1 0 0 20c1.4 0 2-1 2-2 0-1.5-1-2-1-3 0-.8.7-1.5 1.5-1.5H17a5 5 0 0 0 5-5c0-4.4-4.5-8-10-8z" />
      </svg>
    ),
  },
  {
    title: 'Automação & Integração',
    desc: 'Fluxos automatizados, CRM e integrações que conectam marketing, vendas e operação.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
      </svg>
    ),
  },
];

export default function NovaLabShowcase() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Cabeçalho
      gsap.from('[data-nl="head"] > *', {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '[data-nl="head"]', start: 'top 85%', once: true },
      });

      // Cards de serviço em cascata
      gsap.from('[data-nl="service"]', {
        opacity: 0,
        y: 56,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '[data-nl="services"]', start: 'top 80%', once: true },
      });

      // Faixa de métricas
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
      className="relative overflow-hidden border-y border-slate-800/50 bg-slate-900/30 py-28"
    >
      {/* brilhos de fundo */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-700/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-emerald-600/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* CABEÇALHO */}
        <div data-nl="head" className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-900/20 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
              Agência de Marketing
            </span>
          </div>

          <h2 className="mt-6 text-4xl font-black tracking-tighter text-white md:text-6xl">
            Nova<span className="text-blue-500">Lab</span>
          </h2>

          <p className="mt-5 text-xl font-light leading-relaxed text-slate-300 md:text-2xl">
            Performance, tráfego e{' '}
            <span className="font-semibold text-white">Inteligência Artificial</span>{' '}
            que transformam investimento em receita previsível.
          </p>

          <p className="mt-4 max-w-2xl leading-relaxed text-slate-400">
            Agência focada em growth para negócios que querem escalar. Unimos
            gestão de tráfego, engenharia de conversão e automação com IA para
            reduzir CPA, aumentar o ROAS e gerar demanda qualificada de forma
            consistente.
          </p>

          <a
            href="https://novalab.me/"
            target="_blank"
            rel="noreferrer"
            className="group mt-8 inline-flex items-center gap-2 rounded-md bg-white px-7 py-3.5 font-bold text-slate-950 transition-all hover:bg-slate-200"
          >
            Conhecer a NovaLab
            <span className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
              <ArrowIcon />
            </span>
          </a>
        </div>

        {/* SERVIÇOS */}
        <div
          data-nl="services"
          className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((s) => (
            <div
              key={s.title}
              data-nl="service"
              className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40"
            >
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-500/5 blur-2xl transition-colors group-hover:bg-emerald-500/15" />
              <div className="relative z-10 mb-5 inline-flex rounded-xl border border-slate-800 bg-slate-900 p-3 text-emerald-400">
                {s.icon}
              </div>
              <h3 className="relative z-10 text-lg font-bold text-white">
                {s.title}
              </h3>
              <p className="relative z-10 mt-2 text-sm leading-relaxed text-slate-400">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* MÉTRICAS / PROVA REAL */}
        <div className="mt-16">
          <h3 className="text-sm font-black uppercase tracking-widest text-emerald-500">
            Resultados reais
          </h3>
          <p className="mt-2 max-w-2xl text-slate-400">
            Gestão estratégica de tráfego com estruturação de funis, otimização
            criativa e redução drástica do CPA.
          </p>

          <div
            data-nl="metrics"
            className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            <div
              data-nl="metric"
              className="rounded-2xl border border-slate-800 bg-slate-950/60 p-7"
            >
              <p className="text-3xl font-black text-white">
                <Counter value={203588} prefix="R$ " decimals={2} />
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Faturamento gerado em vendas com otimização extrema de ROAS.
              </p>
            </div>

            <div
              data-nl="metric"
              className="rounded-2xl border border-slate-800 bg-slate-950/60 p-7"
            >
              <p className="text-3xl font-black text-emerald-400">
                <Counter value={3.87} prefix="R$ " decimals={2} />
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Custo por compra em grandes eventos e lançamentos.
              </p>
            </div>

            <div
              data-nl="metric"
              className="rounded-2xl border border-slate-800 bg-slate-950/60 p-7"
            >
              <p className="text-3xl font-black text-white">
                <Counter value={5.1} prefix="R$ " decimals={2} suffix="–6,30" />
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Custo por conversa na captação de leads de alto ticket.
              </p>
            </div>

            <div
              data-nl="metric"
              className="rounded-2xl border border-slate-800 bg-slate-950/60 p-7"
            >
              <p className="text-3xl font-black text-blue-400">
                <Counter value={100} suffix="%" />
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Campanhas orientadas a dados, do criativo ao pós-venda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
