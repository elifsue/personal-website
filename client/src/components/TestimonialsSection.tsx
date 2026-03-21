/* ============================================================
   TESTIMONIALS SECTION — Organic Modernism
   Full-width statement section with rotating quotes
   Dark charcoal background, cream text, terracotta accents
   All quotes rendered in DOM simultaneously so the container
   height is always determined by the tallest quote.
   The tallest index is determined dynamically via ResizeObserver.
   ============================================================ */

import { motion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";

const testimonials = [
  {
    quote:
      "Elifsu transformed our product from a confusing mess into something our users genuinely love. Her ability to translate complex user needs into elegant, intuitive interfaces is remarkable.",
    author: "Marcus Chen",
    role: "CEO, FinFlow",
    initial: "MC",
  },
  {
    quote:
      "Working with Elifsu was a revelation. She didn't just design screens — she redesigned how we think about our users. The research depth she brought to the project was extraordinary.",
    author: "Priya Sharma",
    role: "Product Lead, Serene Soul",
    initial: "PS",
  },
  {
    quote:
      "Elifsu's design system became the backbone of our entire product team. The documentation, the components, the tokens — everything was crafted with such care and precision.",
    author: "Tom Whitfield",
    role: "Engineering Lead, Terra Wear",
    initial: "TW",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [tallestIndex, setTallestIndex] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Measure all rendered quote heights and find the tallest one
  const measureHeights = useCallback(() => {
    const heights = itemRefs.current.map((el) => el?.scrollHeight ?? 0);
    const maxHeight = Math.max(...heights);
    const idx = heights.indexOf(maxHeight);
    setTallestIndex(idx >= 0 ? idx : 0);
  }, []);

  // Measure on mount and whenever the window resizes (font load, reflow, etc.)
  useEffect(() => {
    measureHeights();
    window.addEventListener("resize", measureHeights);
    return () => window.removeEventListener("resize", measureHeights);
  }, [measureHeights]);

  // Auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background: "#1C1917" }}
    >
      {/* Decorative blobs */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], rotate: [0, 15, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-72 h-72 blob-1 opacity-5 pointer-events-none"
        style={{ background: "#C4622D", transform: "translate(30%, -30%)" }}
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-0 left-0 w-48 h-48 blob-2 opacity-5 pointer-events-none"
        style={{ background: "#4A6741", transform: "translate(-30%, 30%)" }}
      />

      <div className="pl-8 lg:pl-32 pr-8 lg:pr-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-12"
        >
          <div className="w-8 h-px" style={{ background: "#C4622D" }} />
          <span
            className="font-mono-dm text-xs tracking-[0.25em] uppercase"
            style={{ color: "#C4622D" }}
          >
            Kind Words
          </span>
        </motion.div>

        <div className="max-w-3xl">
          {/* Large quote mark */}
          <div
            className="font-display text-8xl leading-none mb-6 select-none"
            style={{ color: "rgba(196,98,45,0.3)", fontWeight: 300 }}
          >
            "
          </div>

          {/*
            All quotes rendered in the DOM at all times.
            - tallestIndex quote: position relative → dynamically sets the container height
            - All others: position absolute overlays → do not affect layout height
            - Active quote: opacity 1, pointer-events auto, visible
            - Inactive quotes: opacity 0, pointer-events none, hidden
          */}
          <div className="relative">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                ref={(el) => { itemRefs.current[i] = el; }}
                aria-hidden={i !== current}
                animate={{
                  opacity: i === current ? 1 : 0,
                  y: i === current ? 0 : 20,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{
                  position: i === tallestIndex ? "relative" : "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  pointerEvents: i === current ? "auto" : "none",
                  visibility: i === current ? "visible" : "hidden",
                }}
              >
                <p
                  className="font-display text-2xl lg:text-3xl leading-relaxed mb-8 font-light"
                  style={{ color: "rgba(250,247,242,0.9)" }}
                >
                  {t.quote}
                </p>
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "#C4622D" }}
                  >
                    <span className="font-display text-white text-sm font-medium">
                      {t.initial}
                    </span>
                  </div>
                  <div>
                    <div
                      className="font-medium text-sm"
                      style={{ color: "rgba(250,247,242,0.9)" }}
                    >
                      {t.author}
                    </div>
                    <div
                      className="font-mono-dm text-xs tracking-wide"
                      style={{ color: "rgba(250,247,242,0.4)" }}
                    >
                      {t.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex gap-2 mt-10">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === current ? "24px" : "8px",
                  height: "8px",
                  background: i === current ? "#C4622D" : "rgba(250,247,242,0.2)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
