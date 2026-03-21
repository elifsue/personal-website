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
        <TestimonialsSection />
        <ContactSection />
      </main>
    </div>
  );
}
