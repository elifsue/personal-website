/* ============================================================
   WIREFRAME PROTOTYPER SKILL PAGE — Organic Modernism
   Simple project page with overview and GitHub link
   Warm earthy tones matching the portfolio design
   ============================================================ */

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Link } from "wouter";
import { AnimatePresence } from "framer-motion";
import CustomCursor from "@/components/CustomCursor";

const WP_OG_IMAGE = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/kiaoSegjEvwENGTh.png";

// Nav links for this page
const navLinks = [
  { label: "Overview", href: "#overview" },
  { label: "Features", href: "#features" },
];

// Reusable section wrapper with scroll animation
function Section({ children, className = "", id = "" }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-px" style={{ background: "#BF5836" }} />
      <span className="font-mono-dm text-xs tracking-[0.25em] uppercase" style={{ color: "#BF5836" }}>
        {label}
      </span>
    </div>
  );
}

function ProjectNavbar() {
  const [active, setActive] = useState("Overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = navLinks.map((l) => l.href.replace("#", ""));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          const link = navLinks.find((l) => l.href === `#${id}`);
          if (link) setActive(link.label);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (label: string, href: string) => {
    setActive(label);
    setMenuOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Desktop: Fixed left vertical nav */}
      <nav className="hidden lg:flex fixed left-0 top-0 h-full w-20 flex-col items-center justify-between py-10 z-50"
        style={{ background: "rgba(250,247,242,0.85)", backdropFilter: "blur(12px)", borderRight: "1px solid rgba(196,98,45,0.12)" }}>
        {/* Logo mark — links back home */}
        <Link href="/" className="flex flex-col items-center gap-1 transition-transform duration-300 hover:scale-110">
          <div className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "#C4622D" }}>
            <span className="font-display text-white font-semibold text-sm">EA</span>
          </div>
        </Link>

        {/* Nav links rotated */}
        <div className="flex flex-col items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.label, link.href)}
              className="relative group flex items-center gap-2"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              <span
                className="font-mono-dm text-xs tracking-widest uppercase transition-colors duration-300"
                style={{ color: active === link.label ? "#C4622D" : "#6B6560" }}
              >
                {link.label}
              </span>
              <AnimatePresence>
                {active === link.label && (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    exit={{ opacity: 0, scaleY: 0 }}
                    transition={{ type: "tween", ease: "easeInOut", duration: 0.25 }}
                    className="absolute -right-3 top-0 bottom-0 w-0.5 rounded-full origin-center"
                    style={{ background: "#C4622D" }}
                  />
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>

        {/* Social links */}
        <div className="flex flex-col items-center gap-3">
          <a href="mailto:hello@elifsuates.com" className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
            style={{ color: "#6B6560" }}
            title="hello@elifsuates.com">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/elifsu-ates/" target="_blank" rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
            style={{ color: "#6B6560" }}
            title="LinkedIn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect x="2" y="9" width="4" height="12"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </a>
          <a href="https://behance.net/elifsuates" target="_blank" rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
            style={{ color: "#6B6560" }}
            title="Behance">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/>
            </svg>
          </a>
          <a href="https://github.com/elifsue/" target="_blank" rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
            style={{ color: "#6B6560" }}
            title="GitHub">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
      </nav>

      {/* Mobile: Top nav */}
      <nav
        className={`lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 ${scrolled ? "shadow-sm" : ""}`}
        style={{ background: "rgba(250,247,242,0.92)", backdropFilter: "blur(12px)" }}
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#C4622D" }}>
            <span className="font-display text-white font-semibold text-xs">EA</span>
          </div>
          <span className="font-display text-lg font-medium" style={{ color: "#1C1917" }}>Elifsu Ateş</span>
        </Link>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-10 h-10 flex items-center justify-center"
          aria-label="Toggle menu"
        >
          <span className="relative block w-6 h-4">
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 left-0 block w-6 h-0.5 rounded-full origin-center"
              style={{ background: "#1C1917" }}
            />
            <motion.span
              animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute top-1/2 left-0 -translate-y-1/2 block w-6 h-0.5 rounded-full origin-center"
              style={{ background: "#1C1917" }}
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-0 left-0 block w-6 h-0.5 rounded-full origin-center"
              style={{ background: "#1C1917" }}
            />
          </span>
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 z-40 flex flex-col items-center justify-center"
            style={{ background: "rgba(250,247,242,0.97)", backdropFilter: "blur(20px)" }}
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => handleNavClick(link.label, link.href)}
                className="py-4 font-display text-4xl font-light transition-colors duration-200"
                style={{ color: active === link.label ? "#C4622D" : "#1C1917" }}
              >
                {link.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function WireframePrototyper() {
  useEffect(() => {
    const el = document.getElementById("overview");
    if (el) {
      el.scrollIntoView({ behavior: "instant" });
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  // Set OG meta tags for link sharing
  useEffect(() => {
    document.title = "Wireframe Prototyper Skill — Elifsu Ateş";
    const setMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`);
      if (!el) {
        el = document.createElement("meta");
        if (property.startsWith("twitter:")) {
          el.setAttribute("name", property);
        } else {
          el.setAttribute("property", property);
        }
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    setMeta("og:title", "Wireframe Prototyper Skill — Claude Code Skill");
    setMeta("og:description", "A reusable Claude Code Skill that streamlines the end-to-end design workflow, from structured discovery and competitor research to generating a WCAG-compliant design system and building interactive low-fidelity wireframes or high-fidelity prototypes with real navigation, exportable screens, and a transferable design system to Figma.");
    setMeta("og:image", WP_OG_IMAGE);
    setMeta("og:image:width", "1400");
    setMeta("og:image:height", "788");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", "Wireframe Prototyper Skill — Claude Code Skill");
    setMeta("twitter:description", "A reusable Claude Code Skill that streamlines the end-to-end design workflow, from structured discovery and competitor research to generating a WCAG-compliant design system and building interactive low-fidelity wireframes or high-fidelity prototypes with real navigation, exportable screens, and a transferable design system to Figma.");
    setMeta("twitter:image", WP_OG_IMAGE);
    return () => {
      document.title = "Elifsu Ateş — UI/UX Designer";
    };
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#FAF7F2" }}>
      <CustomCursor />
      <ProjectNavbar />

      {/* Floating Back to Portfolio button */}
      <Link
        href="/"
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-mono-dm text-sm tracking-wide transition-all duration-300 hover:scale-105 shadow-lg"
        style={{ background: "#1C1917", color: "#FAF7F2" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Portfolio
      </Link>

      {/* Main content offset for desktop left nav */}
      <main className="lg:pl-20">
        {/* Hero / Header */}
        <header className="pt-24 pb-16 px-8 lg:px-32" id="overview">
          <Section>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="font-mono-dm text-xs tracking-widest uppercase px-3 py-1 rounded-full" style={{ background: "#BF583620", color: "#BF5836" }}>
                Claude Code Skill
              </span>
              <span className="font-mono-dm text-xs tracking-widest uppercase px-3 py-1 rounded-full" style={{ background: "#8D5E3C20", color: "#8D5E3C" }}>
                2026
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4" style={{ color: "#1C1917", fontWeight: 300 }}>
              Wireframe Prototyper <em style={{ color: "#BF5836" }}>Skill</em>
            </h1>
            <p className="text-xl leading-relaxed max-w-3xl mb-8" style={{ color: "#6B6560" }}>
              A reusable Claude Code Skill that streamlines the end-to-end design workflow, from structured discovery and competitor research to generating a WCAG-compliant design system and building interactive low-fidelity wireframes or high-fidelity prototypes with real navigation, exportable screens, and a transferable design system to Figma.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://medium.com/@elifsue/design-with-context-a-claude-skill-that-studies-competitors-and-builds-your-prototype-e4cdd8cb7519"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono-dm text-sm tracking-wide transition-all duration-300 hover:scale-105"
                style={{ background: "#FFFFFF", color: "#1C1917", border: "1px solid #1C1917" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
                </svg>
                Read on Medium
              </a>
              <a
                href="https://github.com/elifsue/wireframe-prototyper-skill"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono-dm text-sm tracking-wide transition-all duration-300 hover:scale-105"
                style={{ background: "#1C1917", color: "#FAF7F2" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                View on GitHub
              </a>
            </div>
          </Section>
        </header>

        {/* Overview */}
        <div className="px-8 lg:px-32 py-20" style={{ background: "#F5F0EA" }}>
          <Section>
            <SectionLabel label="Overview" />
            <h2 className="font-display text-3xl mb-8" style={{ color: "#1C1917", fontWeight: 300 }}>
              What is <em style={{ color: "#BF5836" }}>this?</em>
            </h2>
            <div className="max-w-3xl space-y-6">
              <p className="text-base leading-relaxed" style={{ color: "#6B6560" }}>
                The Wireframe Prototyper Skill is a custom skill for Claude Code that enables rapid generation of interactive wireframes and prototypes directly from natural language prompts. It bridges the gap between ideation and implementation by allowing designers and developers to quickly visualise UI concepts without manual design tool work.
              </p>
              <p className="text-base leading-relaxed" style={{ color: "#6B6560" }}>
                Beyond wireframing, the skill can also perform structured competitor analysis — researching existing products in your space to identify UX patterns, strengths, and gaps that inform your design decisions from the start.
              </p>
              <p className="text-base leading-relaxed" style={{ color: "#6B6560" }}>
                Whether you need a quick low-fidelity wireframe to communicate a layout idea, or a high-fidelity interactive prototype to test user flows, this skill handles the transformation from text description to deployable web-based output. The resulting screens and design system are exportable to Figma through the Figma Code to Canvas tool, making handoff and iteration seamless.
              </p>
            </div>
          </Section>
        </div>

        {/* Key Features */}
        <div className="px-8 lg:px-32 py-20" id="features">
          <Section>
            <SectionLabel label="Features" />
            <h2 className="font-display text-3xl mb-10" style={{ color: "#1C1917", fontWeight: 300 }}>
              Key <em style={{ color: "#BF5836" }}>Capabilities</em>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Low-Fidelity Wireframes", desc: "Generate black-and-white wireframes with placeholder content, crossbox image placeholders, and simplified layouts — ideal for rapid ideation and early stakeholder feedback." },
                { title: "High-Fidelity Prototypes", desc: "Create polished, interactive prototypes with full styling, real navigation between screens, and micro-interactions ready for usability testing." },
                { title: "Competitor Analysis", desc: "Conduct structured competitor research by analysing existing products in the space, identifying UX patterns, strengths, and gaps to inform design decisions." },
                { title: "WCAG-Compliant Design System", desc: "Automatically generate a design system with accessible color contrast ratios, typography scales, spacing tokens, and component guidelines that meet WCAG 2.1 AA standards." },
                { title: "Material 3 Color Palette", desc: "Generate a configurable Material Design 3 color palette with accessible pairings across primary, secondary, and tertiary tones — bring your own brand color or let it auto-generate." },
                { title: "Exportable Screens & Design System", desc: "Output production-ready screens and a transferable design system that can be directly imported into Figma for handoff, iteration, and team collaboration." },
              ].map((feature) => (
                <div key={feature.title} className="p-6 rounded-2xl" style={{ background: "#F5F0EA" }}>
                  <h3 className="font-display text-lg font-medium mb-3" style={{ color: "#1C1917" }}>{feature.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B6560" }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>



        {/* Footer CTA */}
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
      </main>
    </div>
  );
}
