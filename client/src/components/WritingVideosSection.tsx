/* ============================================================
   WRITING & VIDEOS SECTION — Organic Modernism
   Editorial-style layout with featured video and article
   ============================================================ */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function WritingVideosSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="writing"
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background: "#1C1917" }}
    >
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

      <div className="px-8 lg:px-32 relative z-10" ref={ref}>
        {/* Section header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-8 h-px" style={{ background: "#C4622D" }} />
            <span
              className="font-mono-dm text-xs tracking-[0.25em] uppercase"
              style={{ color: "#C4622D" }}
            >
              Writing & Videos
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display leading-tight"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#FAF7F2", fontWeight: 300 }}
          >
            Thoughts &{" "}
            <em style={{ color: "#C4622D" }}>Explorations</em>
          </motion.h2>
        </div>

        {/* Article card */}
        <motion.a
          href="https://medium.com/@elifsue/design-with-context-a-claude-skill-that-studies-competitors-and-builds-your-prototype-e4cdd8cb7519"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="group block p-8 lg:p-10 rounded-2xl transition-all duration-400 hover:shadow-2xl"
          style={{ background: "rgba(250,247,242,0.04)", border: "1px solid rgba(250,247,242,0.08)" }}
          whileHover={{ borderColor: "rgba(196,98,45,0.4)" }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
            {/* Left: icon + metadata */}
            <div className="shrink-0 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "#1C1917", border: "1px solid rgba(250,247,242,0.15)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#FAF7F2">
                  <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
                </svg>
              </div>
              <div>
                <span className="font-mono-dm text-xs tracking-widest uppercase block" style={{ color: "#C4622D" }}>
                  Article
                </span>
                <span className="font-mono-dm text-xs" style={{ color: "rgba(250,247,242,0.5)" }}>
                  Medium
                </span>
              </div>
            </div>

            {/* Center: title + description */}
            <div className="flex-1">
              <h3
                className="font-display text-xl lg:text-2xl mb-2 leading-snug transition-colors duration-300 group-hover:text-[#C4622D]"
                style={{ color: "#FAF7F2", fontWeight: 400 }}
              >
                Design with Context: A Claude Skill That Studies Competitors and Builds Your Prototype
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(250,247,242,0.6)" }}>
                How I built a reusable Claude Code Skill that performs competitor analysis and generates interactive prototypes with accessible design systems.
              </p>
            </div>

            {/* Right: arrow */}
            <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-[#C4622D]"
              style={{ background: "rgba(250,247,242,0.08)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FAF7F2" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </div>
          </div>
        </motion.a>

        {/* Divider */}
        <div className="w-full h-px my-12" style={{ background: "rgba(196,98,45,0.2)" }} />

        {/* Video — constrained width */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl" style={{ border: "1px solid rgba(196,98,45,0.2)" }}>
            <iframe
              src="https://www.youtube.com/embed/EIryl8x3PCI"
              title="Wireframe Prototyper Skill Demo"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="mt-5 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h3 className="font-display text-lg lg:text-xl mb-1" style={{ color: "#FAF7F2", fontWeight: 400 }}>
                Wireframe Prototyper Skill Demo
              </h3>
              <p className="text-sm" style={{ color: "rgba(250,247,242,0.6)" }}>
                A walkthrough of the Wireframe Prototyper Skill in action — from prompt to interactive prototype.
              </p>
            </div>
            <a
              href="https://www.youtube.com/watch?v=EIryl8x3PCI"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono-dm text-xs tracking-wide transition-all duration-300 hover:scale-105"
              style={{ background: "rgba(250,247,242,0.1)", color: "#FAF7F2", border: "1px solid rgba(250,247,242,0.15)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#FF0000" }}>
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              Watch on YouTube
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
