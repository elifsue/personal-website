/* ============================================================
   PAGE EFFECTS — what Togepi's Metronome moves do to the whole
   page while they play: the page (everything in <main>), the
   cards and pictures on screen, and a see-through layer over it
   all (under the mascots) for tints, flashes and weather.
   Everything is added on top of whatever's already there (Web
   Animations with composite "add") and gone again once it's
   done: nothing on the page is moved for real, and it can be
   scrolled and clicked all the while. With reduced motion, it's
   only ever a gentle tint. Nothing flashes more than once a go
   ============================================================ */

import { SHAPES, rand, type Spawn } from "./particles";
import type { Pt } from "./types";

/** Stops an effect there and then (its move was cut short) */
export type Stop = () => void;

export interface PageFx {
  /** Shooting stars from `from` to things on the page, each wobbling as one reaches it */
  swift: (from: Pt) => Stop;
  /** A pink blush over the page, cards squishing shyly, hearts from behind them */
  blush: () => Stop;
  /** Dusk for `ms`: everything dims and sways sleepily, then perks back up */
  lullaby: (ms: number) => Stop;
  /** Two flashes of lightning, the colours glitching, every card jolting */
  thunder: () => Stop;
  /** Bubbles rising up the whole screen, everything wobbling as if under water */
  underwater: () => Stop;
  /** The page shrinks away with Togepi, then springs back as it pops back */
  minimize: () => Stop;
  /** …one single drop, and a tiny ripple */
  splash: (delay: number) => Stop;
  /** The screen flickers as if it lost the signal for a moment */
  blink: (delay: number) => Stop;
  /** Rain over everything, the page greying, then the sun comes out */
  rain: (delay: number) => Stop;
  /** Confetti all over, cards hopping in a wave across the page */
  confetti: (delay: number) => Stop;
  /** The page jolts as Togepi lands, every card bouncing */
  bounce: (delay: number) => Stop;
  /** Every card wriggling with the giggles */
  tickle: () => Stop;
  /** A rainbow across the screen, a shimmer of light sweeping over everything */
  gleam: () => Stop;
  /** The page rocking like a metronome: tick, tock */
  sway: () => Stop;
  /** The ground shakes: the page rumbles, cards rattle, dust comes down */
  quake: (ms: number) => Stop;
  /** Everything on the page drops to the bottom of the screen in a heap, then floats back up */
  gravity: (ms: number) => Stop;
  /** Stops everything and tidies up (the mascots are going away) */
  dispose: () => void;
}

type Card = { el: HTMLElement; r: DOMRect };
/** Everything one effect has going, so it can all be stopped at once */
type Scope = { anims: Animation[]; timers: number[]; els: Element[] };

/** How many things on the page get moved about at once, at most */
const MAX_CARDS = 28;
const SOLID = new Set(["IMG", "VIDEO", "IFRAME", "CANVAS", "svg"]);

const vw = () => document.documentElement.clientWidth;
const vh = () => window.innerHeight;
const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];
const clear = (c: string) => c === "transparent" || /rgba\(.*,\s*0\)$/.test(c);

export function makePageFx(reduce: boolean, spawnRaw: Spawn, sidebar: () => number): PageFx {
  /** The effect being set going right now (what it starts is noted down in it) */
  let scope: Scope | null = null;
  const timers = new Set<number>();
  const track = (a: Animation) => {
    scope?.anims.push(a);
    return a;
  };
  const spawn: Spawn = (...args) => track(spawnRaw(...args));
  /** Later, as part of the same effect (stopping it stops this too) */
  const later = (fn: () => void, ms: number) => {
    const s = scope;
    const id = window.setTimeout(() => {
      timers.delete(id);
      const was = scope;
      scope = s;
      try { fn(); } finally { scope = was; }
    }, ms);
    timers.add(id);
    s?.timers.push(id);
  };
  /** While anything's being moved, the page can't be scrolled sideways (a tilted or shaken page pokes out
      past the edge of the screen) */
  let moving = 0;
  const html = document.documentElement;
  const guard = (a: Animation) => {
    if (moving++ === 0) html.style.overflowX = "clip";
    let done = false;
    const off = () => {
      if (done) return;
      done = true;
      if (--moving === 0) html.style.overflowX = "";
    };
    a.addEventListener("finish", off);
    a.addEventListener("cancel", off);
    return a;
  };
  /** The see-through layer over the page (under the mascots, the nav and the sidebar) */
  let layer: HTMLDivElement | null = null;
  const veil = () => {
    if (!layer || !layer.isConnected) {
      layer = document.createElement("div");
      layer.setAttribute("aria-hidden", "true");
      layer.dataset.mascotUi = "";
      layer.style.cssText = "position:fixed;inset:0;z-index:38;pointer-events:none;overflow:hidden";
      document.body.appendChild(layer);
    }
    return layer;
  };
  /** Something on the layer for `ms`, animated through `frames`, then gone */
  const overlay = (css: string, frames: Keyframe[], ms: number, delay = 0, easing = "ease-in-out") => {
    const el = document.createElement("div");
    el.style.cssText = `position:absolute;inset:0;opacity:0;${css}`;
    veil().appendChild(el);
    scope?.els.push(el);
    const a = track(el.animate(frames, { duration: ms, delay, easing, fill: "both" }));
    a.onfinish = a.oncancel = () => el.remove();
    return el;
  };
  /** A wash of colour (and maybe a filter on what's under it) that fades in, holds, and fades out */
  const tint = (color: string, ms: number, opts: { delay?: number; filter?: string; peak?: number } = {}) => {
    const { delay = 0, filter, peak = 1 } = opts;
    overlay(
      `background:${color};${filter ? `backdrop-filter:${filter};-webkit-backdrop-filter:${filter};` : ""}`,
      [{ opacity: 0 }, { opacity: peak, offset: 0.2 }, { opacity: peak, offset: 0.75 }, { opacity: 0 }],
      ms,
      delay,
    );
  };

  const main = () => document.querySelector("main") as HTMLElement | null;
  /** The cards, pictures and buttons on screen right now (the outermost of anything nested) */
  const cards = (): Card[] => {
    const m = main();
    if (!m) return [];
    const W = vw(), H = vh();
    const found: Card[] = [];
    for (const el of Array.from(m.querySelectorAll<HTMLElement>("*"))) {
      if (found.length >= MAX_CARDS * 2) break;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > H || r.right < 0 || r.left > W) continue;
      if (r.width < 40 || r.height < 28 || r.width > W * 0.85 || r.height > H * 0.9) continue;
      if (found.some((f) => f.el.contains(el))) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility !== "visible" || parseFloat(cs.opacity) < 0.3) continue;
      const solid = SOLID.has(el.tagName) || !clear(cs.backgroundColor) || cs.backgroundImage !== "none" || cs.boxShadow !== "none"
        || (parseFloat(cs.borderTopWidth) >= 1 && !clear(cs.borderTopColor));
      if (solid) found.push({ el, r });
    }
    return found.slice(0, MAX_CARDS);
  };
  /** Moves something on top of however it's already placed (and only if motion's welcome) */
  const move = (el: Element, frames: Keyframe[], ms: number, delay = 0, easing = "ease-in-out") => {
    if (reduce) return;
    guard(track(el.animate(frames, { duration: ms, delay, easing, composite: "add" })));
  };
  /** Moves the whole page, about a point on the screen (`ox`, `oy`: 0–1 across and down it). The point's
      worked into the transform itself (moved there, transformed, moved back), so effects can overlap */
  const movePage = (frames: Keyframe[], ms: number, ox = 0.5, oy = 0.5, delay = 0, easing = "ease-in-out") => {
    const m = main();
    if (!m || reduce) return;
    const r = m.getBoundingClientRect();
    // From the middle of <main> (where it'd transform about anyway)
    const dx = (vw() * ox - r.left - r.width / 2).toFixed(1), dy = (vh() * oy - r.top - r.height / 2).toFixed(1);
    const about = (t: string) => `translate(${dx}px, ${dy}px) ${t === "none" ? "scale(1)" : t} translate(${-dx}px, ${-dy}px)`;
    const keyed = frames.map((f) => (typeof f.transform === "string" ? { ...f, transform: about(f.transform) } : f));
    guard(track(m.animate(keyed, { duration: ms, delay, easing, composite: "add" })));
  };
  /** Just above the middle of the top of a card */
  const topOf = (c: Card) => ({ x: c.r.left + c.r.width / 2, y: Math.max(40, c.r.top) });
  /** Somewhere along the top of the screen (clear of the sidebar) */
  const anyX = () => rand(sidebar() + 10, vw() - 10);
  /** A shake: n random jolts, dying away */
  const jitter = (n: number, px: number, deg = 0) =>
    Array.from({ length: n + 1 }, (_, i) => {
      const k = i === 0 || i === n ? 0 : 1 - i / n;
      return { transform: `translate(${(rand(-1, 1) * px * k).toFixed(1)}px, ${(rand(-1, 1) * px * 0.6 * k).toFixed(1)}px) rotate(${(rand(-1, 1) * deg * k).toFixed(2)}deg)` };
    });
  /** Scaled about its bottom edge (it squashes down onto whatever it's sitting on) */
  const squash = (c: Card, sx: number, sy: number) => `translateY(${((c.r.height * (1 - sy)) / 2).toFixed(1)}px) scale(${sx}, ${sy})`;

  /** Sets an effect going, keeping note of everything it starts, and hands back what stops it */
  const effect = <A extends unknown[]>(fn: (...a: A) => void) => (...args: A): Stop => {
    const s: Scope = { anims: [], timers: [], els: [] };
    const was = scope;
    scope = s;
    try { fn(...args); } finally { scope = was; }
    return () => {
      s.timers.forEach((id) => { clearTimeout(id); timers.delete(id); });
      s.anims.forEach((a) => a.cancel());
      s.els.forEach((el) => el.remove());
    };
  };

  const fx = {
    swift: (from: Pt) => {
      const cs = cards().sort(() => Math.random() - 0.5).slice(0, 7);
      cs.forEach((c, i) => {
        const to = { x: c.r.left + c.r.width / 2, y: c.r.top + c.r.height / 2 };
        const d = Math.hypot(to.x - from.x, to.y - from.y);
        const ms = 500 + d * 0.55;
        const delay = 120 + i * 70;
        spawn(SHAPES.star(rand(16, 22)), from, to.x - from.x, to.y - from.y, { dur: ms, delay, rot: rand(240, 480) });
        // Hit: a sparkle and a wobble
        const hit = delay + ms * 0.6;
        later(() => spawn(SHAPES.sparkle(rand(12, 16)), topOf(c), rand(-10, 10), -24, { dur: 700 }), hit);
        move(c.el, [{ transform: "none" }, { transform: "rotate(-3deg) scale(1.03)" }, { transform: "rotate(2.5deg)" }, { transform: "rotate(-1deg)" }, { transform: "none" }], 520, hit);
      });
    },

    blush: () => {
      tint("rgba(255,122,147,0.16)", 1800);
      const cs = cards();
      cs.forEach((c, i) => move(c.el, [
        { transform: "none" }, { transform: squash(c, 1.03, 0.95) }, { transform: squash(c, 0.99, 1.02) }, { transform: "none" },
      ], 650, 150 + i * 45));
      if (reduce) return;
      cs.sort(() => Math.random() - 0.5).slice(0, 6).forEach((c, i) =>
        spawn(SHAPES.heart(rand(12, 18)), topOf(c), rand(-20, 20), rand(-50, -80), { dur: 1300, delay: 250 + i * 140, sway: rand(-10, 10) }));
    },

    lullaby: (ms: number) => {
      tint("rgba(38,48,110,0.22)", ms + 300, { filter: "brightness(0.9) saturate(0.85)" });
      const cs = cards();
      cs.forEach((c, i) => {
        // Sways, nodding off, then a little start as it wakes back up
        const tilt = rand(1, 2) * (i % 2 ? 1 : -1);
        move(c.el, [
          { transform: "none" },
          { transform: `rotate(${tilt}deg)`, offset: 0.25 },
          { transform: `rotate(${-tilt}deg)`, offset: 0.55 },
          { transform: `rotate(${tilt * 1.4}deg) translateY(3px)`, offset: 0.82 },
          { transform: "translateY(-6px)", offset: 0.92 },
          { transform: "none" },
        ], ms + 200, i * 30);
      });
      if (reduce) return;
      cs.sort(() => Math.random() - 0.5).slice(0, 5).forEach((c, i) =>
        spawn(SHAPES.z(rand(14, 20)), topOf(c), rand(6, 16), -40, { dur: 1300, delay: 300 + i * 220, sway: 6 }));
    },

    thunder: () => {
      if (reduce) {
        tint("rgba(255,250,220,0.2)", 700);
        return;
      }
      // One flash of lightning, the colours glitching with it, fading away (just the once: no strobing)
      overlay("background:#FFFDF0", [{ opacity: 0 }, { opacity: 0.55, offset: 0.1 }, { opacity: 0 }], 600, 0, "ease-out");
      overlay("backdrop-filter:hue-rotate(150deg) saturate(1.8);-webkit-backdrop-filter:hue-rotate(150deg) saturate(1.8)",
        [{ opacity: 0 }, { opacity: 0.8, offset: 0.15 }, { opacity: 0 }], 450, 0, "ease-out");
      for (const c of cards()) move(c.el, [
        { transform: "none" }, { transform: "translateX(-5px) skewX(-2deg)" }, { transform: "translateX(5px) skewX(2deg)" },
        { transform: "translateX(-4px)" }, { transform: "translateX(3px)" }, { transform: "none" },
      ], 380, rand(40, 120), "linear");
    },

    underwater: () => {
      tint("rgba(70,150,225,0.14)", 1900, { filter: "saturate(1.1) hue-rotate(-8deg)" });
      cards().forEach((c, i) => move(c.el, [
        { transform: "none" },
        { transform: "translateX(4px) skewX(1.6deg)" }, { transform: "translateX(-4px) skewX(-1.6deg)" },
        { transform: "translateX(3px) skewX(1deg)" }, { transform: "translateX(-2px) skewX(-0.6deg)" },
        { transform: "none" },
      ], 1700, i * 60));
      if (reduce) return;
      for (let i = 0; i < 22; i++) {
        spawn(SHAPES.bubble(rand(12, 30)), { x: anyX(), y: vh() + 10 }, rand(-30, 30), -vh() * rand(0.55, 1), { dur: rand(1600, 2400), delay: rand(0, 900), sway: rand(-14, 14) });
      }
    },

    minimize: () => {
      // With Togepi: shrinks away (0.25s), waits (until 1.35s), springs back with an overshoot (1.75s)
      // (linear overall, eased between the keyframes, so they land when Togepi's do)
      movePage([
        { transform: "none", easing: "ease-in" },
        { transform: "scale(0.93)", offset: 0.13 },
        { transform: "scale(0.93)", offset: 0.71, easing: "ease-out" },
        { transform: "scale(1.03)", offset: 0.82, easing: "ease-in-out" },
        { transform: "scale(0.99)", offset: 0.9, easing: "ease-in-out" },
        { transform: "none" },
      ], 1900, 0.5, 0.5, 0, "linear");
    },

    splash: (delay: number) => {
      if (reduce) return;
      // Somewhere in the middle of the screen: one drop lands, and that's all
      const at = { x: rand(vw() * 0.3, vw() * 0.7), y: rand(vh() * 0.3, vh() * 0.6) };
      spawn(SHAPES.sweat(14), { x: at.x, y: at.y - 40 }, 0, 40, { dur: 500, delay });
      later(() => {
        const ring = document.createElement("div");
        ring.style.cssText = `position:absolute;left:${at.x}px;top:${at.y}px;width:60px;height:22px;margin:-11px 0 0 -30px;border:2px solid rgba(75,166,218,.6);border-radius:50%`;
        veil().appendChild(ring);
        scope?.els.push(ring);
        track(ring.animate([{ transform: "scale(0.1)", opacity: 1 }, { transform: "scale(1)", opacity: 0 }], { duration: 650, easing: "ease-out" })).onfinish = () => ring.remove();
      }, delay + 420);
    },

    blink: (delay: number) => {
      if (reduce) return;
      // A dip, the picture jumping sideways and a band of interference over it (once, not a strobe)
      const m = main();
      if (m) track(m.animate([{ opacity: 1 }, { opacity: 0.55 }, { opacity: 1 }], { duration: 320, delay, easing: "ease-in-out" }));
      movePage([{ transform: "none" }, { transform: "translateX(8px)" }, { transform: "translateX(-5px)" }, { transform: "none" }], 300, 0.5, 0.5, delay, "steps(4)");
      overlay("background:repeating-linear-gradient(0deg, rgba(28,25,23,.08) 0 2px, transparent 2px 5px)", [{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], 360, delay);
    },

    rain: (delay: number) => {
      // Grey (1.9s), then a warm glow as the sun comes back
      tint("rgba(60,72,95,0.2)", 1900, { delay, filter: "saturate(0.6) brightness(0.92)" });
      tint("rgba(255,210,110,0.18)", 900, { delay: delay + 1650 });
      if (reduce) return;
      for (let i = 0; i < 70; i++) {
        spawn(`<span style="display:block;width:2px;height:${rand(12, 20).toFixed(0)}px;border-radius:2px;background:rgba(95,150,205,.65)"></span>`,
          { x: anyX(), y: -20 }, -12, vh() + 40, { dur: rand(550, 800), delay: delay + rand(0, 1500), rot: 8 });
      }
      cards().forEach((c) => move(c.el, [{ transform: "none" }, { transform: "translateY(1px)" }, { transform: "none" }], 1800, delay));
    },

    confetti: (delay: number) => {
      const colors = ["#FF7A93", "#FFD43B", "#4DABF7", "#69DB7C", "#B197FC", "#FFA94D"];
      if (!reduce) {
        for (let i = 0; i < 80; i++) {
          spawn(SHAPES.confetti(rand(7, 11), pick(colors)), { x: anyX(), y: -10 }, rand(-40, 40), vh() * rand(0.7, 1.05), {
            dur: rand(1500, 2300), delay: delay + rand(0, 500), sway: rand(-24, 24), rot: rand(-500, 500),
          });
        }
      }
      // A hop each, in a wave from left to right
      for (const c of cards()) move(c.el, [
        { transform: "none" }, { transform: `${squash(c, 1.04, 0.95)}`, offset: 0.15 }, { transform: "translateY(-16px)", offset: 0.45 },
        { transform: squash(c, 1.03, 0.97), offset: 0.75 }, { transform: "none" },
      ], 560, delay + 100 + (c.r.left / vw()) * 600);
    },

    bounce: (delay: number) => {
      movePage([{ transform: "none" }, { transform: "translateY(7px)" }, { transform: "translateY(-3px)" }, { transform: "none" }], 380, 0.5, 1, delay);
      for (const c of cards()) move(c.el, [
        { transform: "none" }, { transform: "translateY(-12px)", offset: 0.35 }, { transform: squash(c, 1.04, 0.95), offset: 0.7 }, { transform: "none" },
      ], 460, delay + rand(0, 70));
    },

    tickle: () => {
      cards().forEach((c, i) => {
        const frames: Keyframe[] = [{ transform: "none" }];
        for (let k = 0; k < 8; k++) frames.push({ transform: `rotate(${(k % 2 ? -1 : 1) * rand(1.5, 3.5)}deg) translateY(${-rand(0, 3)}px)` });
        frames.push({ transform: "none" });
        move(c.el, frames, 900, 300 + i * 40);
      });
    },

    gleam: () => {
      // A faint rainbow high over the page, fading out toward its feet
      const size = Math.min(1000, vw() * 0.75);
      const arc = overlay(
        `inset:auto;left:${((sidebar() + vw()) / 2 - size / 2).toFixed(0)}px;top:${(vh() * 0.08).toFixed(0)}px;width:${size}px;height:${size / 2}px;`
          + "-webkit-mask-image:linear-gradient(to bottom, #000 45%, transparent 95%);mask-image:linear-gradient(to bottom, #000 45%, transparent 95%)",
        [{ opacity: 0 }, { opacity: 0.3, offset: 0.25 }, { opacity: 0.3, offset: 0.7 }, { opacity: 0 }], 1900);
      arc.innerHTML = `<div style="margin-top:${(-0.38 * size).toFixed(0)}px">${SHAPES.rainbow(size)}</div>`; // (its arcs are in the lower half of its box)
      // A band of light sweeping across everything
      const band = overlay("inset:0 -60%;background:linear-gradient(105deg, transparent 38%, rgba(255,255,255,.55) 48%, rgba(255,240,200,.35) 52%, transparent 62%);mix-blend-mode:soft-light",
        [{ opacity: 0 }, { opacity: 1, offset: 0.15 }, { opacity: 1, offset: 0.85 }, { opacity: 0 }], 1300, 250);
      if (!reduce) track(band.animate([{ transform: "translateX(-55%)" }, { transform: "translateX(55%)" }], { duration: 1300, delay: 250, easing: "ease-in-out", fill: "both" }));
      tint("rgba(255,248,225,0.12)", 1500, { delay: 150 });
    },

    sway: () => {
      // Pivoting on the bottom of the screen, like a metronome's arm upside down
      movePage([
        { transform: "none" },
        { transform: "rotate(1.3deg)", offset: 0.2 }, { transform: "rotate(-1.3deg)", offset: 0.45 },
        { transform: "rotate(1deg)", offset: 0.7 }, { transform: "rotate(-0.5deg)", offset: 0.88 },
        { transform: "none" },
      ], 1300, 0.5, 1.4);
    },

    quake: (ms: number) => {
      movePage(jitter(Math.round(ms / 45), 7), ms, 0.5, 0.5, 0, "linear");
      for (const c of cards()) move(c.el, jitter(Math.round(ms / 70), 3, 2.5), ms * rand(0.75, 1), rand(0, 120), "linear");
      tint("rgba(120,95,70,0.1)", ms);
      if (reduce) return;
      for (let i = 0; i < 26; i++) spawn(SHAPES.dust(rand(8, 14)), { x: anyX(), y: rand(-10, 40) }, rand(-10, 10), rand(120, 260), { dur: rand(900, 1500), delay: rand(0, ms * 0.7) });
    },

    gravity: (ms: number) => {
      // Dropping (ease-in) to the bottom of the screen with a bump, a heap for a moment, then floating back
      for (const c of cards()) {
        const drop = Math.max(0, vh() - c.r.bottom - rand(0, 24));
        const rot = rand(-12, 12);
        move(c.el, [
          { transform: "none", easing: "cubic-bezier(.55,0,1,.45)" },
          { transform: `translateY(${drop}px) rotate(${rot}deg)`, offset: 0.22, easing: "ease-out" },
          { transform: `translateY(${drop - Math.min(18, drop * 0.08)}px) rotate(${rot * 0.85}deg)`, offset: 0.28, easing: "ease-in" },
          { transform: `translateY(${drop}px) rotate(${rot}deg)`, offset: 0.33 },
          { transform: `translateY(${drop}px) rotate(${rot}deg)`, offset: 0.66, easing: "cubic-bezier(.3,0,.2,1)" },
          { transform: "none" },
        ], ms, rand(0, 260), "linear");
      }
      if (reduce) tint("rgba(28,25,23,0.08)", ms);
    },
  };

  const out = {} as PageFx;
  for (const k of Object.keys(fx) as (keyof typeof fx)[]) (out as unknown as Record<string, unknown>)[k] = effect(fx[k] as (...a: unknown[]) => void);
  out.dispose = () => {
    timers.forEach(clearTimeout);
    timers.clear();
    layer?.remove();
    layer = null;
    moving = 0;
    html.style.overflowX = "";
  };
  return out;
}
