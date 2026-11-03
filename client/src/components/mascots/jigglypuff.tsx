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

/** The right arm's outline (traced from the artwork) */
const ARM_R_CUT = "M243.5,275.2 C244.3,274.8 245.4,274.1 246.5,273.6 C247.6,273.1 248.8,272.6 250.0,272.2 C251.2,271.8 252.5,271.5 254.0,271.4 C255.5,271.2 257.4,271.3 259.0,271.3 C260.6,271.3 262.1,271.4 263.5,271.6 C264.9,271.8 266.2,272.0 267.2,272.4 C268.2,272.8 269.0,273.3 269.7,273.9 C270.4,274.5 270.8,275.2 271.2,276.1 C271.6,277.0 271.8,278.0 271.9,279.0 C272.0,280.0 272.0,281.0 272.1,282.0 C272.2,283.0 272.4,284.0 272.6,285.0 C272.8,286.0 273.2,287.0 273.5,288.0 C273.8,289.0 274.2,290.0 274.5,291.0 C274.8,292.0 275.1,293.0 275.5,294.0 C275.9,295.0 276.3,296.0 276.6,297.0 C276.9,298.0 277.1,298.8 277.2,300.0 C277.3,301.2 277.4,302.7 277.4,304.0 C277.4,305.3 277.4,306.7 277.4,308.0 C277.4,309.3 277.4,310.7 277.4,312.0 C277.4,313.3 277.4,314.8 277.3,316.0 C277.2,317.2 276.9,318.0 276.7,319.0 C276.5,320.0 276.2,321.0 276.0,322.0 C275.8,323.0 275.6,324.0 275.4,325.0 C275.2,326.0 274.9,327.0 274.7,328.0 C274.5,329.0 274.3,330.1 274.1,331.0 C273.9,331.9 273.7,332.8 273.4,333.5 C273.1,334.2 272.7,334.9 272.4,335.5 C272.1,336.1 271.8,336.7 271.5,337.3 C271.2,337.9 270.9,338.7 270.6,339.3 C270.3,339.9 270.0,340.6 269.6,341.2 C269.2,341.8 268.8,342.3 268.3,342.8 C267.8,343.3 267.2,343.8 266.6,344.3 C266.0,344.8 265.3,345.4 264.6,345.9 C263.9,346.4 263.1,346.8 262.2,347.2 C261.3,347.6 260.1,348.0 259.1,348.1 C258.1,348.2 257.0,348.2 256.0,348.1 C255.0,348.0 254.1,347.8 253.3,347.5 C252.5,347.2 251.7,346.6 251.0,346.2 C250.3,345.8 249.8,345.3 249.3,344.9 C248.8,344.4 248.4,343.9 248.0,343.5 C247.6,343.1 247.3,342.6 246.9,342.2 C246.5,341.8 246.2,341.3 245.8,340.8 C245.4,340.3 245.1,339.9 244.7,339.4 C244.3,338.9 244.0,338.4 243.6,337.8 C243.2,337.2 242.8,336.4 242.4,335.6 C242.0,334.9 241.6,334.1 241.2,333.3 C240.8,332.5 240.3,331.8 239.9,331.0 C239.5,330.2 239.1,329.5 238.6,328.8 C238.1,328.1 237.6,327.3 237.1,326.6 C236.6,325.9 236.0,325.2 235.4,324.6 C234.8,324.0 234.1,323.3 233.4,322.7 C232.7,322.1 231.9,321.5 231.2,320.9 C230.5,320.3 229.8,319.6 229.2,319.0 C228.6,318.4 228.1,317.7 227.6,317.0 C227.1,316.3 226.7,315.6 226.3,314.8 C225.9,314.0 225.6,313.2 225.3,312.4 C225.0,311.6 224.7,310.7 224.4,309.8 C224.1,308.9 223.8,308.0 223.6,307.0 C223.4,306.0 223.2,305.0 223.1,304.0 C223.0,303.0 223.1,302.0 223.2,301.0 C223.3,300.0 223.6,298.9 223.9,298.0 C224.2,297.1 224.6,296.2 225.1,295.3 C225.6,294.4 226.1,293.7 226.7,292.9 C227.3,292.1 227.9,291.4 228.5,290.7 C229.1,290.0 229.7,289.3 230.3,288.6 C230.9,287.9 231.4,287.3 231.9,286.6 C232.4,285.9 232.9,285.2 233.4,284.5 C233.9,283.8 234.4,283.2 234.9,282.5 C235.4,281.8 235.9,281.1 236.5,280.5 C237.1,279.9 237.7,279.2 238.3,278.6 C239.0,278.0 239.8,277.3 240.4,276.9 C241.0,276.5 241.4,276.3 241.9,276.0 C242.4,275.7 242.7,275.6 243.5,275.2 Z";
/** The top of the right foot where the right arm covers it in the artwork, repainted on the foot */
const FOOT_R_UNDER = "M273.2,339.2 L273.0,341.6 L272.0,344.0 L270.0,346.4 L267.2,348.4 L263.6,349.4 L259.5,349.9 L255.8,349.9 L252.6,349.2 L249.8,347.6 L247.9,346.0 L246.4,344.3 L245.2,342.7 L244.0,341.1 L242.9,339.5 L245.5,339.0 L249.0,338.5 L253.0,338.1 L258.0,337.9 L263.0,338.0 L267.0,338.3 L270.0,338.7 L272.4,338.6 Z";

export const jigglypuff: CharacterDef = {
  id: "jigglypuff",
  name: "Jigglypuff",
  src: "/images/jigglypuff/jigglypuff.png",
  w: 396,
  h: 398,
  /** Sized against Togepi as in the Pokédex: Jigglypuff is 0.5 m tall to Togepi's 0.3 m (both pictures
      are filled top to bottom, so their heights on screen keep that 5:3) */
  width: { desktop: 112, mobile: 86 },
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
  cheeks: [{ x: 88, y: 222, rx: 24, ry: 12 }, { x: 244, y: 262, rx: 20, ry: 11 }],
  mouth: MOUTH,
  hit: { cx: 198, cy: 205, rx: 190, ry: 195 },
  /* Feet and ears sit behind the body; the arms overlap it in the artwork, so they're drawn in front
     and a body-coloured `patch` paints over the hole they leave behind when they move */
  limbs: [
    // Ears: the hole follows the edge of the head where each ear meets it, and the ear itself reaches a
    // little way into the head (hidden behind it), so a swinging ear never shows a cut edge or a gap
    {
      k: "earL", pivot: [92, 92],
      hole: "M20,0 L20,126 L52,121 L57,116 L66,108 L75,100 L90,89 L105,79 L118,70 L130,62 L145,59 L158,55 L164,50 L164,0 Z",
      cut: "M20,0 L20,126 L52,121 L57,116 L60,134 L82,120 L90,114 L103,104 L116,96 L127,88 L137,81 L150,78 L172,66 L158,55 L164,50 L164,0 Z",
    },
    {
      k: "earR", pivot: [310, 140],
      hole: "M276,70 L276,89 L280,94 L286,101 L294,108 L300,114 L308,128 L316,145 L322,165 L326,185 L328,198 L396,198 L396,70 Z",
      cut: "M276,70 L276,89 L258,92 L266,109 L271,115 L278,121 L284,126 L291,138 L297,152 L303,170 L306,187 L314,212 L328,198 L396,198 L396,70 Z",
    },
    // Feet: traced from the artwork's pixels like the ears. The hole is the foot outside the body (its top
    // follows the body's bottom edge); the foot reaches up inside the body, hidden, to fill the join as it
    // tilts and lifts. Each pivots at the heel, where it meets the body, so the join only ever moves up
    // into the body
    {
      k: "footL", pivot: [134, 343],
      hole: "M75.6,311.4 L73.2,312.5 L71.0,313.3 L68.7,314.1 L66.7,315.3 L64.7,316.5 L62.7,317.8 L60.6,319.2 L58.6,320.8 L56.6,322.2 L54.6,323.8 L52.6,325.3 L50.4,327.2 L48.4,329.2 L46.4,331.2 L44.4,333.2 L42.4,335.2 L40.3,337.5 L39.3,338.8 L38.3,340.2 L37.2,341.7 L36.1,343.5 L35.1,345.3 L34.5,346.9 L33.8,349.1 L33.3,351.2 L32.8,353.2 L32.6,355.4 L32.5,357.5 L32.7,359.8 L33.5,362.1 L34.7,364.3 L36.7,366.8 L38.2,368.1 L39.5,369.2 L41.8,370.6 L44.0,371.6 L46.0,372.2 L48.0,372.9 L50.2,373.6 L52.5,373.7 L54.5,373.7 L56.6,373.7 L58.6,373.6 L60.5,373.5 L62.6,373.5 L64.7,373.3 L66.8,372.9 L68.7,372.6 L70.8,372.2 L72.8,371.9 L74.8,371.5 L76.9,371.0 L78.9,370.5 L80.9,369.9 L82.9,369.4 L84.9,368.8 L87.0,368.2 L89.0,367.5 L91.0,366.8 L93.0,366.1 L95.0,365.4 L97.0,364.7 L99.0,364.0 L101.0,363.2 L103.0,362.5 L105.1,361.7 L107.0,360.9 L109.0,360.1 L111.1,359.3 L113.1,358.5 L115.1,357.6 L117.1,356.7 L119.1,355.9 L121.1,355.1 L123.1,354.1 L125.2,353.2 L127.2,352.1 L129.2,351.2 L131.2,350.2 L133.1,348.9 L134.9,347.5 L136.9,346.2 L134.7,344.5 L133.1,343.6 L130.9,342.3 L128.9,341.6 L126.9,340.8 L124.9,340.0 L122.9,339.3 L120.9,338.5 L118.9,337.7 L116.9,337.0 L114.9,336.2 L112.9,335.5 L111.0,334.6 L109.0,333.4 L107.0,332.3 L105.0,331.1 L103.0,329.9 L101.0,328.7 L99.0,327.5 L97.0,326.3 L95.0,325.2 L93.0,323.9 L91.0,322.7 L89.1,321.5 L87.1,320.0 L85.2,318.3 L83.2,316.6 L81.2,314.8 L78.9,313.3 L76.7,312.0 Z",
      cut: "M75.6,311.4 L73.2,312.5 L71.0,313.3 L68.7,314.1 L66.7,315.3 L64.7,316.5 L62.7,317.8 L60.6,319.2 L58.6,320.8 L56.6,322.2 L54.6,323.8 L52.6,325.3 L50.4,327.2 L48.4,329.2 L46.4,331.2 L44.4,333.2 L42.4,335.2 L40.3,337.5 L39.3,338.8 L38.3,340.2 L37.2,341.7 L36.1,343.5 L35.1,345.3 L34.5,346.9 L33.8,349.1 L33.3,351.2 L32.8,353.2 L32.6,355.4 L32.5,357.5 L32.7,359.8 L33.5,362.1 L34.7,364.3 L36.7,366.8 L38.2,368.1 L39.5,369.2 L41.8,370.6 L44.0,371.6 L46.0,372.2 L48.0,372.9 L50.2,373.6 L52.5,373.7 L54.5,373.7 L56.6,373.7 L58.6,373.6 L60.5,373.5 L62.6,373.5 L64.7,373.3 L66.8,372.9 L68.7,372.6 L70.8,372.2 L72.8,371.9 L74.8,371.5 L76.9,371.0 L78.9,370.5 L80.9,369.9 L82.9,369.4 L84.9,368.8 L87.0,368.2 L89.0,367.5 L91.0,366.8 L93.0,366.1 L95.0,365.4 L97.0,364.7 L99.0,364.0 L101.0,363.2 L103.0,362.5 L105.1,361.7 L107.0,360.9 L109.0,360.1 L111.1,359.3 L113.1,358.5 L115.1,357.6 L117.1,356.7 L119.1,355.9 L121.1,355.1 L123.1,354.1 L125.2,353.2 L127.2,352.1 L129.2,351.2 L131.2,350.2 L133.1,348.9 L134.9,347.5 L136.9,346.2 L138.9,345.5 L140.9,345.1 L142.9,344.6 L144.9,343.2 L146.9,341.9 L148.9,340.5 L150.9,339.2 L152.9,337.8 L154.9,336.4 L156.9,335.1 L157.7,334.5 L143.1,328.9 L138.1,326.9 L134.0,325.3 L129.8,323.7 L126.0,322.3 L121.9,320.7 L117.5,318.7 L113.7,316.5 L109.7,314.1 L105.6,311.7 L101.9,309.4 L98.1,307.1 L94.4,303.8 L91.8,301.5 L90.1,302.6 L88.6,303.5 L87.1,304.5 L85.6,305.4 L84.1,306.3 L82.6,307.3 L81.1,308.2 L79.6,309.2 L78.1,310.1 L76.6,311.0 Z",
    },
    {
      k: "footR", pivot: [194.5, 351.7],
      hole: "M194.3,351.7 196,351.5 198,351.3 200,351.2 202,350.95 204,350.65 206,350.3 208,350 210,349.8 212,349.5 214,349.2 216,348.85 218,348.35 220,347.5 222,347 224,346.3 226,345.7 228,345.05 230,344.3 232,343.65 234,342.8 236,342.25 238,341.65 240,341.1 242,340.3 243,339.7 244,339.2 245,340 246,341.2 247,342.2 248,343.2 249,344.2 250,345 251,345.8 252,346.4 253,346.9 254,347.3 256,347.9 258,348.2 260,348.3 262,347.8 264,346.8 266,345.4 267,344.4 268,343.3 269,342.2 270,340.6 271,339.2 271.8,338.1 272.5,337.4 L274.5,338.2 278,339.5 284,344 292,351 299,360 303,372 302,385 298,393 290,397 280,400 186,400 186,362 190.5,357 192.4,354.5 Z",
      cut: "M272.5,337.4 L274.5,338.2 278,339.5 284,344 292,351 299,360 303,372 302,385 298,393 290,397 280,400 186,400 186,362 190.5,357 192.4,354.5 L194.3,351.7 193.2,349.8 191.6,347.2 189.5,344 189,341 189,338 193,335 200,333 210,330 220,327 232,323.5 244,321 252,321 258,322.5 261,325 264,328 267,331 270,334 Z",
      // The right arm covers the top of this foot in the artwork: that part's painted in, moving with the foot
      over: { d: FOOT_R_UNDER, fill: "url(#jp-footR-under)" },
    },
    // Arms: traced from the artwork's pixels (outline against the background, shading edge over the body),
    // pivoting at the shoulder. The patch repaints the body's shading where an arm was, fitted to the
    // pixels around it (only inside the body's outline, so the background shows where an arm stuck out)
    {
      k: "armL", pivot: [44, 244], front: true,
      cut: "M30.5,209.4 C29.7,209.3 29.2,209.4 28.6,209.3 C28.0,209.2 27.3,209.1 26.6,209.0 C26.0,208.9 25.3,208.9 24.6,208.8 C24.0,208.7 23.4,208.5 22.7,208.4 C22.0,208.3 21.3,208.0 20.6,208.0 C19.8,208.0 19.0,208.1 18.3,208.2 C17.6,208.3 17.0,208.5 16.3,208.7 C15.6,208.8 15.0,208.9 14.3,209.0 C13.6,209.1 12.9,209.2 12.2,209.4 C11.5,209.7 10.6,210.2 10.0,210.5 C9.5,210.8 9.3,210.9 8.9,211.2 C8.6,211.4 8.3,211.6 7.9,211.9 C7.6,212.1 7.1,212.3 6.8,212.7 C6.4,213.1 6.0,213.8 5.7,214.3 C5.3,214.8 5.0,215.3 4.7,215.7 C4.4,216.0 4.2,216.1 3.9,216.5 C3.7,217.0 3.4,217.6 3.3,218.4 C3.2,219.1 3.2,220.1 3.2,221.0 C3.2,221.9 3.2,222.9 3.3,223.6 C3.4,224.4 3.6,225.1 3.9,225.7 C4.1,226.3 4.5,226.5 4.8,227.1 C5.1,227.7 5.3,228.6 5.6,229.2 C5.9,229.9 6.3,230.3 6.6,231.0 C7.0,231.6 7.1,232.1 7.6,233.0 C8.1,233.9 9.0,235.3 9.7,236.3 C10.3,237.4 11.0,238.4 11.7,239.3 C12.4,240.2 13.1,240.9 13.7,241.7 C14.4,242.5 15.1,243.3 15.7,244.1 C16.4,244.9 17.1,245.8 17.7,246.5 C18.4,247.3 19.1,248.2 19.8,248.9 C20.5,249.6 21.1,250.2 21.8,250.8 C22.5,251.5 23.2,252.1 23.9,252.7 C24.5,253.2 25.2,253.7 25.9,254.3 C26.5,254.8 27.2,255.4 27.8,256.0 C28.5,256.5 29.2,257.1 29.8,257.7 C30.5,258.4 31.2,259.1 32.0,259.6 C32.7,260.1 33.4,260.3 34.1,260.5 C34.8,260.8 35.5,261.0 36.2,261.2 C36.8,261.5 37.5,261.7 38.1,261.9 C38.7,262.2 38.6,262.4 39.7,262.7 C40.7,262.9 42.7,263.2 44.5,263.4 C46.3,263.6 48.5,263.9 50.5,263.7 C52.5,263.5 54.7,262.9 56.5,262.1 C58.3,261.3 60.0,260.2 61.5,259.1 C63.0,258.0 64.4,256.8 65.5,255.5 C66.6,254.2 67.6,252.7 68.3,251.3 C69.0,249.9 69.3,248.5 69.5,247.0 C69.7,245.5 69.6,244.2 69.6,242.5 C69.6,240.8 69.5,238.3 69.4,236.5 C69.4,234.7 69.4,232.9 69.3,231.5 C69.2,230.1 69.1,229.1 68.9,228.0 C68.7,226.9 68.3,226.0 67.9,225.0 C67.5,224.0 67.0,223.0 66.4,222.0 C65.8,221.0 65.2,219.9 64.5,218.9 C63.8,217.9 63.0,217.1 62.3,216.1 C61.6,215.1 60.8,213.9 60.1,213.1 C59.4,212.3 58.8,211.6 58.1,211.1 C57.4,210.6 56.5,210.3 55.7,210.1 C54.9,209.9 53.9,209.8 53.1,209.9 C52.3,210.0 51.5,210.2 50.7,210.5 C49.9,210.8 49.3,211.4 48.3,211.7 C47.3,212.0 45.8,212.5 44.5,212.5 C43.2,212.5 41.8,212.2 40.5,211.9 C39.2,211.6 37.8,211.2 36.5,210.9 C35.2,210.6 34.0,210.1 33.0,209.9 C32.0,209.7 31.2,209.5 30.5,209.4 Z",
      patch: { d: "M44.78,268 A129.10,129.10 0 0 1 32.19,204 L62,204 L74,212 L74,258 L58,270 Z", fill: "url(#jp-armL-patch)" },
    },
    {
      k: "armR", pivot: [257, 279], front: true,
      cut: ARM_R_CUT,
      // The arm's dark rim lies over the right foot as well, so that's taken out of the body with it (the
      // foot's top is painted back in under it, moving with the foot: see footR)
      hole: `${ARM_R_CUT} ${FOOT_R_UNDER}`,
      patch: { d: "M243.5,275.2 C244.3,274.8 245.4,274.1 246.5,273.6 C247.6,273.1 248.8,272.6 250.0,272.2 C251.2,271.8 252.5,271.5 254.0,271.4 C255.5,271.2 257.4,271.3 259.0,271.3 C260.6,271.3 262.1,271.4 263.5,271.6 C264.9,271.8 266.2,272.0 267.2,272.4 C268.2,272.8 269.0,273.3 269.7,273.9 C270.4,274.5 270.8,275.2 271.2,276.1 C271.6,277.0 271.8,278.0 271.9,279.0 C272.0,280.0 272.0,281.0 272.1,282.0 C272.2,283.0 272.4,284.0 272.6,285.0 C272.8,286.0 273.2,287.0 273.5,288.0 C273.8,289.0 274.2,290.0 274.5,291.0 C274.8,292.0 275.1,293.0 275.5,294.0 C275.9,295.0 276.3,296.0 276.6,297.0 C276.9,298.0 277.1,298.8 277.2,300.0 C277.3,301.2 277.4,302.7 277.4,304.0 C277.4,305.3 277.4,306.7 277.4,308.0 C277.4,309.3 277.6,310.7 277.4,312.0 C277.2,313.3 276.4,314.8 276.1,316.0 C275.8,317.2 275.7,318.0 275.5,319.0 C275.3,320.0 275.0,321.0 274.8,322.0 C274.6,323.0 274.4,324.0 274.2,325.0 C274.0,326.0 273.7,327.0 273.5,328.0 C273.3,329.0 273.1,330.1 272.9,331.0 C272.7,331.9 272.5,332.8 272.2,333.5 C271.9,334.2 271.5,334.9 271.2,335.5 C270.9,336.1 270.6,336.7 270.3,337.3 C270.0,337.9 269.8,338.7 269.6,339.3 C269.4,339.9 269.2,340.6 269.0,341.2 C268.8,341.8 268.7,342.3 268.3,342.8 C267.9,343.3 267.2,343.8 266.6,344.3 C266.0,344.8 265.3,345.4 264.6,345.9 C263.9,346.4 263.1,346.8 262.2,347.2 C261.3,347.6 260.1,348.0 259.1,348.1 C258.1,348.2 257.0,348.2 256.0,348.1 C255.0,348.0 254.1,347.8 253.3,347.5 C252.5,347.2 251.7,346.6 251.0,346.2 C250.3,345.8 249.8,345.3 249.3,344.9 C248.8,344.4 248.4,343.9 248.0,343.5 C247.6,343.1 247.3,342.6 246.9,342.2 C246.5,341.8 246.2,341.3 245.8,340.8 C245.4,340.3 245.1,339.9 244.7,339.4 C244.3,338.9 244.0,338.4 243.6,337.8 C243.2,337.2 242.8,336.4 242.4,335.6 C242.0,334.9 241.6,334.1 241.2,333.3 C240.8,332.5 240.3,331.8 239.9,331.0 C239.5,330.2 239.1,329.5 238.6,328.8 C238.1,328.1 237.6,327.3 237.1,326.6 C236.6,325.9 236.0,325.2 235.4,324.6 C234.8,324.0 234.1,323.3 233.4,322.7 C232.7,322.1 231.9,321.5 231.2,320.9 C230.5,320.3 229.8,319.6 229.2,319.0 C228.6,318.4 228.1,317.7 227.6,317.0 C227.1,316.3 226.7,315.6 226.3,314.8 C225.9,314.0 225.6,313.2 225.3,312.4 C225.0,311.6 224.7,310.7 224.4,309.8 C224.1,308.9 223.8,308.0 223.6,307.0 C223.4,306.0 223.2,305.0 223.1,304.0 C223.0,303.0 223.1,302.0 223.2,301.0 C223.3,300.0 223.6,298.9 223.9,298.0 C224.2,297.1 224.6,296.2 225.1,295.3 C225.6,294.4 226.1,293.7 226.7,292.9 C227.3,292.1 227.9,291.4 228.5,290.7 C229.1,290.0 229.7,289.3 230.3,288.6 C230.9,287.9 231.4,287.3 231.9,286.6 C232.4,285.9 232.9,285.2 233.4,284.5 C233.9,283.8 234.4,283.2 234.9,282.5 C235.4,281.8 235.9,281.1 236.5,280.5 C237.1,279.9 237.7,279.2 238.3,278.6 C239.0,278.0 239.8,277.3 240.4,276.9 C241.0,276.5 241.4,276.3 241.9,276.0 C242.4,275.7 242.7,275.6 243.5,275.2 Z", fill: "url(#jp-armR-fill)" },
    },
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
      {/* Repaints under the arms (fitted to the body's shading around each), and the top of the right foot */}
      <radialGradient id="jp-armL-patch" gradientUnits="userSpaceOnUse" cx="120.5" cy="226.5" r="109" gradientTransform="matrix(1 0 0 0.54 0 104.19)"><stop offset="0.000" stopColor="#FFDAE2" /><stop offset="0.427" stopColor="#F6CAD4" /><stop offset="0.511" stopColor="#F3C7D0" /><stop offset="0.595" stopColor="#F0C3CD" /><stop offset="0.679" stopColor="#EBBFC8" /><stop offset="0.764" stopColor="#E7BAC3" /><stop offset="0.848" stopColor="#E5B7C0" /><stop offset="0.932" stopColor="#E1B0B9" /><stop offset="0.988" stopColor="#E6B5BD" /></radialGradient>
      <radialGradient id="jp-armR-body" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="640" gradientTransform="translate(194 122) rotate(150) scale(1 0.368475)"><stop offset="0.6328" stopColor="#FBCFD9" /><stop offset="0.6736" stopColor="#F1C4CE" /><stop offset="0.7144" stopColor="#E9BCC5" /><stop offset="0.7552" stopColor="#E4B5BE" /><stop offset="0.7960" stopColor="#E0B1BA" /><stop offset="0.8368" stopColor="#DEAEB7" /><stop offset="0.8776" stopColor="#DFAEB6" /><stop offset="0.9184" stopColor="#E2AFB7" /><stop offset="0.9592" stopColor="#E6B2BB" /><stop offset="1.0000" stopColor="#EDB7C0" /></radialGradient><linearGradient id="jp-footR-under" gradientUnits="userSpaceOnUse" x1="251.2" y1="335.2" x2="259.8" y2="351.0"><stop offset="0" stopColor="#C8949E" /><stop offset="1" stopColor="#DDAEB8" /></linearGradient><pattern id="jp-armR-fill" patternUnits="userSpaceOnUse" x="0" y="0" width="396" height="398"><path d="M200,250 H300 V364 H200 Z M232.0,342.4 C232.7,342.3 234.7,341.9 236.0,341.6 C237.3,341.3 238.8,340.7 240.0,340.4 C241.2,340.1 242.1,339.9 243.0,339.7 C243.9,339.5 244.5,339.4 245.5,339.2 C246.5,339.0 247.8,338.8 249.0,338.7 C250.2,338.6 251.5,338.4 253.0,338.3 C254.5,338.2 256.3,338.1 258.0,338.1 C259.7,338.1 261.5,338.1 263.0,338.2 C264.5,338.3 265.8,338.4 267.0,338.5 C268.2,338.6 269.1,338.8 270.0,338.9 C270.9,339.0 272.2,339.1 272.6,339.1 L284,338.6 L284,364 L226,364 L226,342.4 Z" fillRule="evenodd" fill="url(#jp-armR-body)" /><circle cx="271.2" cy="276.5" r="5" fill="url(#jp-armR-lit)" /><circle cx="277" cy="287.5" r="5" fill="url(#jp-armR-shade)" /><circle cx="229" cy="319.3" r="4.5" fill="url(#jp-armR-hollow)" /></pattern><radialGradient id="jp-armR-lit" gradientUnits="userSpaceOnUse" cx="271.2" cy="276.5" r="5"><stop offset="0" stopColor="#F8D3DA" stopOpacity="0.3" /><stop offset="1" stopColor="#F8D3DA" stopOpacity="0" /></radialGradient><radialGradient id="jp-armR-shade" gradientUnits="userSpaceOnUse" cx="277" cy="287.5" r="5"><stop offset="0" stopColor="#C28D98" stopOpacity="0.16" /><stop offset="1" stopColor="#C28D98" stopOpacity="0" /></radialGradient><radialGradient id="jp-armR-hollow" gradientUnits="userSpaceOnUse" cx="229" cy="319.3" r="4.5"><stop offset="0" stopColor="#C08B96" stopOpacity="0.1" /><stop offset="1" stopColor="#C08B96" stopOpacity="0" /></radialGradient>
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
      p.ears = Math.sin(secs * 16) * 9;
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
