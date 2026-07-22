/* ============================================================
   CASE STUDY FOOTER — Shared CTA footer for all case study pages
   Shows other projects as entry points + contact information
   ============================================================ */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "wouter";

const CHARACTERPAD_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/VsSbeosJoSORdPJI.png";
const KIDDIWEAR_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/vteVhNcoduGcHcRE.png";
const WP_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/kiaoSegjEvwENGTh.png";

const allProjects = [
  {
    slug: "character-pad",
    title: "Character Pad",
    subtitle: "Android Unicode Characters App",
    image: CHARACTERPAD_IMG,
    link: "/character-pad",
    color: "#E67E22",
  },
  {
    slug: "kiddiwear",
    title: "Kiddiwear",
    subtitle: "Peer-to-peer Marketplace Website",
    image: KIDDIWEAR_IMG,
    link: "/kiddiwear",
    color: "#BF5836",
  },
  {
    slug: "wireframe-prototyper",
    title: "Wireframe Prototyper Skill",
    subtitle: "Claude Code Custom Skill",
    image: WP_IMG,
    link: "/wireframe-prototyper",
    color: "#7B5EA7",
  },
];

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

interface CaseStudyFooterProps {
  currentProject: "character-pad" | "kiddiwear" | "wireframe-prototyper";
}

export default function CaseStudyFooter({ currentProject }: CaseStudyFooterProps) {
  const otherProjects = allProjects.filter((p) => p.slug !== currentProject);

  return (
    <div className="px-8 lg:px-32 py-20" style={{ background: "#1C1917" }}>
      {/* Other Projects */}
      <Section>
        <h2 className="font-display text-2xl md:text-3xl mb-10 text-center" style={{ color: "#FAF7F2", fontWeight: 300 }}>
          Other <em style={{ color: "#BF5836" }}>Projects</em>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {otherProjects.map((project, index) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
            >
              <Link href={project.link}>
                <div
                  className="relative overflow-hidden rounded-3xl cursor-pointer group transition-all duration-300 hover:scale-[1.02]"
                  style={{ background: "#262626" }}
                >
                  <div className="aspect-[8/5] overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="relative p-5">
                    <h3 className="font-display text-lg mb-1" style={{ color: "#FAF7F2", fontWeight: 400 }}>
                      {project.title}
                    </h3>
                    <p className="font-mono-dm text-xs tracking-wide" style={{ color: "#A8A29E" }}>
                      {project.subtitle}
                    </p>
                    {/* Hover overlay on title/description only */}
                    <div
                      className="absolute inset-0 rounded-b-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: "rgba(255, 255, 255, 0.15)" }}
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Contact CTA */}
      <Section className="mt-20 text-center">
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
