/* ============================================================
   HERO SECTION — Organic Modernism
   Asymmetric layout: large display text left, organic blob art right
   Background: Cream #FAF7F2 with floating terracotta/sage blobs
   Text: Dark charcoal on light background
   ============================================================ */

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const HERO_BG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663332337268/WbQQmPwVcwFPCnDRdrdZHR/hero-blob-bg-HVgkH9W2uPs5UfZMUKkgHH.webp";

export default function HeroSection() {
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!blobRef.current) return;
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      blobRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex overflow-hidden"
      style={{ background: "#FAF7F2" }}
    >
      {/* Decorative blob background image */}
      <div
        ref={blobRef}
        className="absolute inset-0 transition-transform duration-700 ease-out pointer-events-none"
        style={{ willChange: "transform" }}
      >
        <img
          src={HERO_BG}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          style={{ objectPosition: "center" }}
        />
      </div>

      {/* Floating decorative elements */}
      <motion.div
        animate={{ y: [0, -18, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-24 right-16 w-16 h-16 blob-1 opacity-30 hidden lg:block"
        style={{ background: "#C4622D" }}
      />
      <motion.div
        animate={{ y: [0, 14, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-32 right-48 w-10 h-10 blob-2 opacity-25 hidden lg:block"
        style={{ background: "#4A6741" }}
      />
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/2 right-8 w-6 h-6 rounded-full opacity-20 hidden lg:block"
        style={{ background: "#C4622D" }}
      />

      {/* Main content — two-zone layout: centred top area + fixed bottom strip */}
      <div className="relative z-10 w-full min-h-screen flex flex-col pl-8 lg:pl-32 pr-8 lg:pr-16 pt-20 lg:pt-0">
        {/* Zone 1: grows to fill all space above the bottom strip, centres content vertically */}
        <div className="flex-1 flex flex-col justify-center max-w-3xl py-8">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-8 h-px" style={{ background: "#C4622D" }} />
            <span className="font-mono-dm text-xs tracking-[0.25em] uppercase" style={{ color: "#C4622D" }}>
              UI/UX Designer
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
            className="font-display leading-none mb-6"
            style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)", color: "#1C1917", fontWeight: 300, letterSpacing: "-0.02em" }}
          >
            Crafting
            <br />
            <em style={{ color: "#C4622D", fontStyle: "italic" }}>human-first</em>
            <br />
            experiences.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
            className="text-lg leading-relaxed max-w-md mb-10"
            style={{ color: "#6B6560", fontWeight: 300 }}
          >
            I'm <strong style={{ color: "#1C1917", fontWeight: 500 }}>Elifsu Ateş</strong> — a UI/UX designer
            who bridges the gap between beautiful interfaces and intuitive functionality.
            Based in London, designing for the world.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
            className="flex flex-wrap gap-4 items-center"
          >
            <button
              onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
              className="group relative overflow-hidden px-8 py-4 rounded-full font-medium text-sm tracking-wide transition-all duration-300"
              style={{ background: "#C4622D", color: "#FAF7F2" }}
            >
              <span className="relative z-10">View My Work</span>
              <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                style={{ background: "#1C1917" }} />
            </button>
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-4 rounded-full font-medium text-sm tracking-wide border transition-all duration-300 hover:border-opacity-100"
              style={{ borderColor: "#C4622D", color: "#C4622D", background: "transparent" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "#C4622D";
                (e.currentTarget as HTMLButtonElement).style.color = "#FAF7F2";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "#C4622D";
              }}
            >
              Get in Touch
            </button>
          </motion.div>
        </div>

        {/* Zone 2: bottom strip — stats + scroll arrow, always at the bottom, never overlaps Zone 1 */}
        <div className="flex flex-col items-start gap-6 pb-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="flex gap-10 pt-6 border-t w-full max-w-3xl"
            style={{ borderColor: "rgba(196,98,45,0.15)" }}
          >
            {[
              { value: "4+", label: "Years Experience" },
              { value: "20+", label: "Projects Shipped" },
              { value: "8", label: "Happy Clients" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="font-display text-3xl font-light" style={{ color: "#C4622D" }}>
                  {stat.value}
                </span>
                <span className="font-mono-dm text-xs tracking-wider uppercase" style={{ color: "#6B6560" }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Scroll indicator — animated double chevron, centred horizontally */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
            className="w-full flex flex-col items-center gap-0 cursor-pointer"
            aria-label="Scroll down"
          >
            <motion.svg
              animate={{ y: [0, 6, 0], opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              width="22" height="13" viewBox="0 0 22 13" fill="none"
              className="block"
            >
              <path d="M1 1.5L11 10.5L21 1.5" stroke="#C4622D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
            <motion.svg
              animate={{ y: [0, 6, 0], opacity: [0.15, 0.55, 0.15] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              width="22" height="13" viewBox="0 0 22 13" fill="none"
              className="block -mt-1"
            >
              <path d="M1 1.5L11 10.5L21 1.5" stroke="#C4622D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
