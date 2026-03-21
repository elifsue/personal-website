/* ============================================================
   404 PAGE — Organic Modernism
   Interactive blob-shaped "404" digits that react to mouse movement,
   floating organic shapes, poetic copy, and a smooth CTA back home.
   ============================================================ */

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

/* ---------- tiny helpers ---------- */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ---------- floating particle ---------- */
function FloatingParticle({
  size,
  color,
  blobClass,
  x,
  y,
  duration,
  delay,
}: {
  size: number;
  color: string;
  blobClass: string;
  x: string;
  y: string;
  duration: number;
  delay: number;
}) {
  return (
    <motion.div
      className={`absolute ${blobClass} pointer-events-none`}
      style={{ width: size, height: size, background: color, left: x, top: y }}
      animate={{
        y: [0, -20, 0, 15, 0],
        x: [0, 10, -8, 5, 0],
        rotate: [0, 15, -10, 8, 0],
        scale: [1, 1.08, 0.95, 1.04, 1],
      }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

/* ---------- interactive blob digit ---------- */
function BlobDigit({
  digit,
  color,
  blobClass,
  mouseX,
  mouseY,
  index,
}: {
  digit: string;
  color: string;
  blobClass: string;
  mouseX: ReturnType<typeof useSpring>;
  mouseY: ReturnType<typeof useSpring>;
  index: number;
}) {
  // Each digit reacts to mouse with a slightly different offset
  const offsetFactor = (index - 1) * 0.6; // -0.6, 0, 0.6
  const x = useTransform(mouseX, (v) => v * 0.04 * (1 + offsetFactor));
  const y = useTransform(mouseY, (v) => v * 0.04 * (1 + offsetFactor));
  const rotate = useTransform(mouseX, (v) => v * 0.015 * (index === 1 ? -1 : 1));

  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ x, y, rotate }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 + index * 0.15, ease: "easeOut" }}
    >
      {/* Blob background */}
      <motion.div
        className={`absolute ${blobClass}`}
        style={{ width: "100%", height: "100%", background: color }}
        animate={{
          borderRadius: [
            "60% 40% 30% 70% / 60% 30% 70% 40%",
            "40% 60% 70% 30% / 40% 50% 60% 50%",
            "70% 30% 50% 50% / 30% 60% 40% 70%",
            "60% 40% 30% 70% / 60% 30% 70% 40%",
          ],
        }}
        transition={{ duration: 8 + index * 2, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Digit */}
      <span
        className="relative z-10 font-display select-none"
        style={{
          fontSize: "clamp(5rem, 14vw, 12rem)",
          fontWeight: 300,
          color: "#FAF7F2",
          lineHeight: 1,
          textShadow: "0 2px 20px rgba(0,0,0,0.08)",
        }}
      >
        {digit}
      </span>
    </motion.div>
  );
}

/* ---------- main component ---------- */
export default function NotFound() {
  const [, setLocation] = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  const mouseX = useSpring(rawMouseX, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(rawMouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      rawMouseX.set(e.clientX - rect.width / 2);
      rawMouseY.set(e.clientY - rect.height / 2);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [rawMouseX, rawMouseY]);

  // Wandering quote — cycles through poetic lines
  const quotes = [
    "This page wandered off like a leaf in the wind.",
    "Some paths lead to beautiful nowhere.",
    "Even lost pages have stories to tell.",
    "The best detours lead back home.",
  ];
  const [quoteIdx, setQuoteIdx] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setQuoteIdx((i) => (i + 1) % quotes.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const digits = [
    { digit: "4", color: "#C4622D", blobClass: "blob-1" },
    { digit: "0", color: "#4A5D4F", blobClass: "blob-2" },
    { digit: "4", color: "#C4622D", blobClass: "blob-3" },
  ];

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6"
      style={{ background: "#FAF7F2" }}
    >
      {/* Floating background particles */}
      <FloatingParticle size={120} color="rgba(196,98,45,0.08)" blobClass="blob-1" x="8%" y="12%" duration={14} delay={0} />
      <FloatingParticle size={80} color="rgba(74,93,79,0.08)" blobClass="blob-2" x="78%" y="8%" duration={18} delay={1} />
      <FloatingParticle size={60} color="rgba(196,98,45,0.06)" blobClass="blob-3" x="85%" y="65%" duration={12} delay={2} />
      <FloatingParticle size={100} color="rgba(74,93,79,0.06)" blobClass="blob-1" x="5%" y="70%" duration={16} delay={0.5} />
      <FloatingParticle size={40} color="rgba(196,98,45,0.10)" blobClass="blob-2" x="50%" y="85%" duration={10} delay={3} />
      <FloatingParticle size={50} color="rgba(232,221,208,0.4)" blobClass="blob-3" x="30%" y="20%" duration={20} delay={1.5} />
      <FloatingParticle size={35} color="rgba(74,93,79,0.10)" blobClass="blob-1" x="65%" y="35%" duration={15} delay={2.5} />

      {/* Subtle grid lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#C4622D 1px, transparent 1px), linear-gradient(90deg, #C4622D 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Top-left EA monogram */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-8 left-8 lg:left-12 flex items-center gap-3 z-20"
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: "#C4622D" }}
        >
          <span className="font-display text-white font-semibold text-sm">EA</span>
        </div>
        <span className="font-display text-lg font-light hidden sm:inline" style={{ color: "#1C1917" }}>
          Elifsu Ateş
        </span>
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-8 h-px" style={{ background: "#C4622D" }} />
          <span className="font-mono-dm text-xs tracking-[0.25em] uppercase" style={{ color: "#C4622D" }}>
            Page Not Found
          </span>
          <div className="w-8 h-px" style={{ background: "#C4622D" }} />
        </motion.div>

        {/* Blob digits */}
        <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 mb-10">
          {digits.map((d, i) => (
            <div
              key={i}
              className="relative"
              style={{
                width: "clamp(6rem, 16vw, 13rem)",
                height: "clamp(6rem, 16vw, 13rem)",
              }}
            >
              <BlobDigit
                digit={d.digit}
                color={d.color}
                blobClass={d.blobClass}
                mouseX={mouseX}
                mouseY={mouseY}
                index={i}
              />
            </div>
          ))}
        </div>

        {/* Rotating quote */}
        <div className="relative h-8 mb-6 overflow-hidden">
          {quotes.map((q, i) => (
            <motion.p
              key={i}
              className="absolute inset-0 text-base font-light italic"
              style={{ color: "#6B6560" }}
              initial={false}
              animate={{
                opacity: i === quoteIdx ? 1 : 0,
                y: i === quoteIdx ? 0 : 10,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              "{q}"
            </motion.p>
          ))}
        </div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-base leading-relaxed mb-10 max-w-md"
          style={{ color: "#6B6560" }}
        >
          Oops — I couldn't find the page you were looking for.
          <br />
          Let me take you back home.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="flex flex-wrap gap-4 items-center justify-center"
        >
          <button
            onClick={() => setLocation("/")}
            className="group relative overflow-hidden px-8 py-4 rounded-full font-medium text-sm tracking-wide transition-all duration-300"
            style={{ background: "#C4622D", color: "#FAF7F2" }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Take Me Home
            </span>
            <div
              className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
              style={{ background: "#1C1917" }}
            />
          </button>


        </motion.div>
      </div>

      {/* Bottom decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 1, ease: "easeOut" }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 h-px w-48 origin-center"
        style={{ background: "linear-gradient(90deg, transparent, #C4622D, transparent)" }}
      />

      {/* Bottom-right coordinates — playful detail */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute bottom-8 right-8 lg:right-12 font-mono-dm text-xs tracking-wider"
        style={{ color: "rgba(196,98,45,0.4)" }}
      >
        404 · LOST IN DESIGN
      </motion.div>
    </div>
  );
}
