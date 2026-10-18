// Engine geométrica das cenas — roda em build-time (gera JSON) e serve de fonte única de verdade.

export function mulberry32(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const PALETTES = {
  night: {
    sky: ["#2b1556", "#0d0820"],
    ground: "#0a0716",
    moon: { cx: 1160, cy: 118, r: 44, halo: 92, fill: "#efeaff", glow: "#7c3aed" },
    layers: [
      { y: 560, minH: 70, maxH: 200, color: "#1e1544", p: 0.16 },
      { y: 650, minH: 110, maxH: 280, color: "#271c58", p: 0.24 },
      { y: 780, minH: 160, maxH: 380, color: "#312273", p: 0.3 },
    ],
    wins: ["#ffcf7a"],
  },
  street: {
    sky: ["#221452", "#0b071d"],
    ground: "#090614",
    moon: { cx: 1160, cy: 118, r: 44, halo: 92, fill: "#efeaff", glow: "#f59e0b" },
    layers: [
      { y: 545, minH: 70, maxH: 210, color: "#1b1240", p: 0.16 },
      { y: 645, minH: 120, maxH: 300, color: "#251a55", p: 0.24 },
      { y: 780, minH: 180, maxH: 400, color: "#2f2168", p: 0.3 },
    ],
    wins: ["#ffcf7a", "#ffb356"],
  },
  clouds: {
    sky: ["#33175f", "#100a26"],
    ground: "#0b0718",
    moon: { cx: 1160, cy: 118, r: 44, halo: 92, fill: "#efeaff", glow: "#8b5cf6" },
    layers: [
      { y: 570, minH: 60, maxH: 180, color: "#201349", p: 0.14 },
      { y: 660, minH: 100, maxH: 260, color: "#2a1d60", p: 0.22 },
      { y: 790, minH: 150, maxH: 350, color: "#342675", p: 0.28 },
    ],
    wins: ["#ffd6a5"],
  },
  midnight: {
    sky: ["#0f1c44", "#060814"],
    ground: "#05070f",
    moon: { cx: 1160, cy: 118, r: 44, halo: 92, fill: "#e8f0ff", glow: "#3b82f6" },
    layers: [
      { y: 555, minH: 70, maxH: 190, color: "#101a3e", p: 0.14 },
      { y: 650, minH: 110, maxH: 270, color: "#15224e", p: 0.22 },
      { y: 785, minH: 160, maxH: 370, color: "#1c2c63", p: 0.28 },
    ],
    wins: ["#9ec7ff", "#ffd47e"],
  },
  neon: {
    sky: ["#3a1070", "#150a30"],
    ground: "#0c0619",
    moon: { cx: 1160, cy: 118, r: 44, halo: 92, fill: "#f5e9ff", glow: "#d946ef" },
    layers: [
      { y: 560, minH: 70, maxH: 200, color: "#241250", p: 0.2 },
      { y: 655, minH: 110, maxH: 280, color: "#301a6e", p: 0.28 },
      { y: 785, minH: 170, maxH: 390, color: "#3c228a", p: 0.34 },
    ],
    wins: ["#ff8ad8", "#8ad8ff", "#ffd47e"],
  },
  sunset: {
    sky: ["#ff8a3d", "#7a2a83", "#160b34"],
    ground: "#120a26",
    moon: { cx: 1130, cy: 440, r: 62, halo: 120, fill: "#ffd9a0", glow: "#fb923c" },
    layers: [
      { y: 565, minH: 70, maxH: 190, color: "#3d1a4e", p: 0.2 },
      { y: 660, minH: 110, maxH: 280, color: "#4b1f56", p: 0.28 },
      { y: 790, minH: 160, maxH: 380, color: "#331544", p: 0.34 },
    ],
    wins: ["#ffd47e"],
  },
};

const r1 = (v) => Math.round(v * 10) / 10;

export function buildScene(variant, seed) {
  const rnd = mulberry32(seed);
  const p = PALETTES[variant];
  const starCount = variant === "neon" ? 110 : 80;
  const stars = Array.from({ length: starCount }, () => [
    r1(rnd() * 1440),
    r1(rnd() * 470),
    r1(0.7 + rnd() * 1.4),
    r1(0.25 + rnd() * 0.75),
    r1(2.4 + rnd() * 2.4),
    r1(rnd() * 4),
  ]);
  const skyline = [];
  const windows = [];
  p.layers.forEach((layer, li) => {
    let x = -60;
    while (x < 1520) {
      const w = 44 + rnd() * 58;
      const h = layer.minH + rnd() * (layer.maxH - layer.minH);
      const y = layer.y - h;
      const antenna = rnd() < 0.3 ? r1(12 + rnd() * 18) : 0;
      skyline.push({ x: r1(x), y: r1(y), w: r1(w), h: r1(h), c: li, a: antenna });
      const cols = Math.max(2, Math.floor(w / 18));
      const rows = Math.max(3, Math.floor(h / 30));
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          if (rnd() < layer.p) {
            windows.push([
              r1(x + 7 + c * ((w - 12) / cols)),
              r1(y + 9 + r * ((h - 16) / rows)),
              Math.floor(rnd() * p.wins.length),
              r1(0.45 + rnd() * 0.5),
            ]);
          }
        }
      }
      x += w + 6 + rnd() * 16;
    }
  });
  return { sky: p.sky, ground: p.ground, moon: p.moon, wins: p.wins, layers: p.layers.map(l => l.color), stars, skyline, windows };
}

export function buildRoomMinis() {
  const rnd = mulberry32(99);
  return Array.from({ length: 9 }, (_, i) => {
    const bw = 26 + rnd() * 30;
    const bh = 60 + rnd() * 140;
    return [r1(964 + i * 42), r1(406 - bh), r1(bw), r1(bh)];
  });
}
