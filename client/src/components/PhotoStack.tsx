import { motion, type PanInfo } from "framer-motion";
import { useState } from "react";

export interface StackPhoto {
  src: string;
  alt: string;
  caption: string;
  /** CSS object-position, for photos that aren't 3:4 and get cropped by the frame */
  position?: string;
}

interface PhotoStackProps {
  photos: StackPhoto[];
  accent: string;
}

// How far (px) or how fast (px/s) a drag has to go before it counts as a swipe
const SWIPE_DISTANCE = 80;
const SWIPE_VELOCITY = 400;

// Resting pose for each depth in the stack; deeper cards hide behind the second one.
// The slight tilt on the top card keeps it feeling like a loose pile of polaroids.
const DEPTH_POSE = [
  { rotate: -1.5, x: 0, scale: 1, opacity: 1 },
  { rotate: 4, x: 12, scale: 0.96, opacity: 1 },
  { rotate: -5, x: -12, scale: 0.92, opacity: 1 },
];
const HIDDEN_POSE = { rotate: 0, x: 0, scale: 0.9, opacity: 0 };

/**
 * A pile of polaroids: 3:4 photos in white frames, captioned in the frame's bottom strip.
 * Swipe or drag the top one either way to move on to the next photo; the arrow buttons,
 * dots and arrow keys step forwards and back.
 */
export default function PhotoStack({ photos, accent }: PhotoStackProps) {
  const [active, setActive] = useState(0);
  const count = photos.length;

  const next = () => setActive((i) => (i + 1) % count);
  const prev = () => setActive((i) => (i - 1 + count) % count);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    if (Math.abs(offset.x) > SWIPE_DISTANCE || Math.abs(velocity.x) > SWIPE_VELOCITY) next();
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Photos of Elifsu"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }}
      className="outline-none"
    >
      {/* Every polaroid sits in the same grid cell, so they all take the tallest card's height
          and line up. isolate keeps their z-index from covering anything around the stack. */}
      <div className="grid isolate">
        {photos.map((photo, i) => {
          const depth = (i - active + count) % count;
          const pose = DEPTH_POSE[depth] ?? HIDDEN_POSE;
          const isTop = depth === 0;
          return (
            <motion.figure
              key={photo.src}
              className={`[grid-area:1/1] flex flex-col p-3 sm:p-4 pb-0 sm:pb-0 rounded-xs ${isTop ? "cursor-grab active:cursor-grabbing" : ""}`}
              style={{
                background: "#FFFFFF",
                zIndex: count - depth,
                boxShadow: isTop
                  ? "0 18px 40px -12px rgba(28,25,23,0.35), 0 2px 6px rgba(28,25,23,0.08)"
                  : "0 10px 24px -10px rgba(28,25,23,0.25)",
              }}
              animate={pose}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              drag={isTop ? "x" : false}
              dragSnapToOrigin
              dragElastic={0.6}
              onDragEnd={isTop ? handleDragEnd : undefined}
              aria-hidden={!isTop}
            >
              <div className="aspect-[3/4] overflow-hidden" style={{ background: "#E8DDD0" }}>
                <img
                  src={photo.src}
                  alt={photo.alt}
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover select-none pointer-events-none"
                  style={{ objectPosition: photo.position ?? "center" }}
                />
              </div>
              <figcaption
                className="flex-1 flex items-center justify-center text-center font-display italic text-lg leading-snug px-2 py-4 sm:py-5 select-none"
                style={{ color: "#1C1917", textWrap: "balance" }}
              >
                {photo.caption}
              </figcaption>
            </motion.figure>
          );
        })}
      </div>

      {/* The captions live on the cards, which screen readers skip except for the top one;
          this announces the new caption when the photo changes */}
      <p className="sr-only" aria-live="polite">
        {photos[active].caption}
      </p>

      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous photo"
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-black/5"
          style={{ border: "1px solid rgba(28,25,23,0.15)", color: "#1C1917" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <div className="flex items-center gap-1.5">
          {photos.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1} of ${count}`}
              aria-current={i === active}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{ width: i === active ? 18 : 6, background: i === active ? accent : "rgba(28,25,23,0.2)" }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          aria-label="Next photo"
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-black/5"
          style={{ border: "1px solid rgba(28,25,23,0.15)", color: "#1C1917" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>
    </div>
  );
}
