/* ============================================================
   HERO SECTION — Interactive Card Layout
   Responsive tilted cards with 3D hover/press interactions
   Breakpoints: <420px photo only | 420-919px 2×2 grid | 920px+ 4 cols
   ============================================================ */

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// ─── Constants ───────────────────────────────────────────────
const HERO_PHOTO = `${import.meta.env.BASE_URL}images/elifsu-portrait.jpg`;
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
            <div className={`${CARD_RADIUS} overflow-hidden ${CARD_ASPECT} shadow-xl border transition-shadow duration-300 hover:shadow-2xl`} style={{ borderColor: "rgba(196,98,45,0.2)" }}>
              <img src={HERO_PHOTO} alt="Elifsu Ateş" className="w-full h-full object-cover object-center" />
            </div>
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
