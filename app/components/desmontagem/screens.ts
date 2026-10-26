import * as THREE from "three";
import { EMAIL } from "./content";

export type Fonts = { sans: string; mono: string };
export type Images = Record<string, HTMLImageElement>;
type Screen = { c: HTMLCanvasElement; x: CanvasRenderingContext2D; t: THREE.CanvasTexture };

export function mkCanvas(w: number, h: number): Screen {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return { c, x: c.getContext("2d") as CanvasRenderingContext2D, t };
}

const chips = ["Node.js", "NestJS", "TypeScript", "React", "Next.js", "Python", "Django", "C#/.NET", "PostgreSQL", "Redis", "Docker", "CI"];
const gallery = ["lp_starfit", "lp_conectalab", "lp_docctor1", "lp_docctor2"];
const phoneShots = ["jornada_inicio", "jornada_servicos", "jornada_atendimento", "jornada_faturas"];

/** Telas do notebook (1280x800) e do celular (540x1120), desenhadas em canvas e usadas como textura. */
export function createScreens(IM: Images, F: Fonts) {
  const LS = mkCanvas(1280, 800);
  const PS = mkCanvas(540, 1120);
  const sans = (w: number, s: number) => `${w} ${s}px ${F.sans}, sans-serif`;
  const mono = (w: number, s: number) => `${w} ${s}px ${F.mono}, monospace`;

  function rr(x: CanvasRenderingContext2D, a: number, b: number, w: number, h: number, r: number, fill?: string, stroke?: string) {
    x.beginPath();
    x.roundRect(a, b, w, h, r);
    if (fill) {
      x.fillStyle = fill;
      x.fill();
    }
    if (stroke) {
      x.strokeStyle = stroke;
      x.stroke();
    }
  }
  function cover(x: CanvasRenderingContext2D, img: HTMLImageElement | undefined, a: number, b: number, w: number, h: number, al = 1) {
    if (!img) return;
    const s = Math.max(w / img.width, h / img.height);
    const iw = w / s;
    const ih = h / s;
    x.globalAlpha = al;
    x.drawImage(img, (img.width - iw) / 2, (img.height - ih) / 2, iw, ih, a, b, w, h);
    x.globalAlpha = 1;
  }
  const im = (k: string | null) => (k ? IM[k] : undefined);
  const notch = (x: CanvasRenderingContext2D, W: number) => {
    x.fillStyle = "#000";
    x.beginPath();
    x.roundRect(W / 2 - 110, 0, 220, 38, [0, 0, 18, 18]);
    x.fill();
  };
  const trafficLights = (x: CanvasRenderingContext2D, W: number) => {
    rr(x, 0, 0, W, 54, 0, "#22221f");
    ["#ff5f57", "#febc2e", "#28c840"].forEach((c, k) => {
      x.fillStyle = c;
      x.beginPath();
      x.arc(34 + k * 28, 27, 8, 0, 7);
      x.fill();
    });
  };

  /** ch = capítulo, tm = tempo no capítulo, T = tempo total, sp = progresso (0..1) dentro do capítulo */
  function drawLaptop(ch: number, tm: number, T: number, sp: number) {
    const x = LS.x;
    const W = 1280;
    const H = 800;
    x.fillStyle = "#161613";
    x.fillRect(0, 0, W, H);
    x.textBaseline = "top";
    if (ch === 5 || ch === 2) {
      const list: [string | null, string][] =
        ch === 5
          ? [
              ["stockflow_site", "StockFlow · site publicado"],
              ["stockflow_actions", "StockFlow · CI verde no GitHub Actions"],
              ["creditflow_actions", "CreditFlow · CI verde no GitHub Actions"],
            ]
          : [
              [null, ""],
              ["leadflow_actions", "LeadFlow Engine · CI verde no GitHub Actions"],
            ];
      const n = list.length;
      const p = Math.min(n - 0.0001, sp * n);
      const i = Math.floor(p);
      const f = i === 0 ? 1 : Math.min(1, (p - i) * 7);
      const cu = list[i];
      const pv = list[Math.max(0, i - 1)];
      if (cu[0]) {
        cover(x, im(pv[0]) || im(cu[0]), 0, 0, W, H);
        cover(x, im(cu[0]), 0, 0, W, H, f);
        notch(x, W);
        LS.t.needsUpdate = true;
        return;
      }
    }
    if (ch === 4) {
      const n = gallery.length;
      const p = Math.min(n - 0.0001, sp * n);
      const i = Math.floor(p);
      const f = i === 0 ? 1 : Math.min(1, (p - i) * 7);
      trafficLights(x, W);
      cover(x, im(gallery[Math.max(0, i - 1)]), 0, 54, W, H - 54);
      cover(x, im(gallery[i]), 0, 54, W, H - 54, f);
      LS.t.needsUpdate = true;
      return;
    }
    trafficLights(x, W);
    x.font = mono(500, 22);
    if (ch === 0) {
      const L: [string, string][] = [
        ["$ whoami", "#7ee8a8"],
        ["genesis-melo", "#f2efe8"],
        ["$ cat role.txt", "#7ee8a8"],
        ["Desenvolvedor Backend e Full Stack Júnior", "#ffcab0"],
        ["$ ls stack/", "#7ee8a8"],
        ["node  nest  react  python  django  dotnet  postgres  docker", "#a9a69c"],
      ];
      const shown = Math.floor(tm * 22);
      let n = 0;
      L.forEach((l, i) => {
        x.fillStyle = l[1];
        x.fillText(l[0].slice(0, Math.max(0, shown - n)), 60, 110 + i * 58);
        n += l[0].length + 2;
      });
    }
    if (ch === 1) {
      x.font = sans(600, 28);
      chips.forEach((c, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const px = 60 + col * 290;
        const py = 130 + row * 190;
        const a = Math.min(1, Math.max(0, tm * 3 - i * 0.18));
        x.globalAlpha = a;
        rr(x, px, py, 262, 130, 22, "#232320", "#3a3a36");
        x.fillStyle = i % 3 === 0 ? "#7ee8a8" : "#f2efe8";
        x.fillText(c, px + 26, py + 48);
        x.globalAlpha = 1;
      });
    }
    if (ch === 2) {
      x.fillStyle = "#f2efe8";
      x.font = sans(700, 40);
      x.fillText("LeadFlow · fila de leads", 60, 100);
      ["Vendedor A", "Vendedor B", "Vendedor C"].forEach((v, i) => {
        const w = Math.min(1, tm * 1.4) * (560 + Math.sin(T * 3 + i) * 18);
        x.fillStyle = "#a9a69c";
        x.font = mono(500, 22);
        x.fillText(v, 60, 220 + i * 110);
        rr(x, 260, 212 + i * 110, 680, 40, 20, "#262622");
        rr(x, 260, 212 + i * 110, w, 40, 20, "#7ee8a8");
      });
      x.fillStyle = "#ffcab0";
      x.font = sans(700, 54);
      x.fillText("20 → 2", 60, 590);
      x.fillStyle = "#a9a69c";
      x.font = mono(500, 22);
      x.fillText("diferença média entre vendedores (teste local)", 60, 670);
    }
    if (ch === 3) {
      const M: [string, number][] = [
        ["Oi! Preciso da 2ª via da fatura.", 0],
        ["Claro! Já localizei o débito do seu imóvel.", 1],
        ["Quero abrir uma solicitação.", 0],
        ["Já existe uma em andamento. Posso te avisar o status.", 1],
      ];
      M.forEach((m, i) => {
        const a = Math.min(1, Math.max(0, tm * 2.4 - i * 0.5));
        x.globalAlpha = a;
        const w = 700;
        const xx = m[1] ? W - w - 60 : 60;
        rr(x, xx, 120 + i * 150, w, 110, 26, m[1] ? "#1f3a2c" : "#262622");
        x.fillStyle = "#f2efe8";
        x.font = sans(500, 26);
        x.fillText(m[0], xx + 28, 160 + i * 150);
        x.globalAlpha = 1;
      });
    }
    if (ch === 5) {
      x.fillStyle = "#f2efe8";
      x.font = sans(700, 40);
      x.fillText("StockFlow", 60, 96);
      [
        ["Produtos", "128"],
        ["Movimentações", "1.9k"],
        ["Solicitações", "14"],
        ["NF-e", "importadas"],
      ].forEach((c, i) => {
        const px = 60 + i * 290;
        const a = Math.min(1, Math.max(0, tm * 3 - i * 0.2));
        x.globalAlpha = a;
        rr(x, px, 190, 262, 150, 22, "#232320", "#3a3a36");
        x.fillStyle = "#a9a69c";
        x.font = mono(500, 20);
        x.fillText(c[0], px + 24, 214);
        x.fillStyle = "#7ee8a8";
        x.font = sans(700, 44);
        x.fillText(c[1], px + 24, 262);
        x.globalAlpha = 1;
      });
      x.fillStyle = "#ffcab0";
      x.font = sans(700, 54);
      x.fillText("67 testes · CI verde", 60, 440);
      x.fillStyle = "#a9a69c";
      x.font = mono(500, 22);
      x.fillText("+ CreditFlow (.NET 10) e Finance Control (Node.js)", 60, 520);
      x.fillText("valores ilustrativos nos cartões acima", 60, 600);
    }
    if (ch === 6) {
      const E = [
        ["2026 — atual", "Estagiário Full Stack · SAAE Juazeiro"],
        ["2025 — atual", "Projetos próprios e freelance"],
        ["2026", "Tráfego pago · Nova Lab"],
        ["2024 — 2025", "Consultor de vendas"],
      ];
      E.forEach((e, i) => {
        const a = Math.min(1, Math.max(0, sp * 4.6 - i + 1));
        x.globalAlpha = a;
        x.fillStyle = "#7ee8a8";
        x.beginPath();
        x.arc(90, 160 + i * 150, 12, 0, 7);
        x.fill();
        x.fillStyle = "#3a3a36";
        x.fillRect(88, 180 + i * 150, 4, 110);
        x.fillStyle = "#a9a69c";
        x.font = mono(500, 22);
        x.fillText(e[0], 130, 136 + i * 150);
        x.fillStyle = "#f2efe8";
        x.font = sans(600, 34);
        x.fillText(e[1], 130, 170 + i * 150);
        x.globalAlpha = 1;
      });
    }
    if (ch === 7) {
      x.fillStyle = "#7ee8a8";
      x.font = sans(700, 96);
      x.fillText("Vamos", 60, 170);
      x.fillStyle = "#f2efe8";
      x.fillText("conversar?", 60, 280);
      x.font = mono(500, 26);
      x.fillStyle = "#a9a69c";
      x.fillText(EMAIL, 64, 430);
      x.fillText("linkedin.com/in/genesis-melo", 64, 480);
      x.fillText("github.com/7Genesis", 64, 530);
    }
    notch(x, W);
    LS.t.needsUpdate = true;
  }

  function drawPhone(ch: number, _tm: number, sp: number) {
    const x = PS.x;
    const W = 540;
    const H = 1120;
    x.fillStyle = "#10100e";
    x.fillRect(0, 0, W, H);
    x.textBaseline = "top";
    if (ch === 3) {
      const n = phoneShots.length;
      const p = Math.min(n - 0.0001, sp * n);
      const i = Math.floor(p);
      const f = i === 0 ? 1 : Math.min(1, (p - i) * 7);
      cover(x, im(phoneShots[Math.max(0, i - 1)]), 0, 0, W, H);
      cover(x, im(phoneShots[i]), 0, 0, W, H, f);
    } else {
      x.fillStyle = "#f2efe8";
      x.font = sans(700, 38);
      x.fillText("Google Play", 40, 110);
      rr(x, 40, 200, 160, 160, 36, "#7ee8a8");
      x.fillStyle = "#0c1f15";
      x.font = sans(700, 70);
      x.fillText("S", 96, 240);
      x.fillStyle = "#f2efe8";
      x.font = sans(700, 34);
      x.fillText("App do cidadão", 220, 230);
      x.fillStyle = "#a9a69c";
      x.font = sans(500, 22);
      x.fillText("React Native · TypeScript", 220, 282);
      x.fillStyle = "#ffcab0";
      x.font = sans(600, 26);
      x.fillText("185 testes automatizados", 40, 430);
    }
    PS.t.needsUpdate = true;
  }

  return { LS, PS, drawLaptop, drawPhone };
}
