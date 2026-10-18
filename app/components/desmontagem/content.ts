// Conteúdo do portfólio (versão 3D e versão simples usam os mesmos dados).

export const SITE = "https://portfolio-genesis-one.vercel.app";
export const CV_URL = "/curriculo/Genesis_Melo_Curriculo_Full_Stack.pdf";
export const CV_FILE = "Genesis_Melo_Curriculo_Full_Stack.pdf";

export const EMAIL = "genesis.melo4398@hotmail.com";
export const LINKEDIN = "https://www.linkedin.com/in/genesis-melo/";
export const GITHUB = "https://github.com/7Genesis";
export const WHATSAPP_NUMBER = "5574998055726";
export const WHATSAPP = `https://wa.me/${WHATSAPP_NUMBER}`;
export const PLAY_STORE = "https://play.google.com/store/apps/details?id=com.saaejuazeiro.app";
export const STOCKFLOW = "https://stockflow-cyan.vercel.app";
export const LEADFLOW_REPO = "https://github.com/7Genesis/leadflow-engine";
export const CREDITFLOW_REPO = "https://github.com/7Genesis/CreditFlow";

export const IMG = "/desmontagem/img";
export const MODELS = {
  macbook: "/desmontagem/modelos/macbook_pro_m3_16_inch_2024_c.glb",
  iphone: "/desmontagem/modelos/iphone_17_pro_c.glb",
};

/** Quantidade de capítulos da cena 3D. */
export const NC = 8;
/** Tempo de parada de cada capítulo, em telas de rolagem. */
export const DWELL = [0, 0, 1.3, 2.6, 2.6, 2.2, 1.3, 0.4];
/** Altura da rolagem da cena, em telas: paradas + transições + 1 tela. */
export const SCROLL_SCREENS = DWELL.reduce((a, b) => a + b, 0) + (NC - 1) + 1;

export type ModalName = "cv" | "msg" | "perfil" | "projetos" | "experiencia";

export type Action = {
  label: string;
  href?: string;
  /** abre uma janela por cima da página; o href serve de alternativa sem JavaScript */
  modal?: ModalName;
  /** rola até o capítulo indicado (apenas na versão 3D) */
  goto?: number;
  primary?: boolean;
};

export type Step = {
  n: string;
  kicker: string;
  title: string;
  role?: string;
  text: string;
  chips?: string[];
  actions?: Action[];
};

export const STEPS: Step[] = [
  {
    n: "01",
    kicker: "01 · Perfil",
    title: "Genesis Melo",
    role: "Desenvolvedor Full Stack Júnior",
    text: "Construo APIs, integrações e produtos web e mobile que funcionam no dia a dia.",
    actions: [
      { label: "Role para desmontar ↓", goto: 1, primary: true },
      { label: "LinkedIn", href: LINKEDIN, modal: "perfil" },
    ],
  },
  {
    n: "02",
    kicker: "02 · Por dentro",
    title: "Desmontando a stack",
    text: "Todo sistema tem camadas. Role e veja o que construí em cada uma, do navegador ao banco de dados.",
    actions: [
      { label: "Ver todos os projetos", modal: "projetos", primary: true },
      { label: "Anatomia do MacBook", href: "/anatomia" },
    ],
  },
  {
    n: "03",
    kicker: "03 · Backend · placa-mãe",
    title: "LeadFlow Engine",
    text: "Webhook, fila e rodízio entre vendedores. Em teste de concorrência local, a diferença média caiu de 34 para 3 leads.",
    chips: ["NestJS", "Redis · BullMQ", "PostgreSQL", "Docker · CI"],
    actions: [{ label: "Ver código", href: LEADFLOW_REPO, primary: true }],
  },
  {
    n: "04",
    kicker: "04 · Produto em produção · celular",
    title: "SAAE: atendimento e app",
    text: "WhatsApp com IA integrado a um sistema legado, sem solicitações duplicadas, e o app do cidadão na Google Play com 185 testes.",
    chips: ["Python · Django", "Celery · Redis", "React Native", "TypeScript"],
    actions: [{ label: "Google Play", href: PLAY_STORE, primary: true }],
  },
  {
    n: "05",
    kicker: "05 · Sites · tela",
    title: "Sites que entregam",
    text: "Sites e landing pages sob demanda para clínicas, academia e agência, com integração ao WhatsApp.",
    chips: ["Next.js", "Tailwind", "WhatsApp"],
  },
  {
    n: "06",
    kicker: "06 · Dados e qualidade · bateria",
    title: "StockFlow e CreditFlow",
    text: "SaaS de estoque multiempresa, API de crédito em .NET e controle financeiro, com testes e CI no GitHub Actions.",
    chips: ["Next.js · Prisma", ".NET 10 · xUnit", "PostgreSQL", "67 testes"],
    actions: [
      { label: "Ver StockFlow", href: STOCKFLOW, primary: true },
      { label: "CreditFlow", href: CREDITFLOW_REPO },
    ],
  },
  {
    n: "07",
    kicker: "07 · Experiência",
    title: "Do atendimento ao código",
    text: "Estágio no SAAE Juazeiro desde ago/2026 e projetos próprios desde dez/2025, depois de vendas, compras e marketing.",
    actions: [{ label: "Ver experiência completa", modal: "experiencia", primary: true }],
  },
  {
    n: "08",
    kicker: "08 · Contato",
    title: "Vamos conversar?",
    text: "Procuro vaga remota Full Stack ou Backend, júnior ou pleno.",
    actions: [
      { label: "E-mail", href: `mailto:${EMAIL}`, primary: true },
      { label: "Enviar mensagem", href: WHATSAPP, modal: "msg" },
      { label: "LinkedIn", href: LINKEDIN, modal: "perfil" },
      { label: "GitHub", href: GITHUB },
      { label: "Currículo (PDF)", href: CV_URL, modal: "cv" },
    ],
  },
];

/** Rótulos curtos da barra inferior (um por capítulo). */
export const DOTS = ["Perfil", "Por dentro", "LeadFlow", "SAAE", "Sites", "Dados", "Carreira", "Contato"];

/** Etiquetas flutuantes mostradas na placa aberta (capítulo 2). */
export const LABELS = [
  { b: "Interface", t: "React · Next.js" },
  { b: "API", t: "NestJS · Django · .NET" },
  { b: "Dados", t: "PostgreSQL · Redis" },
  { b: "Entrega", t: "Docker · CI" },
];

/** Legendas das telas que trocam de imagem conforme a rolagem. */
export const SLIDES: Record<number, string[]> = {
  2: ["Teste de concorrência (gráfico)", "CI verde no GitHub Actions"],
  3: ["Início", "Serviços", "Atendimento", "Faturas"],
  4: ["Starfit · Transnordestina", "ConectaLab", "DocctorMed · Jacarepaguá", "DocctorMed · Caxias do Sul"],
  5: ["StockFlow · site publicado", "StockFlow · CI verde", "CreditFlow · CI verde"],
  6: ["Estágio no SAAE", "Projetos próprios e freelance", "Tráfego pago", "Vendas"],
};

// trechos de código mostrados ao lado da cena (HTML estático e confiável)
export const CODES: string[] = [
  `<span class="c">// perfil</span>\n<span class="k">const</span> genesis = {\n  role: <span class="s">'Full Stack Júnior'</span>,\n  stack: [<span class="s">'Node'</span>, <span class="s">'Python'</span>, <span class="s">'C#'</span>],\n  local: <span class="s">'Juazeiro, BA'</span>,\n};`,
  `<span class="c">// camadas de um sistema</span>\n<span class="k">const</span> sistema = [\n  <span class="s">'interface'</span>, <span class="s">'api'</span>,\n  <span class="s">'dados'</span>, <span class="s">'entrega'</span>,\n];`,
  `<span class="c">-- LeadFlow: rodízio sem travar</span>\n<span class="k">SELECT</span> id <span class="k">FROM</span> vendedor\n <span class="k">WHERE</span> disponivel\n <span class="k">ORDER BY</span> ultimo_lead\n <span class="k">FOR UPDATE SKIP LOCKED</span>\n <span class="k">LIMIT</span> <span class="n">1</span>;`,
  `<span class="c"># atendimento: sem duplicar</span>\n<span class="k">if</span> solicitacao_aberta(imovel):\n    <span class="k">return</span> avisar_andamento()\nabrir_solicitacao()`,
  `<span class="c">// sites sob demanda</span>\n<span class="k">const</span> entrega = [\n  <span class="s">'levantamento'</span>, <span class="s">'design'</span>,\n  <span class="s">'código'</span>, <span class="s">'deploy'</span>,\n];`,
  `<span class="c">$</span> npm test\n  <span class="s">67 passed</span>\n<span class="c">$</span> gh run list\n  <span class="s">✓ CI</span>  main`,
  `<span class="c">// carreira</span>\n<span class="k">const</span> carreira = [\n  { <span class="f">2025</span>: <span class="s">'projetos e freelance'</span> },\n  { <span class="f">2026</span>: <span class="s">'estágio no SAAE'</span> },\n];`,
  `<span class="k">await</span> <span class="f">contato</span>({\n  email: <span class="s">'${EMAIL}'</span>,\n  linkedin: <span class="s">'in/genesis-melo'</span>,\n  github: <span class="s">'7Genesis'</span>,\n});`,
];

// ---------- versão simples (celular, sem 3D)

export type Shot = { src: string; alt: string; w: number; h: number };

export type Project = {
  id: string;
  title: string;
  kind: string;
  text: string;
  chips: string[];
  shots: Shot[];
  /** capturas de celular são mais altas que largas */
  phone?: boolean;
  links: { label: string; href: string }[];
};

const site = (f: string, alt: string): Shot => ({ src: `${IMG}/${f}.jpg`, alt, w: 960, h: 576 });
const wide = (f: string, alt: string): Shot => ({ src: `${IMG}/${f}.jpg`, alt, w: 1167, h: 650 });
const app = (f: string, alt: string): Shot => ({ src: `${IMG}/${f}.jpg`, alt, w: 525, h: 1170 });

export const PROJECTS: Project[] = [
  {
    id: "leadflow",
    title: "LeadFlow Engine",
    kind: "Backend · filas e concorrência",
    text: STEPS[2].text,
    chips: STEPS[2].chips ?? [],
    shots: [wide("leadflow_actions", "Execução do CI do LeadFlow Engine no GitHub Actions, com todas as etapas verdes")],
    links: [{ label: "Ver código", href: LEADFLOW_REPO }],
  },
  {
    id: "saae",
    title: "SAAE: atendimento e app",
    kind: "Produto em produção · mobile",
    text: STEPS[3].text,
    chips: STEPS[3].chips ?? [],
    phone: true,
    shots: [
      app("jornada_inicio", "Tela inicial do app do cidadão do SAAE"),
      app("jornada_servicos", "Tela de serviços do app do SAAE"),
      app("jornada_atendimento", "Tela de atendimento do app do SAAE"),
      app("jornada_faturas", "Tela de faturas do app do SAAE"),
    ],
    links: [{ label: "Google Play", href: PLAY_STORE }],
  },
  {
    id: "sites",
    title: "Sites que entregam",
    kind: "Sites e landing pages",
    text: STEPS[4].text,
    chips: STEPS[4].chips ?? [],
    shots: [
      site("lp_starfit", "Landing page da Starfit Transnordestina"),
      site("lp_conectalab", "Landing page da ConectaLab"),
      site("lp_docctor1", "Landing page da DocctorMed Jacarepaguá"),
      site("lp_docctor2", "Landing page da DocctorMed Caxias do Sul"),
    ],
    links: [
      { label: "Starfit", href: "https://starfitpnz.com.br/transnordestina/" },
      { label: "ConectaLab", href: "https://lp.novalab.me/conectalab/" },
      { label: "DocctorMed Jacarepaguá", href: "https://docctormedjacarepagua.com.br/odontologia/" },
      { label: "DocctorMed Caxias do Sul", href: "https://docctormedcaxiasdosul.com.br/odontologia/" },
    ],
  },
  {
    id: "stockflow",
    title: "StockFlow e CreditFlow",
    kind: "Dados e qualidade",
    text: STEPS[5].text,
    chips: STEPS[5].chips ?? [],
    shots: [
      wide("stockflow_site", "Site do StockFlow publicado na Vercel"),
      wide("stockflow_actions", "CI do StockFlow verde no GitHub Actions"),
      wide("creditflow_actions", "CI do CreditFlow verde no GitHub Actions"),
    ],
    links: [
      { label: "Ver StockFlow", href: STOCKFLOW },
      { label: "CreditFlow", href: CREDITFLOW_REPO },
    ],
  },
];

export const STACK: { group: string; items: string[] }[] = [
  { group: "Interface", items: ["React", "Next.js", "React Native", "TypeScript", "Tailwind"] },
  { group: "API", items: ["Node.js", "NestJS", "Python", "Django", "C# · .NET"] },
  { group: "Dados", items: ["PostgreSQL", "Redis", "BullMQ", "Prisma"] },
  { group: "Entrega", items: ["Docker", "GitHub Actions", "Vercel", "Testes automatizados"] },
];

export const EXPERIENCE: { when: string; what: string; detail?: string }[] = [
  { when: "2026 — atual", what: "Estagiário Full Stack · SAAE Juazeiro", detail: "Atendimento por WhatsApp com IA integrado a um sistema legado, sem solicitações duplicadas, e app do cidadão na Google Play com 185 testes." },
  { when: "2025 — atual", what: "Projetos próprios e freelance", detail: "LeadFlow Engine, StockFlow e CreditFlow com testes e CI no GitHub Actions; sites e landing pages sob demanda." },
  { when: "2026", what: "Tráfego pago · Nova Lab" },
  { when: "2024 — 2025", what: "Consultor de vendas" },
];

export const CREDITS = [
  { work: "iPhone 17 Pro", author: "Ranguel" },
  { work: "macbook pro M3 16 inch 2024", author: "jackbaeten" },
];
