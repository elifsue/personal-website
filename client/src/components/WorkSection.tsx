/* ============================================================
   WORK SECTION — Organic Modernism
   Large project cards with image, staggered reveal on scroll
   Terracotta hover overlays, organic shape accents
   ============================================================ */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLocation } from "wouter";

const KIDDIWEAR_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/WbmkfKudAvPBKcWy.png";
const WP_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/kiaoSegjEvwENGTh.png";

const projects = [
  {
    id: "01",
    title: "Kiddiwear",
    subtitle: "Peer-to-peer Marketplace Website",
    tags: ["UX/UI Design", "Marketplace", "Web Design"],
    year: "2026",
    description:
      "A dedicated UK marketplace for buying and selling pre-loved children's clothing. Developed as part of the Google UX Design Professional Certificate, this project follows the full Design Thinking methodology — from simulated user research to usability testing and iterative design.",
    outcome: "Google UX Design Certificate · Full design system · Usability tested",
    image: KIDDIWEAR_IMG,
    color: "#BF5836",
    bgColor: "#F5EDE6",
    link: "/kiddiwear",
    github: "https://github.com/elifsue/kiddiwear",
    links: [
      { label: "Interactive Prototype", url: "https://elifsue.github.io/kiddiwear/", style: { background: "#BF5836", color: "#FAF7F2" } },
      { label: "Behance", url: "https://www.behance.net/gallery/250957329/Childrens-Clothing-Marketplace-Website-Design-UXUI", style: { background: "#4A6FA5", color: "#FFFFFF" } },
      { label: "Figma", url: "https://www.figma.com/design/IQmFfsL8KwUqPk3PiW7dMH/Kiddiwear?node-id=3082-18790&t=mBVyGv0HCP6J71tN-1", style: { background: "#7B5EA7", color: "#FFFFFF" } },
      { label: "GitHub", url: "https://github.com/elifsue/kiddiwear", style: { background: "#1C1917", color: "#FAF7F2" } },
    ],
  },
  {
    id: "02",
    title: "Wireframe Prototyper Skill",
    subtitle: "Claude Code Custom Skill",
    tags: ["Claude Code", "Prototyping", "Automation"],
    year: "2026",
    description:
      "A reusable Claude Code Skill that streamlines the end-to-end design workflow, from structured discovery and competitor research to generating a WCAG-compliant design system and building interactive low-fidelity wireframes or high-fidelity prototypes with real navigation, exportable screens, and a transferable design system to Figma.",
    outcome: "Open source · Prompt-driven · Rapid prototyping",
    image: WP_IMG,
    color: "#BF5836",
    bgColor: "#F5EDE6",
    link: "/wireframe-prototyper",
    github: "https://github.com/elifsue/wireframe-prototyper-skill",
    links: [
      { label: "Medium", url: "https://medium.com/@elifsue", style: { background: "#FFFFFF", color: "#1C1917", border: "1px solid #1C1917" } },
      { label: "GitHub", url: "https://github.com/elifsue/wireframe-prototyper-skill", style: { background: "#1C1917", color: "#FAF7F2" } },
    ],
  },
];

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [, setLocation] = useLocation();

  const isEven = index % 2 === 0;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
        !isEven ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden rounded-3xl cursor-pointer group"
        style={{ background: project.bgColor }}
        onClick={() => project.link && setLocation(project.link)}
      >
        <div className="aspect-[8/5] overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Hover overlay with gradient */}
        <div
          className="absolute inset-0 flex items-end justify-end p-6 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(to top, ${project.color}99 0%, ${project.color}33 40%, transparent 70%)` }}
        >
          <span className="font-display text-white text-lg italic px-4 py-2 rounded-full" style={{ background: "rgba(28, 25, 23, 0.6)" }}>View Project →</span>
        </div>
      </div>

      {/* Content */}
      <div className={isEven ? "" : "lg:pr-8"}>
        <div className="flex items-center gap-3 mb-4">
          <span
            className="font-mono-dm text-xs tracking-widest uppercase"
            style={{ color: project.color }}
          >
            {project.year}
          </span>
          <div className="w-6 h-px" style={{ background: project.color }} />
        </div>

        <h3
          className="font-display mb-2 leading-tight"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#1C1917", fontWeight: 300 }}
        >
          {project.title}
        </h3>
        <p
          className="font-mono-dm text-sm tracking-wide mb-5"
          style={{ color: project.color }}
        >
          {project.subtitle}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ background: project.bgColor, color: project.color }}
            >
              {tag}
            </span>
          ))}
        </div>

        <p
          className="text-sm leading-relaxed mb-6"
          style={{ color: "#6B6560" }}
        >
          {project.description}
        </p>

        <div
          className="flex items-center gap-2 text-xs font-medium px-4 py-3 rounded-xl"
          style={{ background: project.bgColor, color: project.color }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
          <span>{project.outcome}</span>
        </div>

        {/* External links */}
        <div className="flex flex-wrap gap-2 mt-5">
          {project.links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full font-mono-dm text-xs tracking-wide transition-all duration-300 hover:scale-105"
              style={link.style}
            >
              {link.label === "Medium" && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
                </svg>
              )}
              {link.label === "GitHub" && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              )}
              {link.label === "Interactive Prototype" && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              )}
              {link.label === "Behance" && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/>
                </svg>
              )}
              {link.label === "Figma" && (
                <svg width="14" height="14" viewBox="0 0 38 57" fill="currentColor">
                  <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z"/>
                  <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z"/>
                  <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z"/>
                  <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z"/>
                  <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z"/>
                </svg>
              )}
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default function WorkSection() {
  return (
    <section
      id="work"
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background: "#F5F0EA" }}
    >
      {/* Decorative blob */}
      <div
        className="absolute top-0 right-0 w-64 h-64 blob-1 opacity-10 -z-0"
        style={{ background: "#C4622D", transform: "translate(30%, -30%)" }}
      />

      <div className="px-8 lg:px-32">
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
              Selected Work
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display leading-tight"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#1C1917", fontWeight: 300 }}
          >
            Design in{" "}
            <em style={{ color: "#C4622D" }}>Action</em>
          </motion.h2>
        </div>

        {/* Projects */}
        <div className="flex flex-col gap-24">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
