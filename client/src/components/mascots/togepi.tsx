/* ============================================================
   TOGEPI — official Pokémon HOME render (© Nintendo / Creatures /
   GAME FREAK), cropped to /images/togepi/togepi.png
   Click / tap: uses Metronome, which turns into a random move.
   Its Sing puts Jigglypuff to sleep (for once!)
   ============================================================ */

import { SHAPES, rand } from "./particles";
import type { CharacterDef, Ctx, CharacterState, MoveDef } from "./types";

const easeOutBack = (t: number) => 1 + 2.7 * Math.pow(t - 1, 3) + 1.7 * Math.pow(t - 1, 2);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

const MOVE_MS = 1900;
const DOODLE_DRAW_MS = 1600;
/** How long the doodle stays on after Togepi wakes up with it */
const DOODLE_KEEP_MS = 9000;

const MOUTH = { x: 175, y: 126 };
/** Surprise timeline, seconds: crouch → leap → land → head shake / double take */
const CROUCH = 0.12;
const LAND = 0.62;
const SETTLED = 0.78;

/** Wakes up to find it's been drawn on */
const wakeToDoodle = (ctx: Ctx, c: CharacterState) => {
  c.doodleWoke = ctx.now;
  ctx.useMove(c, "surprised", "Toge?! 😱");
};

const moves: Record<string, MoveDef> = {
  metronome: {
    name: "Metronome",
    dur: 1300,
    pose: (p, at) => {
      // Rocks like a metronome's pendulum, both arms up and wagging in time
      p.rot = Math.sin(at * Math.PI * 2 * 1.6) * 14 * Math.min(1, at / 0.25);
      p.eye = "closed";
      const up = Math.min(1, at / 0.2) * 42;
      const wag = Math.sin(at * Math.PI * 2 * 3.2) * 16;
      p.raiseL = up + wag;
      p.raiseR = up - wag;
    },
    end: (ctx, c) => {
      const pool = Object.keys(moves).filter((k) => k !== "metronome" && k !== "surprised" && k !== c.lastMove);
      const key = pool[Math.floor(Math.random() * pool.length)];
      c.lastMove = key;
      ctx.useMove(c, key, key === "splash" ? "Splash! …But nothing happened." : `It turned into ${moves[key].name}!`);
    },
  },
  swift: {
    name: "Swift",
    dur: MOVE_MS,
    start: (ctx, c) => {
      const from = ctx.point(c, 190, 250);
      for (let i = 0; i < 11; i++) {
        const a = (-170 + (i * 160) / 10) * (Math.PI / 180);
        const d = rand(90, 150);
        ctx.spawn(SHAPES.star(rand(14, 22)), from, Math.cos(a) * d, Math.sin(a) * d, { dur: 1100, delay: i * 25, rot: rand(180, 360) });
      }
    },
    pose: (p, at) => {
      const j = Math.max(0, Math.sin(Math.min(1, at / 0.5) * Math.PI));
      p.hop = j * 22;
      p.sy = 1 + 0.08 * j;
      p.sx = 1 - 0.05 * j;
      p.raiseL = p.raiseR = 50 * Math.min(1, at / 0.12);
      p.tiltL = p.tiltR = 16 * j;
    },
  },
  sweetKiss: {
    name: "Sweet Kiss",
    dur: MOVE_MS,
    start: (ctx, c) => {
      const from = ctx.point(c, 190, 40);
      for (let i = 0; i < 8; i++) ctx.spawn(SHAPES.heart(rand(12, 20)), from, rand(-70, 70), rand(-110, -170), { dur: 1600, delay: i * 110, sway: rand(-14, 14), rot: rand(-25, 25) });
    },
    pose: (p, at) => {
      p.eye = "happy";
      p.blush = 1;
      p.rot = Math.sin(at * 5) * 6;
      p.raiseL = p.raiseR = 18 + Math.sin(at * 10) * 8;
    },
  },
  sing: {
    name: "Sing",
    dur: MOVE_MS,
    start: (ctx, c) => {
      const from = ctx.point(c, 190, 40);
      for (let i = 0; i < 7; i++) {
        const side = i % 2 ? 1 : -1;
        ctx.spawn(SHAPES.note(rand(14, 20)), from, side * rand(40, 100), rand(-80, -140), { dur: 1700, delay: i * 200, sway: side * 12, rot: side * rand(10, 30) });
      }
      // The tables turn: Togepi's song sends Jigglypuff to sleep
      const jp = ctx.world.jigglypuff;
      if (jp) ctx.later(() => ctx.forceSleep(jp, 12000), 800);
    },
    pose: (p, at) => {
      p.eye = "closed";
      p.rot = Math.sin(at * 6) * 8;
      p.raiseL = 22 + Math.sin(at * 6) * 16;
      p.raiseR = 22 - Math.sin(at * 6) * 16;
    },
  },
  thunderShock: {
    name: "Thunder Shock",
    dur: MOVE_MS,
    start: (ctx, c) => {
      const from = ctx.point(c, 190, 250);
      for (let i = 0; i < 6; i++) {
        const a = (-160 + i * 28) * (Math.PI / 180);
        ctx.spawn(SHAPES.bolt(rand(18, 26)), from, Math.cos(a) * 90, Math.sin(a) * 90, { dur: 700, delay: (i % 3) * 120, rot: (a * 180) / Math.PI + 90 });
      }
      ctx.flash(c);
    },
    pose: (p, at) => {
      p.rot = Math.sin(at * 70) * 2;
      p.raiseL = 35 + Math.sin(at * 55) * 7;
      p.raiseR = 35 + Math.cos(at * 55) * 7;
    },
  },
  bubble: {
    name: "Bubble",
    dur: MOVE_MS,
    start: (ctx, c) => {
      for (let i = 0; i < 10; i++) ctx.spawn(SHAPES.bubble(rand(10, 22)), ctx.point(c, MOUTH.x, MOUTH.y), rand(-60, 60), rand(-90, -170), { dur: 1600, delay: i * 120, sway: rand(-10, 10) });
    },
    pose: (p, at) => {
      p.sy = 1 + Math.sin(at * 12) * 0.03;
      p.sx = 1 - Math.sin(at * 12) * 0.02;
      p.raiseL = p.raiseR = -8;
    },
  },
  minimize: {
    name: "Minimize",
    dur: MOVE_MS,
    start: (ctx, c) => {
      const from = ctx.point(c, 190, 250);
      for (let i = 0; i < 6; i++) ctx.spawn(SHAPES.sparkle(rand(10, 15)), from, rand(-55, 55), rand(-20, -70), { dur: 900, delay: 150 + i * 80 });
    },
    pose: (p, at) => {
      // Shrinks to a tiny Togepi, hops a little, then pops back with an overshoot
      const down = Math.min(1, at / 0.25);
      const up = Math.max(0, Math.min(1, (at - 1.35) / 0.4));
      p.shrink = up > 0 ? 0.35 + 0.65 * easeOutBack(up) : 1 - 0.65 * down * down;
      if (at > 0.3 && at < 1.35) {
        const h = Math.abs(Math.sin((at - 0.3) * Math.PI * 3));
        p.hop = h * 8;
        p.raiseL = p.raiseR = 20 + h * 25;
      }
    },
  },
  /* Waking up to find Jigglypuff's doodle on its face: a startled leap, a head shake and a double
     take at Jigglypuff — who can't stop giggling. Not part of Metronome's pool; see `frame` */
  surprised: {
    name: "Surprise",
    dur: 2300,
    start: (ctx, c) => {
      // The "!" pops out beside the head (Togepi leaps up, so straight above would end up over its face)
      ctx.spawn(SHAPES.exclaim(28), ctx.point(c, 330, 10), 18, -44, { dur: 1100, scale: 1.2, rot: 12 });
      ctx.spawn(SHAPES.shock(22), ctx.point(c, 330, 70), 14, -6, { dur: 700, delay: 80 });
      ctx.spawn(`<div style="transform:scaleX(-1)">${SHAPES.shock(22)}</div>`, ctx.point(c, 50, 70), -14, -6, { dur: 700, delay: 80 });
      ctx.spawn(SHAPES.sweat(12), ctx.point(c, 300, 50), 30, -22, { dur: 900, delay: 150, rot: 40 });
      ctx.spawn(SHAPES.sweat(10), ctx.point(c, 80, 50), -28, -18, { dur: 900, delay: 220, rot: -40 });
    },
    tick: (ctx, c, at) => {
      const d = c.action!.data;
      const jp = ctx.world.jigglypuff;
      if (at >= 1.4 && !d.giggle) {
        d.giggle = 1;
        if (jp && !jp.action && jp.sleep < 0.5) ctx.useMove(jp, "giggle", "Puff-puff! 🤭");
      }
    },
    pose: (p, at, c, ctx) => {
      p.eye = "open";
      if (at < CROUCH) {
        // Flinch: a quick crouch
        const k = at / CROUCH;
        p.sy *= 1 - 0.14 * k;
        p.sx *= 1 + 0.1 * k;
        p.raiseL = p.raiseR = -10 * k;
      } else if (at < LAND) {
        // Leaps up, arms shooting straight up, feet kicking
        const j = Math.sin(((at - CROUCH) / (LAND - CROUCH)) * Math.PI);
        p.hop = j * 30;
        p.sy *= 1 + 0.12 * j;
        p.sx *= 1 - 0.07 * j;
        p.raiseL = p.raiseR = 75;
        p.tiltL = p.tiltR = 22 * j;
      } else if (at < SETTLED) {
        const s = Math.sin(((at - LAND) / (SETTLED - LAND)) * Math.PI);
        p.sy *= 1 - 0.12 * s;
        p.sx *= 1 + 0.1 * s;
        p.raiseL = p.raiseR = 60;
      } else {
        // Shakes its head, arms flailing, then turns to Jigglypuff and blinks twice in disbelief
        const k = at - SETTLED;
        const decay = Math.max(0, 1 - k / 1.2);
        p.rot = Math.sin(k * 38) * 6 * decay;
        p.raiseL = 40 + Math.sin(k * 30) * 25 * decay;
        p.raiseR = 40 - Math.sin(k * 30) * 25 * decay;
        const jp = ctx.world.jigglypuff;
        if (jp) c.wantFacing = Math.sign(jp.x - c.x) || c.wantFacing;
        if ((k > 0.55 && k < 0.65) || (k > 0.8 && k < 0.9)) p.eye = "closed";
      }
    },
  },
  splash: {
    name: "Splash",
    dur: MOVE_MS,
    start: (ctx, c) => ctx.spawn(SHAPES.sweat(), ctx.point(c, 300, 60), 8, 18, { dur: 1300, delay: 500 }),
    pose: (p, at) => {
      const k = Math.min(1, at / 0.9);
      p.hop = Math.abs(Math.sin(k * Math.PI * 2)) * 8 * (1 - k);
      // Flails, then gives up
      p.raiseL = at < 0.9 ? 20 + Math.sin(at * 28) * 22 : -10;
      p.raiseR = at < 0.9 ? 20 - Math.sin(at * 28) * 22 : -10;
      if (at > 0.9) p.eye = "closed";
    },
  },
};

/* Jigglypuff's marker doodle: glasses round the eyes and swirls on the cheeks */
const DOODLE = [
  "M149,80 a22,22 0 1,1 -0.1,0",
  "M208.5,89 a22,22 0 1,1 -0.1,0",
  "M171,104 Q179,98 187,108",
  "M108,136 a9,9 0 1,1 9,9 a5,5 0 1,1 -5,-5",
  "M238,152 a9,9 0 1,1 9,9 a5,5 0 1,1 -5,-5",
];

export const togepi: CharacterDef = {
  id: "togepi",
  name: "Togepi",
  src: "/images/togepi/togepi.png",
  w: 380,
  h: 400,
  /** 0.3 m tall in the Pokédex: three fifths of Jigglypuff's 0.5 m (see jigglypuff.tsx) */
  width: { desktop: 64, mobile: 50 },
  feet: { x: 190, y: 396 },
  center: { x: 190, y: 250 },
  // Three-quarter view: its back (left) sole sits 17px higher, so lean it level about the front sole
  level: { angle: -5, x: 270, y: 395 },
  soles: [{ x: 75, y: 395 }, { x: 270, y: 395 }],
  shadow: { cx: 172, cy: 394, rx: 130, ry: 10 },
  eyes: [
    {
      x: 149, y: 102, lid: { rx: 15, ry: 24, tilt: 10, fill: "#FFFEBC" }, arc: 12, stroke: 6,
      look: {
        cut: { x: 149.8, y: 102.8, rx: 13, ry: 20, tilt: 15 }, range: [9, 7],
        shine: { x: 151.7, y: 94.1, rx: 3.2, ry: 6.4, tilt: 26, range: [3.2, 7], under: "#0A0A09", within: { x: 149, y: 101.7, rx: 6.6, ry: 16.7, tilt: 21 } },
      },
    },
    {
      x: 208.5, y: 111, lid: { rx: 15, ry: 24, tilt: 6, fill: "#F9F4B0" }, arc: 12, stroke: 6,
      look: {
        cut: { x: 207.8, y: 112.7, rx: 11, ry: 20.5, tilt: 0 }, range: [9, 7],
        shine: { x: 208.4, y: 104.1, rx: 3, ry: 6.5, tilt: 0, range: [3.8, 7], under: "#030303", within: { x: 207.6, y: 112.2, rx: 7.7, ry: 17, tilt: 3.6 } },
      },
    },
  ],
  cheeks: [{ x: 122, y: 132, rx: 20, ry: 11 }, { x: 240, y: 146, rx: 20, ry: 11 }],
  mouth: MOUTH,
  hit: { cx: 190, cy: 215, rx: 180, ry: 190 },
  /* Limbs are drawn behind the shell. Each cut follows the shell's edge; the round arm joints are
     centred on the pivot so they look the same at any angle */
  limbs: [
    { k: "armL", pivot: [45, 172], cut: "M0,100 L43,100 L48,146 L44,160 L40,175 L36,190 L32,204 L0,212 Z", joint: { cx: 45, cy: 172, rx: 8, ry: 8, fill: "#EEE59E" } },
    { k: "armR", pivot: [321, 205], cut: "M326,160 L380,160 L380,245 L341,245 L333,231 L324,226 L323,200 L325,182 Z", joint: { cx: 321, cy: 205, rx: 8, ry: 8, fill: "#EAE098" } },
    { k: "footL", pivot: [110, 350], cut: "M36,330 L72,334 L100,347 L130,356 L162,362 L162,400 L36,400 Z", joint: { cx: 118, cy: 355, rx: 28, ry: 6, fill: "#F1E9A2", transform: "rotate(18 118 355)" } },
    { k: "footR", pivot: [250, 358], cut: "M190,366 L232,363 L262,353 L288,338 L304,322 L310,400 L190,400 Z", joint: { cx: 238, cy: 362, rx: 28, ry: 6, fill: "#F1E9A2", transform: "rotate(-14 238 362)" } },
  ],
  walk: { maxSpeed: 120, bounce: 3, sway: 6, stride: 30, startDist: 22 },
  // The left arm points up-left at rest, so it has further to sink to hang down
  droop: [110, 85],
  overlays: (
    <>
      {/* Anime "gloom" lines on the forehead, shown while it reels from the surprise */}
      <g data-x="gloom" style={{ opacity: 0 }} stroke="#7FB2E5" strokeWidth="5" strokeLinecap="round">
        <path d="M132,52 L132,78" />
        <path d="M150,48 L150,82" />
        <path d="M168,52 L168,76" />
      </g>
      <g data-x="doodle" style={{ opacity: 0 }} stroke="#1E1E1E" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {DOODLE.map((d, i) => (
          <path key={i} d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset="1" />
        ))}
      </g>
    </>
  ),
  intro: (touch) => ["Toge-priii! ✨", "I'm Togepi, Elifsu's lucky charm.", touch ? "Tap me for a surprise!" : "Click me for a surprise!"],
  moves,
  air: {
    // Flapping its stubby arms like it's flying under its own steam
    pose: (p, secs) => {
      p.raiseL = 70 + Math.sin(secs * 18) * 28;
      p.raiseR = 70 + Math.sin(secs * 18 + 0.6) * 28;
    },
    trail: () => SHAPES.sparkle(rand(9, 13)),
    pickup: ["Toge-wheee! ✨", "I'm flying! ✨", "Toge-priii~! 🪽"],
  },
  onClick: (ctx, c) => {
    if (c.doodleStart && !c.doodleWoke) {
      // Drawn on: clicking wakes it straight into the surprise (or does nothing while the marker's still going)
      if (ctx.now - c.doodleStart >= DOODLE_DRAW_MS) wakeToDoodle(ctx, c);
      return;
    }
    ctx.useMove(c, "metronome");
  },
  frame: (ctx: Ctx, c: CharacterState, _p, q) => {
    const gloom = q("gloom");
    if (gloom) {
      const at = c.action?.key === "surprised" ? (ctx.now - c.action.start) / 1000 : -1;
      gloom.style.opacity = at > LAND && at < 2.1 ? clamp(Math.min((at - LAND) / 0.15, (2.1 - at) / 0.3), 0, 1).toFixed(2) : "0";
    }
    const doodle = q("doodle");
    if (!doodle) return;
    if (!c.doodleStart) {
      doodle.style.opacity = "0";
      return;
    }
    const drawn = clamp((ctx.now - c.doodleStart) / DOODLE_DRAW_MS, 0, 1);
    // Strokes are drawn one after another
    doodle.querySelectorAll("path").forEach((path, i, all) => {
      const k = clamp(drawn * all.length - i, 0, 1);
      path.setAttribute("stroke-dashoffset", (1 - k).toFixed(3));
    });
    // Wakes up to find it's been drawn on (waits for any move in progress to finish first)
    if (drawn >= 1 && !c.doodleWoke && c.sleep < 0.4 && !c.action && !c.held && c.lift === c.stand) wakeToDoodle(ctx, c);
    let opacity = 1;
    if (c.doodleWoke) {
      opacity = 1 - (ctx.now - c.doodleWoke - DOODLE_KEEP_MS) / 1000;
      if (opacity <= 0) {
        c.doodleStart = 0;
        c.doodleWoke = 0;
      }
    }
    doodle.style.opacity = clamp(opacity, 0, 1).toFixed(2);
  },
};
