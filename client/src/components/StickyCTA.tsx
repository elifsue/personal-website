/* ============================================================
   STICKY CTA — Resume + contact buttons pinned to the top
   When the hero's CTA buttons reach the top of the viewport they
   "fly" into this bar (and back out again when scrolling up)
   Desktop: full-width bar beside the left nav
   Mobile: docked directly under the top nav
   ============================================================ */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { cubicBezier, motion } from "framer-motion";
import { RESUME_URL } from "@/const";

/** Height of the mobile top nav (Navbar: py-4 around a 40px button) */
const MOBILE_NAV_HEIGHT = 72;
/** Vertical padding of the bar (py-3) — the hero buttons dock when they reach this line */
const BAR_PADDING_Y = 12;
/** Extra distance needed to undock, so hovering on the line doesn't flicker */
const HYSTERESIS = 8;
const FLIGHT_DURATION_MS = 450;
/** "Get in Touch" trails "Download Resume" slightly */
const FLIGHT_STAGGER_MS = 40;
const flightEase = cubicBezier(0.22, 1, 0.36, 1);
/** Frames the stand-ins overlap the real buttons at take-off and landing, so there's never a
    frame where the browser hasn't painted either of them yet */
const HANDOFF_FRAMES = 2;

// Mirrors the hero CTA buttons so the flying stand-ins are indistinguishable from them
const BUTTONS = [
  { label: "Download Resume", style: { background: "#C4622D", color: "#FAF7F2" } },
  { label: "Get in Touch", style: { background: "transparent", color: "#1C1917", border: "1px solid rgba(28,25,23,0.2)" } },
];

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
  fontSize: number;
}

interface Flight {
  id: number;
  /** true: hero → bar. false: bar → hero */
  docking: boolean;
  /** Top of the visible viewport area (below the mobile nav) */
  topEdge: number;
  /** Set when reversing mid-flight: the previous stand-ins' last position */
  reversedFrom: Box[] | null;
}

function measure(el: Element): Box {
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height, fontSize: parseFloat(getComputedStyle(el).fontSize) };
}

function heroButtons(): HTMLElement[] {
  return Array.from(document.getElementById("hero-cta")?.children ?? []) as HTMLElement[];
}

export default function StickyCTA() {
  const [docked, setDocked] = useState(false);
  const [flight, setFlight] = useState<Flight | null>(null);

  const barButtons = useRef<(HTMLElement | null)[]>([]);
  const flyingButtons = useRef<(HTMLElement | null)[]>([]);
  const dockedRef = useRef(false);
  const flightRef = useRef<Flight | null>(null);
  const initialised = useRef(false);
  const flightId = useRef(0);

  const startFlight = useCallback((next: boolean, topEdge: number) => {
    const flying = flyingButtons.current.filter((el): el is HTMLElement => !!el);
    // Reversed mid-flight: carry on from wherever the stand-ins currently are
    const reversedFrom = flightRef.current && flying.length === BUTTONS.length ? flying.map(measure) : null;
    const f = { id: ++flightId.current, docking: next, topEdge, reversedFrom };
    flightRef.current = f;
    setFlight(f);
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      const heroCta = document.getElementById("hero-cta");
      if (!heroCta) return;
      const topEdge = desktop.matches ? 0 : MOBILE_NAV_HEIGHT;
      const dockLine = topEdge + BAR_PADDING_Y;
      const top = heroCta.getBoundingClientRect().top;
      const next = dockedRef.current ? top < dockLine + HYSTERESIS : top < dockLine;
      if (next === dockedRef.current) {
        initialised.current = true;
        return;
      }
      // flushSync: hide the hero buttons and show the stand-ins in this same frame. A deferred
      // render would let the page scroll on for a frame first, so the hand-off would visibly jump.
      flushSync(() => {
        // No flight on the first measurement (e.g. reloading mid-page) or for reduced-motion users
        if (initialised.current && !reducedMotion.matches) startFlight(next, topEdge);
        dockedRef.current = next;
        setDocked(next);
      });
      initialised.current = true;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [startFlight]);

  // Visibility of the real buttons is set imperatively so the flight can overlap them with the
  // stand-ins frame-accurately. visibility (not display) keeps the hero buttons' space in the
  // layout so the hero doesn't reflow.
  const setHeroVisible = (visible: boolean) => {
    const heroCta = document.getElementById("hero-cta");
    if (heroCta) heroCta.style.visibility = visible ? "" : "hidden";
  };
  const setBarVisible = (visible: boolean) => {
    barButtons.current.forEach((el) => { if (el) el.style.visibility = visible ? "visible" : "hidden"; });
  };

  // Outside a flight, exactly one set of real buttons is shown
  useLayoutEffect(() => {
    if (flight) return;
    setHeroVisible(!docked);
    setBarVisible(docked);
  }, [docked, flight]);

  // Drives the stand-ins frame by frame in viewport coordinates, in three phases:
  //  1. Take-off: the stand-ins sit exactly on top of the still-visible originals for a few frames,
  //     then the originals are hidden. (Show the copy first, then hide the original.)
  //  2. Flight: they travel to the target, which is re-measured every frame, so when flying back to
  //     the hero they home in on its *current* position while the user is still scrolling.
  //  3. Landing: the real target buttons are shown underneath first, and the stand-ins keep
  //     tracking them for a few frames before being removed.
  useLayoutEffect(() => {
    if (!flight) return;
    const originEls = flight.docking ? heroButtons() : barButtons.current;
    const targetEls = flight.docking ? barButtons.current : heroButtons();
    const fontSize = (el: Element | null) => parseFloat(getComputedStyle(el!).fontSize);
    const originFontSizes = originEls.map(fontSize);
    const targetFontSizes = targetEls.map(fontSize);
    const liveBox = (el: Element | null, size: number): Box => {
      const r = el!.getBoundingClientRect();
      return { left: r.left, top: r.top, width: r.width, height: r.height, fontSize: size };
    };
    const place = (el: HTMLElement, b: Box) => {
      // left/top rather than a transform: transforms promote the stand-in to its own GPU layer,
      // which rasterises the label differently from the real buttons
      el.style.left = `${b.left}px`;
      el.style.top = `${b.top}px`;
      el.style.width = `${b.width}px`;
      el.style.height = `${b.height}px`;
      el.style.fontSize = `${b.fontSize}px`;
    };

    let from = flight.reversedFrom;
    if (from) {
      // Reversing: the previous stand-ins were replaced in place, so neither real set is shown
      setHeroVisible(false);
      setBarVisible(false);
    }
    let takeoffFrames = 0;
    let landingFrames = 0;
    let start = 0;
    let raf = 0;

    const tick = (now: number) => {
      const flying = flyingButtons.current;

      if (!from) {
        // 1. Take-off
        const boxes = originEls.map((el, i) => {
          const box = liveBox(el, originFontSizes[i]);
          // A fast scroll can carry the hero buttons well past the top; start just above the edge
          return flight.docking ? { ...box, top: Math.max(box.top, flight.topEdge - box.height) } : box;
        });
        flying.forEach((el, i) => el && place(el, boxes[i]));
        if (++takeoffFrames > HANDOFF_FRAMES) {
          if (flight.docking) setHeroVisible(false);
          else setBarVisible(false);
          from = boxes;
          start = now;
        }
        raf = requestAnimationFrame(tick);
        return;
      }

      // 2. Flight
      let arrived = true;
      flying.forEach((el, i) => {
        if (!el) return;
        const progress = Math.min(1, Math.max(0, (now - start - i * FLIGHT_STAGGER_MS) / FLIGHT_DURATION_MS));
        if (progress < 1) arrived = false;
        const p = flightEase(progress);
        const a = from![i];
        const b = liveBox(targetEls[i], targetFontSizes[i]);
        const mix = (x: number, y: number) => x + (y - x) * p;
        place(el, { left: mix(a.left, b.left), top: mix(a.top, b.top), width: mix(a.width, b.width), height: mix(a.height, b.height), fontSize: mix(a.fontSize, b.fontSize) });
      });

      // 3. Landing
      if (arrived) {
        if (landingFrames === 0) {
          if (flight.docking) setBarVisible(true);
          else setHeroVisible(true);
        }
        if (++landingFrames > HANDOFF_FRAMES) {
          if (flightRef.current?.id === flight.id) {
            flightRef.current = null;
            flushSync(() => setFlight(null));
          }
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    tick(performance.now()); // position the first frame before paint
    return () => cancelAnimationFrame(raf);
  }, [flight]);

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const barButtonClass =
    "flex-1 sm:flex-none text-center font-mono-dm text-xs sm:text-sm tracking-wide px-4 sm:px-6 py-2.5 rounded-full transition-transform duration-300 hover:scale-105";

  return (
    <>
      {/* The bar stays mounted so its button slots can always be measured as flight targets.
          z-30: above page content, below the nav (z-50) and the mobile menu overlay (z-40) */}
      <div
        className="fixed left-0 right-0 top-[72px] lg:top-0 lg:left-20 z-30"
        style={{ pointerEvents: docked ? "auto" : "none" }}
      >
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "rgba(250,247,242,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(196,98,45,0.12)" }}
          initial={false}
          animate={{ opacity: docked ? 1 : 0, y: docked ? 0 : -8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
        <div className="relative flex items-center justify-center gap-3 px-6 py-3">
          <a
            ref={(el) => { barButtons.current[0] = el; }}
            href={RESUME_URL}
            download
            className={barButtonClass}
            style={BUTTONS[0].style}
          >
            {BUTTONS[0].label}
          </a>
          <button
            ref={(el) => { barButtons.current[1] = el; }}
            onClick={scrollToContact}
            className={barButtonClass}
            style={BUTTONS[1].style}
          >
            {BUTTONS[1].label}
          </button>
        </div>
      </div>

      {/* Stand-ins that travel between the hero and the bar (positioned by the flight effect).
          Size and font size are animated directly, rather than scaled, so the labels stay crisp. */}
      {flight &&
        BUTTONS.map((btn, i) => (
          <div
            key={`${flight.id}-${i}`}
            ref={(el) => { flyingButtons.current[i] = el; }}
            aria-hidden
            className="fixed z-[35] flex items-center justify-center whitespace-nowrap font-mono-dm tracking-wide rounded-full pointer-events-none"
            style={btn.style}
          >
            {btn.label}
          </div>
        ))}
    </>
  );
}
