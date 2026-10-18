import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { ETIQUETAS, ITEM_POR_ID, type Camada, type Estatisticas, type ItemId, type Modo, type Tarefa } from "./dados";
import { ANGULO_TELA, criarModelo, PROFUNDIDADE, type Piece } from "./modelo";

export type Margens = { left: number; right: number; top: number; bottom: number };

export type CenaDeps = {
  canvas: HTMLCanvasElement;
  host: HTMLElement;
  /** etiquetas na mesma ordem de ETIQUETAS */
  etiquetas: HTMLElement[];
  linhas: { path: SVGPathElement; ponto: SVGCircleElement }[];
  dica: HTMLElement;
  reduzir: boolean;
  margens: () => Margens;
  inicial: { modo: Modo; aberta: boolean; explodida: boolean; camadas: Record<Camada, boolean>; tarefa: Tarefa };
  onSelect: (id: ItemId | null) => void;
  onStats: (s: Estatisticas) => void;
};

export type Cena = {
  setModo: (m: Modo) => void;
  setAberta: (v: boolean) => void;
  setExplodida: (v: boolean) => void;
  setCamada: (c: Camada, v: boolean) => void;
  setTarefa: (t: Tarefa) => void;
  selecionar: (id: ItemId | null, foco?: boolean) => void;
  reiniciarVista: () => void;
  zoom: (fator: number) => void;
  girar: (azimute: number, polar?: number) => void;
  setAutoGiro: (v: boolean) => void;
  atualizarMargens: () => void;
  dispose: () => void;
};

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const ALVO = V(0, 4, -0.5);
const AZIMUTE = Math.PI / 4;
const FOV = 28;

const CARGAS: Record<Tarefa, { cpu: number; gpu: number; neural: number; memoria: number; ssd: number }> = {
  ocioso: { cpu: 0.08, gpu: 0.05, neural: 0, memoria: 0.1, ssd: 0.04 },
  cpu: { cpu: 0.95, gpu: 0.06, neural: 0, memoria: 0.55, ssd: 0.45 },
  gpu: { cpu: 0.3, gpu: 0.95, neural: 0, memoria: 0.85, ssd: 0.15 },
  neural: { cpu: 0.22, gpu: 0.1, neural: 0.95, memoria: 0.6, ssd: 0.1 },
  tudo: { cpu: 0.88, gpu: 0.88, neural: 0.88, memoria: 0.95, ssd: 0.5 },
};

/** Itens que participam do fluxo: o resto fica esmaecido no modo "Fluxo de funcionamento". */
const NO_FLUXO = new Set<ItemId>(["cpu", "gpu", "neural", "memoria", "ssd", "refrigeracao", "bateria", "falantes", "tela", "chip"]);

type Ancora = [string, number, number, number];
type Fluxo = {
  camada: Camada;
  ancoras: Ancora[];
  n: number;
  cor: THREE.Color;
  tam: number;
  vel: number;
  intensidade: () => number;
  pontos: THREE.Vector3[];
  comprimento: number;
  fase: number[];
  inicio: number;
};

const VERT = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  attribute vec3 aColor;
  uniform float uScale;
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    vAlpha = aAlpha;
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uScale / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;
const FRAG = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor * (1.4 + a), a * vAlpha);
  }
`;

const CHAO_VERT = /* glsl */ `
  varying vec2 vP;
  void main() {
    vP = position.xz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const CHAO_FRAG = /* glsl */ `
  varying vec2 vP;
  void main() {
    float r = length(vP);
    vec2 g = abs(fract(vP / 3.0 - 0.5) - 0.5) / fwidth(vP / 3.0);
    float linha = 1.0 - min(min(g.x, g.y), 1.0);
    float fade = smoothstep(70.0, 6.0, r);
    vec3 azul = vec3(0.16, 0.36, 1.0);
    vec3 roxo = vec3(0.55, 0.28, 1.0);
    vec3 cor = mix(azul, roxo, smoothstep(-30.0, 30.0, vP.x + vP.y * 0.5));
    float brilho = smoothstep(16.0, 0.0, r) * 0.22;
    float a = linha * fade * 0.28 + brilho;
    gl_FragColor = vec4(cor * (0.5 + brilho * 3.0), a);
  }
`;

export function criarCena(d: CenaDeps): Cena {
  const { canvas, host } = d;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  const estreito = () => host.clientWidth < 900;
  let teto = estreito() ? 1.25 : 1.5;
  const dpr = () => Math.min(window.devicePixelRatio || 1, teto);
  renderer.setPixelRatio(dpr());
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x07080c, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.5, 600);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const envRT = pmrem.fromScene(room, 0.04);
  scene.environment = envRT.texture;

  scene.add(new THREE.HemisphereLight(0x8fa8ff, 0x1a1030, 0.7));
  const sol = new THREE.DirectionalLight(0xdce8ff, 1.5);
  sol.position.set(12, 26, 14);
  scene.add(sol);
  const luzAzul = new THREE.PointLight(0x3d7bff, 900, 70, 2);
  luzAzul.position.set(-20, 12, 14);
  scene.add(luzAzul);
  const luzRoxa = new THREE.PointLight(0x9b5bff, 900, 70, 2);
  luzRoxa.position.set(20, 9, -14);
  scene.add(luzRoxa);

  const chao = new THREE.Mesh(
    new THREE.PlaneGeometry(160, 160, 1, 1).rotateX(-Math.PI / 2),
    new THREE.ShaderMaterial({ vertexShader: CHAO_VERT, fragmentShader: CHAO_FRAG, transparent: true, depthWrite: false }),
  );
  chao.position.y = -0.3;
  chao.renderOrder = -2;
  scene.add(chao);

  const modelo = criarModelo();
  scene.add(modelo.root);
  modelo.lid.rotation.x = -ANGULO_TELA;

  // ---------- estado
  const est = { o: 0, e: 0 };
  let modo: Modo = d.inicial.modo;
  let sel: ItemId | null = null;
  let hover: ItemId | null = null;
  let tarefa: Tarefa = d.inicial.tarefa;
  const camadas: Record<Camada, { alvo: number; v: number }> = {
    dados: { alvo: d.inicial.camadas.dados ? 1 : 0, v: d.inicial.camadas.dados ? 1 : 0 },
    calor: { alvo: d.inicial.camadas.calor ? 1 : 0, v: d.inicial.camadas.calor ? 1 : 0 },
    energia: { alvo: d.inicial.camadas.energia ? 1 : 0, v: d.inicial.camadas.energia ? 1 : 0 },
  };
  const sim = { cpu: 0.08, gpu: 0.05, neural: 0, memoria: 0.1, ssd: 0.04, temp: 38, watts: 6, rpm: 0, giro: 0 };
  let layoutSujo = true;
  let etiquetasSujas = true;
  let tempoCena = 0;

  const dur = (s: number) => (d.reduzir ? 0.001 : s);
  est.o = d.inicial.aberta ? 1 : 0;
  est.e = d.inicial.explodida ? 1 : 0;

  // ---------- câmera
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.09;
  controls.rotateSpeed = 0.85;
  controls.zoomSpeed = 0.9;
  controls.minDistance = 12;
  controls.maxDistance = 150;
  controls.screenSpacePanning = true;
  controls.autoRotateSpeed = 1.1;
  controls.addEventListener("change", () => {
    etiquetasSujas = true;
  });
  const distanciaPadrao = () => Math.max(66, 58 / Math.max(0.3, camera.aspect));
  const poseNoLugar = (alvo: THREE.Vector3, az: number, pol: number, dist: number) => {
    controls.target.copy(alvo);
    camera.position.set(alvo.x + dist * Math.sin(pol) * Math.sin(az), alvo.y + dist * Math.cos(pol), alvo.z + dist * Math.sin(pol) * Math.cos(az));
    camera.lookAt(alvo);
    controls.update();
  };
  const polarIso = 0.9553; // 54,74 graus: ângulo da vista isométrica

  let largura = 1;
  let altura = 1;
  const aplicarVista = () => {
    const m = d.margens();
    camera.setViewOffset(largura, altura, (m.right - m.left) / 2, (m.bottom - m.top) / 2, largura, altura);
    etiquetasSujas = true;
  };

  // ---------- pós-processamento
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.5, 0.55, 0.7);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  // ---------- partículas
  const A = (p: string, x = 0, y = 0, z = 0): Ancora => [p, x, y, z];
  const azul = new THREE.Color("#5aa9ff");
  const violeta = new THREE.Color("#9b7bff");
  const magenta = new THREE.Color("#d27cff");
  const ciano = new THREE.Color("#4fd8ff");
  const laranja = new THREE.Color("#ff8a4c");
  const ar = new THREE.Color("#bfe6ff");
  const energia = new THREE.Color("#b784ff");
  const D2 = PROFUNDIDADE / 2;
  const fluxos: Fluxo[] = [];
  const fluxo = (camada: Camada, ancoras: Ancora[], n: number, cor: THREE.Color, intensidade: () => number, tam = 0.2, vel = 5) =>
    fluxos.push({ camada, ancoras, n, cor, tam, vel, intensidade, pontos: [], comprimento: 1, fase: Array.from({ length: n }, (_, i) => (i + Math.random() * 0.6) / n), inicio: 0 });

  // dados
  fluxo("dados", [A("memL", 0, 0.1, 0), A("cpu", 0, 0.1, 0)], 10, azul, () => sim.cpu);
  fluxo("dados", [A("cpu", 0.2, 0.1, 0.2), A("memL", 0.2, 0.1, 0.3)], 10, azul, () => sim.cpu * 0.85);
  fluxo("dados", [A("memR", 0, 0.1, 0), A("gpu", 0, 0.1, 0)], 12, violeta, () => sim.gpu);
  fluxo("dados", [A("gpu", 0.2, 0.1, 0.2), A("memR", 0.2, 0.1, 0.3)], 12, violeta, () => sim.gpu * 0.85);
  fluxo("dados", [A("memL", -0.2, 0.1, 0.4), A("neural", 0, 0.1, 0)], 10, magenta, () => sim.neural);
  fluxo("dados", [A("neural", 0.2, 0.1, 0.05), A("memL", 0.1, 0.1, 0.6)], 10, magenta, () => sim.neural * 0.8);
  fluxo("dados", [A("ssdL", 0, 0.08, 0), A("chip", -0.4, 0.4, 0.8), A("memL", 0.2, 0.1, 0.8)], 10, ciano, () => sim.ssd);
  fluxo("dados", [A("memL", -0.1, 0.1, 0.2), A("chip", -0.7, 0.4, 0.7), A("ssdL", 0.3, 0.08, 0)], 8, ciano, () => sim.ssd * 0.7);
  fluxo("dados", [A("ssdR", 0, 0.08, 0), A("chip", 0.4, 0.4, 0.8), A("memR", -0.2, 0.1, 0.8)], 10, ciano, () => sim.ssd);
  fluxo("dados", [A("memR", 0.1, 0.1, 0.2), A("chip", 0.7, 0.4, 0.7), A("ssdR", -0.3, 0.08, 0)], 8, ciano, () => sim.ssd * 0.7);
  fluxo("dados", [A("gpu", 0, 0.1, -0.5), A("lid_lcd", 0, -0.3, 0)], 14, azul, () => 0.25 + sim.gpu * 0.75, 0.22);

  // calor
  const calor = () => clamp((sim.temp - 38) / 50, 0.06, 1);
  fluxo("calor", [A("cpu", 0, 0.1, 0), A("cooler", -0.3, -0.06, -0.3)], 6, laranja, () => sim.cpu * 1.1, 0.24, 3.5);
  fluxo("calor", [A("gpu", 0, 0.1, 0), A("cooler", 0.3, -0.06, 0.1)], 6, laranja, () => sim.gpu * 1.1, 0.24, 3.5);
  fluxo("calor", [A("neural", 0, 0.1, 0), A("cooler", -0.3, -0.06, 0.6)], 5, laranja, () => sim.neural * 1.1, 0.24, 3.5);
  for (const s of [-1, 1])
    for (const k of [-1, 1]) {
      const z0 = k * 0.35;
      fluxo("calor", [A("cooler", s * 0.9, 0, z0), A("cooler", s * 2.6, 0, -0.5 + z0), A("cooler", s * 4.3, 0, -1.2 + z0 * 0.6), A("cooler", s * 5.7, 0, -1.9)], 9, laranja, calor, 0.26, 4);
    }
  for (const s of [-1, 1]) {
    fluxo("calor", [A("cooler", s * 5.5, -0.26, -1.9), A("base", s * 5.9, 0.9, -D2 - 0.4), A("base", s * 5.9, 1.4, -D2 - 2.6), A("base", s * 5.9, 2.6, -D2 - 5)], 9, ar, () => sim.giro * 0.9 + calor() * 0.25, 0.2, 6);
    const lado = s < 0 ? "fanL" : "fanR";
    fluxo("calor", [A(lado, 0.2, -1.6, 0.4), A(lado, 0, -0.2, 0), A(lado, 0, 0.2, -1.2), A("cooler", s * 5.7, -0.26, -1.4)], 8, ar, () => sim.giro, 0.18, 5);
  }

  // energia
  const cargaChip = () => clamp(0.12 + (sim.cpu + sim.gpu + sim.neural) / 2.2, 0, 1);
  const saida = A("bat", 0, 0.18, -2.4);
  const entrada = A("placa", 0, 0.14, 2.0);
  fluxo("energia", [saida, entrada, A("chip", 0, 0.1, 1.1)], 12, energia, cargaChip, 0.22, 5.5);
  fluxo("energia", [saida, entrada, A("memL", 0.2, 0.1, 1.0)], 7, energia, () => 0.1 + sim.memoria * 0.7, 0.2, 5.5);
  fluxo("energia", [saida, entrada, A("memR", -0.2, 0.1, 1.0)], 7, energia, () => 0.1 + sim.memoria * 0.7, 0.2, 5.5);
  fluxo("energia", [A("bat", -4, 0.18, -2.4), A("placa", -2.2, 0.14, 2.0), A("ssdL", 0, 0.08, 0.4)], 6, energia, () => 0.1 + sim.ssd, 0.2, 5.5);
  fluxo("energia", [A("bat", 4, 0.18, -2.4), A("placa", 2.2, 0.14, 2.0), A("ssdR", 0, 0.08, 0.4)], 6, energia, () => 0.1 + sim.ssd, 0.2, 5.5);
  fluxo("energia", [A("bat", -4, 0.18, -2.4), A("falL", 0, 0.3, 2.4)], 6, energia, () => 0.35, 0.2, 4.5);
  fluxo("energia", [A("bat", 4, 0.18, -2.4), A("falR", 0, 0.3, 2.4)], 6, energia, () => 0.35, 0.2, 4.5);
  fluxo("energia", [A("bat", -4, 0.18, -2.4), A("fanL", 0, 0.1, 1.2)], 6, energia, () => 0.1 + sim.giro, 0.2, 4.5);
  fluxo("energia", [A("bat", 4, 0.18, -2.4), A("fanR", 0, 0.1, 1.2)], 6, energia, () => 0.1 + sim.giro, 0.2, 4.5);
  fluxo("energia", [A("bat", 0, 0.18, -2.4), A("base", 0, 1.4, -D2 + 0.2), A("lid_led", 0, 0, -D2 + 0.6), A("lid_led", 0, 0, 0)], 12, energia, () => 0.5 + sim.gpu * 0.4, 0.22, 5);
  fluxo("energia", [A("bat", 0, 0.18, 2.4), A("trackpad", 0, 0.1, 0)], 5, energia, () => 0.25, 0.18, 3.5);

  const total = fluxos.reduce((a, f) => a + f.n, 0);
  let cursor = 0;
  for (const f of fluxos) {
    f.inicio = cursor;
    cursor += f.n;
  }
  const geoP = new THREE.BufferGeometry();
  const posP = new Float32Array(total * 3);
  const corP = new Float32Array(total * 3);
  const tamP = new Float32Array(total);
  const alfaP = new Float32Array(total);
  for (const f of fluxos)
    for (let i = 0; i < f.n; i++) {
      const j = f.inicio + i;
      corP.set([f.cor.r, f.cor.g, f.cor.b], j * 3);
      tamP[j] = f.tam * (0.8 + Math.random() * 0.4);
    }
  geoP.setAttribute("position", new THREE.BufferAttribute(posP, 3));
  geoP.setAttribute("aColor", new THREE.BufferAttribute(corP, 3));
  geoP.setAttribute("aSize", new THREE.BufferAttribute(tamP, 1));
  geoP.setAttribute("aAlpha", new THREE.BufferAttribute(alfaP, 1));
  const matP = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uScale: { value: 800 } },
  });
  const pontos = new THREE.Points(geoP, matP);
  pontos.frustumCulled = false;
  pontos.renderOrder = 10;
  scene.add(pontos);

  const tmp = V(0, 0, 0);
  const mundo = (a: Ancora, out: THREE.Vector3) => {
    const p = modelo.byKey[a[0]];
    return p.group.localToWorld(out.set(a[1], a[2], a[3]));
  };
  const montarCaminho = (f: Fluxo) => {
    const ps = f.ancoras.map((a) => mundo(a, V(0, 0, 0)));
    let curva: THREE.CatmullRomCurve3;
    if (ps.length === 2) {
      const meio = ps[0].clone().lerp(ps[1], 0.5);
      meio.y += Math.min(3, ps[0].distanceTo(ps[1]) * 0.28) + 0.6;
      curva = new THREE.CatmullRomCurve3([ps[0], meio, ps[1]]);
    } else curva = new THREE.CatmullRomCurve3(ps);
    f.pontos = curva.getPoints(36);
    f.comprimento = Math.max(0.5, curva.getLength());
  };

  // ---------- seleção, destaque e marcador
  const guia = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d") as CanvasRenderingContext2D;
    g.strokeStyle = "#fff";
    g.lineWidth = 7;
    g.beginPath();
    g.arc(64, 64, 46, 0, Math.PI * 2);
    g.stroke();
    g.fillStyle = "#fff";
    g.beginPath();
    g.arc(64, 64, 9, 0, Math.PI * 2);
    g.fill();
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();
  const marcador = new THREE.Sprite(new THREE.SpriteMaterial({ map: guia, transparent: true, depthTest: false, depthWrite: false, opacity: 0 }));
  marcador.renderOrder = 20;
  scene.add(marcador);
  let marcadorAlvo = 0;

  const estPeca = new Map<string, { vis: number; dim: number; hl: number }>();
  for (const p of modelo.pieces) estPeca.set(p.key, { vis: 1, dim: 1, hl: 0 });
  const fantasmaE: Record<string, number> = { lid_back: 0.3, lid_led: 0.6 };

  const centroItem = (id: ItemId) => {
    const ps = modelo.byItem[id];
    const c = V(0, 0, 0);
    const w = V(0, 0, 0);
    for (const p of ps) c.add(p.group.getWorldPosition(w));
    c.divideScalar(ps.length);
    let r = 0;
    for (const p of ps) r = Math.max(r, c.distanceTo(p.group.getWorldPosition(w)));
    return { c, r };
  };

  const aplicar = (p: Piece, dt: number) => {
    const s = estPeca.get(p.key) as { vis: number; dim: number; hl: number };
    const abertura = Math.max(est.o, est.e);
    let vis = 1;
    if (p.shell) vis = lerp(1, 0.12, abertura);
    else if (p.key === "base") vis = lerp(1, 0.55, abertura);
    else if (p.item === "tela") vis = lerp(1, fantasmaE[p.key] ?? 0.9, est.e);
    const alvoHl = p.item === sel ? 1 : p.item === hover ? 0.5 : 0;
    if (alvoHl > 0.4) vis = Math.max(vis, p.shell ? 0.5 : vis);
    let dim = 1;
    if (sel && p.item !== sel) dim = 0.22;
    else if (!sel && modo === "fluxo" && !NO_FLUXO.has(p.item)) dim = 0.3;
    const k = Math.min(1, dt * 9);
    s.vis += (vis - s.vis) * k;
    s.dim += (dim - s.dim) * k;
    s.hl += (alvoHl - s.hl) * k;
    const carga = p.key === "cpu" ? sim.cpu : p.key === "gpu" ? sim.gpu : p.key === "neural" ? sim.neural : 0;
    for (const m of p.mats) {
      if (m.kind === "line") {
        const l = m.mat as THREE.LineBasicMaterial;
        l.opacity = clamp(m.op * lerp(1, 0.4, 1 - s.dim) * (1 + s.hl * 0.9) * (p.shell ? 1 : lerp(0.35, 1, s.vis)), 0, 1);
        l.color.copy(m.color).lerp(WHITE, s.hl * 0.65);
      } else if (m.kind === "std") {
        const sm = m.mat as THREE.MeshStandardMaterial;
        sm.opacity = m.op * s.vis * s.dim;
        sm.depthWrite = sm.opacity > 0.9;
        sm.emissiveIntensity = m.em + s.hl * 0.6 + carga * 0.9;
      } else {
        const bm = m.mat as THREE.MeshBasicMaterial;
        bm.opacity = s.vis * s.dim;
        bm.depthWrite = bm.opacity > 0.9;
      }
    }
  };
  const WHITE = new THREE.Color(1, 1, 1);

  // ---------- picking
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const pick = (cx: number, cy: number): ItemId | null => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((cx - r.left) / r.width) * 2 - 1, -(((cy - r.top) / r.height) * 2 - 1));
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(modelo.root.children, true);
    let primeiro: ItemId | null = null;
    for (const h of hits) {
      const item = h.object.userData.item as ItemId | undefined;
      const key = h.object.userData.piece as string | undefined;
      if (!item || !key) continue;
      if (!primeiro) primeiro = item;
      const s = estPeca.get(key);
      if (s && s.vis * s.dim > 0.4) return item;
    }
    return primeiro;
  };

  let down: { x: number; y: number; t: number } | null = null;
  let movePend: { x: number; y: number } | null = null;
  const onDown = (e: PointerEvent) => {
    down = { x: e.clientX, y: e.clientY, t: performance.now() };
  };
  const onUp = (e: PointerEvent) => {
    if (!down) return;
    const dx = e.clientX - down.x;
    const dy = e.clientY - down.y;
    const rapido = performance.now() - down.t < 600;
    down = null;
    if (dx * dx + dy * dy > 36 || !rapido) return;
    selecionar(pick(e.clientX, e.clientY), true);
  };
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || e.buttons) {
      d.dica.classList.remove("on");
      return;
    }
    movePend = { x: e.clientX, y: e.clientY };
  };
  const onLeave = () => {
    movePend = null;
    hover = null;
    d.dica.classList.remove("on");
    canvas.style.cursor = "grab";
  };
  const processarMove = () => {
    if (!movePend) return;
    const { x, y } = movePend;
    movePend = null;
    hover = pick(x, y);
    canvas.style.cursor = hover ? "pointer" : "grab";
    if (hover) {
      const r = host.getBoundingClientRect();
      d.dica.textContent = ITEM_POR_ID[hover].nome;
      d.dica.style.transform = `translate(${Math.round(x - r.left + 14)}px, ${Math.round(y - r.top + 16)}px)`;
      d.dica.classList.add("on");
    } else d.dica.classList.remove("on");
  };
  const onCtx = (e: Event) => e.preventDefault();
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerleave", onLeave);
  canvas.addEventListener("contextmenu", onCtx);
  canvas.style.cursor = "grab";

  // ---------- teclado no canvas
  const girar = (az: number, pol = 0) => {
    const off = camera.position.clone().sub(controls.target);
    const sph = new THREE.Spherical().setFromVector3(off);
    sph.theta += az;
    sph.phi = clamp(sph.phi + pol, 0.05, Math.PI - 0.05);
    off.setFromSpherical(sph);
    camera.position.copy(controls.target).add(off);
    camera.lookAt(controls.target);
    controls.update();
    etiquetasSujas = true;
  };
  const zoom = (f: number) => {
    const off = camera.position.clone().sub(controls.target);
    const dist = clamp(off.length() * f, controls.minDistance, controls.maxDistance);
    off.setLength(dist);
    camera.position.copy(controls.target).add(off);
    controls.update();
    etiquetasSujas = true;
  };
  const onKey = (e: KeyboardEvent) => {
    const passo = 0.14;
    const mapa: Record<string, () => void> = {
      ArrowLeft: () => girar(-passo),
      ArrowRight: () => girar(passo),
      ArrowUp: () => girar(0, -passo),
      ArrowDown: () => girar(0, passo),
      "+": () => zoom(0.88),
      "=": () => zoom(0.88),
      "-": () => zoom(1.14),
      Escape: () => selecionar(null),
    };
    const fn = mapa[e.key];
    if (fn) {
      e.preventDefault();
      fn();
    }
  };
  canvas.addEventListener("keydown", onKey);

  // ---------- foco da câmera
  const focoTween = { t: 0 };
  const focar = (alvo: THREE.Vector3, dist: number) => {
    const ini = controls.target.clone();
    const dir = camera.position.clone().sub(controls.target).normalize();
    const d0 = camera.position.distanceTo(controls.target);
    gsap.killTweensOf(focoTween);
    focoTween.t = 0;
    gsap.to(focoTween, {
      t: 1,
      duration: dur(0.9),
      ease: "power2.inOut",
      onUpdate: () => {
        const k = focoTween.t;
        controls.target.lerpVectors(ini, alvo, k);
        camera.position.copy(controls.target).addScaledVector(dir, lerp(d0, dist, k));
        camera.lookAt(controls.target);
        controls.update();
        etiquetasSujas = true;
      },
    });
  };

  const selecionar = (id: ItemId | null, foco = false) => {
    sel = id;
    d.onSelect(id);
    etiquetasSujas = true;
    if (id) {
      marcadorAlvo = 1;
      if (foco) {
        const { c, r } = centroItem(id);
        focar(c, Math.min(140, Math.max(clamp(r * 2.4 + 32, 36, 72), (r * 2 + 10) / (0.5 * camera.aspect))));
      }
    } else marcadorAlvo = 0;
  };

  const reiniciarVista = () => {
    gsap.killTweensOf(focoTween);
    const ini = controls.target.clone();
    const off0 = camera.position.clone().sub(ini);
    const s0 = new THREE.Spherical().setFromVector3(off0);
    const alvoDist = distanciaPadrao();
    // escolhe o giro mais curto até o azimute padrão
    let dTheta = AZIMUTE - s0.theta;
    dTheta = Math.atan2(Math.sin(dTheta), Math.cos(dTheta));
    focoTween.t = 0;
    gsap.to(focoTween, {
      t: 1,
      duration: dur(1.0),
      ease: "power2.inOut",
      onUpdate: () => {
        const k = focoTween.t;
        controls.target.lerpVectors(ini, ALVO, k);
        const off = new THREE.Vector3().setFromSphericalCoords(lerp(s0.radius, alvoDist, k), lerp(s0.phi, polarIso, k), s0.theta + dTheta * k);
        camera.position.copy(controls.target).add(off);
        camera.lookAt(controls.target);
        controls.update();
        etiquetasSujas = true;
      },
    });
  };

  // ---------- etiquetas HTML com linhas de conexão
  const etqIdx = ETIQUETAS.map((e) => ({ e, p: modelo.byKey[e.piece] }));
  const larguras = new Map<HTMLElement, number>();
  const wv = V(0, 0, 0);
  const posicionarEtiquetas = () => {
    const m = d.margens();
    const W = host.clientWidth;
    const H = host.clientHeight;
    const compacto = W < 900;
    type Item = { i: number; ax: number; ay: number; lado: -1 | 1; y: number; w: number };
    const vis: Item[] = [];
    etqIdx.forEach(({ e, p }, i) => {
      const el = d.etiquetas[i];
      const ln = d.linhas[i];
      const ligada = compacto ? e.item === sel : e.modos.includes(modo);
      const mostrar = ligada && (!sel || e.item === sel || !compacto);
      if (!mostrar) {
        if (el.dataset.on !== "0") {
          el.dataset.on = "0";
          ln.path.style.opacity = "0";
          ln.ponto.style.opacity = "0";
        }
        return;
      }
      const pos = p.group.localToWorld(wv.set(e.off[0], e.off[1], e.off[2])).project(camera);
      const ax = (pos.x * 0.5 + 0.5) * W;
      const ay = (-pos.y * 0.5 + 0.5) * H;
      let w = larguras.get(el) ?? 0;
      if (!w) {
        w = el.offsetWidth || 120;
        larguras.set(el, w);
      }
      vis.push({ i, ax, ay, lado: ax < (m.left + (W - m.right)) / 2 ? -1 : 1, y: ay, w });
    });
    const topo = m.top + 8;
    const base = H - m.bottom - 34;
    for (const lado of [-1, 1] as const) {
      const col = vis.filter((v) => v.lado === lado).sort((a, b) => a.ay - b.ay);
      const gap = 32;
      col.forEach((v, k) => {
        v.y = clamp(v.ay - 14, topo, base);
        if (k > 0) v.y = Math.max(v.y, col[k - 1].y + gap);
      });
      for (let k = col.length - 1; k >= 0; k--) {
        if (col[k].y > base - (col.length - 1 - k) * gap) col[k].y = base - (col.length - 1 - k) * gap;
      }
      for (const v of col) {
        const el = d.etiquetas[v.i];
        const ln = d.linhas[v.i];
        const x = lado < 0 ? m.left + 12 : W - m.right - 12 - v.w;
        el.dataset.on = "1";
        el.style.transform = `translate(${Math.round(x)}px, ${Math.round(v.y)}px)`;
        const ex = lado < 0 ? x + v.w : x;
        const ey = v.y + 14;
        const cot = ex + lado * 22;
        ln.path.setAttribute("d", `M${v.ax.toFixed(1)} ${v.ay.toFixed(1)}L${cot.toFixed(1)} ${ey.toFixed(1)}L${ex.toFixed(1)} ${ey.toFixed(1)}`);
        ln.ponto.setAttribute("cx", v.ax.toFixed(1));
        ln.ponto.setAttribute("cy", v.ay.toFixed(1));
        ln.path.style.opacity = "1";
        ln.ponto.style.opacity = "1";
      }
    }
  };

  // ---------- laço de animação
  const relogio = new THREE.Clock();
  let raf = 0;
  let visivel = true;
  let descartada = false;
  let tStats = 0;
  let quadros = 0;
  let amostras = 0;
  let nivel = 0;
  let descartar = 12; // os primeiros quadros incluem a compilação dos shaders

  const atualizarLayout = () => {
    for (const p of modelo.pieces) {
      p.group.position.copy(p.base);
      if (p.shell || p.open.lengthSq() > 0) {
        tmp.copy(p.open).multiplyScalar(est.o * (1 - est.e));
        p.group.position.add(tmp);
      }
      p.group.position.addScaledVector(p.explode, est.e);
    }
    modelo.lid.position.copy(modelo.lidBase).addScaledVector(modelo.lidExplode, est.e);
    modelo.root.updateMatrixWorld(true);
    for (const f of fluxos) montarCaminho(f);
    layoutSujo = false;
    etiquetasSujas = true;
  };

  const atualizarSimulacao = (dt: number) => {
    const alvo = CARGAS[tarefa];
    const k = 1 - Math.exp(-dt * 2.4);
    const ruido = (f: number) => Math.sin(tempoCena * f) * 0.04;
    sim.cpu += (clamp(alvo.cpu + (alvo.cpu > 0.2 ? ruido(5.3) : 0), 0, 1) - sim.cpu) * k;
    sim.gpu += (clamp(alvo.gpu + (alvo.gpu > 0.2 ? ruido(4.1) : 0), 0, 1) - sim.gpu) * k;
    sim.neural += (clamp(alvo.neural + (alvo.neural > 0.2 ? ruido(6.7) : 0), 0, 1) - sim.neural) * k;
    sim.memoria += (alvo.memoria - sim.memoria) * k;
    sim.ssd += (alvo.ssd - sim.ssd) * k;
    const alvoTemp = 36 + 54 * clamp(0.42 * sim.cpu + 0.4 * sim.gpu + 0.18 * sim.neural, 0, 1);
    sim.temp += (alvoTemp - sim.temp) * (1 - Math.exp(-dt * 0.55));
    sim.watts = 4 + 15 * sim.cpu + 19 * sim.gpu + 3 * sim.neural + 3 * sim.memoria + 3;
    const alvoRpm = sim.temp < 52 ? 0 : 1200 + 4800 * clamp((sim.temp - 52) / 34, 0, 1);
    sim.rpm += (alvoRpm - sim.rpm) * (1 - Math.exp(-dt * 1.6));
    sim.giro = sim.rpm / 6000;
    for (const r of modelo.rotors) r.rotation.y -= dt * sim.giro * 26;
    // núcleos acendem conforme a carga
    for (const key of ["cpu", "gpu", "neural"] as const) {
      const c = modelo.cells[key];
      const carga = sim[key];
      const arr = c.mesh;
      const cor = new THREE.Color();
      for (let i = 0; i < c.n; i++) {
        const ativo = (i + 0.5) / c.n <= Math.max(key === "cpu" && i >= c.n - 2 ? 0.9 : 0.12, carga + 0.08);
        const pisca = 0.7 + 0.3 * Math.sin(tempoCena * (3 + i * 1.3) + i * 2.1);
        const b = ativo ? 0.3 + 1.9 * carga * pisca : 0.07;
        cor.copy(c.color).multiplyScalar(b);
        arr.setColorAt(i, cor);
      }
      if (arr.instanceColor) arr.instanceColor.needsUpdate = true;
    }
  };

  const atualizarParticulas = (dt: number) => {
    for (const f of fluxos) {
      const c = camadas[f.camada];
      const nivel = clamp(f.intensidade(), 0, 1) * c.v;
      const v = ((f.vel * (0.45 + 0.9 * nivel)) / f.comprimento) * dt;
      const m = f.pontos.length - 1;
      for (let i = 0; i < f.n; i++) {
        const j = f.inicio + i;
        let u = f.fase[i] + v;
        if (u >= 1) u -= Math.floor(u);
        f.fase[i] = u;
        const quantos = nivel * f.n;
        const a = clamp(quantos - i, 0, 1) * Math.sin(Math.PI * u) ** 0.6;
        alfaP[j] = a;
        if (a <= 0.001) continue;
        const x = u * m;
        const i0 = Math.min(m - 1, Math.floor(x));
        const t = x - i0;
        const p0 = f.pontos[i0];
        const p1 = f.pontos[i0 + 1];
        posP[j * 3] = p0.x + (p1.x - p0.x) * t;
        posP[j * 3 + 1] = p0.y + (p1.y - p0.y) * t;
        posP[j * 3 + 2] = p0.z + (p1.z - p0.z) * t;
      }
    }
    geoP.attributes.position.needsUpdate = true;
    geoP.attributes.aAlpha.needsUpdate = true;
  };

  const tick = () => {
    raf = requestAnimationFrame(tick);
    const bruto = relogio.getDelta();
    const dt = Math.min(0.05, bruto);
    tempoCena += dt;
    // aparelho lento: reduz a resolução e depois o brilho (bloom), sem voltar atrás
    if (descartar > 0) descartar--;
    else amostras += bruto;
    if (descartar <= 0 && ++quadros >= 40) {
      const media = amostras / quadros;
      quadros = 0;
      amostras = 0;
      if (media > 0.045 && nivel < 3) {
        nivel++;
        if (nivel === 1) teto = Math.min(teto, 1);
        else if (nivel === 2) bloom.enabled = false;
        else teto = 0.75;
        redimensionar();
      }
    }
    controls.update();
    processarMove();
    for (const c of Object.values(camadas)) c.v += (c.alvo - c.v) * Math.min(1, dt * 5);
    if (layoutSujo) atualizarLayout();
    atualizarSimulacao(dt);
    for (const p of modelo.pieces) aplicar(p, dt);
    atualizarParticulas(dt);

    // marcador de localização
    const mat = marcador.material;
    mat.opacity += (marcadorAlvo * 0.95 - mat.opacity) * Math.min(1, dt * 8);
    if (sel) {
      const { c, r } = centroItem(sel);
      marcador.position.copy(c);
      const pulso = 1 + 0.14 * Math.sin(tempoCena * 4);
      marcador.scale.setScalar(clamp(r * 1.2 + 2, 2.4, 9) * pulso);
      mat.color.set(ITEM_POR_ID[sel].cor);
    }
    if (etiquetasSujas) {
      etiquetasSujas = false;
      posicionarEtiquetas();
    }
    tStats += dt;
    if (tStats > 0.15) {
      tStats = 0;
      d.onStats({ cpu: sim.cpu, gpu: sim.gpu, neural: sim.neural, memoria: sim.memoria, ssd: sim.ssd, temperatura: sim.temp, potencia: sim.watts, rpm: sim.rpm });
    }
    composer.render();
  };

  const sync = () => {
    const rodar = visivel && !document.hidden && !descartada;
    if (rodar && !raf) {
      relogio.getDelta();
      raf = requestAnimationFrame(tick);
    } else if (!rodar && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  // ---------- tamanho
  let primeiraVez = true;
  const redimensionar = () => {
    const w = Math.max(1, host.clientWidth);
    const h = Math.max(1, host.clientHeight);
    largura = w;
    altura = h;
    renderer.setPixelRatio(dpr());
    renderer.setSize(w, h, false);
    composer.setPixelRatio(dpr());
    composer.setSize(w, h);
    camera.aspect = w / h;
    aplicarVista();
    camera.updateProjectionMatrix();
    matP.uniforms.uScale.value = (h * dpr()) / (2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)));
    larguras.clear();
    if (primeiraVez) {
      primeiraVez = false;
      poseNoLugar(ALVO, AZIMUTE, polarIso, distanciaPadrao());
    }
    etiquetasSujas = true;
  };
  const ro = new ResizeObserver(redimensionar);
  ro.observe(host);
  const io = new IntersectionObserver(
    ([en]) => {
      visivel = en.isIntersecting;
      sync();
    },
    { rootMargin: "80px" },
  );
  io.observe(host);
  const onVis = () => sync();
  document.addEventListener("visibilitychange", onVis);

  redimensionar();
  atualizarLayout();
  sync();

  // ---------- API
  const tween = (chave: "o" | "e", valor: number) => {
    gsap.killTweensOf(est, chave);
    gsap.to(est, {
      [chave]: valor,
      duration: dur(1.1),
      ease: "power3.inOut",
      onUpdate: () => {
        layoutSujo = true;
      },
    });
  };

  return {
    setModo(m) {
      modo = m;
      etiquetasSujas = true;
    },
    setAberta: (v) => tween("o", v ? 1 : 0),
    setExplodida: (v) => tween("e", v ? 1 : 0),
    setCamada(c, v) {
      camadas[c].alvo = v ? 1 : 0;
    },
    setTarefa(t) {
      tarefa = t;
    },
    selecionar,
    reiniciarVista,
    zoom,
    girar,
    setAutoGiro(v) {
      controls.autoRotate = v && !d.reduzir;
    },
    atualizarMargens() {
      aplicarVista();
      camera.updateProjectionMatrix();
    },
    dispose() {
      descartada = true;
      sync();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("contextmenu", onCtx);
      canvas.removeEventListener("keydown", onKey);
      gsap.killTweensOf(est);
      gsap.killTweensOf(focoTween);
      controls.dispose();
      modelo.dispose();
      geoP.dispose();
      matP.dispose();
      guia.dispose();
      marcador.material.dispose();
      chao.geometry.dispose();
      (chao.material as THREE.Material).dispose();
      envRT.dispose();
      room.dispose();
      pmrem.dispose();
      composer.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
