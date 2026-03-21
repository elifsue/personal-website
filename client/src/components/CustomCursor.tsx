/* ============================================================
   CUSTOM CURSOR — Organic Modernism
   Three states:
   1. Default  — small dot + trailing ring
   2. Pointer  — ring expands (links, buttons)
   3. Text     — dot morphs into a thin I-beam (text nodes, inputs, textareas)
   ============================================================ */

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const ibeamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only on desktop
    if (window.innerWidth < 1024) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX  = 0;
    let ringY  = 0;
    let mode: "default" | "pointer" | "text" = "default";

    /* ── helpers ── */
    const setDefault = () => {
      if (mode === "default") return;
      mode = "default";
      if (dotRef.current) {
        dotRef.current.style.opacity = "1";
        dotRef.current.style.width   = "6px";
        dotRef.current.style.height  = "6px";
        dotRef.current.style.borderRadius = "50%";
      }
      if (ringRef.current) {
        ringRef.current.style.width   = "32px";
        ringRef.current.style.height  = "32px";
        ringRef.current.style.opacity = "0.4";
      }
      if (ibeamRef.current) ibeamRef.current.style.opacity = "0";
    };

    const setPointer = () => {
      if (mode === "pointer") return;
      mode = "pointer";
      if (dotRef.current) {
        dotRef.current.style.opacity = "1";
        dotRef.current.style.width   = "6px";
        dotRef.current.style.height  = "6px";
        dotRef.current.style.borderRadius = "50%";
      }
      if (ringRef.current) {
        ringRef.current.style.width   = "48px";
        ringRef.current.style.height  = "48px";
        ringRef.current.style.opacity = "0.6";
      }
      if (ibeamRef.current) ibeamRef.current.style.opacity = "0";
    };

    const setText = () => {
      if (mode === "text") return;
      mode = "text";
      // Hide the dot and shrink the ring
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) {
        ringRef.current.style.width   = "2px";
        ringRef.current.style.height  = "2px";
        ringRef.current.style.opacity = "0";
      }
      // Show the I-beam
      if (ibeamRef.current) ibeamRef.current.style.opacity = "1";
    };

    /* ── mouse move ── */
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.left = `${mouseX}px`;
        dotRef.current.style.top  = `${mouseY}px`;
      }
      if (ibeamRef.current) {
        ibeamRef.current.style.left = `${mouseX}px`;
        ibeamRef.current.style.top  = `${mouseY}px`;
      }

      // Determine cursor state from element under pointer
      const el = e.target as HTMLElement;
      if (!el) return;

      const tag = el.tagName.toLowerCase();
      const isInput =
        tag === "input" ||
        tag === "textarea" ||
        el.isContentEditable;

      const isInteractive =
        !!el.closest("a, button, [role='button'], select") &&
        !isInput;

      // Check if we're directly over a text node
      const isTextNode = (() => {
        if (isInput || isInteractive) return false;
        // Walk up to see if the element itself has visible text content
        const style = window.getComputedStyle(el);
        const hasText =
          el.childNodes.length > 0 &&
          Array.from(el.childNodes).some(
            (n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim()
          );
        return (
          hasText &&
          style.cursor !== "pointer" &&
          style.cursor !== "default" ||
          (hasText && tag === "p") ||
          (hasText && tag === "span") ||
          (hasText && tag === "h1") ||
          (hasText && tag === "h2") ||
          (hasText && tag === "h3") ||
          (hasText && tag === "h4") ||
          (hasText && tag === "li") ||
          (hasText && tag === "label")
        );
      })();

      if (isInput || isTextNode) {
        setText();
      } else if (isInteractive) {
        setPointer();
      } else {
        setDefault();
      }
    };

    /* ── ring animation loop ── */
    let animId: number;
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = `${ringX}px`;
        ringRef.current.style.top  = `${ringY}px`;
      }
      animId = requestAnimationFrame(animateRing);
    };
    animateRing();

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden lg:block"
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: "#C4622D",
          transition: "width 0.2s, height 0.2s, opacity 0.15s",
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 hidden lg:block"
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          border: "1px solid #C4622D",
          opacity: 0.4,
          transition: "width 0.3s ease, height 0.3s ease, opacity 0.3s ease",
        }}
      />
      {/* I-beam */}
      <div
        ref={ibeamRef}
        className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center"
        style={{
          opacity: 0,
          transition: "opacity 0.15s ease",
          gap: "1px",
        }}
      >
        {/* Top serif */}
        <div style={{ width: "8px", height: "1.5px", background: "#C4622D", borderRadius: "1px" }} />
        {/* Vertical stem */}
        <div style={{ width: "1.5px", height: "14px", background: "#C4622D", borderRadius: "1px" }} />
        {/* Bottom serif */}
        <div style={{ width: "8px", height: "1.5px", background: "#C4622D", borderRadius: "1px" }} />
      </div>
    </>
  );
}
