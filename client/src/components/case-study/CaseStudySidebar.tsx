import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import ProjectSwitcher from "@/components/ProjectSwitcher";

interface NavLink {
  label: string;
  href: string;
}

interface CaseStudySidebarProps {
  navLinks: NavLink[];
  accentColor: string;
}

export default function CaseStudySidebar({ navLinks, accentColor }: CaseStudySidebarProps) {
  const [active, setActive] = useState(navLinks[0]?.label || "");
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
  }, [navLinks]);

  const handleNavClick = (label: string, href: string) => {
    setActive(label);
    setMenuOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Desktop sidebar */}
      <nav
        className="hidden lg:flex fixed left-0 top-0 h-full w-20 flex-col items-center justify-between py-10 z-50"
        style={{
          background: "rgba(250,247,242,0.85)",
          backdropFilter: "blur(12px)",
          borderRight: `1px solid ${accentColor}1F`,
        }}
      >
        <Link href="/" className="flex flex-col items-center gap-1 transition-transform duration-300 hover:scale-110">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: accentColor }}
          >
            <span className="font-display text-white font-semibold text-sm">EA</span>
          </div>
        </Link>

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
                style={{ color: active === link.label ? accentColor : "#6B6560" }}
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
                    style={{ background: accentColor }}
                  />
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3">
          <a
            href="mailto:hello@elifsuates.com"
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
            style={{ color: "#6B6560" }}
            title="hello@elifsuates.com"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/elifsu-ates/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
            style={{ color: "#6B6560" }}
            title="LinkedIn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect x="2" y="9" width="4" height="12"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </a>
          <a
            href="https://behance.net/elifsuates"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
            style={{ color: "#6B6560" }}
            title="Behance"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/>
            </svg>
          </a>
          <a
            href="https://github.com/elifsue/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
            style={{ color: "#6B6560" }}
            title="GitHub"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
      </nav>

      {/* Mobile top nav */}
      <nav
        className={`lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 ${scrolled ? "shadow-md" : ""}`}
        style={{ background: "rgba(250,247,242,0.92)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: accentColor }}
            >
              <span className="font-display text-white font-semibold text-xs">EA</span>
            </div>
          </Link>
          <ProjectSwitcher />
        </div>
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
                style={{ color: active === link.label ? accentColor : "#1C1917" }}
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
