/* ============================================================
   PERCHES — the parts of the page the mascots can land and stand on:
   anything that looks solid (pictures, cards, buttons, coloured
   bands) and big headings, where they stand on the tops of the
   letters. Landing is found by hit-testing the page under their feet
   as they fall, so only what's actually visible there can catch them
   ============================================================ */

/** The top edge of something, in viewport px: `top` is its height halfway along, and it may slope (a
    tilted card) */
export interface Surface {
  top: number;
  left: number;
  right: number;
  slope: number;
}
/** Height of a top edge at x */
export const topAt = (s: Surface, x: number) => s.top + s.slope * (x - (s.left + s.right) / 2);
/** Something being stood on. Text is stood on line by line: `topDoc` (the page y of the line's top)
    says which line */
export interface Perch {
  el: Element;
  text: boolean;
  topDoc: number;
  /** When it was last checked that nothing's come in front of it */
  checked: number;
}

type Kind = "box" | "text" | null;
/** Text at least this big (px) can be stood on */
const TEXT_MIN_PX = 26;
/** Narrower than this (px) and it's not worth standing on */
const MIN_W = 32;
const SOLID_TAGS = new Set(["IMG", "VIDEO", "CANVAS", "IFRAME", "svg"]);
const NEVER = new Set(["HTML", "BODY", "MAIN"]);

/* Any CSS colour → [r, g, b, a], by painting a pixel with it (handles oklch and friends too) */
const colours = new Map<string, [number, number, number, number]>();
let pixel: CanvasRenderingContext2D | null = null;
const rgba = (colour: string) => {
  let c = colours.get(colour);
  if (!c) {
    pixel ??= Object.assign(document.createElement("canvas"), { width: 1, height: 1 }).getContext("2d", { willReadFrequently: true })!;
    pixel.clearRect(0, 0, 1, 1);
    pixel.fillStyle = "#000";
    pixel.fillStyle = colour;
    pixel.fillRect(0, 0, 1, 1);
    const d = pixel.getImageData(0, 0, 1, 1).data;
    c = [d[0], d[1], d[2], d[3] / 255];
    colours.set(colour, c);
  }
  return c;
};
/** The colour showing behind an element: its nearest ancestor with a solid background */
const behind = (el: Element) => {
  for (let a = el.parentElement; a; a = a.parentElement) {
    const c = rgba(getComputedStyle(a).backgroundColor);
    if (c[3] > 0.9) return c;
  }
  return [255, 255, 255, 1] as const;
};

/** Steeper than this and it's not something to stand on */
const MAX_SLOPE = Math.tan((20 * Math.PI) / 180);

/* 2D linear maps [a, b, c, d]: x' = a·x + c·y, y' = b·x + d·y (like CSS matrix()) */
type Lin = [number, number, number, number];
const mul = (m: Lin, n: Lin): Lin => [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3]];
const angle = (v: string) => {
  const m = v.match(/(-?[\d.]+)(deg|rad|turn|grad)\s*$/);
  if (!m) return 0;
  const n = parseFloat(m[1]);
  return m[2] === "deg" ? (n * Math.PI) / 180 : m[2] === "turn" ? n * 2 * Math.PI : m[2] === "grad" ? (n * Math.PI) / 200 : n;
};
/** How an element's own transforms (rotate, scale and transform, in the order CSS applies them) turn and stretch it */
const ownLin = (cs: CSSStyleDeclaration): Lin => {
  let m: Lin = [1, 0, 0, 1];
  if (cs.rotate && cs.rotate !== "none") {
    const a = angle(cs.rotate);
    m = mul(m, [Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a)]);
  }
  if (cs.scale && cs.scale !== "none") {
    const [sx, sy = sx] = cs.scale.split(" ").map(parseFloat);
    m = mul(m, [sx, 0, 0, sy]);
  }
  const t = cs.transform.match(/^matrix(3d)?\(([^)]+)\)/);
  if (t) {
    const v = t[2].split(",").map(parseFloat);
    m = mul(m, t[1] ? [v[0], v[1], v[4], v[5]] : [v[0], v[1], v[2], v[3]]);
  }
  return m;
};
/** The same for an element and everything it's in */
const totalLin = (el: Element): Lin => {
  let m: Lin = [1, 0, 0, 1];
  for (let a: Element | null = el; a && a !== document.documentElement; a = a.parentElement) m = mul(ownLin(getComputedStyle(a)), m);
  return m;
};
/** An element's top edge as drawn, turned and stretched by its transforms (a transformed box's centre is
    always the middle of its bounding box, wherever it's transformed about) */
const edgeOf = (el: Element) => {
  const r = el.getBoundingClientRect();
  const w = el instanceof HTMLElement ? el.offsetWidth : r.width;
  const h = el instanceof HTMLElement ? el.offsetHeight : r.height;
  const m = el instanceof HTMLElement ? totalLin(el) : ([1, 0, 0, 1] as Lin);
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const x0 = cx + m[0] * (-w / 2) + m[2] * (-h / 2), y0 = cy + m[1] * (-w / 2) + m[3] * (-h / 2);
  const x1 = cx + m[0] * (w / 2) + m[2] * (-h / 2), y1 = cy + m[1] * (w / 2) + m[3] * (-h / 2);
  if (x1 - x0 < 1) return null; // flipped or turned on its side
  const slope = (y1 - y0) / (x1 - x0);
  if (Math.abs(slope) > MAX_SLOPE) return null;
  return { top: (y0 + y1) / 2, left: x0, right: x1, slope, bottom: r.bottom, scale: Math.hypot(m[0], m[1]), w, h };
};
const ownText = (el: Element) => {
  return Array.from(el.childNodes).some((n) => n.nodeType === Node.TEXT_NODE && !!n.textContent!.trim());
};

export function makePerches() {
  /** What each element is, worked out the first time it's hit (forgotten when the layout or fonts change) */
  let kinds = new WeakMap<Element, { kind: Kind; clips: Element[]; radius: string; capGap: number }>();
  const info = (el: Element) => {
    let k = kinds.get(el);
    if (k) return k;
    k = { kind: null, clips: [], radius: "0px", capGap: 0 };
    kinds.set(el, k);
    if (!(el instanceof HTMLElement || (el instanceof SVGSVGElement && !el.ownerSVGElement))) return k;
    if (NEVER.has(el.tagName) || el.closest("[data-mascot-ui]")) return k;
    const cs = getComputedStyle(el);
    const bg = rgba(cs.backgroundColor);
    const ground = behind(el);
    const stands = bg[3] > 0.25 && Math.abs(bg[0] - ground[0]) + Math.abs(bg[1] - ground[1]) + Math.abs(bg[2] - ground[2]) > 24;
    const edged = parseFloat(cs.borderTopWidth) >= 1 && cs.borderTopStyle !== "none" && rgba(cs.borderTopColor)[3] >= 0.15;
    if (SOLID_TAGS.has(el.tagName) || stands || edged || cs.backgroundImage !== "none") {
      k.kind = "box";
      k.radius = cs.borderTopLeftRadius;
    } else if (parseFloat(cs.fontSize) >= TEXT_MIN_PX && ownText(el)) {
      k.kind = "text";
      // A line of text's box starts at the font's ascent; the tops of the capitals are a bit below that
      // (as a fraction of the font size, which can change with the window)
      const ctx = document.createElement("canvas").getContext("2d")!;
      ctx.font = `${cs.fontStyle} ${cs.fontWeight} 100px ${cs.fontFamily}`;
      const m = ctx.measureText("H");
      k.capGap = Math.max(0, m.fontBoundingBoxAscent - m.actualBoundingBoxAscent) / 100;
    }
    // Whatever crops it (a rounded card holding a picture, say) crops its top edge too
    for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
      const s = getComputedStyle(a);
      if (s.overflowX !== "visible" || s.overflowY !== "visible") k.clips.push(a);
    }
    return k;
  };

  /** Whether it can be seen right now (fading in on scroll, a hidden hover overlay…) */
  const seen = new WeakMap<Element, { at: number; ok: boolean }>();
  const visible = (el: Element) => {
    const now = performance.now();
    const s = seen.get(el);
    if (s && now - s.at < 250) return s.ok;
    let opacity = 1;
    let ok = getComputedStyle(el).visibility === "visible";
    for (let a: Element | null = el; ok && a; a = a.parentElement) {
      opacity *= parseFloat(getComputedStyle(a).opacity);
      ok = opacity > 0.6;
    }
    seen.set(el, { at: now, ok });
    return ok;
  };

  const boxTop = (el: Element): Surface | null => {
    const k = info(el);
    const e = edgeOf(el);
    if (!e) return null;
    const yAt = (l: { x: number; y: number; slope: number }, x: number) => l.y + l.slope * (x - l.x);
    let line = { x: (e.left + e.right) / 2, y: e.top, slope: e.slope };
    // Rounded corners drop away at the ends (CSS never rounds a corner past half the box)
    const radius = k.radius.endsWith("%") ? (parseFloat(k.radius) / 100) * e.w : parseFloat(k.radius) || 0;
    const round = Math.min(radius, e.w / 2, e.h / 2) * e.scale * 0.6;
    let left = e.left + round, right = e.right - round, bottom = e.bottom;
    for (const a of k.clips) {
      const c = edgeOf(a);
      if (!c) continue;
      const cl = { x: (c.left + c.right) / 2, y: c.top, slope: c.slope };
      const mid = (left + right) / 2;
      if (yAt(cl, mid) > yAt(line, mid)) line = cl;
      left = Math.max(left, c.left);
      right = Math.min(right, c.right);
      bottom = Math.min(bottom, c.bottom);
    }
    const mid = (left + right) / 2;
    if (right - left < MIN_W || bottom - yAt(line, mid) < 4) return null;
    return { top: yAt(line, mid), left, right, slope: line.slope };
  };

  const lines = (el: Element): Surface[] => {
    const range = document.createRange();
    range.selectNodeContents(el);
    const rects = Array.from(range.getClientRects()).filter((r) => r.width > 1).sort((a, b) => a.top - b.top);
    const out: { top: number; bottom: number; left: number; right: number }[] = [];
    for (const r of rects) {
      const line = out[out.length - 1];
      if (line && r.top < line.bottom - Math.min(r.height, line.bottom - line.top) / 2) {
        line.top = Math.min(line.top, r.top);
        line.left = Math.min(line.left, r.left);
        line.right = Math.max(line.right, r.right);
      } else out.push({ top: r.top, bottom: r.bottom, left: r.left, right: r.right });
    }
    const gap = info(el).capGap * parseFloat(getComputedStyle(el).fontSize);
    return out.filter((l) => l.right - l.left >= MIN_W).map((l) => ({ top: l.top + gap, left: l.left, right: l.right, slope: 0 }));
  };

  /** Whether something solid has come in front of a top edge at x (a card shuffled on top of it, say) */
  const covered = (p: Perch, x: number, top: number) => {
    if (top < 0 || top + 2 >= window.innerHeight) return false;
    for (const el of document.elementsFromPoint(x, top + 2)) {
      if (el === p.el || el.contains(p.el) || p.el.contains(el)) return false;
      if (info(el).kind !== "box" || !visible(el)) continue;
      const s = boxTop(el);
      if (s && topAt(s, x) < top - 2) return true;
    }
    return false;
  };
  /** A text perch is the whole run of text it's part of (a heading, not the emphasised word in it) */
  const textOwner = (el: Element) => {
    while (el.parentElement && getComputedStyle(el).display.startsWith("inline") && info(el.parentElement).kind === "text") el = el.parentElement;
    return el;
  };

  return {
    /** Forget what everything is (the layout or the fonts have changed) */
    reset() {
      kinds = new WeakMap();
    },

    /** Where the top of what it's standing on at x is now (null if it's gone, hidden, covered up or too
        small to stand on) */
    surfaceOf(p: Perch, x: number): Surface | null {
      if (!p.el.isConnected || !visible(p.el)) return null;
      let s: Surface | null = null;
      if (!p.text) s = boxTop(p.el);
      else {
        for (const l of lines(p.el)) if (Math.abs(l.top + window.scrollY - p.topDoc) < Math.abs((s?.top ?? Infinity) + window.scrollY - p.topDoc)) s = l;
        if (!s || Math.abs(s.top + window.scrollY - p.topDoc) > 40) return null;
        p.topDoc = s.top + window.scrollY;
      }
      const now = performance.now();
      if (s && now - p.checked > 250) {
        p.checked = now;
        if (covered(p, x, topAt(s, x))) return null;
      }
      return s;
    },

    /** Feet at x went from y0 down to y1 (viewport px, y0 in this frame's scroll position): the top edge
        they passed, if any, that `fits` says it can stand on there (given the top edge and whose it is). Something solid in front of a top
        edge hides it */
    find(x: number, y0: number, y1: number, fits: (s: Surface, el: Element) => boolean): { perch: Perch; surface: Surface } | null {
      const steps = Math.min(8, Math.max(1, Math.ceil((y1 - y0) / 10)));
      for (let i = 1; i <= steps; i++) {
        const y = y0 + ((y1 - y0) * i) / steps + 1;
        if (y < 0 || y >= window.innerHeight) continue;
        for (const el of document.elementsFromPoint(x, y)) {
          const k = info(el);
          if (!k.kind || !visible(el)) continue;
          if (k.kind === "text") {
            const owner = textOwner(el);
            for (const l of lines(owner)) {
              if (l.top >= y0 - 1 && l.top <= y1 && x >= l.left && x <= l.right && fits(l, owner)) return { perch: { el: owner, text: true, topDoc: l.top + window.scrollY, checked: performance.now() }, surface: l };
            }
            continue;
          }
          const s = boxTop(el);
          if (!s) continue;
          const top = topAt(s, x);
          if (top >= y0 - 1 && top <= y1 && fits(s, el)) return { perch: { el, text: false, topDoc: s.top + window.scrollY, checked: performance.now() }, surface: s };
          if (top < y0 - 1) break; // in front of everything under it
        }
      }
      return null;
    },
  };
}
