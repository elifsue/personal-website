/* ============================================================
   CERTIFICATIONS SECTION — Organic Modernism
   Displays professional certifications with verification links
   Warm sand background, terracotta and sage accents
   ============================================================ */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function GoogleLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function AnthropicLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.827 3.52h3.603L24 20.48h-3.603l-6.57-16.96zm-7.258 0h3.767L16.906 20.48h-3.674l-1.343-3.461H6.396l-1.34 3.461H1.5l5.07-16.96zm2.327 4.806L6.588 14.4h4.616l-2.308-6.074z" fill="#1C1917"/>
    </svg>
  );
}

const certifications = [
  {
    title: "Google UX Design",
    issuer: "Google · Coursera",
    logo: "google" as const,
    color: "#C4622D",
    bg: "#F5EDE6",
    link: "https://www.coursera.org/account/accomplishments/specialization/YUS7FUEWJE2M",
  },
  {
    title: "Claude 101",
    issuer: "Anthropic · Skilljar",
    logo: "anthropic" as const,
    color: "#4A6741",
    bg: "#EAF0E8",
    link: "https://verify.skilljar.com/c/v3r7vo4dnrac",
  },
  {
    title: "Claude Code 101",
    issuer: "Anthropic · Skilljar",
    logo: "anthropic" as const,
    color: "#1C1917",
    bg: "#E8DDD0",
    link: "https://verify.skilljar.com/c/qf82cg6rv86o",
  },
];

export default function CertificationsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="certifications"
      className="relative pt-0 pb-24 lg:pt-0 lg:pb-32 overflow-hidden"
      style={{ background: "#FAF7F2" }}
    >
      {/* Decorative element */}
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute top-16 right-12 w-24 h-24 blob-1 opacity-8 hidden lg:block"
        style={{ background: "#C4622D" }}
      />

      <div className="px-8 lg:px-32">
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
              Certifications
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
            Continuous
            <br />
            <em style={{ color: "#C4622D" }}>learning</em>
          </motion.h2>
        </div>

        {/* Certifications grid */}
        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {certifications.map((cert, i) => (
            <motion.a
              key={cert.title}
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="group relative p-8 rounded-3xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{ background: cert.bg }}
            >
              {/* Logo */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 flex items-center justify-center">
                  {cert.logo === "google" ? <GoogleLogo /> : <AnthropicLogo />}
                </div>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-1 group-hover:translate-x-0"
                  style={{ color: cert.color }}
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </div>

              {/* Title */}
              <h3
                className="font-display text-2xl font-medium mb-2 transition-colors duration-300"
                style={{ color: "#1C1917" }}
              >
                {cert.title}
              </h3>

              {/* Issuer */}
              <p
                className="font-mono-dm text-xs tracking-wide uppercase"
                style={{ color: "#6B6560" }}
              >
                {cert.issuer}
              </p>

              {/* Verify label */}
              <div className="mt-6 flex items-center gap-2">
                <span
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 group-hover:scale-105"
                  style={{
                    background: "rgba(250,247,242,0.8)",
                    color: cert.color,
                    border: `1px solid ${cert.color}30`,
                  }}
                >
                  View certificate →
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
