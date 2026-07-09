/* ============================================================
   CASE STUDY FOOTER — Shared CTA footer for all case study pages
   ============================================================ */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function CaseStudyFooter() {
  return (
    <div className="px-8 lg:px-32 py-20 text-center" style={{ background: "#1C1917" }}>
      <Section>
        <h2 className="font-display text-2xl md:text-3xl mb-6" style={{ color: "#FAF7F2", fontWeight: 300 }}>
          Want to start working on your next project with me?
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="mailto:hello@elifsuates.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-mono-dm text-sm tracking-wide transition-all duration-300 hover:scale-105"
            style={{ background: "#BF5836", color: "#FAF7F2" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            Send a hello@elifsuates.com
          </a>
          <a
            href="https://www.linkedin.com/in/elifsu-ates/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-mono-dm text-sm tracking-wide transition-all duration-300 hover:scale-105"
            style={{ background: "#0A66C2", color: "#FFFFFF" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect x="2" y="9" width="4" height="12"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
            Message on LinkedIn
          </a>
        </div>
      </Section>
    </div>
  );
}
