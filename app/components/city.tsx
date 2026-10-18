// Cena noturna geométrica em SVG — dados pré-gerados em city-data.json (determinístico,
// idêntico no SSR e no cliente: sem hydration mismatch). Para alterar as cenas:
// edite city-engine.mjs e rode `node scripts/gen-city.mjs`.
import data from "./city-data.json";
import Character from "./character";

export type CityVariant =
  | "night"
  | "street"
  | "clouds"
  | "midnight"
  | "neon"
  | "sunset"
  | "room";

interface SceneData {
  sky: string[];
  ground: string;
  moon: { cx: number; cy: number; r: number; halo: number; fill: string; glow: string };
  wins: string[];
  layers: string[];
  stars: [number, number, number, number, number, number][];
  skyline: { x: number; y: number; w: number; h: number; c: number; a: number }[];
  windows: [number, number, number, number][];
}

const SCENES = data as unknown as Record<string, SceneData> & { __roomMinis: number[][] };

function SkyGradient({ id, stops }: { id: string; stops: string[] }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={stops[0]} />
      {stops.length === 3 ? (
        <>
          <stop offset="52%" stopColor={stops[1]} />
          <stop offset="100%" stopColor={stops[2]} />
        </>
      ) : (
        <stop offset="100%" stopColor={stops[1]} />
      )}
    </linearGradient>
  );
}

function Lamps() {
  return (
    <g stroke="#0b0817" strokeWidth={5}>
      {[300, 760, 1180].map((x) => (
        <g key={x}>
          <circle cx={x} cy={470} r={90} fill="#ffb356" opacity={0.09} stroke="none" />
          <line x1={x} y1={470} x2={x} y2={790} />
          <circle cx={x} cy={470} r={9} fill="#ffd8a0" stroke="none" />
        </g>
      ))}
    </g>
  );
}

function Hill() {
  return <ellipse cx={480} cy={900} rx={760} ry={180} fill="#08060f" />;
}

function CloudLayer() {
  return (
    <g fill="#efe6ff">
      {[
        { x: 180, y: 120, o: 0.1, s: 1 },
        { x: 620, y: 80, o: 0.14, s: 1.4 },
        { x: 1050, y: 160, o: 0.12, s: 1.1 },
      ].map((c, i) => (
        <g key={i} className="drift" style={{ animationDelay: `${i * 1.7}s` }} opacity={c.o}>
          <ellipse cx={c.x} cy={c.y} rx={90 * c.s} ry={22 * c.s} />
          <ellipse cx={c.x + 55 * c.s} cy={c.y - 12 * c.s} rx={60 * c.s} ry={18 * c.s} />
          <ellipse cx={c.x - 60 * c.s} cy={c.y - 6 * c.s} rx={55 * c.s} ry={16 * c.s} />
        </g>
      ))}
    </g>
  );
}

function Room() {
  const minis = SCENES.__roomMinis;
  return (
    <g>
      <rect x="0" y="0" width="1440" height="810" fill="url(#sky-room)" />
      {/* janela com mini-cidade */}
      <g>
        <rect x="950" y="90" width="400" height="330" fill="url(#sky-roomwin)" stroke="#0b0e22" strokeWidth={14} />
        {minis.map((b, i) => (
          <rect key={i} x={b[0]} y={b[1]} width={b[2]} height={b[3]} fill="#1a2452" />
        ))}
        <circle cx={1290} cy={130} r={26} fill="#e8f0ff" opacity={0.9} />
        <line x1="1150" y1="90" x2="1150" y2="420" stroke="#0b0e22" strokeWidth={10} />
      </g>
      {/* pôster */}
      <g>
        <rect x="150" y="120" width="190" height="250" fill="#10163a" stroke="#2a356e" strokeWidth={6} />
        <text x="245" y="290" textAnchor="middle" fontFamily="inherit" fontWeight={900} fontSize="104" fill="#b9c6ff">
          GM
        </text>
      </g>
      {/* piso */}
      <polygon points="0,620 1440,620 1440,810 0,810" fill="#141127" />
      {/* mesa */}
      <g>
        <rect x="430" y="470" width="560" height="18" fill="#0d0a1e" />
        <rect x="452" y="488" width="16" height="150" fill="#0d0a1e" />
        <rect x="952" y="488" width="16" height="150" fill="#0d0a1e" />
        <g>
          <rect x="480" y="330" width="210" height="130" rx="6" fill="#070a18" stroke="#1f2a5c" strokeWidth={5} />
          <rect x="490" y="342" width="120" height="7" fill="#7dd3fc" opacity={0.8} />
          <rect x="490" y="358" width="160" height="7" fill="#7dd3fc" opacity={0.45} />
          <rect x="490" y="374" width="95" height="7" fill="#ff8ad8" opacity={0.55} />
          <rect x="490" y="390" width="140" height="7" fill="#7dd3fc" opacity={0.3} />
          <rect x="730" y="330" width="210" height="130" rx="6" fill="#070a18" stroke="#1f2a5c" strokeWidth={5} />
          <rect x="740" y="342" width="150" height="7" fill="#b9c6ff" opacity={0.8} />
          <rect x="740" y="358" width="100" height="7" fill="#b9c6ff" opacity={0.4} />
          <rect x="740" y="374" width="165" height="7" fill="#ffd47e" opacity={0.5} />
          <rect x="740" y="390" width="80" height="7" fill="#b9c6ff" opacity={0.3} />
          <rect x="700" y="452" width="26" height="20" fill="#0d0a1e" />
        </g>
        <rect x="600" y="452" width="150" height="12" rx="3" fill="#7dd3fc" opacity={0.35} />
        <rect x="880" y="444" width="22" height="26" rx="4" fill="#b9c6ff" opacity={0.7} />
      </g>
      {/* cadeira */}
      <g fill="#0d0a1e">
        <rect x="640" y="520" width="130" height="120" rx="14" />
        <rect x="694" y="640" width="14" height="60" />
      </g>
      {/* dev sentado digitando */}
      <g transform="translate(632 372) scale(1.05)">
        <Character pose="sit" />
      </g>
    </g>
  );
}

export default function City({
  variant,
  className = "",
}: {
  variant: CityVariant;
  className?: string;
}) {
  const isRoom = variant === "room";
  const scene = isRoom ? null : SCENES[variant];

  return (
    <svg
      viewBox="0 0 1440 810"
      preserveAspectRatio="xMidYMid slice"
      className={`h-full w-full ${className}`}
      aria-hidden="true"
    >
      <defs>
        {scene && <SkyGradient id={`sky-${variant}`} stops={scene.sky} />}
        <linearGradient id="sky-room" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b2350" />
          <stop offset="100%" stopColor="#0b0e22" />
        </linearGradient>
        <linearGradient id="sky-roomwin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10163a" />
          <stop offset="100%" stopColor="#070a18" />
        </linearGradient>
      </defs>

      {isRoom ? (
        <Room />
      ) : (
        scene && (
          <g>
            <rect x="0" y="0" width="1440" height="810" fill={`url(#sky-${variant})`} />
            <circle cx={scene.moon.cx} cy={scene.moon.cy} r={scene.moon.halo} fill={scene.moon.glow} opacity={0.09} />
            <circle cx={scene.moon.cx} cy={scene.moon.cy} r={scene.moon.r} fill={scene.moon.fill} opacity={0.95} />
            {variant !== "sunset" && (
              <circle
                cx={scene.moon.cx + scene.moon.r * 0.35}
                cy={scene.moon.cy - scene.moon.r * 0.2}
                r={scene.moon.r * 0.92}
                fill={scene.sky[scene.sky.length - 1]}
                opacity={0.55}
              />
            )}
            <g>
              {scene.stars.map((s, i) => (
                <circle
                  key={i}
                  cx={s[0]}
                  cy={s[1]}
                  r={s[2]}
                  fill="#ffffff"
                  opacity={s[3]}
                  className="tw"
                  style={{ ["--twd" as never]: `${s[4]}s`, ["--twdel" as never]: `${s[5]}s` }}
                />
              ))}
            </g>
            {variant === "clouds" && <CloudLayer />}
            <g>
              {scene.skyline.map((b, i) => (
                <g key={i}>
                  <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={scene.layers[b.c]} />
                  {b.a > 0 && (
                    <line
                      x1={b.x + b.w / 2}
                      y1={b.y}
                      x2={b.x + b.w / 2}
                      y2={b.y - b.a}
                      stroke={scene.layers[b.c]}
                      strokeWidth={2.4}
                    />
                  )}
                </g>
              ))}
              {scene.windows.map((w, i) => (
                <rect key={i} x={w[0]} y={w[1]} width={5} height={8} fill={scene.wins[w[2]]} opacity={w[3]} />
              ))}
            </g>
            {(variant === "night" || variant === "sunset" || variant === "clouds" || variant === "neon") && <Hill />}
            {variant === "street" && <Lamps />}
            {variant === "sunset" && (
              <g>
                <rect x="980" y="575" width="290" height="235" fill="#1a0e30" />
                <rect x="980" y="575" width="290" height="6" fill="#2b1a4a" />
              </g>
            )}
            <rect x="0" y={760} width="1440" height="50" fill={scene.ground} />
            {variant === "night" && (
              <g transform="translate(360 528) scale(0.87)"><Character pose="stand" /></g>
            )}
            {variant === "street" && (
              <g transform="translate(590 545) scale(0.94)"><Character pose="walk" /></g>
            )}
            {variant === "clouds" && (
              <g className="drift"><g transform="translate(400 180)"><Character pose="fly" /></g></g>
            )}
            {variant === "midnight" && (
              <g transform="translate(280 545) scale(0.94)"><Character pose="walk" /></g>
            )}
            {variant === "neon" && (
              <g transform="translate(1060 558) scale(0.92)"><Character pose="stand" mirror /></g>
            )}
            {variant === "sunset" && (
              <g transform="translate(1030 435) scale(0.9)"><Character pose="ledge" /></g>
            )}
          </g>
        )
      )}
    </svg>
  );
}
