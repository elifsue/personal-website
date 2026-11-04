/* ============================================================
   ABOUT SECTION — Organic Modernism
   Two-column: abstract blob art left, bio text right
   Warm earthy tones, Cormorant Garamond display text
   Dark text on light cream background
   ============================================================ */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import PhotoStack, { type StackPhoto } from "./PhotoStack";

// Use Vite's BASE_URL so the path resolves correctly both locally (/)
// and on GitHub Pages (/personal-website/)
const IMG = `${import.meta.env.BASE_URL}images`;

// The Santander photo closes the stack. Photos that aren't 3:4 are
// cropped by the frame, so `position` picks which edge gets trimmed.
const PHOTOS: StackPhoto[] = [
  {
    src: `${IMG}/about/experiencing-latency-in-vision.jpg`,
    alt: "Elifsu Ateş crouching by the water at Canary Wharf, wearing a VR headset",
    caption: "Experiencing Latency in Vision - UAL",
  },
  {
    src: `${IMG}/about/meta-london-office-visit.jpg`,
    alt: "Elifsu Ateş with arms spread wide under a META LON banner at Meta's London office",
    caption: "Meta London Office Visit",
  },
  {
    src: `${IMG}/about/university-of-greenwich-graduation.webp`,
    alt: "Elifsu Ateş at University of Greenwich graduation",
    caption: "University of Greenwich Graduation",
  },
  {
    src: `${IMG}/about/bodystorming-santander-mobile-app.jpg`,
    alt: "Elifsu Ateş wearing a Santander headband and waving with both hands",
    caption: "Bodystorming the UX of Santander Mobile App - UAL",
  },
];

const timeline = [
  {
    role: "M.A. in User Experience Design",
    company: "University of the Arts London",
    period: "Sep 2026 \u2013 Dec 2027",
    location: "London, UK",
    logo: `${import.meta.env.BASE_URL}images/ual-logo.jpeg`,
    bullets: [] as string[],
  },
  {
    role: "UI/UX Designer (Freelance)",
    company: "Character Pad",
    period: "Jun 2026 \u2013 Jul 2026",
    location: "Remote",
    logo: `${import.meta.env.BASE_URL}images/character-pad-logo.png`,
    bullets: [
      "Scraped and analysed 7 years of Play Store reviews with Claude Code, narrowing 634 actionable 1\u20134-star reviews into 12 key findings across search, onboarding, navigation, and usability.",
      "Redesigned Character Pad (1.6M+ installs, 4.7 rating) with the product owner, turning the findings into 10 solutions across 77 Figma screens, refined through moderated usability testing with 6 users.",
    ],
  },
  {
    role: "UI/UX Designer Intern",
    company: "X\u2013Ray Home",
    period: "Jan 2026 \u2013 Apr 2026",
    location: "London, UK",
    logo: `${import.meta.env.BASE_URL}images/xray-home-logo.png`,
    bullets: [
      "Conducted 4 user interviews, competitive analysis, and an audit, uncovering 19 accessibility and usability issues, translating findings into targeted design improvements that elevated the overall user experience across the website.",
      "Built a WCAG-compliant design system with 30 structured components, variants, and color tokens, aligning the product's visual language across the website and enabling scalable reuse.",
      "Led the end-to-end redesign of the homepage, property listings, and 9 other consumer webpages using the design system, then validated it through moderated usability testing with 4 new users.",
    ],
  },
  {
    role: "B.Sc. in Computer Science",
    company: "University of Greenwich",
    period: "Jan 2021 \u2013 Jun 2025",
    location: "London, UK",
    logo: `${import.meta.env.BASE_URL}images/university-of-greenwich-logo.jpg`,
    bullets: [
      "Graduated with First Class Honours.",
    ],
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
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="flex gap-5 group relative"
    >
      {/* Timeline line + logo */}
      <div className="flex flex-col items-center shrink-0">
        {/* Logo — aligned to top of position text */}
        <div className="w-11 h-11 overflow-hidden">
          <img
            src={item.logo}
            alt={`${item.company} logo`}
            className="w-full h-full object-contain"
          />
        </div>
        {/* Line below logo with margin for equal spacing */}
        <div
          className="w-px flex-1 mt-3 mb-3 min-h-[1.5rem]"
          style={{ background: "rgba(196,98,45,0.2)" }}
        />
      </div>

      {/* Content */}
      <div className="pb-10 flex-1">
        <div className="flex flex-wrap items-baseline gap-2 mb-0.5">
          <span
            className="font-display text-lg font-medium"
            style={{ color: "#1C1917" }}
          >
            {item.role}
          </span>
          <span
            className="font-mono-dm text-xs tracking-wide px-2 py-0.5 rounded-full"
            style={{ background: "rgba(28,25,23,0.06)", color: "#1C1917" }}
          >
            {item.company}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="font-mono-dm text-xs tracking-wide" style={{ color: "#C4622D" }}>
            {item.period}
          </span>
          <span className="font-mono-dm text-[10px]" style={{ color: "#9C9590" }}>•</span>
          <span className="font-mono-dm text-xs" style={{ color: "#9C9590" }}>
            {item.location}
          </span>
        </div>
        <ul className="space-y-2">
          {item.bullets.map((bullet, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed" style={{ color: "#6B6560" }}>
              <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ background: "#C4622D" }} />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
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
      <div className="px-8 lg:px-32 mb-16">
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

      {/* Full-width headline */}
      <div className="px-8 lg:px-32 mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-display leading-tight"
          style={{
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            color: "#1C1917",
            fontWeight: 300,
          }}
        >
          A designer who{" "}
          <em style={{ color: "#C4622D", fontStyle: "italic" }}>thinks in systems</em>{" "}
          and feels in pixels.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-base leading-relaxed mt-8 mb-4 max-w-3xl"
          style={{ color: "#6B6560" }}
        >
          I'm Elifsu Ateş, a UI/UX Designer based in London. My background spans both Computer Science and UX Design, so I don't stop at the design. I have the technical fluency to vibe code the products I design too.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-base leading-relaxed max-w-3xl"
          style={{ color: "#6B6560" }}
        >
          I also bring strong expertise in{" "}
          <strong style={{ color: "#4A6741" }}>AI-driven workflows</strong>, which I use to improve and speed up every stage of the design process. My work covers research, wireframing, prototyping, and usability testing, with a focus on accessible products that feel effortless to use.
        </motion.p>
      </div>

      <div className="px-8 lg:px-32 grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 lg:gap-16 items-start">
        {/* Left: Photo */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative"
        >
          <div className="relative px-8 lg:pl-0 lg:pr-8">
            <PhotoStack
              photos={PHOTOS}
              accent="#C4622D"
            />

            {/* Decorative rotating blob */}
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute -top-8 -left-8 w-24 h-24 blob-3 opacity-15 -z-10"
              style={{ background: "#4A6741" }}
            />
          </div>
        </motion.div>

        {/* Right: Timeline */}
        <div>
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
              <TimelineItem key={item.company + item.role} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
