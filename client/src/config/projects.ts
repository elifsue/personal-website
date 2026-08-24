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
    thumbnailUrl: `${import.meta.env.BASE_URL}images/character-pad-thumbnail.png`,
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
    thumbnailUrl: `${import.meta.env.BASE_URL}images/kiddiwear-thumbnail.png`,
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
      ogImage: "https://elifsuates.com/images/kiddiwear-thumbnail.png",
    },
  },
  {
    slug: "/wireframe-prototyper",
    name: "Wireframe Prototyper Skill",
    accentColor: "#7B5EA7",
    thumbnailUrl: `${import.meta.env.BASE_URL}images/wireframe-prototyper-thumbnail.png`,
    thumbnailAlt: "Wireframe Prototyper project thumbnail",
    navLinks: [
      { label: "Overview", href: "#overview" },
      { label: "Features", href: "#features" },
      { label: "Demo", href: "#demo" },
      { label: "Benefits", href: "#benefits" },
    ],
    meta: {
      title: "Wireframe Prototyper Skill — Elifsu Ateş",
      ogTitle: "Wireframe Prototyper Skill — Claude Code Skill",
      ogDescription: "A reusable Claude Code Skill that streamlines the end-to-end design workflow, from structured discovery and competitor research to generating a WCAG-compliant design system and building interactive low-fidelity wireframes or high-fidelity prototypes with real navigation, exportable screens, and a transferable design system to Figma.",
      ogImage: "https://elifsuates.com/images/wireframe-prototyper-thumbnail.png",
      ogImageWidth: "1400",
      ogImageHeight: "788",
    },
  },
];

/** Get a project config by slug */
export function getProjectConfig(slug: string): ProjectConfig | undefined {
  return projectConfigs.find((p) => p.slug === slug);
}
