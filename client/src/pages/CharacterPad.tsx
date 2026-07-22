/* Character Pad Case Study — Android Unicode App Redesign */

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Link } from "wouter";
import CustomCursor from "@/components/CustomCursor";
import CaseStudyFooter from "@/components/CaseStudyFooter";
import CaseStudyNav from "@/components/CaseStudyNav";
import ProjectSwitcher from "@/components/ProjectSwitcher";

const CHARACTERPAD_OG_IMAGE = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/fWNxQURakNaOZpGt.png";

const ASSETS = {
  appLogo: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/QnydYChWLUsGdkzj.png",
  figmaLogo: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/IlUclpdWoWhbPOml.png",
  claudeCodeLogo: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/ZFnTPeXlDuqkxSCg.png",
  notionLogo: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/dnEzkcNCnXwHNYRc.png",
  studentEmoji: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/YdRFFVRlCObXoOUB.png",
  artistEmoji: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/ESmbmFfxldtJsxdW.png",
  teacherEmoji: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/NcIsoflVLzFSutNM.png",
  technologistEmoji: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/zKabvhxoblQwaglF.png",
  userReviews: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/JHDeGirPJwmIdYMY.png",
  iconsOutlined: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/TGOZqngnIwnXNnmF.png",
  iconsFilled: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/dviGaqXZFyqtPBqV.png",
  iconsColored: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/ahiZZRJeXMfLxxaX.png",
  searchByDrawing: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/IqVssOygOXVUPBYR.png",
  searchFeature: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/MSHwelsOYpgNLCwt.png",
  onboardingTooltips: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/jEKzczsRqsskZTut.png",
  onboardingTooltips2: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/qoRnWpcbKqKNYgkM.png",
  faqScreen: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/bOvXbLINlssgAXiJ.png",
  scrollerBeforeAfter: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/LxWSeTxJWTcoGxKv.png",
  clipboardWidget: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/IeeDWqOWjkkmmeXT.png",
  gettingLostInBlocks: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/ZqcqOdInwnnkSfyN.png",
  textComposer: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/BYfArbeEwfUewjIs.png",
  characterSize: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/CSHDuaZRDlcSxkDW.png",
  characterDialog: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/KevyHMfMFYmgshDw.png",
  basicViewRedesign: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/sMbfoRIAcbIRzAZz.png",
  rateAppDialog: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/UeJfEbLAjeOOQTdZ.png",
  phoneScreenshot: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/xphPTUNvUZVhtJTU.png",
};

const navLinks = [
  { label: "Overview", href: "#overview" },
  { label: "Process", href: "#process" },
  { label: "Research", href: "#research" },
  { label: "Solutions", href: "#solutions" },
  { label: "Redesign", href: "#redesign" },
];

function Section({ children, className = "", id = "" }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-px" style={{ background: "#E67E22" }} />
      <span className="font-mono-dm text-xs tracking-[0.25em] uppercase" style={{ color: "#E67E22" }}>
        {label}
      </span>
    </div>
  );
}

function RedesignSectionNumber({ num }: { num: string }) {
  return (
    <span className="font-display text-6xl lg:text-8xl font-bold" style={{ color: "#2A9D8F", opacity: 0.8 }}>
      {num}
    </span>
  );
}

function CaseStudyNavbar() {
  const [active, setActive] = useState("Overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = navLinks.map((l) => l.href.replace("#", ""));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          const link = navLinks.find((l) => l.href === `#${id}`);
          if (link) setActive(link.label);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (label: string, href: string) => {
    setActive(label);
    setMenuOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav className="hidden lg:flex fixed left-0 top-0 h-full w-20 flex-col items-center justify-between py-10 z-50"
        style={{ background: "rgba(250,247,242,0.85)", backdropFilter: "blur(12px)", borderRight: "1px solid rgba(230,126,34,0.12)" }}>
        <Link href="/" className="flex flex-col items-center gap-1 transition-transform duration-300 hover:scale-110">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#E67E22" }}>
            <span className="font-display text-white font-semibold text-sm">EA</span>
          </div>
        </Link>

        <div className="flex flex-col items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.label, link.href)}
              className="relative group flex items-center gap-2"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              <span
                className="font-mono-dm text-xs tracking-widest uppercase transition-colors duration-300"
                style={{ color: active === link.label ? "#E67E22" : "#6B6560" }}
              >
                {link.label}
              </span>
              <AnimatePresence>
                {active === link.label && (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    exit={{ opacity: 0, scaleY: 0 }}
                    transition={{ type: "tween", ease: "easeInOut", duration: 0.25 }}
                    className="absolute -right-3 top-0 bottom-0 w-0.5 rounded-full origin-center"
                    style={{ background: "#E67E22" }}
                  />
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3">
          <a href="mailto:hello@elifsuates.com" className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110" style={{ color: "#6B6560" }} title="hello@elifsuates.com">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
          </a>
          <a href="https://www.linkedin.com/in/elifsu-ates/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110" style={{ color: "#6B6560" }} title="LinkedIn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
          </a>
          <a href="https://behance.net/elifsuates" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110" style={{ color: "#6B6560" }} title="Behance">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/></svg>
          </a>
        </div>
      </nav>

      <nav
        className={`lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 ${scrolled ? "shadow-md" : ""}`}
        style={{ background: "rgba(250,247,242,0.92)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#E67E22" }}>
              <span className="font-display text-white font-semibold text-xs">EA</span>
            </div>
          </Link>
          <ProjectSwitcher />
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="w-10 h-10 flex items-center justify-center" aria-label="Toggle menu">
          <span className="relative block w-6 h-4">
            <motion.span animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} transition={{ duration: 0.3 }} className="absolute top-0 left-0 block w-6 h-0.5 rounded-full origin-center" style={{ background: "#1C1917" }} />
            <motion.span animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }} transition={{ duration: 0.2 }} className="absolute top-1/2 left-0 -translate-y-1/2 block w-6 h-0.5 rounded-full origin-center" style={{ background: "#1C1917" }} />
            <motion.span animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} transition={{ duration: 0.3 }} className="absolute bottom-0 left-0 block w-6 h-0.5 rounded-full origin-center" style={{ background: "#1C1917" }} />
          </span>
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 z-40 flex flex-col items-center justify-center"
            style={{ background: "rgba(250,247,242,0.97)", backdropFilter: "blur(20px)" }}
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => handleNavClick(link.label, link.href)}
                className="py-4 font-display text-4xl font-light transition-colors duration-200"
                style={{ color: active === link.label ? "#E67E22" : "#1C1917" }}
              >
                {link.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const userReviews = [
  { id: 1, finding: "Hard to Find Specific Characters / Symbols", severity: "High", complaints: 94, upvotes: 422, area: "Search" },
  { id: 2, finding: "Language Barrier (English Only)", severity: "High", complaints: 39, upvotes: 260, area: "Search" },
  { id: 3, finding: "Characters Not Displayed / Blank Boxes / Unsupported", severity: "High", complaints: 41, upvotes: 215, area: "Onboarding" },
  { id: 4, finding: "Difficult to Use / Not Intuitive / Confusing UX", severity: "High", complaints: 44, upvotes: 130, area: "Onboarding" },
  { id: 5, finding: "Accidental Text Deletion (Clear Button Placement)", severity: "High", complaints: 2, upvotes: 93, area: "UX" },
  { id: 6, finding: "Accidental Scrolling", severity: "Medium", complaints: 3, upvotes: 85, area: "Navigation" },
  { id: 7, finding: "Not a Keyboard / Expected Keyboard Integration", severity: "Low", complaints: 16, upvotes: 81, area: "Onboarding" },
  { id: 8, finding: "Text Composer Placement Causes Search Bar Confusion", severity: "Medium", complaints: 1, upvotes: 67, area: "UX" },
  { id: 9, finding: "Cannot Create Custom Characters", severity: "Medium", complaints: 7, upvotes: 36, area: "Onboarding" },
  { id: 10, finding: "Characters Too Small / No Zoom", severity: "Medium", complaints: 4, upvotes: 31, area: "UX" },
  { id: 11, finding: "Floating Clipboard Sizing Configuration", severity: "Low", complaints: 3, upvotes: 23, area: "UX" },
  { id: 12, finding: "Floating Clipboard Quick Access", severity: "Low", complaints: 6, upvotes: 20, area: "Navigation" },
];

const solutions = [
  { title: "Search by drawing characters", area: "Search", desc: "Allows users to draw the character they need, solving the core discoverability issue for users who recognize a character visually but don't know its name.", isNew: true },
  { title: "Name aliases for commonly used characters", area: "Search", desc: "Expands search accuracy by mapping informal names to characters (e.g., \"sigma\" for Σ), reducing failed searches.", isNew: true },
  { title: "Recent searches", area: "Search", desc: "Provides quick access to previously searched terms, minimizing repetitive effort for returning users.", isNew: true },
  { title: "Simpler onboarding UX without technical jargon", area: "Onboarding", desc: "Removes confusing technical language from the initial setup, making the app accessible to non-technical users.", isNew: false },
  { title: "Tutorial on first app launch", area: "Onboarding", desc: "Guides new users through core features, directly tackling the \"difficult to use / not intuitive\" complaints.", isNew: true },
  { title: "FAQ introduced", area: "Onboarding", desc: "Addresses recurring questions about unsupported characters and blank boxes, reducing frustration and negative reviews.", isNew: true },
  { title: "Clipboard Widget for quick access", area: "Navigation", desc: "A new home screen widget that opens the clipboard directly without needing to launch the app, streamlining repeated use.", isNew: false },
  { title: "Fast Scroller that shows on scroll and auto-hides", area: "Navigation", desc: "Replaces the problematic always-visible fast scroller, solving accidental trigger issues while maintaining navigation efficiency.", isNew: false },
  { title: "Text Composer redesign", area: "UX", desc: "Removed the clear button entirely and moved the text composer to the bottom, preventing accidental deletion and confusion with the search bar.", isNew: false },
  { title: "Adaptive character size", area: "UX", desc: "Replaced columns count settings with a single adaptive character size setting that automatically accommodates different screen sizes.", isNew: false },
];

interface ContentBlock {
  text: string;
  images?: string[];
  bulletNumber?: number;
}

interface RedesignSection {
  num: string;
  category: string;
  categoryColor: string;
  titles: string[];
  content: ContentBlock[];
}

const redesignSections: RedesignSection[] = [
  {
    num: "01",
    category: "Search",
    categoryColor: "#3B82F6",
    titles: [
      "Hard to Find Specific Characters / Symbols",
      "Language Barrier (English Only)",
    ],
    content: [
      {
        text: "To address the core problem of users struggling to find characters, the redesign introduced a multi-layered discoverability approach alongside UX improvements.",
      },
      {
        text: "<strong>A new \"Search by drawing\" feature is introduced</strong>, to allow the user to draw characters and look for the closest matches, solving the core discoverability issue for users who recognize a character visually but don\u2019t know its Unicode name, which is in English.",
        bulletNumber: 1,
      },
      {
        text: "<strong>Name aliases for commonly used characters are added</strong>, to expand search accuracy by mapping informal names to characters (e.g., \"sigma\" for Σ), reducing failed searches for users who know what they want but not the exact Unicode name.",
        bulletNumber: 2,
      },
      {
        text: "<strong>Recent searches are introduced</strong>, to provide quick access to previously searched terms, minimizing repetitive effort for returning users who frequently look up the same characters.",
        bulletNumber: 3,
        images: [ASSETS.searchByDrawing],
      },
    ],
  },
  {
    num: "02",
    category: "Onboarding",
    categoryColor: "#8B5CF6",
    titles: [
      "Difficult to Use / Not Intuitive / Confusing UX",
      "Not a Keyboard / Expected Keyboard Integration",
    ],
    content: [
      {
        text: "<strong>Reduced from 3 view types (Basic, Advanced, Continuous) to 2 (Basic and Advanced)</strong>, adding \"Continuous Mode\" as a setting under Advanced View.",
        images: [ASSETS.searchFeature],
      },
      {
        text: "While building a custom keyboard may seem appealing, it would require competing with established keyboard apps that offer a wide range of features users have come to expect and would likely miss.",
      },
      {
        text: "Instead, <strong>on first app launch, users are guided through the app\u2019s key features and navigation with a series of contextual tooltips</strong> that also highlight to the user that they can use the floating clipboard rather than expecting a custom keyboard.",
        images: [ASSETS.onboardingTooltips2],
      },
    ],
  },
  {
    num: "03",
    category: "Onboarding",
    categoryColor: "#8B5CF6",
    titles: [
      "Characters Not Displayed / Blank Boxes / Unsupported",
      "Cannot Create Custom Characters",
    ],
    content: [
      {
        text: "<strong>The Onboarding UX is simplified</strong>, removing the technical jargon from the initial setup, making the app more inclusive and easier to understand for non-technical users.",
        images: [ASSETS.onboardingTooltips],
      },
      {
        text: "<strong>A new FAQ screen is introduced</strong>, accessible from the device settings, to address recurring questions about creating custom characters, unsupported characters, and others, reducing frustration and negative reviews.",
        images: [ASSETS.faqScreen],
      },
    ],
  },
  {
    num: "04",
    category: "Navigation",
    categoryColor: "#F59E0B",
    titles: [
      "Accidental Scrolling",
    ],
    content: [
      {
        text: "The problematic always-visible fast scroller is now replaced with one that <strong>shows on scroll and auto-hides after 2 seconds</strong> on idle state, solving accidental trigger issues while maintaining navigation efficiency.",
        images: [ASSETS.scrollerBeforeAfter],
      },
    ],
  },
  {
    num: "05",
    category: "Navigation",
    categoryColor: "#F59E0B",
    titles: [
      "Floating Clipboard Quick Access",
      "Floating Clipboard Sizing Configuration",
    ],
    content: [
      {
        text: "<strong>A new home screen widget</strong> that opens the clipboard directly without needing to launch the app is introduced, streamlining repeated use.",
      },
      {
        text: "Rather than requiring users to configure the floating clipboard size, <strong>the clipboard is now fully scrollable</strong>, providing easy access to the complete list of Recents and Favorites.",
        images: [ASSETS.clipboardWidget],
      },
    ],
  },
  {
    num: "06",
    category: "Navigation",
    categoryColor: "#F59E0B",
    titles: [
      "Getting Lost In Unicode Blocks",
    ],
    content: [
      {
        text: "Some users may lose attention that they searched for a block after collapsing the search bar.",
      },
      {
        text: "<strong>A \u201cSearch Results\u201d title got added</strong> to indicate that there is an active search query.",
        images: [ASSETS.gettingLostInBlocks],
      },
    ],
  },
  {
    num: "07",
    category: "User Experience",
    categoryColor: "#D63384",
    titles: [
      "Text Composer Placement Causes Search Bar Confusion",
      "Accidental Text Deletion (Clear Button Placement)",
    ],
    content: [
      {
        text: "For some users, the text composer was sometimes getting confused with the search bar, so <strong>the text composer is now moved to the bottom</strong>, to replicate the user experience of a messaging app, making the text composer also closer to the user\u2019s thumb.",
      },
      {
        text: "<strong>When text is typed, the clear button is no longer shown</strong>, as there was no strong need for it. Having 3 icons in the text field is already enough, and adding a 4th icon would further increase accidental touches.",
        images: [ASSETS.textComposer],
      },
    ],
  },
  {
    num: "08",
    category: "User Experience",
    categoryColor: "#D63384",
    titles: [
      "Characters Too Small / No Zoom",
    ],
    content: [
      {
        text: "Some users find the characters font size too small. Although the number of columns can be adjusted in the app settings, which also adjusts the characters font size, this option may be difficult to discover and doesn\u2019t adapt well to the different screen states of foldable devices.",
      },
      {
        text: "To improve readability and adaptability, <strong>users can now adjust the character size using a slider in the app settings.</strong> The app then automatically calculates the appropriate number of columns based on the selected size and available screen width, ensuring a consistent and adaptive layout across different screen sizes.",
        images: [ASSETS.characterSize],
      },
    ],
  },
  {
    num: "09",
    category: "User Experience",
    categoryColor: "#D63384",
    titles: [
      "Character Dialog Has A Complex Layout",
    ],
    content: [
      {
        text: "<strong>The Character Dialog has been redesigned</strong> with a simpler more intuitive layout.",
        images: [ASSETS.characterDialog],
      },
    ],
  },
  {
    num: "10",
    category: "User Experience",
    categoryColor: "#D63384",
    titles: [
      "Character Blocks (Basic View) Is Outdated",
    ],
    content: [
      {
        text: "<strong>The Character Blocks (Basic View) screen now includes more categories</strong>, making it easier to browse and find the characters users need.",
        images: [ASSETS.basicViewRedesign],
      },
    ],
  },
  {
    num: "11",
    category: "Accessibility",
    categoryColor: "#10B981",
    titles: [
      "Rate App Dialog Is Not Accessible",
    ],
    content: [
      {
        text: "<strong>The Rate App Dialog is thoughtfully redesigned with WCAG-compliant text and icon colors</strong> for improved clarity and readability.",
        images: [ASSETS.rateAppDialog],
      },
    ],
  },
];

const processSteps = [
  ["User Persona", "User Review Scraping", "Review Categorization", "Severity Ranking"],
  ["Problem Prioritization", "Stakeholder Discussion", "User Stories", "Low-Fidelity Wireframes"],
  ["Design System", "Prototyping", "Usability Testing", "Final Presentation"],
];

const userTypes = [
  { name: "The Academic / Student", emoji: ASSETS.studentEmoji, desc: "A student or researcher who needs mathematical symbols, Greek letters, subscripts, and superscripts for scientific writing.", reason: "Academic work requires specialized notation (e.g., Σ, Δ, ², ³, α, β) unavailable on standard keyboards. They value Favorites and Recents for repeated quick access." },
  { name: "The Social Media Creative", emoji: ASSETS.artistEmoji, desc: "A content creator who uses decorative Unicode, fancy text, and unique symbols to style their social media posts and bios.", reason: "Social platforms limit formatting, so users rely on Unicode as a workaround to stand out. They value browsing variety and the Text Composer for building styled strings." },
  { name: "The Developer / Technical Professional", emoji: ASSETS.technologistEmoji, desc: "A developer or designer who needs Unicode codepoints, HTML entities, and special symbols for coding or documentation.", reason: "Developers need to reference or insert characters by codepoint for debugging, testing, or embedding symbols. They value the Character Dialog showing Unicode/HTML details." },
  { name: "The Multilingual Communicator", emoji: ASSETS.teacherEmoji, desc: "A multilingual user needing characters from non-Latin scripts or diacritical marks their keyboard does not support.", reason: "Standard keyboards may not cover every script or special character for less common languages. They rely on the comprehensive library and Supported Characters filter." },
];

const CATEGORY_COLORS: Record<string, string> = {
  Search: "#3B82F6",
  Onboarding: "#8B5CF6",
  Navigation: "#F59E0B",
  UX: "#D63384",
  "User Experience": "#D63384",
  Accessibility: "#10B981",
};

function getCategoryColor(area: string): string {
  return CATEGORY_COLORS[area] || "#E67E22";
}

export default function CharacterPad() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.title = "Character Pad — Elifsu Ateş";
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
    setMeta("og:title", "Character Pad — Android Unicode Characters App");
    setMeta("og:description", "An Android utility app providing extensive access to Unicode characters. UI/UX Design by Elifsu Ateş.");
    setMeta("og:image", CHARACTERPAD_OG_IMAGE);
    setMeta("og:image:width", "1200");
    setMeta("og:image:height", "960");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", "Character Pad — Android Unicode Characters App");
    setMeta("twitter:description", "An Android utility app providing extensive access to Unicode characters. UI/UX Design by Elifsu Ateş.");
    setMeta("twitter:image", CHARACTERPAD_OG_IMAGE);
    return () => { document.title = "Elifsu Ateş — UI/UX Designer"; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen" style={{ background: "#FAF7F2" }}>
      <CustomCursor />
      <CaseStudyNavbar />

      <Link
        href="/"
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-mono-dm text-sm tracking-wide transition-all duration-300 hover:scale-105 shadow-lg"
        style={{ background: "#1C1917", color: "#FAF7F2" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        Back to Portfolio
      </Link>

      <main className="lg:pl-20">
        <CaseStudyNav />
        <header className="pt-28 pb-20 px-8 lg:py-20 lg:px-32" id="overview">
          <Section>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="font-mono-dm text-xs tracking-widest uppercase px-3 py-1 rounded-full" style={{ background: "#E67E2220", color: "#E67E22" }}>
                UI/UX Design
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
              An Android utility app redesign — providing users with extensive access to Unicode characters for inserting special symbols, mathematical operators, emojis, and more.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="https://www.figma.com/proto/ZOBLX9Vy0IDzFCSkESBEcr/Character-Pad?node-id=824-17076&t=n1dLPf9xI0nHeUcA-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=824%3A17076&show-proto-sidebar=1" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono-dm text-sm tracking-wide transition-all duration-300 hover:scale-105" style={{ background: "#BF5836", color: "#FAF7F2" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                View Interactive Prototype
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
          </Section>
        </header>

        <div className="px-8 lg:px-32 py-20" style={{ background: "#F5F0EA" }}>
          <Section>
            <SectionLabel label="Overview" />
            <h2 className="font-display text-3xl md:text-4xl mb-6" style={{ color: "#1C1917", fontWeight: 300 }}>
              About <em style={{ color: "#E67E22" }}>Character Pad</em>
            </h2>
            <p className="text-lg leading-relaxed mb-10 max-w-3xl" style={{ color: "#6B6560" }}>
              Character Pad is an Android utility app, designed to provide users with extensive access to Unicode characters, serving as a comprehensive tool for inserting special symbols, mathematical operators, emojis, etc. into their texts, emails, and documents.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { value: "1.6M+", label: "Installs" },
                { value: "4.7", label: "Rating" },
                { value: "6.4K+", label: "Reviews" },
                { value: "12", label: "Key Findings" },
              ].map((m) => (
                <div key={m.label} className="p-5 rounded-2xl text-center" style={{ background: "#FAF7F2" }}>
                  <div className="font-display text-2xl md:text-3xl font-medium mb-1" style={{ color: "#E67E22" }}>{m.value}</div>
                  <div className="font-mono-dm text-xs tracking-wide uppercase" style={{ color: "#6B6560" }}>{m.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              {[
                { name: "Figma", logo: ASSETS.figmaLogo },
                { name: "Claude Code", logo: ASSETS.claudeCodeLogo },
                { name: "Notion", logo: ASSETS.notionLogo },
              ].map((tool) => (
                <div key={tool.name} className="flex items-center gap-3 px-4 py-2.5 rounded-full" style={{ background: "#FAF7F2" }}>
                  <img src={tool.logo} alt={tool.name} className="w-6 h-6 object-contain" />
                  <span className="font-mono-dm text-xs tracking-wide" style={{ color: "#1C1917" }}>{tool.name}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20">
          <Section>
            <SectionLabel label="Role" />
            <h2 className="font-display text-3xl mb-8" style={{ color: "#1C1917", fontWeight: 300 }}>
              My <em style={{ color: "#E67E22" }}>Contribution</em>
            </h2>
            <p className="text-base leading-relaxed max-w-3xl" style={{ color: "#6B6560" }}>
              As a UI/UX Designer, my role was to analyze all actionable user reviews on the Play Store, ranking the severity of each finding and discussing them with the stakeholder to prioritize improvements, then addressing the identified pain points by redesigning the app interface and introducing new features to enhance the overall user experience.
            </p>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" id="process" style={{ background: "#F5F0EA" }}>
          <Section>
            <SectionLabel label="Design Process" />
            <h2 className="font-display text-3xl mb-6" style={{ color: "#1C1917", fontWeight: 300 }}>
              How I <em style={{ color: "#E67E22" }}>Approached</em> It
            </h2>
            <p className="text-base leading-relaxed mb-10 max-w-3xl" style={{ color: "#6B6560" }}>
              I leveraged Claude Code to scrape and categorize the actionable 1-4 stars user reviews from Play Store, identifying key usability issues and design flaws to inform the redesign. After ranking them by severity and discussing priorities with the stakeholder, I translated the findings into user stories, developed wireframes, built an interactive prototype, and validated the solutions through usability testing.
            </p>

            <div className="space-y-4">
              {processSteps.map((row, rowIdx) => (
                <div key={rowIdx} className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {row.map((step, stepIdx) => (
                    <div key={step} className="p-4 rounded-xl flex items-center gap-3" style={{ background: "#FAF7F2" }}>
                      <span className="font-mono-dm text-xs font-medium shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#E67E2220", color: "#E67E22" }}>
                        {rowIdx * 4 + stepIdx + 1}
                      </span>
                      <span className="text-sm" style={{ color: "#1C1917" }}>{step}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" id="research">
          <Section>
            <SectionLabel label="User Types" />
            <h2 className="font-display text-3xl mb-10" style={{ color: "#1C1917", fontWeight: 300 }}>
              Who Uses <em style={{ color: "#E67E22" }}>Character Pad</em>?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userTypes.map((ut) => (
                <div key={ut.name} className="p-6 rounded-2xl" style={{ background: "#F5F0EA" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <img src={ut.emoji} alt="" className="w-10 h-10" />
                    <h3 className="font-display text-lg font-medium" style={{ color: "#1C1917" }}>{ut.name}</h3>
                  </div>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "#6B6560" }}>{ut.desc}</p>
                  <p className="text-sm leading-relaxed italic" style={{ color: "#8D5E3C" }}>{ut.reason}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" style={{ background: "#F5F0EA" }}>
          <Section>
            <SectionLabel label="User Reviews" />
            <h2 className="font-display text-3xl mb-8" style={{ color: "#1C1917", fontWeight: 300 }}>
              What Users <em style={{ color: "#E67E22" }}>Say</em>
            </h2>
            <div className="w-full overflow-x-auto">
              <img src={ASSETS.userReviews} alt="Collage of user reviews from Google Play Store" className="h-auto max-w-full" />
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20">
          <Section>
            <SectionLabel label="User Reviews Analysis" />
            <h2 className="font-display text-3xl mb-8" style={{ color: "#1C1917", fontWeight: 300 }}>
              Key <em style={{ color: "#E67E22" }}>Findings</em>
            </h2>
            <div className="overflow-x-auto rounded-2xl" style={{ border: "1px solid #E67E2220" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "#E67E2210" }}>
                    <th className="text-left p-4 font-mono-dm text-xs tracking-wide uppercase" style={{ color: "#E67E22" }}>#</th>
                    <th className="text-left p-4 font-mono-dm text-xs tracking-wide uppercase" style={{ color: "#E67E22" }}>Finding</th>
                    <th className="text-left p-4 font-mono-dm text-xs tracking-wide uppercase" style={{ color: "#E67E22" }}>Severity</th>
                    <th className="text-right p-4 font-mono-dm text-xs tracking-wide uppercase" style={{ color: "#E67E22" }}>Complaints</th>
                    <th className="text-right p-4 font-mono-dm text-xs tracking-wide uppercase" style={{ color: "#E67E22" }}>Upvotes</th>
                    <th className="text-left p-4 font-mono-dm text-xs tracking-wide uppercase" style={{ color: "#E67E22" }}>Area</th>
                  </tr>
                </thead>
                <tbody>
                  {userReviews.map((r, i) => (
                    <tr key={r.id} style={{ background: i % 2 === 0 ? "#FAF7F2" : "#F5F0EA" }}>
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
                      <td className="p-4 text-right font-mono-dm text-xs" style={{ color: "#6B6560" }}>{r.upvotes}</td>
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
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" id="solutions" style={{ background: "#F5F0EA" }}>
          <Section>
            <SectionLabel label="Solutions" />
            <h2 className="font-display text-3xl mb-10" style={{ color: "#1C1917", fontWeight: 300 }}>
              Proposed <em style={{ color: "#E67E22" }}>Solutions</em>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {solutions.map((s) => (
                <div key={s.title} className="relative p-6 rounded-2xl" style={{ background: "#FAF7F2", border: "1px solid #E67E2215" }}>
                  {s.isNew && (
                    <img
                      src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/oUEwrRZIFOZFNgLR.png"
                      alt="New"
                      className="absolute -top-3 -left-3 w-10 h-10"
                      style={{ transform: "rotate(-15deg)" }}
                    />
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded-full font-mono-dm text-xs" style={{ background: `${getCategoryColor(s.area)}20`, color: getCategoryColor(s.area) }}>{s.area}</span>
                  </div>
                  <h3 className="font-display text-base font-medium mb-2" style={{ color: "#1C1917" }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B6560" }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20">
          <Section>
            <SectionLabel label="Design System" />
            <h2 className="font-display text-3xl mb-6" style={{ color: "#1C1917", fontWeight: 300 }}>
              Color <em style={{ color: "#E67E22" }}>Palette</em>
            </h2>
            <p className="text-base leading-relaxed mb-8 max-w-3xl" style={{ color: "#6B6560" }}>
              The app allows the user to customize the app theme dynamically to any of the following colors.
            </p>
            <div className="mt-8 mb-10 flex justify-center">
              <img src={ASSETS.phoneScreenshot} alt="Character Pad theme color dialog" className="h-auto max-h-[500px] rounded-2xl" />
            </div>
            <div className="flex flex-wrap gap-3">
              {[
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
              ].map((color) => (
                <div key={color.name} className="w-12 h-12 rounded-xl shadow-sm" style={{ background: color.hex, border: color.hex === "#FFFFFF" ? "1px solid #E0E0E0" : "none" }} title={color.name} />
              ))}
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" style={{ background: "#F5F0EA" }}>
          <Section>
            <SectionLabel label="Typography" />
            <h2 className="font-display text-3xl mb-6" style={{ color: "#1C1917", fontWeight: 300 }}>
              <em style={{ color: "#E67E22" }}>Roboto</em>
            </h2>
            <p className="text-base leading-relaxed mb-8 max-w-3xl" style={{ color: "#6B6560" }}>
              Default Android Sans-serif typeface designed for screen readability.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { weight: "Regular", value: "400" },
                { weight: "Medium", value: "500" },
                { weight: "Semibold", value: "600" },
                { weight: "Bold", value: "700" },
              ].map((w) => (
                <div key={w.weight} className="p-4 rounded-xl" style={{ background: "#FAF7F2" }}>
                  <div className="text-2xl mb-2" style={{ color: "#1C1917", fontWeight: parseInt(w.value) }}>Aa</div>
                  <div className="font-mono-dm text-xs" style={{ color: "#6B6560" }}>{w.weight} — {w.value}</div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" style={{ background: "#3C3C3C" }}>
          <Section>
            <SectionLabel label="Iconography" />
            <h2 className="font-display text-3xl mb-6" style={{ color: "#FFFFFF", fontWeight: 300 }}>
              Icon <em style={{ color: "#E67E22" }}>System</em>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { style: "Outlined", img: ASSETS.iconsOutlined },
                { style: "Filled", img: ASSETS.iconsFilled },
                { style: "Colored", img: ASSETS.iconsColored },
              ].map((icon) => (
                <div key={icon.style} className="rounded-xl overflow-hidden" style={{ background: "#4A4A4A" }}>
                  <div className="p-4 pb-2">
                    <h3 className="font-display text-lg font-light" style={{ color: "#FFFFFF" }}>{icon.style}</h3>
                  </div>
                  <div className="px-4 pb-4">
                    <img src={icon.img} alt={`${icon.style} icons`} className="w-full h-auto" />
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="py-20" id="redesign" style={{ background: "#3C3C3C" }}>
          <div className="px-8 lg:px-32 mb-16">
            <Section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px" style={{ background: "#E67E22" }} />
                <span className="font-mono-dm text-xs tracking-[0.25em] uppercase" style={{ color: "#E67E22" }}>
                  App Redesign
                </span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl mb-4" style={{ color: "#FFFFFF", fontWeight: 300 }}>
                Redesign <em style={{ color: "#E67E22" }}>Breakdown</em>
              </h2>
              <p className="text-base leading-relaxed max-w-3xl" style={{ color: "#CCCCCC" }}>
                Each section addresses specific findings from the user reviews analysis, organized by area of focus.
              </p>
            </Section>
          </div>

          <div className="space-y-24">
            {redesignSections.map((section) => (
              <div key={section.num} className="px-8 lg:px-32">
                <Section>
                  <div className="flex items-start justify-between gap-6 mb-8">
                    <div className="flex-1">
                      <span
                        className="inline-block px-3 py-1 rounded-full font-mono-dm text-xs tracking-wide mb-4"
                        style={{ background: `${section.categoryColor}30`, color: section.categoryColor }}
                      >
                        {section.category}
                      </span>
                      {section.titles.map((title, idx) => (
                        <h3
                          key={idx}
                          className="font-display text-xl md:text-2xl font-light mb-2"
                          style={{ color: "#FFFFFF" }}
                        >
                          {section.titles.length > 1 ? `${idx + 1}. ` : ""}{title}
                        </h3>
                      ))}
                    </div>
                    <RedesignSectionNumber num={section.num} />
                  </div>

                  {section.content.map((block, idx) => (
                    <div key={idx} className="mb-8">
                      <div className="flex items-start gap-4 max-w-3xl">
                        {block.bulletNumber && (
                          <span
                            className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-mono-dm text-xs font-semibold mt-0.5"
                            style={{ background: `${section.categoryColor}30`, color: section.categoryColor }}
                          >
                            {block.bulletNumber}
                          </span>
                        )}
                        <p
                          className="text-base leading-relaxed"
                          style={{ color: "#CCCCCC" }}
                          dangerouslySetInnerHTML={{ __html: block.text }}
                        />
                      </div>
                      {block.images && block.images.length > 0 && (
                        <div className={`mt-6 ${block.images.length > 1 ? "space-y-6" : ""} flex flex-col items-center`}>
                          {block.images.map((img, imgIdx) => (
                            <div key={imgIdx} className="overflow-x-auto w-full flex justify-center">
                              <img
                                src={img}
                                alt={`${section.titles[0]} - screenshot ${imgIdx + 1}`}
                                className="h-auto"
                                style={{ maxWidth: "100%" }}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </Section>
              </div>
            ))}
          </div>
        </div>

        <CaseStudyFooter currentProject="character-pad" />
      </main>
    </div>
  );
}
