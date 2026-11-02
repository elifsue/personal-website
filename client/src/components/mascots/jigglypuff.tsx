/* ============================================================
   JIGGLYPUFF — official Pokémon HOME render (© Nintendo /
   Creatures / GAME FREAK), cropped to /images/jigglypuff/jigglypuff.png
   Bounces along beside Togepi. Click / tap: its first move is
   always Sing — which sends Togepi to sleep, so Jigglypuff puffs
   up in a huff and doodles on its face (just like in the anime)
   ============================================================ */

import { SHAPES, rand } from "./particles";
import type { CharacterDef, MoveDef } from "./types";

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
/** 0 → 1 with a little overshoot */
const popIn = (t: number) => {
  const k = clamp(t, 0, 1) - 1;
  return 1 + 2.70158 * k * k * k + 1.70158 * k * k;
};
const smooth = (t: number) => {
  const k = clamp(t, 0, 1);
  return k * k * (3 - 2 * k);
};

// Sing timeline, seconds
const SONG_END = 3.2;
const DOODLE_AT = 4.6;
const DONE_AT = 6.4;
/** Togepi must be this close (px) for Jigglypuff to reach its face with the marker */
const DOODLE_REACH = 260;
/** The marker scribbles round Togepi's eyes, then its cheeks (Togepi artwork coordinates) */
const DOODLE_PATH = [
  [149, 60], [170, 100], [149, 125], [127, 100], [149, 80], [208, 89], [230, 111], [208, 133], [186, 111],
  [180, 104], [115, 140], [122, 140], [245, 156], [252, 156], [270, 120],
];
const DOODLE_MS = 1700;
/** Between Togepi's eyes (Togepi artwork coordinates), where Jigglypuff glares when it falls asleep on her */
const TOGEPI_FACE = { x: 180, y: 105 };

const MOUTH = { x: 154, y: 239 };
/** The mic sits in the right hand: it turns with the right arm, about the arm's pivot */
const ARM_R_PIVOT = { x: 248, y: 284 };
const MIC_GRIP = { x: 250, y: 338 };
/** How high the mic arm is held, deg: brings the mic's head up beside the mouth */
const MIC_HOLD = 35;

const moves: Record<string, MoveDef> = {
  sing: {
    name: "Sing",
    dur: 7200,
    tick: (ctx, c, at) => {
      const d = c.action!.data;
      const tg = ctx.world.togepi;
      // A steady stream of notes while singing
      if (at < SONG_END && at >= (d.note ?? 0)) {
        d.note = at + 0.28;
        const side = Math.random() < 0.5 ? -1 : 1;
        ctx.spawn(SHAPES.note(rand(14, 20), Math.random() < 0.5 ? "#C4622D" : "#E2546F"), ctx.point(c, MOUTH.x, MOUTH.y - 20), side * rand(30, 110), rand(-70, -140), { dur: 1700, sway: side * 12, rot: side * rand(10, 30) });
      }
      // …and its audience nods off
      if (tg && at >= 0.9 && !d.slept) {
        d.slept = 1;
        ctx.forceSleep(tg, 25000);
      }
      if (at >= SONG_END && !d.angry) {
        d.angry = 1;
        d.near = tg && tg.sleep > 0.5 && ctx.sameLevel(tg, c) && Math.abs(tg.x - c.x) < DOODLE_REACH ? 1 : 0;
        ctx.spawn(SHAPES.anger(22), ctx.point(c, 300, 60), 6, -14, { dur: 1300 });
        ctx.say(c, d.near ? "Jiggly…?! 💢 You fell asleep?!" : "Jiggly…?! 💢", 1500);
      }
      if (at >= DOODLE_AT && !d.doodle) {
        d.doodle = 1;
        if (tg && d.near) {
          tg.doodleStart = ctx.now;
          ctx.say(c, "*scribble scribble* ✍️", 1800);
          ctx.spawnPath(SHAPES.marker(26), DOODLE_PATH.map(([ax, ay]) => ctx.point(tg, ax, ay)), DOODLE_MS);
        } else {
          ctx.say(c, "Hmph! 😤", 1500);
        }
      }
      if (at >= DONE_AT && !d.done) {
        d.done = 1;
        if (d.near) ctx.say(c, "Puff! 😌", 1000);
      }
    },
    pose: (p, at, c, ctx) => {
      const tg = ctx.world.togepi;
      if (at < SONG_END) {
        // Eyes closed, mouth open, swaying to its own song
        p.eye = "closed";
        p.mouth = "sing";
        p.rot = Math.sin(at * 5) * 6;
        p.raiseL = 20 + Math.sin(at * 5) * 14;
        p.raiseR = MIC_HOLD + Math.sin(at * 5) * 4; // the mic hand stays by her mouth, bobbing to the beat
        p.sy *= 1 + Math.sin(at * 10) * 0.015;
      } else if (at < DONE_AT) {
        // Puffs up in a huff, glaring at the sleeping audience
        const anger = smooth((at - SONG_END) / 0.35);
        const huff = anger * (at < DOODLE_AT ? 1 : 0.6); // deflates a little once she's busy drawing (still cross)
        p.angry = anger;
        p.mouth = "pout";
        p.sx *= 1 + 0.16 * huff + Math.sin(at * 9) * 0.02 * huff;
        p.sy *= 1 + 0.14 * huff + Math.sin(at * 9) * 0.02 * huff;
        if (at < DOODLE_AT) p.raiseR = MIC_HOLD; // still clutching the mic
        if (tg) {
          c.wantFacing = Math.sign(tg.x - c.x) || c.wantFacing;
          p.look = ctx.point(tg, TOGEPI_FACE.x, TOGEPI_FACE.y); // glaring at it, whatever the cursor's doing
        }
        if (at >= DOODLE_AT) {
          // Scribbling away, eyes on the marker as it goes round Togepi's face
          p.raiseL = 45 + Math.sin(at * 30) * 10;
          p.raiseR = 45 + Math.cos(at * 30) * 10;
          if (tg && c.action!.data.near) {
            const k = clamp((at - DOODLE_AT) / (DOODLE_MS / 1000), 0, 1) * (DOODLE_PATH.length - 1);
            const i = Math.min(DOODLE_PATH.length - 2, Math.floor(k));
            const [ax, ay] = DOODLE_PATH[i], [bx, by] = DOODLE_PATH[i + 1];
            p.look = ctx.point(tg, ax + (bx - ax) * (k - i), ay + (by - ay) * (k - i));
          }
        }
      } else {
        // Satisfied
        p.eye = "happy";
        p.blush = 1;
        p.hop = Math.max(0, Math.sin((at - DONE_AT) * Math.PI * 2.5)) * 6;
      }
    },
  },
  /* Giggling at its handiwork when Togepi wakes up doodled on (triggered by Togepi's surprise) */
  giggle: {
    name: "Giggle",
    dur: 1700,
    pose: (p, at, c, ctx) => {
      p.eye = "happy";
      p.blush = 1;
      p.hop = Math.abs(Math.sin(at * 14)) * 5;
      p.rot = Math.sin(at * 14) * 3;
      p.raiseL = p.raiseR = 35 + Math.sin(at * 14) * 8;
      const tg = ctx.world.togepi;
      if (tg) c.wantFacing = Math.sign(tg.x - c.x) || c.wantFacing;
    },
  },
  rollout: {
    name: "Rollout",
    dur: 2400,
    start: (ctx, c) => {
      // Rolls off away from Togepi (so they never overlap), then back
      const [minX, maxX] = ctx.bounds(c);
      const tg = ctx.world.togepi;
      const side = tg ? Math.sign(c.x - tg.x) || 1 : maxX - c.x > c.x - minX ? 1 : -1;
      c.action!.data.side = side;
      c.action!.data.dist = Math.max(0, Math.min(180, side > 0 ? maxX - c.x : c.x - minX));
    },
    tick: (ctx, c, at) => {
      const d = c.action!.data;
      if (at >= (d.dust ?? 0) && at < 2.2) {
        d.dust = at + 0.12;
        ctx.spawn(SHAPES.dust(rand(10, 16)), ctx.point(c, rand(120, 240), 390), -d.side * rand(10, 30), rand(-8, -20), { dur: 600 });
      }
    },
    pose: (p, at, c) => {
      const d = c.action!.data;
      const k = at / 2.4;
      p.offset = d.side * d.dist * Math.sin(Math.PI * k);
      // Rolling: turn by the distance travelled over the radius
      p.spin = ((p.offset / (c.W * 0.42)) * 180) / Math.PI;
      // Spinning swings the ears below the feet, so ride a little higher while rolling
      p.hop = c.H * 0.1 * Math.min(1, at / 0.2, (2.4 - at) / 0.2);
      p.eye = "closed";
      p.sy *= 0.92;
      p.sx *= 1.04;
      p.raiseL = p.raiseR = -12;
    },
  },
  rest: {
    name: "Rest",
    dur: 2800,
    tick: (ctx, c, at) => {
      const d = c.action!.data;
      if (at > 0.4 && at >= (d.z ?? 0)) {
        d.z = at + 0.6;
        ctx.spawn(SHAPES.z(rand(11, 16)), ctx.point(c, 320, 40), rand(10, 30), -46, { dur: 2000, sway: 6 });
      }
    },
    pose: (p, at, c) => {
      p.eye = "closed";
      p.sy *= 0.97 + Math.sin(at * 2.6) * 0.015;
      p.raiseL = p.raiseR = -c.def.droop[0];
    },
  },
  pound: {
    name: "Pound",
    dur: 1300,
    tick: (ctx, c, at) => {
      const d = c.action!.data;
      // Two bounces; stars burst out on each landing
      for (const [k, t] of [["l1", 0.5], ["l2", 1.05]] as const) {
        if (at >= t && !d[k]) {
          d[k] = 1;
          const from = ctx.point(c, 165, 390);
          for (let i = 0; i < 5; i++) ctx.spawn(SHAPES.star(rand(10, 14)), from, rand(-60, 60), rand(-10, -40), { dur: 600, rot: rand(90, 270) });
        }
      }
    },
    pose: (p, at) => {
      const b = at < 0.5 ? Math.sin((at / 0.5) * Math.PI) : at < 1.05 ? Math.sin(((at - 0.5) / 0.55) * Math.PI) * 0.7 : 0;
      p.hop = Math.max(0, b) * 18;
      const land = (at > 0.45 && at < 0.6) || (at > 1.0 && at < 1.15) ? 1 : 0;
      p.sy *= 1 - 0.1 * land;
      p.sx *= 1 + 0.08 * land;
      p.raiseL = p.raiseR = 40;
    },
  },
  defenseCurl: {
    name: "Defense Curl",
    dur: 1700,
    start: (ctx, c) => {
      const from = ctx.point(c, 178, 225);
      for (let i = 0; i < 6; i++) ctx.spawn(SHAPES.sparkle(rand(10, 15)), from, rand(-60, 60), rand(-30, -80), { dur: 900, delay: 300 + i * 80 });
    },
    pose: (p, at) => {
      const k = smooth(at / 0.25) * smooth((1.7 - at) / 0.3);
      p.sy *= 1 - 0.18 * k;
      p.sx *= 1 + 0.1 * k;
      p.eye = "closed";
      p.raiseL = p.raiseR = -15 * k;
    },
  },
};

export const jigglypuff: CharacterDef = {
  id: "jigglypuff",
  name: "Jigglypuff",
  src: "/images/jigglypuff/jigglypuff.png",
  w: 396,
  h: 398,
  width: { desktop: 100, mobile: 78 },
  feet: { x: 165, y: 394 },
  center: { x: 178, y: 225 },
  // Three-quarter view: its back (left) sole sits 22px higher, so lean it level about the front sole
  level: { angle: -5.9, x: 272, y: 393 },
  soles: [{ x: 57, y: 393 }, { x: 272, y: 393 }],
  shadow: { cx: 165, cy: 392, rx: 135, ry: 10 },
  eyes: [
    {
      x: 96, y: 174, lid: { rx: 50, ry: 60, tilt: 8, fill: "url(#jp-lid-l)", tight: true }, arc: 30, stroke: 8,
      look: {
        cut: { x: 103, y: 173.8, rx: 32, ry: 34, tilt: 15 }, ink: true, range: [11, 10],
        shine: {
          x: 114.6, y: 153.5, rx: 10.5, ry: 8.9, tilt: -48, range: [13, 12], under: "#007C8A",
          within: { x: 102.7, y: 174.4, rx: 29.8, ry: 31, tilt: 3.6 }, cover: { x: 103, y: 173.8, rx: 32, ry: 34, tilt: 15 },
        },
        socket: { x: 95.4, y: 172.7, rx: 38.4, ry: 45.5, tilt: 12, fill: "url(#jp-sclera)", stroke: "#9A8A8B" },
      },
    },
    {
      x: 242, y: 216, lid: { rx: 54, ry: 60, tilt: -4, fill: "url(#jp-lid-r)", tight: true }, arc: 32, stroke: 8,
      look: {
        cut: { x: 251.6, y: 214.7, rx: 31, ry: 35.5, tilt: -17 }, ink: true, range: [11, 10],
        shine: {
          x: 265.4, y: 196.1, rx: 8.5, ry: 10.4, tilt: -9.5, range: [13, 12], under: "#007988",
          within: { x: 251.5, y: 215.2, rx: 28.1, ry: 33.2, tilt: -21.3 }, cover: { x: 251.6, y: 214.7, rx: 31, ry: 35.5, tilt: -17 },
        },
        socket: { x: 241.1, y: 215.1, rx: 41.7, ry: 45.9, tilt: 9.5, fill: "url(#jp-sclera)", stroke: "#9A8A8B" },
      },
    },
  ],
  cheeks: [{ x: 92, y: 240, rx: 20, ry: 10 }, { x: 262, y: 268, rx: 18, ry: 9 }],
  mouth: MOUTH,
  hit: { cx: 198, cy: 205, rx: 190, ry: 195 },
  /* Feet and ears sit behind the body; the arms overlap it in the artwork, so they're drawn in front
     and a body-coloured `patch` paints over the hole they leave behind when they move */
  limbs: [
    { k: "earL", pivot: [92, 92], cut: "M28,128 L50,122 L132,62 L132,0 L28,0 Z", joint: { cx: 90, cy: 93, rx: 44, ry: 7, fill: "#F6C6D2", transform: "rotate(-36 90 93)" } },
    { k: "earR", pivot: [306, 142], cut: "M286,90 L396,90 L396,200 L324,192 Z", joint: { cx: 305, cy: 143, rx: 7, ry: 48, fill: "#EDBBC6", transform: "rotate(-20 305 143)" } },
    { k: "footL", pivot: [110, 330], cut: "M22,345 L50,322 L70,305 L110,326 L148,346 L148,362 L100,378 L40,384 L20,372 Z", joint: { cx: 108, cy: 326, rx: 40, ry: 6, fill: "#E2B1BA", transform: "rotate(28 108 326)" } },
    { k: "footR", pivot: [240, 352], cut: "M186,352 L225,351 L240,354 L258,353 L272,344 L292,342 L310,372 L306,398 L250,398 L186,372 Z", joint: { cx: 240, cy: 350, rx: 40, ry: 6, fill: "#E2B1BA", transform: "rotate(-6 240 350)" } },
    { k: "armL", pivot: [58, 236], front: true, cut: "M0,205 L36,205 L58,213 L70,228 L64,250 L44,266 L0,252 Z", patch: { d: "M32,205 L36,205 L58,213 L70,228 L64,250 L44,266 L40,262 L36,250 L33,235 L31,220 Z", fill: "#EBBEC7" } },
    { k: "armR", pivot: [248, 284], front: true, cut: "M222,284 L245,270 L274,282 L288,300 L281,322 L268,345 L250,353 L232,346 L224,316 Z", patch: { d: "M222,284 L245,270 L274,282 L288,300 L281,322 L268,345 L250,353 L232,346 L224,316 Z", fill: "url(#jp-patch-r)" } },
  ],
  walk: { maxSpeed: 150, bounce: 7, sway: 4, stride: 34, startDist: 30 },
  droop: [18, 12],
  defs: (
    <>
      {/* Eye whites, lit from the top right like the artwork's: repainted under the irises as they move */}
      <radialGradient id="jp-sclera" cx="0.62" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset="0.5" stopColor="#FDFCFC" />
        <stop offset="0.8" stopColor="#F1ECEC" />
        <stop offset="1" stopColor="#E4DADA" />
      </radialGradient>
      {/* Eyelids follow the skin's shading around each eye: light from the top right / top left */}
      <linearGradient id="jp-lid-l" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stopColor="#ECC1CA" />
        <stop offset="0.5" stopColor="#F8D3DD" />
        <stop offset="1" stopColor="#FBE0EB" />
      </linearGradient>
      <linearGradient id="jp-lid-r" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FDE0EA" />
        <stop offset="0.5" stopColor="#F8D0DA" />
        <stop offset="1" stopColor="#ECBEC8" />
      </linearGradient>
      {/* Mic: a silver mesh head on a dark handle */}
      <radialGradient id="jp-mic-head" cx="0.35" cy="0.3" r="0.75">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset="0.45" stopColor="#C9CDD4" />
        <stop offset="1" stopColor="#6E737C" />
      </radialGradient>
      <linearGradient id="jp-mic-handle" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#4A4A55" />
        <stop offset="0.4" stopColor="#2A2A32" />
        <stop offset="1" stopColor="#141418" />
      </linearGradient>
      <clipPath id="jp-mic-mesh">
        <circle cx="0" cy="-121" r="17" />
      </clipPath>
      <linearGradient id="jp-patch-r" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F4C7D1" />
        <stop offset="1" stopColor="#E2B3BC" />
      </linearGradient>
    </>
  ),
  overlays: (
    <>
      {/* Singing: an open "O" mouth over the artwork's smile */}
      <g data-x="mouthCover" style={{ opacity: 0 }}>
        <ellipse cx={MOUTH.x} cy={MOUTH.y} rx="32" ry="14" fill="#F8CDD6" mask="url(#mascot-feather)" />
      </g>
      <g data-x="mouthSing" style={{ opacity: 0 }}>
        <ellipse cx={MOUTH.x} cy={MOUTH.y + 2} rx="13" ry="15" fill="#8E2F45" />
        <ellipse cx={MOUTH.x} cy={MOUTH.y + 10} rx="8" ry="5" fill="#F27E95" />
      </g>
      <path data-x="mouthPout" style={{ opacity: 0 }} d="M138,243 Q146,236 154,243 Q162,250 170,243" stroke="#5B3A44" strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* Her mic, drawn upright from the grip and leaned so its head ends up beside her mouth */}
      <g data-x="mic" style={{ opacity: 0 }}>
        <g transform={`translate(${MIC_GRIP.x} ${MIC_GRIP.y}) rotate(-20)`}>
          <path d="M-7,-14 L-9,-100 Q0,-104 9,-100 L7,-14 Q0,-10 -7,-14 Z" fill="url(#jp-mic-handle)" />
          <path d="M-4,-18 L-5.5,-96" stroke="#fff" strokeOpacity="0.25" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="-9.5" y="-98" width="19" height="6" rx="1.5" fill="#E0384B" />
          <path d="M-11,-101 L11,-101 L9,-106 L-9,-106 Z" fill="#8C9099" />
          <circle cx="0" cy="-121" r="17" fill="url(#jp-mic-head)" />
          <g clipPath="url(#jp-mic-mesh)" stroke="#5E636B" strokeOpacity="0.45" strokeWidth="1.1">
            {[-12, -6, 0, 6, 12].map((o) => <path key={`v${o}`} d={`M${o},-140 L${o},-102`} />)}
            {[-133, -127, -121, -115, -109].map((o) => <path key={`h${o}`} d={`M-18,${o} L18,${o}`} />)}
          </g>
          <circle cx="0" cy="-121" r="17" fill="none" stroke="#545861" strokeWidth="1.5" />
        </g>
      </g>
      {/* Angry brows */}
      <g data-x="brows" style={{ opacity: 0 }} stroke="#5B3A44" strokeWidth="9" strokeLinecap="round">
        <path d="M60,118 L124,138" />
        <path d="M212,172 L274,156" />
      </g>
    </>
  ),
  intro: (touch) => ["Jiggly~puff! 🎤", "I'm Jigglypuff. Want to hear my song?", touch ? "Tap me and I'll sing!" : "Click me and I'll sing!"],
  moves,
  air: {
    // Puffs herself up and floats like a balloon (as she does in the anime)
    pose: (p, secs, c) => {
      if (!c.held) return;
      const puff = 1.12 + Math.sin(secs * 5) * 0.02;
      p.sx *= puff;
      p.sy *= puff;
      p.mouth = "sing";
      p.ears = Math.sin(secs * 16) * 12;
    },
    trail: () => SHAPES.heart(rand(9, 12)),
    pickup: ["Puuuff~! 🎈", "Jiggly-wheee! 🎈", "Hey, put me down! 💢"],
  },
  onClick: (ctx, c) => {
    c.clicks++;
    // Always Sing first; after that mostly Sing, with the odd other move
    const pool = ["sing", "sing", "rollout", "rest", "pound", "defenseCurl"].filter((k) => k !== c.lastMove || k === "sing");
    const key = c.clicks === 1 ? "sing" : pool[Math.floor(Math.random() * pool.length)];
    c.lastMove = key;
    ctx.useMove(c, key);
  },
  frame: (ctx, c, p, q) => {
    const set = (k: string, on: number) => {
      const el = q(k);
      if (el) el.style.opacity = on.toFixed(2);
    };
    // The mic pops into her hand when she starts singing, and away when the marker comes out
    const mic = q("mic");
    if (mic) {
      const at = c.action?.key === "sing" ? (ctx.now - c.action.start) / 1000 : -1;
      const pop = at < 0 ? 0 : Math.min(popIn(at / 0.3), clamp((DOODLE_AT - at) / 0.2, 0, 1));
      mic.style.opacity = pop > 0 ? "1" : "0";
      mic.setAttribute(
        "transform",
        `rotate(${(-p.raiseR).toFixed(2)} ${ARM_R_PIVOT.x} ${ARM_R_PIVOT.y}) translate(${MIC_GRIP.x} ${MIC_GRIP.y}) scale(${pop.toFixed(3)}) translate(${-MIC_GRIP.x} ${-MIC_GRIP.y})`,
      );
    }
    set("mouthCover", p.mouth === "smile" ? 0 : 1);
    set("mouthSing", p.mouth === "sing" ? 1 : 0);
    set("mouthPout", p.mouth === "pout" ? 1 : 0);
    set("brows", p.angry);
  },
};
