/* ============================================================
   WORK SECTION — Organic Modernism
   Large project cards with image, staggered reveal on scroll
   Terracotta hover overlays, organic shape accents
   ============================================================ */

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const FINTECH_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663332337268/WbQQmPwVcwFPCnDRdrdZHR/project-fintech-aA3WZXPnaGvpUd9VyeBaHy.webp";
const WELLNESS_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663332337268/WbQQmPwVcwFPCnDRdrdZHR/project-wellness-DjeYqW5e8EdLRut2GnXrHU.webp";
const ECOMMERCE_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663332337268/WbQQmPwVcwFPCnDRdrdZHR/project-ecommerce-fHogwpYRpyaUhbnKmcP9XR.webp";

const projects = [
  {
    id: "01",
    title: "FinFlow",
    subtitle: "Personal Finance App",
    tags: ["Mobile App", "Fintech", "iOS & Android"],
    year: "2024",
    description:
      "A complete redesign of a personal finance tracker serving 80,000+ users. I led the end-to-end UX process — from discovery workshops and user interviews to high-fidelity prototypes and a scalable design system. The new experience reduced task completion time by 34%.",
    outcome: "34% faster task completion · 4.8★ App Store rating",
    image: FINTECH_IMG,
    color: "#C4622D",
    bgColor: "#F5EDE6",
  },
  {
    id: "02",
    title: "Serene Soul",
    subtitle: "Wellness & Meditation App",
    tags: ["Mobile App", "Health & Wellness", "User Research"],
    year: "2023",
    description:
      "Designed the full product experience for a mindfulness startup from zero to launch. Conducted 24 user interviews to map emotional journeys, then translated insights into a calm, accessible interface. The onboarding flow achieved a 72% completion rate.",
    outcome: "72% onboarding completion · 15k downloads in month 1",
    image: WELLNESS_IMG,
    color: "#4A6741",
    bgColor: "#EAF0E8",
  },
  {
    id: "03",
    title: "Terra Wear",
    subtitle: "Sustainable Fashion E-Commerce",
    tags: ["Web Design", "E-Commerce", "Design System"],
    year: "2022",
    description:
      "Rebuilt the shopping experience for a sustainable fashion brand, focusing on storytelling and ethical transparency. Created a comprehensive design system with 120+ components, enabling the in-house team to ship features 3× faster.",
    outcome: "3× faster feature shipping · 28% increase in conversions",
    image: ECOMMERCE_IMG,
    color: "#8B6914",
    bgColor: "#F5EFE0",
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
  const [hovered, setHovered] = useState(false);

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
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="aspect-[4/3] overflow-hidden">
          <motion.img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            animate={{ scale: hovered ? 1.05 : 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
        {/* Hover overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ background: `${project.color}CC` }}
        >
          <span className="font-display text-white text-2xl italic">View Project →</span>
        </motion.div>
        {/* Project number */}
        <div
          className="absolute top-4 left-4 font-mono-dm text-xs tracking-widest px-3 py-1 rounded-full"
          style={{ background: "rgba(250,247,242,0.9)", color: project.color }}
        >
          {project.id}
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
            Projects that{" "}
            <em style={{ color: "#C4622D" }}>moved the needle</em>
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
