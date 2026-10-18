// Personagem em silhueta noturna (estilo indie: Limbo/NitW) — formas orgânicas em paths,
// contorno de luar (#c7d2ff) no lado da lua. viewBox: 0 0 120 240 (pés em y≈210).

export type Pose = "stand" | "walk" | "fly" | "sit" | "ledge";

const BODY = "#201a30";
const RIM = "#c7d2ff";

// cabeça + cabelo + pescoço (silhueta única)
function Head() {
  return (
    <g fill={BODY}>
      <path d="M60 6 Q74 6 75.5 21 Q84 26 82 34 Q79 30 76 30 L75 36 Q74 44 66 46.5 Q58 48 51.5 45 Q45 41.5 45 32 L45 24 Q45 6 60 6 Z" />
      <path d="M45 18 Q43 8 52 5 Q60 2 68 6 Q77 10 76 20 Q72 12 63 11 Q52 10 49 18 Z" />
      <rect x="55.5" y="44" width="9" height="11" rx="3" />
      {/* contorno de luar no topo da cabeça */}
      <path d="M50 9 Q60 2 72 8 Q79 13 78 22" fill="none" stroke={RIM} strokeWidth="2.4" opacity="0.9" strokeLinecap="round" />
    </g>
  );
}

// tronco (camiseta) com leve cintura
function Torso() {
  return (
    <g>
      <path
        d="M41 54 Q47 50 60 50 Q73 50 79 54 Q84 58 84.5 66 L84 96 Q84 104 78 108 L80 120 Q80 126 74 126 L46 126 Q40 126 40 120 L42 108 Q36 104 36 96 L35.5 66 Q36 58 41 54 Z"
        fill={BODY}
      />
      {/* rim light no ombro/lado direito */}
      <path d="M79 54 Q84 58 84.5 66 L84 96 Q84 104 78 108" fill="none" stroke={RIM} strokeWidth="2.2" opacity="0.7" strokeLinecap="round" />
    </g>
  );
}

// braço pendente (lado sx: 37 = esq, 83 = dir)
function ArmDown({ sx, rim = false }: { sx: number; rim?: boolean }) {
  return (
    <g fill="none" strokeLinecap="round">
      <path d={`M${sx} 58 Q${sx - 4} 72 ${sx - 2} 90 Q${sx - 1} 102 ${sx + 2} 112`} stroke={BODY} strokeWidth="9" />
      <circle cx={sx + 2.5} cy="115" r="5.5" fill={BODY} />
      {rim && (
        <path d={`M${sx + 4} 60 Q${sx + 1} 76 ${sx + 2.5} 92`} stroke={RIM} strokeWidth="2" opacity="0.6" />
      )}
    </g>
  );
}

// perna reta (quadril hx, desce até ~y 206)
function Leg({ hx, swing }: { hx: number; swing?: "a" | "b" }) {
  return (
    <g className={swing ? `leg-${swing}` : undefined}>
      <path d={`M${hx} 124 Q${hx - 1} 160 ${hx} 200`} fill="none" stroke={BODY} strokeWidth="11" strokeLinecap="round" />
      <ellipse cx={hx + 5} cy="205" rx="10" ry="5" fill={BODY} />
    </g>
  );
}

function StandFigure({ mirror = false }: { mirror?: boolean }) {
  return (
    <g transform={mirror ? "translate(120 0) scale(-1 1)" : undefined}>
      <g className="char-bob">
        <ArmDown sx={37} />
        <Leg hx={51} />
        <Leg hx={69} />
        <Torso />
        <Head />
        <ArmDown sx={83} rim />
      </g>
    </g>
  );
}

function WalkFigure({ mirror = false }: { mirror?: boolean }) {
  return (
    <g transform={mirror ? "translate(120 0) scale(-1 1)" : undefined}>
      <g className="char-bob-fast">
        <g className="arm-a"><ArmDown sx={37} /></g>
        <Leg hx={51} swing="a" />
        <Leg hx={69} swing="b" />
        <Torso />
        <Head />
        <g className="arm-b"><ArmDown sx={83} rim /></g>
      </g>
    </g>
  );
}

function FlyFigure() {
  // espelhado + rotacionado: voa para a direita, braço estendido à frente
  return (
    <g transform="translate(120 0) scale(-1 1)">
      <g transform="rotate(68 60 120)">
        <g className="char-bob">
          <path d="M42 58 Q54 48 70 40 Q84 33 96 28" fill="none" stroke={BODY} strokeWidth="9" strokeLinecap="round" />
          <circle cx="99" cy="27" r="6" fill={BODY} />
          <path d="M84 36 Q64 46 46 56" fill="none" stroke={RIM} strokeWidth="2.2" opacity="0.7" strokeLinecap="round" />
          <Leg hx={51} />
          <g transform="rotate(10 69 124)"><Leg hx={69} /></g>
          <Torso />
          <Head />
          <path d="M38 60 Q34 76 37 96" fill="none" stroke={BODY} strokeWidth="8" strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
}

// coxa à frente + canela (dangling animada opcional). Corpo "senta" em y≈126.
function SitLegs({ dangle = false }: { dangle?: boolean }) {
  return (
    <g>
      {([48, 66] as const).map((hx, i) => (
        <g key={hx}>
          <path d={`M${hx} 120 Q${hx + 20} 128 ${hx + 30} 130`} fill="none" stroke={BODY} strokeWidth="11" strokeLinecap="round" />
          <g className={dangle ? (i === 0 ? "dangle-a" : "dangle-b") : undefined}>
            <path d={`M${hx + 30} 130 Q${hx + 32} 152 ${hx + 31} 172`} fill="none" stroke={BODY} strokeWidth="10" strokeLinecap="round" />
            <ellipse cx={hx + 36} cy="176" rx="9" ry="4.5" fill={BODY} />
          </g>
        </g>
      ))}
    </g>
  );
}

function SitFigure({ dangle = false, typing = false }: { dangle?: boolean; typing?: boolean }) {
  return (
    <g>
      <g transform={dangle ? "rotate(-6 60 120)" : "rotate(3 60 120)"}>
        <Torso />
        <Head />
        {typing ? (
          <>
            <g className="type-a">
              <path d="M78 62 Q90 70 98 80" fill="none" stroke={BODY} strokeWidth="8.5" strokeLinecap="round" />
              <circle cx="100" cy="82" r="5" fill={BODY} />
            </g>
            <g className="type-b">
              <path d="M72 64 Q84 74 94 84" fill="none" stroke={BODY} strokeWidth="8.5" strokeLinecap="round" />
              <circle cx="96" cy="86" r="5" fill={BODY} />
            </g>
            <path d="M80 60 Q90 68 98 78" fill="none" stroke={RIM} strokeWidth="2" opacity="0.6" strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d="M42 62 Q34 84 40 108 Q43 118 50 122" fill="none" stroke={BODY} strokeWidth="9" strokeLinecap="round" />
            <path d="M78 62 Q86 84 82 106 Q80 116 74 122" fill="none" stroke={BODY} strokeWidth="9" strokeLinecap="round" />
            <path d="M80 64 Q87 84 83 104" fill="none" stroke={RIM} strokeWidth="2" opacity="0.65" strokeLinecap="round" />
          </>
        )}
      </g>
      <SitLegs dangle={dangle} />
    </g>
  );
}

export default function Character({ pose, mirror = false }: { pose: Pose; mirror?: boolean }) {
  return (
    <g>
      {/* spotlight: separa a silhueta do fundo escuro */}
      <ellipse cx="62" cy="118" rx="100" ry="130" fill="#b9c6ff" opacity="0.09" />
      <ellipse cx="62" cy="118" rx="58" ry="82" fill="#b9c6ff" opacity="0.07" />
      {pose === "stand" && <StandFigure mirror={mirror} />}
      {pose === "walk" && <WalkFigure mirror={mirror} />}
      {pose === "fly" && <FlyFigure />}
      {pose === "sit" && <SitFigure typing />}
      {pose === "ledge" && <SitFigure dangle />}
    </g>
  );
}
