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
import { makePerches, topAt, type Surface } from "./perches";
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
const INTRO_LINE_MS = 2000;
const INTRO_SAY_MS = 2000; // how long each intro line stays up
const SLEEP_AFTER_MS = 7000;
/* Games: how long they're left alone before they start one, how soon they try again after one's cut short,
   how far the pointer can wander before they stop to follow it, and how much longer than usual they stay
   up waiting for a game that hasn't been played yet (when it can't be, they nod off after all) */
const PLAY_AFTER_MS = 3500;
const PLAY_RETRY_MS = 2000;
const GAMES_GRACE_MS = 8000;
const PLAY_QUIT_DIST = 120;
const SERVE_WOBBLE_MS = 500;
/** How fast the ball rolls home to its corner when a kickabout's cut short (px/s) */
const HOME_SPEED = 420;
/** A beat with the ball at its feet before the wind-up */
const HOLD_MS = 350;
const KICK_WIND_MS = 180;
const KICK_FOLLOW_MS = 300;
const TRAP_MS = 280;
const HEADER_MS = 520;
const CHEER_MS = 1400;
/* Hide and seek: when the seeker starts counting and how long each number takes (s), how long it looks
   round each wrong guess (ms), how long hopping in behind or back out takes (ms), and the reveal (s):
   the hider pops out, then they both cheer, then it's over */
const COUNT_FROM = 1;
const COUNT_STEP = 1;
/** It counts on (until the hider's hidden) up to this, then comes looking anyway */
const COUNT_MAX = 10;
/** The hider hurries off to hide this much faster than it walks */
const HIDE_RUN = 1.7;
const LOOK_MS = 1100;
const HIDE_HOP_MS = 420;
const REVEAL_POP = 0.3;
const REVEAL_GIGGLE = 0.85;
const REVEAL_END = 2.3;
/* Rock, paper, scissors (ms): each word of the chant, the hands held out, the result, and the win at the end.
   First to three wins (a tie doesn't count), or whoever's ahead after this many goes, if the ties drag on */
const RPS_BEAT_MS = 480;
const RPS_SHOW_MS = 1100;
const RPS_RESULT_MS = 1500;
const RPS_FINAL_MS = 2700;
const RPS_TO_WIN = 3;
const RPS_MAX_ROUNDS = 12;
const HANDS = ["✊", "✋", "✌️"];
const CHANT = ["Rock… ✊", "Paper… ✋", "Scissors… ✌️"];
const JINX = ["Jinx! 😆", "Great minds… 😮", "Again! Again!"];
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

// Up on the page (see perches.ts)
/** At the edge of what it's on, wanting to get down: how long it peeks over before hopping off (Togepi;
    Jigglypuff, following Togepi, doesn't dither as long) */
const EDGE_PEEK_MS = 900;
/** Crouching before a jump */
const CROUCH_MS = 220;
/** How far (px) to the side Jigglypuff will jump from to get up beside Togepi */
const JUMP_REACH = 140;
/** How far (px) a jump rises above the higher of where it starts and lands */
const JUMP_CLEAR = 50;
/** Carried up faster than this (px/s) by the page scrolling, and it wobbles to keep its balance… */
const SWAY_SPEED = 250;
/** …and if what it's on stops dead while going up faster than this, it's tossed up into the air */
const TOSS_SPEED = 900;
const TOSS_MAX = 950;
/** …and if it's whipped down away from under it faster than this, it's left in the air for a moment */
const DROP_SPEED = 700;

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
      {limb.over && <path {...limb.over} />}
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
            <path key={l.k} d={l.hole ?? l.cut} fill="#000" />
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

      {/* A soft shadow all round it, so it stands out from whatever it's in front of (outside the moving
          group, so the shadow always falls the same way however it turns) */}
      <g filter="url(#mascot-lift)">
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
          <g data-t="lids" style={{ opacity: 0 }}>
            {def.eyes.map((e, i) => <Fragment key={i}>{lid(e)}</Fragment>)}
          </g>
          {/* Over the lids, which reach down over the cheeks when the eyes close */}
          <g data-t="blush" style={{ opacity: 0 }}>
            {def.cheeks.map((c, i) => (
              <ellipse key={i} cx={c.x} cy={c.y} rx={c.rx} ry={c.ry} fill="url(#mascot-blush)" />
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
  /** The top of what it's standing on this frame (null on the ground) */
  surface: Surface | null;
  /** Its next jump, once it's crouched: where to, and who to land beside (their level) or null for the ground */
  jump: { x: number; to: CharacterState | null } | null;
  /** Which edge it's peeking over (-1 left, 1 right) */
  edgeDir: number;
  /** In the air from a jump: what it jumped off (it won't come straight back down on that), and who it's
      jumping up beside (it lands only at their height) */
  flight: { from: Element | null; to: CharacterState | null } | null;
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
        perch: null, stand: 0, jumping: false, edgeAt: 0, crouchAt: 0, pv: 0,
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
        surface: null,
        jump: null,
        edgeDir: 0,
        flight: null,
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
    /** Width of the fixed sidebar down the left on desktop (nothing goes under it) */
    const sidebar = () => (desktop.matches ? 80 : 0);
    /** Leftmost / rightmost x it can be at on the ground */
    const floorBounds = (c: CharacterState) => {
      const left = sidebar();
      const right = dockReserved ? (desktop.matches ? BALL_DOCK.desktop : BALL_DOCK.mobile) + 14 : 0;
      return [left + c.W / 2 + 12, document.documentElement.clientWidth - c.W / 2 - 12 - right] as const;
    };
    /** Where it can walk on top of something: its feet stay on, though it can lean out over the edge a bit */
    const walkRange = (c: CharacterState, s: Surface) => {
      const [a, b] = floorBounds(c);
      const inset = Math.min(c.W * 0.22, (s.right - s.left) / 2);
      return [Math.max(a, s.left + inset), Math.min(b, s.right - inset)] as const;
    };
    /** Where it can walk now: along the ground, or along what it's standing on */
    const bounds = (c: CharacterState) => {
      const s = rigOf(c).surface;
      return c.perch && s ? walkRange(c, s) : floorBounds(c);
    };
    const perches = makePerches();
    // Text is measured in the site's fonts, so start again once they've loaded
    const onFonts = () => perches.reset();
    document.fonts?.addEventListener("loadingdone", onFonts);
    /** In the air (not held): dropped, thrown or jumping */
    const aloft = (c: CharacterState) => !c.held && !c.perch && (c.lift > 0 || c.lv > 0);
    /** Both on the ground, or standing at the same height on overlapping things (a card and the picture
        flush with its top count as one) */
    const sameLevel = (a: CharacterState, b: CharacterState) => {
      if (!a.perch || !b.perch) return !a.perch && !b.perch;
      const sa = rigOf(a).surface, sb = rigOf(b).surface;
      if (!sa || !sb || sa.left > sb.right || sb.left > sa.right) return false;
      const x = (Math.max(sa.left, sb.left) + Math.min(sa.right, sb.right)) / 2;
      return Math.abs(topAt(sa, x) - topAt(sb, x)) < 4;
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

    tg.x = tg.tx = clamp(window.innerWidth * 0.86, ...floorBounds(tg));
    jp.x = jp.tx = clamp(tg.x - buddyGap(), ...floorBounds(jp));
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
      return { x: c.x + c.offset - c.W / 2 + (fx2 / w) * c.W, y: window.innerHeight - ground - c.stand - c.H + (ly / h) * c.H };
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
      // Kept on the screen, and clear of the sidebar (it's drawn over the mascots and their bubbles)
      const left = clamp(cx - bw / 2, sidebar() + 12, document.documentElement.clientWidth - bw - 12);
      r.bubble.style.left = `${left}px`;
      // Pinned to the bottom of the screen like the mascots, so it stays with them when a phone's
      // address bar hides or shows
      // Never up off the top of the screen (or behind the mobile nav) when it's perched up high
      const bottom = window.innerHeight - (point(c, c.def.w / 2, 0).y - r.hop - 10);
      r.bubble.style.bottom = `${Math.min(bottom, window.innerHeight - ceiling - r.bubble.offsetHeight)}px`;
      r.bubbleTail.style.left = `${clamp(cx - left, 14, bw - 14)}px`;
    };

    /* ── Moves ── */
    const ctx: Ctx = {
      get now() { return now; },
      reduce, touch, world, spawn, spawnPath, say, point, later, bounds, sameLevel,
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
        if (rigOf(c).bubbleUntil) return; // never sent to sleep mid-sentence
        c.forcedSleepUntil = performance.now() + ms;
        c.action = null;
      },
      flash: (c) => {
        if (!reduce) rigOf(c).art.animate([{ filter: "brightness(1)" }, { filter: "brightness(1.7) saturate(0.4)" }, { filter: "brightness(1)" }], { duration: 160, iterations: 4 });
      },
    };

    let introOver = false; // the intros stop once the visitor starts playing
    let introUntil = 0; // when the last intro line ends

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
      c.perch = null;
      c.stand = 0;
      c.jumping = false;
      c.edgeAt = c.crouchAt = 0;
      rigOf(c).surface = rigOf(c).jump = rigOf(c).flight = null;
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
        // Up on something, it stops beside the cursor rather than right under it when the cursor's just
        // above it, so it doesn't get in the way of whatever's being pointed at there
        const feet = window.innerHeight - ground - tg.stand;
        const near = tg.perch && my > feet - tg.H * 1.4 && my < feet + 10;
        tg.tx = clamp(near ? mx + (tg.x < mx ? -1 : 1) * tg.W * 0.75 : mx, ...floorBounds(tg));
        if (now < tg.forcedSleepUntil) jpChase = mx;
      }
    };
    /** A touch that isn't on a mascot: only a tap (not the start of a scroll) sends Togepi there */
    let tap: { id: number; x: number; y: number } | null = null;
    const onPointerDown = (e: PointerEvent) => {
      onPointerMove(e);
      if (e.pointerType !== "mouse" && !(e.target as Element).closest?.("[data-mascot-hit]")) tap = { id: e.pointerId, x: e.clientX, y: e.clientY };
    };
    const onPointerUp = (e: PointerEvent) => {
      if (tap && e.pointerId === tap.id) {
        if (e.type === "pointerup" && Math.hypot(e.clientX - tap.x, e.clientY - tap.y) < 12) {
          endGame(performance.now(), false); // a tap sends Togepi off, so any game's over
          endRps(performance.now(), false);
          abortHide(performance.now());
          tg.tx = clamp(e.clientX, ...floorBounds(tg));
          if (now < tg.forcedSleepUntil) jpChase = e.clientX;
        }
        tap = null;
      }
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
    const onTouchMove = (e: TouchEvent) => { if ((grab || ballDrag) && e.cancelable) e.preventDefault(); };
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    const onResize = () => {
      endGame(performance.now(), false, true); // the ball's put straight back in its corner
      clearHide();
      endRps(performance.now(), false);
      perches.reset();
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

    /* ── Intros: each says hello in turn, then each tells the rest of its lines ── */
    let introRun = 0; // lines still due from an earlier release are dropped
    const startIntros = (delay: number, full: boolean) => {
      let introAt = delay;
      const run = ++introRun;
      const lines = UPDATE_ORDER.map((id) => world[id].def.intro(touch).map((line) => ({ c: world[id], line })));
      const order = [...lines.map((l) => l[0]), ...(full ? lines.flatMap((l) => l.slice(1)) : [])];
      for (const { c, line } of order) {
        later(() => { if (run === introRun && !introOver && !c.action && now > c.forcedSleepUntil) say(c, line, INTRO_SAY_MS); }, introAt);
        introAt += INTRO_LINE_MS;
      }
      introUntil = performance.now() + introAt - INTRO_LINE_MS + INTRO_SAY_MS;
    };

    /* ── The Poké Ball: rolls in after the loading screen and lets them out when clicked. While they're out
       it waits in the bottom-right corner, and clicking it calls them back (then it rolls back out, ready
       to let them out again) ── */
    const ball = ballRef.current!;
    const ballBody = ball.querySelector<HTMLElement>("[data-b='body']")!;
    const lid = ball.querySelector<SVGElement>("[data-b='lid']")!;
    const light = ball.querySelector<SVGElement>("[data-b='light']")!;
    const base = ball.querySelector<SVGElement>("[data-b='base']")!;
    const hint = hintRef.current!;
    const ballShadow = ball.querySelector<HTMLElement>("[data-b='shadow']")!;
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
    /** How high it is off the ground (px), while it's being carried or thrown */
    let ballLift = 0;
    const setBall = (x: number, size: number) => {
      ballAtX = x;
      ballAtSize = size;
      ball.style.width = ball.style.height = `${size}px`;
      ball.style.transform = `translate3d(${(x - size / 2).toFixed(1)}px,${(-ballLift).toFixed(1)}px,0)`;
      // Its shadow stays on the ground, smaller and fainter the higher it goes
      const sh = clamp(1 - ballLift / 220, 0.35, 1);
      ballShadow.style.transform = `translateY(${ballLift.toFixed(1)}px) scale(${sh.toFixed(2)})`;
      ballShadow.style.opacity = sh.toFixed(2);
      hint.style.bottom = `${size + 16 + ballLift}px`;
      placeHint();
    };
    /** Turned about its middle (its transform origin is at the bottom, for wobbling) */
    const spun = (deg: number) => `translateY(-50%) rotate(${deg.toFixed(1)}deg) translateY(50%)`;
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
        // Whole turns, so it sets off and ends upright (turning about its middle, not where it touches the ground)
        const start = 360 * Math.round(-turn / 360);
        ballBody.animate([{ transform: spun(start) }, { transform: spun(0) }], { duration: ms, easing });
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
    /** Which way it opens: toward them when they're both on one side (-1 left, 1 right), or straight up
        when it's between them (0) */
    const towardThem = () => {
      const sides = [tg, jp].map((c) => {
        const dx = c.x + c.offset - ballAtX;
        return Math.abs(dx) < 4 ? 0 : Math.sign(dx);
      });
      return sides[0] === sides[1] ? sides[0] : 0;
    };
    /** Open, its halves swing apart on a hinge at the far side, like a clamshell, or the top lifts straight up */
    const openPose = (dir: number) =>
      dir
        ? { lid: `rotate(${-40 * dir}deg)`, base: `rotate(${32 * dir}deg)`, lidAt: `${dir > 0 ? 2 : 62}px 33px`, baseAt: `${dir > 0 ? 2 : 62}px 0px` }
        : { lid: "translateY(-14px)", base: "translateY(6px)", lidAt: "32px 33px", baseAt: "32px 0px" };
    let lidDir = 1;
    const setLid = (open: boolean) => {
      if (reduce) return;
      lidAnims.forEach((a) => a.cancel());
      if (open) lidDir = towardThem();
      const pose = openPose(lidDir);
      lid.style.transformOrigin = pose.lidAt;
      base.style.transformOrigin = pose.baseAt;
      const opts = { duration: open ? 140 : 160, easing: open ? "ease-out" : "ease-in", fill: "forwards" as const };
      const swing = (el: SVGElement, to: string) => el.animate(open ? [{ transform: "none" }, { transform: to }] : [{ transform: to }, { transform: "none" }], opts);
      lidAnims = [swing(lid, pose.lid), swing(base, pose.base)];
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
      tg.x = tg.tx = clamp(window.innerWidth * 0.86, ...floorBounds(tg));
      jp.x = jp.tx = clamp(tg.x - buddyGap(), ...floorBounds(jp));
    };

    /** Pops open where it is and lets them out, then closes and rolls off to wait in the corner */
    const letOut = () => {
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
      // The full intros the first time they're let out; after that, just their hellos
      introOver = false;
      played.ball = played.hide = played.rps = false; // fresh out of the ball: every game before a nap
      startIntros(RELEASE_MS + 500, !introsPlayed);
      introsPlayed = true;
    };
    const release = () => {
      if (ballState !== "waiting") return;
      ballBusy();
      if (reduce) return letOut();
      // A little hop and spin, like it's been thrown, then it pops open
      ballBody.animate(
        [{ transform: "translateY(0) rotate(0deg)" }, { transform: `translateY(${-ballAtSize * 1.2}px) rotate(-200deg)`, offset: 0.5 }, { transform: "translateY(0) rotate(-360deg)" }],
        { duration: BALL_HOP_MS, easing: "ease-in-out" },
      );
      later(letOut, BALL_HOP_MS);
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
      callBack();
    };
    /** Opens where it is and pulls them back in, then the capture, then it rolls back out to the middle */
    const callBack = () => {
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
          // Its button glows red the whole time, flaring with each wobble, and goes out with the click
          const at = (ms: number, opacity: number) => ({ offset: ms / CAPTURE_CLICK_MS, opacity, easing: "ease-in-out" });
          light.animate(
            [
              at(0, 0),
              at(200, 0.75),
              ...[0, 1, 2].flatMap((n) => {
                const t = CAPTURE_PAUSE_MS + n * CAPTURE_WOBBLE_GAP_MS;
                return [at(t, 0.75), at(t + CAPTURE_WOBBLE_MS * 0.4, 1), at(t + CAPTURE_WOBBLE_MS, 0.75)];
              }),
              at(CAPTURE_CLICK_MS - 120, 0.75),
              at(CAPTURE_CLICK_MS, 0),
            ],
            { duration: CAPTURE_CLICK_MS },
          );
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

    /* ── The ball can be picked up and thrown too: it spins in the air, and where it lands it lets them
       out (or calls them back) ── */
    /** A press on the ball, which becomes a drag once the pointer moves far enough */
    let ballDrag: { id: number; x0: number; y0: number; started: boolean; dx: number; dy: number; px: number; py: number; vx: number; vy: number; then: "release" | "recall" } | null = null;
    /** Thrown: flying (or bouncing) until it lands */
    let ballFly: { vx: number; vy: number; then: "release" | "recall" } | null = null;
    let ballSpin = 0; // deg
    let noBallClickUntil = 0;
    const maxBallLift = () => Math.max(0, window.innerHeight - ground - ballAtSize - ceiling);
    const spinBall = (degPerSec: number, dt: number) => {
      if (reduce) return;
      ballSpin += degPerSec * dt;
      ballBody.style.transform = `rotate(${ballSpin.toFixed(1)}deg)`;
    };
    const onBallDown = (e: PointerEvent) => {
      if (e.button !== 0 || (ballState !== "waiting" && ballState !== "out")) return;
      ballDrag = {
        id: e.pointerId, x0: e.clientX, y0: e.clientY, started: false, dx: 0, dy: 0, px: e.clientX, py: e.clientY, vx: 0, vy: 0,
        then: ballState === "waiting" ? "release" : "recall",
      };
    };
    const onBallDragMove = (e: PointerEvent) => {
      const d = ballDrag;
      if (!d || e.pointerId !== d.id) return;
      d.px = e.clientX;
      d.py = e.clientY;
      if (!d.started && Math.hypot(d.px - d.x0, d.py - d.y0) > DRAG_START) {
        d.started = true;
        ballBusy();
        // Held by the spot that was grabbed
        d.dx = d.x0 - ballAtX;
        d.dy = d.y0 - (window.innerHeight - ground - ballLift - ballAtSize / 2);
      }
    };
    const onBallDragEnd = (e: PointerEvent) => {
      const d = ballDrag;
      if (!d || e.pointerId !== d.id) return;
      ballDrag = null;
      if (!d.started) return; // just a click
      noBallClickUntil = performance.now() + 60;
      ballFly = { vx: d.vx, vy: d.vy, then: d.then };
    };
    /** Landed: straight away lets them out where it is, or calls them back to it (turning upright as it opens) */
    const ballLanded = (then: "release" | "recall") => {
      const a = ((ballSpin % 360) + 360) % 360;
      ballSpin = 0;
      ballBody.style.transform = "";
      if (!reduce) ballBody.animate([{ transform: `rotate(${a.toFixed(0)}deg)` }, { transform: `rotate(${a > 180 ? 360 : 0}deg)` }], { duration: 160, easing: "ease-out" });
      if (then === "recall") return callBack();
      // They come out either side of where it landed (moved in from the edge if there isn't room there)
      const half = buddyGap() / 2;
      const mid = clamp(ballAtX, floorBounds(jp)[0] + half, floorBounds(tg)[1] - half);
      tg.x = tg.tx = mid + half;
      jp.x = jp.tx = mid - half;
      letOut();
    };
    /** Every frame: the ball follows the pointer while it's carried, and flies once it's thrown */
    const ballTick = (dt: number) => {
      const vw = document.documentElement.clientWidth;
      if (ballDrag?.started) {
        const d = ballDrag;
        // Picked up from the corner, it grows back to full size
        const size = ballAtSize + (ballSize() - ballAtSize) * Math.min(1, dt * 10);
        const tx = clamp(d.px - d.dx, sidebar() + size / 2 + 4, vw - size / 2 - 4);
        const tl = clamp(window.innerHeight - ground - (d.py - d.dy) - size / 2, 0, maxBallLift());
        const k = Math.min(1, dt * 20);
        const nx = ballAtX + (tx - ballAtX) * k, nl = ballLift + (tl - ballLift) * k;
        if (dt > 0) {
          const sm = Math.min(1, dt * 12);
          d.vx += ((nx - ballAtX) / dt - d.vx) * sm;
          d.vy += ((nl - ballLift) / dt - d.vy) * sm;
        }
        ballLift = nl;
        setBall(nx, size);
        // Spins the whole time it's held, faster the faster it's swung about (the way it's going)
        spinBall((d.vx < 0 ? -1 : 1) * (420 + Math.hypot(d.vx, d.vy) * 0.9), dt);
        return;
      }
      const f = ballFly;
      if (!f) return;
      f.vy -= GRAVITY * dt;
      ballLift = Math.min(ballLift + f.vy * dt, maxBallLift());
      if (ballLift >= maxBallLift() && f.vy > 0) f.vy = 0;
      let x = ballAtX + f.vx * dt;
      f.vx *= Math.exp(-dt * 0.6);
      const half = ballAtSize / 2 + 4;
      if (x < sidebar() + half || x > vw - half) {
        x = clamp(x, sidebar() + half, vw - half);
        f.vx *= -0.5;
      }
      spinBall((f.vx < 0 ? -1 : 1) * (300 + Math.abs(f.vx) * 1.2), dt);
      if (ballLift <= 0) {
        // The moment it touches the ground, it does its thing
        ballLift = 0;
        if (!reduce) spawn(SHAPES.dust(rand(10, 13)), { x, y: window.innerHeight - ground }, 0, -10, { dur: 500 });
        ballFly = null;
        setBall(x, ballAtSize);
        ballLanded(f.then);
        return;
      }
      setBall(x, ballAtSize);
    };
    /* ── A kickabout: left alone for a bit, they borrow the Poké Ball from its corner and pass it back and
       forth, until the one further from the corner chips it over the other's head back in. Anything the
       visitor does (or the ball being picked up or clicked) ends it, and the ball rolls home ── */
    /** Rolled (peak 0), or flown in an arc that tops out `peak` px up over x = `apex` */
    type Shot = { from: number; to: number; dur: number; peak: number; apex: number; goal: boolean; receiver: CharacterState | null };
    let game: {
      phase: "gather" | "serve" | "fly" | "hold" | "cheer";
      at: number;
      /** Nearer the left / nearer the corner, and where they stand */
      L: CharacterState;
      R: CharacterState;
      spots: readonly [number, number];
      holder: CharacterState | null;
      /** Passes left before the one on the left goes for goal, and how many there have been */
      passes: number;
      kicks: number;
      shot: Shot | null;
      /** Where the pointer was when it started: moving well away from there ends it */
      mx0: number;
      my0: number;
    } | null = null;
    /** When each last kicked (the moment of contact), stopped the ball, jumped for it and cheered */
    const plays = new Map<CharacterState, { kick: number; trap: number; jump: number; cheer: number }>(
      [tg, jp].map((c) => [c, { kick: -1e9, trap: -1e9, jump: -1e9, cheer: -1e9 }]),
    );
    let nextGameAt = 0;
    /** Which games they've played since they last woke up: they play every one before they settle down for a nap */
    const played = { ball: false, hide: false, rps: false };
    /** Still a game to play before they can nap (none with reduced motion, where they don't play) */
    const gamesOwed = () => !reduce && !(played.ball && played.hide && played.rps);
    /** A game's over. Played to the end, it counts; cut short, it doesn't, and they try again once they've
        been left alone a moment (see playTick) */
    const gameOver = (t: number, which: keyof typeof played, done: boolean) => {
      if (done) played[which] = true;
      nextGameAt = t + (done ? 0 : PLAY_RETRY_MS);
    };
    const other = (c: CharacterState) => (c === tg ? jp : tg);
    const ballMid = () => window.innerHeight - ground - ballLift - ballAtSize / 2;
    /** Where the ball sits to be kicked: just in front of its feet, on the side facing the other one */
    const footOf = (c: CharacterState) => c.x + Math.sign(other(c).x - c.x) * (c.W * 0.42 + ballAtSize / 2);
    /** Turns the ball to how far it's gone (rolling right turns it clockwise) */
    const turnBall = (dx: number, k = 1) => {
      ballSpin += (dx / (Math.PI * ballAtSize)) * 360 * k;
      ballBody.style.transform = spun(ballSpin);
    };
    /** Rights itself, so it opens the right way up next time */
    const uprightBall = () => {
      const a = ((ballSpin % 360) + 360) % 360;
      ballSpin = 0;
      ballBody.style.transform = "";
      return a > 0.5 ? ballBody.animate([{ transform: spun(a) }, { transform: spun(a > 180 ? 360 : 0) }], { duration: 200, easing: "ease-out" }) : null;
    };
    /** Free to play: awake, not being handled or doing anything else. It can be up on something (or on its
        way down off it): it hops down to the ground to play */
    const canPlay = (c: CharacterState, t: number) => {
      const r = rigOf(c);
      return t >= r.appearAt + RELEASE_MS && r.recallAt === Infinity && !c.held && !c.action && !c.hovered && t >= c.forcedSleepUntil && c.sleep < 0.2;
    };
    /** Down on the ground (not up on something, jumping or about to) */
    const grounded = (c: CharacterState) => !c.perch && !aloft(c) && !c.crouchAt;
    /** Heads for x on the ground. Up on something, it gets down first: off the end, if x is out past it
        (and there's room down there), otherwise with a hop straight down off the front of it */
    const goDown = (c: CharacterState, x: number, t: number) => {
      const r = rigOf(c), s = r.surface;
      c.tx = x;
      if (c === tg) tgSent = x;
      if (!c.perch || !s || c.crouchAt) return;
      const [a, b] = walkRange(c, s), [fa, fb] = floorBounds(c);
      const pad = c.def.walk.startDist + 30;
      if (x < a && a - fa > c.W * 0.5) c.tx = Math.min(x, a - pad);
      else if (x > b && fb - b > c.W * 0.5) c.tx = Math.max(x, b + pad);
      else {
        c.crouchAt = t;
        r.jump = { x: clamp(c.x + clamp(x - c.x, -140, 140), fa, fb), to: null };
      }
      if (c === tg) tgSent = c.tx;
    };
    /** What goDown last sent Togepi to */
    let tgSent = NaN;
    /** A game's over: it stays where it is (or wherever it's about to land), and doesn't hop down after all */
    const standStill = (c: CharacterState) => {
      const r = rigOf(c);
      if (c.crouchAt) {
        c.crouchAt = 0;
        r.jump = null;
      }
      if (aloft(c) && c.jumping) {
        const secs = (c.lv + Math.sqrt(c.lv * c.lv + 2 * GRAVITY * Math.max(0, c.lift))) / GRAVITY;
        c.tx = clamp(c.x + c.vx * secs, ...floorBounds(c));
      } else c.tx = c.x;
    };
    const ballFree = () => ballState === "out" && !ballDrag?.started && !ballFly;
    /** How high it jumps to head the ball */
    const headerHop = (c: CharacterState) => Math.min(44, c.H * 0.45);
    const shoot = (t: number, shot: Shot) => {
      game!.shot = shot;
      game!.holder = null;
      game!.phase = "fly";
      game!.at = t;
      // Going for goal, the one in the way jumps to head it as it goes over
      if (shot.goal) {
        const f = clamp((game!.R.x - shot.from) / (shot.to - shot.from), 0, 1);
        plays.get(game!.R)!.jump = Math.max(t, t + f * shot.dur * 1000 - HEADER_MS / 2);
      }
    };
    /** Height of a flown shot at x: one half-parabola up to the apex, another down from it */
    const arcAt = (s: Shot, x: number) => {
      const end = x < s.apex === s.from < s.apex ? s.from : s.to;
      const u = end === s.apex ? 0 : clamp((x - s.apex) / (end - s.apex), 0, 1);
      return s.peak * (1 - u * u);
    };
    /** Height for an arc that tops out right over `over` and clears it by `clear` px (it can land just past
        it, coming down steeply, so it's high enough to still clear its shoulder on the way down) */
    const clearing = (over: CharacterState, clear: number) => Math.min(maxBallLift(), over.H + clear);
    /** Left lying about (or still in the air) when a kickabout ends: it falls, then rolls home to its
        corner. It's moved a frame at a time, so it can still be clicked or grabbed wherever it is */
    let loose = false;
    let looseVy = 0;
    /** Over: the ball comes down and goes home. `instant` (the window's being resized) puts it straight back */
    const endGame = (t: number, done: boolean, instant = false) => {
      const g = game;
      if (!g) return;
      game = null;
      gameOver(t, "ball", done);
      g.L.lastActive = g.R.lastActive = t;
      // Stays where it is rather than going back to its spot, unless something's already sent it elsewhere
      if (tg.tx === tgSent || tg.tx === g.spots[0] || tg.tx === g.spots[1]) standStill(tg);
      if (jp.crouchAt) standStill(jp); // (she goes back to following Togepi about)
      if (ballDrag?.started || ballFly) {
        // Picked up: the throw has it now (spinning its own way, about its bottom)
        ballSpin = 0;
        ballBody.style.transform = "";
        return;
      }
      if (instant) {
        ballLift = 0;
        setBall(ballAtX, ballAtSize);
        uprightBall();
        return;
      }
      loose = true;
      looseVy = 0;
    };
    const looseTick = (dt: number) => {
      if (ballDrag?.started || ballFly) {
        loose = false;
        ballSpin = 0;
        ballBody.style.transform = "";
        return;
      }
      if (ballLift > 0) {
        looseVy -= GRAVITY * dt;
        ballLift = Math.max(0, ballLift + looseVy * dt);
        if (!ballLift) spawn(SHAPES.dust(rand(9, 12)), { x: ballAtX, y: window.innerHeight - ground }, 0, -8, { dur: 450 });
        setBall(ballAtX, ballAtSize);
        return;
      }
      const dist = dockX() - ballAtX;
      if (ballState !== "out" || Math.abs(dist) <= 0.5) {
        // Home (or being called back from where it is)
        if (ballState === "out") setBall(dockX(), dockSize());
        uprightBall();
        loose = false;
        return;
      }
      const step = Math.sign(dist) * Math.min(Math.abs(dist), Math.min(HOME_SPEED, 30 + Math.sqrt(2 * DECEL * Math.abs(dist))) * dt);
      turnBall(step);
      setBall(ballAtX + step, ballAtSize);
    };
    /** A kickabout: they spread out a pass apart, around where they are now (if there's room) */
    const startBall = (t: number) => {
      const [L, R] = tg.x < jp.x ? [tg, jp] : [jp, tg];
      const [lMin] = floorBounds(L), [, rMax] = floorBounds(R);
      const gap = Math.min(clamp(window.innerWidth * 0.2, 170, 260), rMax - lMin);
      if (gap < (L.W + R.W) / 2 + 70) return false;
      const mid = clamp((L.x + R.x) / 2, lMin + gap / 2, rMax - gap / 2);
      game = { phase: "gather", at: t, L, R, spots: [mid - gap / 2, mid + gap / 2], holder: null, passes: Math.random() < 0.5 ? 3 : 5, kicks: 0, shot: null, mx0: mx, my0: my };
      say(tg, "Let's play ball! ⚽", 1600);
      return true;
    };
    const playTick = (t: number, dt: number) => {
      if (reduce) return;
      if (loose) looseTick(dt);
      if (!game) {
        if (loose || hide || rps || !gamesOwed() || t < nextGameAt || jpChase !== null) return;
        if (introUntil && !introOver && t < introUntil) return;
        if (![tg, jp].every((c) => canPlay(c, t) && c.v === 0 && !rigOf(c).bubbleUntil && t - c.lastActive > PLAY_AFTER_MS)) return;
        // Which game: one they haven't played yet, at random (the kickabout only if the ball's there to play
        // with). If none of them can be played just now, they have another go in a bit
        const ballOk = ballFree() && Math.abs(ballAtX - dockX()) <= 1;
        const starts = { ball: startBall, hide: startHide, rps: startRps };
        const left = (Object.keys(starts) as (keyof typeof starts)[]).filter((k) => !played[k] && (k !== "ball" || ballOk));
        for (const k of left.sort(() => Math.random() - 0.5)) if (starts[k](t)) break;
        if (!game) {
          if (!hide && !rps) nextGameAt = t + 2000;
          return;
        }
      }
      const g = game;
      // Anything else going on, and it's over
      if (!ballFree() || ![g.L, g.R].every((c) => canPlay(c, t)) || jpChase !== null || (pointerSeen && Math.hypot(mx - g.mx0, my - g.my0) > PLAY_QUIT_DIST)) {
        endGame(t, false);
        return;
      }
      g.L.lastActive = g.R.lastActive = t; // too busy playing to nod off
      goDown(g.L, g.spots[0], t);
      goDown(g.R, g.spots[1], t);
      const since = (t - g.at) / 1000;
      if (g.phase === "gather") {
        const there = (c: CharacterState, x: number) => grounded(c) && c.v === 0 && Math.abs(c.x - x) <= c.def.walk.startDist + 2;
        if (since > 0.4 && there(g.L, g.spots[0]) && there(g.R, g.spots[1])) {
          g.phase = "serve";
          g.at = t;
          wobble(SERVE_WOBBLE_MS);
        } else if (since > 12) endGame(t, false); // couldn't get there
      } else if (g.phase === "serve") {
        // Wobbles in its corner, then hops out over the nearer one to land at its feet
        if (since * 1000 >= SERVE_WOBBLE_MS) {
          const to = footOf(g.R);
          shoot(t, { from: ballAtX, to, dur: clamp(0.55 + Math.abs(to - ballAtX) / 900, 0.6, 1.3), peak: clearing(g.R, 50), apex: g.R.x, goal: false, receiver: g.R });
        }
      } else if (g.phase === "fly" && g.shot) {
        const s = g.shot;
        const k = Math.min(1, since / s.dur);
        let x: number;
        if (s.peak) {
          x = s.from + (s.to - s.from) * k;
          ballLift = arcAt(s, x);
        } else {
          // Rolled along the ground, slowing to a stop right at their feet
          x = s.from + (s.to - s.from) * (1 - (1 - k) * (1 - k));
          ballLift = 0;
        }
        turnBall(x - ballAtX, s.peak ? 1.6 : 1);
        setBall(x, ballAtSize);
        if (k >= 1) {
          ballLift = 0;
          setBall(s.to, ballAtSize);
          if (s.peak) spawn(SHAPES.dust(rand(9, 12)), { x: s.to, y: window.innerHeight - ground }, 0, -8, { dur: 450 });
          if (s.goal) {
            // In! It settles back in its corner, and the scorer celebrates
            const settle = uprightBall();
            if (settle) settle.onfinish = () => wobble(500);
            else wobble(500);
            for (const dx of [-1, 0, 1]) spawn(SHAPES.star(rand(9, 12)), { x: ballAtX, y: window.innerHeight - ground - ballAtSize }, dx * 18, -22 + Math.abs(dx) * 6, { dur: 900 });
            plays.get(g.L)!.cheer = t;
            say(g.L, g.L === tg ? "Goal! Toge-priii! ✨" : "Goal! Jiggly~! 🎵", 1800);
            g.phase = "cheer";
          } else {
            plays.get(s.receiver!)!.trap = t;
            g.holder = s.receiver;
            g.phase = "hold";
          }
          g.at = t;
        }
      } else if (g.phase === "hold" && g.holder) {
        const c = g.holder;
        const m = plays.get(c)!;
        if (m.kick < g.at) m.kick = g.at + HOLD_MS + KICK_WIND_MS; // a beat, a wind-up, then the kick
        if (t >= m.kick) {
          const from = ballAtX;
          spawn(SHAPES.dust(rand(8, 11)), { x: from, y: window.innerHeight - ground }, -Math.sign(other(c).x - c.x) * 10, -8, { dur: 400 });
          if (c === g.L && g.passes <= 0) {
            // Last one: chipped over the other's head, back into the corner
            const to = dockX();
            // (high enough to clear it even at the top of its jump)
            shoot(t, { from, to, dur: clamp(0.8 + Math.abs(to - from) / 800, 0.95, 1.6), peak: clearing(g.R, 34 + headerHop(g.R)), apex: g.R.x, goal: true, receiver: null });
          } else {
            const to = footOf(other(c));
            const d = Math.abs(to - from);
            const chip = g.kicks > 0 && Math.random() < 0.3; // now and then it's chipped instead of rolled
            g.passes--;
            g.kicks++;
            shoot(t, chip
              ? { from, to, dur: 0.6 + d / 900, peak: Math.min(maxBallLift(), rand(38, 60)), apex: (from + to) / 2, goal: false, receiver: other(c) }
              : { from, to, dur: clamp(0.6 + d / 500, 0.8, 1.4), peak: 0, apex: 0, goal: false, receiver: other(c) });
          }
        }
      } else if (g.phase === "cheer" && since * 1000 >= CHEER_MS) {
        endGame(t, true);
      }
    };
    /** Where its eyes go while it's playing: the middle of someone, or where it's walking to (or, standing
        still, at the other one) */
    const eyesOn = (c: CharacterState) => point(c, c.def.center.x, c.def.center.y);
    const lookAhead = (c: CharacterState) =>
      Math.abs(c.tx - c.x) > 8 ? { x: c.x + Math.sign(c.tx - c.x) * 220, y: groundY() - c.H * 0.5 } : eyesOn(other(c));
    /** Facing while playing: toward the other one (0 when not playing) */
    const playFacing = (c: CharacterState) => (game && (c === game.L || c === game.R) ? Math.sign(other(c).x - c.x) : 0);
    /** The kickabout's poses, on top of the usual ones: eyes on the ball, kicks, traps, a jump and a cheer.
        The front foot is always footL: the artwork faces left, and it's mirrored when it faces right */
    const playPose = (c: CharacterState, p: Pose, t: number) => {
      if (!game || (c !== game.L && c !== game.R)) return;
      const m = plays.get(c)!;
      const dir = Math.sign(other(c).x - c.x) || 1;
      // Where they're going while they spread out, then the ball. After the goal, the scorer turns to the
      // other one, who watches the ball land first
      const ball = { x: ballAtX, y: ballMid() };
      if (game.phase === "gather") p.look = lookAhead(c);
      else if (game.phase === "cheer") p.look = c === game.L || t - plays.get(game.L)!.cheer > 400 ? eyesOn(other(c)) : ball;
      else p.look = ball;
      const kick = t - m.kick;
      if (kick > -KICK_WIND_MS && kick < KICK_FOLLOW_MS) {
        let tilt: number, lift: number, lean: number, env: number;
        if (kick < 0) {
          // Draws the foot back
          env = smooth((kick + KICK_WIND_MS) / KICK_WIND_MS);
          tilt = -16 * env;
          lift = 10 * env;
          lean = -4 * env;
        } else {
          // …and swings it through, toe up
          env = 1 - smooth(kick / KICK_FOLLOW_MS);
          const strike = Math.min(1, kick / 70);
          tilt = (-16 + 46 * strike) * env;
          lift = (10 + 4 * strike) * env;
          lean = (-4 + 10 * strike) * env;
        }
        p.tiltL += tilt;
        p.liftL = Math.max(p.liftL, lift);
        p.rot += lean * dir;
        p.raiseL += 18 * env;
        p.raiseR += 26 * env;
      }
      const trap = t - m.trap;
      if (trap >= 0 && trap < TRAP_MS) {
        const e = Math.sin((Math.PI * trap) / TRAP_MS);
        p.liftL = Math.max(p.liftL, 8 * e);
        p.tiltL += 12 * e;
        p.sy *= 1 - 0.03 * e;
      }
      const jump = t - m.jump;
      if (jump >= 0 && jump < HEADER_MS) {
        const k = jump / HEADER_MS;
        p.hop += Math.sin(Math.PI * k) * headerHop(c);
        p.raiseL = p.raiseR = 70;
        p.tiltL = p.tiltR = 14;
        p.eye = "open";
      }
      const cheer = t - m.cheer;
      if (cheer >= 0 && cheer < CHEER_MS) {
        const s = cheer / 1000;
        const h = Math.abs(Math.sin(s * Math.PI * 3.2));
        p.hop += h * 12;
        p.rot += Math.sin(s * 9) * 5;
        p.raiseL = 75 + Math.sin(s * 14) * 18;
        p.raiseR = 75 + Math.sin(s * 14 + Math.PI) * 18;
        p.ears += Math.sin(s * 12) * 6;
        p.eye = "happy";
        p.blush = Math.max(p.blush, 0.8);
      }
    };

    /* ── Hide and seek: left alone for a bit (instead of a kickabout, now and then), one hides behind
       something solid at the bottom of the screen (a card or a picture, with only its ears showing over
       the top) or round the edge of the screen (behind the sidebar on desktop) while the other counts,
       then comes looking: a wrong guess or two, then "Found you!". Anything the visitor does ends it;
       the hider pops back out (hovering it while it's hiding counts as finding it) ── */
    /** Where it hides: behind `el` at x (its top edge `top`, from `left` to `right`), or, with no `el`,
        round the edge of the screen at `line` (`side` -1 left, 1 right), standing at x */
    type Hideout = { el: Element | null; x: number; top: number; left: number; right: number; line: number; side: number };
    let hide: {
      phase: "count" | "seek" | "found" | "out";
      at: number;
      hider: CharacterState;
      seeker: CharacterState;
      spot: Hideout;
      /** The hider getting there, getting in behind, hidden, coming back out, and done */
      hiding: "go" | "in" | "hidden" | "out" | "done";
      hidAt: number;
      /** Its extra height and sideways shift now (px), so every move eases on from where it is */
      hop: number;
      off: number;
      /** Where those were when it started coming out */
      hop0: number;
      off0: number;
      /** Cropped where it's behind something */
      clip: boolean;
      counted: number;
      giggled: boolean;
      /** Didn't get hidden in time, and was found standing about */
      caught: boolean;
      /** Wrong guesses to check first, which one it's on, and when it got there to look round */
      decoys: number[];
      di: number;
      lookAt: number;
      /** Where the seeker ends up, next to the hiding place */
      reveal: number;
      mx0: number;
      my0: number;
      scroll0: number;
      /** What it last told Togepi to walk to, so it's not overridden afterwards if something else has since */
      tgTx: number;
    } | null = null;
    const groundY = () => window.innerHeight - ground;
    /** Where the top of its hiding place is now: the page may have scrolled since (it carries it along) */
    const coverTop = (h: NonNullable<typeof hide>) => h.spot.top - (window.scrollY - h.scroll0);
    /** How far down (artwork px from the top) its eyes go: peeking, it shows that much */
    const eyeLine = (c: CharacterState) => (Math.max(...c.def.eyes.map((e) => e.y + e.lid.ry * 0.5)) / c.def.h) * c.H;
    /** Everywhere on the screen it could hide right now */
    const hideouts = (c: CharacterState): Hideout[] => {
      const [a, b] = floorBounds(c);
      const gy = groundY();
      // Things it could crouch down behind, tall enough to hide most of it but not so tall it can't peek over
      const found = new Map<Element, Surface>();
      for (let x = a; x <= b; x += 16) {
        const hit = perches.coverAt(x, gy, gy - c.H * 0.72, gy - c.H * 0.3);
        if (hit && !found.has(hit.el)) found.set(hit.el, hit.surface);
      }
      const boxes: Hideout[] = [];
      found.forEach((s, el) => {
        const lo = Math.max(a, s.left + c.W * 0.5), hi = Math.min(b, s.right - c.W * 0.5);
        if (hi < lo) return; // too narrow to hide behind
        const x = (lo + hi) / 2;
        if (perches.coverAt(x, gy, -Infinity, Infinity)?.el !== el) return;
        boxes.push({ el, x, top: topAt(s, x), left: s.left, right: s.right, line: 0, side: 0 });
      });
      // …or round the edge of the screen (the corner with the Poké Ball in it is taken)
      const edges: Hideout[] = [{ el: null, x: a, top: 0, left: 0, right: 0, line: sidebar(), side: -1 }];
      if (!dockReserved) edges.push({ el: null, x: b, top: 0, left: 0, right: 0, line: document.documentElement.clientWidth, side: 1 });
      return [...boxes, ...edges];
    };
    /** Anywhere on the screen it could hide, picked at random (not right where it is, or under the seeker's nose) */
    const pickHideout = (c: CharacterState, from: CharacterState): Hideout | null => {
      const ok = hideouts(c).filter((h) => Math.abs(h.x - c.x) >= 100 && Math.abs(h.x - from.x) >= 140);
      return ok.length ? ok[Math.floor(Math.random() * ok.length)] : null;
    };
    const startHide = (t: number) => {
      // Either can hide, but if one has nowhere to (the corner on its side is taken, say), the other does
      let hider = Math.random() < 0.5 ? tg : jp;
      let spot = pickHideout(hider, other(hider));
      if (!spot) {
        hider = other(hider);
        spot = pickHideout(hider, other(hider));
      }
      if (!spot) return false;
      const seeker = other(hider);
      const [sa, sb] = floorBounds(seeker);
      // A wrong guess or two first, well away from the hiding place (and on its own side of it)
      const decoys: number[] = [];
      const mySide = Math.sign(seeker.x - spot.x) || 1;
      for (let i = 0, want = Math.random() < 0.5 ? 1 : 2; i < 20 && decoys.length < want; i++) {
        const x = clamp(seeker.x + rand(-250, 250), sa, sb); // not off miles away
        if (Math.sign(x - spot.x) === mySide && Math.abs(x - spot.x) > 160 && Math.abs(x - (decoys[decoys.length - 1] ?? seeker.x)) > 90) decoys.push(x);
      }
      // It ends up right beside where the hider comes back out (not so close they bump into each other)
      const toSeeker = spot.el ? Math.sign(seeker.x - spot.x) || 1 : -spot.side;
      const reveal = clamp(spot.x + toSeeker * (minGap() + 12), sa, sb);
      hide = {
        phase: "count", at: t, hider, seeker, spot, hiding: "go", hidAt: t, hop: 0, off: 0, hop0: 0, off0: 0, clip: false, counted: 0, giggled: false, caught: false,
        decoys, di: 0, lookAt: 0, reveal, mx0: mx, my0: my, scroll0: window.scrollY, tgTx: NaN,
      };
      say(hider, hider === tg ? "Hide and seek! You count! 🙈" : "Hide and seek! Puff, you're it! 🙈", 1300);
      return true;
    };
    const setClip = (on: boolean) => {
      if (!hide || hide.clip === on) return;
      hide.clip = on;
      if (!on) rigOf(hide.hider).root.style.clipPath = "";
    };
    /** Over: back to normal. Togepi stays put rather than heading on to wherever the game had it going,
        unless something's sent it elsewhere since */
    const finishHide = (t: number, done: boolean) => {
      const h = hide;
      if (!h) return;
      rigOf(h.hider).root.style.clipPath = "";
      hide = null;
      gameOver(t, "hide", done);
      h.hider.lastActive = h.seeker.lastActive = t;
      if (tg.tx === h.tgTx) standStill(tg);
      if (jp.crouchAt) standStill(jp);
    };
    /** Over at once (picked up, called back, the window resized), with no coming back out */
    const clearHide = () => finishHide(performance.now(), false);
    /** Cut short: the hider comes back out (pleased with itself, if it was the visitor who found it) */
    const abortHide = (t: number, foundByVisitor = false) => {
      const h = hide;
      if (!h || h.phase === "out") return;
      h.phase = "out";
      h.at = t;
      if (h.hiding === "go") return finishHide(t, false);
      h.tgTx = NaN; // (whatever Togepi's sent to from now on, it goes)
      if (h.hiding === "in" || h.hiding === "hidden") {
        h.hiding = "out";
        h.hidAt = t;
        h.hop0 = h.hop;
        h.off0 = h.off;
      }
      if (foundByVisitor) say(h.hider, h.hider === tg ? "Toge-hehe! You found me! ✨" : "Puff! You found me! 😆", 1500);
    };

    const hideTick = (t: number) => {
      const h = hide;
      if (!h) return;
      const { hider, seeker, spot } = h;
      // Picked up or called back: no time for anything else
      if (hider.held || seeker.held || rigOf(hider).recallAt !== Infinity || rigOf(seeker).recallAt !== Infinity) {
        clearHide();
        return;
      }
      if (h.phase !== "out") {
        const visitor = hider.hovered && (h.hiding === "in" || h.hiding === "hidden");
        const moved = pointerSeen && Math.hypot(mx - h.mx0, my - h.my0) > PLAY_QUIT_DIST;
        const scrolled = !!spot.el && Math.abs(window.scrollY - h.scroll0) > 2; // its hiding place has moved away
        if (visitor || moved || scrolled || jpChase !== null || game || rps || ![hider, seeker].every((c) => canPlay(c, t))) {
          // Found already: it's just over (rather than talking and cheering over whatever's happening now)
          if (h.phase === "found" && !visitor) return finishHide(t, false);
          abortHide(t, visitor);
        }
      }
      if (!hide) return;
      if (h.phase !== "out") hider.lastActive = seeker.lastActive = t; // too busy to nod off
      const since = (t - h.at) / 1000;

      /* The hider */
      const there = (c: CharacterState, x: number) => grounded(c) && c.v === 0 && Math.abs(c.x - x) <= Math.max(4, c.def.walk.startDist + 2);
      if (h.hiding === "go") {
        // The seeker's in the way: it takes a running jump clean over its head (and down, if they're up on something)
        const dir = Math.sign(spot.x - hider.x);
        const gap = (seeker.x - hider.x) * dir;
        if (sameLevel(hider, seeker) && !aloft(hider) && !aloft(seeker) && !hider.crouchAt && gap > 0 && gap < minGap() + 40 && (spot.x - seeker.x) * dir > 0) {
          const land = clamp(seeker.x + dir * (minGap() + 16), ...floorBounds(hider));
          jumpTo(rigOf(hider), dir > 0 ? Math.min(land, spot.x) : Math.max(land, spot.x), 0, null, seeker.lift + seeker.H + 30);
        }
        goDown(hider, spot.x, t);
        if (grounded(hider) && hider.v === 0 && Math.abs(hider.x - spot.x) <= hider.def.walk.startDist + 2) {
          hider.x = spot.x; // (at most a step: it walks right up to it unless it was already that close)
          h.hiding = "in";
          h.hidAt = t;
        }
      } else if (h.phase !== "out") hider.tx = hider.x;
      const inK = (t - h.hidAt) / HIDE_HOP_MS;
      if (h.hiding === "in") {
        if (spot.el && inK >= 0.5) setClip(true); // over the top of it and down behind
        if (inK >= 1) h.hiding = "hidden";
      } else if (h.hiding === "out") {
        if (inK >= 0.5) setClip(false); // up over the top, and down in front
        if (inK >= 1) h.hiding = "done";
      }

      /* The seeker, and how it's going */
      if (h.phase !== "out") seeker.tx = seeker.x;
      // Standing right where the hider wants to hide: it steps out of the way to count (to whichever side
      // there's room, even if that means the hider has to jump over it)
      if (h.phase === "count" && h.hiding === "go" && grounded(seeker) && Math.abs(seeker.x - spot.x) < minGap() + 6) {
        const [sa, sb] = floorBounds(seeker);
        const clear = minGap() + 12;
        let side = Math.sign(seeker.x - spot.x) || -Math.sign(hider.x - spot.x) || 1;
        if (spot.x + side * clear < sa || spot.x + side * clear > sb) side = -side;
        seeker.tx = clamp(spot.x + side * clear, sa, sb);
      }
      if (h.phase === "count") {
        // Counts (after the hider's said what's going on) to three at least, and on until it's hidden
        const n = since >= COUNT_FROM ? Math.floor((since - COUNT_FROM) / COUNT_STEP) + 1 : 0;
        if (n > h.counted) {
          if (h.counted >= 3 && h.hiding === "hidden") {
            h.phase = "seek";
            h.at = t;
            say(seeker, "Ready or not, here I come! 👀", 1600);
          } else if (n > COUNT_MAX && h.hiding === "go") {
            // It still hasn't got there: ready or not, here it comes, and it's caught out in the open
            h.phase = "seek";
            h.at = t;
            h.caught = true;
            h.hiding = "done";
            h.decoys = [];
            h.reveal = clamp(hider.x + (Math.sign(seeker.x - hider.x) || 1) * (minGap() + 12), ...floorBounds(seeker));
            say(seeker, "Ready or not, here I come! 👀", 1600);
          } else if (n <= COUNT_MAX) {
            h.counted = n;
            say(seeker, `${n}… 🙈`, 900);
          }
        }
      } else if (h.phase === "seek") {
        if (h.di < h.decoys.length) {
          // Checks somewhere else first: gets there, looks round, wonders
          const x = h.decoys[h.di];
          if (!h.lookAt) {
            goDown(seeker, x, t);
            if (there(seeker, x)) {
              h.lookAt = t;
              if (h.di === h.decoys.length - 1) say(seeker, seeker === tg ? "Toge…? 🤔" : "Hmm… 🤔", 1100);
            }
          } else if (t - h.lookAt > LOOK_MS) {
            h.di++;
            h.lookAt = 0;
          }
        } else {
          // (caught out in the open, it may still be coming to a stop: it goes to wherever it ends up)
          if (h.caught) h.reveal = clamp(hider.x + (Math.sign(seeker.x - hider.x) || 1) * (minGap() + 12), ...floorBounds(seeker));
          goDown(seeker, h.reveal, t);
          if (there(seeker, h.reveal)) {
            h.phase = "found";
            h.at = t;
            spawn(SHAPES.exclaim(26), point(seeker, seeker.def.w * 0.75, 0), 10, -30, { dur: 900, scale: 1.1, rot: 10 });
            say(seeker, "Found you! 👉", 1300);
          }
        }
      } else if (h.phase === "found") {
        if (since >= REVEAL_POP && h.hiding === "hidden") {
          h.hiding = "out";
          h.hidAt = t;
          h.hop0 = h.hop;
          h.off0 = h.off;
        }
        if (since >= REVEAL_GIGGLE && !h.giggled) {
          h.giggled = true;
          say(hider, h.caught ? "Eep! I wasn't ready! 😅" : hider === tg ? "Toge-hehe! You found me! ✨" : "Aww, you found me! 😆", 1500);
        }
        if (since >= REVEAL_END) finishHide(t, true);
      } else if (h.phase === "out" && (h.hiding === "done" || h.hiding === "go")) finishHide(t, false);
      if (hide && h.phase !== "out") h.tgTx = tg.tx;
    };
    /** Facing while playing hide and seek (0: however it would anyway) */
    const hideFacing = (c: CharacterState) => {
      const h = hide;
      if (!h) return 0;
      const toOther = Math.sign(other(c).x + other(c).offset - c.x - c.offset);
      if (c === h.seeker) {
        if (h.phase === "count") return -toOther; // back turned, no peeking
        if (h.phase === "seek" && h.lookAt) return Math.sin(((now - h.lookAt) / 1000) * Math.PI * 2.4) < 0 ? -1 : 1; // looking round
        return h.phase === "found" ? toOther : 0;
      }
      if (h.hiding === "go") return 0;
      return h.spot.el || h.caught ? toOther : -h.spot.side; // peeking out at the seeker / back into the screen
    };
    /** Hide and seek's poses, on top of the usual ones */
    const hidePose = (c: CharacterState, p: Pose, t: number, dt: number) => {
      const h = hide;
      if (!h) return;
      const busy = !!c.action; // doing a move: only where it is comes from here, the rest is the move's
      const { spot } = h;
      const ease = Math.min(1, dt * 9);
      const since = (t - h.at) / 1000;
      if (c === h.hider) {
        // Where it's running to, then the seeker (cut short, it's back to whatever it'd look at anyway)
        if (!busy && h.phase !== "out") p.look = h.hiding === "go" ? lookAhead(c) : eyesOn(h.seeker);
        const k = clamp((t - h.hidAt) / HIDE_HOP_MS, 0, 1);
        // Peeks out now and then while the seeker's looking, except when it's getting close
        const near = Math.abs(h.seeker.x - c.x) < 150;
        const peek = h.phase === "seek" && !near && ((t - h.hidAt) / 1000) % 2.6 < 0.9;
        if (spot.el) {
          // Behind something: crouched right down out of sight, or up just enough for its eyes to show over
          const showing = c.H - (groundY() - coverTop(h)); // how much shows over the top standing up
          const duck = -showing - 6;
          const peekHop = eyeLine(c) - showing;
          const over = groundY() - coverTop(h) + 6; // high enough for its feet to clear the top
          if (h.hiding === "in") h.hop = k < 0.5 ? over * Math.sin(k * Math.PI) : duck + (over - duck) * Math.cos((k - 0.5) * Math.PI);
          else if (h.hiding === "hidden") h.hop += ((peek ? peekHop : duck) - h.hop) * ease;
          else if (h.hiding === "out") h.hop = k < 0.5 ? h.hop0 + (over - h.hop0) * Math.sin(k * Math.PI) : over * Math.cos((k - 0.5) * Math.PI);
          else h.hop = 0;
          p.hop += h.hop;
        } else {
          // Round the edge of the screen: all the way out of sight, or leaning back in to peek
          // (all the way off the screen: the sidebar's see-through)
          const hidden = (spot.side < 0 ? -(c.W / 2 + 4) : document.documentElement.clientWidth + c.W / 2 + 4) - c.x;
          const peekOff = spot.line + spot.side * (c.W / 2 - c.W * 0.38) - c.x;
          if (h.hiding === "in") h.off = hidden * smooth(k);
          else if (h.hiding === "hidden") h.off += ((peek ? peekOff : hidden) - h.off) * ease;
          else if (h.hiding === "out") h.off = h.off0 * (1 - smooth(k));
          else h.off = 0;
          p.offset += h.off;
          if (h.hiding === "in" || h.hiding === "out") p.hop += Math.sin(k * Math.PI) * 10;
        }
        if (busy) return;
        if (h.hiding === "hidden" || h.hiding === "in") {
          p.raiseL += 20;
          p.raiseR += 20;
        }
        if (h.phase === "found" && since >= REVEAL_GIGGLE) cheer(p, since - REVEAL_GIGGLE);
      } else if (c === h.seeker && !busy) {
        if (h.phase === "count") {
          // Hands over its eyes, swaying as it counts
          p.eye = "closed";
          p.raiseL = p.raiseR = 85;
          p.rot += Math.sin(since * Math.PI * 2) * 4;
        } else if (h.phase === "seek") {
          if (h.lookAt) {
            // Looking round: scans whichever way it's turned
            p.look = { x: c.x + c.facing * 200, y: groundY() - 40 };
            p.raiseL += 15;
            p.raiseR += 15;
          } else if (h.di < h.decoys.length || h.caught) p.look = h.caught ? eyesOn(h.hider) : lookAhead(c);
          // Last of all, straight for the hiding place: it's got a feeling
          else p.look = spot.el ? { x: spot.x, y: coverTop(h) - 10 } : { x: spot.line, y: groundY() - 40 };
        } else if (h.phase === "found") {
          p.look = eyesOn(h.hider);
          if (since < REVEAL_GIGGLE) {
            // Points it out
            const dir = Math.sign(h.hider.x + h.hider.offset - c.x) || 1;
            p.rot += 6 * dir * Math.min(1, since / 0.15);
            p.raiseL = p.raiseR = 60;
            p.eye = "open";
          } else cheer(p, since - REVEAL_GIGGLE);
        }
      }
    };
    /** Happy little hops, arms waving */
    const cheer = (p: Pose, s: number) => {
      p.hop += Math.abs(Math.sin(s * Math.PI * 3)) * 10;
      p.raiseL = 70 + Math.sin(s * 14) * 16;
      p.raiseR = 70 - Math.sin(s * 14) * 16;
      p.eye = "happy";
      p.blush = Math.max(p.blush, 0.8);
    };
    /** Behind something: crop away whatever's behind it (in the hider's own box, as it's drawn this frame) */
    const hideClip = () => {
      const h = hide;
      if (!h || !h.clip || !h.spot.el) return;
      const root = rigOf(h.hider).root;
      const box = root.getBoundingClientRect();
      const x0 = h.spot.left - box.left, x1 = h.spot.right - box.left, y0 = coverTop(h) - box.top, y1 = groundY() + 400 - box.top;
      const px = (v: number) => `${v.toFixed(1)}px`;
      root.style.clipPath = `polygon(evenodd, -4000px -4000px, 4000px -4000px, 4000px 4000px, -4000px 4000px, -4000px -4000px, ${px(x0)} ${px(y0)}, ${px(x1)} ${px(y0)}, ${px(x1)} ${px(y1)}, ${px(x0)} ${px(y1)}, ${px(x0)} ${px(y0)})`;
    };

    /* ── Rock, paper, scissors: they come face to face, chant, and throw out their hands (shown in little
       cards between them). The winner of each go cheers and the loser sulks; a tie, and they go again.
       First to three wins. Anything the visitor does ends it ── */
    let rps: {
      phase: "gather" | "chant" | "show" | "result" | "final";
      at: number;
      L: CharacterState;
      R: CharacterState;
      spots: [number, number];
      /** Who calls out the chant this go (they take turns) */
      caller: CharacterState;
      beat: number;
      round: number;
      hands: Map<CharacterState, number>;
      score: Map<CharacterState, number>;
      /** Who won this go (or the whole thing, at the end): null for a tie, or a draw */
      winner: CharacterState | null;
      sulked: boolean;
      /** The cards with their hands on, while they're up */
      cards: Animation[];
      mx0: number;
      my0: number;
    } | null = null;
    /** Face to face, close enough for their hands to meet in the middle, around where they are now */
    const startRps = (t: number) => {
      const [L, R] = tg.x < jp.x ? [tg, jp] : [jp, tg];
      const [lMin] = floorBounds(L), [, rMax] = floorBounds(R);
      const gap = (L.W + R.W) / 2 + 110;
      if (rMax - lMin < gap) return false;
      const mid = clamp((L.x + R.x) / 2, lMin + gap / 2, rMax - gap / 2);
      const caller = Math.random() < 0.5 ? tg : jp;
      rps = {
        phase: "gather", at: t, L, R, spots: [mid - gap / 2, mid + gap / 2], caller, beat: -1, round: 1,
        hands: new Map(), score: new Map([[tg, 0], [jp, 0]]), winner: null, sulked: false, cards: [], mx0: mx, my0: my,
      };
      say(caller, caller === tg ? "Rock, paper, scissors? ✊✋✌️" : "Puff! Rock, paper, scissors? ✊✋✌️", 1600);
      return true;
    };
    /** Over: back to normal, Togepi staying where it is (unless something's sent it elsewhere since) */
    const endRps = (t: number, done: boolean) => {
      const g = rps;
      if (!g) return;
      rps = null;
      g.cards.forEach((a) => a.finish()); // (cut short: put away at once)
      gameOver(t, "rps", done);
      g.L.lastActive = g.R.lastActive = t;
      if (tg.tx === tgSent) standStill(tg);
      if (jp.crouchAt) standStill(jp);
    };
    /** Where its card goes: just in front of it, at about the height of its hands */
    const handAt = (c: CharacterState) => ({ x: c.x + (Math.sign(other(c).x - c.x) || 1) * (c.W * 0.5 + 24), y: groundY() - c.H * 0.55 });
    const rpsTick = (t: number) => {
      const g = rps;
      if (!g) return;
      // Anything else going on, and it's over
      if (game || hide || jpChase !== null || ![g.L, g.R].every((c) => canPlay(c, t)) || (pointerSeen && Math.hypot(mx - g.mx0, my - g.my0) > PLAY_QUIT_DIST)) {
        endRps(t, false);
        return;
      }
      g.L.lastActive = g.R.lastActive = t; // too busy playing to nod off
      goDown(g.L, g.spots[0], t);
      goDown(g.R, g.spots[1], t);
      const since = t - g.at;
      const next = (phase: NonNullable<typeof rps>["phase"]) => {
        g.phase = phase;
        g.at = t;
      };
      if (g.phase === "gather") {
        const there = (c: CharacterState, x: number) => grounded(c) && c.v === 0 && Math.abs(c.x - x) <= c.def.walk.startDist + 2;
        if (since > 400 && !rigOf(g.caller).bubbleUntil && there(g.L, g.spots[0]) && there(g.R, g.spots[1])) next("chant");
        else if (since > 12000) endRps(t, false); // couldn't get there
      } else if (g.phase === "chant") {
        const beat = Math.floor(since / RPS_BEAT_MS);
        if (beat > g.beat && beat < CHANT.length) {
          g.beat = beat;
          say(g.caller, CHANT[beat], RPS_BEAT_MS - 30);
        }
        if (beat >= CHANT.length) {
          // …and out come their hands
          g.cards = [];
          for (const c of [tg, jp]) {
            const hand = Math.floor(Math.random() * HANDS.length);
            g.hands.set(c, hand);
            g.cards.push(spawn(SHAPES.hand(HANDS[hand]), handAt(c), 0, -8, { dur: RPS_SHOW_MS + RPS_RESULT_MS * 0.8, hold: true }));
          }
          next("show");
        }
      } else if (g.phase === "show" && since >= RPS_SHOW_MS) {
        const a = g.hands.get(g.L)!, b = g.hands.get(g.R)!;
        // Each beats the one before it: paper wraps rock, scissors cut paper, rock blunts scissors
        g.winner = a === b ? null : (a - b + 3) % 3 === 1 ? g.L : g.R;
        if (g.winner) {
          const w = g.winner, l = other(w);
          g.score.set(w, g.score.get(w)! + 1);
          say(w, `${HANDS[g.hands.get(w)!]} beats ${HANDS[g.hands.get(l)!]}! ${w === tg ? "Toge! ✨" : "Puff! 🎵"}`, RPS_RESULT_MS - 100);
        } else say(g.caller, JINX[Math.floor(Math.random() * JINX.length)], RPS_RESULT_MS - 100);
        next("result");
      } else if (g.phase === "result" && since >= RPS_RESULT_MS) {
        const ts = g.score.get(tg)!, js = g.score.get(jp)!;
        if (Math.max(ts, js) >= RPS_TO_WIN || g.round >= RPS_MAX_ROUNDS) {
          // All over: the winner crows about it (or, all square, they call it a draw)
          g.winner = ts === js ? null : ts > js ? tg : jp;
          g.sulked = false;
          if (g.winner) say(g.winner, `I win, ${Math.max(ts, js)}–${Math.min(ts, js)}! 🏆`, 1300);
          else say(g.caller, "Call it a draw! 🤝", 1600);
          if (g.winner) for (const dx of [-1, 0, 1]) spawn(SHAPES.star(rand(10, 13)), point(g.winner, g.winner.def.w / 2, 0), dx * 22, -26 + Math.abs(dx) * 6, { dur: 900 });
          next("final");
        } else {
          g.round++;
          g.beat = -1;
          g.caller = other(g.caller);
          g.winner = null;
          next("chant");
        }
      } else if (g.phase === "final") {
        if (g.winner && !g.sulked && since >= 1400) {
          g.sulked = true;
          const l = other(g.winner);
          say(l, l === tg ? "Toge… 😣" : "Hmph! Rematch later! 😤", 1200);
        }
        if (since >= RPS_FINAL_MS) endRps(t, true);
      }
    };
    /** Rock, paper, scissors' poses, on top of the usual ones */
    const rpsPose = (c: CharacterState, p: Pose, t: number) => {
      const g = rps;
      if (!g || c.action) return;
      const dir = Math.sign(other(c).x - c.x) || 1;
      const since = t - g.at;
      if (g.phase === "gather") {
        p.look = lookAhead(c);
        return;
      }
      p.look = eyesOn(other(c));
      if (g.phase === "chant") {
        // Fist up, and down on each word, bobbing along
        const f = (since % RPS_BEAT_MS) / RPS_BEAT_MS;
        const up = (1 + Math.cos(f * Math.PI * 2)) / 2;
        p.raiseL = 15 + 55 * up;
        p.hop += 5 * (1 - up);
        p.rot += 3 * dir;
      } else if (g.phase === "show") {
        // Hand thrust out, leaning in to see what the other one's got
        p.raiseL = 42;
        p.rot += 5 * dir * Math.min(1, since / 120);
        p.look = handAt(other(c));
        p.eye = "open";
      } else if (g.winner === c) cheer(p, since / 1000);
      else if (g.winner) {
        // Lost: slumps, sulking
        p.eye = "closed";
        p.mouth = "pout";
        p.sy *= 0.95;
        p.raiseL = p.raiseR = -10;
        p.rot -= 4 * dir;
        p.ears -= 6;
      } else if (g.phase === "final") cheer(p, since / 1000);
      else {
        // A tie: both taken aback
        p.raiseL = p.raiseR = 55;
        p.hop += Math.sin(Math.min(1, since / 300) * Math.PI) * 8;
        p.eye = "open";
      }
    };

    window.addEventListener("pointermove", onBallDragMove, { passive: true });
    window.addEventListener("pointerup", onBallDragEnd);
    window.addEventListener("pointercancel", onBallDragEnd);
    ball.addEventListener("pointerdown", onBallDown);

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
    const onBallClick = () => {
      if (performance.now() < noBallClickUntil) return; // the end of a throw, not a click
      if (ballState === "waiting") release();
      else recall();
    };
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
      r.surface = r.jump = r.flight = null;
      Object.assign(c, {
        action: null, held: false, lift: 0, lv: 0, vx: 0, v: 0, offset: 0, amp: 0, happy: 0, sleep: 0, hovered: false,
        forcedSleepUntil: 0, doodleStart: 0, doodleWoke: 0, leapStart: 0, lastActive: performance.now(),
        perch: null, stand: 0, jumping: false, edgeAt: 0, crouchAt: 0, pv: 0,
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

    /* ── Up on the page ── */
    /** The page's scroll position this frame and last, so a fall can tell what it passed on the way down
        (the page moves under them as it scrolls) */
    let scrollNow = window.scrollY;
    let scrollPrev = scrollNow;
    /** Puffs of dust from under its feet, wherever they are (on something, or about to be) */
    const dustUp = (c: CharacterState, feetLift: number) => {
      if (reduce) return;
      const rise = feetLift - c.stand;
      c.def.soles.forEach((sole, i) => {
        const at = point(c, sole.x, sole.y);
        spawn(SHAPES.dust(rand(12, 16)), { x: at.x, y: at.y - rise }, i ? 16 : -16, -10, { dur: 550 });
      });
    };
    /** Takes off on an arc that comes down at x, `lift` px above the ground (beside `to`, if it's joining them),
        topping out at least `over` px up */
    const jumpTo = (r: Rig, x: number, lift: number, to: CharacterState | null, over = 0) => {
      const { c } = r;
      const from = c.lift;
      r.flight = { from: c.perch?.el ?? null, to };
      const apex = clamp(Math.max(from, lift, over) + JUMP_CLEAR * (over ? 0 : 1) + Math.abs(x - c.x) * 0.12, Math.max(from, lift), Math.max(from, maxLift(c)));
      // (a few px extra: stepping the arc frame by frame tops out a little short of the exact peak)
      const up = Math.sqrt(2 * GRAVITY * (apex - from + 6));
      const secs = up / GRAVITY + Math.sqrt((2 * (apex - lift)) / GRAVITY);
      dustUp(c, from);
      c.perch = null;
      r.surface = null;
      c.stand = 0;
      c.lv = up;
      c.vx = secs > 0 ? (x - c.x) / secs : 0;
      c.v = 0;
      c.jumping = true;
      c.edgeAt = c.crouchAt = 0;
      r.jump = null;
    };
    /** Stops standing on what it was on and drops from where it is */
    const fallOff = (r: Rig, lv: number, vx: number) => {
      const { c } = r;
      c.perch = null;
      r.surface = null;
      c.stand = 0;
      c.lv = lv;
      c.vx = vx;
      c.jumping = false;
      c.edgeAt = c.crouchAt = 0;
      r.jump = r.flight = null;
    };
    /** Standing on something on the page: it goes wherever that goes as the page scrolls. It steps off
        onto the ground if that's brought down to it, slips off if it's carried up off the top of the
        screen (or vanishes), and is tossed up if it's going up fast and stops dead */
    const ride = (r: Rig, dt: number) => {
      const { c } = r;
      const s = perches.surfaceOf(c.perch!, c.x);
      if (!s || c.x < s.left - 2 || c.x > s.right + 2) return fallOff(r, 0, c.v);
      const h = window.innerHeight - ground - topAt(s, c.x);
      if (h > maxLift(c)) return fallOff(r, clamp(c.pv, 0, TOSS_MAX), c.v);
      if (h <= 0) {
        fallOff(r, 0, 0);
        c.lift = 0;
        c.x = clamp(c.x, ...floorBounds(c));
        return;
      }
      const v = dt > 0 ? (h - c.lift) / dt : 0;
      if (v < -DROP_SPEED && !reduce) return fallOff(r, 0, c.v); // whipped away from under it: left in the air a moment
      if (c.pv > TOSS_SPEED && v < c.pv * 0.25 && !reduce) {
        c.lift = h;
        return fallOff(r, Math.min(c.pv * 0.7, TOSS_MAX), c.v);
      }
      c.pv += (v - c.pv) * Math.min(1, dt * 12);
      if (r.surface) c.x += s.left - r.surface.left; // slid sideways with it
      r.surface = s;
      c.lift = c.stand = h;
    };

    /* ── One character, one frame: walking ── */
    const move = (r: Rig, t: number, dt: number) => {
      const { c } = r;
      const { def } = c;
      if (t < r.appearAt + (Number.isNaN(r.fromX) ? 0 : RELEASE_MS)) return; // still flying out of the ball
      if (t >= r.recallAt) return; // being called back into it

      /* Carried: chases the pointer through the air (a little behind, so it swings) */
      if (c.held) {
        const [minX, maxX] = floorBounds(c);
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
      if (c.perch) ride(r, dt);
      /* Dropped, tossed or jumping: falls, drifting with the speed it was let go at (a jump flies true),
         bouncing off the edges, until it comes down on something or the ground */
      if (!c.perch && (c.lift > 0 || c.lv > 0)) {
        const [minX, maxX] = floorBounds(c);
        const feet = (lift: number) => window.innerHeight - ground - lift;
        // Where its feet were last frame, against the page as it is now (it may have scrolled)
        const y0 = feet(c.lift) + scrollPrev - scrollNow;
        c.lv -= GRAVITY * dt;
        c.lift = Math.min(c.lift + c.lv * dt, maxLift(c));
        if (c.lift >= maxLift(c) && c.lv > 0) c.lv = 0; // tossed up into the ceiling
        c.x += c.vx * dt;
        if (!c.jumping) c.vx *= Math.exp(-dt * 0.8);
        if (c.x < minX || c.x > maxX) {
          c.x = clamp(c.x, minX, maxX);
          c.vx *= -0.5;
        }
        if (!c.jumping) c.tx = c.x; // dropped: it stays where it lands (a jump's going somewhere, though)
        c.v = 0;
        c.lastActive = t;
        c.amp += (0 - c.amp) * Math.min(1, dt * 8);
        const y1 = feet(Math.max(0, c.lift));
        const f = c.jumping ? r.flight : null;
        const hit = y1 > y0 ? perches.find(c.x, y0, y1, (s, el) => {
          const [a, b] = walkRange(c, s);
          const h = window.innerHeight - ground - topAt(s, c.x);
          if (h <= 0 || h > maxLift(c) || c.x < a - 1 || c.x > b + 1) return false;
          // Not straight back onto what it jumped off, and when joining someone, only where they are
          if (f?.from && (f.from === el || f.from.contains(el) || el.contains(f.from))) return false;
          if (f?.to?.perch && !f.to.held && Math.abs(h - f.to.stand) > 8) return false;
          return true;
        }) : null;
        if (!hit && c.lift > 0) return;
        const impact = Math.max(0, -c.lv);
        c.lift = hit ? window.innerHeight - ground - topAt(hit.surface, c.x) : 0;
        c.landAt = t;
        c.landHard = clamp(impact / 1600, 0.25, 1);
        dustUp(c, c.lift);
        if (impact > BOUNCE_SPEED && !c.jumping) {
          c.lv = impact * 0.32; // bounces (and comes down again on whatever it hit)
          return;
        }
        c.lv = c.vx = c.pv = 0;
        c.jumping = false;
        r.flight = null;
        if (hit) {
          c.perch = hit.perch;
          r.surface = hit.surface;
          c.stand = c.lift;
        }
        return;
      }
      const [minX, maxX] = bounds(c);
      const busy = !!c.action;
      const forcedAsleep = t < c.forcedSleepUntil;
      /** Up on something, it may hop down off the edge to get where it's going (Jigglypuff only when
          she's not up there with Togepi) */
      let mayHop = c === tg;

      /* Crouched, about to jump */
      if (c.crouchAt) {
        c.v = 0;
        c.amp += (0 - c.amp) * Math.min(1, dt * 8);
        c.lastActive = t;
        if (busy || forcedAsleep || c.hovered || !r.jump) {
          c.crouchAt = 0;
          r.jump = null;
        } else if (t - c.crouchAt >= CROUCH_MS) {
          const to = r.jump.to;
          jumpTo(r, r.jump.x, to && to.perch && !aloft(to) && !to.held ? to.stand : 0, to);
        }
        return;
      }

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
      if (c === jp && (game || hide || rps)) {
        // Playing: the game says where she goes (down off whatever she's on, if need be)
        mayHop = true;
      } else if (c === jp && !busy && !forcedAsleep && jpChase !== null) {
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
      } else if (c === jp && !busy && !forcedAsleep && !tg.held && !aloft(tg) && !sameLevel(jp, tg)) {
        /* Not up (or down) where Togepi is: she gets to Togepi's level, beside it */
        const side = Math.sign(jp.x - tg.x) || buddySide;
        const s = rigOf(tg).surface;
        if (!tg.perch || !s) {
          // Togepi's on the ground: she heads off the nearer edge toward it and hops down
          const want = tg.x + side * buddyGap();
          jp.tx = want >= minX && want <= maxX ? (want - minX < maxX - want ? minX - 100 : maxX + 100) : want;
          mayHop = true;
        } else {
          // Togepi's up on something: she goes as near as she can get to a spot beside it, and jumps up
          const [a, b] = walkRange(jp, s);
          let land = clamp(tg.x + side * buddyGap(), a, b);
          // Short of room on her side, she lands at whichever end has more and nudges Togepi along
          if (Math.abs(land - tg.x) < minGap()) land = tg.x - a > b - tg.x ? a : b;
          if (b - a < minGap() || tg.stand > maxLift(jp) - 12) {
            jp.tx = tg.x + side * buddyGap(); // no room up there (or it's too near the top): she waits by it
            if (jp.perch) mayHop = true;
          } else {
            jp.tx = land;
            const reach = clamp(land, minX, maxX);
            // Near enough, she takes a running jump (it carries her the rest of the way)
            if (Math.abs(jp.x - reach) < JUMP_REACH && !jp.hovered && jp.sleep < 0.5 && !reduce) {
              jp.crouchAt = t;
              r.jump = { x: land, to: tg };
            }
          }
        }
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
        // Up on something with no room to hop over Togepi, she gets out of its way by hopping off the end
        if (jp.perch && (side < 0 ? jp.x - minX : maxX - jp.x) < 12 && pushing && !jp.hovered && jp.sleep < 0.5 && !reduce) {
          jp.crouchAt = t;
          r.jump = { x: clamp((side < 0 ? minX : maxX) + side * (jp.W * 0.5 + 40), ...floorBounds(jp)), to: null };
          return;
        }
      }
      if (c === jp && jpChase !== null && !sameLevel(jp, tg)) mayHop = true;
      const goal = clamp(c.tx, minX, maxX);

      /* Up on something and wanting to be past its end: goes to the edge, peeks over, and hops down */
      const past = c.tx < minX - def.walk.startDist ? -1 : c.tx > maxX + def.walk.startDist ? 1 : 0;
      if (c.perch && mayHop && past && Math.abs(c.x - goal) < STOP_DIST + 3 && !busy && !forcedAsleep && !c.hovered && c.sleep < 0.5 && !reduce) {
        if (!c.edgeAt || r.edgeDir !== past) {
          c.edgeAt = t;
          r.edgeDir = past;
        }
        if (t - c.edgeAt > (c === tg ? EDGE_PEEK_MS : EDGE_PEEK_MS * 0.3)) {
          c.crouchAt = t;
          r.jump = { x: clamp(goal + past * (c.W * 0.5 + 40), ...floorBounds(c)), to: null };
        }
      } else c.edgeAt = 0;

      /* Walking: accelerate toward the target, brake so it arrives without overshooting */
      const dist = goal - c.x;
      // (heading for an edge to hop off, it goes all the way, however close it is)
      const toEdge = !!c.perch && mayHop && past !== 0 && Math.abs(dist) > STOP_DIST;
      const walking = !busy && !c.hovered && !reduce && !forcedAsleep && (crowded || toEdge || Math.abs(c.v) > 1 || Math.abs(dist) > def.walk.startDist);
      if (walking) {
        const maxSpeed = def.walk.maxSpeed * (crowded ? 1.4 : 1) * (hide?.hider === c && hide.hiding === "go" ? HIDE_RUN : 1); // (hurrying off to hide)
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
      if (tg.held || jp.held || aloft(tg) || aloft(jp) || !sameLevel(tg, jp)) return;
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
        const nx = clamp(tg.x - side * rest, tMin, tMax);
        rest -= (tg.x - nx) * side;
        tg.x = nx;
        tg.v = 0;
      }
      // Still not enough room for both up on something: Jigglypuff hops down out of the way
      if (rest > 0.5 && jp.perch && movable && !jp.crouchAt && !reduce) {
        jp.crouchAt = t;
        rigOf(jp).jump = { x: clamp(jp.x + side * (jp.W + 40), ...floorBounds(jp)), to: null };
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
      const air = c.held || aloft(c);
      if (air && Math.abs(c.vx) > 80) c.wantFacing = Math.sign(c.vx);
      else if (Math.abs(c.v) > 6) c.wantFacing = Math.sign(c.v);
      else if (playFacing(c)) c.wantFacing = playFacing(c);
      else if (hideFacing(c)) c.wantFacing = hideFacing(c);
      else if (rps) c.wantFacing = Math.sign(other(c).x - c.x) || c.wantFacing;
      else if (!busy && !c.leapStart && c.sleep < 0.5 && Math.abs(mx - c.x) > c.W) c.wantFacing = Math.sign(mx - c.x);
      c.facing = c.wantFacing; // turns round instantly

      /* Moods */
      c.happy += ((c.hovered && !busy ? 1 : 0) - c.happy) * Math.min(1, dt * 10);
      // Talking keeps it awake, and so does the intro, a conversation the other one is listening to
      if (r.bubbleUntil || (!introOver && t < introUntil)) c.lastActive = t;
      // Left alone they nod off, but not before they've played every game (unless one can't be played: then
      // a little later). Once asleep, they stay asleep
      const idle = t - c.lastActive;
      const sleepy = idle > SLEEP_AFTER_MS && (c.sleep > 0.5 || !gamesOwed() || idle > SLEEP_AFTER_MS + GAMES_GRACE_MS);
      const wantSleep = forcedAsleep || (!busy && !c.hovered && c.v === 0 && sleepy) ? 1 : 0;
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
        p.ears += Math.sin(c.phase * 2) * 4 * c.amp;
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
        p.ears += Math.sin(secs * 12) * 6 * c.happy;
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
      playPose(c, p, t);
      hidePose(c, p, t, dt);
      rpsPose(c, p, t);

      /* Flying out of the Poké Ball: an arc from the ball over to its spot, growing as it goes */
      const flight = Number.isNaN(r.fromX) ? 1 : Math.min(1, (t - r.appearAt) / RELEASE_MS);
      if (flight < 1) {
        p.offset += (r.fromX - c.x) * (1 - easeOutCubic(flight));
        p.hop += Math.sin(Math.PI * flight) * c.H * 0.8;
        p.spin += (1 - flight) * 25 * Math.sign(c.x - r.fromX);
      }

      /* Up on something: crouching to jump, peeking over the edge, or keeping its balance as the page
         carries it along */
      if (c.crouchAt) {
        const k = smooth((t - c.crouchAt) / CROUCH_MS);
        p.hop = p.rot = 0;
        p.sy *= 1 - 0.14 * k;
        p.sx *= 1 + 0.08 * k;
        p.raiseL = p.raiseR = -12 * k;
        p.tiltL = p.tiltR = 0;
      } else if (c.edgeAt && c.perch) {
        const k = smooth((t - c.edgeAt) / 300);
        p.rot += r.edgeDir * 7 * k;
        p.raiseL += (25 + Math.sin(secs * 9) * 10) * k;
        p.raiseR += (25 + Math.sin(secs * 9 + 2) * 10) * k;
        // Looks down over the edge, at where it's going
        const foot = point(c, def.feet.x, def.feet.y);
        p.look = { x: foot.x + r.edgeDir * 80, y: foot.y + 140 };
      }
      if (c.perch && Math.abs(c.pv) > SWAY_SPEED && !reduce) {
        const k = clamp((Math.abs(c.pv) - SWAY_SPEED) / 900, 0, 1);
        p.raiseL += 60 * k;
        p.raiseR += 60 * k;
        p.rot += Math.sin(secs * 13) * 6 * k;
        p.eye = "open";
      }

      /* In the air: dangling from the pointer, swinging with its speed, legs kicking with glee */
      if (air && c.jumping) {
        // Jumping: arms up, toes pointed, all smiles
        p.rot = 0;
        p.spin = clamp(c.vx * 0.02, -12, 12);
        p.raiseL = p.raiseR = 60;
        p.tiltL = p.tiltR = 18;
        p.liftL = p.liftR = 0;
        p.eye = "happy";
        const k = clamp(-c.lv / 900, 0, 1); // stretches out on the way up, and as it comes down
        p.sy *= 1 + 0.06 * Math.max(k, clamp(c.lv / 900, 0, 1));
      } else if (air) {
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
      /** How high what it's standing on is (the whole picture's lifted that much, shadow and all) */
      let stand = c.stand;
      // Rolling or leaning along a sloping top edge, it stays on the edge where it's drawn
      if (c.perch && r.surface && p.offset) stand += topAt(r.surface, c.x) - topAt(r.surface, c.x + p.offset);
      if (recall > 0) {
        // Pulled down the beam into the ball, shrinking, glowing red
        p.hop += stand;
        stand = 0;
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
      r.hop = p.hop + stand - c.stand;

      /* Blink */
      if (t > c.blinkAt && p.eye === "open") { c.blinkUntil = t + 130; c.blinkAt = t + rand(2200, 6000); }
      if (t < c.blinkUntil && p.eye === "open") p.eye = "closed";

      /* Render */
      const { feet, center } = def;
      r.root.style.transform = `translate3d(${(c.x + c.offset - c.W / 2).toFixed(2)}px,${(-stand).toFixed(2)}px,0)`;
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
      if (p.hop > 0 && stand + p.hop + c.H * 1.6 > window.innerHeight - ground - ceiling) {
        const over = ceiling - r.body.getBoundingClientRect().top;
        if (over > 0) {
          p.hop = Math.max(0, p.hop - over);
          r.hop = p.hop + stand - c.stand;
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
      const rise = c.lift - c.stand;
      r.hit.setAttribute("transform", rise > 0 ? `translate(0 ${(-(rise * def.h) / c.H).toFixed(1)})` : "translate(0 0)");

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
      scrollNow = window.scrollY;
      playTick(t, dt);
      hideTick(t);
      rpsTick(t);
      for (const r of ordered) move(r, t, dt);
      separate(t);
      for (const r of ordered) draw(r, t, dt);
      hideClip();
      if (tg.sleep > 0.9 && jp.sleep > 0.9) played.ball = played.hide = played.rps = false; // fast asleep: all of them again when they wake
      ballTick(dt);
      scrollPrev = scrollNow;
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
      document.fonts?.removeEventListener("loadingdone", onFonts);
      window.clearInterval(wobbler);
      ball.removeEventListener("click", onBallClick);
      ball.removeEventListener("pointerdown", onBallDown);
      window.removeEventListener("pointermove", onBallDragMove);
      window.removeEventListener("pointerup", onBallDragEnd);
      window.removeEventListener("pointercancel", onBallDragEnd);
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
          {/* Around the artwork: a tight shadow that outlines it, and a wider, fainter one beneath (artwork units,
              which are about a quarter of a pixel on screen) */}
          <filter id="mascot-lift" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
            <feDropShadow dx="0" dy="4" stdDeviation="7" floodColor="#1C1917" floodOpacity="0.7" result="near" />
            <feDropShadow in="near" dx="0" dy="18" stdDeviation="26" floodColor="#1C1917" floodOpacity="0.32" />
          </filter>
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
          data-mascot-ui
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
        data-mascot-ui
        aria-label="Let Togepi and Jigglypuff out of their Poké Ball"
        data-cursor-pointer
        className="fixed left-0 z-[39] p-0 border-0 bg-transparent rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4622D] focus-visible:ring-offset-2 print:hidden"
        style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 4px)", opacity: 0, width: BALL.desktop, height: BALL.desktop, transformOrigin: "50% 100%", touchAction: "none" }}
      >
        {/* Ground shadow, under the ball (the ball is positioned too, and comes after it, so it paints on top) */}
        <span data-b="shadow" className="absolute left-1/2 -translate-x-1/2 rounded-full" style={{ bottom: -3, width: "90%", height: 6, background: "rgba(28,25,23,0.22)", filter: "blur(2px)" }} />
        <span data-b="body" className="relative block w-full h-full" style={{ transformOrigin: "50% 100%" }}>
          <svg viewBox="0 0 64 64" className="block w-full h-full overflow-visible">
            <defs>
              <radialGradient id="ball-glow">
                <stop offset="0.2" stopColor="#FF3B30" stopOpacity="0.85" />
                <stop offset="1" stopColor="#FF3B30" stopOpacity="0" />
              </radialGradient>
            </defs>
            <g data-b="base" style={{ transformBox: "fill-box", transformOrigin: "2px 0px" }}>
              <path d="M0,32 A32,32 0 0 0 64,32 Z" fill="#FAF7F2" stroke="#1C1917" strokeWidth="2.5" />
              <rect x="0" y="31" width="64" height="4" fill="#1C1917" />
            </g>
            <g data-b="lid" style={{ transformBox: "fill-box", transformOrigin: "2px 33px" }}>
              <path d="M0,32 A32,32 0 0 1 64,32 Z" fill="#C4622D" stroke="#1C1917" strokeWidth="2.5" />
              <rect x="0" y="29" width="64" height="4" fill="#1C1917" />
              <circle cx="32" cy="32" r="10" fill="#1C1917" />
              <circle cx="32" cy="32" r="6" fill="#FAF7F2" />
              {/* The red glow of its button while it's catching them */}
              <g data-b="light" style={{ opacity: 0 }}>
                <circle cx="32" cy="32" r="28" fill="url(#ball-glow)" />
                <circle cx="32" cy="32" r="6.5" fill="#FF3326" />
                <circle cx="32" cy="32" r="3" fill="#FFB3AB" />
              </g>
              {/* Shine */}
              <path d="M14,16 Q20,9 29,7" stroke="#fff" strokeOpacity="0.55" strokeWidth="4" strokeLinecap="round" fill="none" />
            </g>
          </svg>
        </span>
      </button>
      <div
        ref={hintRef}
        data-mascot-ui
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
      <div ref={fxRef} data-mascot-ui aria-hidden className="fixed inset-0 z-[39] pointer-events-none overflow-hidden print:hidden" />
      {CHARACTERS.map((def) => (
        <div
          key={def.id}
          ref={(el) => { bubbleRefs.current[def.id] = el; }}
          data-mascot-ui
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
