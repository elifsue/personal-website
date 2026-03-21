/* ============================================================
   MARQUEE STRIP — Organic Modernism
   Scrolling text ticker between sections
   Terracotta background, cream text
   ============================================================ */

import { motion } from "framer-motion";

const items = [
  "UI Design",
  "✦",
  "UX Research",
  "✦",
  "Design Systems",
  "✦",
  "Prototyping",
  "✦",
  "User Testing",
  "✦",
  "Interaction Design",
  "✦",
  "Visual Design",
  "✦",
  "Figma",
  "✦",
  "Motion Design",
  "✦",
];

export default function MarqueeStrip() {
  const doubled = [...items, ...items];

  return (
    <div
      className="relative py-4 overflow-hidden"
      style={{ background: "#C4622D" }}
    >
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="font-mono-dm text-sm tracking-widest uppercase shrink-0"
            style={{ color: item === "✦" ? "rgba(250,247,242,0.5)" : "#FAF7F2" }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
