/* ============================================================
   MASCOTS — Togepi and Jigglypuff living along the bottom of the
   screen. Togepi waddles after the cursor (or the last tap), and
   Jigglypuff bounces along beside Togepi. Both blink, nap when left
   alone and get happy on hover; clicking one makes it use a move
   (see togepi.tsx / jigglypuff.tsx).
   Everything is driven imperatively from one rAF loop so React never
   re-renders while animating
   ============================================================ */

import { useEffect, useRef } from "react";
import { jigglypuff } from "./jigglypuff";
import { SHAPES, makePathSpawner, makeSpawner, rand } from "./particles";
import { togepi } from "./togepi";
import type { CharacterDef, CharacterId, CharacterState, Ctx, LimbDef, LimbKey, Pose } from "./types";

/** DOM order: Jigglypuff is drawn behind Togepi when they overlap */
const CHARACTERS: CharacterDef[] = [jigglypuff, togepi];
/** Update order: Togepi first, so Jigglypuff follows where Togepi is this frame */
const UPDATE_ORDER: CharacterId[] = ["togepi", "jigglypuff"];

/** Loading screen (Home) is shown for 1.8s — hatch right after it fades */
const APPEAR_DELAY_MS = 2000;
const APPEAR_STAGGER_MS = 350;
const INTRO_LINE_MS = 2500;
const SLEEP_AFTER_MS = 7000;
/** Jigglypuff likes to keep this much space (px) between itself and Togepi… */
const BUDDY_GAP = 14;
/** …and they're never allowed closer than this (leaves room for limbs swinging past the image edge) */
const MIN_GAP = 8;
/** Jigglypuff hopping over Togepi to switch sides */
const LEAP_MS = 1000;
/** Fraction of the leap spent rising before moving sideways (and landing after), so it's always
    above Togepi's head while their x ranges overlap */
const LEAP_RISE = 0.28;

// Walking (px/s²)
const ACCEL = 260;
const DECEL = 300;
const STOP_DIST = 3;

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const smooth = (t: number) => {
  const k = clamp(t, 0, 1);
  return k * k * (3 - 2 * k);
};
const easeOutBack = (t: number) => 1 + 2.7 * Math.pow(t - 1, 3) + 1.7 * Math.pow(t - 1, 2);

const BUBBLE_STYLE = {
  left: 0,
  top: 0,
  opacity: 0,
  transform: "translateY(6px) scale(0.92)",
  transformOrigin: "50% 100%",
  transition: "opacity 0.22s ease-out, transform 0.32s cubic-bezier(.34,1.56,.64,1)",
  background: "#FFFDF8",
  color: "#1C1917",
  border: "1px solid rgba(196,98,45,0.25)",
  boxShadow: "0 6px 18px rgba(28,25,23,0.08)",
} as const;

function LimbGroup({ def, limb }: { def: CharacterDef; limb: LimbDef }) {
  return (
    <g data-t={limb.k}>
      {limb.joint && <ellipse {...limb.joint} />}
      <image href={def.src} width={def.w} height={def.h} clipPath={`url(#${def.id}-clip-${limb.k})`} />
    </g>
  );
}

/* The artwork is one flat image: limbs are cut out of it and animated separately, and the face
   changes (closed / happy eyes, blush, character overlays) are painted over it */
function CharacterArt({ def }: { def: CharacterDef }) {
  const back = def.limbs.filter((l) => !l.front);
  const front = def.limbs.filter((l) => l.front);
  const arc = (x: number, y: number, a: number, happy: boolean) => {
    const k = a / 12;
    return happy ? `M${x - a},${y + 7 * k} Q${x},${y - 10 * k} ${x + a},${y + 7 * k}` : `M${x - a},${y + 2 * k} Q${x},${y + 13 * k} ${x + a},${y + 2 * k}`;
  };
  return (
    <svg viewBox={`0 0 ${def.w} ${def.h}`} className="block w-full h-auto" style={{ overflow: "visible" }}>
      <defs>
        {def.limbs.map((l) => (
          <clipPath key={l.k} id={`${def.id}-clip-${l.k}`}>
            <path d={l.cut} />
          </clipPath>
        ))}
        <mask id={`${def.id}-body`} maskUnits="userSpaceOnUse" x="0" y="0" width={def.w} height={def.h}>
          <rect width={def.w} height={def.h} fill="#fff" />
          {def.limbs.map((l) => (
            <path key={l.k} d={l.cut} fill="#000" />
          ))}
        </mask>
        {def.defs}
      </defs>

      {/* Ground shadow: a soft pool on the flat ground, plus a darker contact shadow under each sole */}
      <g data-t="shadow">
        <ellipse cx={def.shadow.cx} cy={def.shadow.cy} rx={def.shadow.rx} ry={def.shadow.ry} fill="rgba(28,25,23,0.2)" filter="url(#mascot-soft)" />
        {def.soles.map((f, i) => (
          <ellipse key={i} data-t={`contact${i}`} cx={f.x} cy={f.y} rx="30" ry="5" fill="rgba(28,25,23,0.32)" filter="url(#mascot-soft-sm)" />
        ))}
      </g>

      <g data-t="all">
        <g transform={`rotate(${def.level.angle} ${def.level.x} ${def.level.y})`}>
          {back.map((l) => (
            <LimbGroup key={l.k} def={def} limb={l} />
          ))}
          {/* Patches go under the body, so they only show through the holes front limbs leave when
              they move; the stroke slightly enlarges them to also fill the antialiased cut edges */}
          {front.map((l) => l.patch && <path key={l.k} stroke={l.patch.fill} strokeWidth="3" strokeLinejoin="round" {...l.patch} />)}
          <image href={def.src} width={def.w} height={def.h} mask={`url(#${def.id}-body)`} />
          {front.map((l) => (
            <LimbGroup key={l.k} def={def} limb={l} />
          ))}

          <g data-t="blush" style={{ opacity: 0 }}>
            {def.cheeks.map((c, i) => (
              <ellipse key={i} cx={c.x} cy={c.y} rx={c.rx} ry={c.ry} fill="url(#mascot-blush)" />
            ))}
          </g>
          <g data-t="lids" style={{ opacity: 0 }}>
            {def.eyes.map((e, i) => (
              <ellipse key={i} cx={e.x} cy={e.y} rx={e.lid.rx} ry={e.lid.ry} transform={`rotate(${e.lid.tilt} ${e.x} ${e.y})`} fill={e.lid.fill} mask={`url(#mascot-feather${e.lid.tight ? "-tight" : ""})`} />
            ))}
          </g>
          {(["closed", "happy"] as const).map((mode) => (
            <g key={mode} data-t={mode} style={{ opacity: 0 }} stroke="#1A1410" strokeLinecap="round" fill="none">
              {def.eyes.map((e, i) => (
                <path key={i} d={arc(e.x, e.y, e.arc, mode === "happy")} strokeWidth={e.stroke} />
              ))}
            </g>
          ))}
          {def.overlays}
        </g>
      </g>

      {/* Static hit area, so hopping doesn't make hover flicker on and off */}
      <ellipse data-t="hit" data-mascot-hit data-cursor-pointer cx={def.hit.cx} cy={def.hit.cy} rx={def.hit.rx} ry={def.hit.ry} fill="transparent" style={{ pointerEvents: "all" }} />
    </svg>
  );
}

interface Rig {
  c: CharacterState;
  root: HTMLDivElement;
  art: SVGSVGElement;
  q: (k: string) => SVGElement | null;
  all: SVGElement;
  shadow: SVGElement;
  contacts: SVGElement[];
  limbs: Partial<Record<LimbKey, { el: SVGElement; pivot: readonly [number, number] }>>;
  lids: SVGElement;
  happyEyes: SVGElement;
  closedEyes: SVGElement;
  blush: SVGElement;
  hit: SVGElement;
  bubble: HTMLDivElement;
  bubbleText: HTMLSpanElement;
  bubbleTail: HTMLSpanElement;
  bubbleUntil: number;
  appearAt: number;
  /** This frame's hop (px), so the bubble rises with the character instead of being jumped into */
  hop: number;
}

export default function Mascots() {
  const rootRefs = useRef<Partial<Record<CharacterId, HTMLDivElement | null>>>({});
  const bubbleRefs = useRef<Partial<Record<CharacterId, HTMLDivElement | null>>>({});
  const fxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const touch = window.matchMedia("(hover: none)").matches;
    const fx = fxRef.current!;
    const spawn = makeSpawner(fx, reduce);
    const spawnPath = makePathSpawner(fx);
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => { timers.push(window.setTimeout(fn, ms)); };
    let now = performance.now();

    const rigs: Rig[] = CHARACTERS.map((def, i) => {
      const root = rootRefs.current[def.id]!;
      const bubble = bubbleRefs.current[def.id]!;
      const q = (k: string) => root.querySelector<SVGElement>(`[data-t="${k}"], [data-x="${k}"]`);
      const limbs: Rig["limbs"] = {};
      for (const l of def.limbs) limbs[l.k] = { el: q(l.k)!, pivot: l.pivot };
      const c: CharacterState = {
        def, x: 0, v: 0, tx: 0, W: 0, H: 0, phase: 0, amp: 0, facing: -1, wantFacing: -1, happy: 0, sleep: 0,
        hovered: false, lastActive: now, forcedSleepUntil: 0, blinkAt: now + 2000 + i * 900, blinkUntil: 0,
        action: null, offset: 0, nextZ: 0, nextHeart: 0, clicks: 0, lastMove: null, doodleStart: 0, doodleWoke: 0,
        leapStart: 0, leapFrom: 0, leapSide: 0,
      };
      return {
        c, root, q, limbs, bubble,
        art: root.querySelector("svg")!,
        all: q("all")!, shadow: q("shadow")!, contacts: def.soles.map((_, j) => q(`contact${j}`)!),
        lids: q("lids")!, happyEyes: q("happy")!, closedEyes: q("closed")!, blush: q("blush")!, hit: q("hit")!,
        bubbleText: bubble.firstElementChild as HTMLSpanElement,
        bubbleTail: bubble.lastElementChild as HTMLSpanElement,
        bubbleUntil: 0,
        hop: 0,
        appearAt: now + APPEAR_DELAY_MS + (def.id === "jigglypuff" ? APPEAR_STAGGER_MS : 0),
      };
    });
    const rigOf = (c: CharacterState) => rigs.find((r) => r.c === c)!;
    const world = Object.fromEntries(rigs.map((r) => [r.c.def.id, r.c])) as Record<CharacterId, CharacterState>;
    const tg = world.togepi;
    const jp = world.jigglypuff;

    const resize = () => {
      for (const r of rigs) {
        r.c.W = desktop.matches ? r.c.def.width.desktop : r.c.def.width.mobile;
        r.c.H = (r.c.W * r.c.def.h) / r.c.def.w;
        r.root.style.width = `${r.c.W}px`;
      }
    };
    resize();
    const bounds = (c: CharacterState) => {
      const left = desktop.matches ? 80 : 0; // fixed left nav on desktop
      return [left + c.W / 2 + 12, document.documentElement.clientWidth - c.W / 2 - 12] as const;
    };
    const buddyGap = () => (tg.W + jp.W) / 2 + BUDDY_GAP;
    const minGap = () => (tg.W + jp.W) / 2 + MIN_GAP;
    /** Which side of Togepi Jigglypuff is on (remembered, in case they're ever exactly level) */
    let buddySide = -1;

    tg.x = tg.tx = clamp(window.innerWidth * 0.86, ...bounds(tg));
    jp.x = jp.tx = clamp(tg.x - buddyGap(), ...bounds(jp));
    let mx = tg.x;
    /** Where the cursor last moved to while Togepi was sung to sleep — Jigglypuff follows it on her own */
    let jpChase: number | null = null;

    /* ── Artwork point → viewport, through the levelling lean and the facing flip ── */
    const point = (c: CharacterState, ax: number, ay: number) => {
      const { level, w, h } = c.def;
      const a = (level.angle * Math.PI) / 180;
      const dx = ax - level.x, dy = ay - level.y;
      const lx = level.x + dx * Math.cos(a) - dy * Math.sin(a);
      const ly = level.y + dx * Math.sin(a) + dy * Math.cos(a);
      const fx2 = c.facing > 0 ? w - lx : lx;
      return { x: c.x + c.offset - c.W / 2 + (fx2 / w) * c.W, y: window.innerHeight - 4 - c.H + (ly / h) * c.H };
    };

    /* ── Speech bubbles ── */
    const hideBubble = (r: Rig) => {
      r.bubbleUntil = 0;
      r.bubble.style.opacity = "0";
      r.bubble.style.transform = "translateY(6px) scale(0.92)";
    };
    // The newest speaker wins: the other bubble is cut short so they never overlap
    const say = (c: CharacterState, text: string, ms = 2400) => {
      const r = rigOf(c);
      for (const other of rigs) if (other !== r && other.bubbleUntil) hideBubble(other);
      r.bubbleText.textContent = text;
      r.bubble.style.opacity = "1";
      r.bubble.style.transform = "translateY(0) scale(1)";
      r.bubbleUntil = performance.now() + ms;
    };
    const placeBubble = (r: Rig) => {
      const c = r.c;
      const bw = r.bubble.offsetWidth;
      const cx = c.x + c.offset;
      const left = clamp(cx - bw / 2, 12, document.documentElement.clientWidth - bw - 12);
      r.bubble.style.left = `${left}px`;
      r.bubble.style.top = `${point(c, c.def.w / 2, 0).y - r.hop - r.bubble.offsetHeight - 10}px`;
      r.bubbleTail.style.left = `${clamp(cx - left, 14, bw - 14)}px`;
    };

    /* ── Moves ── */
    const ctx: Ctx = {
      get now() { return now; },
      reduce, touch, world, spawn, spawnPath, say, point, later, bounds,
      useMove: (c, key, text) => {
        const move = c.def.moves[key];
        if (!move) return;
        const start = performance.now();
        const action = { key, start, dur: move.dur, data: {} };
        c.action = action;
        c.lastActive = start;
        c.forcedSleepUntil = 0;
        c.sleep = Math.min(c.sleep, 0.3);
        say(c, text ?? `${c.def.name} used ${move.name}!`, move.dur + 400);
        move.start?.(ctx, c);
        later(() => {
          if (c.action !== action) return; // interrupted (e.g. sung to sleep)
          c.action = null;
          c.lastActive = performance.now();
          move.end?.(ctx, c);
        }, move.dur);
      },
      forceSleep: (c, ms) => {
        c.forcedSleepUntil = performance.now() + ms;
        c.action = null;
      },
      flash: (c) => {
        if (!reduce) rigOf(c).art.animate([{ filter: "brightness(1)" }, { filter: "brightness(1.7) saturate(0.4)" }, { filter: "brightness(1)" }], { duration: 160, iterations: 4 });
      },
    };

    let introOver = false; // the intros stop once the visitor starts playing

    /* ── Input ── */
    const onPointerMove = (e: PointerEvent) => {
      mx = e.clientX;
      // Togepi stays put while the cursor is on either mascot, so it doesn't walk onto Jigglypuff
      if (e.pointerType === "mouse" && !tg.hovered && !jp.hovered) {
        tg.tx = clamp(mx, ...bounds(tg));
        if (now < tg.forcedSleepUntil) jpChase = mx;
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      onPointerMove(e);
      if (e.pointerType !== "mouse" && !(e.target as Element).closest?.("[data-mascot-hit]")) {
        tg.tx = clamp(mx, ...bounds(tg));
        if (now < tg.forcedSleepUntil) jpChase = mx;
      }
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("resize", resize);
    const unbind = rigs.map(({ c, hit }) => {
      const enter = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        c.hovered = true;
        c.lastActive = performance.now();
        c.forcedSleepUntil = 0;
      };
      const leave = () => { c.hovered = false; };
      const click = () => {
        introOver = true;
        if (!c.action) c.def.onClick(ctx, c);
      };
      hit.addEventListener("pointerenter", enter);
      hit.addEventListener("pointerleave", leave);
      hit.addEventListener("click", click);
      return () => {
        hit.removeEventListener("pointerenter", enter);
        hit.removeEventListener("pointerleave", leave);
        hit.removeEventListener("click", click);
      };
    });

    /* ── Intros, one after the other ── */
    let introAt = APPEAR_DELAY_MS + 600;
    for (const id of UPDATE_ORDER) {
      const c = world[id];
      for (const line of c.def.intro(touch)) {
        later(() => { if (!introOver && !c.action && now > c.forcedSleepUntil) say(c, line, 2300); }, introAt);
        introAt += INTRO_LINE_MS;
      }
    }

    /* ── Jigglypuff hops over Togepi's head to get to its other side ── */
    const leapArc = () => (tg.H + 0.15 * jp.H + 10) / Math.sin(Math.PI * LEAP_RISE);
    const startLeap = (t: number, toSide: number) => {
      jp.leapStart = t;
      jp.leapFrom = jp.x;
      jp.leapSide = toSide;
      jp.v = 0;
      spawn(SHAPES.dust(14), point(jp, 165, 390), toSide * 10, -8, { dur: 500 });
    };

    /* ── One character, one frame: walking ── */
    const move = (r: Rig, t: number, dt: number) => {
      const { c } = r;
      const { def } = c;
      if (t < r.appearAt) return;
      const [minX, maxX] = bounds(c);
      const busy = !!c.action;
      const forcedAsleep = t < c.forcedSleepUntil;

      if (c === jp && jp.leapStart) {
        const k = (t - jp.leapStart) / LEAP_MS;
        const to = clamp(tg.x + jp.leapSide * buddyGap(), minX, maxX);
        jp.wantFacing = Math.sign(to - jp.leapFrom) || jp.wantFacing;
        jp.v = 0;
        jp.lastActive = t;
        if (k >= 1) {
          jp.x = to;
          jp.leapStart = 0;
          buddySide = jp.leapSide;
          spawn(SHAPES.dust(14), point(jp, 120, 390), -10, -8, { dur: 500 });
          spawn(SHAPES.dust(14), point(jp, 230, 390), 10, -8, { dur: 500 });
        } else {
          // Rise first, cross over only while high above Togepi, then come down
          jp.x = jp.leapFrom + (to - jp.leapFrom) * smooth((k - LEAP_RISE) / (1 - 2 * LEAP_RISE));
        }
        return;
      }

      /* Jigglypuff sticks by Togepi, on whichever side it's already on. It aims for where Togepi is
         heading and hurries out of the way when Togepi walks toward it. Pinned against the screen edge
         with Togepi still coming, it hops over Togepi's head to the other side */
      let crowded = false;
      if (c === jp && t >= tg.forcedSleepUntil) jpChase = null;
      if (c === jp && !busy && !forcedAsleep && jpChase !== null) {
        /* While Togepi is sung to sleep, Jigglypuff follows the cursor herself. She stops beside Togepi
           rather than walking into it, and hops over it when the cursor is well past its far side */
        const side = Math.sign(jp.x - tg.x) || buddySide;
        const landing = tg.x - side * buddyGap();
        const farSide = (jpChase - landing) * -side > def.walk.startDist;
        const beside = (jp.x - tg.x) * side < buddyGap() + 6;
        if (farSide && beside && landing >= minX && landing <= maxX && !jp.hovered && jp.sleep < 0.5 && !reduce) {
          startLeap(t, -side);
          return;
        }
        jp.tx = (jpChase - tg.x) * side < buddyGap() ? tg.x + side * buddyGap() : jpChase;
      } else if (c === jp && !busy && !forcedAsleep) {
        const side = Math.sign(jp.x - tg.x) || buddySide;
        const ideal = tg.x + tg.v * 0.5 + side * buddyGap();
        jp.tx = ideal;
        crowded = (jp.x - tg.x) * side < buddyGap() - 4;
        const pinned = (side < 0 ? jp.x - minX : maxX - jp.x) < 2;
        const pushing = Math.sign(tg.tx - tg.x) === side && Math.abs(tg.tx - tg.x) > tg.def.walk.startDist && (jp.x - tg.x) * side < buddyGap() + 2;
        const landing = tg.x - side * buddyGap();
        if (pinned && pushing && landing >= minX && landing <= maxX && !jp.hovered && jp.sleep < 0.5 && !reduce) {
          startLeap(t, -side);
          return;
        }
      }
      c.tx = clamp(c.tx, minX, maxX);

      /* Walking: accelerate toward the target, brake so it arrives without overshooting */
      const dist = c.tx - c.x;
      const walking = !busy && !c.hovered && !reduce && !forcedAsleep && (crowded || Math.abs(c.v) > 1 || Math.abs(dist) > def.walk.startDist);
      if (walking) {
        const maxSpeed = def.walk.maxSpeed * (crowded ? 1.4 : 1);
        const want = Math.sign(dist) * Math.min(maxSpeed, Math.sqrt(2 * DECEL * Math.max(0, Math.abs(dist) - STOP_DIST)));
        const rate = (Math.abs(want) > Math.abs(c.v) ? ACCEL : DECEL) * (crowded ? 1.6 : 1);
        c.v += clamp(want - c.v, -rate * dt, rate * dt);
        if (Math.abs(dist) < STOP_DIST && Math.abs(c.v) < 6) c.v = 0;
        c.lastActive = t;
      } else {
        c.v = 0;
      }
      c.x = clamp(c.x + c.v * dt, minX, maxX);
      c.phase += (Math.abs(c.v) * dt * Math.PI * 2) / def.walk.stride;
      c.amp += ((Math.abs(c.v) > 6 ? 1 : 0) - c.amp) * Math.min(1, dt * 8);
    };

    /* ── Togepi and Jigglypuff never overlap. Runs every frame after walking, before drawing.
       Togepi pushes Jigglypuff along if it can move (waking it from a nap); if it can't (busy, sung
       to sleep or being hovered) Togepi is stopped instead. While Jigglypuff is in the air above
       Togepi's head, they can pass ── */
    const separate = (t: number) => {
      if (t < rigOf(jp).appearAt) return;
      const tgX = tg.x + tg.offset;
      const jpX = jp.x + jp.offset;
      if (jp.leapStart && rigOf(jp).hop > tg.H + rigOf(tg).hop + 0.15 * jp.H) return;
      const side = Math.sign(jpX - tgX) || buddySide;
      const need = minGap() - (jpX - tgX) * side;
      if (need <= 0) {
        if (!jp.leapStart) buddySide = side;
        return;
      }
      let rest = need;
      const movable = !jp.action && !jp.leapStart && t >= jp.forcedSleepUntil && !jp.hovered;
      if (movable) {
        const [jMin, jMax] = bounds(jp);
        const nx = clamp(jp.x + side * need, jMin, jMax);
        rest -= (nx - jp.x) * side;
        if (nx !== jp.x) jp.lastActive = t;
        jp.x = nx;
      }
      if (rest > 0.01) {
        const [tMin, tMax] = bounds(tg);
        tg.x = clamp(tg.x - side * rest, tMin, tMax);
        tg.v = 0;
      }
    };

    /* ── One character, one frame: pose and draw ── */
    const draw = (r: Rig, t: number, dt: number) => {
      const { c } = r;
      const { def } = c;
      const secs = t / 1000;
      if (t < r.appearAt) return;
      r.root.style.opacity = "1";
      const hatch = reduce ? 1 : easeOutBack(Math.min(1, (t - r.appearAt) / 550));
      const busy = !!c.action;
      const forcedAsleep = t < c.forcedSleepUntil;

      /* Facing: the way it walks, otherwise toward the cursor (with a dead zone so it doesn't flip-flop) */
      if (Math.abs(c.v) > 6) c.wantFacing = Math.sign(c.v);
      else if (!busy && !c.leapStart && c.sleep < 0.5 && Math.abs(mx - c.x) > c.W) c.wantFacing = Math.sign(mx - c.x);
      c.facing = reduce ? c.wantFacing : clamp(c.facing + Math.sign(c.wantFacing - c.facing) * dt * 9, -1, 1);

      /* Moods */
      c.happy += ((c.hovered && !busy ? 1 : 0) - c.happy) * Math.min(1, dt * 10);
      const wantSleep = forcedAsleep || (!busy && !c.hovered && c.v === 0 && t - c.lastActive > SLEEP_AFTER_MS) ? 1 : 0;
      c.sleep += (wantSleep - c.sleep) * Math.min(1, dt * (wantSleep ? (forcedAsleep ? 3 : 1.5) : 8));

      /* Pose — the whole artwork moves, pivoting on its feet; limbs move on top of that */
      const p: Pose = {
        hop: 0, rot: 0, sx: 1, sy: 1, shrink: 1,
        raiseL: Math.sin(secs * 1.8) * 3, raiseR: Math.sin(secs * 1.8 + 1) * 3, // idle breathing sway
        liftL: 0, liftR: 0, tiltL: 0, tiltR: 0,
        ears: Math.sin(secs * 1.3) * 2,
        eye: c.sleep > 0.6 ? "closed" : "open",
        mouth: "smile", blush: c.happy * 0.85, angry: 0, offset: 0, spin: 0,
      };
      if (c.amp > 0.01) {
        // Waddle: each foot steps up in turn while the opposite arm swings forward
        const s = Math.sin(c.phase);
        p.rot = s * def.walk.sway * c.amp;
        p.hop = Math.abs(s) * def.walk.bounce * c.amp;
        p.liftL = Math.max(0, s) * 16 * c.amp;
        p.liftR = Math.max(0, -s) * 16 * c.amp;
        p.tiltL = Math.max(0, s) * 12 * c.amp;
        p.tiltR = Math.max(0, -s) * 12 * c.amp;
        p.raiseL += -s * 22 * c.amp;
        p.raiseR += s * 22 * c.amp;
        p.ears += Math.sin(c.phase * 2) * 6 * c.amp;
      }
      if (c.sleep > 0.01) {
        p.sy *= 1 - 0.04 * c.sleep + Math.sin(secs * 2.2) * 0.012 * c.sleep; // slow breathing
        p.sx *= 1 + 0.02 * c.sleep;
        p.raiseL -= def.droop[0] * c.sleep; // arms sink to hang at its sides
        p.raiseR -= def.droop[1] * c.sleep;
      }
      if (c.happy > 0.01 && !reduce) {
        const k = (secs % 0.6) / 0.6;
        const h = Math.sin(k * Math.PI);
        p.hop += h * 10 * c.happy;
        const land = Math.max(0, 1 - h * 4) * c.happy; // squash right at landing
        p.sx *= 1 + 0.07 * land;
        p.sy *= 1 - 0.08 * land;
        p.rot += Math.sin(secs * 6.5) * 4 * c.happy;
        // Arms wave, feet kick out a little at the top of each hop, ears wiggle
        p.raiseL += (30 + Math.sin(secs * 13) * 18) * c.happy;
        p.raiseR += (30 + Math.sin(secs * 13 + Math.PI) * 18) * c.happy;
        p.tiltL += h * 14 * c.happy;
        p.tiltR += h * 14 * c.happy;
        p.ears += Math.sin(secs * 12) * 8 * c.happy;
      }
      if (c.happy > 0.5) p.eye = "happy";

      if (c.action) {
        const m = def.moves[c.action.key];
        const at = (t - c.action.start) / 1000;
        m.tick?.(ctx, c, at);
        if (c.action) m.pose?.(p, at, c, ctx);
      }
      if (c.leapStart) {
        // Springs up, somersaults over Togepi's head, lands on the other side
        const k = clamp((t - c.leapStart) / LEAP_MS, 0, 1);
        p.hop = Math.sin(Math.PI * k) * leapArc();
        p.spin = 360 * smooth((k - 0.25) / 0.5) * (Math.sign(c.leapSide) || 1);
        p.raiseL = p.raiseR = 45;
        p.tiltL = p.tiltR = 18;
        p.eye = "happy";
        const squash = Math.max(0, 1 - k / 0.08) + Math.max(0, (k - 0.92) / 0.08);
        p.sy *= 1 - 0.1 * squash;
        p.sx *= 1 + 0.08 * squash;
      }

      if (reduce) {
        p.hop = p.rot = p.spin = 0;
        p.raiseL = p.raiseR = p.liftL = p.liftR = p.tiltL = p.tiltR = p.ears = 0;
      }
      p.sx *= hatch * p.shrink;
      p.sy *= hatch * p.shrink;
      c.offset = p.offset;
      r.hop = p.hop;

      /* Blink */
      if (t > c.blinkAt && p.eye === "open") { c.blinkUntil = t + 130; c.blinkAt = t + rand(2200, 6000); }
      if (t < c.blinkUntil && p.eye === "open") p.eye = "closed";

      /* Render */
      const { feet, center } = def;
      r.root.style.transform = `translate3d(${(c.x + c.offset - c.W / 2).toFixed(2)}px,0,0)`;
      // The artwork faces left. Turning squashes it horizontally through the flip, so it reads as a quick spin
      const flip = c.facing < 0 ? Math.max(0.08, -c.facing) : -Math.max(0.08, c.facing);
      const hopArt = (p.hop * def.h) / c.H; // px → artwork units
      const spin = p.spin * Math.sign(flip); // keep the on-screen roll direction when mirrored
      r.all.setAttribute(
        "transform",
        `translate(0 ${(-hopArt).toFixed(2)}) rotate(${p.rot.toFixed(2)} ${feet.x} ${feet.y}) translate(${feet.x} ${feet.y}) scale(${(p.sx * flip).toFixed(3)} ${p.sy.toFixed(3)}) translate(${-feet.x} ${-feet.y}) rotate(${spin.toFixed(1)} ${center.x} ${center.y})`,
      );
      const sh = clamp(1 - p.hop / 40, 0.45, 1) * hatch * p.shrink;
      // The shadow mirrors with the artwork so each contact shadow stays under its foot
      r.shadow.setAttribute("transform", `translate(${feet.x} ${feet.y}) scale(${(sh * flip).toFixed(3)} ${sh.toFixed(3)}) translate(${-feet.x} ${-feet.y})`);
      r.shadow.style.opacity = String(0.3 + 0.7 * sh);

      // Left limbs lift clockwise, right limbs anticlockwise
      const limb = (k: LimbKey, angle: number, lift = 0) => {
        const l = r.limbs[k];
        if (l) l.el.setAttribute("transform", `translate(0 ${(-lift).toFixed(2)}) rotate(${angle.toFixed(2)} ${l.pivot[0]} ${l.pivot[1]})`);
      };
      limb("armL", p.raiseL);
      limb("armR", -p.raiseR);
      limb("footL", p.tiltL, p.liftL);
      limb("footR", -p.tiltR, p.liftR);
      limb("earL", -p.ears);
      limb("earR", p.ears);
      // A foot's contact shadow fades as it lifts off the ground
      r.contacts[0].style.opacity = clamp(1 - p.liftL / 12, 0, 1).toFixed(2);
      r.contacts[1].style.opacity = clamp(1 - p.liftR / 12, 0, 1).toFixed(2);
      r.lids.style.opacity = p.eye === "open" ? "0" : "1";
      r.happyEyes.style.opacity = p.eye === "happy" ? "1" : "0";
      r.closedEyes.style.opacity = p.eye === "closed" ? "1" : "0";
      r.blush.style.opacity = p.blush.toFixed(2);
      def.frame?.(ctx, c, p, r.q);

      /* Ambient particles */
      if (c.sleep > 0.9 && t > c.nextZ) {
        c.nextZ = t + 1500;
        spawn(SHAPES.z(rand(11, 16)), point(c, def.w * 0.8, def.h * 0.1), c.facing > 0 ? rand(-34, -18) : rand(18, 34), -46, { dur: 2200, sway: 6 });
      }
      if (c.happy > 0.9 && t > c.nextHeart) {
        c.nextHeart = t + 650;
        spawn(SHAPES.heart(rand(10, 14)), point(c, rand(def.w * 0.25, def.w * 0.75), def.h * 0.08), rand(-30, 30), rand(-50, -80), { dur: 1300, sway: rand(-8, 8) });
      }

      /* Bubble */
      if (r.bubbleUntil && t > r.bubbleUntil) hideBubble(r);
      if (r.bubble.style.opacity !== "0") placeBubble(r);
    };

    let raf = 0;
    let last = now;
    const ordered = UPDATE_ORDER.map((id) => rigs.find((r) => r.c.def.id === id)!);
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      now = t;
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      for (const r of ordered) move(r, t, dt);
      separate(t);
      for (const r of ordered) draw(r, t, dt);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", resize);
      unbind.forEach((u) => u());
      fx.replaceChildren();
    };
  }, []);

  return (
    <>
      {/* Shared SVG defs (blurs, blush, the feathered mask used by eyelids and patches) */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <filter id="mascot-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="mascot-soft-sm" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
          <radialGradient id="mascot-blush">
            <stop offset="0" stopColor="#FF8DA1" stopOpacity="0.85" />
            <stop offset="1" stopColor="#FF8DA1" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="mascot-feather-fade">
            <stop offset="0.7" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </radialGradient>
          <mask id="mascot-feather" maskContentUnits="objectBoundingBox">
            <rect width="1" height="1" fill="url(#mascot-feather-fade)" />
          </mask>
          <radialGradient id="mascot-feather-fade-tight">
            <stop offset="0.86" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </radialGradient>
          <mask id="mascot-feather-tight" maskContentUnits="objectBoundingBox">
            <rect width="1" height="1" fill="url(#mascot-feather-fade-tight)" />
          </mask>
        </defs>
      </svg>

      {CHARACTERS.map((def) => (
        <div
          key={def.id}
          ref={(el) => { rootRefs.current[def.id] = el; }}
          data-mascot={def.id}
          aria-hidden
          className="fixed left-0 z-[39] pointer-events-none print:hidden"
          style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 4px)", opacity: 0, transition: "opacity 0.3s ease-out", willChange: "transform" }}
        >
          <CharacterArt def={def} />
        </div>
      ))}
      {/* Particles and speech bubbles come after the mascots so they're drawn on top; all of it stays
          below the nav (z-50) and the mobile menu overlay (z-40) */}
      <div ref={fxRef} aria-hidden className="fixed inset-0 z-[39] pointer-events-none overflow-hidden print:hidden" />
      {CHARACTERS.map((def) => (
        <div
          key={def.id}
          ref={(el) => { bubbleRefs.current[def.id] = el; }}
          aria-hidden
          className="fixed z-[39] pointer-events-none w-max whitespace-nowrap font-mono-dm text-[11px] lg:text-xs tracking-wide px-3 py-2 rounded-2xl print:hidden"
          style={BUBBLE_STYLE}
        >
          <span />
          <span
            className="absolute -bottom-[5px] w-2.5 h-2.5 -ml-[5px] rotate-45"
            style={{ background: "#FFFDF8", borderRight: "1px solid rgba(196,98,45,0.25)", borderBottom: "1px solid rgba(196,98,45,0.25)" }}
          />
        </div>
      ))}
    </>
  );
}
