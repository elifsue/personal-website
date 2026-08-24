import { Section, SectionLabel, CaseStudyLayout } from "@/components/case-study";
import { projectConfigs } from "@/config/projects";

const IMG = `${import.meta.env.BASE_URL}images/wireframe-prototyper`;

const CODEX_DEMO = `${IMG}/skill-demo-on-codex.png`;
const CODE_TO_CANVAS = `${IMG}/code-to-canvas-loop.png`;
const SCRATCH_VS_SKILL = `${IMG}/from-scratch-vs-with-skill.png`;

const BENEFITS = [
  { label: "Structured discovery", text: "Upfront questions prevent wasted iterations later." },
  { label: "Reusable templates", text: "The skill carries its own component templates, so AI does not need to reinvent them every session." },
  { label: "Pre-loaded rules", text: "Design rules, accessibility requirements, and spacing systems are already defined." },
  { label: "Batch efficiency", text: "The skill knows to build all components first, then screens, minimising context-switching." },
];

const INTERVIEW_STEPS = [
  { label: "Fidelity scope", text: "Does the user need Lo-Fi wireframes, Hi-Fi prototypes, or both?" },
  { label: "Competitor analysis", text: "Is there a similar website to study?" },
  { label: "Feature clarification", text: 'Tailored questions about the specific project. "Does the project need user authentication?", "Should there be a messaging system?", "Is a payment flow required?", etc.' },
  { label: "Screen list", text: "Based on the user's answers, the skill suggests a comprehensive list of screens grouped by section." },
  { label: "Color palette", text: "What vibe does the user want? Warm? Earthy? Vibrant?" },
  { label: "Typography", text: "Font selection with Google Fonts integration." },
];

const OUTPUT_DEMOS = [
  {
    name: "Screens Sidebar",
    desc: "to navigate through the screens",
    src: `${IMG}/screens-sidebar.gif`,
    body: "The left sidebar gives the user an overview of the entire project. Every screen is listed, numbered, and clickable. The screens are linked through working navigation.",
  },
  {
    name: "Fidelity Mode Switches",
    desc: "to toggle between wireframes and hi-fi prototype",
    src: `${IMG}/fidelity-mode-switches.gif`,
    body: "The toolbar allows the user to switch instantly between Lo-Fi (the structural skeleton) and Hi-Fi (the full visual experience). Starting with Lo-Fi encourages the user to focus on structure and flow before getting distracted by colors.",
  },
  {
    name: "The Color Palette Tool",
    desc: "to customise the website's WCAG-compliant color palette",
    src: `${IMG}/color-palette-tool.gif`,
    body: "Instead of writing prompts to change colors, the user can simply click. The tool includes the generated website's Material 3-based color palette from the user's prompt, built-in presets, and a live WCAG contrast checker. When the user clicks a preset, the entire prototype recolors instantly. The user can also create and save custom presets, then export palettes as JSON to share across projects.",
  },
  {
    name: "Figma Capture Mode",
    desc: "to allow importing screens and dialogs into Figma",
    src: `${IMG}/figma-capture-mode.gif`,
    body: "When Figma Capture Mode is turned on, dialogs and dropdown menus will not auto-dismiss when the user clicks outside them. This allows the user to capture screenshots of open dialogs and dropdowns without triggering their dismissal when clicking on the Figma Capture tool. The feature is specifically designed to allow the user to import dialogs and dropdowns into Figma using Figma's Code to Canvas feature through Figma MCP.",
  },
];

const BODY_LINKS: Record<string, string> = {
  "Figma's Code to Canvas feature": "https://developers.figma.com/docs/figma-mcp-server/code-to-canvas/",
  "Figma MCP": "https://www.figma.com/mcp-catalog/",
};

/** Renders body copy, turning any phrase listed in BODY_LINKS into a link. */
function linkifyBody(text: string) {
  const phrases = Object.keys(BODY_LINKS)
    .sort((a, b) => b.length - a.length) // longest first so a shorter phrase can't win inside a longer one
    .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return text.split(new RegExp(`(${phrases.join("|")})`, "g")).map((part, i) =>
    BODY_LINKS[part] ? (
      <a
        key={i}
        href={BODY_LINKS[part]}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 transition-opacity hover:opacity-70"
        style={{ color: "#7B5EA7" }}
      >
        {part}
      </a>
    ) : (
      part
    ),
  );
}

const config = projectConfigs.find((p) => p.slug === "/wireframe-prototyper")!;

export default function WireframePrototyper() {
  const heroContent = (
    <>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="font-mono-dm text-xs tracking-widest uppercase px-3 py-1 rounded-full" style={{ background: "#7B5EA720", color: "#7B5EA7" }}>
                Claude Code Skill
              </span>
              <span className="font-mono-dm text-xs tracking-widest uppercase px-3 py-1 rounded-full" style={{ background: "#8D5E3C20", color: "#8D5E3C" }}>
                2026
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4" style={{ color: "#1C1917", fontWeight: 300 }}>
              Wireframe Prototyper <em style={{ color: "#7B5EA7" }}>Skill</em>
            </h1>
            <p className="text-xl leading-relaxed max-w-3xl mb-8" style={{ color: "#6B6560" }}>
              A reusable Claude Code Skill that streamlines the end-to-end design workflow, from structured discovery and competitor research to generating a WCAG-compliant design system and building interactive low-fidelity wireframes or high-fidelity prototypes with real navigation, exportable screens, and a transferable design system to Figma.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://medium.com/@elifsue/design-with-context-a-claude-skill-that-studies-competitors-and-builds-your-prototype-e4cdd8cb7519"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono-dm text-sm tracking-wide transition-all duration-300 hover:scale-105"
                style={{ background: "#FFFFFF", color: "#1C1917", border: "1px solid #1C1917" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
                </svg>
                Read on Medium
              </a>
              <a
                href="https://www.youtube.com/watch?v=EIryl8x3PCI"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono-dm text-sm tracking-wide transition-all duration-300 hover:scale-105"
                style={{ background: "#FF0000", color: "#FFFFFF" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Watch on YouTube
              </a>
              <a
                href="https://github.com/elifsue/wireframe-prototyper-skill"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono-dm text-sm tracking-wide transition-all duration-300 hover:scale-105"
                style={{ background: "#1C1917", color: "#FAF7F2" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                View on GitHub
              </a>
            </div>
    </>
  );

  return (
    <CaseStudyLayout config={config} heroContent={heroContent}>

        <div className="px-8 lg:px-32 py-20" style={{ background: "#F5F0EA" }}>
          <Section>
            <SectionLabel color="#7B5EA7" label="Overview" />
            <h2 className="font-display text-3xl mb-8" style={{ color: "#1C1917", fontWeight: 300 }}>
              What is <em style={{ color: "#7B5EA7" }}>this?</em>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 lg:gap-16 lg:items-center">
              <div className="space-y-6">
                <p className="text-base leading-relaxed" style={{ color: "#6B6560" }}>
                  Wireframe Prototyper is a reusable AI design skill that turns an initial project brief into a structured design workflow. It guides the designer through discovery, competitor analysis, screen planning and accessibility considerations before generating low and high-fidelity prototypes with functional navigation, WCAG-compliant Material 3 color palette, reusable components and screens that can be transferred to Figma for further refinement.
                </p>
                <p className="text-base leading-relaxed" style={{ color: "#6B6560" }}>
                  I created it to reduce repetitive prompting while keeping the designer in control of key decisions.
                </p>
              </div>
              {/* Transparent PNG — sits straight on the section tint, no container needed */}
              <img
                src={CODE_TO_CANVAS}
                alt="Round trip between Claude Code and Figma: Code to Canvas pushes generated code into Figma, and Design to Code brings Figma changes back"
                loading="lazy"
                className="w-full h-auto"
              />
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" id="features">
          <Section>
            <SectionLabel color="#7B5EA7" label="Features" />
            <h2 className="font-display text-3xl mb-10" style={{ color: "#1C1917", fontWeight: 300 }}>
              Key <em style={{ color: "#7B5EA7" }}>Capabilities</em>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Low-Fidelity Wireframes", desc: "Generates black-and-white wireframes with placeholder content, crossbox image placeholders, and simplified layouts, ideal for rapid ideation and early stakeholder feedback." },
                { title: "High-Fidelity Prototypes", desc: "Creates polished, interactive prototypes with full styling, real navigation between screens, and interactions ready for usability testing." },
                { title: "Competitor Analysis", desc: "Conducts structured competitor research by analysing existing products in the space, identifying UX patterns, strengths, and gaps to inform design decisions." },
                { title: "WCAG-Compliant Design System", desc: "Automatically generates a design system with accessible color contrast ratios, typography scales, spacing tokens, and component guidelines that meet WCAG 2.1 AA standards." },
                { title: "Material 3 Color Palette", desc: "Generates a configurable Material Design 3 color palette with accessible pairings across primary, secondary, and tertiary tones." },
                { title: "Exportable Screens & Design System", desc: "Outputs production-ready screens and a transferable design system that can be directly imported into Figma for handoff, iteration, and team collaboration." },
              ].map((feature) => (
                <div key={feature.title} className="p-6 rounded-2xl" style={{ background: "#F5F0EA" }}>
                  <h3 className="font-display text-lg font-medium mb-3" style={{ color: "#1C1917" }}>{feature.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B6560" }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" id="demo" style={{ background: "#F5F0EA" }}>
          <Section>
            <SectionLabel color="#7B5EA7" label="Demo" />
            <h2 className="font-display text-3xl mb-10" style={{ color: "#1C1917", fontWeight: 300 }}>
              Skill Demo on <em style={{ color: "#7B5EA7" }}>Codex</em>
            </h2>

            <div className="max-w-3xl mb-12">
              <h3 className="font-display text-2xl mb-4" style={{ color: "#1C1917", fontWeight: 400 }}>
                The Interview Process
              </h3>
              <p className="text-base leading-relaxed mb-6" style={{ color: "#6B6560" }}>
                When a user starts a new project, the skill begins by interviewing them. It asks questions one at a time, waiting for the user's response before moving to the next:
              </p>
              <ol className="list-decimal pl-5 space-y-3 mb-6">
                {INTERVIEW_STEPS.map((step) => (
                  <li key={step.label} className="text-base leading-relaxed pl-1" style={{ color: "#6B6560" }}>
                    <strong style={{ color: "#1C1917", fontWeight: 600 }}>{step.label}:</strong> {step.text}
                  </li>
                ))}
              </ol>
              <p className="text-base leading-relaxed" style={{ color: "#6B6560" }}>
                This interview process is helpful, by making the user think about things they might have overlooked, while helping the user ensure that nothing gets built until the scope is clear.
              </p>
            </div>

            <div className="w-full overflow-x-auto rounded-2xl p-4" style={{ background: "#FAF7F2" }}>
              <img
                src={CODEX_DEMO}
                alt="Skill Demo on Codex — the guided discovery flow, covering fidelity choice, competitor analysis, guided discovery, product name, color palette, and typography"
                loading="lazy"
                className="w-full h-auto block min-w-[900px]"
              />
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" id="output">
          <Section>
            <SectionLabel color="#7B5EA7" label="Output" />
            <h2 className="font-display text-3xl mb-10" style={{ color: "#1C1917", fontWeight: 300 }}>
              Skill <em style={{ color: "#7B5EA7" }}>Output</em>
            </h2>
            {/* Text sits beside the GIF from lg up, alternating sides; stacks below that. */}
            {/* flex gap, not space-y: Tailwind compiles space-y inside :where() (specificity 0),
                so the figure's own m-0 would override it and collapse the spacing to nothing. */}
            <div className="flex flex-col gap-16 lg:gap-24">
              {OUTPUT_DEMOS.map((demo, i) => {
                const imageFirst = i % 2 === 1;
                return (
                  <figure
                    key={demo.name}
                    /* Track sizes flip with the row so the GIF always lands in the wide
                       column — grid places items in order-modified order, so a fixed
                       [1fr_2fr] would put the image in the narrow track on flipped rows. */
                    className={`m-0 grid grid-cols-1 gap-6 lg:gap-12 lg:items-center ${
                      imageFirst ? "lg:grid-cols-[2fr_1fr]" : "lg:grid-cols-[1fr_2fr]"
                    }`}
                  >
                    <figcaption className={imageFirst ? "lg:order-2" : undefined}>
                      <h3 className="font-display text-2xl mb-2" style={{ color: "#1C1917", fontWeight: 400 }}>
                        {demo.name}
                      </h3>
                      <p className="text-base leading-relaxed mb-4" style={{ color: "#7B5EA7" }}>
                        {demo.desc}
                      </p>
                      <p className="text-base leading-relaxed" style={{ color: "#6B6560" }}>
                        {linkifyBody(demo.body)}
                      </p>
                    </figcaption>
                    <div
                      className={`rounded-2xl overflow-hidden ${imageFirst ? "lg:order-1" : ""}`}
                      style={{ background: "#F5F0EA", border: "1px solid #7B5EA720" }}
                    >
                      <img
                        src={demo.src}
                        alt={`${demo.name} — ${demo.desc}`}
                        loading="lazy"
                        className="w-full h-auto block"
                      />
                    </div>
                  </figure>
                );
              })}
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" id="benefits" style={{ background: "#F5F0EA" }}>
          <Section>
            <SectionLabel color="#7B5EA7" label="Benefits" />
            <h2 className="font-display text-3xl mb-8" style={{ color: "#1C1917", fontWeight: 300 }}>
              Why Use the Wireframe Prototyper <em style={{ color: "#7B5EA7" }}>Skill?</em>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 lg:gap-16 lg:items-center">
              <div className="space-y-6">
                <p className="text-base leading-relaxed" style={{ color: "#6B6560" }}>
                  The Wireframe Prototyper Skill enables rapid generation of interactive wireframes and prototypes directly from natural language prompts. It bridges the gap between ideation and implementation by allowing designers and developers to quickly visualise UI concepts without manual design tool work.
                </p>
                <p className="text-base leading-relaxed" style={{ color: "#6B6560" }}>
                  The Wireframe Prototyper Skill solves this by providing:
                </p>
                <ul className="list-disc pl-5 space-y-3">
                  {BENEFITS.map((benefit) => (
                    <li key={benefit.label} className="text-base leading-relaxed pl-1" style={{ color: "#6B6560" }}>
                      <strong style={{ color: "#1C1917", fontWeight: 600 }}>{benefit.label}:</strong> {benefit.text}
                    </li>
                  ))}
                </ul>
              </div>
              <img
                src={SCRATCH_VS_SKILL}
                alt="From Scratch versus With the Skill — repeated prompting becomes a reusable workflow, AI filling gaps independently becomes designer-guided decisions, and inconsistent outputs become a structured design system"
                loading="lazy"
                className="w-full h-auto"
              />
            </div>
          </Section>
        </div>

    </CaseStudyLayout>
  );
}
