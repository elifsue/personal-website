/* ============================================================
   SKILLS SECTION — Organic Modernism
   Asymmetric grid of skill categories with organic shape accents
   Warm sand background, sage and terracotta accents
   ============================================================ */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const skillGroups = [
  {
    category: "Design",
    icon: "✦",
    color: "#C4622D",
    bg: "#F5EDE6",
    skills: [
      "UI Design",
      "UX Research",
      "Interaction Design",
      "Design Systems",
      "Wireframing",
      "Prototyping",
      "Visual Design",
      "Motion Design",
    ],
  },
  {
    category: "Tools",
    icon: "◈",
    color: "#4A6741",
    bg: "#EAF0E8",
    skills: [
      "Figma",
      "Adobe XD",
      "Sketch",
      "Principle",
      "Framer",
      "Zeplin",
      "Miro",
      "Notion",
      "Claude Code",
      "Google Stitch",
    ],
  },
  {
    category: "Research",
    icon: "◎",
    color: "#8B6914",
    bg: "#F5EFE0",
    skills: [
      "User Interviews",
      "Usability Testing",
      "A/B Testing",
      "Heuristic Analysis",
      "Journey Mapping",
      "Persona Creation",
    ],
  },
  {
    category: "Technical",
    icon: "⟡",
    color: "#1C1917",
    bg: "#E8DDD0",
    skills: [
      "Python",
      "JavaScript",
      "TypeScript",
      "HTML & CSS",
      "React",
      "Tailwind CSS",
      "SQL",
      "Accessibility (WCAG)",
      "Responsive Design",
      "Git",
      "Vibe Coding",
    ],
  },
];

const processSteps = [
  {
    number: "01",
    title: "Discover",
    desc: "Deep-dive research, stakeholder interviews, and competitive analysis to understand the problem space.",
  },
  {
    number: "02",
    title: "Define",
    desc: "Synthesise insights into clear problem statements, personas, and measurable success criteria.",
  },
  {
    number: "03",
    title: "Design",
    desc: "Rapid ideation, wireframes, and high-fidelity prototypes — iterated with real user feedback.",
  },
  {
    number: "04",
    title: "Deliver",
    desc: "Pixel-perfect handoff with detailed specs, design tokens, and developer collaboration.",
  },
];

export default function SkillsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="skills"
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background: "#FAF7F2" }}
    >
      {/* Decorative elements */}
      <motion.div
        animate={{ rotate: [0, -360] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 left-8 w-32 h-32 blob-2 opacity-10 hidden lg:block"
        style={{ background: "#4A6741" }}
      />

      <div className="pl-8 lg:pl-32 pr-8 lg:pr-16">
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
              Skills & Process
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
            The craft behind
            <br />
            <em style={{ color: "#C4622D" }}>the work</em>
          </motion.h2>
        </div>

        {/* Skills grid */}
        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-24"
        >
          {skillGroups.map((group, i) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="p-6 rounded-3xl"
              style={{ background: group.bg }}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xl" style={{ color: group.color }}>
                  {group.icon}
                </span>
                <span
                  className="font-display text-xl font-medium"
                  style={{ color: "#1C1917" }}
                >
                  {group.category}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105"
                    style={{
                      background: "rgba(250,247,242,0.8)",
                      color: group.color,
                      border: `1px solid ${group.color}30`,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Process */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="w-8 h-px" style={{ background: "#4A6741" }} />
            <span
              className="font-mono-dm text-xs tracking-[0.25em] uppercase"
              style={{ color: "#4A6741" }}
            >
              My Design Process
            </span>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative"
              >
                {/* Connector line */}
                {i < processSteps.length - 1 && (
                  <div
                    className="absolute top-5 left-full w-full h-px hidden lg:block"
                    style={{ background: "rgba(196,98,45,0.2)", zIndex: 0 }}
                  />
                )}
                <div
                  className="font-mono-dm text-3xl font-light mb-4"
                  style={{ color: "rgba(196,98,45,0.25)" }}
                >
                  {step.number}
                </div>
                <h4
                  className="font-display text-2xl font-medium mb-3"
                  style={{ color: "#1C1917" }}
                >
                  {step.title}
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: "#6B6560" }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
