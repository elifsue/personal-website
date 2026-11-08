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

/** Not something Metronome can turn into */
const NOT_IN_POOL = ["metronome", "surprised"];
/** What it says when Metronome turns into these (otherwise "It turned into …!") */
const TURNED_INTO: Record<string, string> = {
  splash: "Splash! …But nothing happened.",
  celebrate: "It turned into Celebrate! 🎉",
  earthquake: "It turned into Earthquake! 🌋",
  gravity: "It turned into Gravity! 🪐",
  teleport: "It turned into Teleport! ✨",
};
const smooth = (t: number) => {
  const k = clamp(t, 0, 1);
  return k * k * (3 - 2 * k);
};
/** Jigglypuff, when she's close by, up where Togepi is, and free to be tickled */
const ticklish = (ctx: Ctx, c: CharacterState) => {
  const jp = ctx.world.jigglypuff;
  return jp && !jp.action && !jp.held && jp.sleep < 0.5 && ctx.now >= jp.forcedSleepUntil && ctx.sameLevel(c, jp) && Math.abs(jp.x - c.x) < 220 ? jp : null;
};
/** Some place on what it's standing on, well away from where it is now (or as far as it can get) */
const elsewhere = (ctx: Ctx, c: CharacterState) => {
  const [a, b] = ctx.bounds(c);
  for (let i = 0; i < 10; i++) {
    const x = rand(a, b);
    if (Math.abs(x - c.x) > 160) return x;
  }
  return c.x - a > b - c.x ? a : b;
};
const CONFETTI = ["#FF7A93", "#FFD43B", "#4DABF7", "#69DB7C", "#B197FC", "#FFA94D"];
/** Teleport: gone at this point (seconds), and back here */
const BLINK_OUT = 0.45;
const BLINK_IN = 0.55;
/** Celebrate: when the confetti pops (seconds) */
const POP_AT = 0.75;
/** Rain Dance: when the cloud rolls in (seconds) */
const RAIN_AT = 0.8;
/** Bounce timeline, seconds: crouch → in the air → landed */
const SPRING = 0.2;
const TOUCHDOWN = 1.05;
/** Earthquake: the stomp (seconds) and how long the ground shakes after it (ms); when Jigglypuff's knocked over (s) */
const STOMP = 0.3;
const QUAKE_MS = 1800;
const KNOCKED = 0.8;
/** Gravity, ms: everything comes down, sits in a heap, and floats back up */
const GRAVITY_MS = 3000;

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
      // Now and then it just turns into Metronome again, and has another go
      if (c.lastMove !== "metronome" && Math.random() < 0.1) {
        c.lastMove = "metronome";
        ctx.useMove(c, "metronome", "…It turned into Metronome?!");
        ctx.page.sway();
        return;
      }
      const pool = Object.keys(moves).filter((k) => !NOT_IN_POOL.includes(k) && k !== c.lastMove && (k !== "tickle" || ticklish(ctx, c)));
      const key = pool[Math.floor(Math.random() * pool.length)];
      c.lastMove = key;
      ctx.useMove(c, key, TURNED_INTO[key] ?? `It turned into ${moves[key].name}!`);
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
      ctx.page.swift(from); // …and off across the page
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
      ctx.page.blush();
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
      ctx.page.lullaby(MOVE_MS); // (and the page nods off too, for a moment)
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
      ctx.page.thunder();
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
      ctx.page.underwater();
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
      ctx.page.minimize();
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
    start: (ctx, c) => {
      ctx.spawn(SHAPES.sweat(), ctx.point(c, 300, 60), 8, 18, { dur: 1300, delay: 500 });
      ctx.page.splash(900); // all that, for one drop
    },
    pose: (p, at) => {
      const k = Math.min(1, at / 0.9);
      p.hop = Math.abs(Math.sin(k * Math.PI * 2)) * 8 * (1 - k);
      // Flails, then gives up
      p.raiseL = at < 0.9 ? 20 + Math.sin(at * 28) * 22 : -10;
      p.raiseR = at < 0.9 ? 20 - Math.sin(at * 28) * 22 : -10;
      if (at > 0.9) p.eye = "closed";
    },
  },
  /* ── More of what Metronome can turn into ── */
  teleport: {
    name: "Teleport",
    dur: 1500,
    start: (ctx, c) => {
      const at = ctx.point(c, 190, 220);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        ctx.spawn(SHAPES.sparkle(rand(10, 14)), at, Math.cos(a) * 34, Math.sin(a) * 34, { dur: 700, delay: 250 });
      }
      ctx.page.blink(BLINK_OUT * 1000 - 100); // the screen loses it for a moment as it goes
    },
    tick: (ctx, c, at) => {
      const d = c.action!.data;
      if (at >= BLINK_OUT && !d.moved) {
        // Gone… and somewhere else
        d.moved = 1;
        c.x = c.tx = elsewhere(ctx, c);
        c.v = 0;
        const to = ctx.point(c, 190, 220);
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2;
          ctx.spawn(SHAPES.sparkle(rand(10, 14)), { x: to.x + Math.cos(a) * 34, y: to.y + Math.sin(a) * 34 }, -Math.cos(a) * 30, -Math.sin(a) * 30, { dur: 600 });
        }
      }
    },
    pose: (p, at) => {
      // Spins down to nothing, then pops back up wherever it's got to
      p.raiseL = p.raiseR = 55;
      if (at < BLINK_OUT) {
        const k = smooth(at / BLINK_OUT);
        p.shrink = 1 - 0.97 * k;
        p.spin = 360 * k;
        p.eye = "closed";
      } else if (at < BLINK_IN) {
        p.shrink = 0.03;
      } else {
        const k = Math.min(1, (at - BLINK_IN) / 0.45);
        p.shrink = 0.03 + 0.97 * easeOutBack(k);
        p.spin = 360 * (1 - smooth(k));
        p.eye = k < 1 ? "happy" : "open";
      }
    },
  },
  rainDance: {
    name: "Rain Dance",
    dur: 2700,
    start: (ctx, c) => {
      // Says what it turned into only briefly: the cloud comes where the speech bubble is
      ctx.say(c, "It turned into Rain Dance!", RAIN_AT * 1000);
      // A little rain cloud right over its head, drizzling on it
      const head = ctx.point(c, 190, 0);
      ctx.spawn(SHAPES.cloud(62), { x: head.x, y: head.y - 34 }, 0, -6, { dur: 1900, delay: RAIN_AT * 1000 });
      for (let i = 0; i < 16; i++) {
        ctx.spawn(SHAPES.sweat(rand(7, 9)), { x: head.x + rand(-20, 20), y: head.y - 22 }, rand(-2, 2), rand(30, 42), { dur: 480, delay: RAIN_AT * 1000 + 300 + i * 85 });
      }
      ctx.page.rain(RAIN_AT * 1000 + 200); // …and everywhere else
    },
    tick: (ctx, c, at) => {
      const d = c.action!.data;
      if (at >= RAIN_AT + 1.75 && !d.shake) {
        // …and shakes itself dry
        d.shake = 1;
        const mid = ctx.point(c, 190, 200);
        for (let i = 0; i < 6; i++) {
          const side = i % 2 ? 1 : -1;
          ctx.spawn(SHAPES.sweat(rand(7, 10)), mid, side * rand(30, 50), rand(-28, -6), { dur: 500, delay: i * 30, rot: side * 70 });
        }
      }
    },
    pose: (p, at, c, ctx) => {
      if (at < RAIN_AT) {
        // A little rain dance: sways, arms waving, calling the cloud in
        p.rot = Math.sin(at * 9) * 7;
        p.raiseL = 40 + Math.sin(at * 9) * 25;
        p.raiseR = 40 - Math.sin(at * 9) * 25;
        p.eye = "closed";
      } else if (at < RAIN_AT + 1.7) {
        // Peers up at the cloud, arms up over its head
        const k = Math.min(1, (at - RAIN_AT) / 0.3);
        const head = ctx.point(c, 190, 0);
        p.look = { x: head.x, y: head.y - 60 };
        p.raiseL = p.raiseR = 62 * k;
        p.sy *= 1 - 0.03 * k;
      } else {
        const k = at - RAIN_AT - 1.7;
        p.rot = Math.sin(k * 45) * 7 * Math.max(0, 1 - k / 0.4);
        p.raiseL = p.raiseR = 20;
        p.eye = "closed";
      }
    },
  },
  celebrate: {
    name: "Celebrate",
    dur: 1900 + POP_AT * 1000,
    start: (ctx, c) => {
      // Says it only briefly while it winds up: the confetti bursts out where the speech bubble is
      ctx.say(c, TURNED_INTO.celebrate, POP_AT * 1000 + 250);
      // Confetti bursting out to both sides, then fluttering down around it
      const head = ctx.point(c, 190, 0);
      const pop = POP_AT * 1000;
      for (let i = 0; i < 32; i++) {
        const side = i % 2 ? 1 : -1;
        ctx.spawn(SHAPES.confetti(rand(14, 18), CONFETTI[i % CONFETTI.length]), { x: head.x + side * 10, y: head.y + 6 }, side * rand(50, 160), rand(-120, -30), {
          dur: rand(1100, 1500), delay: pop + rand(0, 150), rot: rand(-500, 500),
        });
      }
      for (let i = 0; i < 26; i++) {
        const side = i % 2 ? 1 : -1;
        ctx.spawn(SHAPES.confetti(rand(13, 17), CONFETTI[(i + 3) % CONFETTI.length]), { x: head.x + side * rand(40, 160), y: head.y - rand(40, 100) }, rand(-15, 15), rand(100, 160), {
          dur: rand(1300, 1800), delay: pop + rand(400, 800), sway: rand(-16, 16), rot: rand(-400, 400),
        });
      }
      ctx.page.confetti(pop); // (all over the page)
    },
    pose: (p, at) => {
      if (at < POP_AT) {
        // Crouches, bursting with it…
        const k = smooth(at / POP_AT);
        p.sy *= 1 - 0.1 * k;
        p.sx *= 1 + 0.06 * k;
        p.raiseL = p.raiseR = -10 * k;
        p.eye = "happy";
        return;
      }
      // …then two happy hops, arms waving
      at -= POP_AT;
      const h = at < 1.2 ? Math.abs(Math.sin(at * Math.PI * (2 / 1.2))) : 0;
      p.hop = h * 16;
      p.sy *= 1 + 0.05 * h;
      p.raiseL = 70 + Math.sin(at * 16) * 16;
      p.raiseR = 70 - Math.sin(at * 16) * 16;
      p.tiltL = p.tiltR = 12 * h;
      p.eye = "happy";
      p.blush = 0.8;
    },
  },
  bounce: {
    name: "Bounce",
    dur: 1500,
    tick: (ctx, c, at) => {
      const d = c.action!.data;
      if (at >= TOUCHDOWN && !d.landed) {
        d.landed = 1;
        ctx.page.bounce(0);
        ctx.spawn(SHAPES.dust(15), ctx.point(c, 120, 390), -14, -8, { dur: 500 });
        ctx.spawn(SHAPES.dust(15), ctx.point(c, 260, 390), 14, -8, { dur: 500 });
      }
    },
    pose: (p, at, c) => {
      if (at < SPRING) {
        // Crouches…
        const k = at / SPRING;
        p.sy *= 1 - 0.16 * k;
        p.sx *= 1 + 0.1 * k;
        p.raiseL = p.raiseR = -12 * k;
      } else if (at < TOUCHDOWN) {
        // …springs right up, somersaulting at the top…
        const k = (at - SPRING) / (TOUCHDOWN - SPRING);
        p.hop = Math.sin(Math.PI * k) * 110;
        p.spin = 360 * smooth((k - 0.25) / 0.5) * (c.facing > 0 ? 1 : -1);
        p.sy *= 1 + 0.1 * Math.max(0, 1 - k * 4);
        p.raiseL = p.raiseR = 75;
        p.tiltL = p.tiltR = 20;
        p.eye = "happy";
      } else {
        // …and lands with a squash
        const s = Math.sin(Math.min(1, (at - TOUCHDOWN) / 0.25) * Math.PI);
        p.sy *= 1 - 0.18 * s;
        p.sx *= 1 + 0.14 * s;
        p.raiseL = p.raiseR = 40;
      }
    },
  },
  tickle: {
    name: "Tickle",
    dur: 1800,
    tick: (ctx, c, at) => {
      const d = c.action!.data;
      const jp = ctx.world.jigglypuff;
      if (jp) c.wantFacing = Math.sign(jp.x - c.x) || c.wantFacing;
      if (at >= 0.35 && !d.giggle) {
        d.giggle = 1;
        const victim = ticklish(ctx, c);
        if (victim) ctx.useMove(victim, "giggle", "Puff-hee-hee! 🤭");
        ctx.page.tickle();
      }
    },
    pose: (p, at, c, ctx) => {
      // Leans in toward her, wiggling its arms
      const jp = ctx.world.jigglypuff;
      const dir = jp ? Math.sign(jp.x - c.x) || 1 : 1;
      p.rot = 6 * dir * Math.min(1, at / 0.25);
      p.raiseL = 45 + Math.sin(at * 42) * 20;
      p.raiseR = 45 - Math.sin(at * 42) * 20;
      p.eye = "happy";
    },
  },
  dazzlingGleam: {
    name: "Dazzling Gleam",
    dur: 1900,
    start: (ctx, c) => {
      // A rainbow over its head, and a burst of sparkles
      const head = ctx.point(c, 190, 0);
      ctx.spawn(SHAPES.rainbow(130), { x: head.x, y: head.y - 10 }, 0, -14, { dur: 1800 });
      const mid = ctx.point(c, 190, 200);
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        ctx.spawn(SHAPES.sparkle(rand(10, 15)), mid, Math.cos(a) * 70, Math.sin(a) * 60, { dur: 900, delay: 100 + (i % 2) * 120 });
      }
      ctx.flash(c);
      ctx.page.gleam();
    },
    pose: (p, at) => {
      p.hop = Math.sin(Math.min(1, at / 1.6) * Math.PI) * 8;
      p.raiseL = p.raiseR = 68 * Math.min(1, at / 0.2);
      p.eye = "happy";
    },
  },
  earthquake: {
    name: "Earthquake",
    dur: STOMP * 1000 + QUAKE_MS,
    tick: (ctx, c, at) => {
      const d = c.action!.data;
      if (at >= STOMP && !d.stomped) {
        // Stamps down, and the ground starts to shake
        d.stomped = 1;
        ctx.page.quake(QUAKE_MS);
        ctx.spawn(SHAPES.dust(16), ctx.point(c, 120, 390), -18, -8, { dur: 550 });
        ctx.spawn(SHAPES.dust(16), ctx.point(c, 260, 390), 18, -8, { dur: 550 });
      }
      if (at >= KNOCKED && !d.knocked) {
        // …and Jigglypuff's knocked clean off her feet
        d.knocked = 1;
        const jp = ctx.world.jigglypuff;
        const grounded = jp && (jp.perch || (jp.lift <= 0 && jp.lv <= 0)) && !jp.leapStart && !jp.crouchAt;
        if (jp && grounded && !jp.action && !jp.held && jp.sleep < 0.5 && ctx.now >= jp.forcedSleepUntil) ctx.useMove(jp, "tumble", "Puff?! 😵");
      }
    },
    pose: (p, at) => {
      if (at < STOMP) {
        // Up on one foot, arms high…
        const k = at / STOMP;
        p.hop = Math.sin(k * Math.PI) * 14;
        p.liftR = 18 * Math.sin(k * Math.PI);
        p.raiseL = p.raiseR = 65;
      } else {
        // …stamp! Then wobbling to keep its balance as the ground shakes
        const k = Math.max(0, 1 - (at - STOMP) / (QUAKE_MS / 1000));
        const land = Math.max(0, 1 - (at - STOMP) / 0.12);
        p.sy *= 1 - 0.12 * land;
        p.sx *= 1 + 0.08 * land;
        p.rot = Math.sin(at * 38) * 5 * k;
        p.raiseL = 40 + Math.sin(at * 26) * 22 * k;
        p.raiseR = 40 - Math.sin(at * 26) * 22 * k;
      }
    },
  },
  gravity: {
    name: "Gravity",
    dur: GRAVITY_MS,
    start: (ctx) => ctx.page.gravity(GRAVITY_MS - 200),
    pose: (p, at) => {
      const s = GRAVITY_MS / 1000;
      if (at < 0.25 * s) {
        // Pushes down with both arms, and everything comes down with it…
        const k = smooth(at / (0.25 * s));
        p.raiseL = p.raiseR = 70 - 100 * k;
        p.sy *= 1 - 0.1 * k;
        p.sx *= 1 + 0.06 * k;
      } else if (at < 0.62 * s) {
        // …heavy, squashed, holding it there…
        p.raiseL = p.raiseR = -30;
        p.sy *= 0.9;
        p.sx *= 1.06;
        p.eye = "closed";
      } else {
        // …then lets go, and it all floats back up
        const k = smooth((at - 0.62 * s) / (0.3 * s));
        p.raiseL = p.raiseR = -30 + 110 * k;
        p.sy *= 0.9 + 0.1 * k;
        p.sx *= 1.06 - 0.06 * k;
        p.hop = Math.sin(k * Math.PI) * 10;
        p.eye = "happy";
      }
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
    // Traced from the artwork's pixels. Each limb's hole is just the part outside the shell (following the
    // shell's edge); the limb carries on, hidden, behind the shell so it never shows a cut edge or a gap
    // as it moves. The left arm's hidden part is painted the arm's colour (the shell behind it is white)
    {
      k: "armL", pivot: [56, 189.2],
      hole: "M-10,112 40,112 49.6,140 48.9,144 48.3,146.5 48.1,147.5 48.28,148.3 48.32,149 48.33,150 48.35,151 48.08,152 47.81,153 47.53,154 47.38,155 47.07,156 46.95,157 46.79,158 46.56,159 46.25,160 46.06,161 45.89,162 45.5,163 45.27,164 45.08,165 44.8,166 44.47,167 44.3,168 44.09,169 43.77,170 43.47,171 43.25,172 43.04,173 42.74,174 42.33,175 42.01,176 41.84,177 41.35,178 41.09,179 40.87,180 40.49,181 40.23,182 39.84,183 39.48,184 39.21,185 39.06,186 39.04,187 38.86,188 38.74,189 38.64,190 38.24,191 38.1,192 37.96,193 37.89,194 37.38,195 37.26,196 37.14,197 36.76,198 36.53,199 36.27,200 35.83,201 35.9,201.6 35.1,202 34,202.3 28,205 -10,210 Z",
      cut: "M-10,112 40,112 49.6,140 48.9,144 48.3,146.5 48.1,147.5 48.28,148.3 48.32,149 48.33,150 48.35,151 48.08,152 47.81,153 47.53,154 47.38,155 47.07,156 46.95,157 46.79,158 46.56,159 46.25,160 46.06,161 45.89,162 45.5,163 45.27,164 45.08,165 44.8,166 44.47,167 44.3,168 44.09,169 43.77,170 43.47,171 43.25,172 43.04,173 42.74,174 42.33,175 42.01,176 41.84,177 41.35,178 41.09,179 40.87,180 40.49,181 40.23,182 39.84,183 39.48,184 39.21,185 39.06,186 39.04,187 38.86,188 38.74,189 38.64,190 38.24,191 38.1,192 37.96,193 37.89,194 37.38,195 37.26,196 37.14,197 36.76,198 36.53,199 36.27,200 35.83,201 35.9,201.6 35.1,202 34,202.3 28,205 -10,210 Z M44.5,145.65 L72.03,173.17 A22.66,22.66 0 0 1 72.03,205.23 A22.66,22.66 0 0 1 39.97,205.23 L32.8,198.05 44.5,145.65 Z",
      over: { d: "M46.9,147.2 L72.45,172.75 A23.26,23.26 0 0 1 72.45,205.65 A23.26,23.26 0 0 1 39.55,205.65 L33.1,199.2 33.06,198 33.56,196 34.19,194 34.4,192 34.94,190 35.16,188 35.36,186 35.78,184 36.53,182 37.17,180 37.65,178 38.31,176 39.04,174 39.55,172 40.07,170 40.6,168 41.1,166 41.57,164 42.19,162 42.55,160 43.09,158 43.37,156 43.83,154 44.38,152 44.63,150 44.68,148 45.4,147 46.9,147.2 Z", fill: "url(#tg-armL-base)" },
    },
    // The right arm's base lies over the shell in the artwork, so it's drawn in front, and the shell is
    // repainted (with its rim) where it was
    {
      k: "armR", pivot: [334, 202], front: true,
      hole: "M368.7,202.0 367.7,202.7 367.7,203.3 367.1,204.0 366.4,204.6 365.9,205.1 365.3,205.7 364.7,206.2 364.3,206.7 363.8,207.2 363.3,207.7 362.9,208.2 362.5,208.7 362.4,209.2 361.6,209.5 361.4,210.0 360.9,210.4 360.5,210.8 360.3,211.3 359.7,211.6 359.4,212.1 359.0,212.4 358.6,212.8 358.4,213.3 357.9,213.5 357.5,213.9 357.3,214.4 356.7,214.5 356.3,214.9 356.0,215.3 355.6,215.6 354.9,215.6 354.6,216.0 354.4,216.5 353.8,216.6 353.3,216.8 353.1,217.2 352.6,217.4 352.2,217.7 351.6,217.7 351.5,218.5 351.1,218.7 350.5,218.8 350.3,219.4 349.9,219.6 349.3,219.7 349.0,220.2 348.5,220.5 348.1,220.6 347.5,220.7 347.2,221.5 346.7,221.6 346.3,222.1 345.8,222.6 345.3,222.7 344.8,223.0 344.3,223.6 343.7,223.7 343.1,223.8 342.6,223.8 342.0,224.7 341.4,224.7 340.8,225.6 340.1,225.7 339.5,225.8 338.7,226.7 338.1,226.7 337.3,227.5 336.6,227.6 335.8,227.7 334.9,228.4 334.1,228.6 333.3,228.6 332.6,228.7 331.8,228.7 330.7,229.3 329.8,229.5 328.9,229.5 327.6,230.2 325.5,230.6 324.2,231.0 323.5,230.5 322.4,230.5 321.3,230.5 320.3,230.3 319.3,230.0 318.5,229.5 317.3,229.4 316.4,229.0 315.6,228.4 315.2,227.4 314.7,226.6 314.5,225.5 313.9,224.7 313.5,223.9 313.4,222.7 312.8,222.1 312.5,221.2 312.3,220.2 311.7,219.5 311.6,218.5 311.5,217.5 311.5,216.6 311.5,215.6 311.5,214.6 311.5,213.7 311.5,212.8 311.5,211.9 311.0,211.2 310.6,210.4 310.6,209.5 310.5,208.7 310.3,207.9 310.2,207.0 310.2,206.2 310.2,205.3 310.2,204.5 310.3,203.7 310.4,202.8 310.4,202.0 310.4,201.2 310.3,200.3 310.2,199.5 310.2,198.7 310.2,197.8 310.2,197.0 310.2,196.1 310.4,195.3 310.4,194.4 310.4,193.5 310.6,192.7 310.6,191.8 311.1,191.1 311.5,190.3 311.5,189.4 311.8,188.5 312.3,187.8 312.5,187.0 312.6,186.1 313.4,185.5 313.6,184.6 314.1,183.9 315.1,183.5 315.8,183.0 316.7,182.6 317.7,182.3 318.2,181.7 319.0,181.3 319.6,180.7 320.5,180.5 320.9,179.8 321.8,179.6 322.7,179.4 323.2,178.8 324.0,178.5 324.8,178.4 325.2,177.6 326.0,177.3 326.9,177.4 327.7,177.3 328.4,177.0 329.0,176.4 329.8,176.4 330.5,176.2 331.0,175.5 331.8,175.3 332.6,175.3 333.1,174.7 333.8,174.4 334.6,174.3 335.3,174.1 336.0,173.8 336.7,173.6 337.5,173.6 338.2,173.3 339.0,173.3 339.7,173.3 340.5,173.2 341.2,172.8 342.0,172.4 342.8,172.3 343.6,172.3 344.3,172.3 345.1,172.3 346.0,171.9 346.8,171.5 347.7,171.4 348.5,171.3 349.4,171.3 350.2,171.3 351.1,171.3 352.0,171.3 352.9,171.3 353.8,171.3 354.7,171.3 355.7,171.3 356.6,171.3 357.8,170.9 359.0,170.6 360.1,170.6 361.2,170.7 361.9,171.3 363.1,171.3 364.3,171.3 365.5,171.4 366.6,171.6 367.8,171.8 368.7,172.3 370.2,172.3 371.4,172.6 372.2,173.4 373.3,173.8 374.2,174.5 374.9,175.4 375.6,176.2 376.5,176.9 376.7,178.2 377.6,178.9 377.6,180.2 377.7,181.4 377.7,182.6 377.7,183.8 377.7,185.0 377.5,186.2 376.7,187.6 376.7,188.7 376.5,189.8 375.7,191.1 375.5,192.1 374.6,193.3 373.7,194.4 373.6,195.3 372.8,196.3 372.3,197.2 371.6,198.1 370.7,199.0 370.3,199.8 369.7,200.6 369.3,201.3 Z",
      cut: "M368.7,202.0 367.7,202.7 367.7,203.3 367.1,204.0 366.4,204.6 365.9,205.1 365.3,205.7 364.7,206.2 364.3,206.7 363.8,207.2 363.3,207.7 362.9,208.2 362.5,208.7 362.4,209.2 361.6,209.5 361.4,210.0 360.9,210.4 360.5,210.8 360.3,211.3 359.7,211.6 359.4,212.1 359.0,212.4 358.6,212.8 358.4,213.3 357.9,213.5 357.5,213.9 357.3,214.4 356.7,214.5 356.3,214.9 356.0,215.3 355.6,215.6 354.9,215.6 354.6,216.0 354.4,216.5 353.8,216.6 353.3,216.8 353.1,217.2 352.6,217.4 352.2,217.7 351.6,217.7 351.5,218.5 351.1,218.7 350.5,218.8 350.3,219.4 349.9,219.6 349.3,219.7 349.0,220.2 348.5,220.5 348.1,220.6 347.5,220.7 347.2,221.5 346.7,221.6 346.3,222.1 345.8,222.6 345.3,222.7 344.8,223.0 344.3,223.6 343.7,223.7 343.1,223.8 342.6,223.8 342.0,224.7 341.4,224.7 340.8,225.6 340.1,225.7 339.5,225.8 338.7,226.7 338.1,226.7 337.3,227.5 336.6,227.6 335.8,227.7 334.9,228.4 334.1,228.6 333.3,228.6 332.6,228.7 331.8,228.7 330.7,229.3 329.8,229.5 328.9,229.5 327.6,230.2 326.7,230.1 325.6,230.3 324.6,230.4 323.6,230.3 322.6,230.2 321.6,230.1 320.6,229.8 319.8,229.4 318.7,229.3 317.6,229.1 316.8,228.5 316.0,228.0 315.6,227.1 315.0,226.3 314.8,225.3 314.4,224.3 313.9,223.6 313.8,222.5 313.2,221.8 312.9,220.9 312.7,220.0 312.3,219.2 312.0,218.3 312.0,217.3 311.9,216.3 311.9,215.4 311.9,214.5 311.8,213.6 311.8,212.7 311.8,211.8 311.6,211.0 311.2,210.3 311.1,209.4 310.9,208.6 310.7,207.8 310.7,207.0 310.7,206.1 310.7,205.3 310.7,204.5 310.7,203.6 310.7,202.8 310.7,202.0 310.7,201.2 310.7,200.4 310.7,199.5 310.7,198.7 310.7,197.9 310.7,197.0 310.7,196.2 310.7,195.3 310.7,194.5 310.8,193.6 310.9,192.8 311.2,192.0 311.6,191.3 311.8,190.4 312.0,189.6 312.3,188.8 312.7,188.0 312.9,187.2 313.1,186.3 313.7,185.6 313.9,184.8 314.6,184.2 315.5,183.8 316.3,183.3 317.1,182.9 318.1,182.6 318.7,182.1 319.3,181.6 319.9,181.1 320.7,180.7 321.3,180.2 322.1,179.9 322.9,179.6 323.6,179.2 324.3,178.9 325.1,178.7 325.2,177.6 326.0,177.3 326.9,177.4 327.7,177.3 328.4,177.0 329.0,176.4 329.8,176.4 330.5,176.2 331.0,175.5 331.8,175.3 332.6,175.3 333.1,174.7 333.8,174.4 334.6,174.3 335.3,174.1 336.0,173.8 336.7,173.6 337.5,173.6 338.2,173.3 339.0,173.3 339.7,173.3 340.5,173.2 341.2,172.8 342.0,172.4 342.8,172.3 343.6,172.3 344.3,172.3 345.1,172.3 346.0,171.9 346.8,171.5 347.7,171.4 348.5,171.3 349.4,171.3 350.2,171.3 351.1,171.3 352.0,171.3 352.9,171.3 353.8,171.3 354.7,171.3 355.7,171.3 356.6,171.3 357.8,170.9 359.0,170.6 360.1,170.6 361.2,170.7 361.9,171.3 363.1,171.3 364.3,171.3 365.5,171.4 366.6,171.6 367.8,171.8 368.7,172.3 370.2,172.3 371.4,172.6 372.2,173.4 373.3,173.8 374.2,174.5 374.9,175.4 375.6,176.2 376.5,176.9 376.7,178.2 377.6,178.9 377.6,180.2 377.7,181.4 377.7,182.6 377.7,183.8 377.7,185.0 377.5,186.2 376.7,187.6 376.7,188.7 376.5,189.8 375.7,191.1 375.5,192.1 374.6,193.3 373.7,194.4 373.6,195.3 372.8,196.3 372.3,197.2 371.6,198.1 370.7,199.0 370.3,199.8 369.7,200.6 369.3,201.3 Z",
      patch: { d: "M296.0,168.0 322.5,168.0 323.0,170.0 323.6,172.0 324.1,174.0 324.6,176.0 325.1,178.0 325.5,180.0 325.9,182.0 326.2,184.0 326.5,186.0 326.8,188.0 327.0,190.0 327.2,192.0 327.4,194.0 327.5,196.0 327.7,198.0 327.7,200.0 327.8,202.0 327.8,204.0 327.9,206.0 327.9,208.0 327.8,210.0 327.8,212.0 327.8,214.0 327.7,216.0 327.6,218.0 327.6,220.0 327.5,222.0 327.4,224.0 327.3,226.0 327.2,228.0 327.1,230.0 327.0,232.0 326.8,234.0 326.7,236.0 326.3,238.0 325.9,240.0 296.0,240.0 Z", fill: "#D2CEC8", stroke: "#DAD7D0", strokeWidth: 1.2 },
    },
    // Feet pivot at the heel, so the join only ever moves up into the shell
    {
      k: "footL", pivot: [155, 359.9],
      hole: "M80,333.95 82,333.55 84,333.15 86,332.75 88.2,332.56 89.7,333.45 91.2,334.2 92.7,334.89 94.2,335.63 95.7,336.5 97.2,337.48 98.7,338.44 100.2,339.36 101.7,340.23 103.2,341.07 104.7,341.89 106.2,342.69 107.7,343.47 109.2,344.23 110.7,344.98 112.2,345.71 113.7,346.41 115.2,347.09 116.7,347.74 118.2,348.38 119.7,349 121.2,349.61 122.7,350.2 124.2,350.77 125.7,351.33 127.2,351.89 128.7,352.43 130.2,352.94 131.7,353.43 133.2,353.89 134.7,354.34 136.2,354.77 137.7,355.19 139.2,355.6 140.7,355.99 142.2,356.35 143.7,356.69 144.5,356.86 145.5,357.11 146.5,357.43 147.5,357.8 148.5,358.19 149.5,358.59 150.5,358.97 151.5,359.3 152.5,359.57 153.5,359.75 154.5,359.93 155.5,360.05 155.75,360.5 152,360.6 150.9,363.6 147.5,366.4 144,368.8 137,372 130,374.2 124.5,375.8 118,377.3 110,378.9 102,380.2 94,381.3 86,382.3 78,383.3 70,384 62,384.6 55,384.3 49,382.8 44,380.3 40.3,376.5 38,371.5 37.8,366 39.4,361 42.4,356 46,351.5 50,347 55,343 61,339.4 67,336.6 72,335 76,334.4 Z",
      cut: "M80,333.95 82,333.55 84,333.15 86,332.75 87.5,332.4 88,331.95 89,331.85 91,331.6 95,330.3 99,329.3 103,328.7 107,328.3 111,328.2 115,328.4 119,328.9 123,329.7 127,330.8 131,332.2 135,334 138.5,336 141.5,338.4 144,341 146,344 147.4,347.2 148.3,350.4 148.9,353.6 149.6,356.2 151,357.7 152.4,358.4 153.4,358.9 154.6,359.3 155.7,359.75 155.75,360.5 152,360.6 150.9,363.6 147.5,366.4 144,368.8 137,372 130,374.2 124.5,375.8 118,377.3 110,378.9 102,380.2 94,381.3 86,382.3 78,383.3 70,384 62,384.6 55,384.3 49,382.8 44,380.3 40.3,376.5 38,371.5 37.8,366 39.4,361 42.4,356 46,351.5 50,347 55,343 61,339.4 67,336.6 72,335 76,334.4 Z",
    },
    {
      k: "footR", pivot: [194.5, 361.5],
      hole: "M190.5,362.6 192.5,362.4 193.6,362.1 194.5,361.9 196.0,361.6 198.0,361.4 200.0,361.2 202.0,361.1 204.0,360.9 206.0,360.6 208.0,360.3 210.0,359.9 212.0,359.5 214.0,359.0 216.0,358.6 218.0,358.1 220.0,357.5 222.0,357.0 224.0,356.4 226.0,355.9 228.0,355.3 230.0,354.7 232.0,354.1 234.0,353.5 236.0,352.9 238.0,352.3 240.0,351.7 242.0,351.0 244.0,350.4 246.0,349.7 248.0,348.9 250.0,348.1 252.0,347.3 254.0,346.4 255.2,346.1 256.4,345.9 257.7,345.9 258.7,345.9 L260.5,346.4 263.0,347.5 267.0,349.5 272.0,352.5 277.0,356.5 281.0,361.0 285.0,365.5 288.0,370.0 291.0,374.5 294.0,379.0 296.5,384.0 297.5,388.0 296.5,392.5 293.0,396.5 285.0,398.8 270.0,399.2 255.0,396.0 240.0,392.6 226.0,388.2 214.0,384.2 205.0,380.0 199.0,374.8 195.2,369.8 193.6,365.5 Z",
      cut: "M260.5,346.4 263.0,347.5 267.0,349.5 272.0,352.5 277.0,356.5 281.0,361.0 285.0,365.5 288.0,370.0 291.0,374.5 294.0,379.0 296.5,384.0 297.5,388.0 296.5,392.5 293.0,396.5 285.0,398.8 270.0,399.2 255.0,396.0 240.0,392.6 226.0,388.2 214.0,384.2 205.0,380.0 199.0,374.8 195.2,369.8 193.6,365.5 L193.6,362.15 194.5,357.8 196.0,357.1 198.0,356.9 200.0,356.7 202.0,356.6 204.0,356.4 206.0,356.1 208.0,355.8 210.0,355.4 212.0,355.0 214.0,354.5 216.0,354.1 218.0,353.6 220.0,353.0 222.0,352.5 224.0,351.9 226.0,351.4 228.0,350.8 230.0,350.2 232.0,349.6 234.0,349.0 236.0,348.4 238.0,347.8 240.0,347.2 242.0,346.5 244.0,345.9 246.0,345.2 248.0,344.4 250.0,343.6 252.0,342.8 254.0,341.9 255.2,341.6 L257.6,341.9 L258.7,345.95 Z",
    },
  ],
  walk: { maxSpeed: 150, bounce: 1.5, sway: 6, stride: 30, startDist: 22 },
  // The left arm points up-left at rest, so it has further to sink to hang down
  droop: [110, 85],
  defs: (
    <>
      {/* The colour of the left arm's base, for the part of it hidden behind the shell */}
      <linearGradient id="tg-armL-base" gradientUnits="userSpaceOnUse" x1="60" y1="160.3" x2="27.1" y2="193.2"><stop offset="0" stopColor="#dfd990" /><stop offset="0.087" stopColor="#e2dc94" /><stop offset="0.147" stopColor="#e6e098" /><stop offset="0.208" stopColor="#e7e19a" /><stop offset="0.269" stopColor="#e9e39d" /><stop offset="0.33" stopColor="#ebe59e" /><stop offset="0.42" stopColor="#ece69f" /><stop offset="0.512" stopColor="#ece69e" /><stop offset="0.573" stopColor="#ebe59e" /><stop offset="0.634" stopColor="#eae49d" /><stop offset="0.695" stopColor="#e8e29a" /><stop offset="0.755" stopColor="#e6e098" /><stop offset="0.816" stopColor="#e3dd94" /><stop offset="0.877" stopColor="#e1db91" /><stop offset="0.938" stopColor="#dfd98c" /><stop offset="1" stopColor="#dcd486" /></linearGradient>
    </>
  ),
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
