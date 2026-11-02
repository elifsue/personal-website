import type { ReactNode, SVGProps } from "react";
import type { Spawn } from "./particles";
import type { Perch } from "./perches";

export type Pt = { x: number; y: number };
export type CharacterId = "togepi" | "jigglypuff";
export type LimbKey = "armL" | "armR" | "footL" | "footR" | "earL" | "earR";

/** A limb cut out of the artwork that pivots where it meets the body */
export interface LimbDef {
  k: LimbKey;
  pivot: [number, number];
  /** Outline of the limb; also cut out of the body so a moved limb leaves no frozen copy */
  cut: string;
  /** Skin-coloured filler behind the base, so turning never opens a gap at the joint */
  joint?: SVGProps<SVGEllipseElement>;
  /** Limbs that overlap the body in the artwork are drawn in front of it */
  front?: boolean;
  /** For front limbs: body-coloured paint over the hole they leave in the body when they move */
  patch?: SVGProps<SVGPathElement>;
}

export interface Ellipse {
  x: number;
  y: number;
  rx: number;
  ry: number;
  tilt: number;
}

export interface EyeDef {
  x: number;
  y: number;
  /** Feathered skin-coloured lid that covers the artwork's eye when closed. `tight` keeps it solid
      nearer the edge, for big eyes whose outline would otherwise show through the feathering */
  lid: { rx: number; ry: number; tilt: number; fill: string; tight?: boolean };
  /** Half-width of the closed / happy eye arcs */
  arc: number;
  stroke: number;
  /** The part of the eye that follows the cursor: cut out of the artwork and slid up to `range`
      (artwork units) toward it */
  look?: {
    cut: Ellipse;
    /** Keep only the coloured pixels of the cut, so an iris moves without the eye white around it */
    ink?: boolean;
    range: [number, number];
    /** The eye white it slides around in, repainted underneath so the iris leaves no copy behind.
        Without one, the eyelid's skin covers the eye's old spot */
    socket?: Ellipse & { fill: string; /** Redrawn outline, so the iris tucks neatly under the rim */ stroke?: string };
    /** The white shine on the eye. It's lifted off, rests just above the middle of `within` (the dark
        of the eye, which it never leaves) and slides up to `range` toward where it's looking. `under`
        (the eye's colour) paints over its old spot, darkening only, so shading such as a darker rim
        round an iris shows through untouched */
    shine?: Ellipse & {
      range: [number, number];
      under: string;
      within: Ellipse;
      /** Where `under` may paint (default: just round `within`) */
      cover?: Ellipse;
    };
  };
}

export type EyeMode = "open" | "happy" | "closed";
export type MouthMode = "smile" | "sing" | "pout";

/** Everything the engine animates for one frame; moves adjust it */
export interface Pose {
  hop: number; // px
  rot: number; // deg, about the feet
  sx: number;
  sy: number;
  shrink: number;
  /** Positive lifts the arm, whichever side it's on */
  raiseL: number;
  raiseR: number;
  liftL: number; // foot lift, artwork units
  liftR: number;
  tiltL: number; // foot tilt, deg (positive lifts the toe)
  tiltR: number;
  ears: number; // deg
  eye: EyeMode;
  mouth: MouthMode;
  blush: number;
  angry: number;
  /** Horizontal offset from the walking position (Rollout), px */
  offset: number;
  /** Rotation about the body's centre (Rollout), deg */
  spin: number;
  /** Something to look at instead of the cursor (viewport coordinates) */
  look?: Pt;
}

export interface Action {
  key: string;
  start: number;
  dur: number;
  /** Per-move scratch state */
  data: Record<string, number>;
}

export interface CharacterState {
  def: CharacterDef;
  x: number;
  v: number;
  tx: number;
  W: number;
  H: number;
  phase: number;
  amp: number;
  facing: number;
  wantFacing: number;
  happy: number;
  sleep: number;
  hovered: boolean;
  lastActive: number;
  forcedSleepUntil: number;
  blinkAt: number;
  blinkUntil: number;
  action: Action | null;
  offset: number;
  nextZ: number;
  nextHeart: number;
  clicks: number;
  lastMove: string | null;
  /** Togepi only: when Jigglypuff's doodle started being drawn on its face, and when it woke up with it */
  doodleStart: number;
  doodleWoke: number;
  /** Jigglypuff only: hopping over Togepi to its other side (start time, start x, side it lands on) */
  leapStart: number;
  leapFrom: number;
  leapSide: number;
  /** Being carried through the air by the cursor */
  held: boolean;
  /** Height of its feet above the ground (px) and how fast that's changing (px/s, up is positive) */
  lift: number;
  lv: number;
  /** Sideways speed while carried or falling (px/s) */
  vx: number;
  /** Where the pointer grabbed it, relative to its feet, and where the pointer is now */
  grabDX: number;
  grabDY: number;
  grabPX: number;
  grabPY: number;
  /** When it last hit the ground after a fall, and how hard (0–1) */
  landAt: number;
  landHard: number;
  nextTrail: number;
  /** What it's standing on when that's part of the page rather than the ground (see perches.ts) */
  perch: Perch | null;
  /** How high (px) above the ground the thing it's standing on is (0 on the ground or in the air) */
  stand: number;
  /** In the air because it jumped, rather than being dropped or thrown */
  jumping: boolean;
  /** When it got to the edge of what it's on, wanting to get down, and when it crouched to jump (0: not) */
  edgeAt: number;
  crouchAt: number;
  /** How fast what it's standing on is going up (px/s), as the page scrolls */
  pv: number;
}

export interface Ctx {
  now: number;
  reduce: boolean;
  touch: boolean;
  world: Record<CharacterId, CharacterState>;
  spawn: Spawn;
  say: (c: CharacterState, text: string, ms?: number) => void;
  /** Artwork coordinates → viewport coordinates (accounts for facing and offset) */
  point: (c: CharacterState, ax: number, ay: number) => Pt;
  useMove: (c: CharacterState, key: string, text?: string) => void;
  forceSleep: (c: CharacterState, ms: number) => void;
  later: (fn: () => void, ms: number) => void;
  flash: (c: CharacterState) => void;
  /** Leftmost / rightmost x the character's centre may reach */
  bounds: (c: CharacterState) => readonly [number, number];
  spawnPath: (html: string, pts: Pt[], dur: number) => void;
  /** Standing at the same height on the same thing, or both on the ground */
  sameLevel: (a: CharacterState, b: CharacterState) => boolean;
}

export interface MoveDef {
  name: string;
  dur: number;
  start?: (ctx: Ctx, c: CharacterState) => void;
  /** Called every frame while the move runs; `at` is seconds since it started */
  tick?: (ctx: Ctx, c: CharacterState, at: number) => void;
  pose?: (p: Pose, at: number, c: CharacterState, ctx: Ctx) => void;
  end?: (ctx: Ctx, c: CharacterState) => void;
}

export interface CharacterDef {
  id: CharacterId;
  name: string;
  src: string;
  w: number;
  h: number;
  width: { desktop: number; mobile: number };
  /** Pivot for whole-body rotation / squash */
  feet: Pt;
  /** Centre of the body, for spinning */
  center: Pt;
  /** Leans the three-quarter-view artwork so both soles sit on flat ground */
  level: { angle: number; x: number; y: number };
  soles: Pt[];
  shadow: { cx: number; cy: number; rx: number; ry: number };
  eyes: EyeDef[];
  cheeks: { x: number; y: number; rx: number; ry: number }[];
  mouth: Pt;
  hit: { cx: number; cy: number; rx: number; ry: number };
  limbs: LimbDef[];
  walk: { maxSpeed: number; bounce: number; sway: number; stride: number; startDist: number };
  /** How far each arm sinks when asleep (deg) */
  droop: [number, number];
  /** Extra defs (gradients) used by this character's overlays */
  defs?: ReactNode;
  /** Character-specific overlays drawn on the face, inside the animated group */
  overlays?: ReactNode;
  intro: (touch: boolean) => string[];
  moves: Record<string, MoveDef>;
  onClick: (ctx: Ctx, c: CharacterState) => void;
  /** Being dragged about: extra flair on top of the dangling pose, a particle for its trail when
      it's moving fast, and things it might say when picked up */
  air: { pose?: (p: Pose, secs: number, c: CharacterState) => void; trail: () => string; pickup: string[] };
  /** Per-frame update for the character's own overlays */
  frame?: (ctx: Ctx, c: CharacterState, p: Pose, q: (k: string) => SVGElement | null) => void;
}
