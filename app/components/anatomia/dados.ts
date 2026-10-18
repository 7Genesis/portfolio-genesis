/** Conteúdo técnico da página Anatomia: valores de referência do MacBook Pro 14" com chip Apple M1 Pro (2021). */

export type ItemId =
  | "tela"
  | "teclado"
  | "trackpad"
  | "carcaca"
  | "placa"
  | "chip"
  | "cpu"
  | "gpu"
  | "neural"
  | "memoria"
  | "ssd"
  | "refrigeracao"
  | "bateria"
  | "falantes"
  | "portas";

export type Item = {
  id: ItemId;
  nome: string;
  /** rótulo curto da etiqueta no modelo */
  curto: string;
  categoria: string;
  cor: string;
  funcao: string;
  fluxo: string;
  specs: [string, string][];
};

export const ITENS: Item[] = [
  {
    id: "tela",
    nome: "Tela Liquid Retina XDR",
    curto: "Tela XDR",
    categoria: "Exibição",
    cor: "#6aa8ff",
    funcao:
      "Painel LCD com retroiluminação de mini-LED dividida em zonas. Cada zona acende e apaga de forma independente, o que dá pretos profundos e brilho alto em HDR.",
    fluxo:
      "A GPU do chip envia os quadros pela matriz de exibição; o controlador de tela (TCON) ajusta as zonas de brilho a cada quadro. É um dos maiores consumidores de energia da bateria.",
    specs: [
      ["Tamanho", '14,2" na diagonal'],
      ["Resolução", "3024 × 1964 (254 ppi)"],
      ["Brilho", "1.000 nits contínuos, 1.600 nits de pico em HDR"],
      ["Taxa de atualização", "ProMotion adaptativa, até 120 Hz"],
      ["Retroiluminação", "mais de 10.000 mini-LEDs"],
      ["Cores", "gama ampla P3, True Tone"],
    ],
  },
  {
    id: "teclado",
    nome: "Teclado Magic Keyboard",
    curto: "Teclado",
    categoria: "Entrada",
    cor: "#8f8cff",
    funcao:
      "Teclas de mecanismo tesoura com curso curto e retroiluminação individual. A fileira de funções tem teclas de altura normal e o botão de liga/desliga integra o sensor Touch ID.",
    fluxo:
      "Cada toque fecha um contato na membrana e o controlador do teclado envia o código da tecla à placa lógica por um cabo flexível. O Touch ID é lido pelo Secure Enclave do chip.",
    specs: [
      ["Mecanismo", "tesoura, de perfil baixo"],
      ["Retroiluminação", "LED com ajuste pelo sensor de luz ambiente"],
      ["Fileira de funções", "teclas físicas de altura normal"],
      ["Biometria", "Touch ID no botão de liga/desliga"],
    ],
  },
  {
    id: "trackpad",
    nome: "Trackpad Force Touch",
    curto: "Trackpad",
    categoria: "Entrada",
    cor: "#a98cff",
    funcao:
      "Superfície de vidro grande, com sensores de pressão nos cantos. O clique é simulado por um motor Taptic Engine, que vibra no instante do toque.",
    fluxo:
      "Os sensores medem posição e força; a placa lógica interpreta gestos de vários dedos e aciona o Taptic Engine para dar a sensação de clique, sem peça móvel visível.",
    specs: [
      ["Tecnologia", "Force Touch com Taptic Engine"],
      ["Gestos", "multitoque, com pressão em dois níveis"],
      ["Superfície", "vidro de grande área"],
    ],
  },
  {
    id: "carcaca",
    nome: "Carcaça de alumínio",
    curto: "Carcaça",
    categoria: "Estrutura",
    cor: "#9aa3c7",
    funcao:
      "Estrutura unibody usinada em alumínio. Ela sustenta os componentes, protege a eletrônica e ajuda a dissipar calor. A parte de baixo tem as saídas de ar; a de cima guarda teclado e trackpad.",
    fluxo:
      "O ar entra pelas aberturas da base, passa pelas ventoinhas e sai pela fresta junto à dobradiça, atrás da tela. A própria carcaça funciona como parte do dissipador.",
    specs: [
      ["Material", "alumínio usinado (unibody)"],
      ["Dimensões", "31,26 × 22,12 × 1,55 cm"],
      ["Peso", "cerca de 1,6 kg"],
    ],
  },
  {
    id: "placa",
    nome: "Placa lógica",
    curto: "Placa lógica",
    categoria: "Eletrônica",
    cor: "#5f7bff",
    funcao:
      "Placa de circuito que liga todas as partes. Reúne o chip, o armazenamento, os reguladores de energia, o controlador Thunderbolt e os módulos de Wi-Fi e Bluetooth.",
    fluxo:
      "Trilhas de cobre levam sinais de alta velocidade entre o chip, o SSD e as portas. Conversores de tensão transformam a energia da bateria nas várias voltagens de que cada componente precisa.",
    specs: [
      ["Conexões sem fio", "Wi-Fi 6 (802.11ax) e Bluetooth 5.0"],
      ["Energia", "múltiplos conversores de tensão (VRMs)"],
      ["Montagem", "memória e SSD soldados, sem peças trocáveis"],
    ],
  },
  {
    id: "chip",
    nome: "Chip Apple M1 Pro",
    curto: "Apple M1 Pro",
    categoria: "Processamento",
    cor: "#7a7dff",
    funcao:
      "Sistema em um chip (SoC). Junta CPU, GPU, Neural Engine, motores de mídia, controlador de SSD e Thunderbolt em um único pacote, com a memória unificada ao lado.",
    fluxo:
      "Por estar tudo no mesmo silício, CPU, GPU e Neural Engine enxergam a mesma memória, sem copiar dados entre componentes. Isso reduz latência e consumo de energia.",
    specs: [
      ["Processo", "5 nm"],
      ["Transistores", "33,7 bilhões"],
      ["CPU", "8 ou 10 núcleos"],
      ["GPU", "14 ou 16 núcleos"],
      ["Neural Engine", "16 núcleos"],
      ["Banda de memória", "200 GB/s"],
    ],
  },
  {
    id: "cpu",
    nome: "CPU (núcleos de processamento)",
    curto: "CPU",
    categoria: "Processamento",
    cor: "#4d8dff",
    funcao:
      "Executa o sistema operacional e os programas. Usa núcleos de alto desempenho para tarefas pesadas e núcleos de eficiência para as leves, o que economiza bateria.",
    fluxo:
      "Busca instruções e dados na memória unificada. Quando a carga aumenta, mais núcleos de desempenho entram em ação, o chip esquenta mais e as ventoinhas aceleram.",
    specs: [
      ["Núcleos (versão maior)", "10: 8 de desempenho e 2 de eficiência"],
      ["Núcleos (versão menor)", "8: 6 de desempenho e 2 de eficiência"],
      ["Arquitetura", "ARM de 64 bits"],
    ],
  },
  {
    id: "gpu",
    nome: "GPU (gráficos)",
    curto: "GPU",
    categoria: "Processamento",
    cor: "#8a63ff",
    funcao:
      "Processa milhares de operações em paralelo. Desenha a interface, renderiza vídeo e 3D e acelera cálculos que se repetem em muitos dados ao mesmo tempo.",
    fluxo:
      "Lê texturas e modelos da memória unificada, calcula os pixels e entrega os quadros à tela. Como compartilha a memória com a CPU, não precisa de uma memória de vídeo separada.",
    specs: [
      ["Núcleos", "14 ou 16"],
      ["Desempenho (16 núcleos)", "até 5,2 TFLOPS"],
      ["Memória", "compartilhada (unificada)"],
    ],
  },
  {
    id: "neural",
    nome: "Neural Engine",
    curto: "Neural Engine",
    categoria: "Processamento",
    cor: "#c36bff",
    funcao:
      "Acelerador feito para aprendizado de máquina. Executa redes neurais para reconhecer imagens, voz e texto com pouco consumo de energia.",
    fluxo:
      "Recebe tensores da memória unificada, faz as multiplicações de matrizes da rede neural e devolve o resultado. Libera a CPU e a GPU para outras tarefas.",
    specs: [
      ["Núcleos", "16"],
      ["Desempenho", "até 11 trilhões de operações por segundo"],
      ["Usos", "reconhecimento de imagem, voz e texto, efeitos de vídeo"],
    ],
  },
  {
    id: "memoria",
    nome: "Memória unificada",
    curto: "Memória unificada",
    categoria: "Memória",
    cor: "#6f9bff",
    funcao:
      "Memória LPDDR5 única, compartilhada por CPU, GPU e Neural Engine. Fica no mesmo pacote do chip, o que encurta o caminho e aumenta a velocidade.",
    fluxo:
      "Todo processamento passa por ela. Os dados do SSD são carregados aqui e daqui seguem para CPU, GPU ou Neural Engine, sem cópias entre memórias diferentes.",
    specs: [
      ["Tipo", "LPDDR5"],
      ["Capacidade", "16 GB ou 32 GB"],
      ["Largura de banda", "200 GB/s"],
      ["Local", "no mesmo pacote do chip"],
    ],
  },
  {
    id: "ssd",
    nome: "Armazenamento SSD",
    curto: "SSD",
    categoria: "Armazenamento",
    cor: "#3fc1ff",
    funcao:
      "Memória flash NAND soldada à placa. Guarda o sistema, os apps e os arquivos mesmo com o computador desligado.",
    fluxo:
      "O controlador de SSD fica dentro do chip. Arquivos sobem do SSD para a memória unificada antes de serem usados; ao salvar, o caminho inverso grava os dados na flash.",
    specs: [
      ["Capacidade", "512 GB até 8 TB"],
      ["Velocidade de leitura", "até 7,4 GB/s"],
      ["Interface", "NVMe controlada pelo chip"],
    ],
  },
  {
    id: "refrigeracao",
    nome: "Refrigeração (ventoinhas e heat pipes)",
    curto: "Ventoinhas e heat pipes",
    categoria: "Térmica",
    cor: "#ffa56a",
    funcao:
      "Um bloco de cobre sobre o chip recolhe o calor. Tubos de calor (heat pipes) o levam até os dissipadores de aletas, onde duas ventoinhas empurram o ar para fora.",
    fluxo:
      "O líquido dentro dos heat pipes evapora perto do chip, viaja até a parte fria, condensa e volta. As ventoinhas só aceleram quando a temperatura sobe; em tarefas leves ficam paradas.",
    specs: [
      ["Ventoinhas", "2, com pás de perfil curvo"],
      ["Dissipação", "aletas de alumínio e heat pipes de cobre"],
      ["Saída de ar", "fresta junto à dobradiça, atrás da tela"],
    ],
  },
  {
    id: "bateria",
    nome: "Bateria",
    curto: "Bateria",
    categoria: "Energia",
    cor: "#b784ff",
    funcao:
      "Pacote de células de íons de lítio-polímero que ocupa boa parte da base. Alimenta o computador fora da tomada e recebe carga pela MagSafe ou pelas portas USB-C.",
    fluxo:
      "A energia passa pelo controlador de carga e pelos conversores da placa lógica, que a distribuem em várias voltagens para chip, memória, SSD, tela, alto-falantes e ventoinhas.",
    specs: [
      ["Capacidade", "70 Wh"],
      ["Autonomia", "até 17 horas de vídeo"],
      ["Carga", "MagSafe 3 ou USB-C"],
      ["Química", "íons de lítio-polímero"],
    ],
  },
  {
    id: "falantes",
    nome: "Alto-falantes",
    curto: "Alto-falantes",
    categoria: "Áudio",
    cor: "#d08cff",
    funcao:
      "Sistema de seis alto-falantes com woofers que se cancelam em força, para reduzir a vibração do corpo do notebook. O som sai pelas grelhas ao lado do teclado.",
    fluxo:
      "O áudio digital sai do chip, passa por amplificadores na placa lógica e chega aos alto-falantes. Eles consomem energia direto da bateria.",
    specs: [
      ["Quantidade", "6 (4 woofers e 2 tweeters)"],
      ["Tecnologia", "woofers com cancelamento de força"],
      ["Formato", "áudio espacial com Dolby Atmos"],
    ],
  },
  {
    id: "portas",
    nome: "Portas Thunderbolt 4",
    curto: "Portas Thunderbolt",
    categoria: "Conexões",
    cor: "#59c6ff",
    funcao:
      "Três portas USB-C com Thunderbolt 4, nos dois lados. Servem para dados, vídeo, carga e acessórios. A lateral também tem MagSafe 3, HDMI, leitor SDXC e entrada de fones.",
    fluxo:
      "Os controladores Thunderbolt ficam no chip e ligam as portas ao barramento interno. Um cabo pode levar dados, vídeo para monitores externos e energia ao mesmo tempo.",
    specs: [
      ["Thunderbolt 4", "3 portas, até 40 Gb/s cada"],
      ["Demais conexões", "MagSafe 3, HDMI, SDXC e fones"],
      ["Vídeo externo", "até 2 telas 6K a 60 Hz"],
    ],
  },
];

export const ITEM_POR_ID = Object.fromEntries(ITENS.map((i) => [i.id, i])) as Record<ItemId, Item>;

export type Modo = "externa" | "interna" | "fluxo";

export const MODOS: { id: Modo; nome: string; dica: string }[] = [
  { id: "externa", nome: "Visão externa", dica: "Carcaça fechada: o que se vê e se toca." },
  { id: "interna", nome: "Arquitetura interna", dica: "Carcaça transparente: onde cada peça fica." },
  { id: "fluxo", nome: "Fluxo de funcionamento", dica: "Dados, calor e energia em movimento." },
];

export type Tarefa = "ocioso" | "cpu" | "gpu" | "neural" | "tudo";

export const TAREFAS: { id: Tarefa; nome: string; texto: string }[] = [
  { id: "ocioso", nome: "Ocioso", texto: "Navegando e lendo: núcleos de eficiência, ventoinhas paradas." },
  { id: "cpu", nome: "Compilar código", texto: "A CPU usa os núcleos de desempenho e lê arquivos do SSD." },
  { id: "gpu", nome: "Renderizar 3D", texto: "A GPU lê texturas da memória e desenha os quadros." },
  { id: "neural", nome: "Reconhecer imagens", texto: "O Neural Engine executa uma rede neural com pouca energia." },
  { id: "tudo", nome: "Tudo ao mesmo tempo", texto: "CPU, GPU e Neural Engine no limite: calor e consumo no máximo." },
];

export const CAMADAS = [
  { id: "dados", nome: "Dados", cor: "#5aa9ff", texto: "Fluxo entre SSD, memória unificada, CPU, GPU e Neural Engine" },
  { id: "calor", nome: "Calor", cor: "#ff8a4c", texto: "Do chip, pelos heat pipes, até as ventoinhas e a saída de ar" },
  { id: "energia", nome: "Energia", cor: "#b784ff", texto: "Da bateria para cada componente" },
] as const;

export type Camada = (typeof CAMADAS)[number]["id"];

export type Estatisticas = {
  cpu: number;
  gpu: number;
  neural: number;
  memoria: number;
  ssd: number;
  temperatura: number;
  potencia: number;
  rpm: number;
};

// ---------- etiquetas técnicas

export type Etiqueta = { item: ItemId; piece: string; off: [number, number, number]; modos: Modo[] };

const soInterna: Modo[] = ["interna"];
export const ETIQUETAS: Etiqueta[] = [
  { item: "tela", piece: "lid_lcd", off: [0, -0.2, -2.6], modos: ["externa", "interna", "fluxo"] },
  { item: "teclado", piece: "keys", off: [3.2, 0.2, -1.2], modos: ["externa", "interna"] },
  { item: "trackpad", piece: "trackpad", off: [0, 0.1, 0.4], modos: ["externa", "interna"] },
  { item: "carcaca", piece: "deck", off: [-7.2, 0.1, 4.9], modos: ["externa", "interna"] },
  { item: "falantes", piece: "grelhas", off: [-7.3, 0.1, 1.0], modos: ["externa"] },
  { item: "portas", piece: "porta6", off: [0.4, 0.2, 0], modos: ["externa", "interna", "fluxo"] },
  { item: "falantes", piece: "falL", off: [0, 0.35, 0], modos: ["interna", "fluxo"] },
  { item: "placa", piece: "placa", off: [-3.2, 0.1, 1.5], modos: soInterna },
  { item: "chip", piece: "chip", off: [2.4, 0.06, 0.9], modos: soInterna },
  { item: "cpu", piece: "cpu", off: [0, 0.14, 0], modos: ["interna", "fluxo"] },
  { item: "gpu", piece: "gpu", off: [0, 0.14, 0], modos: ["interna", "fluxo"] },
  { item: "neural", piece: "neural", off: [0, 0.14, 0], modos: ["interna", "fluxo"] },
  { item: "memoria", piece: "memR", off: [0, 0.1, 0.5], modos: ["interna", "fluxo"] },
  { item: "ssd", piece: "ssdL", off: [0, 0.07, 0], modos: ["interna", "fluxo"] },
  { item: "refrigeracao", piece: "fanR", off: [0, 0.3, 0], modos: ["interna", "fluxo"] },
  { item: "bateria", piece: "bat", off: [4, 0.18, 0.6], modos: ["interna", "fluxo"] },
];

// ---------- mapa de localização (vista de cima, no repouso): centro x, z e tamanho largura, profundidade

export type Retangulo = [number, number, number, number];
export const MAPA: Record<ItemId, Retangulo[]> = {
  tela: [[0, 0, 15.6, 11]],
  teclado: [[0, -2.3, 13.6, 5.4]],
  trackpad: [[0, 3.3, 6.8, 3.9]],
  carcaca: [[0, 0, 15.6, 11]],
  placa: [[0, -2.6, 7.8, 4.2]],
  chip: [[0, -3.2, 5.6, 2.4]],
  cpu: [[-0.43, -3.575, 0.85, 0.95]],
  gpu: [[0.43, -3.2, 0.85, 1.7]],
  neural: [[-0.43, -2.75, 0.85, 0.4]],
  memoria: [
    [-1.9, -3.2, 1.5, 2],
    [1.9, -3.2, 1.5, 2],
  ],
  ssd: [
    [-1.7, -1.2, 1.8, 0.8],
    [1.7, -1.2, 1.8, 0.8],
  ],
  refrigeracao: [
    [0, -3.2, 2, 2],
    [-5.9, -3.2, 3.1, 3.1],
    [5.9, -3.2, 3.1, 3.1],
    [-5.9, -5.1, 2.8, 0.65],
    [5.9, -5.1, 2.8, 0.65],
  ],
  bateria: [
    [-4, 2.8, 3.5, 4.8],
    [0, 2.8, 3.5, 4.8],
    [4, 2.8, 3.5, 4.8],
  ],
  falantes: [
    [-6.9, -1.9, 1.5, 4.8],
    [6.9, -1.9, 1.5, 4.8],
  ],
  portas: [
    [-7.3, 1.1, 0.8, 0.9],
    [-7.3, 2.3, 0.8, 0.9],
    [-7.3, 3.5, 0.8, 0.9],
    [-7.3, 4.6, 0.8, 0.9],
    [7.3, 1.4, 0.8, 0.9],
    [7.3, 2.9, 0.8, 0.9],
    [7.3, 4.2, 0.8, 0.9],
  ],
};
