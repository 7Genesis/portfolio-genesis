import type { CSSProperties, ReactNode } from "react";
import type { CityVariant } from "./city";

// ---------- helpers de apresentação ----------

const rise = (i: number): CSSProperties => ({ ["--d" as never]: `${i * 70}ms` });

function SectionHead({ num, title, delayBase = 0 }: { num: string; title: string; delayBase?: number }) {
  return (
    <>
      <div data-rise style={rise(delayBase)} className="mb-6 flex items-center gap-4">
        <span className="text-xs tracking-widest text-fog">{num}</span>
        <span className="h-px flex-1 bg-white/15" />
      </div>
      <h2
        data-rise
        style={rise(delayBase + 1)}
        className="font-display text-[clamp(2.5rem,5.6vw,5.25rem)] font-black uppercase leading-[0.85] tracking-[-0.01em] text-white"
      >
        {title}
      </h2>
    </>
  );
}

// linha numerada de código
function L({ children }: { children: ReactNode }) {
  return (
    <li>
      <span>{children}</span>
    </li>
  );
}

function CodeBlock({ children, delay }: { children: ReactNode; delay: number }) {
  return (
    <ol data-rise style={rise(delay)} className="code-lines mt-8 text-[13px] text-ink/90 sm:text-sm">
      {children}
    </ol>
  );
}

function StatBar({ label, value }: { label: string; value: number }) {
  const blocks = 5;
  const on = Math.round(value / 20);
  return (
    <div className="flex items-baseline gap-3">
      <span className="tp">{label}</span>
      <span className="tc">:</span>
      <span className="tn">{value}</span>
      <span className="tc">,</span>
      <span className="statbar" aria-label={`${label}: ${value} de 100`}>
        {Array.from({ length: blocks }, (_, i) => (
          <i key={i} className={i < on ? "" : "off"} />
        ))}
      </span>
    </div>
  );
}

function ExtLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={`underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white ${className}`}>
      {children}
    </a>
  );
}

export function BtnCta({ href, children, download }: { href: string; children: ReactNode; download?: boolean }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      {...(download ? { download: true } : {})}
      className="inline-flex items-center gap-2 rounded-sm bg-cta px-6 py-3 font-mono text-sm font-medium text-[#0b0a1a] transition-transform duration-300 hover:-translate-y-0.5"
    >
      {children}
    </a>
  );
}

export function BtnGhost({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-sm border border-white/25 px-6 py-3 font-mono text-sm text-white transition-colors duration-300 hover:border-white/60 hover:bg-white/5"
    >
      {children}
    </a>
  );
}

// ---------- dados reais ----------

const WHATSAPP =
  "https://wa.me/5574998055726?text=Ol%C3%A1%20Genesis%2C%20vim%20pelo%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar%21";
const GITHUB = "https://github.com/7Genesis";
const LINKEDIN = "https://www.linkedin.com/in/genesis-melo/";
const EMAIL = "genesis.melo4398@gmail.com";

const systems = [
  {
    title: "Plataforma de atendimento do SAAE",
    tag: "IA · WhatsApp",
    desc: "Chatbot com LLM integrado ao GSAN, passagem para atendente humano, painel e pesquisa de satisfação. Python, Django, Celery, Redis.",
    note: "// código privado da equipe",
  },
  {
    title: "App do cidadão do SAAE",
    tag: "Mobile",
    desc: "Reescrito de Flutter para React Native (Expo) + TypeScript, com 185 testes automatizados. Em análise para publicação.",
    note: "// código privado da equipe",
  },
  {
    title: "CoreAcademy MeetPoint",
    tag: "SaaS",
    desc: "Plataforma white-label multi-tenant: cursos, comunidades, chat, vagas, pagamentos e criptografia de dados. NestJS, Prisma, React.",
    href: "https://novalab.me/meetpoint",
    cta: "ver demo",
  },
  {
    title: "LeadFlow Engine",
    tag: "Backend",
    desc: "Leads por webhook, fila no Redis (Bull), distribuição round-robin entre vendedores, painel Bull Board. NestJS, Prisma, PostgreSQL.",
    href: "https://github.com/7Genesis/leadflow-engine",
    cta: "ver no github",
  },
  {
    title: "CreditFlow",
    tag: "API .NET",
    desc: "API de propostas de crédito em .NET 10 com Clean Architecture, FluentValidation e testes xUnit.",
    href: "https://github.com/7Genesis/CreditFlow",
    cta: "ver no github",
  },
  {
    title: "StockFlow",
    tag: "SaaS",
    desc: "Estoque multiempresa com solicitações, aprovação, fornecedores e importação de NF-e (XML). Next.js e Prisma.",
    href: "https://stockflow-cyan.vercel.app",
    cta: "ver demo",
  },
  {
    title: "Portfólio 3D — MacBook",
    tag: "3D · Three.js",
    desc: "Portfólio em que um MacBook Pro 3D se desmonta na rolagem e a tela mostra cada projeto. Modelos CC BY 4.0.",
    href: "https://7genesis.github.io/portfolio-3d-macbook/",
    cta: "ver demo",
  },
  {
    title: "Nursing Lab 3D",
    tag: "3D · Saúde",
    desc: "Laboratório virtual de enfermagem: anatomia 3D com 464 músculos, ausculta, aferição de pressão, monitor de sinais vitais, quiz e casos clínicos. Three.js e Vite. Conteúdo didático.",
    href: "https://github.com/7Genesis/nursing-lab-3d",
    cta: "ver no github",
  },
];

const projects3d = [
  {
    title: "Portfólio 3D — MacBook desmontável",
    desc: "Um MacBook que se desmonta na rolagem e mostra meus projetos na tela. Three.js.",
    href: "https://7genesis.github.io/portfolio-3d-macbook/",
    cta: "ver demo",
  },
  {
    title: "Nursing Lab 3D",
    desc: "Anatomia 3D com mais de 450 músculos, ausculta, pressão arterial, monitor e casos clínicos. Conteúdo didático.",
    href: "https://github.com/7Genesis/nursing-lab-3d",
    cta: "ver no github",
  },
];

const landingSites = [
  { title: "Docctor Med Jacarepaguá", href: "https://docctormedjacarepagua.com.br/odontologia/" },
  { title: "NovaLab", href: "https://novalab.me/" },
  { title: "Docctor Med Caxias", href: "https://docctormedcaxiasdosul.com.br/odontologia/" },
  { title: "StarFit — Transnordestina", href: "https://starfitpnz.com.br/transnordestina/" },
  { title: "ConectaLab", href: "https://lp.novalab.me/conectalab/" },
];

const experiences = [
  {
    role: "Estagiário de Desenvolvimento",
    org: "SAAE Juazeiro · Água e Esgoto",
    period: "ago 2026 — atual",
    desc: "Plataforma WhatsApp com IA (LLM + RAG) integrada ao GSAN; app do cidadão reescrito em React Native com 185 testes; APIs REST em Django com pytest, CI e code review.",
  },
  {
    role: "Desenvolvedor Full Stack",
    org: "Projetos próprios e freelance",
    period: "dez 2025 — atual",
    desc: "Sistemas sob medida: LeadFlow (filas e webhooks), CreditFlow (.NET), StockFlow (SaaS de estoque), sites e landing pages integradas a WhatsApp e tráfego pago.",
  },
  {
    role: "Gestor de Tráfego Pago",
    org: "NovaLab · Marketing Digital",
    period: "abr — ago 2026",
    desc: "Funil completo no Meta Ads: Pixel, Conversion API, GTM e relatórios de CPA, CPC, CTR e ROAS. Automação de catálogos com Node.js e Electron.",
  },
  {
    role: "Assistente de Compras",
    org: "Gráfica Copylan",
    period: "dez 2025 — fev 2026",
    desc: "8 a 15 fornecedores e 5 a 10 pedidos por semana; negociação que reduziu custos em cerca de 10%, com dashboards em Excel.",
  },
  {
    role: "Consultor de Vendas",
    org: "Grupo Batalha",
    period: "mai 2024 — dez 2025",
    desc: "Até 20 clientes por dia, ticket de R$ 2 mil a R$ 6 mil e faturamento de R$ 60–120 mil/mês, com pipeline em CRM.",
  },
];

const results = [
  { num: "185", label: "testes automatizados no app do cidadão do SAAE (React Native + TypeScript)" },
  { num: "+1.000", label: "contribuições no GitHub nos últimos 12 meses, incluindo repos privados da equipe" },
  { num: "8 mil", label: "linhas de Dart reescritas para React Native e TypeScript no app do cidadão" },
  { num: "+10", label: "projetos com código público no GitHub — APIs, SaaS, apps web e mobile" },
];

// ---------- seções ----------

function Inicio() {
  return (
    <>
      <div data-rise style={rise(0)} className="mb-6 flex items-center gap-4">
        <span className="text-xs tracking-widest text-fog">01</span>
        <span className="h-px flex-1 bg-white/15" />
      </div>
      <p data-rise style={rise(1)} className="text-sm text-ink/70">
        Olá, eu sou
      </p>
      <h1
        data-rise
        style={rise(2)}
        className="mt-2 font-display text-[clamp(3.5rem,7.8vw,7.8rem)] font-black uppercase leading-[0.82] tracking-[-0.01em] text-white"
      >
        Genesis
        <br />
        Melo<span className="text-accent">.</span>
      </h1>
      <p data-rise style={rise(3)} className="mt-5 font-mono text-lg text-accent">
        Desenvolvedor Full Stack
      </p>
      <p data-rise style={rise(4)} className="mt-4 max-w-md text-[13px] leading-relaxed text-ink/75 sm:text-sm">
        TypeScript, Node.js, NestJS · Python, Django · React, React Native · PostgreSQL
      </p>
      <p data-rise style={rise(5)} className="mt-2 text-[13px] text-ink/55 sm:text-sm">
        Juazeiro, BA · remoto ou presencial
      </p>
      <div data-rise style={rise(6)} className="mt-8 flex flex-wrap gap-3">
        <BtnCta href="/curriculo-genesis-melo.pdf" download>
          ↓ baixar currículo.pdf
        </BtnCta>
        <BtnGhost href={WHATSAPP}>falar no whatsapp</BtnGhost>
      </div>
      <p data-rise style={rise(7)} className="mt-8 max-w-md text-[13px] leading-relaxed text-ink/70 sm:text-sm">
        <span className="tp">Hoje:</span> plataforma de atendimento com IA no SAAE de Juazeiro e app do
        cidadão em análise para publicação.
      </p>
      <aside data-rise style={rise(8)} aria-label="Projetos 3D" className="mt-6 max-w-md border border-white/15 bg-white/[0.03] p-3">
        <p className="font-mono text-xs text-accent">novo · meus projetos 3D</p>
        <ul className="mt-2 space-y-2">
          {projects3d.map((p) => (
            <li key={p.title} className="text-[13px] leading-snug text-ink/75">
              <ExtLink href={p.href} className="font-medium text-white">
                {p.title} ↗
              </ExtLink>
              <span className="block text-ink/60">{p.desc}</span>
            </li>
          ))}
        </ul>
      </aside>
      <p data-rise style={rise(9)} className="mt-6 text-xs text-fog">
        role para continuar ↓
      </p>
    </>
  );
}

function Perfil() {
  return (
    <>
      <SectionHead num="02" title="Perfil" />
      <div data-rise style={rise(2)} className="mt-8 flex items-center gap-5">
        <figure className="rotate-2 rounded-sm border border-white/15 bg-white/[0.04] p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/genesis-melo.jpg" alt="Genesis Melo" className="h-28 w-28 rounded-[2px] object-cover" />
          <figcaption className="mt-2 text-center text-[10px] text-fog">genesis-melo.jpg</figcaption>
        </figure>
        <div>
          <p className="max-w-sm text-[13px] leading-relaxed text-ink/80 sm:text-sm">
            Full stack em início de carreira com sistemas em produção. Venho de vendas, compras e
            logística — entendo o problema do negócio antes de escrever código.
          </p>
        </div>
      </div>
      <CodeBlock delay={3}>
        <L>
          <span className="tk">const</span> <span className="tp">perfil</span> = {"{"}
        </L>
        <L>
          {"  "}nome: <span className="ts">"Genesis Melo"</span>,
        </L>
        <L>
          {"  "}cargo: <span className="ts">"Desenvolvedor Full Stack"</span>,
        </L>
        <L>
          {"  "}base: <span className="ts">"Juazeiro, BA — remoto ou presencial"</span>,
        </L>
        <L>
          {"  "}atualmente: <span className="ts">"SAAE · IA no atendimento por WhatsApp"</span>,
        </L>
        <L>
          {"  "}formacao: [<span className="ts">"Ciência da Computação — Estácio (2029)"</span>,{" "}
          <span className="ts">"Eng. de Software — Unigrande (2029)"</span>],
        </L>
        <L>{"}"};</L>
      </CodeBlock>
      <div data-rise style={rise(4)} className="mt-6 space-y-2 text-[13px] sm:text-sm">
        <p className="tc">{"// atributos (autoavaliação)"}</p>
        <StatBar label="backend" value={90} />
        <StatBar label="frontend" value={80} />
        <StatBar label="mobile" value={75} />
        <StatBar label="ia" value={60} />
      </div>
    </>
  );
}

function Habilidades() {
  return (
    <>
      <SectionHead num="03" title="Habilidades" />
      <CodeBlock delay={2}>
        <L>
          <span className="tk">const</span> <span className="tp">habilidades</span> = {"{"}
        </L>
        <L>
          {"  "}linguagens: [<span className="ts">"TypeScript"</span>, <span className="ts">"JavaScript"</span>,{" "}
          <span className="ts">"Python"</span>, <span className="ts">"C#"</span>],
        </L>
        <L>
          {"  "}backend: [<span className="ts">"Node.js"</span>, <span className="ts">"NestJS"</span>,{" "}
          <span className="ts">"Express"</span>, <span className="ts">"Django (DRF, Celery)"</span>,{" "}
          <span className="ts">"ASP.NET Core"</span>, <span className="ts">"APIs REST"</span>,{" "}
          <span className="ts">"JWT"</span>, <span className="ts">"webhooks"</span>],
        </L>
        <L>
          {"  "}frontend: [<span className="ts">"React"</span>, <span className="ts">"Next.js"</span>,{" "}
          <span className="ts">"React Native (Expo)"</span>, <span className="ts">"Tailwind"</span>],
        </L>
        <L>
          {"  "}dados: [<span className="ts">"PostgreSQL"</span>, <span className="ts">"MySQL"</span>,{" "}
          <span className="ts">"Redis"</span>, <span className="ts">"Prisma"</span>],
        </L>
        <L>
          {"  "}infra: [<span className="ts">"Docker"</span>, <span className="ts">"Git/GitHub"</span>,{" "}
          <span className="ts">"CI"</span>],
        </L>
        <L>
          {"  "}ia: [<span className="ts">"LLMs (Gemini, Ollama)"</span>, <span className="ts">"RAG"</span>,{" "}
          <span className="ts">"chatbots"</span>],
        </L>
        <L>
          {"  "}praticas: [<span className="ts">"testes automatizados"</span>, <span className="ts">"code review"</span>,{" "}
          <span className="ts">"Clean Architecture"</span>],
        </L>
        <L>{"}"};</L>
      </CodeBlock>
      <p data-rise style={rise(3)} className="mt-6 max-w-md text-[13px] leading-relaxed text-ink/70 sm:text-sm">
        Do banco de dados à interface — e do commit ao ar: lint, build, code review e testes antes de
        cada entrega.
      </p>
    </>
  );
}

function Experiencia() {
  return (
    <>
      <SectionHead num="04" title="Experiência" />
      <div className="mt-8">
        {experiences.map((e, i) => (
          <div data-rise style={rise(2 + i)} key={e.role} className="border-b border-white/10 py-4 first:border-t">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-xl font-bold uppercase tracking-wide text-white">
                {e.role}
              </h3>
              <span className="text-xs text-fog">{e.period}</span>
            </div>
            <p className="mt-0.5 text-[13px] text-accent/90">{e.org}</p>
            <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-ink/70">{e.desc}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function Projetos() {
  return (
    <>
      <SectionHead num="05" title="Projetos" />
      <p data-rise style={rise(2)} className="mt-4 max-w-md text-[13px] text-ink/70 sm:text-sm">
        <span className="tc">{"// sistemas que eu construí — do chatbot com IA ao app mobile"}</span>
      </p>
      <div className="mt-6 grid gap-x-10 xl:grid-cols-2">
        {systems.map((p, i) => (
          <div data-rise style={rise(3 + i)} key={p.title} className="border-b border-white/10 py-4">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-lg font-bold text-white">
                <span className="mr-2 font-mono text-xs text-fog">{p.tag}</span>
                {p.title}
              </h3>
            </div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink/70">{p.desc}</p>
            {p.href ? (
              <ExtLink href={p.href} className="mt-2 inline-block text-[13px] text-accent">
                {p.cta} ↗
              </ExtLink>
            ) : (
              <span className="mt-2 inline-block text-[13px] text-fog">{p.note}</span>
            )}
          </div>
        ))}
      </div>
      <p data-rise style={rise(9)} className="mt-8 text-[13px] text-ink/70">
        <span className="tc">{"// landing pages no ar: "}</span>
        {landingSites.map((s, i) => (
          <span key={s.title}>
            <ExtLink href={s.href} className="text-ink/90 hover:text-white">
              {s.title}
            </ExtLink>
            {i < landingSites.length - 1 && <span className="text-fog"> · </span>}
          </span>
        ))}
      </p>
    </>
  );
}

function Resultados() {
  return (
    <>
      <SectionHead num="06" title="Resultados" />
      <div className="mt-10 grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2">
        {results.map((r, i) => (
          <div data-rise style={rise(2 + i)} key={r.label}>
            <p className="font-display text-7xl font-black leading-none text-white lg:text-8xl">
              {r.num}
            </p>
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-ink/70">{r.label}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function Contato() {
  const lines: [string, ReactNode][] = [
    ["whatsapp", <ExtLink key="w" href={WHATSAPP} className="text-accent">wa.me/55 74 99805-5726</ExtLink>],
    ["email", <ExtLink key="e" href={`mailto:${EMAIL}`} className="text-accent">{EMAIL}</ExtLink>],
    ["github", <ExtLink key="g" href={GITHUB} className="text-accent">github.com/7Genesis</ExtLink>],
    ["linkedin", <ExtLink key="l" href={LINKEDIN} className="text-accent">linkedin.com/in/genesis-melo</ExtLink>],
  ];
  return (
    <>
      <SectionHead num="07" title="Contato" />
      <p data-rise style={rise(2)} className="mt-4 text-[13px] text-ink/75 sm:text-sm">
        Pode me chamar no WhatsApp ou por e-mail. Aberto a vagas full stack e freelance — remoto,
        presencial ou mudança de cidade.
      </p>
      <div data-rise style={rise(3)} className="mt-8 space-y-3">
        {lines.map(([k, v]) => (
          <p key={k} className="text-[13px] sm:text-sm">
            <span className="tp">$</span> <span className="tc">{k}</span>
            <br />
            {v}
          </p>
        ))}
      </div>
      <div data-rise style={rise(4)} className="mt-10 flex flex-wrap gap-3">
        <BtnCta href={WHATSAPP}>falar no whatsapp</BtnCta>
        <BtnGhost href="/curriculo-genesis-melo.pdf">baixar currículo.pdf</BtnGhost>
      </div>
      <p data-rise style={rise(5)} className="mt-12 text-xs text-white/30">
        © 2026 Genesis Melo · feito com Next.js — cena, código e cafeína.
      </p>
    </>
  );
}

// ---------- registro ----------

export interface SectionDef {
  id: string;
  num: string;
  label: string;
  scene: CityVariant;
  content: ReactNode;
}

export const SECTIONS: SectionDef[] = [
  { id: "inicio", num: "01", label: "Início", scene: "night", content: <Inicio /> },
  { id: "perfil", num: "02", label: "Perfil", scene: "street", content: <Perfil /> },
  { id: "habilidades", num: "03", label: "Habilidades", scene: "clouds", content: <Habilidades /> },
  { id: "experiencia", num: "04", label: "Experiência", scene: "midnight", content: <Experiencia /> },
  { id: "projetos", num: "05", label: "Projetos", scene: "room", content: <Projetos /> },
  { id: "resultados", num: "06", label: "Resultados", scene: "neon", content: <Resultados /> },
  { id: "contato", num: "07", label: "Contato", scene: "sunset", content: <Contato /> },
];
