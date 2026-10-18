import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { ITEM_POR_ID, type ItemId } from "./dados";

/**
 * MacBook Pro 14" com M1 Pro, modelado só com geometrias do three.js.
 * Unidades: 1 = 0,5 cm. Eixos: x largura, y altura, z profundidade (a dobradiça fica em z negativo, a frente em z positivo).
 * Cada peça (Piece) é um grupo com origem no seu centro e três posições: repouso, aberta e explodida.
 */

export const LARGURA = 15.6;
export const PROFUNDIDADE = 11;
export const ALTURA_BASE = 0.78;
export const ANGULO_TELA = THREE.MathUtils.degToRad(104);

type Mat = THREE.MeshStandardMaterial | THREE.MeshBasicMaterial | THREE.LineBasicMaterial;
export type MatRef = { mat: Mat; kind: "std" | "basic" | "line"; op: number; em: number; color: THREE.Color };

export type Piece = {
  key: string;
  item: ItemId;
  group: THREE.Group;
  base: THREE.Vector3;
  /** deslocamento com a vista explodida em 100% */
  explode: THREE.Vector3;
  /** deslocamento com a carcaça aberta em 100% */
  open: THREE.Vector3;
  /** peça da carcaça: fica transparente quando ela abre */
  shell: boolean;
  mats: MatRef[];
};

export type Cells = { mesh: THREE.InstancedMesh; color: THREE.Color; n: number };

export type Modelo = {
  root: THREE.Group;
  pieces: Piece[];
  byKey: Record<string, Piece>;
  byItem: Record<string, Piece[]>;
  lid: THREE.Group;
  lidBase: THREE.Vector3;
  lidExplode: THREE.Vector3;
  rotors: THREE.Object3D[];
  cells: Record<"cpu" | "gpu" | "neural", Cells>;
  dispose: () => void;
};

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

// ---------- texturas desenhadas em canvas

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function tex(c: HTMLCanvasElement, srgb = true) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function texturaPlaca() {
  const c = canvas(512, 512);
  const g = c.getContext("2d") as CanvasRenderingContext2D;
  g.fillStyle = "#0b1230";
  g.fillRect(0, 0, 512, 512);
  const r = rng(7);
  g.lineCap = "round";
  for (let i = 0; i < 90; i++) {
    let x = Math.floor(r() * 32) * 16;
    let y = Math.floor(r() * 32) * 16;
    g.beginPath();
    g.moveTo(x, y);
    const n = 2 + Math.floor(r() * 3);
    for (let k = 0; k < n; k++) {
      const dir = Math.floor(r() * 8);
      const len = (1 + Math.floor(r() * 5)) * 16;
      x += Math.round(Math.cos((dir * Math.PI) / 4)) * len;
      y += Math.round(Math.sin((dir * Math.PI) / 4)) * len;
      g.lineTo(x, y);
    }
    g.strokeStyle = r() > 0.5 ? "rgba(70,110,230,0.55)" : "rgba(130,90,230,0.5)";
    g.lineWidth = 2;
    g.stroke();
    g.fillStyle = "rgba(160,190,255,0.7)";
    g.beginPath();
    g.arc(x, y, 3, 0, Math.PI * 2);
    g.fill();
  }
  return tex(c);
}

function texturaTela() {
  const w = 1024;
  const h = 665;
  const c = canvas(w, h);
  const g = c.getContext("2d") as CanvasRenderingContext2D;
  const bg = g.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#071033");
  bg.addColorStop(0.55, "#23166a");
  bg.addColorStop(1, "#5a2a9e");
  g.fillStyle = bg;
  g.fillRect(0, 0, w, h);
  const blobs: [number, number, number, string][] = [
    [220, 520, 360, "rgba(60,130,255,0.45)"],
    [780, 140, 320, "rgba(170,90,255,0.45)"],
    [620, 560, 260, "rgba(80,200,255,0.25)"],
  ];
  for (const [x, y, rad, col] of blobs) {
    const rg = g.createRadialGradient(x, y, 0, x, y, rad);
    rg.addColorStop(0, col);
    rg.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = rg;
    g.fillRect(0, 0, w, h);
  }
  g.fillStyle = "rgba(10,12,24,0.55)";
  g.fillRect(0, 0, w, 26);
  g.fillStyle = "rgba(255,255,255,0.8)";
  g.font = "600 15px sans-serif";
  g.fillText("Anatomia   Arquivo   Vista   Janela", 18, 18);
  const win = (x: number, y: number, ww: number, hh: number) => {
    g.fillStyle = "rgba(14,18,40,0.62)";
    g.beginPath();
    g.roundRect(x, y, ww, hh, 14);
    g.fill();
    g.strokeStyle = "rgba(255,255,255,0.16)";
    g.lineWidth = 1.5;
    g.stroke();
    ["#ff6b6b", "#ffc857", "#5fe08a"].forEach((col, i) => {
      g.fillStyle = col;
      g.beginPath();
      g.arc(x + 20 + i * 18, y + 20, 5, 0, Math.PI * 2);
      g.fill();
    });
  };
  win(90, 90, 520, 340);
  win(500, 230, 420, 300);
  g.fillStyle = "rgba(120,170,255,0.8)";
  for (let i = 0; i < 9; i++) g.fillRect(120, 140 + i * 28, 120 + ((i * 53) % 260), 8);
  g.fillStyle = "rgba(190,140,255,0.75)";
  for (let i = 0; i < 6; i++) g.fillRect(530, 280 + i * 30, 90 + ((i * 71) % 240), 8);
  g.fillStyle = "rgba(255,255,255,0.14)";
  g.beginPath();
  g.roundRect(w / 2 - 190, h - 66, 380, 50, 18);
  g.fill();
  return tex(c);
}

function texturaMiniLed() {
  const c = canvas(256, 166);
  const g = c.getContext("2d") as CanvasRenderingContext2D;
  g.fillStyle = "#04060e";
  g.fillRect(0, 0, 256, 166);
  g.fillStyle = "#9fd0ff";
  for (let y = 4; y < 166; y += 8) for (let x = 4; x < 256; x += 8) g.fillRect(x, y, 2.5, 2.5);
  return tex(c);
}

function texturaGrelha() {
  const c = canvas(64, 512);
  const g = c.getContext("2d") as CanvasRenderingContext2D;
  g.fillStyle = "#0a0c14";
  g.fillRect(0, 0, 64, 512);
  g.fillStyle = "#8f98c0";
  for (let y = 6; y < 512; y += 10) for (let x = 6; x < 64; x += 10) g.fillRect(x, y, 3, 3);
  return tex(c);
}

// ---------- construtor

const ALU = "#3a3e4c";

export function criarModelo(): Modelo {
  const root = new THREE.Group();
  const pieces: Piece[] = [];
  const byKey: Record<string, Piece> = {};
  const byItem: Record<string, Piece[]> = {};
  const rotors: THREE.Object3D[] = [];
  const disposables: { dispose: () => void }[] = [];
  const keep = <T extends { dispose: () => void }>(o: T) => {
    disposables.push(o);
    return o;
  };

  const lid = new THREE.Group();
  const lidBase = V(0, ALTURA_BASE, -PROFUNDIDADE / 2);
  lid.position.copy(lidBase);
  lid.rotation.x = -ANGULO_TELA;
  root.add(lid);

  type PieceOpts = { explode?: THREE.Vector3; open?: THREE.Vector3; shell?: boolean; parent?: THREE.Object3D };
  const piece = (key: string, item: ItemId, base: THREE.Vector3, o: PieceOpts = {}): Piece => {
    const group = new THREE.Group();
    group.position.copy(base);
    (o.parent ?? root).add(group);
    const p: Piece = {
      key,
      item,
      group,
      base: base.clone(),
      explode: o.explode ?? V(0, 0, 0),
      open: o.open ?? V(0, 0, 0),
      shell: !!o.shell,
      mats: [],
    };
    pieces.push(p);
    byKey[key] = p;
    (byItem[item] ??= []).push(p);
    return p;
  };

  type MatOpts = { c: string; m?: number; r?: number; op?: number; e?: string; ei?: number; map?: THREE.Texture; emap?: THREE.Texture };
  const std = (p: Piece, o: MatOpts) => {
    const mat = keep(
      new THREE.MeshStandardMaterial({
        color: o.c,
        metalness: o.m ?? 0.3,
        roughness: o.r ?? 0.5,
        transparent: true,
        opacity: o.op ?? 1,
        envMapIntensity: 0.55,
        emissive: o.e ?? "#000000",
        emissiveIntensity: o.ei ?? 0,
        ...(o.map ? { map: o.map } : {}),
        ...(o.emap ? { emissiveMap: o.emap } : {}),
      }),
    );
    p.mats.push({ mat, kind: "std", op: o.op ?? 1, em: o.ei ?? 0, color: new THREE.Color(o.c) });
    return mat;
  };
  const edges = (p: Piece, geo: THREE.BufferGeometry, parent: THREE.Object3D, color: string, op = 0.5) => {
    const mat = keep(new THREE.LineBasicMaterial({ color, transparent: true, opacity: op }));
    const line = new THREE.LineSegments(keep(new THREE.EdgesGeometry(geo, 28)), mat);
    line.raycast = () => {};
    parent.add(line);
    p.mats.push({ mat, kind: "line", op, em: 0, color: new THREE.Color(color) });
  };
  const rb = (w: number, h: number, d: number, r: number) => keep(new RoundedBoxGeometry(w, h, d, 2, Math.min(r, Math.min(w, h, d) / 2 - 0.002)));
  const bx = (w: number, h: number, d: number) => keep(new THREE.BoxGeometry(w, h, d));

  type MeshOpts = { geo: THREE.BufferGeometry; mat: MatOpts; at?: [number, number, number]; edge?: string | false; edgeOp?: number };
  const mesh = (p: Piece, o: MeshOpts, parent: THREE.Object3D = p.group) => {
    const m = new THREE.Mesh(o.geo, std(p, o.mat));
    if (o.at) m.position.set(...o.at);
    m.userData.item = p.item;
    parent.add(m);
    if (o.edge !== false) edges(p, o.geo, m, o.edge ?? ITEM_POR_ID[p.item].cor, o.edgeOp);
    return m;
  };
  const cor = (id: ItemId) => ITEM_POR_ID[id].cor;

  const W = LARGURA;
  const D = PROFUNDIDADE;

  // ----- base (parte de baixo da carcaça)
  {
    const p = piece("base", "carcaca", V(0, 0, 0));
    mesh(p, { geo: rb(W, 0.14, D, 0.5), mat: { c: ALU, m: 0.85, r: 0.45 }, at: [0, 0.07, 0] });
    const wall = { c: ALU, m: 0.85, r: 0.45 };
    mesh(p, { geo: bx(0.22, 0.48, D), mat: wall, at: [-W / 2 + 0.11, 0.38, 0] });
    mesh(p, { geo: bx(0.22, 0.48, D), mat: wall, at: [W / 2 - 0.11, 0.38, 0] });
    mesh(p, { geo: bx(W - 0.44, 0.48, 0.22), mat: wall, at: [0, 0.38, D / 2 - 0.11] });
    mesh(p, { geo: bx(W - 0.44, 0.48, 0.22), mat: wall, at: [0, 0.38, -D / 2 + 0.11] });
    for (const sx of [-1, 1])
      for (const sz of [-1, 1])
        mesh(p, { geo: keep(new THREE.CylinderGeometry(0.34, 0.34, 0.1, 18)), mat: { c: "#14161d", m: 0.1, r: 0.9 }, at: [sx * 6.6, -0.04, sz * 4.4], edge: false });
    // dobradiça
    for (const sx of [-1, 1]) {
      const hg = keep(new THREE.CylinderGeometry(0.24, 0.24, 1.8, 20));
      const m = mesh(p, { geo: hg, mat: { c: "#2a2d38", m: 0.9, r: 0.35 }, at: [sx * 5.4, ALTURA_BASE, -D / 2 + 0.05], edge: false });
      m.rotation.z = Math.PI / 2;
    }
  }

  // ----- carcaça de cima (apoio das mãos)
  {
    const p = piece("deck", "carcaca", V(0, 0.7, 0), { open: V(0, 3.4, 0), explode: V(0, 7.6, 0), shell: true });
    mesh(p, { geo: rb(W, 0.16, D, 0.5), mat: { c: ALU, m: 0.85, r: 0.4 } });
    mesh(p, { geo: bx(14.4, 0.02, 6.1), mat: { c: "#0b0d14", m: 0.3, r: 0.6 }, at: [0, 0.08, -2.1], edge: false });
  }

  // ----- teclado
  {
    const p = piece("keys", "teclado", V(0, 0.78, -2.1), { open: V(0, 3.4, 0), explode: V(0, 9.0, 0), shell: true });
    const u = 13.6 / 15;
    const rows: { z: number; d: number; keys: (number | "setas")[] }[] = [
      { z: -2.45, d: 0.55, keys: [1.5, ...Array<number>(12).fill(1), 1.5] },
      { z: -1.65, d: 0.84, keys: [...Array<number>(13).fill(1), 2] },
      { z: -0.67, d: 0.84, keys: [1.5, ...Array<number>(12).fill(1), 1.5] },
      { z: 0.31, d: 0.84, keys: [1.8, ...Array<number>(11).fill(1), 2.2] },
      { z: 1.29, d: 0.84, keys: [2.3, ...Array<number>(10).fill(1), 2.7] },
      { z: 2.27, d: 0.84, keys: [1, 1, 1, 1.25, 5.5, 1.25, 1, "setas"] },
    ];
    // z local ao grupo: o teclado ocupa de -4.85 a 0.6; as linhas acima ficam centradas em -2.1
    const mats: THREE.Matrix4[] = [];
    const m4 = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const add = (cx: number, cz: number, kw: number, kd: number) => {
      m4.compose(V(cx, 0.07, cz - 0.2), q, V(kw, 0.13, kd));
      mats.push(m4.clone());
    };
    for (const row of rows) {
      let x = -6.8;
      for (const k of row.keys) {
        if (k === "setas") {
          add(x + 0.5 * u, row.z, u - 0.08, row.d);
          add(x + 1.5 * u, row.z - row.d / 4, u - 0.08, row.d / 2 - 0.04);
          add(x + 1.5 * u, row.z + row.d / 4, u - 0.08, row.d / 2 - 0.04);
          add(x + 2.5 * u, row.z, u - 0.08, row.d);
          x += 3 * u;
        } else {
          add(x + (k * u) / 2, row.z, k * u - 0.08, row.d);
          x += k * u;
        }
      }
    }
    const mat = std(p, { c: "#12141c", m: 0.25, r: 0.55, e: cor("teclado"), ei: 0.12 });
    const inst = new THREE.InstancedMesh(keep(new THREE.BoxGeometry(1, 1, 1)), mat, mats.length);
    mats.forEach((m, i) => inst.setMatrixAt(i, m));
    inst.userData.item = "teclado";
    p.group.add(inst);
    // contorno do bloco das teclas, para a vista transparente
    const bloco = rb(13.9, 0.14, 5.5, 0.1);
    edges(p, bloco, p.group, cor("teclado"), 0.55);
    p.group.children[p.group.children.length - 1].position.set(0, 0.07, -0.2 - 0.05);
  }

  // ----- trackpad
  {
    const p = piece("trackpad", "trackpad", V(0, 0.81, 3.3), { open: V(0, 3.4, 0), explode: V(0, 9.0, 2.5), shell: true });
    mesh(p, { geo: rb(6.8, 0.05, 3.9, 0.2), mat: { c: "#0f1219", m: 0.2, r: 0.18 } });
  }

  // ----- grelhas dos alto-falantes (aparecem por fora)
  {
    const p = piece("grelhas", "falantes", V(0, 0.79, -2.1), { open: V(0, 3.4, 0), explode: V(0, 7.7, 0), shell: true });
    const map = texturaGrelha();
    keep(map);
    for (const sx of [-1, 1]) {
      const g = keep(new THREE.PlaneGeometry(0.55, 5.4));
      const m = mesh(p, { geo: g, mat: { c: "#ffffff", m: 0.2, r: 0.7, map }, at: [sx * 7.3, 0.004, 0], edge: false });
      m.rotation.x = -Math.PI / 2;
      const outline = rb(0.55, 0.02, 5.4, 0.05);
      edges(p, outline, m, cor("falantes"), 0.6);
      m.children[m.children.length - 1].rotation.x = Math.PI / 2;
    }
  }

  // ----- tela (camadas, cada uma a uma distância da dobradiça)
  {
    const camadas = (key: string, y: number, ex: number): Piece =>
      piece(key, "tela", V(0, y, D / 2), { parent: lid, explode: V(0, ex, 0) });
    const costas = camadas("lid_back", 0.33, 2.4);
    mesh(costas, { geo: rb(W, 0.1, D, 0.4), mat: { c: ALU, m: 0.85, r: 0.4 } });
    // marca luminosa discreta no centro
    const disco = mesh(costas, { geo: keep(new THREE.CircleGeometry(0.7, 40)), mat: { c: "#8fa8ff", m: 0, r: 0.4, e: "#6a8dff", ei: 0.9 }, at: [0, 0.056, 0], edge: false });
    disco.rotation.x = -Math.PI / 2;

    const led = camadas("lid_led", 0.22, 1.2);
    const miniLed = texturaMiniLed();
    keep(miniLed);
    mesh(led, { geo: rb(W - 0.8, 0.06, D - 0.8, 0.12), mat: { c: "#0a0d18", m: 0.4, r: 0.5, e: "#ffffff", ei: 0.55, emap: miniLed }, edge: cor("tela") });

    const lcd = camadas("lid_lcd", 0.1, 0);
    mesh(lcd, { geo: rb(W - 0.5, 0.06, D - 0.6, 0.12), mat: { c: "#10142a", m: 0.3, r: 0.4 } });
    const pic = texturaTela();
    keep(pic);
    const plano = mesh(lcd, { geo: keep(new THREE.PlaneGeometry(W - 0.9, D - 1.1)), mat: { c: "#ffffff", m: 0, r: 0.25, map: pic, e: "#ffffff", ei: 0.75, emap: pic }, at: [0, -0.035, 0], edge: false });
    plano.rotation.x = Math.PI / 2;

    const vidro = camadas("lid_glass", -0.03, -1.4);
    const sh = new THREE.Shape();
    const hw = W / 2;
    const hd = D / 2;
    sh.moveTo(-hw, -hd);
    sh.lineTo(hw, -hd);
    sh.lineTo(hw, hd);
    sh.lineTo(-hw, hd);
    sh.lineTo(-hw, -hd);
    const furo = new THREE.Path();
    const iw = hw - 0.25;
    furo.moveTo(-iw, -hd + 0.28);
    furo.lineTo(-iw, hd - 0.25);
    furo.lineTo(iw, hd - 0.25);
    furo.lineTo(iw, -hd + 0.28);
    furo.lineTo(-iw, -hd + 0.28);
    sh.holes.push(furo);
    const moldura = keep(new THREE.ExtrudeGeometry(sh, { depth: 0.06, bevelEnabled: false }));
    moldura.rotateX(Math.PI / 2);
    moldura.translate(0, 0.03, 0);
    mesh(vidro, { geo: moldura, mat: { c: "#07080d", m: 0.2, r: 0.3 } });
    const recorte = mesh(vidro, { geo: bx(2.2, 0.06, 0.34), mat: { c: "#07080d", m: 0.2, r: 0.3 }, at: [0, 0, hd - 0.45], edge: false });
    recorte.userData.item = "tela";
    const camera = mesh(vidro, { geo: keep(new THREE.CylinderGeometry(0.07, 0.07, 0.03, 12)), mat: { c: "#1a2a55", m: 0.6, r: 0.2, e: "#5a8dff", ei: 0.5 }, at: [0, -0.04, hd - 0.45], edge: false });
    camera.userData.item = "tela";
    const panoVidro = mesh(vidro, { geo: keep(new THREE.PlaneGeometry(W - 0.5, D - 0.5)), mat: { c: "#9fb8ff", m: 0, r: 0.05, op: 0.07 }, at: [0, -0.07, 0], edge: false });
    panoVidro.rotation.x = Math.PI / 2;
  }

  // ----- bateria: três módulos de células
  {
    const p = piece("bat", "bateria", V(0, 0.29, 2.8), { explode: V(0, 0.9, 0) });
    for (const x of [-4, 0, 4]) {
      mesh(p, { geo: rb(3.5, 0.3, 4.8, 0.1), mat: { c: "#20183a", m: 0.5, r: 0.5 }, at: [x, 0, 0] });
      const raia = mesh(p, { geo: bx(0.18, 0.012, 3.6), mat: { c: "#b784ff", m: 0, r: 0.5, e: "#b784ff", ei: 1.1 }, at: [x, 0.156, 0], edge: false });
      raia.userData.item = "bateria";
      const raia2 = mesh(p, { geo: bx(1.6, 0.012, 0.14), mat: { c: "#b784ff", m: 0, r: 0.5, e: "#b784ff", ei: 1.1 }, at: [x, 0.156, 0], edge: false });
      raia2.userData.item = "bateria";
    }
    for (const x of [-2, 2]) mesh(p, { geo: bx(0.5, 0.05, 0.5), mat: { c: "#6b4bb0", m: 0.7, r: 0.4 }, at: [x, 0.1, -2.5], edge: false });
  }

  // ----- alto-falantes
  for (const sx of [-1, 1]) {
    const p = piece(sx < 0 ? "falL" : "falR", "falantes", V(sx * 6.9, 0.38, -1.9), { explode: V(sx * 1.6, 1.3, 0) });
    mesh(p, { geo: rb(1.5, 0.5, 4.8, 0.12), mat: { c: "#171a26", m: 0.4, r: 0.55 } });
    for (const z of [-1.4, 1.4]) {
      mesh(p, { geo: keep(new THREE.CylinderGeometry(0.52, 0.52, 0.08, 28)), mat: { c: "#232840", m: 0.5, r: 0.4 }, at: [0, 0.27, z] });
      mesh(p, { geo: keep(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 18)), mat: { c: "#d08cff", m: 0.4, r: 0.3, e: "#d08cff", ei: 0.5 }, at: [0, 0.3, z], edge: false });
    }
    mesh(p, { geo: keep(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 18)), mat: { c: "#232840", m: 0.5, r: 0.4 }, at: [0, 0.27, 0] });
  }

  // ----- placa lógica
  {
    const p = piece("placa", "placa", V(0, 0.26, -2.6), { explode: V(0, 1.7, 0) });
    const map = texturaPlaca();
    keep(map);
    mesh(p, { geo: rb(7.8, 0.08, 4.2, 0.1), mat: { c: "#ffffff", m: 0.3, r: 0.6, map, e: "#3a58c8", ei: 0.18, emap: map } });
    const r = rng(21);
    const livres: THREE.Matrix4[] = [];
    const m4 = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const fora = (x: number, z: number) =>
      (Math.abs(x) < 2.95 && z > -1.95 && z < 0.75) || (Math.abs(x) > 0.7 && Math.abs(x) < 2.7 && z > 0.85 && z < 1.95) || (x > 2.7 && z > 0.9 && z < 1.9);
    let guard = 0;
    while (livres.length < 85 && guard++ < 2000) {
      const x = (r() * 2 - 1) * 3.65;
      const z = (r() * 2 - 1) * 1.95;
      if (fora(x, z) || Math.abs(x) > 3.0) continue;
      const long = r() > 0.5;
      m4.compose(V(x, 0.07, z), q, V(long ? 0.18 : 0.12, 0.06 + r() * 0.06, long ? 0.1 : 0.16));
      livres.push(m4.clone());
    }
    const caps = new THREE.InstancedMesh(keep(new THREE.BoxGeometry(1, 1, 1)), std(p, { c: "#aeb6d8", m: 0.7, r: 0.35 }), livres.length);
    livres.forEach((m, i) => caps.setMatrixAt(i, m));
    caps.userData.item = "placa";
    p.group.add(caps);
    // conversores de tensão nas laterais
    for (const sx of [-1, 1])
      for (let i = 0; i < 4; i++)
        mesh(p, { geo: rb(0.5, 0.22, 0.5, 0.06), mat: { c: "#3a2f6a", m: 0.8, r: 0.35 }, at: [sx * 3.35, 0.15, -1.5 + i * 0.8], edge: false });
    mesh(p, { geo: rb(0.9, 0.1, 0.9, 0.04), mat: { c: "#9aa3c7", m: 0.9, r: 0.3 }, at: [3.2, 0.09, 1.45], edge: false });
    mesh(p, { geo: rb(0.9, 0.1, 0.9, 0.04), mat: { c: "#9aa3c7", m: 0.9, r: 0.3 }, at: [-3.2, 0.09, 1.45], edge: false });
  }

  // ----- chip (pacote), dies e memória unificada
  {
    const p = piece("chip", "chip", V(0, 0.34, -3.2), { explode: V(0, 2.9, 0) });
    mesh(p, { geo: rb(5.6, 0.07, 2.4, 0.08), mat: { c: "#101636", m: 0.4, r: 0.5, e: cor("chip"), ei: 0.12 } });
    mesh(p, { geo: bx(0.85, 0.1, 0.15), mat: { c: "#2a3a8a", m: 0.5, r: 0.4, e: "#6a8dff", ei: 0.3 }, at: [-0.43, 0.09, 0.77] });
  }
  const cells = {} as Modelo["cells"];
  const dado = (key: "cpu" | "gpu" | "neural", pos: THREE.Vector3, w: number, d: number, off: THREE.Vector3, cor0: string, nx: number, nz: number, cw: number, cd: number, gx: number, gz: number) => {
    const p = piece(key, key, pos, { explode: off });
    mesh(p, { geo: rb(w, 0.1, d, 0.04), mat: { c: cor0, m: 0.5, r: 0.35, e: cor0, ei: 0.35 } });
    const n = nx * nz;
    const mat = keep(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1 }));
    p.mats.push({ mat, kind: "basic", op: 1, em: 0, color: new THREE.Color(0xffffff) });
    const inst = new THREE.InstancedMesh(keep(new THREE.BoxGeometry(1, 1, 1)), mat, n);
    const m4 = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    let i = 0;
    for (let ix = 0; ix < nx; ix++)
      for (let iz = 0; iz < nz; iz++) {
        const x = (ix - (nx - 1) / 2) * gx;
        const z = (iz - (nz - 1) / 2) * gz;
        m4.compose(V(x, 0.065, z), q, V(cw, 0.03, cd));
        inst.setMatrixAt(i, m4);
        inst.setColorAt(i, new THREE.Color(1, 1, 1));
        i++;
      }
    inst.userData.item = key;
    p.group.add(inst);
    cells[key] = { mesh: inst, color: new THREE.Color(cor(key)), n };
  };
  dado("gpu", V(0.43, 0.43, -3.2), 0.85, 1.7, V(0.9, 4.2, 0), "#7a4fe0", 4, 4, 0.14, 0.34, 0.2, 0.42);
  dado("cpu", V(-0.43, 0.43, -3.575), 0.85, 0.95, V(-0.9, 4.6, -0.4), "#3b73e8", 4, 2, 0.14, 0.32, 0.2, 0.4);
  dado("neural", V(-0.43, 0.43, -2.75), 0.85, 0.4, V(-0.9, 5.0, 1.2), "#b457e0", 8, 2, 0.08, 0.1, 0.1, 0.15);

  for (const sx of [-1, 1]) {
    const p = piece(sx < 0 ? "memL" : "memR", "memoria", V(sx * 1.9, 0.435, -3.2), { explode: V(sx * 1.2, 3.2, 0) });
    mesh(p, { geo: rb(1.5, 0.12, 2.0, 0.05), mat: { c: "#12183a", m: 0.5, r: 0.4, e: cor("memoria"), ei: 0.15 } });
    mesh(p, { geo: bx(1.0, 0.012, 0.18), mat: { c: "#8fb0ff", m: 0, r: 0.5, e: "#8fb0ff", ei: 0.6 }, at: [0, 0.066, -0.5], edge: false });
    mesh(p, { geo: bx(1.0, 0.012, 0.18), mat: { c: "#8fb0ff", m: 0, r: 0.5, e: "#8fb0ff", ei: 0.6 }, at: [0, 0.066, 0.1], edge: false });
  }
  for (const sx of [-1, 1]) {
    const p = piece(sx < 0 ? "ssdL" : "ssdR", "ssd", V(sx * 1.7, 0.34, -1.2), { explode: V(sx * 0.4, 2.3, 1.0) });
    mesh(p, { geo: rb(1.8, 0.08, 0.8, 0.04), mat: { c: "#0d2433", m: 0.5, r: 0.45, e: cor("ssd"), ei: 0.2 } });
    mesh(p, { geo: bx(1.2, 0.012, 0.12), mat: { c: "#6fd6ff", m: 0, r: 0.5, e: "#6fd6ff", ei: 0.7 }, at: [0, 0.046, 0], edge: false });
  }

  // ----- refrigeração: bloco de cobre, heat pipes, aletas e ventoinhas
  {
    const p = piece("cooler", "refrigeracao", V(0, 0.62, -3.2), { explode: V(0, 6.0, 0) });
    mesh(p, { geo: rb(2.0, 0.1, 2.0, 0.05), mat: { c: "#b87333", m: 0.9, r: 0.3 } });
    for (const s of [-1, 1])
      for (const k of [-1, 1]) {
        const z0 = k * 0.35;
        const curve = new THREE.CatmullRomCurve3([V(s * 0.9, 0, z0), V(s * 2.6, 0, -0.5 + z0), V(s * 4.3, 0, -1.2 + z0 * 0.6), V(s * 5.7, 0, -1.9)]);
        const tube = keep(new THREE.TubeGeometry(curve, 36, 0.12, 8, false));
        mesh(p, { geo: tube, mat: { c: "#c8793a", m: 0.9, r: 0.28 }, edge: false });
      }
    const fin = keep(new THREE.BoxGeometry(0.04, 0.5, 0.65));
    const finMat = std(p, { c: "#9aa3c7", m: 0.9, r: 0.35 });
    const n = 16;
    const aletas = new THREE.InstancedMesh(fin, finMat, n * 2);
    const m4 = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    for (const [si, s] of [-1, 1].entries())
      for (let i = 0; i < n; i++) {
        m4.compose(V(s * (4.6 + i * 0.17), -0.26, -1.875), q, V(1, 1, 1));
        aletas.setMatrixAt(si * n + i, m4);
      }
    aletas.userData.item = "refrigeracao";
    p.group.add(aletas);
    for (const s of [-1, 1]) {
      const caixa = bx(2.75, 0.5, 0.65);
      edges(p, caixa, p.group, cor("refrigeracao"), 0.55);
      p.group.children[p.group.children.length - 1].position.set(s * 5.9, -0.26, -1.875);
    }
  }
  for (const s of [-1, 1]) {
    const p = piece(s < 0 ? "fanL" : "fanR", "refrigeracao", V(s * 5.9, 0.36, -3.2), { explode: V(s * 0.3, 2.7, 0) });
    const casca = keep(new THREE.CylinderGeometry(1.55, 1.55, 0.42, 36, 1, true));
    const casco = mesh(p, { geo: casca, mat: { c: "#1a1d2a", m: 0.6, r: 0.5 }, edge: cor("refrigeracao") });
    (casco.material as THREE.MeshStandardMaterial).side = THREE.DoubleSide;
    mesh(p, { geo: keep(new THREE.CylinderGeometry(1.55, 1.55, 0.04, 36)), mat: { c: "#12141e", m: 0.5, r: 0.5 }, at: [0, -0.19, 0], edge: false });
    const rotor = new THREE.Group();
    p.group.add(rotor);
    rotors.push(rotor);
    mesh(p, { geo: keep(new THREE.CylinderGeometry(0.45, 0.45, 0.32, 24)), mat: { c: "#2a2f45", m: 0.8, r: 0.35, e: cor("refrigeracao"), ei: 0.25 } }, rotor);
    const lamina = keep(new THREE.BoxGeometry(0.75, 0.36, 0.035));
    for (let i = 0; i < 11; i++) {
      const a = (i / 11) * Math.PI * 2;
      const piv = new THREE.Group();
      piv.position.set(Math.cos(a) * 0.95, 0, Math.sin(a) * 0.95);
      piv.rotation.y = -a;
      rotor.add(piv);
      const l = mesh(p, { geo: lamina, mat: { c: "#566089", m: 0.7, r: 0.4 }, edge: false }, piv);
      l.rotation.x = 0.6;
    }
  }

  // ----- portas
  {
    const lista: { s: number; z: number; tipo: "tb" | "mag" | "hdmi" | "sd" | "fone" }[] = [
      { s: -1, z: 1.1, tipo: "mag" },
      { s: -1, z: 2.3, tipo: "tb" },
      { s: -1, z: 3.5, tipo: "tb" },
      { s: -1, z: 4.6, tipo: "fone" },
      { s: 1, z: 1.4, tipo: "hdmi" },
      { s: 1, z: 2.9, tipo: "sd" },
      { s: 1, z: 4.2, tipo: "tb" },
    ];
    lista.forEach((it, i) => {
      const p = piece(`porta${i}`, "portas", V(it.s * 7.3, 0.45, it.z), { explode: V(it.s * 2.6, 1.0, 0) });
      const tb = it.tipo === "tb";
      mesh(p, { geo: rb(0.8, 0.28, 0.9, 0.05), mat: { c: "#1a1d2a", m: 0.7, r: 0.4 } });
      const largura = it.tipo === "sd" ? 0.7 : it.tipo === "hdmi" ? 0.72 : it.tipo === "mag" ? 0.6 : 0.52;
      const slot = mesh(p, {
        geo: bx(0.1, it.tipo === "fone" ? 0.14 : 0.1, largura),
        mat: tb ? { c: "#59c6ff", m: 0, r: 0.5, e: "#59c6ff", ei: 1.0 } : { c: "#07080d", m: 0.2, r: 0.6 },
        at: [it.s * 0.43, 0, 0],
        edge: false,
      });
      slot.userData.item = "portas";
      if (tb) {
        const miolo = mesh(p, { geo: bx(0.12, 0.06, 0.36), mat: { c: "#05060a", m: 0.2, r: 0.7 }, at: [it.s * 0.44, 0, 0], edge: false });
        miolo.userData.item = "portas";
      }
    });
  }

  for (const p of pieces)
    p.group.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.userData.piece = p.key;
        o.userData.item ??= p.item;
      }
    });
  root.updateMatrixWorld(true);

  const dispose = () => {
    root.traverse((o) => {
      const m = o as THREE.InstancedMesh;
      if (m.isInstancedMesh) m.dispose();
    });
    for (const d of disposables) d.dispose();
  };

  return { root, pieces, byKey, byItem, lid, lidBase, lidExplode: V(0, 1.4, -2.4), rotors, cells, dispose };
}
