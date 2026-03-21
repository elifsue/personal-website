/* ============================================================
   ABOUT SECTION — Organic Modernism
   Two-column: abstract blob art left, bio text right
   Warm earthy tones, Cormorant Garamond display text
   Dark text on light cream background
   ============================================================ */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// Use Vite's BASE_URL so the path resolves correctly both locally (/)
// and on GitHub Pages (/personal-website/)
const ABOUT_BG = `${import.meta.env.BASE_URL}elifsu_ates.webp`;

const timeline = [
  {
    year: "2024",
    role: "Senior UI/UX Designer",
    company: "Luminary Studio",
    desc: "Leading end-to-end design for SaaS products serving 200k+ users.",
    color: "#C4622D",
  },
  {
    year: "2022",
    role: "UI/UX Designer",
    company: "Pixel & Co.",
    desc: "Designed mobile-first experiences for fintech and wellness startups.",
    color: "#4A6741",
  },
  {
    year: "2021",
    role: "Junior Designer",
    company: "Freelance",
    desc: "Built brand identities and landing pages for early-stage founders.",
    color: "#8B6914",
  },
  {
    year: "2020",
    role: "BSc Computer Science",
    company: "University of Greenwich",
    desc: "Graduated with honours, specialising in human-computer interaction.",
    color: "#1C1917",
  },
];

function TimelineItem({
  item,
  index,
}: {
  item: (typeof timeline)[0];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="flex gap-5 group"
    >
      {/* Year + line */}
      <div className="flex flex-col items-center shrink-0 w-12">
        <span
          className="font-mono-dm text-xs tracking-wider mt-1"
          style={{ color: item.color }}
        >
          {item.year}
        </span>
        <div
          className="w-px flex-1 mt-2 min-h-[2rem]"
          style={{ background: `${item.color}30` }}
        />
      </div>
      {/* Content */}
      <div className="pb-8 flex-1">
        <div className="flex flex-wrap items-baseline gap-2 mb-1">
          <span
            className="font-display text-xl font-medium"
            style={{ color: "#1C1917" }}
          >
            {item.role}
          </span>
          <span
            className="font-mono-dm text-xs tracking-wide px-2 py-0.5 rounded-full"
            style={{ background: `${item.color}15`, color: item.color }}
          >
            {item.company}
          </span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "#6B6560" }}>
          {item.desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="about"
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background: "#FAF7F2" }}
    >
      {/* Section label */}
      <div className="pl-8 lg:pl-32 pr-8 lg:pr-16 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-px" style={{ background: "#C4622D" }} />
          <span
            className="font-mono-dm text-xs tracking-[0.25em] uppercase"
            style={{ color: "#C4622D" }}
          >
            About Me
          </span>
        </motion.div>
      </div>

      <div className="pl-8 lg:pl-32 pr-8 lg:pr-16 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        {/* Left: Abstract art */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative"
        >
          <div className="relative">
            <div
              className="w-full aspect-[3/4] rounded-3xl overflow-hidden"
              style={{ background: "#E8DDD0" }}
            >
              <img
                src={ABOUT_BG}
                alt="Elifsu Ateş at University of Greenwich graduation"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating quote card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute -bottom-6 -right-2 lg:-right-8 p-5 rounded-2xl shadow-xl"
              style={{
                background: "#FAF7F2",
                border: "1px solid rgba(196,98,45,0.15)",
                maxWidth: "210px",
              }}
            >
              <p
                className="font-display text-sm italic leading-snug mb-2"
                style={{ color: "#1C1917" }}
              >
                "Design is not just what it looks like — it's how it works."
              </p>
              <div
                className="font-mono-dm text-xs"
                style={{ color: "#C4622D" }}
              >
                — Elifsu
              </div>
            </motion.div>

            {/* Available badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="absolute top-4 -right-2 lg:-right-6 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg"
              style={{ background: "#4A6741", color: "#FAF7F2" }}
            >
              <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
              <span className="font-mono-dm text-xs tracking-wide">Open to work</span>
            </motion.div>

            {/* Decorative rotating blob */}
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute -top-8 -left-8 w-24 h-24 blob-3 opacity-15 -z-10"
              style={{ background: "#4A6741" }}
            />
          </div>
        </motion.div>

        {/* Right: Bio + Timeline */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-display mb-6 leading-tight"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              color: "#1C1917",
              fontWeight: 300,
            }}
          >
            A designer who
            <br />
            <em style={{ color: "#C4622D" }}>thinks in systems</em>
            <br />
            and feels in pixels.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-base leading-relaxed mb-4"
            style={{ color: "#6B6560" }}
          >
            I'm Elifsu Ateş, a UI/UX designer based in London with a passion for
            creating digital products that feel effortless to use. My background in
            Computer Science from the{" "}
            <strong style={{ color: "#4A6741" }}>University of Greenwich</strong> gives
            me a technical edge — I understand the code behind the canvas.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-base leading-relaxed mb-12"
            style={{ color: "#6B6560" }}
          >
            I specialise in product design, design systems, and user research. Whether
            it's a fintech dashboard or a wellness app, I approach every project with
            curiosity, empathy, and a relentless eye for detail.
          </motion.p>

          {/* Timeline */}
          <div>
            <div
              className="font-mono-dm text-xs tracking-[0.2em] uppercase mb-6 flex items-center gap-3"
              style={{ color: "#C4622D" }}
            >
              <div className="w-6 h-px" style={{ background: "#C4622D" }} />
              Experience & Education
            </div>
            {timeline.map((item, i) => (
              <TimelineItem key={item.year + item.role} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
