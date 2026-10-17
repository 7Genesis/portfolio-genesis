import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { MODELS, NC, SLIDES, IMG, DWELL } from "./content";
import { createScreens, type Fonts, type Images } from "./screens";

export type SlideInfo = { i: number; n: number; label: string };

export type SceneDeps = {
  canvas: HTMLCanvasElement;
  /** recebe a variável CSS --acc */
  stage: HTMLElement;
  /** contêiner alto: o progresso da rolagem é medido nele */
  container: HTMLElement;
  copy: HTMLElement;
  cap: HTMLElement;
  code: HTMLElement;
  blur: HTMLElement;
  marker: HTMLElement;
  ticks: HTMLElement;
  labels: HTMLElement[];
  fonts: Fonts;
  onLoad: (fraction: number) => void;
  onReady: () => void;
  onChapter: (c: number) => void;
  onSlide: (s: SlideInfo | null) => void;
};

export type SceneHandle = { dispose: () => void; goTo: (chapter: number) => void; seek: (fraction: number) => void };

type Key = {
  open: number; ex: number;
  lx: number; ly: number; lz: number; lry: number; lrx: number; ls: number;
  px: number; py: number; pz: number; pry: number; ps: number;
  cx: number; cy: number; cz: number; tx: number; ty: number; tz: number;
  wl: number; wp: number;
};

// quadros-chave por capítulo: open (tampa), ex (explosão), laptop (x,y,z,ry,rx,s), celular (x,y,z,ry,s),
// câmera (c*) e alvo (t*); wl/wp = foco de frente na tela do notebook/celular
const K: Key[] = [
  { open: 1, ex: 0, lx: 0.9, ly: -0.2, lz: 0, lry: -0.5, lrx: 0, ls: 1, px: 7, py: -4, pz: 0, pry: 0, ps: 0.9, cx: 0, cy: 1.4, cz: 12, tx: 0.5, ty: 0.3, tz: 0, wl: 0, wp: 0 },
  { open: 1, ex: 1, lx: 0.9, ly: 0, lz: 0, lry: -0.7, lrx: 0.06, ls: 1, px: 7, py: -4, pz: 0, pry: 0, ps: 0.9, cx: 0, cy: 3.3, cz: 15.5, tx: 0.6, ty: 0.55, tz: 0, wl: 0, wp: 0 },
  { open: 1, ex: 1, lx: 0.9, ly: 0, lz: 0, lry: -0.35, lrx: 0.04, ls: 1.15, px: 7, py: -4, pz: 0, pry: 0, ps: 0.9, cx: 2.4, cy: 2.7, cz: 15.6, tx: 0.55, ty: 0.95, tz: -0.3, wl: 0, wp: 0 },
  { open: 1, ex: 0, lx: 15, ly: -0.4, lz: -0.7, lry: 0.4, lrx: 0, ls: 0.82, px: 2.9, py: 0.35, pz: 0.8, pry: -0.3, ps: 1.25, cx: 0, cy: 1.4, cz: 10.5, tx: 0.2, ty: 0.2, tz: 0, wl: 0, wp: 1 },
  { open: 1, ex: 0, lx: 0.4, ly: -0.1, lz: 0.4, lry: -0.08, lrx: 0, ls: 1.2, px: 7, py: -4, pz: 0, pry: 0, ps: 0.9, cx: 0, cy: 1.2, cz: 9.8, tx: 0.4, ty: 0.4, tz: 0, wl: 1, wp: 0 },
  { open: 1, ex: 1, lx: 0.9, ly: 0, lz: 0, lry: 0.45, lrx: 0.04, ls: 1.15, px: 7, py: -4, pz: 0, pry: 0, ps: 0.9, cx: -1.8, cy: 2.5, cz: 15.4, tx: 0.7, ty: 0.9, tz: 0.5, wl: 1, wp: 0 },
  { open: 0.7, ex: 0, lx: 0.9, ly: -0.2, lz: 0, lry: -0.25, lrx: 0, ls: 1, px: 3.4, py: -0.15, pz: 0.9, pry: -0.3, ps: 0.95, cx: 0, cy: 1.4, cz: 12, tx: 0.4, ty: 0.3, tz: 0, wl: 0.6, wp: 0 },
  { open: 1, ex: 0, lx: -0.1, ly: -0.2, lz: 0.3, lry: 0, lrx: 0, ls: 1, px: 2.7, py: -0.2, pz: 0.9, pry: -0.25, ps: 0.95, cx: 0, cy: 1.4, cz: 10.5, tx: 0.3, ty: 0.3, tz: 0, wl: 0, wp: 0 },
];
const KEYS = Object.keys(K[0]) as (keyof Key)[];

// entre capítulos há 1 unidade de transição; DWELL é o tempo de "parada" de cada capítulo
const DW = DWELL;
type Seg = { t: "h" | "t"; i: number; a: number; b: number };
const segs: Seg[] = [];
let accU = 0;
for (let q = 0; q < NC; q++) {
  segs.push({ t: "h", i: q, a: accU, b: accU + DW[q] });
  accU += DW[q];
  if (q < NC - 1) {
    segs.push({ t: "t", i: q, a: accU, b: accU + 1 });
    accU += 1;
  }
}
const UT = accU;
const holdStart = segs.filter((s) => s.t === "h").map((s) => s.a);

function mapU(p: number) {
  const u = p * UT;
  for (const s of segs) {
    if (u <= s.b) {
      const L = s.b - s.a;
      return s.t === "h"
        ? { k: s.i, hold: s.i, sp: L > 0 ? (u - s.a) / L : 0 }
        : { k: s.i + (L > 0 ? (u - s.a) / L : 0), hold: -1, sp: 0 };
    }
  }
  return { k: NC - 1, hold: NC - 1, sp: 1 };
}

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const damp = (a: number, b: number, l: number, dt: number) => a + (b - a) * (1 - Math.exp(-l * dt));
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const IMAGE_KEYS = [
  "jornada_inicio", "jornada_servicos", "jornada_atendimento", "jornada_faturas",
  "lp_starfit", "lp_conectalab", "lp_docctor1", "lp_docctor2",
  "stockflow_site", "stockflow_actions", "creditflow_actions", "leadflow_actions",
];

function loadImages(): Promise<Images> {
  const IM: Images = {};
  return Promise.all(
    IMAGE_KEYS.map(
      (k) =>
        new Promise<void>((resolve) => {
          const i = new Image();
          i.onload = () => {
            IM[k] = i;
            resolve();
          };
          i.onerror = () => resolve();
          i.src = `${IMG}/${k}.jpg`;
        }),
    ),
  ).then(() => IM);
}

async function waitFonts(F: Fonts) {
  try {
    await Promise.all([
      document.fonts.load(`700 40px ${F.sans}`),
      document.fonts.load(`500 26px ${F.sans}`),
      document.fonts.load(`600 28px ${F.sans}`),
      document.fonts.load(`500 22px ${F.mono}`),
    ]);
  } catch {
    /* sem fontes personalizadas o canvas usa a fonte padrão */
  }
}

export async function createScene(d: SceneDeps): Promise<SceneHandle> {
  const { canvas, stage, container, fonts } = d;
  let disposed = false;
  const W = () => stage.clientWidth || window.innerWidth;
  const H = () => stage.clientHeight || window.innerHeight;
  const narrowNow = () => W() < 860;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, narrowNow() ? 1.25 : 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1d1d1b);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const roomEnv = new RoomEnvironment();
  scene.environment = pmrem.fromScene(roomEnv, 0.04).texture;
  const camera = new THREE.PerspectiveCamera(30, W() / H(), 0.1, 100);

  const peach = new THREE.DirectionalLight(0xffcab0, 2.3);
  peach.position.set(-5, 6, 4);
  peach.castShadow = true;
  peach.shadow.mapSize.set(1024, 1024);
  Object.assign(peach.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 30 });
  peach.shadow.radius = 5;
  peach.shadow.bias = -0.0004;
  peach.shadow.normalBias = 0.02;
  scene.add(peach);
  const cool = new THREE.DirectionalLight(0xbfd8ff, 1.1);
  cool.position.set(5, 2, 4);
  scene.add(cool);
  scene.add(new THREE.AmbientLight(0xffffff, 0.25));

  const alu = new THREE.MeshStandardMaterial({ color: 0xb9bcbd, metalness: 1, roughness: 0.32, envMapIntensity: 0.9 });
  const SH = <T extends THREE.Mesh>(m: T): T => {
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  };

  // ---- recursos externos (modelos, capturas de tela e fontes)
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  const prog = [0, 0];
  const tot = [1, 1];
  const onP = (i: number) => (e: ProgressEvent) => {
    prog[i] = e.loaded;
    if (e.total) tot[i] = e.total;
    d.onLoad(Math.min(0.97, (prog[0] + prog[1]) / (tot[0] + tot[1])));
  };
  let mbGltf: Awaited<ReturnType<GLTFLoader["loadAsync"]>>;
  let ipGltf: Awaited<ReturnType<GLTFLoader["loadAsync"]>>;
  let IM: Images;
  try {
    [mbGltf, ipGltf, IM] = await Promise.all([
      loader.loadAsync(MODELS.macbook, onP(0)),
      loader.loadAsync(MODELS.iphone, onP(1)),
      loadImages(),
      waitFonts(fonts),
    ]).then(([a, b, c]) => [a, b, c] as const);
  } catch (err) {
    pmrem.dispose();
    roomEnv.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    throw err;
  }

  const { LS, PS, drawLaptop, drawPhone } = createScreens(IM, fonts);
  const screenMat = (tex: THREE.Texture) =>
    new THREE.MeshBasicMaterial({ map: tex, color: new THREE.Color(1.75, 1.75, 1.75), toneMapped: false });

  // ---- MacBook Pro M3 16": separa carcaça superior, tampa inferior e tampa (tela)
  const lap = new THREE.Group();
  scene.add(lap);
  const topCase = new THREE.Group();
  const bottomCase = new THREE.Group();
  const hinge = new THREE.Group();
  lap.add(topCase, bottomCase, hinge);
  const mbModel = mbGltf.scene;
  const SC = 3.6 / 35.485;
  const wrap = new THREE.Group();
  wrap.add(mbModel);
  wrap.scale.setScalar(SC);
  wrap.position.y = 0.0275;
  lap.add(wrap);
  lap.updateMatrixWorld(true);
  const baseMeshes: THREE.Mesh[] = [];
  const lidMeshes: THREE.Mesh[] = [];
  mbModel.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    m.castShadow = true;
    m.receiveShadow = true;
    let q: THREE.Object3D | null = m.parent;
    let isLid = false;
    while (q) {
      if (q.name.startsWith("VCQqx")) {
        isLid = true;
        break;
      }
      q = q.parent;
    }
    (isLid ? lidMeshes : baseMeshes).push(m);
  });
  const tb = new THREE.Box3();
  baseMeshes.forEach((m) => {
    tb.setFromObject(m);
    const cy = (tb.min.y + tb.max.y) / 2;
    (cy < -0.035 ? bottomCase : topCase).attach(m);
  });
  hinge.position.set(0, 0.0072, -1.227);
  lidMeshes.forEach((m) => hinge.attach(m));
  const lidScreen = lidMeshes.find((m) => m.name === "Object_123");
  if (lidScreen) lidScreen.material = screenMat(LS.t);
  mbModel.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh && m.material && !Array.isArray(m.material)) (m.material as THREE.MeshStandardMaterial).envMapIntensity = 1.15;
  });

  // camada do meio: placa-mãe, bateria, ventoinhas, heat pipe
  const mid = new THREE.Group();
  mid.position.y = -0.03;
  lap.add(mid);
  const pc = document.createElement("canvas");
  pc.width = 1024;
  pc.height = 420;
  const px = pc.getContext("2d") as CanvasRenderingContext2D;
  px.fillStyle = "#0d5a3b";
  px.fillRect(0, 0, 1024, 420);
  px.strokeStyle = "rgba(120,230,170,.35)";
  px.lineWidth = 2;
  for (let i = 0; i < 70; i++) {
    px.beginPath();
    let x = Math.random() * 1024;
    let y = Math.random() * 420;
    px.moveTo(x, y);
    for (let k = 0; k < 5; k++) {
      x += (Math.random() - 0.5) * 140;
      y += (Math.random() - 0.5) * 60;
      px.lineTo(x, y);
    }
    px.stroke();
  }
  px.fillStyle = "#d9b45a";
  for (let i = 0; i < 260; i++) {
    px.beginPath();
    px.arc(Math.random() * 1024, Math.random() * 420, 2.2, 0, 7);
    px.fill();
  }
  const pt = new THREE.CanvasTexture(pc);
  pt.colorSpace = THREE.SRGBColorSpace;
  pt.anisotropy = 8;
  const boardMat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: pt, roughness: 0.45, metalness: 0.25, emissive: 0x1de9b6, emissiveIntensity: 0 });
  const board = new THREE.Group();
  board.position.set(-0.35, 0, -0.4);
  mid.add(board);
  board.add(SH(new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.02, 1.1), new THREE.MeshStandardMaterial({ color: 0x0d5a3b, roughness: 0.5 }))));
  const pcbTop = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 1.1), boardMat);
  pcbTop.rotation.x = -Math.PI / 2;
  pcbTop.position.y = 0.0105;
  board.add(pcbTop);
  const chipTex = (txt: string, bg: string, fg: string) => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 256;
    const x = c.getContext("2d") as CanvasRenderingContext2D;
    x.fillStyle = bg;
    x.fillRect(0, 0, 256, 256);
    x.strokeStyle = "rgba(255,255,255,.25)";
    x.lineWidth = 6;
    x.strokeRect(10, 10, 236, 236);
    x.fillStyle = fg;
    x.font = `600 44px ${fonts.mono}, monospace`;
    x.textAlign = "center";
    x.fillText(txt, 128, 120);
    x.font = `500 22px ${fonts.mono}, monospace`;
    x.fillText("GENESIS", 128, 160);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };
  const chip = (x: number, z: number, w: number, dd: number, h: number, txt: string, bg: string, fg: string) => {
    const side = () => new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.5, roughness: 0.5 });
    const top = new THREE.MeshStandardMaterial({ map: chipTex(txt, bg, fg), metalness: 0.6, roughness: 0.35 });
    const m = SH(new THREE.Mesh(new THREE.BoxGeometry(w, h, dd), [side(), side(), top, side(), side(), side()]));
    m.position.set(x, 0.01 + h / 2, z);
    board.add(m);
  };
  chip(0.55, 0.05, 0.52, 0.52, 0.045, "G1", "#2b2e30", "#bfe9d2");
  chip(-0.2, 0.3, 0.3, 0.22, 0.03, "RAM", "#1a1a18", "#9fb0a8");
  chip(-0.2, -0.3, 0.3, 0.22, 0.03, "RAM", "#1a1a18", "#9fb0a8");
  chip(-0.95, 0.1, 0.24, 0.24, 0.028, "IO", "#1d1d1b", "#9fb0a8");
  chip(1.05, 0.3, 0.22, 0.22, 0.028, "PWR", "#1d1d1b", "#9fb0a8");
  for (let i = 0; i < 10; i++) {
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.07, 14), new THREE.MeshStandardMaterial({ color: 0xcfcfcf, metalness: 0.7, roughness: 0.4 }));
    cap.position.set(-1.2 + (i % 5) * 0.12, 0.045, -0.4 + Math.floor(i / 5) * 0.12);
    board.add(cap);
  }
  const copper = new THREE.MeshStandardMaterial({ color: 0xc27a42, metalness: 0.95, roughness: 0.28 });
  const pipe = SH(new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.7, 16), copper));
  pipe.rotation.z = Math.PI / 2;
  pipe.position.set(0.95, 0.04, 0.05);
  board.add(pipe);
  const batMat = new THREE.MeshStandardMaterial({ color: 0xc7c9cc, metalness: 0.8, roughness: 0.4, emissive: 0xffcab0, emissiveIntensity: 0 });
  const battery = new THREE.Group();
  battery.position.set(-0.1, 0.015, 0.66);
  mid.add(battery);
  battery.add(SH(new THREE.Mesh(new RoundedBoxGeometry(3.0, 0.05, 0.7, 4, 0.02), new THREE.MeshStandardMaterial({ color: 0x45474a, metalness: 0.7, roughness: 0.45 }))));
  for (let i = 0; i < 6; i++) {
    const cell = SH(new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.022, 0.52, 3, 0.01), batMat));
    cell.position.set(-1.15 + i * 0.46, 0.036, 0);
    battery.add(cell);
  }
  const fans: THREE.Group[] = [];
  [0, 1].forEach((i) => {
    const f = new THREE.Group();
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.05, 16), new THREE.MeshStandardMaterial({ color: 0x2a2b2c, metalness: 0.8, roughness: 0.3 }));
    f.add(hub);
    for (let k = 0; k < 11; k++) {
      const bl = SH(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.012, 0.07), new THREE.MeshStandardMaterial({ color: 0x1b1c1d, metalness: 0.6, roughness: 0.45 })));
      const a = (k / 11) * Math.PI * 2;
      bl.position.set(Math.cos(a) * 0.17, 0, Math.sin(a) * 0.17);
      bl.rotation.y = -a + 0.5;
      f.add(bl);
    }
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.012, 8, 40), alu);
    ring.rotation.x = Math.PI / 2;
    f.add(ring);
    f.position.set(i ? 1.38 : -1.3, 0.04, -0.62);
    mid.add(f);
    fans.push(f);
  });
  [-1, 1].forEach((sx) => {
    const sp = SH(new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.035, 0.9), new THREE.MeshStandardMaterial({ color: 0x2a2b2c, metalness: 0.5, roughness: 0.5 })));
    sp.position.set(sx * 1.5, 0.01, 0.1);
    mid.add(sp);
  });

  // ---- iPhone 17 Pro
  const phone = new THREE.Group();
  scene.add(phone);
  const ipModel = ipGltf.scene;
  ipModel.rotation.y = Math.PI;
  ipModel.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) o.castShadow = true;
  });
  const ipw = new THREE.Group();
  ipw.add(ipModel);
  ipw.scale.setScalar(16);
  phone.add(ipw);
  const ipScreen = ipModel.getObjectByName("Object_23") as THREE.Mesh | undefined;
  if (ipScreen) {
    const mat = screenMat(PS.t);
    mat.side = THREE.DoubleSide;
    ipScreen.material = mat;
    PS.t.flipY = false;
    PS.t.wrapS = THREE.RepeatWrapping;
    PS.t.repeat.x = -1;
    PS.t.offset.x = 1;
    PS.t.needsUpdate = true;
  }

  const floor = new THREE.Mesh(new THREE.CircleGeometry(10, 64), new THREE.MeshStandardMaterial({ color: 0x161614, roughness: 0.55, metalness: 0.4 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -2.7;
  floor.receiveShadow = true;
  scene.add(floor);

  const radial = (inner: string, outer: string) => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const x = c.getContext("2d") as CanvasRenderingContext2D;
    const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, inner);
    g.addColorStop(1, outer);
    x.fillStyle = g;
    x.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };
  const fy = floor.position.y;
  const white = new THREE.Color(0xffffff);
  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 18),
    new THREE.MeshBasicMaterial({ map: radial("rgba(255,255,255,.6)", "rgba(255,255,255,0)"), transparent: true, opacity: 0.07, depthWrite: false, color: 0xa9cdb8 }),
  );
  glow.rotation.x = -Math.PI / 2;
  glow.position.set(1.4, fy + 0.012, 0);
  scene.add(glow);
  const blobTex = radial("rgba(0,0,0,.75)", "rgba(0,0,0,0)");
  const mkBlob = () => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false, opacity: 0.5 }));
    m.rotation.x = -Math.PI / 2;
    scene.add(m);
    return m;
  };
  const shLap = mkBlob();
  const shPhone = mkBlob();
  const screenLight = new THREE.PointLight(0xe8fff2, 0, 5, 2);
  hinge.add(screenLight);
  screenLight.position.set(0, 1.0, 0.35);

  // ---- pós-processamento
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(W() / 2, H() / 2), 0.16, 0.4, 2.8);
  composer.addPass(bloomPass);
  composer.addPass(new OutputPass());

  // ---- estado de rolagem e interação
  const ACC = 0xa9cdb8;
  const cA = new THREE.Color();
  const cB = new THREE.Color();
  const cC = new THREE.Color();
  let target = 0;
  let cur = 0;
  let chap = -1;
  let chapT = 0;
  let T = 0;
  let SP = 0;
  let maxCache = 1;
  let tw = 1;
  const mouse = { x: 0, y: 0 };
  const ms = { x: 0, y: 0 };
  let slLast = "";
  let pctLast = "";
  let lastDraw = -1;
  let lastAcc = 0;
  let lastHex = "";
  let q = 0;
  let fa = 0;
  let fn = 0;
  let frame = 0;
  let dv = 0;
  let raf = 0;
  let visible = true;

  const updTarget = () => {
    target = Math.min(Math.max(-container.getBoundingClientRect().top / Math.max(1, maxCache), 0), 1);
  };
  const onScroll = () => updTarget();
  const onPointer = (e: PointerEvent) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  const resize = () => {
    camera.aspect = W() / H();
    camera.fov = narrowNow() ? 46 : 30;
    camera.updateProjectionMatrix();
    renderer.setSize(W(), H(), false);
    composer.setSize(W(), H());
    maxCache = Math.max(1, container.offsetHeight - H());
    tw = d.ticks.clientWidth - 3;
    updTarget();
  };

  const setChap = (c: number) => {
    if (c === chap) return;
    chap = c;
    chapT = 0;
    d.onChapter(c);
  };

  const goTo = (i: number) => {
    const top = container.getBoundingClientRect().top + window.scrollY;
    const y = top + (maxCache * (holdStart[i] + (DW[i] > 0 ? 0.02 : 0))) / UT;
    window.scrollTo({ top: y, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  /** leva a rolagem a uma fração (0..1) do percurso: usado pela régua inferior */
  const seek = (fraction: number) => {
    const top = container.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + Math.min(1, Math.max(0, fraction)) * maxCache, behavior: "auto" });
  };

  const qualidade = () => {
    if (q === 1) {
      renderer.setPixelRatio(1);
      renderer.setSize(W(), H(), false);
      composer.setPixelRatio(1);
      composer.setSize(W(), H());
    }
    if (q === 2) peach.castShadow = false;
    if (q === 3) bloomPass.enabled = false;
  };

  // ---- câmera de foco: de frente para a tela, com a tela deslocada para a direita (o texto fica à esquerda)
  const _M = new THREE.Matrix4();
  const _C = new THREE.Vector3();
  const _N = new THREE.Vector3();
  const _R = new THREE.Vector3();
  const _P = new THREE.Vector3();
  const _T = new THREE.Vector3();
  const _UP = new THREE.Vector3(0, 1, 0);
  const _a = new THREE.Vector3();
  const lookV = new THREE.Vector3();
  const focusCam = (h: number, fitIn: number, latIn: number) => {
    const nar = narrowNow();
    const half = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const fit = nar ? fitIn * 0.8 : fitIn;
    const lat = nar ? 0 : latIn;
    const dist = h / 2 / half / fit;
    _R.crossVectors(_UP, _N).normalize();
    const sft = dist * half * camera.aspect * lat;
    _P.copy(_C).addScaledVector(_N, dist).addScaledVector(_R, -sft);
    _T.copy(_C).addScaledVector(_R, -sft);
  };
  const anchors = [
    () => hinge.localToWorld(_a.set(1.6, 1.1, -0.45)),
    () => board.localToWorld(_a.set(1.2, 0, 0)),
    () => battery.localToWorld(_a.set(1.4, 0, 0)),
    () => bottomCase.localToWorld(_a.set(1.6, -0.06, 0.6)),
  ];

  // ---- colisão: caixas calculadas uma vez e transformadas a cada quadro
  lap.updateMatrixWorld(true);
  phone.updateMatrixWorld(true);
  const lapBox0 = new THREE.Box3().setFromObject(lap);
  const phoneBox0 = new THREE.Box3().setFromObject(phone);
  const bl = new THREE.Box3();
  const bp = new THREE.Box3();

  const clock = new THREE.Clock();
  const shift = () => (narrowNow() ? 0 : 1.0);

  function tick() {
    const dt = Math.min(clock.getDelta(), 0.05);
    T += dt;
    chapT += dt;
    frame++;
    renderer.shadowMap.needsUpdate = (frame & 1) === 0;
    fa += dt;
    if (++fn === 90) {
      const avg = fa / fn;
      fa = 0;
      fn = 0;
      if (avg > 0.034 && q < 3) {
        q++;
        qualidade();
      }
    }
    cur = damp(cur, target, 5.5, dt);
    ms.x = damp(ms.x, mouse.x, 4, dt);
    ms.y = damp(ms.y, mouse.y, 4, dt);
    const mp = mapU(cur);
    const k = mp.k;
    const i = Math.min(Math.floor(k), NC - 2);
    const f = ease(k - i);
    const v = {} as Key;
    KEYS.forEach((n) => (v[n] = K[i][n] + (K[i + 1][n] - K[i][n]) * f));
    const c = Math.min(Math.round(k), NC - 1);
    setChap(c);
    {
      const spT = mp.hold === c ? mp.sp : k < c ? 0 : 1;
      SP = damp(SP, spT, 9, dt);
      const ls = SLIDES[c];
      if (ls) {
        const n = ls.length;
        const ix = Math.min(n - 1, Math.floor(SP * n + 0.0001));
        const key = `${c}:${ix}`;
        if (key !== slLast) {
          slLast = key;
          d.onSlide({ i: ix, n, label: ls[ix] });
        }
      } else if (slLast !== "") {
        slLast = "";
        d.onSlide(null);
      }
    }
    d.blur.style.setProperty("--ov", (1 - Math.abs(2 * f - 1)).toFixed(3));
    cC.lerpColors(cA.setHex(ACC), cB.setHex(ACC), f);
    {
      const hx = "#" + cC.getHexString();
      if (hx !== lastHex && T - lastAcc > 0.05) {
        lastHex = hx;
        lastAcc = T;
        stage.style.setProperty("--acc", hx);
      }
    }
    cool.color.copy(cC).lerp(white, 0.7);
    cool.intensity = 0.9;
    boardMat.emissive.copy(cC).lerp(white, 0.5);
    batMat.emissive.copy(cC).lerp(white, 0.5);
    const intro = 1 - Math.pow(1 - Math.min(1, T / 1.6), 3);
    const open = v.open * intro;
    const ex = v.ex;
    const fl = Math.sin(T * 0.9) * 0.05;
    const sx = shift();
    hinge.rotation.x = (1 - open) * 1.937;
    const eTop = smooth(0, 0.6, ex);
    const eMid = smooth(0.3, 0.9, ex);
    const eLid = smooth(0, 0.75, ex);
    bottomCase.position.y = 0;
    mid.position.y = -0.03 + eMid * 0.8;
    topCase.position.y = eTop * 1.6;
    hinge.position.y = 0.0072 + eTop * 1.6 + eLid * 0.3;
    boardMat.emissiveIntensity = c === 2 ? 0.35 + Math.sin(T * 3) * 0.2 : 0;
    batMat.emissiveIntensity = c === 5 ? 0.35 + Math.sin(T * 3) * 0.2 : 0;
    lap.position.set(v.lx + sx, v.ly + fl - ex * 0.9, v.lz);
    lap.rotation.set(v.lrx, v.lry + Math.sin(T * 0.35) * 0.04 + ms.x * 0.1, 0);
    lap.scale.setScalar(v.ls);
    phone.position.set(v.px + sx, v.py + fl * 1.4 + 0.4, v.pz);
    phone.rotation.set(-ms.y * 0.05, v.pry + ms.x * 0.1, Math.sin(T * 0.6) * 0.02);
    phone.scale.setScalar(v.ps);

    // colisão: o celular não atravessa o notebook e o notebook não atravessa o chão
    lap.updateMatrix();
    bl.copy(lapBox0).applyMatrix4(lap.matrix);
    if (bl.min.y < floor.position.y + 0.03) {
      lap.position.y += floor.position.y + 0.03 - bl.min.y;
      lap.updateMatrix();
      bl.copy(lapBox0).applyMatrix4(lap.matrix);
    }
    phone.updateMatrix();
    if (phone.position.x < 6) {
      bp.copy(phoneBox0).applyMatrix4(phone.matrix);
      const m = 0.18;
      if (bp.max.x + m > bl.min.x && bp.min.x - m < bl.max.x && bp.max.y > bl.min.y && bp.min.y < bl.max.y && bp.max.z + m > bl.min.z && bp.min.z - m < bl.max.z) {
        const right = (bp.min.x + bp.max.x) / 2 > (bl.min.x + bl.max.x) / 2;
        phone.position.x += right ? bl.max.x + m - bp.min.x : -(bp.max.x + m - bl.min.x);
        phone.updateMatrix();
      }
    }
    {
      const hL = Math.max(0, lap.position.y - fy);
      shLap.position.set(lap.position.x, fy + 0.014, lap.position.z);
      shLap.scale.set(5.2 + hL * 0.6, 3.8 + hL * 0.45, 1);
      (shLap.material as THREE.MeshBasicMaterial).opacity = 0.6 / (1 + hL * 0.4);
      const ph = phone.position.x < 6;
      shPhone.visible = ph;
      if (ph) {
        const hP = Math.max(0, phone.position.y - fy);
        shPhone.position.set(phone.position.x, fy + 0.014, phone.position.z);
        shPhone.scale.set(1.8 + hP * 0.2, 1.2 + hP * 0.15, 1);
        (shPhone.material as THREE.MeshBasicMaterial).opacity = 0.55 / (1 + hP * 0.4);
      }
      (glow.material as THREE.MeshBasicMaterial).color.copy(cC);
      glow.position.x = lap.position.x;
      screenLight.intensity = 6 * open * (1 - ex);
      screenLight.color.copy(cC).lerp(white, 0.88);
    }
    dv = damp(dv, chapT > 0.4 ? -0.55 : 0, 0.35, dt);
    camera.position.set(v.cx + sx * 0.5 + ms.x * 0.5, v.cy - ms.y * 0.3, v.cz + dv);
    lookV.set(v.tx + sx, v.ty, v.tz);
    if (v.wl > 0.002) {
      hinge.updateMatrix();
      _M.multiplyMatrices(lap.matrix, hinge.matrix);
      _C.set(0, 1.12, -0.42).applyMatrix4(_M);
      _N.set(0, 0.358, 0.934).transformDirection(_M);
      focusCam(2.06 * lap.scale.x, 0.9, 0);
      camera.position.lerp(_P, v.wl);
      lookV.lerp(_T, v.wl);
    }
    if (v.wp > 0.002) {
      _C.set(0, 0, 0).applyMatrix4(phone.matrix);
      _N.set(0, 0, 1).transformDirection(phone.matrix);
      focusCam(2.3 * phone.scale.x, 0.86, 0.24);
      camera.position.lerp(_P, v.wp);
      lookV.lerp(_T, v.wp);
    }
    {
      const hide = Math.min(1, v.wl * 2);
      d.copy.style.opacity = (1 - hide).toFixed(2);
      d.copy.style.pointerEvents = hide > 0.6 ? "none" : "";
      d.cap.style.opacity = Math.max(0, (hide - 0.35) / 0.65).toFixed(2);
      const fz = Math.max(v.wl, v.wp);
      d.code.style.opacity = (1 - 0.88 * fz).toFixed(2);
    }
    camera.lookAt(lookV);
    if ((chapT < 3.4 || (c >= 2 && c <= 6)) && T - lastDraw > 0.033) {
      lastDraw = T;
      drawLaptop(c, Math.min(chapT / 1.8, 3), T, SP);
      drawPhone(c, chapT / 1.8, SP);
    }
    d.labels.forEach((l, n) => {
      const p = anchors[n]().project(camera);
      l.style.left = (p.x * 0.5 + 0.5) * W() + 40 + "px";
      l.style.top = (-p.y * 0.5 + 0.5) * H() + "px";
      l.style.opacity = c === 1 && ex > 0.85 ? "1" : "0";
    });
    d.marker.style.left = cur * tw + "px";
    const pctNow = String(Math.round(cur * 100));
    if (pctNow !== pctLast) {
      pctLast = pctNow;
      d.marker.parentElement?.parentElement?.setAttribute("aria-valuenow", pctNow);
    }
    fans.forEach((fan, n) => (fan.rotation.y = T * (ex > 0.5 ? 9 : 0.6) * (n ? 1 : -1)));
    composer.render();
    raf = requestAnimationFrame(tick);
  }

  // roda somente com a cena visível e a aba ativa
  const sync = () => {
    const shouldRun = visible && !document.hidden && !disposed;
    if (shouldRun && !raf) {
      clock.getDelta();
      raf = requestAnimationFrame(tick);
    } else if (!shouldRun && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
  const io = new IntersectionObserver(
    ([e]) => {
      visible = e.isIntersecting;
      sync();
    },
    { rootMargin: "100px" },
  );
  io.observe(container);
  const onVis = () => sync();

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", onVis);
  resize();
  updTarget();
  cur = target;
  d.onLoad(1);
  sync();
  d.onReady();

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(raf);
    raf = 0;
    io.disconnect();
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("pointermove", onPointer);
    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", onVis);
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.geometry?.dispose();
      const mats = Array.isArray(m.material) ? m.material : [m.material];
      mats.forEach((mt) => {
        if (!mt) return;
        Object.values(mt as unknown as Record<string, unknown>).forEach((val) => {
          if (val && (val as THREE.Texture).isTexture) (val as THREE.Texture).dispose();
        });
        mt.dispose();
      });
    });
    [LS.t, PS.t, pt, blobTex].forEach((t) => t.dispose());
    roomEnv.dispose();
    pmrem.dispose();
    composer.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  };
  return { dispose, goTo, seek };
}
