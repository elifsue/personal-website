/* ============================================================
   HERO SECTION — Interactive Card Layout
   Responsive tilted cards with 3D hover/press interactions
   Breakpoints: <420px photo only | 420-919px 2×2 grid | 920px+ 4 cols
   ============================================================ */

import { motion, useAnimationFrame, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";

// ─── Constants ───────────────────────────────────────────────
const HERO_PHOTO = `${import.meta.env.BASE_URL}images/elifsu-portrait.jpg`;
const HERO_SKETCH = `${import.meta.env.BASE_URL}images/elifsu-portrait-sketch.jpg`;
const SKETCH_BUBBLES = { radius: 95, minTrail: 30, maxTrail: 58, spacing: 34, jitter: 26, life: 1.1, maxCount: 14 };
const SKETCH_PHYSICS = {
  followStiffness: 220, followDamping: 22, // how the blob chases the cursor
  popStiffness: 260, popDamping: 12,       // jelly pop-in / shrink of the blob
  jiggleStiffness: 320, jiggleDamping: 9,  // outline wobble (lower damping = jigglier)
  inertia: 0.0012,                         // how much the outline lags when accelerating
  stretch: 0.16, tail: 0.14, fullSpeed: 1400, // elongation along the direction of travel
  inherit: 0.25, trailDrag: 3, buoyancy: 40, // trail bubble momentum, drag and upward drift
};
const HERO_BG = `${import.meta.env.BASE_URL}images/blob-bg.webp`;
const RESUME_URL = "/ElifsuAtes_Resume.pdf";
const CARD_ROTATIONS = [-3, 2, -1.5, 3];
const SPACER_COUNT = 4;
const MIN_SPACER_PX = 32;
const ARROW_AREA_PX = 54;

// ─── Card text content ───────────────────────────────────────
const CARD_TEXT = {
  about: {
    full: "A UI/UX designer based in London who thinks in systems and feels in pixels. CS graduate with a passion for accessible, human-first experiences and AI-driven workflows.",
    short: "A UI/UX designer based in London who thinks in systems and feels in pixels.",
  },
  work: {
    full: "From UX case studies to AI-powered prototyping tools. Explore projects built with research, systems thinking, and attention to detail.",
    short: "From UX case studies to AI-powered prototyping tools.",
  },
  writing: {
    full: "Thoughts on design, AI-assisted workflows, and building tools that bridge the gap between designers and developers. Sharing lessons learned along the way.",
    short: "Sharing thoughts on design, AI-assisted workflows, and lessons learned along the way.",
  },
};

const WORK_TAGS = ["Character Pad", "Kiddiwear", "Wireframe Prototyper Skill"];

// ─── Shared responsive class strings ────────────────────────
const CARD_ASPECT = "aspect-[2/3] min-[430px]:aspect-[3/4] min-[455px]:aspect-[2/3] min-[500px]:aspect-[3/4] min-[920px]:aspect-[2/3] xl:aspect-[3/4]";
const CARD_RADIUS = "rounded-2xl min-[920px]:rounded-3xl";
const CARD_PADDING = "p-4 min-[920px]:p-8 max-[1180px]:min-[920px]:p-5";
const CARD_BASE = `${CARD_RADIUS} ${CARD_PADDING} ${CARD_ASPECT} flex flex-col justify-between shadow-xl border transition-shadow duration-300 hover:shadow-2xl`;
const ICON_SIZE = "w-8 h-8 min-[920px]:w-10 min-[920px]:h-10 max-[1180px]:min-[920px]:w-8 max-[1180px]:min-[920px]:h-8";
const ICON_BOX = `${ICON_SIZE} rounded-xl flex items-center justify-center mb-3 min-[920px]:mb-4 max-[1180px]:min-[920px]:mb-3`;
const ICON_TEXT = "text-sm min-[920px]:text-lg max-[1180px]:min-[920px]:text-sm";
const TITLE = "font-display text-xl min-[920px]:text-2xl max-[1180px]:min-[920px]:text-xl mb-2 min-[920px]:mb-3 max-[1180px]:min-[920px]:mb-2";
const DESC = "text-xs min-[920px]:text-sm max-[1180px]:min-[920px]:text-xs leading-relaxed";

// ─── Reusable sub-components ─────────────────────────────────
function ArrowIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  );
}

function ResponsiveText({ full, short, className, style }: { full: string; short: string; className?: string; style?: React.CSSProperties }) {
  return (
    <p className={className} style={style}>
      <span className="hidden min-[455px]:inline">{full}</span>
      <span className="inline min-[455px]:hidden">{short}</span>
    </p>
  );
}

function CardLink({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono-dm text-xs" style={{ color }}>{label}</span>
      <ArrowIcon color={color} />
    </div>
  );
}

// ─── Floating Blobs ──────────────────────────────────────────
const BLOBS = [
  { pos: "top-[6%] left-[4%]", size: "w-16 h-16", shape: "blob-3", color: "#4A6741", animate: { x: [0, 15, 0, -15, 0], y: [0, -12, 0, 12, 0], scale: [1, 1.12, 1], rotate: [0, 12, 0] }, duration: 9, delay: 0 },
  { pos: "top-[12%] left-[20%]", size: "w-12 h-12", shape: "blob-2", color: "#C4622D", animate: { x: [0, 10, 0, -10, 0], y: [0, -18, 0, 18, 0], rotate: [0, 360] }, duration: 14, delay: 0 },
  { pos: "top-[6%] right-[4%]", size: "w-14 h-14", shape: "blob-1", color: "#C4622D", animate: { x: [0, -18, 0, 18, 0], y: [0, 15, 0, -15, 0], scale: [1, 1.15, 1] }, duration: 10, delay: 0.8 },
  { pos: "top-[38%] left-[2%]", size: "w-14 h-14", shape: "blob-1", color: "#C4622D", animate: { x: [0, 20, 0, -20, 0], y: [0, -20, 0, 20, 0], scale: [1, 1.18, 1], rotate: [0, -15, 0] }, duration: 11, delay: 1.2 },
  { pos: "top-[42%] right-[2%]", size: "w-16 h-16", shape: "blob-3", color: "#4A6741", animate: { x: [0, -22, 0, 22, 0], y: [0, 18, 0, -18, 0], rotate: [0, -360] }, duration: 13, delay: 1.8 },
  { pos: "bottom-[10%] left-[4%]", size: "w-12 h-12", shape: "blob-2", color: "#4A6741", animate: { x: [0, 18, 0, -18, 0], y: [0, -22, 0, 22, 0], scale: [1, 1.2, 1], rotate: [0, 20, 0] }, duration: 8, delay: 2.2 },
  { pos: "bottom-[6%] left-[30%]", size: "w-10 h-10", shape: "blob-1", color: "#C4622D", animate: { x: [0, -14, 0, 14, 0], y: [0, 16, 0, -16, 0], scale: [1, 1.1, 1] }, duration: 12, delay: 2.8 },
  { pos: "bottom-[6%] right-[28%]", size: "w-12 h-12", shape: "blob-3", color: "#4A6741", animate: { x: [0, 16, 0, -16, 0], y: [0, -14, 0, 14, 0], rotate: [0, 15, 0] }, duration: 10, delay: 3.2 },
  { pos: "bottom-[10%] right-[4%]", size: "w-14 h-14", shape: "blob-2", color: "#C4622D", animate: { x: [0, -20, 0, 20, 0], y: [0, -15, 0, 15, 0], scale: [1, 1.14, 1], rotate: [0, -18, 0] }, duration: 9, delay: 3.8 },
  { pos: "top-[12%] right-[20%]", size: "w-10 h-10", shape: "blob-2", color: "#4A6741", animate: { x: [0, 12, 0, -12, 0], y: [0, 20, 0, -20, 0], scale: [1, 1.16, 1] }, duration: 11, delay: 4.2 },
];

// ─── TiltCard Component ──────────────────────────────────────
interface TiltCardProps {
  children: React.ReactNode;
  index: number;
  onClick?: () => void;
  className?: string;
}

function TiltCard({ children, index, onClick, className = "" }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const [entered, setEntered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const sx = useSpring(mx, { stiffness: 150, damping: 20 });
  const sy = useSpring(my, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(sy, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(sx, [-0.5, 0.5], ["-8deg", "8deg"]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    mx.set((e.clientX - left) / width - 0.5);
    my.set((e.clientY - top) / height - 0.5);
  };

  const onLeave = () => { mx.set(0); my.set(0); };

  const onPress = () => {
    setPressed(true);
    setTimeout(() => { setPressed(false); onClick?.(); }, 300);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, rotate: 0 }}
      animate={{
        opacity: 1,
        y: pressed ? 8 : 0,
        rotate: pressed ? 0 : CARD_ROTATIONS[index],
        scale: pressed ? 0.92 : 1,
        z: pressed ? -50 : 0,
      }}
      transition={
        entered
          ? { type: "spring", stiffness: 400, damping: 15 }
          : { duration: 0.8, delay: 0.2 + index * 0.15, ease: "easeOut" }
      }
      whileHover={{ scale: 1.05, rotate: 0, zIndex: 50, transition: { duration: 0.2 } }}
      onAnimationComplete={() => setEntered(true)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onPress}
      className={`relative cursor-pointer ${className}`}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: "1000px" }}
    >
      {children}
    </motion.div>
  );
}

// ─── SketchRevealPhoto Component ─────────────────────────────
// A bubbly soft-body reveal: a jelly blob follows the cursor showing the sketch,
// squashing, stretching and jiggling with its motion, and moving the cursor
// sheds a trail of wobbly bubbles that drift upward and fade away
const BLOB_POINTS = 14;
const BLOB_ANGLES = Array.from({ length: BLOB_POINTS }, (_, i) => (i / BLOB_POINTS) * Math.PI * 2);

interface SoftBody {
  x: number; y: number; vx: number; vy: number;
  base: Float32Array;   // static irregular resting shape (fraction of radius)
  offset: Float32Array; // dynamic deformation per point (fraction of radius)
  offsetV: Float32Array;
}

interface TrailBubble extends SoftBody { size: number; age: number; life: number }

function makeBase(seed: number) {
  return Float32Array.from(BLOB_ANGLES, (a) => 0.05 * Math.sin(2 * a + seed) + 0.035 * Math.sin(3 * a + seed * 2.3));
}

function makeSoftBody(x: number, y: number, seed: number): SoftBody {
  return { x, y, vx: 0, vy: 0, base: makeBase(seed), offset: new Float32Array(BLOB_POINTS), offsetV: new Float32Array(BLOB_POINTS) };
}

// Drive each outline point with a damped spring: inertia from acceleration,
// stretch along the direction of travel, and a trailing tail at speed
function stepDeformation(body: SoftBody, ax: number, ay: number, dt: number) {
  const P = SKETCH_PHYSICS;
  const speed = Math.hypot(body.vx, body.vy);
  const ux = speed > 1 ? body.vx / speed : 0;
  const uy = speed > 1 ? body.vy / speed : 0;
  const amount = Math.min(speed / P.fullSpeed, 1);
  for (let i = 0; i < BLOB_POINTS; i++) {
    const dx = Math.cos(BLOB_ANGLES[i]);
    const dy = Math.sin(BLOB_ANGLES[i]);
    const along = dx * ux + dy * uy;
    const target = amount * (P.stretch * (2 * along * along - 1) + P.tail * Math.max(0, -along));
    const inertia = -(dx * ax + dy * ay) * P.inertia;
    const force = P.jiggleStiffness * (target - body.offset[i]) - P.jiggleDamping * body.offsetV[i] + inertia;
    body.offsetV[i] += force * dt;
    body.offset[i] = Math.max(-0.45, Math.min(0.45, body.offset[i] + body.offsetV[i] * dt));
  }
}

// Smooth closed outline through the points (Catmull-Rom → cubic Bézier)
function softBodyPath(body: SoftBody, radius: number) {
  if (radius < 0.5) return "";
  const pts = BLOB_ANGLES.map((a, i) => {
    const r = radius * (1 + body.base[i] + body.offset[i]);
    return [body.x + r * Math.cos(a), body.y + r * Math.sin(a)];
  });
  const at = (i: number) => pts[(i + BLOB_POINTS) % BLOB_POINTS];
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < BLOB_POINTS; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)}`
      + ` ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)}`
      + ` ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return `${d} Z`;
}

// Trail bubble size over its life: springy pop-in, hold, then shrink away
function bubbleEnvelope(t: number) {
  if (t < 0.18) {
    const k = t / 0.18 - 1;
    return 1 + 2.7 * k * k * k + 1.7 * k * k; // easeOutBack
  }
  if (t < 0.55) return 1;
  const k = (t - 0.55) / 0.45;
  return Math.max(0, 1 - k * k);
}

function SketchRevealPhoto() {
  const id = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const sim = useRef({
    hovered: false,
    target: { x: 0, y: 0 },
    main: makeSoftBody(0, 0, 0.7),
    radius: 0,
    radiusV: 0,
    trail: [] as TrailBubble[],
    lastSpawn: null as { x: number; y: number } | null,
    idle: true,
  });

  useAnimationFrame((_, delta) => {
    const s = sim.current;
    const P = SKETCH_PHYSICS;
    if (!s.hovered && s.radius < 0.3 && Math.abs(s.radiusV) < 1 && s.trail.length === 0) {
      if (!s.idle) {
        pathRef.current?.setAttribute("d", "M0,0 Z");
        s.idle = true;
      }
      return;
    }
    s.idle = false;

    // Fixed substeps keep the springs stable regardless of frame rate
    let remaining = Math.min(delta / 1000, 0.05);
    while (remaining > 0) {
      const dt = Math.min(remaining, 1 / 240);
      remaining -= dt;

      const m = s.main;
      const ax = P.followStiffness * (s.target.x - m.x) - P.followDamping * m.vx;
      const ay = P.followStiffness * (s.target.y - m.y) - P.followDamping * m.vy;
      m.vx += ax * dt;
      m.vy += ay * dt;
      m.x += m.vx * dt;
      m.y += m.vy * dt;
      stepDeformation(m, ax, ay, dt);

      const radiusTarget = s.hovered ? SKETCH_BUBBLES.radius : 0;
      s.radiusV += (P.popStiffness * (radiusTarget - s.radius) - P.popDamping * s.radiusV) * dt;
      s.radius += s.radiusV * dt;

      for (const b of s.trail) {
        const drag = Math.exp(-P.trailDrag * dt);
        const bvx = b.vx;
        const bvy = b.vy;
        b.vx *= drag;
        b.vy = b.vy * drag - P.buoyancy * dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        stepDeformation(b, (b.vx - bvx) / dt, (b.vy - bvy) / dt, dt);
        b.age += dt;
      }
    }
    s.trail = s.trail.filter((b) => b.age < b.life);

    let d = softBodyPath(s.main, Math.max(0, s.radius));
    for (const b of s.trail) d += ` ${softBodyPath(b, b.size * bubbleEnvelope(b.age / b.life))}`;
    pathRef.current?.setAttribute("d", d.trim() || "M0,0 Z");
  });

  // Convert to unscaled local px, since the parent TiltCard scales on hover
  const toLocal = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current!;
    const { left, top, width, height } = el.getBoundingClientRect();
    return { lx: ((e.clientX - left) / width) * el.offsetWidth, ly: ((e.clientY - top) / height) * el.offsetHeight };
  };

  const spawn = (lx: number, ly: number) => {
    const s = sim.current;
    const last = s.lastSpawn;
    if (last && Math.hypot(lx - last.x, ly - last.y) < SKETCH_BUBBLES.spacing) return;
    s.lastSpawn = { x: lx, y: ly };
    const { jitter, minTrail, maxTrail, life, maxCount } = SKETCH_BUBBLES;
    const bubble: TrailBubble = {
      ...makeSoftBody(lx + (Math.random() - 0.5) * jitter, ly + (Math.random() - 0.5) * jitter, Math.random() * 6),
      size: minTrail + Math.random() * (maxTrail - minTrail),
      age: 0,
      life: life * (0.8 + Math.random() * 0.4),
    };
    // Inherit some of the blob's momentum, plus a random nudge
    bubble.vx = s.main.vx * SKETCH_PHYSICS.inherit + (Math.random() - 0.5) * 60;
    bubble.vy = s.main.vy * SKETCH_PHYSICS.inherit + (Math.random() - 0.5) * 60;
    // Start mid-wobble so each bubble jiggles as it pops in
    for (let i = 0; i < BLOB_POINTS; i++) bubble.offset[i] = (Math.random() - 0.5) * 0.4;
    s.trail = [...s.trail.slice(-(maxCount - 1)), bubble];
  };

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { lx, ly } = toLocal(e);
    sim.current.target = { x: lx, y: ly };
    spawn(lx, ly);
  };

  const onEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { lx, ly } = toLocal(e);
    const s = sim.current;
    // Jump the blob to the entry point so it pops up under the cursor
    if (s.radius < 0.5) Object.assign(s.main, { x: lx, y: ly, vx: 0, vy: 0 });
    s.target = { x: lx, y: ly };
    s.lastSpawn = { x: lx, y: ly };
    s.hovered = true;
  };

  const onLeave = () => {
    sim.current.hovered = false;
    sim.current.lastSpawn = null;
  };

  return (
    <div
      ref={ref}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative ${CARD_RADIUS} overflow-hidden ${CARD_ASPECT} shadow-xl border transition-shadow duration-300 hover:shadow-2xl`}
      style={{ borderColor: "rgba(196,98,45,0.2)" }}
    >
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id={`${id}-sketch`} clipPathUnits="userSpaceOnUse">
            <path ref={pathRef} d="M0,0 Z" />
          </clipPath>
        </defs>
      </svg>
      <img src={HERO_PHOTO} alt="Elifsu Ateş" className="w-full h-full object-cover object-center" />
      <img
        src={HERO_SKETCH}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        style={{ clipPath: `url(#${id}-sketch)` }}
      />
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────
export default function HeroSection() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [minHeight, setMinHeight] = useState(0);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Dynamic min-height: ensures spacers always have at least MIN_SPACER_PX
  useEffect(() => {
    const calc = () => {
      if (!contentRef.current) return;
      let content = 0;
      for (const child of Array.from(contentRef.current.children)) {
        if (!(child as HTMLElement).dataset.spacer) {
          content += child.getBoundingClientRect().height;
        }
      }
      const cs = getComputedStyle(contentRef.current);
      const pad = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
      setMinHeight(pad + content + SPACER_COUNT * MIN_SPACER_PX + ARROW_AREA_PX);
    };

    calc();
    window.addEventListener("resize", calc);
    const t1 = setTimeout(calc, 300);
    const t2 = setTimeout(calc, 1000);
    return () => { window.removeEventListener("resize", calc); clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <section
      id="hero"
      className="relative h-screen flex flex-col items-center overflow-hidden px-6"
      style={{ background: "#FAF7F2", minHeight: minHeight > 0 ? `${minHeight}px` : undefined }}
    >
      {/* Background */}
      <div className="absolute pointer-events-none" style={{ inset: "-30px" }}>
        <img src={HERO_BG} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
      </div>

      {/* Floating blobs */}
      {BLOBS.map((b, i) => (
        <motion.div
          key={i}
          animate={b.animate}
          transition={{ duration: b.duration, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
          className={`absolute ${b.pos} ${b.size} ${b.shape} opacity-10 pointer-events-none`}
          style={{ background: b.color }}
        />
      ))}

      {/* Content wrapper */}
      <div ref={contentRef} className="flex-1 flex flex-col items-center pt-14 lg:pt-0 pb-12 w-full">
        {/* Spacer 1 */}
        <div className="flex-1 min-h-8" data-spacer="true" />

        {/* Name & Position */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center relative z-10"
        >
          <h1
            className="font-display leading-tight mb-4"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#1C1917", fontWeight: 300 }}
          >
            Elifsu Ateş
          </h1>
          <p className="font-mono-dm text-sm tracking-[0.2em] uppercase" style={{ color: "#C4622D" }}>
            UI/UX Designer
          </p>
        </motion.div>

        {/* Spacer 2 */}
        <div className="flex-1 min-h-8" data-spacer="true" />

        {/* Mobile photo — below 420px only */}
        <div className="relative z-10 block min-[420px]:hidden w-full max-w-[200px]">
          <div className="rounded-2xl overflow-hidden aspect-[2/3] shadow-xl border" style={{ borderColor: "rgba(196,98,45,0.2)" }}>
            <img src={HERO_PHOTO} alt="Elifsu Ateş" className="w-full h-full object-cover object-center" />
          </div>
        </div>

        {/* Cards grid — 420px+ */}
        <div className="relative z-10 hidden min-[420px]:grid grid-cols-2 min-[920px]:grid-cols-4 gap-8 max-w-md min-[920px]:max-w-6xl w-full">
          {/* About */}
          <TiltCard index={0} onClick={() => scrollTo("about")}>
            <div className={CARD_BASE} style={{ background: "linear-gradient(145deg, #1C1917 0%, #292524 100%)", borderColor: "rgba(196,98,45,0.2)" }}>
              <div>
                <div className={ICON_BOX} style={{ background: "rgba(196,98,45,0.15)" }}>
                  <span style={{ color: "#C4622D" }} className={ICON_TEXT}>✦</span>
                </div>
                <h3 className={TITLE} style={{ color: "#FAF7F2" }}>About Me</h3>
                <ResponsiveText full={CARD_TEXT.about.full} short={CARD_TEXT.about.short} className={DESC} style={{ color: "#A8A29E" }} />
              </div>
              <CardLink label="Learn more" color="#C4622D" />
            </div>
          </TiltCard>

          {/* Photo */}
          <TiltCard index={1} className="min-[920px]:mt-8">
            <SketchRevealPhoto />
          </TiltCard>

          {/* Work */}
          <TiltCard index={2} onClick={() => scrollTo("work")}>
            <div className={CARD_BASE} style={{ background: "linear-gradient(145deg, #4A6741 0%, #3A5535 100%)", borderColor: "rgba(74,103,65,0.3)" }}>
              <div>
                <div className={ICON_BOX} style={{ background: "rgba(255,255,255,0.12)" }}>
                  <span style={{ color: "#FAF7F2" }} className={ICON_TEXT}>◈</span>
                </div>
                <h3 className={TITLE} style={{ color: "#FAF7F2" }}>Work</h3>
                <ResponsiveText full={CARD_TEXT.work.full} short={CARD_TEXT.work.short} className={DESC} style={{ color: "rgba(250,247,242,0.7)" }} />
              </div>
              {/* Chips at 1250px+ */}
              <div className="hidden min-[1250px]:flex flex-wrap gap-2">
                {WORK_TAGS.map((tag) => (
                  <span key={tag} className="font-mono-dm text-[10px] tracking-wide px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.12)", color: "#FAF7F2" }}>
                    {tag}
                  </span>
                ))}
              </div>
              {/* "View all" below 1250px */}
              <div className="min-[1250px]:hidden">
                <CardLink label="View all" color="#FAF7F2" />
              </div>
            </div>
          </TiltCard>

          {/* Writing */}
          <TiltCard index={3} onClick={() => scrollTo("writing")} className="min-[920px]:mt-4">
            <div className={CARD_BASE} style={{ background: "linear-gradient(145deg, #FAF7F2 0%, #F5EDE6 100%)", borderColor: "rgba(196,98,45,0.15)" }}>
              <div>
                <div className={ICON_BOX} style={{ background: "rgba(196,98,45,0.1)" }}>
                  <span style={{ color: "#C4622D" }} className={ICON_TEXT}>✎</span>
                </div>
                <h3 className={TITLE} style={{ color: "#1C1917" }}>Writing & Videos</h3>
                <ResponsiveText full={CARD_TEXT.writing.full} short={CARD_TEXT.writing.short} className={DESC} style={{ color: "#6B6560" }} />
              </div>
              <CardLink label="Read & Watch" color="#C4622D" />
            </div>
          </TiltCard>
        </div>

        {/* Spacer 3 */}
        <div className="flex-1 min-h-8" data-spacer="true" />

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1 }}
          className="relative z-10 flex flex-row flex-wrap items-center justify-center gap-4"
        >
          <a
            href={RESUME_URL}
            download
            className="font-mono-dm text-sm tracking-wide px-8 py-3.5 rounded-full transition-all duration-300 hover:scale-105"
            style={{ background: "#C4622D", color: "#FAF7F2" }}
          >
            Download Resume
          </a>
          <button
            onClick={() => scrollTo("contact")}
            className="font-mono-dm text-sm tracking-wide px-8 py-3.5 rounded-full transition-all duration-300 hover:scale-105"
            style={{ background: "transparent", color: "#1C1917", border: "1px solid rgba(28,25,23,0.2)" }}
          >
            Get in Touch
          </button>
        </motion.div>

        {/* Spacer 4 */}
        <div className="flex-1 min-h-8" data-spacer="true" />
      </div>

      {/* Scroll arrow */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={() => scrollTo("about")}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-0 cursor-pointer"
        aria-label="Scroll down"
      >
        <motion.svg
          animate={{ y: [0, 6, 0], opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          width="22" height="13" viewBox="0 0 22 13" fill="none" className="block"
        >
          <path d="M1 1.5L11 10.5L21 1.5" stroke="#C4622D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
        <motion.svg
          animate={{ y: [0, 6, 0], opacity: [0.15, 0.55, 0.15] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          width="22" height="13" viewBox="0 0 22 13" fill="none" className="block -mt-1"
        >
          <path d="M1 1.5L11 10.5L21 1.5" stroke="#C4622D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </motion.button>
    </section>
  );
}
