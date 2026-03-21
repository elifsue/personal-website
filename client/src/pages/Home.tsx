/* ============================================================
   HOME PAGE — Organic Modernism / Biomorphic Design
   Assembles all sections with smooth scroll layout
   Design: Cream bg, Terracotta accents, Sage secondary, Charcoal text
   Fonts: Cormorant Garamond (display) + DM Sans (body) + DM Mono (labels)
   ============================================================ */

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import MarqueeStrip from "@/components/MarqueeStrip";
import WorkSection from "@/components/WorkSection";
import SkillsSection from "@/components/SkillsSection";
import CertificationsSection from "@/components/CertificationsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import CustomCursor from "@/components/CustomCursor";

function LoadingScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: "#1C1917" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-4"
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: "#C4622D" }}
        >
          <span className="font-display text-white font-semibold text-2xl">EA</span>
        </div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "120px" }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeInOut" }}
          className="h-px"
          style={{ background: "#C4622D" }}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-mono-dm text-xs tracking-[0.3em] uppercase"
          style={{ color: "rgba(250,247,242,0.5)" }}
        >
          Elifsu Ateş
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);

  // Set OG meta tags for link sharing
  useEffect(() => {
    document.title = "Elifsu Ateş — UI/UX Designer";
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
    setMeta("og:title", "Elifsu Ateş — UI/UX Designer");
    setMeta("og:description", "Crafting human-first digital experiences. UI/UX Designer based in London.");
    setMeta("og:image", "/elifsu_ates.webp");
    setMeta("og:image:width", "1080");
    setMeta("og:image:height", "1350");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", "Elifsu Ateş — UI/UX Designer");
    setMeta("twitter:description", "Crafting human-first digital experiences. UI/UX Designer based in London.");
    setMeta("twitter:image", "/elifsu_ates.webp");
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#FAF7F2" }}>
      <CustomCursor />
      <AnimatePresence>
        {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      </AnimatePresence>

      <Navbar />
      {/* Main content offset for desktop left nav */}
      <main className="lg:pl-20">
        <HeroSection />
        <MarqueeStrip />
        <AboutSection />
        <MarqueeStrip />
        <WorkSection />
        <SkillsSection />
        <CertificationsSection />
        {/* Hidden for now — will be re-enabled later */}
        {false && <TestimonialsSection />}
        <ContactSection />
      </main>
    </div>
  );
}
