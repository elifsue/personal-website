/* ============================================================
   MASCOTS — Togepi and Jigglypuff living along the bottom of the
   screen. Togepi waddles after the cursor (or the last tap), and
   Jigglypuff bounces along beside Togepi. Both blink, nap when left
   alone and get happy on hover; clicking one makes it use a move
   (see togepi.tsx / jigglypuff.tsx). They start out in a Poké Ball
   that rolls in after the loading screen; clicking it lets them out,
   and clicking it again (it waits in the corner) calls them back.
   Everything is driven imperatively from one rAF loop so React never
   re-renders while animating
   ============================================================ */

import { Fragment, useEffect, useRef, type SVGProps } from "react";
import { jigglypuff } from "./jigglypuff";
import { SHAPES, makePathSpawner, makeSpawner, rand } from "./particles";
import { togepi } from "./togepi";
import type { CharacterDef, CharacterId, CharacterState, Ctx, Ellipse, EyeDef, LimbDef, LimbKey, Pose } from "./types";

/** DOM order: Jigglypuff is drawn behind Togepi when they overlap */
const CHARACTERS: CharacterDef[] = [jigglypuff, togepi];
/** Update order: Togepi first, so Jigglypuff follows where Togepi is this frame */
const UPDATE_ORDER: CharacterId[] = ["togepi", "jigglypuff"];

/** Loading screen (Home) is shown for 1.8s — the Poké Ball rolls in right after it fades */
const APPEAR_DELAY_MS = 2000;
const BALL = { desktop: 34, mobile: 28 };
const BALL_ROLL_MS = 900;
/** The ball hops and spins before it opens… */
const BALL_HOP_MS = 420;
/** …then each Pokémon flies out of it to its spot */
const RELEASE_MS = 650;
const RELEASE_STAGGER_MS = 70;
/** While they're out the ball waits, smaller, in the bottom-right corner */
const BALL_DOCK = { desktop: 26, mobile: 24 };
const BALL_DOCK_MS = 700;
/** Called back: each is pulled into the ball along a red beam */
const RECALL_MS = 700;
const RECALL_STAGGER_MS = 90;
/** Then the capture: a pause, three slow wobbles, and a click before it rolls back out */
const CAPTURE_PAUSE_MS = 450;
const CAPTURE_WOBBLE_MS = 700;
const CAPTURE_WOBBLE_GAP_MS = 1050;
const CAPTURE_CLICK_MS = CAPTURE_PAUSE_MS + 3 * CAPTURE_WOBBLE_GAP_MS;
const HINT_RELEASE = "Who's inside? 👀";
const HINT_RECALL = "Come back! ✨";
const INTRO_LINE_MS = 2500;
const SLEEP_AFTER_MS = 7000;
/** How far (px) the cursor has to be from an eye for it to look all the way that way */
const LOOK_REACH = 160;
/** Where an eye's shine rests: this fraction of the way from the middle of the eye to its top */
const SHINE_LIFT = 0.3;
/** Jigglypuff likes to keep this much space (px) between itself and Togepi… */
const BUDDY_GAP = 14;
/** …and they're never allowed closer than this (leaves room for limbs swinging past the image edge) */
const MIN_GAP = 8;
/** Jigglypuff hopping over Togepi to switch sides */
const LEAP_MS = 1000;
/** Fraction of the leap spent rising before moving sideways (and landing after), so it's always
    above Togepi's head while their x ranges overlap */
const LEAP_RISE = 0.28;

// Being dragged about and dropped
/** How far (px) the pointer has to move on a mascot before it's a drag rather than a click */
const DRAG_START = 6;
/** How quickly a carried mascot catches up with the pointer (per second): lower trails behind more */
const CARRY_FOLLOW = 16;
const GRAVITY = 2600; // px/s²
/** Lands any harder than this (px/s) and it bounces */
const BOUNCE_SPEED = 450;
const LAND_MS = 260;
/** Closest (px) any part of a mascot gets to the top of the screen (or the mobile top bar) */
const CEILING_GAP = 8;

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
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const BUBBLE_STYLE = {
  left: 0,
  top: "auto",
  bottom: 0,
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

const ell = (e: Ellipse, props: SVGProps<SVGEllipseElement> = {}) => (
  <ellipse cx={e.x} cy={e.y} rx={e.rx} ry={e.ry} transform={`rotate(${e.tilt} ${e.x} ${e.y})`} {...props} />
);
const lid = (e: EyeDef, tight = e.lid.tight) => ell({ x: e.x, y: e.y, ...e.lid }, { fill: e.lid.fill, mask: `url(#mascot-feather${tight ? "-tight" : ""})` });

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
    <svg viewBox={`0 0 ${def.w} ${def.h}`} className="block w-full h-auto" style={{ overflow: "visible", touchAction: "none" }}>
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
        {def.eyes.map((e, i) => e.look && (
          <Fragment key={i}>
            <clipPath id={`${def.id}-look-clip-${i}`}>{ell(e.look.cut)}</clipPath>
            <mask id={`${def.id}-look-${i}`} maskUnits="userSpaceOnUse" x="0" y="0" width={def.w} height={def.h}>
              {e.look.ink
                ? <image href={def.src} width={def.w} height={def.h} filter="url(#mascot-ink)" clipPath={`url(#${def.id}-look-clip-${i})`} />
                : ell(e.look.cut, { fill: "#fff", filter: "url(#mascot-blur)" })}
            </mask>
            {e.look.socket && <clipPath id={`${def.id}-socket-${i}`}>{ell(e.look.socket)}</clipPath>}
            {e.look.shine && (
              <>
                {/* Where the patch over the old shine may paint: the eye itself plus the shine's spot */}
                <mask id={`${def.id}-patch-mask-${i}`} maskUnits="userSpaceOnUse" x="0" y="0" width={def.w} height={def.h}>
                  {e.look.ink
                    ? <image href={def.src} width={def.w} height={def.h} filter="url(#mascot-ink)" clipPath={`url(#${def.id}-look-clip-${i})`} />
                    : ell(e.look.shine.within, { fill: "#fff" })}
                  {ell({ ...e.look.shine, rx: e.look.shine.rx + 1.5, ry: e.look.shine.ry + 1.5 }, { fill: "#fff" })}
                </mask>
                <clipPath id={`${def.id}-shine-${i}`}>{ell(e.look.shine.within)}</clipPath>
                <clipPath id={`${def.id}-patch-${i}`}>
                  {ell(e.look.shine.cover ?? { ...e.look.shine.within, rx: e.look.shine.within.rx + 0.8, ry: e.look.shine.within.ry + 0.8 })}
                </clipPath>
              </>
            )}
          </Fragment>
        ))}
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
          <image data-t="body" href={def.src} width={def.w} height={def.h} mask={`url(#${def.id}-body)`} />
          {front.map((l) => (
            <LimbGroup key={l.k} def={def} limb={l} />
          ))}

          {/* Eyes that follow the cursor: the cut-out slides over a fresh eye white, or over the lid's skin */}
          <g data-t="look">
            {def.eyes.map((e, i) => e.look && (
              <g key={i} clipPath={e.look.socket ? `url(#${def.id}-socket-${i})` : undefined}>
                {e.look.socket ? ell(e.look.socket, { fill: e.look.socket.fill }) : lid(e, true)}
                <g data-t={`pupil${i}`}>
                  <image href={def.src} width={def.w} height={def.h} mask={`url(#${def.id}-look-${i})`} />
                  {e.look.shine && (
                    <>
                      <g clipPath={`url(#${def.id}-patch-${i})`} mask={`url(#${def.id}-patch-mask-${i})`} style={{ mixBlendMode: "darken" }}>
                        {ell({ ...e.look.shine, rx: e.look.shine.rx + 4, ry: e.look.shine.ry + 4 }, { fill: e.look.shine.under, filter: "url(#mascot-blur)" })}
                      </g>
                      <g clipPath={`url(#${def.id}-shine-${i})`}>
                        <g data-t={`shine${i}`}>{ell(e.look.shine, { fill: "#fff" })}</g>
                      </g>
                    </>
                  )}
                </g>
                {e.look.socket?.stroke && ell(e.look.socket, { fill: "none", stroke: e.look.socket.stroke, strokeWidth: 2.2 })}
              </g>
            ))}
          </g>
          <g data-t="blush" style={{ opacity: 0 }}>
            {def.cheeks.map((c, i) => (
              <ellipse key={i} cx={c.x} cy={c.y} rx={c.rx} ry={c.ry} fill="url(#mascot-blush)" />
            ))}
          </g>
          <g data-t="lids" style={{ opacity: 0 }}>
            {def.eyes.map((e, i) => <Fragment key={i}>{lid(e)}</Fragment>)}
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
      <ellipse data-t="hit" data-mascot-hit data-cursor-pointer cx={def.hit.cx} cy={def.hit.cy} rx={def.hit.rx} ry={def.hit.ry} fill="transparent" style={{ pointerEvents: "all", touchAction: "none" }} />
    </svg>
  );
}

interface Rig {
  c: CharacterState;
  root: HTMLDivElement;
  art: SVGSVGElement;
  q: (k: string) => SVGElement | null;
  all: SVGElement;
  /** The artwork itself (the whole picture, as drawn this frame) */
  body: SVGElement;
  shadow: SVGElement;
  contacts: SVGElement[];
  limbs: Partial<Record<LimbKey, { el: SVGElement; pivot: readonly [number, number] }>>;
  lids: SVGElement;
  look: SVGElement;
  /** Per eye (null if it doesn't follow the cursor): the moving cut-out and how far it's moved */
  pupils: ({ el: SVGElement; x: number; y: number; cx: number; cy: number; shine: SVGElement | null } | null)[];
  /** Which way the artwork was mirrored last frame (-1 mirrored, 1 as drawn) */
  mirror: number;
  happyEyes: SVGElement;
  closedEyes: SVGElement;
  blush: SVGElement;
  hit: SVGElement;
  bubble: HTMLDivElement;
  bubbleText: HTMLSpanElement;
  bubbleTail: HTMLSpanElement;
  bubbleUntil: number;
  appearAt: number;
  /** Viewport x of the Poké Ball it's flying out of (NaN with reduced motion, where it just appears) */
  fromX: number;
  /** When it started being called back into the Poké Ball (Infinity when it isn't) */
  recallAt: number;
  /** This frame's hop (px), so the bubble rises with the character instead of being jumped into */
  hop: number;
}

export default function Mascots() {
  const rootRefs = useRef<Partial<Record<CharacterId, HTMLDivElement | null>>>({});
  const bubbleRefs = useRef<Partial<Record<CharacterId, HTMLDivElement | null>>>({});
  const fxRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLButtonElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

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
        held: false, lift: 0, lv: 0, vx: 0, grabDX: 0, grabDY: 0, grabPX: 0, grabPY: 0, landAt: -1e9, landHard: 0, nextTrail: 0,
      };
      return {
        c, root, q, limbs, bubble,
        art: root.querySelector("svg")!,
        all: q("all")!, body: q("body")!, shadow: q("shadow")!, contacts: def.soles.map((_, j) => q(`contact${j}`)!),
        lids: q("lids")!, look: q("look")!,
        pupils: def.eyes.map((e, j) => {
          if (!e.look) return null;
          // The artwork's own irises glance off to one side, and that glance would flip with the body when
          // it turns, so gaze is measured from the middle of the eye white instead
          const { cut, socket } = e.look;
          return { el: q(`pupil${j}`)!, x: 0, y: 0, cx: socket ? socket.x - cut.x : 0, cy: socket ? socket.y - cut.y : 0, shine: q(`shine${j}`) };
        }),
        mirror: 1,
        happyEyes: q("happy")!, closedEyes: q("closed")!, blush: q("blush")!, hit: q("hit")!,
        bubbleText: bubble.firstElementChild as HTMLSpanElement,
        bubbleTail: bubble.lastElementChild as HTMLSpanElement,
        bubbleUntil: 0,
        hop: 0,
        appearAt: Infinity, // set when they're let out of the Poké Ball
        fromX: NaN,
        recallAt: Infinity,
      };
    });
    for (const r of rigs) r.hit.style.pointerEvents = "none";
    const rigOf = (c: CharacterState) => rigs.find((r) => r.c === c)!;
    const world = Object.fromEntries(rigs.map((r) => [r.c.def.id, r.c])) as Record<CharacterId, CharacterState>;
    const tg = world.togepi;
    const jp = world.jigglypuff;

    /** Height (px) of the ground they stand on above the bottom of the screen: 4px, plus the home-bar
        inset on phones that have one (read from their CSS, which has the env() inset) */
    let ground = 4;
    const resize = () => {
      ground = parseFloat(getComputedStyle(rigs[0].root).bottom) || 4;
      for (const r of rigs) {
        r.c.W = desktop.matches ? r.c.def.width.desktop : r.c.def.width.mobile;
        r.c.H = (r.c.W * r.c.def.h) / r.c.def.w;
        r.root.style.width = `${r.c.W}px`;
      }
    };
    resize();
    /** While they're out, the Poké Ball waits in the bottom-right corner and they keep clear of it */
    let dockReserved = false;
    const bounds = (c: CharacterState) => {
      const left = desktop.matches ? 80 : 0; // fixed left nav on desktop
      const right = dockReserved ? (desktop.matches ? BALL_DOCK.desktop : BALL_DOCK.mobile) + 14 : 0;
      return [left + c.W / 2 + 12, document.documentElement.clientWidth - c.W / 2 - 12 - right] as const;
    };
    /** The top edge they mustn't cross: the top of the screen, or the bottom of a fixed top bar (mobile nav) */
    let ceiling = CEILING_GAP;
    const measureCeiling = () => {
      ceiling = CEILING_GAP;
      document.querySelectorAll("nav").forEach((nav) => {
        const b = nav.getBoundingClientRect();
        if (b.height > 0 && b.top <= 0 && b.width > window.innerWidth * 0.8 && b.height < window.innerHeight / 3 && getComputedStyle(nav).position === "fixed") {
          ceiling = Math.max(ceiling, b.bottom + CEILING_GAP);
        }
      });
    };
    measureCeiling();
    /** Highest its feet can go with its body still on screen (the drawn pose is checked too, in draw) */
    const maxLift = (c: CharacterState) => Math.max(0, window.innerHeight - ground - c.H - ceiling);
    const buddyGap = () => (tg.W + jp.W) / 2 + BUDDY_GAP;
    const minGap = () => (tg.W + jp.W) / 2 + MIN_GAP;
    /** Which side of Togepi Jigglypuff is on (remembered, in case they're ever exactly level) */
    let buddySide = -1;

    tg.x = tg.tx = clamp(window.innerWidth * 0.86, ...bounds(tg));
    jp.x = jp.tx = clamp(tg.x - buddyGap(), ...bounds(jp));
    let mx = tg.x;
    let my = 0;
    let pointerSeen = false;
    /** Where the cursor last moved to while Togepi was sung to sleep — Jigglypuff follows it on her own */
    let jpChase: number | null = null;

    /* ── Artwork point → viewport, through the levelling lean and the facing flip ── */
    const point = (c: CharacterState, ax: number, ay: number) => {
      const { level, w, h } = c.def;
      const a = (level.angle * Math.PI) / 180;
      const dx = ax - level.x, dy = ay - level.y;
      const lx = level.x + dx * Math.cos(a) - dy * Math.sin(a);
      const ly = level.y + dx * Math.sin(a) + dy * Math.cos(a);
      const fx2 = c.facing >= 0 ? w - lx : lx; // same rule as the flip in draw()
      return { x: c.x + c.offset - c.W / 2 + (fx2 / w) * c.W, y: window.innerHeight - ground - c.H + (ly / h) * c.H };
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
      // Pinned to the bottom of the screen like the mascots, so it stays with them when a phone's
      // address bar hides or shows
      r.bubble.style.bottom = `${window.innerHeight - (point(c, c.def.w / 2, 0).y - r.hop - 10)}px`;
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
    /** A press on a mascot, which becomes a drag once the pointer moves far enough */
    let grab: { c: CharacterState; id: number; x0: number; y0: number; started: boolean } | null = null;
    let noClickUntil = 0; // the click that ends a drag isn't a click on the mascot
    /** Picked up at (x, y), where the press started */
    const pickUp = (c: CharacterState, x: number, y: number) => {
      introOver = true;
      measureCeiling();
      c.held = true;
      if (c.action) c.action = null; // drops whatever it was doing
      if (c === jp) jp.leapStart = 0;
      c.forcedSleepUntil = 0;
      c.sleep = 0;
      c.v = c.lv = c.vx = 0;
      // Hold it by the spot that was grabbed, so it doesn't jump to the pointer
      c.grabDX = x - c.x;
      c.grabDY = window.innerHeight - ground - c.lift - y;
      if (Math.random() < 0.7) say(c, c.def.air.pickup[Math.floor(Math.random() * c.def.air.pickup.length)], 1500);
    };
    const onPointerMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      pointerSeen = true;
      if (grab && e.pointerId === grab.id) {
        if (!grab.started && Math.hypot(mx - grab.x0, my - grab.y0) > DRAG_START) {
          grab.started = true;
          pickUp(grab.c, grab.x0, grab.y0);
        }
        if (grab.started) {
          grab.c.grabPX = mx;
          grab.c.grabPY = my;
          return;
        }
      }
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
    const onPointerUp = (e: PointerEvent) => {
      if (!grab || e.pointerId !== grab.id) return;
      if (grab.started) {
        // Let go: it keeps the speed it was being carried at, so it can be tossed
        grab.c.held = false;
        noClickUntil = performance.now() + 60;
      }
      grab = null;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    // On touch screens a finger dragging across a mascot would scroll the page (and the browser would
    // cancel the drag to do it): while one's pressed, the page stays put. Only the moves are stopped, so
    // a tap still clicks. (touch-action on the SVG isn't honoured everywhere, iOS Safari especially)
    const onTouchMove = (e: TouchEvent) => { if (grab && e.cancelable) e.preventDefault(); };
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    const onResize = () => {
      resize();
      measureCeiling();
      if (ballState === "out") setBall(dockX(), dockSize());
      else if (ballState === "waiting") {
        homeSpots();
        setBall(ballX(), ballSize());
      }
    };
    window.addEventListener("resize", onResize);
    const unbind = rigs.map(({ c, hit }) => {
      const enter = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        c.hovered = true;
        c.lastActive = performance.now();
        c.forcedSleepUntil = 0;
      };
      const leave = () => { c.hovered = false; };
      const click = () => {
        if (performance.now() < noClickUntil) return;
        introOver = true;
        if (!c.action) c.def.onClick(ctx, c);
      };
      const down = (e: PointerEvent) => {
        if (e.button !== 0) return;
        if (e.pointerType === "mouse") e.preventDefault(); // no text selection while dragging
        mx = e.clientX;
        my = e.clientY;
        c.grabPX = mx;
        c.grabPY = my;
        grab = { c, id: e.pointerId, x0: mx, y0: my, started: false };
      };
      hit.addEventListener("pointerenter", enter);
      hit.addEventListener("pointerleave", leave);
      hit.addEventListener("click", click);
      hit.addEventListener("pointerdown", down);
      return () => {
        hit.removeEventListener("pointerenter", enter);
        hit.removeEventListener("pointerleave", leave);
        hit.removeEventListener("click", click);
        hit.removeEventListener("pointerdown", down);
      };
    });

    /* ── Intros, one after the other ── */
    const startIntros = (delay: number) => {
      let introAt = delay;
      for (const id of UPDATE_ORDER) {
        const c = world[id];
        for (const line of c.def.intro(touch)) {
          later(() => { if (!introOver && !c.action && now > c.forcedSleepUntil) say(c, line, 2300); }, introAt);
          introAt += INTRO_LINE_MS;
        }
      }
    };

    /* ── The Poké Ball: rolls in after the loading screen and lets them out when clicked. While they're out
       it waits in the bottom-right corner, and clicking it calls them back (then it rolls back out, ready
       to let them out again) ── */
    const ball = ballRef.current!;
    const ballBody = ball.querySelector<HTMLElement>("[data-b='body']")!;
    const lid = ball.querySelector<SVGElement>("[data-b='lid']")!;
    const base = ball.querySelector<SVGElement>("[data-b='base']")!;
    const hint = hintRef.current!;
    const hintText = hint.querySelector<HTMLElement>("[data-b='hint']")!;
    /** waiting: they're inside, click to let them out · out: it's in the corner, click to call them back */
    let ballState: "waiting" | "out" | "busy" = "busy";
    let introsPlayed = false;
    let wobbler = 0;
    const ballSize = () => (desktop.matches ? BALL.desktop : BALL.mobile);
    const dockSize = () => (desktop.matches ? BALL_DOCK.desktop : BALL_DOCK.mobile);
    /** Where they come out: between their two spots, so they fly out to either side of it */
    const ballX = () => (tg.x + jp.x) / 2;
    /** Where it waits while they're out */
    const dockX = () => document.documentElement.clientWidth - dockSize() / 2 - 14;
    let ballAtX = 0;
    let ballAtSize = 0;
    const hintTail = hint.lastElementChild as HTMLElement;
    /** Over the ball, but kept inside the window (the tail still points at the ball), as when it's in the corner */
    const placeHint = () => {
      const w = hint.offsetWidth;
      const centre = clamp(ballAtX, w / 2 + 12, document.documentElement.clientWidth - w / 2 - 12);
      hint.style.left = `${centre.toFixed(1)}px`;
      hintTail.style.left = `${clamp(ballAtX - (centre - w / 2), 14, w - 14).toFixed(1)}px`;
    };
    const setBall = (x: number, size: number) => {
      ballAtX = x;
      ballAtSize = size;
      ball.style.width = ball.style.height = `${size}px`;
      ball.style.transform = `translate3d(${(x - size / 2).toFixed(1)}px,0,0)`;
      hint.style.bottom = `${size + 16}px`;
      placeHint();
    };
    /** Rolls along the ground to x (turning as it goes), growing or shrinking to size on the way */
    const rollBall = (x: number, size: number, ms: number, done: () => void) => {
      const fromX = ballAtX, fromSize = ballAtSize;
      setBall(x, size);
      if (!reduce) {
        const easing = "cubic-bezier(.2,.7,.3,1)";
        ball.animate(
          [{ transform: `translate3d(${(fromX - size / 2).toFixed(1)}px,0,0) scale(${(fromSize / size).toFixed(3)})` }, { transform: ball.style.transform }],
          { duration: ms, easing },
        );
        const turn = ((x - fromX) / (Math.PI * (fromSize + size) * 0.5)) * 360; // rolling right turns it clockwise
        ballBody.animate([{ transform: `rotate(${(-turn).toFixed(0)}deg)` }, { transform: "rotate(0deg)" }], { duration: ms, easing });
      }
      later(done, reduce ? 0 : ms);
    };
    const showHint = (on: boolean, text?: string) => {
      if (text) {
        hintText.textContent = text;
        placeHint();
      }
      hint.style.opacity = on ? "1" : "0";
      hint.style.transform = on ? "translate(-50%, 0) scale(1)" : "translate(-50%, 6px) scale(0.92)";
    };
    const wobble = (duration = 650) => {
      if (reduce) return;
      ballBody.animate(
        [{ transform: "rotate(0deg)" }, { transform: "rotate(-16deg)" }, { transform: "rotate(13deg)" }, { transform: "rotate(-8deg)" }, { transform: "rotate(0deg)" }],
        { duration, easing: "ease-in-out" },
      );
    };
    let lidAnims: Animation[] = [];
    const setLid = (open: boolean) => {
      if (reduce) return;
      lidAnims.forEach((a) => a.cancel());
      const opts = { duration: open ? 140 : 160, easing: open ? "ease-out" : "ease-in", fill: "forwards" as const };
      lidAnims = [
        lid.animate([{ transform: `rotate(${open ? 0 : -40}deg)` }, { transform: `rotate(${open ? -40 : 0}deg)` }], opts),
        base.animate([{ transform: `rotate(${open ? 0 : 32}deg)` }, { transform: `rotate(${open ? 32 : 0}deg)` }], opts),
      ];
    };
    const ballReady = (state: "waiting" | "out") => {
      ballState = state;
      ball.style.pointerEvents = "";
      ball.tabIndex = 0;
      ball.setAttribute("aria-label", state === "waiting" ? "Let Togepi and Jigglypuff out of their Poké Ball" : "Call Togepi and Jigglypuff back to their Poké Ball");
      window.clearInterval(wobbler);
      if (state === "waiting") wobbler = window.setInterval(() => wobble(), 2800);
    };
    const ballBusy = () => {
      ballState = "busy";
      window.clearInterval(wobbler);
      showHint(false);
      ball.tabIndex = -1;
      ball.style.pointerEvents = "none";
    };
    /** Where they spawn from the ball: back to their usual spots, either side of the middle of the ground */
    const homeSpots = () => {
      tg.x = tg.tx = clamp(window.innerWidth * 0.86, ...bounds(tg));
      jp.x = jp.tx = clamp(tg.x - buddyGap(), ...bounds(jp));
    };

    const release = () => {
      if (ballState !== "waiting") return;
      ballBusy();
      const open = () => {
        const t = performance.now();
        rigs.forEach((r) => {
          r.fromX = reduce ? NaN : ballAtX;
          r.appearAt = t + (r.c === jp ? RELEASE_STAGGER_MS : 0) * (reduce ? 0 : 1);
          r.c.lastActive = t;
        });
        setLid(true);
        if (!reduce) {
          const size = ballAtSize;
          const flash = document.createElement("div");
          flash.style.cssText = `position:absolute;left:${ballAtX - size * 1.5}px;bottom:${ground}px;width:${size * 3}px;height:${size * 3}px;border-radius:50%;background:radial-gradient(circle,#fff 0%,rgba(255,240,220,.75) 40%,rgba(255,240,220,0) 70%);transform-origin:50% 70%`;
          fx.appendChild(flash);
          flash.animate([{ opacity: 0, transform: "scale(0.3)" }, { opacity: 1, transform: "scale(1.2)", offset: 0.25 }, { opacity: 0, transform: "scale(2)" }], { duration: 420, easing: "ease-out" }).onfinish = () => flash.remove();
        }
        // Once they're out it closes and rolls off to wait in the corner (they keep clear of it)
        dockReserved = true;
        later(() => {
          setLid(false);
          rollBall(dockX(), dockSize(), BALL_DOCK_MS, () => ballReady("out"));
        }, reduce ? 0 : RELEASE_MS);
        if (!introsPlayed) {
          introsPlayed = true;
          introOver = false;
          startIntros(RELEASE_MS + 500);
        }
      };
      if (reduce) return open();
      // A little hop and spin, like it's been thrown, then it pops open
      ballBody.animate(
        [{ transform: "translateY(0) rotate(0deg)" }, { transform: `translateY(${-ballAtSize * 1.2}px) rotate(-200deg)`, offset: 0.5 }, { transform: "translateY(0) rotate(-360deg)" }],
        { duration: BALL_HOP_MS, easing: "ease-in-out" },
      );
      later(open, BALL_HOP_MS);
    };

    /** A red recall beam from the ball out to a Pokémon */
    const beam = (c: CharacterState) => {
      const bx = ballAtX, bBottom = ground + ballAtSize / 2;
      const to = point(c, c.def.center.x, c.def.center.y);
      const dx = to.x - bx, dy = to.y - (window.innerHeight - bBottom);
      const angle = Math.atan2(dy, dx);
      const el = document.createElement("div");
      el.style.cssText = `position:absolute;left:${bx}px;bottom:${bBottom - 2}px;width:${Math.hypot(dx, dy)}px;height:4px;border-radius:2px;transform-origin:0 50%;background:linear-gradient(90deg,rgba(255,96,96,.95),rgba(255,170,170,.7));box-shadow:0 0 10px 3px rgba(255,70,70,.55)`;
      fx.appendChild(el);
      const rot = `rotate(${angle.toFixed(3)}rad)`;
      el.animate(
        [{ opacity: 0, transform: `${rot} scaleX(0)` }, { opacity: 1, transform: `${rot} scaleX(1)`, offset: 0.25 }, { opacity: 1, transform: `${rot} scaleX(1)`, offset: 0.65 }, { opacity: 0, transform: `${rot} scaleX(0.2)` }],
        { duration: RECALL_MS + 150, easing: "ease-out" },
      ).onfinish = () => el.remove();
    };
    const recall = () => {
      if (ballState !== "out") return;
      ballBusy();
      introOver = true;
      if (grab) {
        grab.c.held = false;
        grab = null;
      }
      setLid(true);
      const t = performance.now();
      ordered.forEach((r, i) => {
        const c = r.c;
        c.action = null;
        c.held = false;
        if (c === jp) jp.leapStart = 0;
        hideBubble(r);
        r.hit.style.pointerEvents = "none";
        r.recallAt = t + (reduce ? 0 : i * RECALL_STAGGER_MS);
        if (!reduce) later(() => beam(c), i * RECALL_STAGGER_MS);
      });
      // In they go: it snaps shut, wobbles three times, clicks, and rolls back out to where it started
      const inside = reduce ? 0 : RECALL_MS + RECALL_STAGGER_MS + 60;
      later(() => {
        setLid(false);
        if (!reduce) {
          [0, 1, 2].forEach((n) => later(() => wobble(CAPTURE_WOBBLE_MS), CAPTURE_PAUSE_MS + n * CAPTURE_WOBBLE_GAP_MS));
          later(() => {
            for (const dx of [-1, 0, 1]) spawn(SHAPES.star(rand(9, 12)), { x: ballAtX, y: window.innerHeight - ground - ballAtSize }, dx * 18, -22 + Math.abs(dx) * 6, { dur: 900 });
          }, CAPTURE_CLICK_MS);
        }
        later(() => {
          dockReserved = false;
          homeSpots();
          rollBall(ballX(), ballSize(), BALL_DOCK_MS, () => ballReady("waiting"));
        }, reduce ? 0 : CAPTURE_CLICK_MS + 650);
      }, inside);
    };

    // Rolls in from the right edge after the loading screen
    setBall(document.documentElement.clientWidth + ballSize(), ballSize());
    ball.tabIndex = -1;
    later(() => {
      ball.style.opacity = "1";
      rollBall(ballX(), ballSize(), BALL_ROLL_MS, () => {
        ballReady("waiting");
        later(() => { if (ballState === "waiting") showHint(true, HINT_RELEASE); }, 900);
        later(() => { if (ballState === "waiting") showHint(false); }, 5500);
      });
    }, APPEAR_DELAY_MS);
    const onBallClick = () => (ballState === "waiting" ? release() : recall());
    const onBallEnter = () => {
      if (ballState === "waiting") { showHint(true, HINT_RELEASE); wobble(); }
      else if (ballState === "out") showHint(true, HINT_RECALL);
    };
    const onBallLeave = () => { if (ballState !== "busy") showHint(false); };
    ball.addEventListener("click", onBallClick);
    ball.addEventListener("pointerenter", onBallEnter);
    ball.addEventListener("pointerleave", onBallLeave);

    /* ── Back in the ball: hidden, and reset so it comes out fresh next time ── */
    /** Where the recall beam pulls them: into the ball (x, and its middle's height above the ground) */
    const recallTo = { get x() { return ballAtX; }, get lift() { return ballAtSize * 0.25; } };
    const stowAway = (r: Rig) => {
      const c = r.c;
      r.root.style.opacity = "0";
      r.hit.style.pointerEvents = "none";
      r.art.style.filter = "";
      r.appearAt = r.recallAt = Infinity;
      r.fromX = NaN;
      Object.assign(c, {
        action: null, held: false, lift: 0, lv: 0, vx: 0, v: 0, offset: 0, amp: 0, happy: 0, sleep: 0, hovered: false,
        forcedSleepUntil: 0, doodleStart: 0, doodleWoke: 0, leapStart: 0, lastActive: performance.now(),
      });
    };

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
      if (t < r.appearAt + (Number.isNaN(r.fromX) ? 0 : RELEASE_MS)) return; // still flying out of the ball
      if (t >= r.recallAt) return; // being called back into it
      const [minX, maxX] = bounds(c);

      /* Carried: chases the pointer through the air (a little behind, so it swings) */
      if (c.held) {
        const k = Math.min(1, dt * CARRY_FOLLOW);
        const tx = clamp(c.grabPX - c.grabDX, minX, maxX);
        const tl = clamp(window.innerHeight - ground - c.grabPY - c.grabDY, 0, maxLift(c));
        const nx = c.x + (tx - c.x) * k, nl = c.lift + (tl - c.lift) * k;
        if (dt > 0) {
          const s = Math.min(1, dt * 12);
          c.vx += ((nx - c.x) / dt - c.vx) * s;
          c.lv += ((nl - c.lift) / dt - c.lv) * s;
        }
        c.x = c.tx = nx;
        c.lift = nl;
        c.v = 0;
        c.lastActive = t;
        c.amp += (0 - c.amp) * Math.min(1, dt * 8);
        return;
      }
      /* Dropped (or tossed): falls, drifting with the speed it was let go at, bouncing off the edges */
      if (c.lift > 0 || c.lv > 0) {
        c.lv -= GRAVITY * dt;
        c.lift = Math.min(c.lift + c.lv * dt, maxLift(c));
        if (c.lift >= maxLift(c) && c.lv > 0) c.lv = 0; // tossed up into the ceiling
        c.x += c.vx * dt;
        c.vx *= Math.exp(-dt * 0.8);
        if (c.x < minX || c.x > maxX) {
          c.x = clamp(c.x, minX, maxX);
          c.vx *= -0.5;
        }
        if (c.lift <= 0) {
          const impact = -c.lv;
          c.lift = 0;
          c.landAt = t;
          c.landHard = clamp(impact / 1600, 0.25, 1);
          if (impact > BOUNCE_SPEED) {
            c.lv = impact * 0.32;
          } else {
            c.lv = c.vx = 0;
          }
          if (!reduce) {
            spawn(SHAPES.dust(rand(12, 16)), point(c, def.soles[0].x, def.soles[0].y), -16, -10, { dur: 550 });
            spawn(SHAPES.dust(rand(12, 16)), point(c, def.soles[1].x, def.soles[1].y), 16, -10, { dur: 550 });
          }
        }
        c.tx = c.x;
        c.v = 0;
        c.lastActive = t;
        c.amp += (0 - c.amp) * Math.min(1, dt * 8);
        return;
      }
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
      // Not while they're flying out of the Poké Ball (they both start inside it), or while one's in
      // the air being carried or falling (they sort themselves out once it lands)
      if (rigs.some((r) => t < r.appearAt + (Number.isNaN(r.fromX) ? 0 : RELEASE_MS))) return;
      if (tg.held || jp.held || tg.lift > 0 || jp.lift > 0) return;
      if (rigs.some((r) => t >= r.recallAt)) return;
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
      /* Being called back: 0 → 1 as it's pulled into the ball, then it's gone until it's let out again */
      const recall = t >= r.recallAt ? Math.min(1, (t - r.recallAt) / RECALL_MS) : 0;
      if (recall >= 1) {
        stowAway(r);
        return;
      }
      if (r.root.style.opacity !== "1") {
        r.root.style.opacity = "1";
        r.hit.style.pointerEvents = "all"; // can't be hovered or clicked until it's out
      }
      const hatch = reduce ? 1 : easeOutBack(Math.min(1, (t - r.appearAt) / 550));
      const busy = !!c.action;
      const forcedAsleep = t < c.forcedSleepUntil;

      /* Facing: the way it walks, otherwise toward the cursor (with a dead zone so it doesn't flip-flop) */
      const air = c.held || c.lift > 0;
      if (air && Math.abs(c.vx) > 80) c.wantFacing = Math.sign(c.vx);
      else if (Math.abs(c.v) > 6) c.wantFacing = Math.sign(c.v);
      else if (!busy && !c.leapStart && c.sleep < 0.5 && Math.abs(mx - c.x) > c.W) c.wantFacing = Math.sign(mx - c.x);
      c.facing = c.wantFacing; // turns round instantly

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

      /* Flying out of the Poké Ball: an arc from the ball over to its spot, growing as it goes */
      const flight = Number.isNaN(r.fromX) ? 1 : Math.min(1, (t - r.appearAt) / RELEASE_MS);
      if (flight < 1) {
        p.offset += (r.fromX - c.x) * (1 - easeOutCubic(flight));
        p.hop += Math.sin(Math.PI * flight) * c.H * 0.8;
        p.spin += (1 - flight) * 25 * Math.sign(c.x - r.fromX);
      }

      /* In the air: dangling from the pointer, swinging with its speed, legs kicking with glee */
      if (air) {
        p.rot = 0;
        p.spin = clamp(c.vx * 0.035, -28, 28) + Math.sin(secs * 3.2) * 5;
        p.eye = "happy";
        p.blush = Math.max(p.blush, 0.7);
        if (c.held) {
          p.liftL = Math.max(0, Math.sin(secs * 14)) * 14;
          p.liftR = Math.max(0, -Math.sin(secs * 14)) * 14;
          p.tiltL = p.tiltR = 10;
          p.raiseL = 55 + Math.sin(secs * 12) * 25;
          p.raiseR = 55 + Math.cos(secs * 12) * 25;
          p.sy *= 1 + Math.sin(secs * 8) * 0.03;
        } else {
          // Falling: arms up, feet together
          p.raiseL = p.raiseR = 80;
          p.liftL = p.liftR = 0;
        }
        def.air.pose?.(p, secs, c);
        // A trail when it's whizzing about
        if (!reduce && Math.hypot(c.vx, c.lv) > 380 && t > c.nextTrail) {
          c.nextTrail = t + 70;
          spawn(def.air.trail(), point(c, def.center.x, def.center.y), -Math.sign(c.vx) * rand(10, 30), rand(-10, 20), { dur: 700, scale: rand(0.8, 1.1) });
        }
      } else if (t - c.landAt < LAND_MS) {
        // Squashes as it hits the ground
        const k = 1 - (t - c.landAt) / LAND_MS;
        p.sy *= 1 - 0.26 * c.landHard * k;
        p.sx *= 1 + 0.2 * c.landHard * k;
      }

      if (reduce) {
        p.hop = p.rot = p.spin = 0;
        p.raiseL = p.raiseR = p.liftL = p.liftR = p.tiltL = p.tiltR = p.ears = 0;
      }
      if (air) p.hop = c.lift; // carried or falling, it's wherever it is in the air
      if (recall > 0) {
        // Pulled down the beam into the ball, shrinking, glowing red
        const e = recall * recall;
        p.offset = (recallTo.x - c.x) * e;
        p.hop = p.hop * (1 - e) + recallTo.lift * e;
        p.sx *= 1 - 0.92 * e;
        p.sy *= 1 - 0.92 * e;
        r.art.style.filter = `sepia(${recall.toFixed(2)}) saturate(${(1 + 5 * recall).toFixed(2)}) hue-rotate(${(-45 * recall).toFixed(0)}deg) brightness(${(1 + 0.4 * recall).toFixed(2)})`;
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
      // The artwork faces left: mirrored when facing right
      const flip = c.facing < 0 ? 1 : -1;
      const spin = p.spin * Math.sign(flip); // keep the on-screen roll direction when mirrored
      const place = () => r.all.setAttribute(
        "transform",
        `translate(0 ${((-p.hop * def.h) / c.H).toFixed(2)}) rotate(${p.rot.toFixed(2)} ${feet.x} ${feet.y}) translate(${feet.x} ${feet.y}) scale(${(p.sx * flip).toFixed(3)} ${p.sy.toFixed(3)}) translate(${-feet.x} ${-feet.y}) rotate(${spin.toFixed(1)} ${center.x} ${center.y})`,
      );
      place();
      // Never past the top of the screen, whatever the pose (puffed up, tilted, mid-leap…): when it's up
      // high, measure where it's actually drawn and bring it down if any of it pokes over the top
      if (p.hop > 0 && p.hop + c.H * 1.6 > window.innerHeight - ground - ceiling) {
        const over = ceiling - r.body.getBoundingClientRect().top;
        if (over > 0) {
          p.hop = Math.max(0, p.hop - over);
          r.hop = p.hop;
          if (air) {
            c.lift = Math.min(c.lift, p.hop);
            if (c.lv > 0) c.lv = 0;
          }
          place();
        }
      }
      const sh = clamp(1 - p.hop / 40, 0.45, 1) * hatch * p.shrink;
      // The shadow mirrors with the artwork so each contact shadow stays under its foot
      r.shadow.setAttribute("transform", `translate(${feet.x} ${feet.y}) scale(${(sh * flip).toFixed(3)} ${sh.toFixed(3)}) translate(${-feet.x} ${-feet.y})`);
      r.shadow.style.opacity = String(0.3 + 0.7 * sh);
      // The hit area goes up with it in the air, so it can be caught mid-fall
      r.hit.setAttribute("transform", c.lift > 0 ? `translate(0 ${(-(c.lift * def.h) / c.H).toFixed(1)})` : "translate(0 0)");

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
      /* Eyes follow the cursor (each on its own, so they cross a little when it's right in front of them) */
      r.look.style.opacity = p.eye === "open" ? "1" : "0";
      // Offsets are in artwork units, so when the artwork mirrors on a turn they mirror too: keep the
      // eyes looking the same way on screen instead of swinging across
      const mirror = Math.sign(flip);
      if (mirror !== r.mirror) {
        r.mirror = mirror;
        for (const pu of r.pupils) if (pu) pu.x = 2 * pu.cx - pu.x;
      }
      def.eyes.forEach((e, i) => {
        const pu = r.pupils[i];
        if (!pu || !e.look) return;
        const target = p.look ?? (pointerSeen ? { x: mx, y: my } : null);
        if (target && p.eye !== "open") return; // they stay put while shut, rather than recentring every blink
        let gx = 0, gy = 0;
        if (target) {
          const at = point(c, e.x, e.y);
          // Viewport → artwork direction: undo the facing flip, then the levelling lean
          const sx = (target.x - at.x) * mirror, sy = target.y - (at.y - r.hop);
          const a = (-def.level.angle * Math.PI) / 180;
          const dx = sx * Math.cos(a) - sy * Math.sin(a), dy = sx * Math.sin(a) + sy * Math.cos(a);
          const d = Math.hypot(dx, dy) || 1;
          const reach = p.look ? 1 : Math.min(1, d / LOOK_REACH); // something it's been told to watch: a good hard look
          gx = pu.cx + (dx / d) * reach * e.look.range[0];
          gy = pu.cy + (dy / d) * reach * e.look.range[1];
        }
        const k = reduce ? 1 : Math.min(1, dt * 14);
        pu.x += (gx - pu.x) * k;
        pu.y += (gy - pu.y) * k;
        pu.el.setAttribute("transform", `translate(${pu.x.toFixed(2)} ${pu.y.toFixed(2)})`);
        const sh = e.look.shine;
        if (sh && pu.shine) {
          // It rests a little above the middle of the eye (not off to one side as drawn, which would flip
          // with the body) and leads the eye the way it's looking
          const nx = (pu.x - pu.cx) / e.look.range[0], ny = (pu.y - pu.cy) / e.look.range[1];
          const x = sh.within.x - sh.x + nx * sh.range[0];
          const y = sh.within.y - sh.within.ry * SHINE_LIFT - sh.y + ny * sh.range[1];
          pu.shine.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
        }
      });
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
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
      window.clearInterval(wobbler);
      ball.removeEventListener("click", onBallClick);
      ball.removeEventListener("pointerenter", onBallEnter);
      ball.removeEventListener("pointerleave", onBallLeave);
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
          <filter id="mascot-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
          {/* White where the artwork is clearly coloured (green-blue outweighs red), black where it's white,
              grey or pink: cuts a teal iris, shading and all, out of its eye white */}
          <filter id="mascot-ink" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="-6 6 0 0 -0.15  -6 6 0 0 -0.15  -6 6 0 0 -0.15  0 0 0 0 1" />
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
      {/* The Poké Ball they start out in, and go back into (see release() and recall() above) */}
      <button
        ref={ballRef}
        type="button"
        aria-label="Let Togepi and Jigglypuff out of their Poké Ball"
        data-cursor-pointer
        className="fixed left-0 z-[39] p-0 border-0 bg-transparent rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D] focus-visible:ring-offset-2 print:hidden"
        style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 4px)", opacity: 0, width: BALL.desktop, height: BALL.desktop, transformOrigin: "50% 100%" }}
      >
        {/* Ground shadow, under the ball (the ball is positioned too, and comes after it, so it paints on top) */}
        <span className="absolute left-1/2 -translate-x-1/2 rounded-full" style={{ bottom: -3, width: "90%", height: 6, background: "rgba(28,25,23,0.22)", filter: "blur(2px)" }} />
        <span data-b="body" className="relative block w-full h-full" style={{ transformOrigin: "50% 100%" }}>
          <svg viewBox="0 0 64 64" className="block w-full h-full overflow-visible">
            <g data-b="base" style={{ transformBox: "fill-box", transformOrigin: "2px 0px" }}>
              <path d="M0,32 A32,32 0 0 0 64,32 Z" fill="#FAF7F2" stroke="#1C1917" strokeWidth="2.5" />
              <rect x="0" y="31" width="64" height="4" fill="#1C1917" />
            </g>
            <g data-b="lid" style={{ transformBox: "fill-box", transformOrigin: "2px 33px" }}>
              <path d="M0,32 A32,32 0 0 1 64,32 Z" fill="#C4622D" stroke="#1C1917" strokeWidth="2.5" />
              <rect x="0" y="29" width="64" height="4" fill="#1C1917" />
              <circle cx="32" cy="32" r="10" fill="#1C1917" />
              <circle cx="32" cy="32" r="6" fill="#FAF7F2" />
              {/* Shine */}
              <path d="M14,16 Q20,9 29,7" stroke="#fff" strokeOpacity="0.55" strokeWidth="4" strokeLinecap="round" fill="none" />
            </g>
          </svg>
        </span>
      </button>
      <div
        ref={hintRef}
        aria-hidden
        className="fixed z-[39] pointer-events-none w-max whitespace-nowrap font-mono-dm text-[11px] lg:text-xs tracking-wide px-3 py-2 rounded-2xl print:hidden"
        style={{ ...BUBBLE_STYLE, top: "auto", transform: "translate(-50%, 6px) scale(0.92)" }}
      >
        <span data-b="hint">Who&apos;s inside? 👀</span>
        <span
          className="absolute -bottom-[5px] w-2.5 h-2.5 -ml-[5px] rotate-45"
          style={{ background: "#FFFDF8", borderRight: "1px solid rgba(196,98,45,0.25)", borderBottom: "1px solid rgba(196,98,45,0.25)" }}
        />
      </div>
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
