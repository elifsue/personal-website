/* ============================================================
   CHARACTER PAD CASE STUDY PAGE — Organic Modernism
   Android Unicode Characters App redesign case study
   Warm earthy tones matching the portfolio design
   ============================================================ */

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Link } from "wouter";
import { AnimatePresence } from "framer-motion";
import CustomCursor from "@/components/CustomCursor";
import CaseStudyFooter from "@/components/CaseStudyFooter";

const CHARACTERPAD_OG_IMAGE = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/fWNxQURakNaOZpGt.png";

// Nav links specific to the Character Pad case study
const navLinks = [
  { label: "Overview", href: "#overview" },
  { label: "Role", href: "#role" },
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
      <div className="w-8 h-px" style={{ background: "#E67E22" }} />
      <span className="font-mono-dm text-xs tracking-[0.25em] uppercase" style={{ color: "#E67E22" }}>
        {label}
      </span>
    </div>
  );
}

function CaseStudyNavbar() {
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
        style={{ background: "rgba(250,247,242,0.85)", backdropFilter: "blur(12px)", borderRight: "1px solid rgba(230,126,34,0.12)" }}>
        {/* Logo mark — links back home */}
        <Link href="/" className="flex flex-col items-center gap-1 transition-transform duration-300 hover:scale-110">
          <div className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "#E67E22" }}>
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
                style={{ color: active === link.label ? "#E67E22" : "#6B6560" }}
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
                    style={{ background: "#E67E22" }}
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
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#E67E22" }}>
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
                style={{ color: active === link.label ? "#E67E22" : "#1C1917" }}
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

export default function CharacterPad() {
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
    document.title = "Character Pad — Elifsu Ateş";
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
    setMeta("og:title", "Character Pad — Android Unicode Characters App");
    setMeta("og:description", "An Android utility app providing extensive access to Unicode characters. UI/UX Design by Elifsu Ateş.");
    setMeta("og:image", CHARACTERPAD_OG_IMAGE);
    setMeta("og:image:width", "1200");
    setMeta("og:image:height", "960");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", "Character Pad — Android Unicode Characters App");
    setMeta("twitter:description", "An Android utility app providing extensive access to Unicode characters. UI/UX Design by Elifsu Ateş.");
    setMeta("twitter:image", CHARACTERPAD_OG_IMAGE);
    return () => {
      document.title = "Elifsu Ateş — UI/UX Designer";
    };
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#FAF7F2" }}>
      <CustomCursor />
      <CaseStudyNavbar />

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
              <span className="font-mono-dm text-xs tracking-widest uppercase px-3 py-1 rounded-full" style={{ background: "#E67E2220", color: "#E67E22" }}>
                UI/UX Design
              </span>
              <span className="font-mono-dm text-xs tracking-widest uppercase px-3 py-1 rounded-full" style={{ background: "#8D5E3C20", color: "#8D5E3C" }}>
                2026
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-light mb-4" style={{ color: "#1C1917" }}>
              Character Pad
            </h1>
            <p className="text-xl leading-relaxed max-w-2xl mb-8" style={{ color: "#6B6560" }}>
              An Android utility app providing extensive access to Unicode characters — making special symbols accessible to everyone.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://www.figma.com/proto/ZOBLX9Vy0IDzFCSkESBEcr/Character-Pad?node-id=824-17076&t=n1dLPf9xI0nHeUcA-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=824%3A17076&show-proto-sidebar=1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono-dm text-sm tracking-wide transition-all duration-300 hover:scale-105"
                style={{ background: "#BF5836", color: "#FAF7F2" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                View Interactive Prototype
              </a>
              <a
                href="https://www.behance.net/gallery/252476603/Character-Pad-Android-Unicode-App-Redesign-UIUX"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono-dm text-sm tracking-wide transition-all duration-300 hover:scale-105"
                style={{ background: "#4A6FA5", color: "#FFFFFF" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/>
                </svg>
                View on Behance
              </a>
              <a
                href="https://www.figma.com/design/ZOBLX9Vy0IDzFCSkESBEcr/Character-Pad?node-id=263-9197&t=gMi30hWZphoUtKG5-1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono-dm text-sm tracking-wide transition-all duration-300 hover:scale-105"
                style={{ background: "#7B5EA7", color: "#FFFFFF" }}
              >
                <svg width="16" height="16" viewBox="0 0 38 57" fill="currentColor">
                  <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z"/>
                  <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z"/>
                  <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z"/>
                  <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z"/>
                  <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z"/>
                </svg>
                View on Figma
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.husseinelfeky.characterpad"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono-dm text-sm tracking-wide transition-all duration-300 hover:scale-105"
                style={{ background: "#01875F", color: "#FFFFFF" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.3 2.3-8.636-8.632z"/>
                </svg>
                View on Google Play
              </a>
            </div>
          </Section>
        </header>

        {/* Overview */}
        <div className="px-8 lg:px-32 pb-20">
          <Section>
            <SectionLabel label="Overview" />
            <h2 className="font-display text-3xl mb-6" style={{ color: "#1C1917", fontWeight: 300 }}>
              About <em style={{ color: "#E67E22" }}>Character Pad</em>
            </h2>
            <p className="text-base leading-relaxed mb-6 max-w-3xl" style={{ color: "#6B6560" }}>
              Character Pad is an Android utility app, designed to provide users with extensive access to Unicode characters, serving as a comprehensive tool for inserting special symbols, mathematical operators, emojis, etc. into their texts, emails, and documents.
            </p>
          </Section>
        </div>

        {/* Role */}
        <div className="px-8 lg:px-32 pb-20" id="role" style={{ background: "#F5F0EA" }}>
          <Section className="py-20">
            <SectionLabel label="Role" />
            <h2 className="font-display text-3xl mb-8" style={{ color: "#1C1917", fontWeight: 300 }}>
              My <em style={{ color: "#E67E22" }}>Contribution</em>
            </h2>
            <p className="text-base leading-relaxed max-w-3xl" style={{ color: "#6B6560" }}>
              As a UI/UX Designer, my role was to analyze all actionable user reviews on the Play Store, ranking the severity of each issue and discussing them with the app owner to prioritize improvements, then addressing the identified pain points by redesigning the app interface and introducing new features to enhance the overall user experience.
            </p>
          </Section>
        </div>

        {/* Footer CTA */}
        <CaseStudyFooter />
      </main>
    </div>
  );
}
