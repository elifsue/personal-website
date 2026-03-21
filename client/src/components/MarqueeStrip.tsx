/* ============================================================
   MARQUEE STRIP — Organic Modernism
   Scrolling text ticker between sections
   Terracotta background, cream text
   Uses requestAnimationFrame for perfectly smooth, glitch-free,
   consistent-speed infinite scrolling regardless of viewport width.
   ============================================================ */

import { useRef, useEffect } from "react";

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
];

// Constant speed in pixels per second
const SPEED = 60;

export default function MarqueeStrip() {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = (timestamp - lastTimeRef.current) / 1000; // seconds
      lastTimeRef.current = timestamp;

      offsetRef.current -= SPEED * delta;

      // Get the width of the first child (one full copy of items)
      const firstChild = track.children[0] as HTMLElement;
      if (firstChild) {
        const singleWidth = firstChild.offsetWidth;
        // When we've scrolled past one full copy, reset seamlessly
        if (Math.abs(offsetRef.current) >= singleWidth) {
          offsetRef.current += singleWidth;
        }
      }

      track.style.transform = `translateX(${offsetRef.current}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className="relative py-4 overflow-hidden"
      style={{ background: "#C4622D" }}
    >
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
        {/* Render three copies to ensure no gaps */}
        {[0, 1, 2].map((copy) => (
          <div key={copy} className="flex gap-8 shrink-0 pr-8">
            {items.map((item, i) => (
              <span
                key={`${copy}-${i}`}
                className="font-mono-dm text-sm tracking-widest uppercase shrink-0"
                style={{ color: item === "✦" ? "rgba(250,247,242,0.5)" : "#FAF7F2" }}
              >
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
