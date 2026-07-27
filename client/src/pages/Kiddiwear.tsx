import { Section, SectionLabel, CaseStudyLayout } from "@/components/case-study";
import { projectConfigs } from "@/config/projects";

const config = projectConfigs.find((p) => p.slug === "/kiddiwear")!;

export default function Kiddiwear() {
  const heroContent = (
    <>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="font-mono-dm text-xs tracking-widest uppercase px-3 py-1 rounded-full" style={{ background: "#BF583620", color: "#BF5836" }}>
                UI/UX Design
              </span>
              <span className="font-mono-dm text-xs tracking-widest uppercase px-3 py-1 rounded-full" style={{ background: "#8D5E3C20", color: "#8D5E3C" }}>
                Website
              </span>
              <span className="font-mono-dm text-xs tracking-widest uppercase px-3 py-1 rounded-full" style={{ background: "#8D5E3C20", color: "#8D5E3C" }}>
                2026
              </span>
            </div>
            <h1 className="mb-4">
              <img
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/vQxJHiCfXBepUltv.png"
                alt="Kiddiwear"
                className="h-16 md:h-20 lg:h-24 w-auto"
              />
            </h1>
            <p className="text-xl leading-relaxed max-w-2xl mb-8" style={{ color: "#6B6560" }}>
              A peer-to-peer marketplace website for children's clothing — making second-hand feel premium.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://elifsue.github.io/kiddiwear/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono-dm text-sm tracking-wide transition-all duration-300 hover:scale-105"
                style={{ background: "#BF5836", color: "#FAF7F2" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                View Interactive Prototype
              </a>
              <a
                href="https://www.behance.net/gallery/250957329/Childrens-Clothing-Marketplace-Website-Design-UXUI"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono-dm text-sm tracking-wide transition-all duration-300 hover:scale-105"
                style={{ background: "#4A6FA5", color: "#FFFFFF" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/>
                </svg>
                View on Behance
              </a>
              <a
                href="https://www.figma.com/design/IDK1e8n4xDMTt6FJ5zKidJ/Kiddiwear?node-id=3082-18790&t=I9EavRW2mVMJzCgM-1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono-dm text-sm tracking-wide transition-all duration-300 hover:scale-105"
                style={{ background: "#7B5EA7", color: "#FFFFFF" }}
              >
                <svg width="16" height="16" viewBox="0 0 38 57" fill="currentColor">
                  <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z"/>
                  <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z"/>
                  <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z"/>
                  <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z"/>
                  <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z"/>
                </svg>
                View on Figma
              </a>
              <a
                href="https://github.com/elifsue/kiddiwear"
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
            <SectionLabel color="#BF5836" label="Overview" />
            <h2 className="font-display text-3xl md:text-4xl mb-6" style={{ color: "#1C1917", fontWeight: 300 }}>
              About <em style={{ color: "#BF5836" }}>Kiddiwear</em>
            </h2>
            <p className="text-lg leading-relaxed mb-10 max-w-3xl" style={{ color: "#6B6560" }}>
              Kiddiwear is a UI/UX design project developed as part of the Google UX Design Professional Certificate on Coursera, focused on creating a dedicated UK marketplace for buying and selling pre-loved children's clothing.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              {[
                { name: "Figma", logo: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/JDWzeFRlBQpYRNXU.png" },
                { name: "Lucidchart", logo: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/KpKsLwqHsDcFXtXs.png" },
                { name: "Claude Code", logo: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/VikdDFbzmeIoqhaw.png" },
                { name: "Manus", logo: "https://manus.im/favicon.ico" },
              ].map((tool) => (
                <div key={tool.name} className="flex items-center gap-3 px-4 py-2.5 rounded-full" style={{ background: "#FAF7F2" }}>
                  <img src={tool.logo} alt={tool.name} className="w-6 h-6 object-contain" />
                  <span className="font-mono-dm text-xs tracking-wide" style={{ color: "#1C1917" }}>{tool.name}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {["UX Research", "Sketching", "Wireframing", "Rapid Prototyping", "Vibe Coding"].map((skill) => (
                <span key={skill} className="px-3 py-1.5 rounded-full font-mono-dm text-xs tracking-wide" style={{ background: "#BF583615", color: "#BF5836" }}>
                  {skill}
                </span>
              ))}
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20">
          <Section>
            <SectionLabel color="#BF5836" label="Process" />
            <h2 className="font-display text-3xl mb-6" style={{ color: "#1C1917", fontWeight: 300 }}>
              Simulated Research, <em style={{ color: "#BF5836" }}>Real Design Process</em>
            </h2>
            <p className="text-base leading-relaxed mb-6 max-w-3xl" style={{ color: "#6B6560" }}>
              Since this was a course project, I leveraged AI to simulate the initial user research phase, using Manus as an AI agent, creating 20 fictional user profiles and conducting structured interviews to produce realistic data. The resulting insights shaped the design direction, while all subsequent design work was completed independently.
            </p>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" style={{ background: "#F5F0EA" }}>
          <Section>
            <SectionLabel color="#BF5836" label="Workflow" />
            <h2 className="font-display text-3xl mb-8" style={{ color: "#1C1917", fontWeight: 300 }}>
              Claude Code <span style={{ color: "#BF5836" }}>↔</span> Figma
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <p className="text-base leading-relaxed mb-6" style={{ color: "#6B6560" }}>
                  The website was vibe-coded using Claude Code, then migrated into Figma using Figma's Code to Canvas tool.
                </p>
                <p className="text-base leading-relaxed mb-6" style={{ color: "#6B6560" }}>
                  From there, I built a component library and established a design system within Figma. The workflow became a continuous loop; design iterations made in Figma were pushed back to code via Figma MCP and Claude Code, and code updates were reflected back in the design.
                </p>
                <p className="text-base leading-relaxed" style={{ color: "#6B6560" }}>
                  This back and forth process allowed me to refine both the prototype and the design system simultaneously across multiple iterations, while making the website UI code production-ready.
                </p>
              </div>
              <div className="flex flex-col items-center gap-6">
                <div className="w-full max-w-sm p-6 rounded-2xl flex items-center gap-4" style={{ background: "#FAF7F2", border: "1px solid #BF583630" }}>
                  <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/VikdDFbzmeIoqhaw.png" alt="Claude Code" className="w-10 h-10 object-contain" />
                  <div>
                    <div className="font-mono-dm text-xs tracking-wide uppercase mb-1" style={{ color: "#BF5836" }}>Claude Code</div>
                    <div className="text-sm" style={{ color: "#6B6560" }}>Vibe coding & implementation</div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="font-mono-dm text-xs" style={{ color: "#8D5E3C" }}>Code to Canvas ↓</span>
                  <span className="font-mono-dm text-xs" style={{ color: "#8D5E3C" }}>↑ Figma MCP</span>
                </div>
                <div className="w-full max-w-sm p-6 rounded-2xl flex items-center gap-4" style={{ background: "#FAF7F2", border: "1px solid #8D5E3C30" }}>
                  <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/JDWzeFRlBQpYRNXU.png" alt="Figma" className="w-10 h-10 object-contain" />
                  <div>
                    <div className="font-mono-dm text-xs tracking-wide uppercase mb-1" style={{ color: "#8D5E3C" }}>Figma</div>
                    <div className="text-sm" style={{ color: "#6B6560" }}>Component library & design system</div>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" id="problem">
          <Section>
            <SectionLabel color="#BF5836" label="Problem" />
            <h2 className="font-display text-3xl mb-8" style={{ color: "#1C1917", fontWeight: 300 }}>
              The <em style={{ color: "#BF5836" }}>Problem</em>
            </h2>
            <p className="text-lg leading-relaxed mb-10 max-w-3xl" style={{ color: "#6B6560" }}>
              Children's clothes are outgrown in months, leaving families with wardrobes of perfectly good items they no longer need, yet reselling them on existing platforms feels cluttered, untrustworthy, and not worth the effort while UK clothing waste and costs keep rising.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { num: "1", stat: "216 million", desc: "pieces of children's clothing sent to UK landfill yearly", source: "BusinessGreen, Nov 2025" },
                { num: "2", stat: "£420+", desc: "average annual spend on clothes per child", source: "The Independent, Dec 2025" },
                { num: "3", stat: "80%", desc: "of parents say kids' clothes are more expensive than last year", source: "The Independent, Dec 2025" },
              ].map((item) => (
                <div key={item.num} className="p-6 rounded-2xl" style={{ background: "#F5F0EA" }}>
                  <div className="font-mono-dm text-xs tracking-wide mb-3 px-2 py-0.5 rounded-full inline-block" style={{ background: "#BF583620", color: "#BF5836" }}>
                    {item.num}
                  </div>
                  <div className="font-display text-2xl mb-2" style={{ color: "#1C1917", fontWeight: 400 }}>{item.stat}</div>
                  <p className="text-sm leading-relaxed mb-2" style={{ color: "#6B6560" }}>{item.desc}</p>
                  <p className="font-mono-dm text-xs" style={{ color: "#8D5E3C" }}>— {item.source}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" id="solution" style={{ background: "#F5F0EA" }}>
          <Section>
            <SectionLabel color="#BF5836" label="Solution" />
            <h2 className="font-display text-3xl mb-6" style={{ color: "#1C1917", fontWeight: 300 }}>
              The <em style={{ color: "#BF5836" }}>Solution</em>
            </h2>
            <p className="text-lg leading-relaxed mb-10 max-w-3xl" style={{ color: "#6B6560" }}>
              A dedicated peer-to-peer marketplace exclusively for children's clothing. Kiddiwear removes the barriers of trust, effort, and stigma by offering verified condition ratings, buyer protection, integrated delivery, and a curated shopping experience that makes second-hand feel premium.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { feature: "Buyer Protection", icon: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/MKXhkXcYCtrxzPtU.png" },
                { feature: "Condition Ratings", icon: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/dsviDQipgNUMGyhm.png" },
                { feature: "Integrated Delivery", icon: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/izdXwEEzOMXQKrTN.png" },
                { feature: "Curated Experience", icon: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/IaJGWcWgLqXZnTmx.png" },
              ].map((item) => (
                <div key={item.feature} className="p-5 rounded-2xl flex flex-col items-center gap-3" style={{ background: "#FAF7F2", border: "1px solid #BF583615" }}>
                  <img src={item.icon} alt={item.feature} className="w-10 h-10 object-contain" />
                  <span className="text-sm font-medium text-center" style={{ color: "#1C1917" }}>{item.feature}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20">
          <Section>
            <SectionLabel color="#BF5836" label="Methodology" />
            <h2 className="font-display text-3xl mb-6" style={{ color: "#1C1917", fontWeight: 300 }}>
              Design Thinking <em style={{ color: "#BF5836" }}>Methodology</em>
            </h2>
            <p className="text-base leading-relaxed mb-10 max-w-3xl" style={{ color: "#6B6560" }}>
              This project follows the Design Thinking methodology, understanding user needs through research, defining key problems, generating ideas, building prototypes, and validating through real usability testing.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { phase: "Empathise", items: ["User Research", "Empathy Map"] },
                { phase: "Define", items: ["User Persona", "User Journeys", "User Stories"] },
                { phase: "Ideate", items: ["Brainstorm", "Information Architecture", "User Flows", "Competitive Audit"] },
                { phase: "Design", items: ["Paper Wireframes", "Digital Wireframes", "Design System", "Prototype"] },
                { phase: "Test", items: ["Usability Test", "Future Concepts"] },
              ].map((p, i) => (
                <div key={p.phase} className="p-5 rounded-2xl" style={{ background: "#F5F0EA" }}>
                  <div className="font-mono-dm text-xs tracking-wide uppercase mb-3" style={{ color: "#BF5836" }}>
                    {String(i + 1).padStart(2, "0")} — {p.phase}
                  </div>
                  <ul className="space-y-1">
                    {p.items.map((item) => (
                      <li key={item} className="text-sm" style={{ color: "#6B6560" }}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" id="empathise" style={{ background: "#F5F0EA" }}>
          <Section>
            <SectionLabel color="#BF5836" label="Empathise" />
            <h2 className="font-display text-3xl mb-6" style={{ color: "#1C1917", fontWeight: 300 }}>
              User <em style={{ color: "#BF5836" }}>Research</em>
            </h2>
            <p className="text-base leading-relaxed mb-8 max-w-3xl" style={{ color: "#6B6560" }}>
              Key questions explored during the research phase:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {[
                "How do you feel about purchasing second-hand clothing for children?",
                "What, if anything, influences that feeling?",
                "If there were a platform designed specifically for buying and selling children's clothing, what would matter most to you?",
                "What would make you want to use it regularly?",
              ].map((q, i) => (
                <div key={i} className="p-5 rounded-2xl" style={{ background: "#FAF7F2" }}>
                  <p className="text-sm italic leading-relaxed" style={{ color: "#1C1917" }}>"{q}"</p>
                </div>
              ))}
            </div>

            <h3 className="font-display text-2xl mb-8" style={{ color: "#1C1917", fontWeight: 300 }}>
              Key <em style={{ color: "#BF5836" }}>Findings</em>
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-6 rounded-2xl" style={{ background: "#FAF7F2" }}>
                <h4 className="font-mono-dm text-xs tracking-wide uppercase mb-4" style={{ color: "#BF5836" }}>Platform Features (n=20)</h4>
                <img
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/ZQpwCNdVqGZGFFVs.png"
                  alt="Platform Features Pie Chart showing Trust & Quality Assurance as the top requested feature"
                  className="w-full h-auto"
                />
              </div>
              <div className="p-6 rounded-2xl" style={{ background: "#FAF7F2" }}>
                <h4 className="font-mono-dm text-xs tracking-wide uppercase mb-4" style={{ color: "#BF5836" }}>Barriers (n=20)</h4>
                <img
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/QybVSyIbRFfbnDWM.png"
                  alt="Barriers Pie Chart showing Uncertainty about quality/condition as the top barrier"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" id="define">
          <Section>
            <SectionLabel color="#BF5836" label="Define" />
            <h2 className="font-display text-3xl mb-10" style={{ color: "#1C1917", fontWeight: 300 }}>
              User <em style={{ color: "#BF5836" }}>Persona</em>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="overflow-hidden">
                <img
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/isUvPiSWHZMiRkHQ.png"
                  alt="Michael T. — Age 44, Edinburgh, Marketing manager, father of 2"
                  className="w-full h-auto"
                />
              </div>

              <div className="overflow-hidden">
                <img
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/rmdghUpgqORpIaDf.png"
                  alt="Amina H. — Age 26, Leeds, Stay at home mother of 3"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" id="ideate" style={{ background: "#F5F0EA" }}>
          <Section>
            <SectionLabel color="#BF5836" label="Ideate" />
            <h2 className="font-display text-3xl mb-10" style={{ color: "#1C1917", fontWeight: 300 }}>
              Competitive <em style={{ color: "#BF5836" }}>Analysis</em>
            </h2>
            <div className="w-full overflow-x-auto">
              <img
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/xUVTHysxHxWgANpn.png"
                alt="SWOT Competitive Analysis — Vinted, thelittleloop, Second Snuggle"
                className="w-full h-auto"
              />
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20">
          <Section>
            <SectionLabel color="#BF5836" label="Ideate" />
            <h2 className="font-display text-3xl mb-8" style={{ color: "#1C1917", fontWeight: 300 }}>
              Information <em style={{ color: "#BF5836" }}>Architecture</em>
            </h2>
            <div className="w-full overflow-x-auto rounded-2xl p-4" style={{ background: "#F5F0EA" }}>
              <img
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/xZyfVkGdCcBwxFKT.png"
                alt="Kiddiwear Information Architecture Diagram"
                className="w-full h-auto min-w-[800px]"
              />
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" style={{ background: "#F5F0EA" }}>
          <Section>
            <SectionLabel color="#BF5836" label="User Flows" />
            <h2 className="font-display text-3xl mb-10" style={{ color: "#1C1917", fontWeight: 300 }}>
              User <em style={{ color: "#BF5836" }}>Flows</em>
            </h2>

            <div className="space-y-10">
              <div className="rounded-2xl overflow-hidden" style={{ background: "#FAF7F2" }}>
                <div className="p-6 pb-0">
                  <h3 className="font-display text-xl mb-4" style={{ color: "#1C1917" }}>Buy Item</h3>
                </div>
                <div className="w-full overflow-x-auto p-6">
                  <img
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/BuiYybtJTygWWHAw.png"
                    alt="Buy Item User Flow"
                    className="w-full h-auto min-w-[700px]"
                  />
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden" style={{ background: "#FAF7F2" }}>
                <div className="p-6 pb-0">
                  <h3 className="font-display text-xl mb-4" style={{ color: "#1C1917" }}>Sell Item</h3>
                </div>
                <div className="w-full overflow-x-auto p-6">
                  <img
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/YyfsRIAZGUsFphlw.png"
                    alt="Sell Item User Flow"
                    className="w-full h-auto min-w-[700px]"
                  />
                </div>
              </div>
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" id="design">
          <Section>
            <SectionLabel color="#BF5836" label="Design" />
            <h2 className="font-display text-3xl mb-8" style={{ color: "#1C1917", fontWeight: 300 }}>
              Paper <em style={{ color: "#BF5836" }}>Wireframes</em>
            </h2>
            <div className="w-full overflow-x-auto rounded-2xl p-4" style={{ background: "#F5F0EA" }}>
              <img
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/SQfRvWrEbvlVJHjh.png"
                alt="Paper Wireframes showing homepage design iterations from in-progress sketches to final design"
                className="w-full h-auto min-w-[800px]"
              />
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" style={{ background: "#F5F0EA" }}>
          <Section>
            <SectionLabel color="#BF5836" label="Design" />
            <h2 className="font-display text-3xl mb-8" style={{ color: "#1C1917", fontWeight: 300 }}>
              Digital <em style={{ color: "#BF5836" }}>Wireframes</em>
            </h2>
            <div className="w-full overflow-x-auto">
              <img
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/WGKUaqQvgdbAszXa.png"
                alt="Digital Wireframes showing Home Page, Products Listing, Product Detail, My Listings, Seller Reviews, Sell Item, Checkout, My Purchases, Messages, Track Order, How It Works, and Help Centre"
                className="w-full h-auto min-w-[800px]"
              />
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20">
          <Section>
            <SectionLabel color="#BF5836" label="Design" />
            <h2 className="font-display text-3xl mb-10" style={{ color: "#1C1917", fontWeight: 300 }}>
              Design <em style={{ color: "#BF5836" }}>System</em>
            </h2>

            <div className="mb-12">
              <h3 className="font-mono-dm text-xs tracking-wide uppercase mb-4" style={{ color: "#8D5E3C" }}>Color Palette</h3>
              <div className="flex flex-wrap gap-4">
                {[
                  { name: "Primary", hex: "#BF5836" },
                  { name: "Secondary", hex: "#8D5E3C" },
                  { name: "Tertiary", hex: "#C59B26" },
                  { name: "Success", hex: "#1B873B" },
                  { name: "Error", hex: "#BA1A1A" },
                ].map((color) => (
                  <div key={color.name} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#F5F0EA" }}>
                    <div className="w-10 h-10 rounded-lg" style={{ background: color.hex }} />
                    <div>
                      <div className="text-sm font-medium" style={{ color: "#1C1917" }}>{color.name}</div>
                      <div className="font-mono-dm text-xs" style={{ color: "#6B6560" }}>{color.hex}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-mono-dm text-xs tracking-wide uppercase mb-4" style={{ color: "#8D5E3C" }}>Typography</h3>
              <div className="p-6 rounded-2xl" style={{ background: "#F5F0EA" }}>
                <div className="text-2xl mb-2" style={{ color: "#1C1917", fontFamily: "Inter, sans-serif" }}>Inter</div>
                <p className="text-sm mb-4" style={{ color: "#6B6560" }}>Sans-serif typeface designed for screen readability</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { weight: "Regular", value: "400" },
                    { weight: "Medium", value: "500" },
                    { weight: "Semibold", value: "600" },
                    { weight: "Bold", value: "700" },
                  ].map((w) => (
                    <div key={w.weight}>
                      <div className="text-sm" style={{ color: "#1C1917", fontWeight: Number(w.value) }}>{w.weight}</div>
                      <div className="font-mono-dm text-xs" style={{ color: "#8D5E3C" }}>{w.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" style={{ background: "#F5F0EA" }}>
          <Section>
            <SectionLabel color="#BF5836" label="Final Design" />
            <h2 className="font-display text-3xl mb-6" style={{ color: "#1C1917", fontWeight: 300 }}>
              Final <em style={{ color: "#BF5836" }}>Design</em>
            </h2>
            <p className="text-base leading-relaxed mb-10 max-w-3xl" style={{ color: "#6B6560" }}>
              Key pages designed for the Kiddiwear marketplace:
            </p>
            <div className="w-full overflow-x-auto">
              <img
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/JfQxRHZTzyDzweGr.png"
                alt="Final Designs showing all key pages of the Kiddiwear marketplace including Home Page, Products Listing, Product Detail, My Listings, Seller Reviews, Sell Item, Checkout, My Purchases, Messages, Track Order, How It Works, and Help Centre"
                className="w-full h-auto min-w-[600px]"
              />
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" id="test">
          <Section>
            <SectionLabel color="#BF5836" label="Test" />
            <h2 className="font-display text-3xl mb-8" style={{ color: "#1C1917", fontWeight: 300 }}>
              Usability <em style={{ color: "#BF5836" }}>Testing</em>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              {[
                { quote: "How do I know which chat is for which?", participant: "A." },
                { quote: "There are so many subcategories.", participant: "P." },
                { quote: "I didn't know bundles were a thing.", participant: "S." },
              ].map((q) => (
                <div key={q.participant} className="p-5 rounded-2xl" style={{ background: "#F5F0EA" }}>
                  <p className="text-sm italic leading-relaxed mb-3" style={{ color: "#1C1917" }}>"{q.quote}"</p>
                  <span className="font-mono-dm text-xs" style={{ color: "#BF5836" }}>— {q.participant}</span>
                </div>
              ))}
            </div>

            <h3 className="font-display text-xl mb-4" style={{ color: "#1C1917" }}>Findings</h3>
            <div className="overflow-x-auto rounded-2xl" style={{ background: "#F5F0EA" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid #BF583620" }}>
                    <th className="text-left p-4 font-mono-dm text-xs tracking-wide uppercase" style={{ color: "#BF5836" }}>Finding</th>
                    <th className="text-left p-4 font-mono-dm text-xs tracking-wide uppercase" style={{ color: "#BF5836" }}>Severity</th>
                    <th className="text-left p-4 font-mono-dm text-xs tracking-wide uppercase" style={{ color: "#BF5836" }}>Frequency</th>
                    <th className="text-left p-4 font-mono-dm text-xs tracking-wide uppercase" style={{ color: "#BF5836" }}>Evidence</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { finding: "Subcategory selection on Sell an Item page is confusing", severity: "High", frequency: "6/7 (86%)", evidence: "13 errors on task" },
                    { finding: "Users lose context of which item is being discussed in messages", severity: "Medium", frequency: "4/7 (57%)", evidence: "4 participants mentioned losing context" },
                    { finding: "Bundle discount is not easily discoverable", severity: "High", frequency: "5/7 (71%)", evidence: "9 errors on task" },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: i < 2 ? "1px solid #BF583610" : "none" }}>
                      <td className="p-4" style={{ color: "#1C1917" }}>{row.finding}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: row.severity === "High" ? "#BA1A1A20" : "#C59B2620", color: row.severity === "High" ? "#BA1A1A" : "#C59B26" }}>
                          {row.severity}
                        </span>
                      </td>
                      <td className="p-4 font-mono-dm text-xs" style={{ color: "#6B6560" }}>{row.frequency}</td>
                      <td className="p-4 text-xs" style={{ color: "#6B6560" }}>{row.evidence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" style={{ background: "#F5F0EA" }}>
          <Section>
            <SectionLabel color="#BF5836" label="Iterations" />
            <h2 className="font-display text-3xl mb-10" style={{ color: "#1C1917", fontWeight: 300 }}>
              Iterations <em style={{ color: "#BF5836" }}>After Testing</em>
            </h2>

            <div className="space-y-12">
              <div className="rounded-2xl overflow-hidden" style={{ background: "#FAF7F2" }}>
                <div className="p-6 pb-0">
                  <div className="font-mono-dm text-xs tracking-wide uppercase mb-2" style={{ color: "#BF5836" }}>Iteration 01 — Category Selector</div>
                </div>
                <div className="w-full overflow-x-auto p-4">
                  <img
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/jXSjxUsmpIDXxDTA.png"
                    alt="Iteration 1: Replaced subcategory drop-down with a simplified category selector"
                    className="w-full h-auto min-w-[700px]"
                  />
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden" style={{ background: "#FAF7F2" }}>
                <div className="p-6 pb-0">
                  <div className="font-mono-dm text-xs tracking-wide uppercase mb-2" style={{ color: "#BF5836" }}>Iteration 02 — Messages with Product Card</div>
                </div>
                <div className="w-full overflow-x-auto p-4">
                  <img
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/oVUSOXuIqzGVSlpn.png"
                    alt="Iteration 2: Added inline product card and item reference to message threads"
                    className="w-full h-auto min-w-[700px]"
                  />
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden" style={{ background: "#FAF7F2" }}>
                <div className="p-6 pb-0">
                  <div className="font-mono-dm text-xs tracking-wide uppercase mb-2" style={{ color: "#BF5836" }}>Iteration 03 — Bundle Discount Visibility</div>
                </div>
                <div className="w-full overflow-x-auto p-4">
                  <img
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663332337268/lcOUepQGMArPwAuq.png"
                    alt="Iteration 3: Moved bundle discount section higher on the page"
                    className="w-full h-auto min-w-[700px]"
                  />
                </div>
              </div>
            </div>
          </Section>
        </div>

    </CaseStudyLayout>
  );
}
