/* ============================================================
   SPLASH POKÉ BALL — the loading screen opens on a Poké Ball that
   wobbles, then pops open on the "EA" monogram inside and lets
   Togepi and Jigglypuff out onto the line beneath it. It closes and
   fades away, leaving the monogram. They land just as the splash fades, and hatch at
   the bottom of the page a moment later (see Mascots.tsx)
   One 1.8s timeline, matching the loading screen's length, written
   as CSS keyframes so every part runs on the same clock
   ============================================================ */

import { useReducedMotion } from "framer-motion";
import { SHAPES } from "./particles";

const T = 1.8;
const BALL = 64;
const LINE_W = 220;
/** Where each Pokémon lands: beside the ball, standing on the line */
const LAND_X = 84;
const LAND_Y = 23;

/** Seconds into the timeline → keyframe percentage */
const k = (s: number) => `${((s / T) * 100).toFixed(2)}%`;

const POKEMON = [
  { id: "togepi", src: "/images/togepi/togepi.png", w: 46, h: 48, side: 1, out: 1.02 },
  { id: "jigglypuff", src: "/images/jigglypuff/jigglypuff.png", w: 50, h: 50, side: -1, out: 1.07 },
] as const;

const FLOATERS = [
  { id: "note", html: SHAPES.note(14, "#E2546F"), x: -LAND_X - 18, dx: -10 },
  { id: "sparkle", html: SHAPES.sparkle(12), x: LAND_X + 16, dx: 8 },
] as const;

/* Out of the ball in an arc, down onto the line with a squash, then a happy hop together */
const pokemonKeyframes = (id: string, side: number, t0: number) => {
  const at = (x: number, y: number, s = 1) => `transform: translate(${x}px, ${y}px) scale(${s})`;
  return `
  @keyframes spb-fly-${id} {
    0%, ${k(t0)} { opacity: 0; ${at(0, 0, 0.2)}; animation-timing-function: ease-out; }
    ${k(t0 + 0.04)} { opacity: 1; }
    ${k(t0 + 0.12)} { ${at(side * LAND_X * 0.6, -44)}; animation-timing-function: ease-in; }
    ${k(t0 + 0.26)}, ${k(1.5)} { ${at(side * LAND_X, LAND_Y)}; animation-timing-function: ease-out; }
    ${k(1.58)} { ${at(side * LAND_X, LAND_Y - 12)}; animation-timing-function: ease-in; }
    ${k(1.66)}, 100% { opacity: 1; ${at(side * LAND_X, LAND_Y)}; }
  }
  @keyframes spb-squash-${id} {
    0%, ${k(t0 + 0.25)} { transform: scaleY(1); }
    ${k(t0 + 0.28)} { transform: scaleY(0.82); }
    ${k(t0 + 0.35)}, ${k(1.66)} { transform: scaleY(1); }
    ${k(1.69)} { transform: scaleY(0.9); }
    ${k(1.73)}, 100% { transform: scaleY(1); }
  }`;
};

const CSS = `
  .spb-run { animation-duration: ${T}s; animation-fill-mode: both; animation-timing-function: ease-in-out; }
  @keyframes spb-monogram {
    0%, ${k(0.96)} { opacity: 0; }
    ${k(0.97)}, 100% { opacity: 1; }
  }
  @keyframes spb-ball {
    0%, ${k(1.4)} { opacity: 1; }
    ${k(1.5)}, 100% { opacity: 0; }
  }
  @keyframes spb-wobble {
    0%, ${k(0.55)} { transform: rotate(0deg); }
    ${k(0.65)} { transform: rotate(-14deg); }
    ${k(0.75)} { transform: rotate(12deg); }
    ${k(0.85)} { transform: rotate(-8deg); }
    ${k(0.95)}, 100% { transform: rotate(0deg); }
  }
  @keyframes spb-lid {
    0%, ${k(0.98)} { transform: rotate(0deg); animation-timing-function: ease-out; }
    ${k(1.08)}, ${k(1.3)} { transform: rotate(-40deg); }
    ${k(1.38)}, 100% { transform: rotate(0deg); }
  }
  @keyframes spb-base {
    0%, ${k(0.98)} { transform: rotate(0deg); animation-timing-function: ease-out; }
    ${k(1.08)}, ${k(1.3)} { transform: rotate(32deg); }
    ${k(1.38)}, 100% { transform: rotate(0deg); }
  }
  @keyframes spb-flash {
    0%, ${k(1.0)} { opacity: 0; transform: scale(0.2); animation-timing-function: ease-out; }
    ${k(1.06)} { opacity: 0.95; transform: scale(1.6); }
    ${k(1.28)}, 100% { opacity: 0; transform: scale(2.8); }
  }
  @keyframes spb-line {
    0%, ${k(1.02)} { width: 0; animation-timing-function: ease-out; }
    ${k(1.3)}, 100% { width: ${LINE_W}px; }
  }
  ${FLOATERS.map(
    (f) => `
  @keyframes spb-${f.id} {
    0%, ${k(1.5)} { opacity: 0; transform: translate(${f.x}px, 0); animation-timing-function: ease-out; }
    ${k(1.6)} { opacity: 1; transform: translate(${f.x + f.dx * 0.5}px, -12px); }
    100% { opacity: 0; transform: translate(${f.x + f.dx}px, -26px); }
  }`,
  ).join("")}
  ${POKEMON.map((p) => pokemonKeyframes(p.id, p.side, p.out)).join("")}
`;

function Monogram() {
  return (
    <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#C4622D" }}>
      <span className="font-display text-white font-semibold text-2xl">EA</span>
    </div>
  );
}

function PokeBall() {
  return (
    <svg viewBox="0 0 64 64" width={BALL} height={BALL} className="block overflow-visible">
      {/* Both halves swing apart on a hinge at the left, like a clamshell, showing the monogram inside */}
      <g className="spb-run" style={{ animationName: "spb-base", transformBox: "fill-box", transformOrigin: "2px 0px" }}>
        <path d="M0,32 A32,32 0 0 0 64,32 Z" fill="#FAF7F2" />
        <rect x="0" y="32" width="64" height="3" fill="#1C1917" />
      </g>
      <g className="spb-run" style={{ animationName: "spb-lid", transformBox: "fill-box", transformOrigin: "2px 32px" }}>
        <path d="M0,32 A32,32 0 0 1 64,32 Z" fill="#C4622D" />
        <rect x="0" y="29" width="64" height="3" fill="#1C1917" />
        <circle cx="32" cy="32" r="9.5" fill="#1C1917" />
        <circle cx="32" cy="32" r="5.5" fill="#FAF7F2" />
      </g>
    </svg>
  );
}

/** A Pokémon standing on the line beside the ball (`style` places it at the ball's centre to start) */
const pokemonBox = (p: (typeof POKEMON)[number]) => ({ width: p.w, height: p.h, left: "50%", top: "50%", marginLeft: -p.w / 2, marginTop: -p.h / 2 });
const pokemonImg = (p: (typeof POKEMON)[number]) => (
  <img src={p.src} alt="" draggable={false} className="block w-full h-full object-contain" style={{ transform: p.side < 0 ? "scaleX(-1)" : undefined }} />
);

export default function SplashPokeBall() {
  const reduce = useReducedMotion();

  if (reduce) {
    // No wobbling or flying about: the monogram with both Pokémon already standing beside it
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="relative" style={{ width: BALL, height: BALL }}>
          <Monogram />
          {POKEMON.map((p) => (
            <div key={p.id} className="absolute" style={{ ...pokemonBox(p), transform: `translate(${p.side * LAND_X}px, ${LAND_Y}px)` }}>
              {pokemonImg(p)}
            </div>
          ))}
        </div>
        <div className="h-px" style={{ width: LINE_W, background: "#C4622D" }} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <style>{CSS}</style>
      <div className="relative" style={{ width: BALL, height: BALL }}>
        {/* The monogram sits inside the ball: seen when it opens, and all that's left once it's gone */}
        <div className="absolute inset-0 spb-run" style={{ animationName: "spb-monogram" }}>
          <Monogram />
        </div>
        {/* The ball wobbles like it's got something inside, then opens */}
        <div className="absolute inset-0 spb-run" style={{ animationName: "spb-ball" }}>
          <div className="spb-run" style={{ animationName: "spb-wobble", transformOrigin: "50% 100%" }}>
            <PokeBall />
          </div>
        </div>
        {/* Release flash */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none spb-run"
          style={{ animationName: "spb-flash", background: "radial-gradient(circle, #FFFFFF 0%, rgba(255,240,220,0.7) 40%, rgba(255,240,220,0) 70%)" }}
        />
        {/* Out they pop */}
        {POKEMON.map((p) => (
          <div key={p.id} className="absolute pointer-events-none spb-run" style={{ ...pokemonBox(p), animationName: `spb-fly-${p.id}` }}>
            <div className="w-full h-full spb-run" style={{ animationName: `spb-squash-${p.id}`, transformOrigin: "50% 100%" }}>
              {pokemonImg(p)}
            </div>
          </div>
        ))}
        {/* Jigglypuff can't help singing a note; Togepi twinkles */}
        {FLOATERS.map((f) => (
          <div
            key={f.id}
            className="absolute pointer-events-none spb-run"
            style={{ left: "50%", top: "50%", animationName: `spb-${f.id}` }}
            dangerouslySetInnerHTML={{ __html: f.html }}
          />
        ))}
      </div>
      {/* The ground they land on, drawn out from under the ball as it opens */}
      <div className="h-px spb-run" style={{ animationName: "spb-line", background: "#C4622D" }} />
    </div>
  );
}
