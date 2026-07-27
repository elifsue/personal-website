export interface NavLink {
  label: string;
  href: string;
}

export interface ProjectMeta {
  title: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogImageWidth?: string;
  ogImageHeight?: string;
}

export interface ProjectConfig {
  slug: string;
  name: string;
  accentColor: string;
  thumbnailUrl: string;
  thumbnailAlt: string;
  navLinks: NavLink[];
  meta: ProjectMeta;
}

export const projectConfigs: ProjectConfig[] = [
  {
    slug: "/character-pad",
    name: "Character Pad",
    accentColor: "#E67E22",
    thumbnailUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/VsSbeosJoSORdPJI.png",
    thumbnailAlt: "Character Pad project thumbnail",
    navLinks: [
      { label: "Overview", href: "#overview" },
      { label: "Research", href: "#research" },
      { label: "Solutions", href: "#solutions" },
      { label: "Redesign", href: "#redesign" },
    ],
    meta: {
      title: "Character Pad — Elifsu Ateş",
      ogTitle: "Character Pad — Android Unicode Characters App",
      ogDescription: "An Android utility app providing extensive access to Unicode characters. UI/UX Design by Elifsu Ateş.",
      ogImage: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/fWNxQURakNaOZpGt.png",
    },
  },
  {
    slug: "/kiddiwear",
    name: "Kiddiwear",
    accentColor: "#BF5836",
    thumbnailUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/vteVhNcoduGcHcRE.png",
    thumbnailAlt: "Kiddiwear project thumbnail",
    navLinks: [
      { label: "Overview", href: "#overview" },
      { label: "Empathise", href: "#empathise" },
      { label: "Define", href: "#define" },
      { label: "Ideate", href: "#ideate" },
      { label: "Design", href: "#design" },
      { label: "Test", href: "#test" },
    ],
    meta: {
      title: "Kiddiwear — Elifsu Ateş",
      ogTitle: "Kiddiwear — Children's Clothing Marketplace",
      ogDescription: "A dedicated UK marketplace for buying and selling pre-loved children's clothing. UI/UX Design by Elifsu Ateş.",
      ogImage: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/vteVhNcoduGcHcRE.png",
    },
  },
  {
    slug: "/wireframe-prototyper",
    name: "Wireframe Prototyper Skill",
    accentColor: "#7B5EA7",
    thumbnailUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/kiaoSegjEvwENGTh.png",
    thumbnailAlt: "Wireframe Prototyper project thumbnail",
    navLinks: [
      { label: "Overview", href: "#overview" },
      { label: "Features", href: "#features" },
    ],
    meta: {
      title: "Wireframe Prototyper Skill — Elifsu Ateş",
      ogTitle: "Wireframe Prototyper Skill — Claude Code Skill",
      ogDescription: "A reusable Claude Code Skill that streamlines the end-to-end design workflow, from structured discovery and competitor research to generating a WCAG-compliant design system and building interactive low-fidelity wireframes or high-fidelity prototypes with real navigation, exportable screens, and a transferable design system to Figma.",
      ogImage: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/kiaoSegjEvwENGTh.png",
      ogImageWidth: "1400",
      ogImageHeight: "788",
    },
  },
];

/** Get a project config by slug */
export function getProjectConfig(slug: string): ProjectConfig | undefined {
  return projectConfigs.find((p) => p.slug === slug);
}
