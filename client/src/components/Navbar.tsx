/* ============================================================
   NAVBAR — Organic Modernism
   Fixed left vertical nav on desktop, top hamburger on mobile
   Colors: Charcoal text on Cream background, Terracotta accents
   ============================================================ */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [active, setActive] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = navLinks.map((l) => l.href.replace("#", ""));
      for (const id of sections.reverse()) {
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
        {/* Logo mark */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "#C4622D" }}>
            <span className="font-display text-white font-semibold text-sm">EA</span>
          </div>
        </div>

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
          <a href="mailto:elifsuates15@gmail.com" className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
            style={{ color: "#6B6560" }}
            title="elifsuates15@gmail.com">
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
          <a href="https://dribbble.com" target="_blank" rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
            style={{ color: "#6B6560" }}
            title="Dribbble">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94"/>
              <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32"/>
              <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72"/>
            </svg>
          </a>
        </div>
      </nav>

      {/* Mobile: Top nav */}
      <nav
        className={`lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 ${scrolled ? "shadow-sm" : ""}`}
        style={{ background: "rgba(250,247,242,0.92)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#C4622D" }}>
            <span className="font-display text-white font-semibold text-xs">EA</span>
          </div>
          <span className="font-display text-lg font-medium" style={{ color: "#1C1917" }}>Elifsu Ateş</span>
        </div>
        {/* Hamburger / X toggle — uses a relative container so the two
            lines share the same centre point and cross correctly */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-10 h-10 flex items-center justify-center"
          aria-label="Toggle menu"
        >
          <span className="relative block w-6 h-4">
            {/* Top bar → rotates to first diagonal of X */}
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 left-0 block w-6 h-0.5 rounded-full origin-center"
              style={{ background: "#1C1917" }}
            />
            {/* Middle bar → fades out */}
            <motion.span
              animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute top-1/2 left-0 -translate-y-1/2 block w-6 h-0.5 rounded-full origin-center"
              style={{ background: "#1C1917" }}
            />
            {/* Bottom bar → rotates to second diagonal of X */}
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
