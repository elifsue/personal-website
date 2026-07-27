import { Section, SectionLabel, CaseStudyLayout } from "@/components/case-study";
import { projectConfigs } from "@/config/projects";

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
            <div className="max-w-3xl space-y-6">
              <p className="text-base leading-relaxed" style={{ color: "#6B6560" }}>
                The Wireframe Prototyper Skill is a custom skill for Claude Code that enables rapid generation of interactive wireframes and prototypes directly from natural language prompts. It bridges the gap between ideation and implementation by allowing designers and developers to quickly visualise UI concepts without manual design tool work.
              </p>
              <p className="text-base leading-relaxed" style={{ color: "#6B6560" }}>
                Beyond wireframing, the skill can also perform structured competitor analysis — researching existing products in your space to identify UX patterns, strengths, and gaps that inform your design decisions from the start.
              </p>
              <p className="text-base leading-relaxed" style={{ color: "#6B6560" }}>
                Whether you need a quick low-fidelity wireframe to communicate a layout idea, or a high-fidelity interactive prototype to test user flows, this skill handles the transformation from text description to deployable web-based output. The resulting screens and design system are exportable to Figma through the Figma Code to Canvas tool, making handoff and iteration seamless.
              </p>
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
                { title: "Low-Fidelity Wireframes", desc: "Generate black-and-white wireframes with placeholder content, crossbox image placeholders, and simplified layouts — ideal for rapid ideation and early stakeholder feedback." },
                { title: "High-Fidelity Prototypes", desc: "Create polished, interactive prototypes with full styling, real navigation between screens, and micro-interactions ready for usability testing." },
                { title: "Competitor Analysis", desc: "Conduct structured competitor research by analysing existing products in the space, identifying UX patterns, strengths, and gaps to inform design decisions." },
                { title: "WCAG-Compliant Design System", desc: "Automatically generate a design system with accessible color contrast ratios, typography scales, spacing tokens, and component guidelines that meet WCAG 2.1 AA standards." },
                { title: "Material 3 Color Palette", desc: "Generate a configurable Material Design 3 color palette with accessible pairings across primary, secondary, and tertiary tones — bring your own brand color or let it auto-generate." },
                { title: "Exportable Screens & Design System", desc: "Output production-ready screens and a transferable design system that can be directly imported into Figma for handoff, iteration, and team collaboration." },
              ].map((feature) => (
                <div key={feature.title} className="p-6 rounded-2xl" style={{ background: "#F5F0EA" }}>
                  <h3 className="font-display text-lg font-medium mb-3" style={{ color: "#1C1917" }}>{feature.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B6560" }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>

    </CaseStudyLayout>
  );
}
