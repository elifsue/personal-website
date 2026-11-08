/* ============================================================
   MASCOT PARTICLES — small SVG/emoji sprites animated with the
   Web Animations API and removed as soon as they finish.
   Points come in viewport coordinates but are pinned to the bottom
   of the screen, like the mascots: on phones the visible screen
   grows and shrinks as the address bar hides and shows, and
   anything placed from the top would drift away from them
   ============================================================ */

/** Distance (px) from a viewport y to the bottom of the screen */
const fromBottom = (y: number) => window.innerHeight - y;

const svg = (body: string, size: number) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="display:block;overflow:visible">${body}</svg>`;

export const SHAPES = {
  star: (s = 18) => svg(`<path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z" fill="#FFD54A" stroke="#E0A100" stroke-width="1.2" stroke-linejoin="round"/>`, s),
  heart: (s = 16) => svg(`<path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.2 3.2 4.5 6.8 4.5c2.1 0 3.6 1.2 5.2 3.1 1.6-1.9 3.1-3.1 5.2-3.1 3.6 0 5.9 3.7 4.4 7.3C19.5 16.4 12 21 12 21z" fill="#FF7A93" stroke="#E2546F" stroke-width="1"/><ellipse cx="7.5" cy="8.5" rx="1.8" ry="1.1" fill="#fff" opacity=".7"/>`, s),
  note: (s = 18, color = "#C4622D") => svg(`<path d="M9 18a3 3 0 1 1-2-2.8V4.5l11-2.2V15a3 3 0 1 1-2-2.8V6.6L9 8z" fill="${color}"/>`, s),
  bolt: (s = 22) => svg(`<path d="M13.5 1.5L4 14h6.5l-1.5 8.5L19 9.5h-6.5z" fill="#FFE14D" stroke="#E0A100" stroke-width="1.2" stroke-linejoin="round"/>`, s),
  bubble: (s = 18) => svg(`<circle cx="12" cy="12" r="10" fill="rgba(150,205,255,.22)" stroke="rgba(80,150,230,.75)" stroke-width="1.2"/><path d="M6.5 9.5a6 6 0 0 1 4-4" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/>`, s),
  sparkle: (s = 14) => svg(`<path d="M12 1c.9 6 2.2 7.6 9 9.5-6.8 1.9-8.1 3.5-9 9.5-.9-6-2.2-7.6-9-9.5 6.8-1.9 8.1-3.5 9-9.5z" fill="#FFD54A"/>`, s),
  sweat: (s = 12) => svg(`<path d="M12 2C9 8 6 11 6 15a6 6 0 0 0 12 0c0-4-3-7-6-13z" fill="#8FD0F5" stroke="#4BA6DA" stroke-width="1"/>`, s),
  /** Anime "anger vein" mark */
  anger: (s = 20) => svg(`<g stroke="#E0384B" stroke-width="2.8" stroke-linecap="round" fill="none"><path d="M9 3.5c0 3 -2 5 -5.5 5.5"/><path d="M15 3.5c0 3 2 5 5.5 5.5"/><path d="M9 20.5c0-3-2-5-5.5-5.5"/><path d="M15 20.5c0-3 2-5 5.5-5.5"/></g>`, s),
  /** Dust puff kicked up by Rollout */
  dust: (s = 14) => svg(`<circle cx="12" cy="12" r="9" fill="rgba(200,185,165,.55)"/>`, s),
  /** Jigglypuff's marker pen */
  marker: (s = 26) => svg(`<g transform="rotate(35 12 12)"><rect x="9" y="1" width="6" height="15" rx="1.5" fill="#2B2B2B"/><rect x="9" y="11" width="6" height="2" fill="#E0384B"/><path d="M9.5 16h5l-1.6 5.5h-1.8z" fill="#444"/><path d="M11.3 21.5h1.4l-.7 1.8z" fill="#111"/></g>`, s),
  /** Big startled "!" */
  exclaim: (s = 26) => `<span style="display:block;font:800 ${s}px 'DM Sans',sans-serif;line-height:1;color:#E0384B;-webkit-text-stroke:2px #FFFDF8;paint-order:stroke">!</span>`,
  /** Three short anime shock lines, fanning out to the right (rotate for the other side) */
  shock: (s = 22) => svg(`<g stroke="#1C1917" stroke-width="2.2" stroke-linecap="round"><path d="M4 6l7 3"/><path d="M4 12h8"/><path d="M4 18l7-3"/></g>`, s),
  z: (s = 14) => `<span style="display:block;font:500 ${s}px 'DM Mono',monospace;color:#6B6560">z</span>`,
  /** Rain Dance's little rain cloud */
  cloud: (s = 60) => svg(`<path d="M7 18h10.5a4.5 4.5 0 0 0 .6-8.96A6 6 0 0 0 6.6 8.2 4.9 4.9 0 0 0 7 18z" fill="#DCE3EC" stroke="#9AA7B8" stroke-width="1"/><path d="M8.5 11.5a3 3 0 0 1 3-2.5" stroke="#fff" stroke-width="1.2" fill="none" stroke-linecap="round"/>`, s),
  /** Rock, paper or scissors, held up on a little card */
  hand: (emoji: string, s = 26) =>
    `<span style="display:flex;align-items:center;justify-content:center;width:${s * 1.6}px;height:${s * 1.6}px;border-radius:30%;background:#FFFDF8;border:1px solid rgba(196,98,45,.3);box-shadow:0 3px 8px rgba(28,25,23,.15);font-size:${s}px;line-height:1">${emoji}</span>`,
  /** A scrap of Celebrate's confetti */
  confetti: (s = 9, color = "#FF7A93") => svg(`<rect x="7" y="3" width="10" height="18" rx="2" fill="${color}"/>`, s),
  /** Dazzling Gleam's rainbow: arcs filling the top half of the box */
  rainbow: (s = 120) => svg(
    ["#FF6B6B", "#FFA94D", "#FFD43B", "#69DB7C", "#4DABF7", "#B197FC"]
      .map((c, i) => { const r = 10.5 - i * 1.3; return `<path d="M${12 - r} 20a${r} ${r} 0 0 1 ${2 * r} 0" stroke="${c}" stroke-width="1.35" fill="none" opacity=".9"/>`; })
      .join(""),
    s,
  ),
};

export const rand = (a: number, b: number) => a + Math.random() * (b - a);

export interface SpawnOpts {
  dur?: number;
  delay?: number;
  rot?: number;
  scale?: number;
  sway?: number;
  /** Pops up and stays put, all there until right at the end (instead of drifting off as it fades) */
  hold?: boolean;
}

export type Spawn = (html: string, from: { x: number; y: number }, dx: number, dy: number, opts?: SpawnOpts) => Animation;

/** Creates a spawner that floats particles from a point by (dx, dy), fading in and out */
export function makeSpawner(layer: HTMLElement, reduce: boolean): Spawn {
  return (html, from, dx, dy, opts = {}) => {
    const { dur = 1200, delay = 0, rot = 0, scale = 1, sway = 0, hold = false } = opts;
    const el = document.createElement("div");
    el.innerHTML = html;
    el.style.cssText = `position:absolute;left:${from.x}px;bottom:${fromBottom(from.y)}px;will-change:transform,opacity;opacity:0`;
    layer.appendChild(el);
    // Centred on the point (it's anchored by its bottom edge, hence +50%)
    const t = (px: number, py: number, s: number, r: number) => `translate(-50%,50%) translate(${px}px,${py}px) scale(${s}) rotate(${r}deg)`;
    const anim = hold ? el.animate(
      [
        { transform: t(0, 0, 0.3, 0), opacity: 0 },
        { transform: t(dx * 0.6, dy * 0.6, scale * 1.12, rot), opacity: 1, offset: 0.08 },
        { transform: t(dx, dy, scale, rot), opacity: 1, offset: 0.14 },
        { transform: t(dx, dy, scale, rot), opacity: 1, offset: 0.88 },
        { transform: t(dx, dy, scale * 0.9, rot), opacity: 0 },
      ],
      { duration: dur, delay, easing: "linear", fill: "both" },
    ) : el.animate(
      [
        { transform: t(0, 0, 0.3, 0), opacity: 0 },
        { transform: t(dx * 0.2 + sway, dy * 0.2, scale, rot * 0.2), opacity: 1, offset: 0.18 },
        { transform: t(dx * 0.6 - sway, dy * 0.6, scale, rot * 0.6), opacity: 1, offset: 0.6 },
        { transform: t(dx, dy, scale * 0.85, rot), opacity: 0 },
      ],
      { duration: reduce ? 600 : dur, delay, easing: "cubic-bezier(.2,.7,.3,1)", fill: "both" },
    );
    anim.onfinish = () => el.remove();
    return anim;
  };
}

/** Creates a spawner that moves one particle through a list of points (e.g. a marker scribbling) */
export function makePathSpawner(layer: HTMLElement) {
  return (html: string, pts: { x: number; y: number }[], dur: number) => {
    const el = document.createElement("div");
    el.innerHTML = html;
    el.style.cssText = "position:absolute;left:0;bottom:0;will-change:transform,opacity";
    layer.appendChild(el);
    // Its tip (15% across, 85% down) on each point, measured up from the bottom of the screen
    const frames = pts.map((p, i) => ({
      transform: `translate(${p.x}px,${-fromBottom(p.y)}px) translate(-15%,15%)`,
      opacity: i === 0 || i === pts.length - 1 ? 0 : 1,
    }));
    const anim = el.animate(frames, { duration: dur, easing: "linear", fill: "both" });
    anim.onfinish = () => el.remove();
  };
}
