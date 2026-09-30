/* Character Pad Case Study — Android Unicode App Redesign */


import { Children, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { Section, CaseStudyLayout } from "@/components/case-study";
import { projectConfigs } from "@/config/projects";


const IMG = `${import.meta.env.BASE_URL}images/character-pad`;

const ASSETS = {
  appLogo: `${import.meta.env.BASE_URL}images/character-pad-logo.png`,
  figmaLogo: `${IMG}/figma-logo.png`,
  claudeCodeLogo: `${IMG}/claude-code-logo.png`,
  notionLogo: `${IMG}/notion-logo.png`,
  complexityDemo: `${IMG}/complexity-demo.mp4`,
  complexityDemoPoster: `${IMG}/complexity-demo-poster.png`,
  productOwnerCollaboration: `${IMG}/product-owner-collaboration.png`,
  userReviews: `${IMG}/user-reviews.png`,
  claudeCodeTerminal: `${IMG}/claude-code-terminal.png`,
  reviewAnalysisReport: `${IMG}/play-store-review-analysis.pdf`,
  reviewAnalysisReportPreview: `${IMG}/play-store-review-analysis.png`,
  studentEmoji: `${IMG}/student-emoji.png`,
  artistEmoji: `${IMG}/artist-emoji.png`,
  teacherEmoji: `${IMG}/teacher-emoji.png`,
  technologistEmoji: `${IMG}/technologist-emoji.png`,
  unicodePadLogo: `${IMG}/unicode-pad-logo.png`,
  competitiveAnalysis: `${IMG}/competitive-analysis.png`,
  newBadge: `${IMG}/new-badge.png`,
  reviewsSearch: `${IMG}/reviews-search.png`,
  searchByDrawingWireframes: `${IMG}/search-by-drawing-wireframes.png`,
  searchByDrawing: `${IMG}/search-by-drawing.png`,
  nameAliases: `${IMG}/name-aliases.png`,
  recentSearches: `${IMG}/recent-searches.png`,
  reviewsOnboarding: `${IMG}/reviews-onboarding.png`,
  onboardingFlow: `${IMG}/onboarding-flow.png`,
  onboardingTooltips: `${IMG}/onboarding-tooltips.png`,
  viewTypes: `${IMG}/view-types.png`,
  basicAndAdvancedViews: `${IMG}/basic-and-advanced-views.png`,
  faqScreen: `${IMG}/faq-screen.png`,
  reviewsScrolling: `${IMG}/reviews-scrolling.png`,
  fastScroller: `${IMG}/fast-scroller.png`,
  reviewsKeyboard: `${IMG}/reviews-keyboard.png`,
  keyboardApps: `${IMG}/keyboard-apps.png`,
  iconKeyboard: `${IMG}/icon-keyboard.svg`,
  iconClipboard: `${IMG}/icon-clipboard.svg`,
  clipboardWidget: `${IMG}/clipboard-widget.png`,
  clipboardWidgetFlow: `${IMG}/clipboard-widget-flow.png`,
  reviewsTextComposer: `${IMG}/reviews-text-composer.png`,
  textComposer: `${IMG}/text-composer.png`,
  reviewsCharacterSize: `${IMG}/reviews-character-size.png`,
  characterSize: `${IMG}/character-size.png`,
  adaptiveColumns: `${IMG}/adaptive-columns.png`,
  characterDialog: `${IMG}/character-dialog.png`,
  characterBlocks: `${IMG}/character-blocks.png`,
  themeColorDialog: `${IMG}/theme-color-dialog.png`,
  rateAppDialog: `${IMG}/rate-app-dialog.png`,
  usabilityTest: `${IMG}/usability-test.png`,
  searchResultsHeader: `${IMG}/search-results-header.png`,
  searchResultsStates: `${IMG}/search-results-states.png`,
  iconSystem: `${IMG}/icon-system.png`,
  figmaComponents: `${IMG}/figma-components.png`,
  figmaScreens: `${IMG}/figma-screens.png`,
  figmaInteractions: `${IMG}/figma-interactions.png`,
  iconCustomBlocks: `${IMG}/icon-custom-blocks.svg`,
  iconFeedbackFlow: `${IMG}/icon-feedback-flow.svg`,
  iconPositiveFeedback: `${IMG}/icon-positive-feedback.svg`,
  iconAi: `${IMG}/icon-ai.svg`,
  iconRealNeed: `${IMG}/icon-real-need.svg`,
};

const LIGHT = "#FAF7F2";
const SAND = "#F5F0EA";
/* Whichever of the two beiges the enclosing band isn't using — set per band by Chapter */
const ALT_SURFACE = "var(--surface-alt)";


type Area = "Search" | "Onboarding" | "Navigation" | "Usability";

const AREAS: Area[] = ["Search", "Onboarding", "Navigation", "Usability"];

const CATEGORY_COLORS: Record<string, string> = {
  Search: "#3B82F6",
  Onboarding: "#8B5CF6",
  Navigation: "#F59E0B",
  Usability: "#D63384",
};

function getCategoryColor(area: string): string {
  return CATEGORY_COLORS[area] || "#E67E22";
}

const userReviews: { id: number; finding: string; severity: "High" | "Medium" | "Low"; complaints: number; voices: number; area: Area }[] = [
  { id: 1, finding: "Hard to Find Specific Characters / Symbols", severity: "High", complaints: 87, voices: 367, area: "Search" },
  { id: 2, finding: "Characters Not Displayed / Blank Boxes / Unsupported", severity: "High", complaints: 47, voices: 244, area: "Onboarding" },
  { id: 3, finding: "Language Barrier (English Only)", severity: "High", complaints: 26, voices: 240, area: "Search" },
  { id: 4, finding: "Difficult to Use / Not Intuitive / Confusing UX", severity: "High", complaints: 46, voices: 135, area: "Onboarding" },
  { id: 5, finding: "Accidental Text Deletion (Clear Button Placement)", severity: "High", complaints: 2, voices: 94, area: "Usability" },
  { id: 6, finding: "Not a Keyboard / Expected Keyboard Integration", severity: "Medium", complaints: 26, voices: 120, area: "Navigation" },
  { id: 7, finding: "Accidental Scrolling", severity: "Medium", complaints: 3, voices: 85, area: "Navigation" },
  { id: 8, finding: "Text Composer Placement Causes Search Bar Confusion", severity: "Medium", complaints: 3, voices: 74, area: "Usability" },
  { id: 9, finding: "Characters Too Small / No Zoom", severity: "Medium", complaints: 4, voices: 31, area: "Usability" },
  { id: 10, finding: "Floating Clipboard Quick Access", severity: "Low", complaints: 5, voices: 37, area: "Navigation" },
  { id: 11, finding: "Cannot Create Custom Characters", severity: "Low", complaints: 6, voices: 27, area: "Onboarding" },
  { id: 12, finding: "Floating Clipboard Sizing Configuration", severity: "Low", complaints: 4, voices: 24, area: "Usability" },
];

const areaStats = AREAS.map((area) => {
  const findings = userReviews.filter((r) => r.area === area);
  return {
    area,
    findings: findings.length,
    complaints: findings.reduce((sum, r) => sum + r.complaints, 0),
    voices: findings.reduce((sum, r) => sum + r.voices, 0),
  };
});
const totalVoices = areaStats.reduce((sum, s) => sum + s.voices, 0);
const maxVoices = Math.max(...areaStats.map((s) => s.voices));
const searchShare = Math.round((areaStats.find((s) => s.area === "Search")!.voices / totalVoices) * 100);

const userTypes = [
  { name: "The Academic / Student", emoji: ASSETS.studentEmoji, desc: "A student or researcher who needs mathematical symbols, Greek letters, subscripts, and superscripts for scientific writing.", why: "Academic work requires specialized notation (e.g., ∑, Δ, ², ³, α, β) unavailable on standard keyboards. They value Favorites and Recents for repeated quick access." },
  { name: "The Social Media Creative", emoji: ASSETS.artistEmoji, desc: "A content creator who uses decorative Unicode, fancy text, and unique symbols to style their social media posts and bios.", why: "Social platforms limit formatting, so users rely on Unicode as a workaround to stand out. They value browsing variety and the Text Composer for building styled strings." },
  { name: "The Developer / Technical Professional", emoji: ASSETS.technologistEmoji, desc: "A developer or designer who needs Unicode codepoints, HTML entities, and special symbols for coding or documentation.", why: "Developers need to reference or insert characters by codepoint for debugging, testing, or embedding symbols. They value the Character Dialog showing Unicode/HTML details." },
  { name: "The Multilingual Communicator", emoji: ASSETS.teacherEmoji, desc: "A multilingual user needing characters from non-Latin scripts or diacritical marks their keyboard does not support.", why: "Standard keyboards may not cover every script or special character for less common languages. They rely on the comprehensive library and Supported Characters filter." },
];

const solutions: { title: string; area: Area; desc: string; isNew: boolean }[] = [
  { title: "Search by drawing characters", area: "Search", desc: "Allows users to draw the character they need, solving the core discoverability issue for users who recognize a character visually but don't know its name.", isNew: true },
  { title: "Name aliases for commonly used characters", area: "Search", desc: "Expands search accuracy by mapping informal names to characters (e.g., \"sigma\" for Σ), reducing failed searches.", isNew: true },
  { title: "Recent searches", area: "Search", desc: "Provides quick access to previously searched terms, minimizing repetitive effort for returning users.", isNew: true },
  { title: "Simpler onboarding UX without technical jargon", area: "Onboarding", desc: "Removes confusing technical language from the initial setup, making the app accessible to non-technical users.", isNew: false },
  { title: "Tutorial on first app launch", area: "Onboarding", desc: "Guides new users through core features, directly tackling the \"difficult to use / not intuitive\" complaints.", isNew: true },
  { title: "FAQ introduced", area: "Onboarding", desc: "Addresses recurring questions about unsupported characters and blank boxes, reducing frustration and negative reviews.", isNew: true },
  { title: "Clipboard Widget for quick access", area: "Navigation", desc: "A new home screen widget that opens the clipboard directly without needing to launch the app, streamlining repeated use.", isNew: true },
  { title: "Fast Scroller that shows on scroll and auto-hides", area: "Navigation", desc: "Replaces the problematic always-visible fast scroller, solving accidental trigger issues while maintaining navigation efficiency.", isNew: false },
  { title: "Text Composer redesign", area: "Usability", desc: "Removed the clear button entirely and moved the text composer to the bottom, preventing accidental deletion and confusion with the search bar.", isNew: false },
  { title: "Adaptive character size", area: "Usability", desc: "Replaced columns count settings with a single adaptive character size setting that automatically accommodates different screen sizes.", isNew: false },
];

const themeColors = [
  { hex: "#F44336", name: "Red" },
  { hex: "#E91E63", name: "Pink" },
  { hex: "#9C27B0", name: "Purple" },
  { hex: "#673AB7", name: "Deep Purple" },
  { hex: "#3F51B5", name: "Indigo" },
  { hex: "#2196F3", name: "Blue" },
  { hex: "#03A9F4", name: "Light Blue" },
  { hex: "#00BCD4", name: "Cyan" },
  { hex: "#009688", name: "Teal" },
  { hex: "#4CAF50", name: "Green" },
  { hex: "#8BC34A", name: "Light Green" },
  { hex: "#CDDC39", name: "Lime" },
  { hex: "#FFEB3B", name: "Yellow" },
  { hex: "#FFC107", name: "Amber" },
  { hex: "#FF9800", name: "Orange" },
  { hex: "#FF5722", name: "Deep Orange" },
  { hex: "#795548", name: "Brown" },
  { hex: "#9E9E9E", name: "Gray" },
  { hex: "#607D8B", name: "Blue Gray" },
  { hex: "#000000", name: "Black" },
  { hex: "#FFFFFF", name: "White" },
];


function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-semibold" style={{ color: "#1C1917" }}>{children}</strong>;
}

/* Explanatory paragraphs under a slide title */
function Explanation({ className = "mb-10", children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`space-y-4 text-base md:text-lg leading-relaxed max-w-3xl ${className}`} style={{ color: "#6B6560" }}>
      {children}
    </div>
  );
}

function AreaChip({ area, dark = false }: { area: string; dark?: boolean }) {
  const color = CATEGORY_COLORS[area];
  const style = color
    ? { background: `${color}${dark ? "30" : "20"}`, color }
    : { background: "rgba(255,255,255,0.1)", color: "#CCCCCC" };
  return (
    <span className="inline-block px-3 py-1 rounded-full font-mono-dm text-xs tracking-wide whitespace-nowrap" style={style}>
      {area}
    </span>
  );
}

/* Dark band that opens a chapter, mirroring the deck's divider slides */
function ChapterDivider({ id, num, chips = [], children }: { id: string; num: string; chips?: string[]; children: ReactNode }) {
  return (
    <div id={id} className="px-8 lg:px-32 py-16 md:py-20 overflow-hidden" style={{ background: "#3C3C3C", fontVariantNumeric: "lining-nums" }}>
      <Section>
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl md:text-5xl mb-5" style={{ color: "#FFFFFF", fontWeight: 300 }}>
              {children}
            </h2>
            {chips.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {chips.map((chip) => <AreaChip key={chip} area={chip} dark />)}
              </div>
            )}
          </div>
          <span
            aria-hidden="true"
            className="font-display text-7xl md:text-9xl font-bold leading-none select-none"
            style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.35)" }}
          >
            {num}
          </span>
        </div>
      </Section>
    </div>
  );
}

/* Gives every slide its own full-width band, alternating between the two beiges */
function Chapter({ children }: { children: ReactNode }) {
  return (
    <>
      {Children.toArray(children).map((child, i) => {
        const [background, alt] = i % 2 === 0 ? [SAND, LIGHT] : [LIGHT, SAND];
        return (
          <div key={i} className="px-8 lg:px-32 py-20" style={{ background, "--surface-alt": alt, fontVariantNumeric: "lining-nums" } as CSSProperties}>
            {child}
          </div>
        );
      })}
    </>
  );
}

/* One slide of the deck: title on the left, area chip (or custom aside) on the right */
function Slide({ title, area, aside, children }: { title?: ReactNode; area?: Area; aside?: ReactNode; children: ReactNode }) {
  const right = aside ?? (area && <AreaChip area={area} />);
  return (
    <Section>
      {(title || right) && (
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          {title && (
            <h3 className="font-display text-2xl md:text-3xl max-w-6xl text-balance" style={{ color: "#1C1917", fontWeight: 300 }}>
              {title}
            </h3>
          )}
          {right && <div className="ml-auto">{right}</div>}
        </div>
      )}
      {children}
    </Section>
  );
}

function HowMightWe({ area, lead = "How Might We...", review, answer, children }: { area: Area; lead?: string; review?: { src: string; alt: string }; answer?: ReactNode; children: ReactNode }) {
  return (
    <Slide area={area}>
      <div className={`grid gap-10 items-center ${review ? "lg:grid-cols-[3fr_2fr]" : ""}`}>
        <div className="max-w-2xl">
          <h3 className="font-display text-xl mb-4" style={{ color: "#8D5E3C", fontWeight: 300 }}>{lead}</h3>
          <div className="font-display text-3xl md:text-4xl leading-snug space-y-4" style={{ color: "#6B6560", fontWeight: 300 }}>
            {children}
          </div>
          {answer && <Explanation className="mt-6">{answer}</Explanation>}
        </div>
        {review && <img src={review.src} alt={review.alt} loading="lazy" className="w-full h-auto" />}
      </div>
    </Slide>
  );
}

function NumberedList({ heading, items, numbered = true, className = "" }: { heading: ReactNode; items: ReactNode[]; numbered?: boolean; className?: string }) {
  return (
    <div className={className}>
      <h4 className="font-display text-2xl md:text-3xl font-medium mb-6" style={{ color: "#6B6560" }}>{heading}</h4>
      <ol className="space-y-4">
        {items.map((item, i) => (
          <li key={i} className="flex items-baseline gap-4 text-base md:text-lg" style={{ color: "#1C1917" }}>
            {numbered && (
              <span className="font-mono-dm text-sm font-medium shrink-0" style={{ color: "#E67E22" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
            )}
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* Looping screen recording with a pause toggle; stays on the poster when the user prefers reduced motion */
function DemoVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  };
  return (
    <div className="relative">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={!reduceMotion}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="w-full h-auto block"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute bottom-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110"
        style={{ background: "rgba(28,25,23,0.75)", color: "#FFFFFF" }}
      >
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="5" y="4" width="5" height="16" rx="1" /><rect x="14" y="4" width="5" height="16" rx="1" /></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15a1 1 0 001.5.86l12.5-7.5a1 1 0 000-1.72L8.5 3.64A1 1 0 007 4.5z" /></svg>
        )}
      </button>
    </div>
  );
}

function Figure({ src, alt, className = "w-full" }: { src: string; alt: string; className?: string }) {
  return <img src={src} alt={alt} loading="lazy" className={`h-auto block ${className}`} />;
}

function Stat({ value, label, background = ALT_SURFACE }: { value: ReactNode; label: string; background?: string }) {
  return (
    <div className="p-5 rounded-2xl" style={{ background }}>
      <div className="font-display text-3xl md:text-4xl font-medium mb-1" style={{ color: "#E67E22" }}>{value}</div>
      <div className="font-mono-dm text-xs tracking-wide uppercase" style={{ color: "#6B6560" }}>{label}</div>
    </div>
  );
}

function IconPoints({ items }: { items: { icon: string; text: ReactNode }[] }) {
  return (
    <div className={`grid grid-cols-1 gap-10 ${items.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
      {items.map((item, i) => (
        <div key={i}>
          <img src={item.icon} alt="" className="w-12 h-12 mb-5" />
          <p className="text-base md:text-lg leading-relaxed" style={{ color: "#6B6560" }}>{item.text}</p>
        </div>
      ))}
    </div>
  );
}


const config = projectConfigs.find((p) => p.slug === "/character-pad")!;

export default function CharacterPad() {
  const heroContent = (
    <>
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="font-mono-dm text-xs tracking-widest uppercase px-3 py-1 rounded-full" style={{ background: "#E67E2220", color: "#E67E22" }}>
                    Product Design
                  </span>
                  <span className="font-mono-dm text-xs tracking-widest uppercase px-3 py-1 rounded-full" style={{ background: "#8D5E3C20", color: "#8D5E3C" }}>
                    Android
                  </span>
                  <span className="font-mono-dm text-xs tracking-widest uppercase px-3 py-1 rounded-full" style={{ background: "#8D5E3C20", color: "#8D5E3C" }}>
                    2026
                  </span>
                </div>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light mb-4 flex items-center gap-4" style={{ color: "#1C1917" }}>
                  <img src={ASSETS.appLogo} alt="Character Pad logo" className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" />
                  Character Pad
                </h1>
                <p className="text-xl leading-relaxed max-w-2xl mb-8" style={{ color: "#6B6560" }}>
                  An Android utility app redesign — enabling users to browse Unicode characters, to search, copy, and compose with them in other apps.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="https://www.figma.com/proto/ZOBLX9Vy0IDzFCSkESBEcr/Character-Pad?node-id=824-17076&t=n1dLPf9xI0nHeUcA-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=824%3A17076&show-proto-sidebar=1" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono-dm text-sm tracking-wide transition-all duration-300 hover:scale-105" style={{ background: "#BF5836", color: "#FAF7F2" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    View Interactive Prototype
                  </a>
                  <a href="https://www.figma.com/deck/K5rKV0S4RaepBiuCfZKqAK" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono-dm text-sm tracking-wide transition-all duration-300 hover:scale-105" style={{ background: "#2A9D8F", color: "#FFFFFF" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="13" rx="2" /><line x1="12" y1="16" x2="12" y2="20" /><line x1="8" y1="20" x2="16" y2="20" /></svg>
                    View Slide Deck
                  </a>
                  <a href="https://www.behance.net/gallery/252476603/Character-Pad-Android-Unicode-App-Redesign-UIUX" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono-dm text-sm tracking-wide transition-all duration-300 hover:scale-105" style={{ background: "#4A6FA5", color: "#FFFFFF" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/></svg>
                    View on Behance
                  </a>
                  <a href="https://www.figma.com/design/ZOBLX9Vy0IDzFCSkESBEcr/Character-Pad?node-id=263-9197&t=gMi30hWZphoUtKG5-1" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono-dm text-sm tracking-wide transition-all duration-300 hover:scale-105" style={{ background: "#7B5EA7", color: "#FFFFFF" }}>
                    <svg width="16" height="16" viewBox="0 0 38 57" fill="currentColor"><path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z"/><path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z"/><path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z"/><path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z"/><path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z"/></svg>
                    View on Figma
                  </a>
                  <a href="https://play.google.com/store/apps/details?id=com.husseinelfeky.characterpad" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono-dm text-sm tracking-wide transition-all duration-300 hover:scale-105" style={{ background: "#01875F", color: "#FFFFFF" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.3 2.3-8.636-8.632z"/></svg>
                    View on Google Play
                  </a>
                </div>
    </>
  );

  return (
    <CaseStudyLayout config={config} heroContent={heroContent}>

        {/* 01 • The Brief */}
        <h2 className="sr-only">The Brief</h2>
        <Chapter>
          <Slide title="My Role">
            <div className="space-y-3 text-lg md:text-xl leading-relaxed max-w-3xl mb-16" style={{ color: "#6B6560" }}>
              <p>Freelance work done over <Strong>7 weeks</Strong>.</p>
              <p>Redesigned a live Android app with <Strong>1.6M+ installs</Strong>.</p>
              <p>Worked directly with the product owner, from research to usability testing.</p>
            </div>
            <h3 className="font-display text-2xl md:text-3xl mb-8" style={{ color: "#1C1917", fontWeight: 300 }}>Tools</h3>
            <div className="flex flex-wrap items-center gap-3 text-lg md:text-xl" style={{ color: "#6B6560" }}>
              <span>Used</span>
              {[
                { name: "Figma", logo: ASSETS.figmaLogo },
                { name: "Claude Code", logo: ASSETS.claudeCodeLogo },
                { name: "Notion", logo: ASSETS.notionLogo },
              ].map((tool, i) => (
                <span key={tool.name} className="flex items-center gap-0.5">
                  <span className="flex items-center gap-3 px-4 py-2.5 rounded-full" style={{ background: ALT_SURFACE }}>
                    <img src={tool.logo} alt="" className="w-6 h-6 object-contain" />
                    <span className="font-mono-dm text-xs tracking-wide" style={{ color: "#1C1917" }}>{tool.name}</span>
                  </span>
                  {i === 0 ? "," : i === 1 ? ", and" : "."}
                </span>
              ))}
            </div>
          </Slide>

          <Slide title="Project Goal">
            <p className="text-lg md:text-xl leading-relaxed max-w-3xl" style={{ color: "#6B6560" }}>
              The app hadn’t shipped an update <Strong>since 2019</Strong>. The product owner wanted to rebuild the app by understanding users’ needs and pain points through <Strong>7 years of reviews</Strong>.
            </p>
          </Slide>

          <Slide title="The Complexity">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="font-display text-3xl md:text-4xl leading-snug mb-10" style={{ color: "#6B6560", fontWeight: 300 }}>
                  A huge library of<br />
                  <Strong>299,448</Strong> characters,<br />
                  across <Strong>340</Strong> Unicode blocks.
                </p>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <Stat value="1.6M+" label="Installs" />
                  <Stat value="6.43K+" label="Reviews" />
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-[260px] rounded-[2.5rem] overflow-hidden shadow-xl" style={{ border: "10px solid #111111", background: "#111111" }}>
                  <DemoVideo
                    src={ASSETS.complexityDemo}
                    poster={ASSETS.complexityDemoPoster}
                    label="Scrolling through the old app's continuous grid of Unicode characters"
                  />
                </div>
              </div>
            </div>
          </Slide>

          <Slide title="Collaboration with the Product Owner">
            <Figure src={ASSETS.productOwnerCollaboration} alt="Notion workspace — a tasks board for progress tracking and a list of weekly meetings with the product owner" />
          </Slide>

        </Chapter>

        {/* 02 • Understanding The User */}
        <ChapterDivider id="research" num="02">
          Understanding <em style={{ color: "#E67E22" }}>The User</em>
        </ChapterDivider>
        <Chapter>
          <Slide title="User Reviews">
            <Figure src={ASSETS.userReviews} alt="Collage of Character Pad user reviews from Google Play" />
          </Slide>

          <Slide title="Thousands of Reviews, Sorted by AI">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <Explanation className="">
                <p>I leveraged Claude Code to scrape and categorize the actionable 1-4 stars user reviews from Play Store, identifying key usability issues and design flaws to inform the redesign. After ranking them by severity and discussing priorities with the stakeholder, I translated the findings into user stories, developed wireframes, built an interactive prototype, and validated the solutions through usability testing.</p>
              </Explanation>
              <Figure
                src={ASSETS.claudeCodeTerminal}
                alt="Claude Code in the terminal, prompted to generate a report scraping and analysing actionable 1–4-star Play Store reviews of Character Pad, grouping common issues with total upvotes and representative examples"
              />
            </div>
          </Slide>

          <Slide title="Generated Review Analysis Report">
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 items-center">
              <div>
                {/* First page of the report, cropped like the slide; opens the full PDF */}
                <a
                  href={ASSETS.reviewAnalysisReport}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block aspect-[4/3] overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-[1.01]"
                  style={{ background: "#FFFFFF" }}
                >
                  <img
                    src={ASSETS.reviewAnalysisReportPreview}
                    alt="First page of the generated Play Store review analysis report — the method, corpus measures, scoring and caveats"
                    loading="lazy"
                    className="w-full h-auto block"
                  />
                </a>
                <a
                  href={ASSETS.reviewAnalysisReport}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 font-mono-dm text-xs tracking-wide uppercase"
                  style={{ color: "#E67E22" }}
                >
                  View full report (PDF)
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                </a>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                <Stat value="2,299" label="Reviews with text" />
                <Stat value="634" label="Actionable 1-4★ reviews" />
                <Stat value="2,040" label="Weighted voices" />
                <Stat value="12" label="Key findings" />
              </div>
            </div>
          </Slide>

          <Slide title="12 Key Findings">
            <div className="overflow-x-auto rounded-2xl" style={{ border: "1px solid #E67E2220" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "#E67E2210" }}>
                    <th className="text-left p-4 font-mono-dm text-xs tracking-wide uppercase" style={{ color: "#E67E22" }}>#</th>
                    <th className="text-left p-4 font-mono-dm text-xs tracking-wide uppercase" style={{ color: "#E67E22" }}>Findings</th>
                    <th className="text-left p-4 font-mono-dm text-xs tracking-wide uppercase" style={{ color: "#E67E22" }}>Severity</th>
                    <th className="text-right p-4 font-mono-dm text-xs tracking-wide uppercase" style={{ color: "#E67E22" }}>Complaints</th>
                    <th className="text-right p-4 font-mono-dm text-xs tracking-wide uppercase" style={{ color: "#E67E22" }}>Total Voices (Agreements)</th>
                    <th className="text-left p-4 font-mono-dm text-xs tracking-wide uppercase" style={{ color: "#E67E22" }}>Area of Focus</th>
                  </tr>
                </thead>
                <tbody>
                  {userReviews.map((r, i) => (
                    <tr key={r.id} style={{ background: i % 2 === 0 ? LIGHT : SAND }}>
                      <td className="p-4 font-mono-dm text-xs" style={{ color: "#8D5E3C" }}>{r.id}</td>
                      <td className="p-4" style={{ color: "#1C1917" }}>{r.finding}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{
                          background: r.severity === "High" ? "#E67E2220" : r.severity === "Medium" ? "#F5A62320" : "#6B656020",
                          color: r.severity === "High" ? "#E67E22" : r.severity === "Medium" ? "#F5A623" : "#6B6560",
                        }}>
                          {r.severity}
                        </span>
                      </td>
                      <td className="p-4 text-right font-mono-dm text-xs" style={{ color: "#6B6560" }}>{r.complaints}</td>
                      <td className="p-4 text-right font-mono-dm text-xs" style={{ color: "#6B6560" }}>{r.voices}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: `${getCategoryColor(r.area)}20`, color: getCategoryColor(r.area) }}>
                          {r.area}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Slide>

          <Slide title="Four Areas of Focus">
            <div className="space-y-6 mb-10">
              {areaStats.map((s) => (
                <div key={s.area} className="grid grid-cols-1 md:grid-cols-[220px_1fr_110px] gap-2 md:gap-6 items-center">
                  <div>
                    <div className="font-display text-xl font-medium" style={{ color: "#1C1917" }}>{s.area}</div>
                    <div className="font-mono-dm text-xs tracking-wide uppercase" style={{ color: "#6B6560" }}>
                      {s.findings} findings - {s.complaints} complaints
                    </div>
                  </div>
                  <div className="h-4 rounded-full overflow-hidden" style={{ background: "#ECE5DA" }}>
                    <div className="h-full rounded-full" style={{ width: `${(s.voices / maxVoices) * 100}%`, background: getCategoryColor(s.area) }} />
                  </div>
                  <div className="font-mono-dm text-xs tracking-wide uppercase md:text-right" style={{ color: "#6B6560" }}>
                    {s.voices} voices
                  </div>
                </div>
              ))}
            </div>
            <p className="font-display text-2xl md:text-3xl" style={{ color: "#6B6560", fontWeight: 300 }}>
              <Strong>Search alone is {searchShare}%</Strong> of all the voices.
            </p>
          </Slide>

          <Slide title="User Types">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userTypes.map((ut) => (
                <div key={ut.name} className="p-6 rounded-2xl" style={{ background: ALT_SURFACE }}>
                  <div className="flex items-center gap-3 mb-4">
                    <img src={ut.emoji} alt="" className="w-10 h-10" />
                    <h4 className="font-display text-lg font-medium" style={{ color: "#1C1917" }}>{ut.name}</h4>
                  </div>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "#6B6560" }}>{ut.desc}</p>
                  <p className="font-mono-dm text-xs tracking-wide uppercase mb-1" style={{ color: "#E67E22" }}>Why</p>
                  <p className="text-sm leading-relaxed italic" style={{ color: "#8D5E3C" }}>{ut.why}</p>
                </div>
              ))}
            </div>
          </Slide>

          <Slide title="Competitive Analysis" aside={<img src={ASSETS.unicodePadLogo} alt="Unicode Pad" className="h-10 md:h-12 w-auto" />}>
            <Figure
              src={ASSETS.competitiveAnalysis}
              alt="Unicode Pad — works well: searching “product” returns MULTIPLICATION SIGN and other Unicode-name matching results; falls short: unsupported glyphs show as empty boxes, which can be fixed by installing and selecting another font; falls short: red guidelines on the checkerboard show the glyph's exact boundaries"
              className="w-full max-w-4xl mx-auto"
            />
          </Slide>
        </Chapter>

        {/* 03 • Design Improvements and New Features */}
        <ChapterDivider id="solutions" num="03" chips={AREAS}>
          Design Improvements <em style={{ color: "#E67E22" }}>and New Features</em>
        </ChapterDivider>
        <Chapter>
          <Slide title="12 Findings → 10 Solutions">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {solutions.map((s) => (
                <div key={s.title} className="relative p-5 rounded-2xl" style={{ background: ALT_SURFACE, border: "1px solid #E67E2215" }}>
                  {s.isNew && (
                    <img
                      src={ASSETS.newBadge}
                      alt="New"
                      className="absolute -top-3 -left-3 w-10 h-10"
                      style={{ transform: "rotate(-15deg)" }}
                    />
                  )}
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="font-display text-base font-medium" style={{ color: "#1C1917" }}>{s.title}</h4>
                    <AreaChip area={s.area} />
                  </div>
                  <p className="text-sm leading-relaxed mt-2" style={{ color: "#6B6560" }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </Slide>

          {/* Search */}
          <HowMightWe
            area="Search"
            review={{ src: ASSETS.reviewsSearch, alt: "User reviews: “Please translate this for me.” and “The one symbol I want, is MIA. Looking for pi and cannot find it.”" }}
            answer={<p>To address the core problem of users struggling to find characters, the redesign introduced a multi-layered discoverability approach alongside UX improvements.</p>}
          >
            <p>Help users find specific characters regardless of <Strong>language barriers</Strong> or <Strong>knowledge of their names</Strong>?</p>
          </HowMightWe>

          <Slide title="Brainstorming the Design" area="Search">
            <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 items-center">
              <Figure src={ASSETS.searchByDrawingWireframes} alt="Hand-drawn wireframes exploring the Search by drawing screens, with annotations" className="w-full rounded-xl" />
              <NumberedList
                heading="Callouts"
                items={["Hiding results are not good.", "Button is an unnecessary step.", "Dialog interrupts the experience."]}
              />
            </div>
          </Slide>

          <Slide title="Introduced a new “Search by drawing” feature" area="Search">
            <Explanation>
              <p><Strong>A new “Search by drawing” feature is introduced</Strong>, to allow the user to draw characters and look for the closest matches, solving the core discoverability issue for users who recognize a character visually but don’t know its Unicode name, which is in English.</p>
            </Explanation>
            <Figure src={ASSETS.searchByDrawing} alt="Search by drawing flow — recent searches with a Search by drawing button, no results found, an empty canvas, drawing pi, the closest matches list, and an unrecognised drawing" />
            <div className="mt-12">
              <NumberedList heading="Key Wins" items={["No knowledge of Unicode names required", "No language barrier"]} />
            </div>
          </Slide>

          <Slide title="Added name aliases for commonly used characters" area="Search">
            <Explanation>
              <p><Strong>Name aliases for commonly used characters are added</Strong>, to expand search accuracy by mapping informal names to characters (e.g., “product” for ×, “sigma” for Σ, etc.), reducing failed searches for users who know what they want but not the exact Unicode name.</p>
            </Explanation>
            <Figure src={ASSETS.nameAliases} alt="Before and after searching “product” — the redesign returns MULTIPLICATION SIGN at the top of the results" className="w-full max-w-4xl mx-auto" />
          </Slide>

          <Slide title="Introduced recent searches" area="Search">
            <Explanation>
              <p><Strong>Recent searches are introduced</Strong>, to provide quick access to previously searched terms, minimizing repetitive effort for returning users who frequently look up the same characters.</p>
            </Explanation>
            <Figure src={ASSETS.recentSearches} alt="Search dropdown showing recent searches: integral, arrow and heart" className="w-auto max-w-full max-h-[600px] mx-auto" />
          </Slide>

          {/* Onboarding */}
          <HowMightWe area="Onboarding" review={{ src: ASSETS.reviewsOnboarding, alt: "User reviews: “Lots show up as blanks and crosses” and “A shame you can't create your own characters/fonts.”" }}>
            <p>Help users understand <Strong>how the app works</Strong> and why some characters may appear as <Strong>empty boxes</Strong>?</p>
          </HowMightWe>

          <Slide title="Simplified the onboarding UX, and removed the technical jargon" area="Onboarding">
            <Explanation>
              <p><Strong>The Onboarding UX is simplified</Strong>, removing the technical jargon from the initial setup, making the app more inclusive and easier to understand for non-technical users.</p>
            </Explanation>
            <Figure src={ASSETS.onboardingFlow} alt="Before and after onboarding screens — the redesign replaces technical explanations with a friendlier flow and a hands-on tutorial" />
          </Slide>

          <Slide title="Added contextual tooltips on first app launch" area="Onboarding">
            <Explanation>
              <p><Strong>On first app launch, users are guided through the app’s key features and navigation with a series of contextual tooltips</Strong> that also highlight to the user that they can use the floating clipboard rather than expecting a custom keyboard.</p>
            </Explanation>
            <Figure src={ASSETS.onboardingTooltips} alt="Eight contextual tooltips shown on first launch, guiding users through Recents, Favorites, Unicode blocks, the text composer, search, the clipboard and settings" />
            <div className="mt-12">
              <NumberedList heading="Key Wins" items={["Clearer onboarding experience", "Less frustration"]} />
            </div>
          </Slide>

          <Slide title="Simplified the view types, and added previews" area="Onboarding">
            <Explanation>
              <p><Strong>Reduced from 3 view types (Basic, Advanced, Continuous) to 2 (Basic and Advanced)</Strong>, adding “Continuous Mode” as a setting under Advanced View, and <Strong>added visuals to the view types.</Strong></p>
            </Explanation>
            <Figure src={ASSETS.viewTypes} alt="Before, 3 view types; after, 2 view types with previews and 1 new setting" />
            <Figure src={ASSETS.basicAndAdvancedViews} alt="Basic View shows frequently used characters; Advanced View shows the full Unicode set" className="w-full max-w-4xl mx-auto mt-12" />
          </Slide>

          <Slide title="Introduced a new FAQ screen" area="Onboarding">
            <Explanation>
              <p><Strong>A new FAQ screen is introduced</Strong>, accessible from the device settings, to address recurring questions about creating custom characters, unsupported characters, and others, reducing frustration and negative reviews.</p>
            </Explanation>
            <Figure src={ASSETS.faqScreen} alt="Settings with the new FAQ entry highlighted, and the FAQ screen answering common questions" className="w-full max-w-lg mx-auto" />
          </Slide>

          {/* Navigation */}
          <HowMightWe area="Navigation" review={{ src: ASSETS.reviewsScrolling, alt: "User reviews about accidentally triggering fast scrolling and jumping to a random character block" }}>
            <p>Prevent <Strong>accidental screen jumps</Strong> while still allowing users to scroll quickly through long character lists?</p>
          </HowMightWe>

          <Slide title="Made the fast scroller show on scroll and auto-hide after 1.5 seconds" area="Navigation">
            <Explanation>
              <p>The problematic always-visible fast scroller is now replaced with one that <Strong>shows on scroll and auto-hides after 1.5 seconds</Strong> on idle state, solving accidental trigger issues while maintaining navigation efficiency.</p>
            </Explanation>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <NumberedList heading="Key Wins" items={["No accidental jumps anymore"]} numbered={false} className="order-last lg:order-none" />
              <Figure src={ASSETS.fastScroller} alt="Before, an always-visible fast scroller; after, the fast scroller is hidden until the user scrolls" className="w-full max-w-md mx-auto" />
            </div>
          </Slide>

          <HowMightWe area="Navigation" review={{ src: ASSETS.reviewsKeyboard, alt: "User reviews asking to add the characters to the keyboard instead of switching back and forth" }}>
            <p>Help users copy and paste characters <Strong>seamlessly</Strong>?</p>
            <p>Create a Unicode keyboard?</p>
          </HowMightWe>

          <HowMightWe
            area="Navigation"
            lead="But..."
            review={{ src: ASSETS.keyboardApps, alt: "Google Play listings for Gboard (10B+ downloads) and Microsoft SwiftKey (1B+ downloads)" }}
            answer={<p>While building a custom keyboard may seem appealing, it would require competing with established keyboard apps that offer a wide range of features users have come to expect and would likely miss.</p>}
          >
            <p>What about established keyboard apps?</p>
          </HowMightWe>

          <HowMightWe area="Navigation" lead="So How Might We...">
            <p>Help users copy and paste characters seamlessly <Strong>without</Strong> needing to introduce <Strong>a new keyboard</Strong>?</p>
          </HowMightWe>

          <Slide title="How to copy and paste characters seamlessly?" area="Navigation">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center">
                <p className="font-display text-2xl mb-2" style={{ color: "#6B6560", fontWeight: 300 }}>Request</p>
                <p className="text-lg md:text-xl font-semibold" style={{ color: "#1C1917" }}>“Make it a keyboard.”</p>
                <svg className="mx-auto my-6" width="24" height="48" viewBox="0 0 24 48" fill="none" stroke="#E67E22" strokeWidth="1.5" aria-hidden="true">
                  <line x1="12" y1="2" x2="12" y2="44" />
                  <polyline points="4 36 12 44 20 36" />
                </svg>
                <p className="font-display text-2xl mb-2" style={{ color: "#6B6560", fontWeight: 300 }}>Need</p>
                <p className="text-lg md:text-xl font-semibold" style={{ color: "#1C1917" }}>Get a character into another app without leaving it.</p>
              </div>
              <div className="overflow-hidden rounded-2xl" style={{ border: "1px solid #E67E2220" }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: "#E67E2210" }}>
                      <th className="text-left p-4 font-mono-dm text-xs tracking-wide uppercase" style={{ color: "#E67E22" }}>Approach</th>
                      <th className="text-left p-4 font-mono-dm text-xs tracking-wide uppercase" style={{ color: "#E67E22" }}>Engineering Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { approach: "Unicode Keyboard", icon: ASSETS.iconKeyboard, cost: "High" },
                      { approach: "Floating Clipboard", icon: ASSETS.iconClipboard, cost: "Low" },
                    ].map((row, i) => (
                      <tr key={row.approach} style={{ background: i % 2 === 0 ? LIGHT : SAND }}>
                        <td className="p-4">
                          <div className="flex items-center gap-3" style={{ color: "#1C1917" }}>
                            <img src={row.icon} alt="" className="w-8 h-8" />
                            {row.approach}
                          </div>
                        </td>
                        <td className="p-4" style={{ color: "#6B6560" }}>{row.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Slide>

          <Slide title="Introduced a new home screen widget, and made the clipboard be fully scrollable" area="Navigation">
            <Explanation>
              <p><Strong>A new home screen widget</Strong> that opens the clipboard directly without needing to launch the app is introduced, streamlining repeated use.</p>
              <p>Rather than requiring users to configure the floating clipboard size, <Strong>the clipboard is now fully scrollable</Strong>, providing easy access to the complete list of Recents and Favorites.</p>
            </Explanation>
            <Figure src={ASSETS.clipboardWidget} alt="The Character Pad home screen widget, and the floating clipboard with scrollable Recents and Favorites over a chat app" />
          </Slide>

          <Slide title="Clipboard Widget User Flow" area="Navigation">
            <Explanation>
              <p>Using the floating clipboard makes the process of copying a character and pasting it into another app much shorter, especially when it is accessed through the widget. With the clipboard already open, users only need to copy the character and paste it where they need it. Overall, this reduces the number of steps by 60%.</p>
            </Explanation>
            <Figure
              src={ASSETS.clipboardWidgetFlow}
              alt="Without the widget: 5 steps (find Character Pad, open app, find and copy, return to other app, paste). With the widget: 3 steps on first use (open widget, find and copy, paste) and 2 steps on repeat use (find and copy, paste) — 60% fewer steps"
              className="w-full max-w-5xl mx-auto"
            />
          </Slide>

          {/* Usability */}
          <HowMightWe area="Usability" review={{ src: ASSETS.reviewsTextComposer, alt: "User reviews about accidentally deleting typed text with the X button and mistaking the top text box for a search box" }}>
            <p>Clearly <Strong>separate searching</Strong> from text composition while making it <Strong>easier and safer to compose text</Strong>?</p>
          </HowMightWe>

          <Slide title="Moved the text composer to the bottom, and removed the clear button when text is typed" area="Usability">
            <Explanation>
              <p>For some users, the text composer was sometimes getting confused with the search bar, so <Strong>the text composer is now moved to the bottom</Strong>, to replicate the user experience of a messaging app, making the text composer also closer to the user’s thumb.</p>
              <p><Strong>When text is typed, the clear button is no longer shown</Strong>, as there was no strong need for it. Having 3 icons in the text field is already enough, and adding a 4th icon would further increase accidental touches.</p>
            </Explanation>
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-10 items-center">
              <NumberedList heading="Key Wins" items={["No confusion with search anymore", "No accidental text deletion"]} className="order-last lg:order-none" />
              <Figure src={ASSETS.textComposer} alt="Before, the text composer sat at the top with a clear button; after, it sits at the bottom and has no clear button" />
            </div>
          </Slide>

          <HowMightWe area="Usability" review={{ src: ASSETS.reviewsCharacterSize, alt: "User reviews: “Keys are way too small. Can't read or see the symbols” and “microscopic view doesn't help matters”" }}>
            <p>Make the characters font size <Strong>accessible for everyone</Strong>?</p>
          </HowMightWe>

          <Slide title="Replaced the fixed columns count with an adaptive Character Size setting" area="Usability">
            <Explanation>
              <p>Some users find the characters font size too small. Although the number of columns can be adjusted in the app settings, which also adjusts the characters font size, this option may be difficult to discover and doesn’t adapt well to the different screen states of foldable devices.</p>
              <p>To improve readability and adaptability, <Strong>users can now adjust the character size using a slider in the app settings.</Strong> The app then automatically calculates the appropriate number of columns based on the selected size and available screen width, ensuring a consistent and adaptive layout across different screen sizes.</p>
            </Explanation>
            <Figure src={ASSETS.characterSize} alt="Before, a fixed column count per orientation; after, a Character Size setting with a live preview" />
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-10 items-center mt-16">
              <NumberedList
                heading="Key Wins"
                className="order-last lg:order-none"
                items={[
                  <>Adaptive <Strong>default columns count</Strong></>,
                  <>Adaptive on <Strong>device rotation</Strong></>,
                  <>Adaptive for <Strong>foldable devices</Strong></>,
                ]}
              />
              <Figure src={ASSETS.adaptiveColumns} alt="The same character size adapting to 8 columns on a phone, 12 on a foldable and 20 on a tablet" />
            </div>
          </Slide>
        </Chapter>

        {/* 04 • Fixes Beyond the Findings */}
        <ChapterDivider id="fixes" num="04">
          Fixes Beyond <em style={{ color: "#E67E22" }}>the Findings</em>
        </ChapterDivider>
        <Chapter>
          <Slide title="Redesigned the Character Details Dialog with a simpler more intuitive layout" area="Usability">
            <Explanation>
              <p>The character detail dialog was dense, so <Strong>the Character Detail Dialog has been redesigned</Strong> with a simpler more intuitive layout.</p>
            </Explanation>
            <Figure src={ASSETS.characterDialog} alt="Before and after Character Details Dialog — the redesign covers regular characters, emoji with skin tones, and character sequences" />
          </Slide>

          <Slide title="Added more character blocks for both Basic View and Advanced View" area="Usability">
            <Explanation>
              <p><Strong>The Character Blocks screen for both Basic View and Advanced View now includes more categories</Strong>, making it easier to browse and find the characters users need.</p>
            </Explanation>
            <Figure src={ASSETS.characterBlocks} alt="Settings with Character Blocks highlighted, the Basic View blocks list, and the Advanced View blocks list" className="w-full max-w-4xl mx-auto" />
          </Slide>

          <Slide title="Redesigned the Rate App dialog with more readable text and icon colors" area="Usability">
            <Explanation>
              <p><Strong>The Rate App Dialog is thoughtfully redesigned with WCAG-compliant text and icon colors</Strong> for improved clarity and readability.</p>
            </Explanation>
            <Figure src={ASSETS.rateAppDialog} alt="Before and after Rate App dialog — the redesign uses more readable text and icon colors" className="w-full max-w-md mx-auto" />
          </Slide>
        </Chapter>

        {/* 05 • User Testing */}
        <ChapterDivider id="testing" num="05" chips={["Usability Testing", "AB Testing"]}>
          User <em style={{ color: "#E67E22" }}>Testing</em>
        </ChapterDivider>
        <Chapter>
          <Slide title="Usability Test">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <Figure src={ASSETS.usabilityTest} alt="Recordings of the moderated usability test sessions, each showing the prototype on a phone alongside the participant" className="w-full rounded-xl" />
              <div>
                <h4 className="font-display text-2xl md:text-3xl font-medium mb-6" style={{ color: "#1C1917" }}>Moderated Usability Test</h4>
                <div>
                  {[
                    { label: "Participants", value: <>6</> },
                    { label: "Scenario tasks", value: <>6</> },
                    { label: "Users who hesitated on one task", value: <>2 <span style={{ color: "#6B6560" }}>/ 6</span></> },
                    { label: "Design iterations", value: <>1</> },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-6 py-4" style={{ borderBottom: "1px solid #E67E2220" }}>
                      <span className="text-base" style={{ color: "#6B6560" }}>{row.label}</span>
                      <span className="font-display text-3xl font-medium" style={{ color: "#1C1917" }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Slide>

          <Slide title="Usability-Led Design Iteration" area="Search">
            <Explanation>
              <p>Some users may lose attention that they searched for a block after collapsing the search bar.</p>
              <p><Strong>A “Search Results” title got added</Strong> to indicate that there is an active search query.</p>
            </Explanation>
            <Figure src={ASSETS.searchResultsHeader} alt="Before, block search results had no header; after, a “Search Results” header shows there is an active search" className="w-full max-w-md mx-auto" />
            <Figure src={ASSETS.searchResultsStates} alt="Block search states — the block list, an empty search, “Search Results (5)” for “arrows”, and “No blocks found” for “random”" className="w-full max-w-4xl mx-auto mt-12" />
          </Slide>

          <Slide title="Measuring The Success Through AB Testing">
            <NumberedList
              heading="How would we know the design works?"
              items={[
                "Search success rate",
                "% of search sessions using “Search by drawing”",
                "Onboarding completion vs. skip rate",
                "The share of new 1–2★ reviews mentioning “can’t find”, etc.",
              ]}
            />
          </Slide>
        </Chapter>

        {/* 06 • Design System */}
        <ChapterDivider id="design" num="06" chips={["Color Palette", "Iconography", "Typography", "Components"]}>
          Design <em style={{ color: "#E67E22" }}>System</em>
        </ChapterDivider>
        <Chapter>
          <Slide title="Color Palette">
            <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 items-center">
              <div>
                <p className="text-base leading-relaxed mb-8 max-w-xl" style={{ color: "#6B6560" }}>
                  The app allows the user to customize the app theme dynamically to any of the following colors.
                </p>
                <div className="grid grid-cols-7 gap-3 max-w-md mb-10">
                  {themeColors.map((color) => (
                    <div key={color.name} className="aspect-square rounded-full shadow-sm" style={{ background: color.hex, border: color.hex === "#FFFFFF" ? "1px solid #E0E0E0" : "none" }} title={color.name} />
                  ))}
                </div>
                <div className="flex flex-wrap gap-12">
                  <div>
                    <div className="font-mono-dm text-xs tracking-wide uppercase mb-1" style={{ color: "#6B6560" }}>Themes</div>
                    <div className="font-display text-3xl font-medium" style={{ color: "#1C1917" }}>{themeColors.length}</div>
                  </div>
                  <div>
                    <div className="font-mono-dm text-xs tracking-wide uppercase mb-1" style={{ color: "#6B6560" }}>Default Color</div>
                    <div className="flex items-center gap-2 font-display text-3xl font-medium" style={{ color: "#1C1917" }}>
                      <span className="w-4 h-4 rounded-full" style={{ background: "#FF9800" }} />
                      Orange
                    </div>
                  </div>
                </div>
              </div>
              <Figure src={ASSETS.themeColorDialog} alt="Character Pad theme color dialog showing the 21 theme colors over the settings screen" className="w-auto max-w-full max-h-[600px] mx-auto" />
            </div>
          </Slide>

          <Slide title="Iconography">
            <div className="rounded-2xl p-4 md:p-8" style={{ background: ALT_SURFACE }}>
              <Figure src={ASSETS.iconSystem} alt="Character Pad icon set in outlined, filled and colored styles" />
            </div>
          </Slide>

          <Slide title="Typography">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center" style={{ fontFamily: "Roboto, sans-serif" }}>
              <div>
                <div className="text-6xl md:text-7xl mb-4" style={{ color: "#1C1917", fontWeight: 700 }}>Roboto</div>
                <p className="text-base mb-6" style={{ color: "#1C1917", fontWeight: 500 }}>
                  Default Android Sans-serif typeface designed for screen readability
                </p>
                <p className="text-base leading-relaxed" style={{ color: "#1C1917", fontWeight: 500 }}>
                  Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm<br />
                  Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz<br />
                  0 1 2 3 4 5 6 7 8 9
                </p>
              </div>
              <div className="space-y-4">
                {[
                  { weight: "Regular", value: 400 },
                  { weight: "Medium", value: 500 },
                  { weight: "Semibold", value: 600 },
                  { weight: "Bold", value: 700 },
                ].map((w) => (
                  <div key={w.weight} className="flex items-center justify-between p-4 rounded-xl text-2xl" style={{ background: ALT_SURFACE, color: "#1C1917", fontWeight: w.value }}>
                    <span>Roboto {w.weight}</span>
                    <span>{w.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Slide>

          <Slide title="Figma Components">
            <div className="rounded-2xl p-4 md:p-8" style={{ background: ALT_SURFACE }}>
              <Figure src={ASSETS.figmaComponents} alt="Figma component library — app bars, search fields, list items, toggles, buttons, tooltips, dialogs, view type cards, rating faces and character grids" />
            </div>
          </Slide>
        </Chapter>

        {/* 07 • Final Design */}
        <ChapterDivider id="final" num="07">
          Final <em style={{ color: "#E67E22" }}>Design</em>
        </ChapterDivider>
        <Chapter>
          <Slide title="77 Figma Screens">
            <Figure src={ASSETS.figmaScreens} alt="All 77 Figma screens, grouped into Onboarding, Basic View, Advanced View, Character Dialog, Clipboard Tool and Settings" className="w-full rounded-2xl" />
          </Slide>

          <Slide title="Figma Interactions">
            <Figure src={ASSETS.figmaInteractions} alt="The Figma screens connected by prototype interactions across each flow" className="w-full rounded-2xl" />
          </Slide>

          <Slide title="Final Prototype">
            <div className="grid grid-cols-2 gap-4 max-w-md mb-10">
              <Stat value="10" label="Solutions delivered" />
              <Stat value="12" label="Findings answered" />
            </div>
            <div className="flex justify-center">
              <iframe
                src="https://embed.figma.com/proto/ZOBLX9Vy0IDzFCSkESBEcr/Character-Pad?node-id=824-17076&p=f&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=824%3A17076&show-proto-sidebar=1&embed-host=share"
                title="Character Pad interactive prototype"
                width={1100}
                height={800}
                className="max-w-full rounded-2xl"
                style={{ border: "1px solid rgba(0,0,0,0.08)" }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </Slide>

          <Slide title="If I had more time, I would...">
            <IconPoints
              items={[
                { icon: ASSETS.iconCustomBlocks, text: <>Allow users to <Strong>create custom character blocks</Strong>, where they can add any characters rather than having Recents and Favorites only.</> },
                { icon: ASSETS.iconFeedbackFlow, text: <><Strong>Replace Rate App dialog with a feedback flow</Strong> that addresses issues in-app, <Strong>showing the relevant FAQ</Strong>, before they become negative reviews.</> },
              ]}
            />
          </Slide>

          <Slide title="What I Learned">
            <IconPoints
              items={[
                { icon: ASSETS.iconPositiveFeedback, text: <>Listening to <Strong>positive feedback can also reveal valuable insights</Strong> for improvement.</> },
                { icon: ASSETS.iconAi, text: <><Strong>AI accelerated the analysis</Strong>, but I owned the interpretation and design decisions.</> },
                { icon: ASSETS.iconRealNeed, text: <><Strong>Looking beyond</Strong> what users ask for <Strong>can reveal the real need</Strong> behind their request.</> },
              ]}
            />
          </Slide>
        </Chapter>

    </CaseStudyLayout>
  );
}
