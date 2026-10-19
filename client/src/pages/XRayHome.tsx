import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Section, SectionLabel, CaseStudyLayout, ProjectDetails } from "@/components/case-study";
import { projectConfigs } from "@/config/projects";
import { tools } from "@/config/tools";

const IMG = `${import.meta.env.BASE_URL}images/xray-home`;

const ACCENT = "#2E4372";
const FIGMA_URL = "https://www.figma.com/design/5VZpQsViJwXVZPqJaYycRU/X-Ray-Home?node-id=107-2&t=0IOIIMpYdRoclDm1-1";
const FIGMA_EMBED_URL = "https://embed.figma.com/design/5VZpQsViJwXVZPqJaYycRU/X-Ray-Home?node-id=107-2&embed-host=share";

const ROLE = [
  { label: "Role", value: "UI/UX Designer (Internship)" },
  { label: "Timeline", value: "Jan 2026 – Apr 2026" },
  { label: "Location", value: "London, UK" },
];

const TOOLS = [tools.figma, tools.chatgpt];

const RESPONSIBILITIES = ["UX Research", "Design System", "Prototyping", "Usability Testing"];


const PROBLEMS = [
  { title: "Limited by the Template", desc: "The template was hard to customise for features like property search, events, and market news." },
  { title: "Confusing Experience", desc: "Buyers and tenants found it difficult to find properties or get in touch." },
  { title: "Dated Brand Image", desc: "Its dated look no longer reflected a premium, boutique agency." },
  { title: "Slow & Costly to Maintain", desc: "The plugin-heavy setup was slow and costly to maintain." },
];

type Rating = "Strong" | "Partial" | "Missing" | "Unverified";

const LOGOS = `${IMG}/competitors`;

// Wordmarks differ in visual weight, so each gets its own height to look balanced
const COMPETITORS = [
  { name: "Rightmove", logo: `${LOGOS}/rightmove-logo.svg`, className: "h-[30px]" },
  { name: "Zoopla", logo: `${LOGOS}/zoopla-logo.svg`, className: "h-5" },
  { name: "X-Ray Home", logo: `${LOGOS}/xray-home-logo.png`, className: "h-[30px]", caption: "Current site" },
];

// Each row: one cell per competitor, in COMPETITORS order
const COMPARISON: { criterion: string; cells: { rating: Rating; note: string }[] }[] = [
  { criterion: "Property search & filters", cells: [
    { rating: "Strong", note: "Buy, rent and sold tabs, detailed filters and AI keyword search" },
    { rating: "Strong", note: "Radius, price, bedroom and type filters with five sort options" },
    { rating: "Partial", note: "Duplicated search, mislabelled price fields and no sorting" },
  ] },
  { criterion: "Listing detail", cells: [
    { rating: "Strong", note: "Photos, floor plans, virtual tours, tenure, council tax and EPC" },
    { rating: "Strong", note: "Photos, floor plans, EPC, tenure and price per sq ft" },
    { rating: "Partial", note: "No floor plans, missing tenure and EPC, inconsistent data" },
  ] },
  { criterion: "Mortgage & affordability", cells: [
    { rating: "Strong", note: "Mortgage in principle, affordability and remortgage calculators" },
    { rating: "Strong", note: "Mortgage, affordability and stamp duty calculators" },
    { rating: "Partial", note: "Generic theme calculator that defaults to dollars" },
  ] },
  { criterion: "Contacting the agent", cells: [
    { rating: "Partial", note: "Call, email or request details, with no viewing booking" },
    { rating: "Partial", note: "Call or email, with no viewing booking" },
    { rating: "Partial", note: "No enquiry action on property pages" },
  ] },
  { criterion: "Accessibility", cells: [
    { rating: "Partial", note: "Declares only partial WCAG 2.2 AA compliance" },
    { rating: "Unverified", note: "No accessibility statement found" },
    { rating: "Missing", note: "Missing alt text and labels, with contrast and focus failures" },
  ] },
  { criterion: "Visual design & brand", cells: [
    { rating: "Strong", note: "Established, consistent brand" },
    { rating: "Strong", note: "Consistent brand with illustrated tools" },
    { rating: "Partial", note: "Dated template with leftover demo content" },
  ] },
];

const RATING_COLORS: Record<Rating, string> = { Strong: "#1B873B", Partial: "#C59B26", Missing: "#BA1A1A", Unverified: "#6B6560" };

const OPPORTUNITIES = [
  { title: "Competitor-Standard Listings", desc: "Floor plans, key facts such as tenure and EPC, and consistent data, as buyers expect from Rightmove and Zoopla." },
  { title: "A Clear Next Step", desc: "Neither competitor offers online viewing booking, so a prominent way to book a viewing can set X-Ray Home apart." },
  { title: "Built-In Buyer Tools", desc: "A mortgage calculator in pounds, matching the finance tools buyers rely on in both competitors." },
  { title: "Accessible by Default", desc: "Even the competitors only partially meet WCAG, so an accessible design system is a real differentiator." },
];

// Each step leads with its key number, so the figures appear once rather than in a separate stats row
const PROCESS = [
  {
    num: "01",
    title: "Usability Testing & Audit",
    stat: { value: "19", label: "Usability & accessibility issues" },
    desc: "Conducted a usability test and comprehensive audit of the existing WordPress website, uncovering key user pain points that needed to be addressed in the redesign.",
  },
  {
    num: "02",
    title: "Competitive Analysis",
    stat: { value: "2", label: "UK property competitors benchmarked" },
    desc: "Benchmarked the existing website against Rightmove and Zoopla, revealing gaps the redesign could close and opportunities to set X-Ray Home apart.",
  },
  {
    num: "03",
    title: "Design System",
    stat: { value: "26", label: "Structured components" },
    desc: "Built a design system of components, variants, and color tokens, aligning the product's visual language across the website and enabling scalable reuse.",
  },
  {
    num: "04",
    title: "Redesign",
    stat: { value: "11", label: "Final screens" },
    desc: "Redesigned the entire consumer website from the ground up, applying the design system across every page.",
  },
];

const COLORS = [
  { name: "Primary", hex: "#1B2A4A" },
  { name: "Primary Variant", hex: "#38486B" },
  { name: "Secondary", hex: "#D97706" },
  { name: "Tertiary", hex: "#FEF3C7" },
];

const FONT_WEIGHTS = [
  { weight: "Regular", value: "400" },
  { weight: "Medium", value: "500" },
  { weight: "Semibold", value: "600" },
  { weight: "Bold", value: "700" },
];

type Severity = "High" | "Medium";

const USABILITY_FINDINGS: { finding: string; severity: Severity }[] = [
  { finding: "The main “Properties” navigation opens the wrong page", severity: "High" },
  { finding: "Oversized contact icons break the Contact Us page layout", severity: "High" },
  { finding: "A persistent promotional banner obstructs the bottom of the homepage", severity: "High" },
  { finding: "The homepage does not establish a clear primary journey", severity: "Medium" },
  { finding: "The homepage is excessively long and lacks a strong hierarchy", severity: "Medium" },
  { finding: "Placeholder, typo and editor residue is live", severity: "Medium" },
  { finding: "Property information is incomplete and internally inconsistent", severity: "Medium" },
  { finding: "Property search is overloaded and duplicated", severity: "Medium" },
  { finding: "The enquiry form is too long and contains duplicated or confusing fields", severity: "Medium" },
  { finding: "The events date picker becomes a transparent overlapping calendar", severity: "Medium" },
  { finding: "Property pages do not provide a clear next step for interested buyers", severity: "Medium" },
];

const ACCESSIBILITY_FINDINGS: { finding: string; severity: Severity }[] = [
  { finding: "Languages are mixed without a deliberate language experience", severity: "High" },
  { finding: "Important homepage content is deliberately hidden from assistive technology", severity: "High" },
  { finding: "Many links and icon controls have no accessible name", severity: "High" },
  { finding: "Search and calculator fields are not properly labelled", severity: "High" },
  { finding: "Core brand colours fail contrast requirements", severity: "High" },
  { finding: "Automatically moving content has no clear pause mechanism", severity: "High" },
  { finding: "Meaningful property and promotional images lack text alternatives", severity: "Medium" },
  { finding: "Focus indicators are removed or too dependent on subtle border changes", severity: "Medium" },
];

const AUDIT_TABLES = [
  { title: "Usability", count: USABILITY_FINDINGS.length, rows: USABILITY_FINDINGS },
  { title: "Accessibility", count: ACCESSIBILITY_FINDINGS.length, rows: ACCESSIBILITY_FINDINGS },
];

// Same severity colours as the Kiddiwear findings table
const SEVERITY_COLORS: Record<Severity, string> = { High: "#BA1A1A", Medium: "#C59B26" };

interface Screen {
  name: string;
  desc: string;
  src: string;
}

const SCREEN_GROUPS: { title: string; screens: Screen[] }[] = [
  {
    title: "Home",
    screens: [
      { name: "Homepage", desc: "Property search, featured listings, upcoming events, testimonials, and latest market news", src: `${IMG}/home.jpg` },
    ],
  },
  {
    title: "Properties",
    screens: [
      { name: "Property Listings", desc: "Filterable listings with property type, price, size, and more", src: `${IMG}/properties.jpg` },
      { name: "Property Details — Overview", desc: "Photo gallery, key facts, agent contact, and mortgage calculator", src: `${IMG}/property-overview.jpg` },
      { name: "Property Details — Floor Plan", desc: "Floor plan tab with key features", src: `${IMG}/property-floor-plan.jpg` },
      { name: "Property Details — Location", desc: "Map with nearby transport, schools, amenities, and restaurants", src: `${IMG}/property-location.jpg` },
    ],
  },
  {
    title: "Company",
    screens: [
      { name: "Services", desc: "Sales, lettings, valuations, management, conveyancing, and mortgage advice", src: `${IMG}/services.jpg` },
      { name: "About", desc: "Company story, key figures, and core values", src: `${IMG}/about.jpg` },
      { name: "Events", desc: "Upcoming and past expos, webinars, open houses, and seminars", src: `${IMG}/events.jpg` },
      { name: "Contact Us", desc: "Contact form, office hours, office locations, and FAQs", src: `${IMG}/contact.jpg` },
    ],
  },
  {
    title: "Market News",
    screens: [
      { name: "Market News", desc: "Property insights filterable by category", src: `${IMG}/market-news.jpg` },
      { name: "Market News Article", desc: "Long-form article with data table and related articles", src: `${IMG}/market-news-article.jpg` },
    ],
  },
];

const config = projectConfigs.find((p) => p.slug === "/xray-home")!;

export default function XRayHome() {
  const [openScreen, setOpenScreen] = useState<Screen | null>(null);

  const heroContent = (
    <>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="font-mono-dm text-xs tracking-widest uppercase px-3 py-1 rounded-full" style={{ background: `${ACCENT}20`, color: ACCENT }}>
                UI/UX Design
              </span>
              <span className="font-mono-dm text-xs tracking-widest uppercase px-3 py-1 rounded-full" style={{ background: "#8D5E3C20", color: "#8D5E3C" }}>
                Website
              </span>
              <span className="font-mono-dm text-xs tracking-widest uppercase px-3 py-1 rounded-full" style={{ background: "#8D5E3C20", color: "#8D5E3C" }}>
                2026
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4 flex items-center gap-4" style={{ color: "#1C1917", fontWeight: 300 }}>
              <img src={`${IMG}/xray-home-logo.png`} alt="X-Ray Home logo" className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" />
              X-Ray Home
            </h1>
            <p className="text-xl leading-relaxed max-w-3xl mb-8" style={{ color: "#6B6560" }}>
              A real estate website for buying, renting, and investing in premium property across England and Türkiye.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={FIGMA_URL}
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
            </div>
    </>
  );

  return (
    <CaseStudyLayout config={config} heroContent={heroContent}>

        <div className="px-8 lg:px-32 pb-20">
          <Section>
            <ProjectDetails color={ACCENT} items={ROLE} tools={TOOLS} />
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" style={{ background: "#F5F0EA" }}>
          <Section>
            <SectionLabel color={ACCENT} label="Overview" />
            <h2 className="font-display text-3xl md:text-4xl mb-6" style={{ color: "#1C1917", fontWeight: 300 }}>
              About <em style={{ color: ACCENT }}>X-Ray Home</em>
            </h2>
            <div className="space-y-6 mb-10 max-w-3xl">
              <p className="text-lg leading-relaxed" style={{ color: "#6B6560" }}>
                X-Ray Home is a boutique real estate agency whose website was originally built using an outdated WordPress template, which they planned to rebuild from scratch without WordPress.
              </p>
              <p className="text-lg leading-relaxed" style={{ color: "#6B6560" }}>
                Working closely with the Product Manager, I evaluated the existing experience, then redesigned the entire consumer website, providing a foundation for the new development.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {RESPONSIBILITIES.map((item) => (
                <span key={item} className="px-3 py-1.5 rounded-full font-mono-dm text-xs tracking-wide" style={{ background: `${ACCENT}15`, color: ACCENT }}>
                  {item}
                </span>
              ))}
            </div>

          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" id="problem">
          <Section>
            <SectionLabel color={ACCENT} label="Problem" />
            <h2 className="font-display text-3xl mb-8" style={{ color: "#1C1917", fontWeight: 300 }}>
              The <em style={{ color: ACCENT }}>Problem</em>
            </h2>
            <p className="text-lg leading-relaxed mb-10 max-w-3xl" style={{ color: "#6B6560" }}>
              The outdated WordPress website was holding the agency back, both for the people using it and for the team behind it.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {PROBLEMS.map((item, i) => (
                <div key={item.title} className="p-6 rounded-2xl" style={{ background: "#F5F0EA" }}>
                  <div className="font-mono-dm text-xs tracking-wide mb-3 px-2 py-0.5 rounded-full inline-block" style={{ background: `${ACCENT}20`, color: ACCENT }}>
                    {i + 1}
                  </div>
                  <div className="font-display text-2xl mb-2" style={{ color: "#1C1917", fontWeight: 400 }}>{item.title}</div>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B6560" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" id="process" style={{ background: "#F5F0EA" }}>
          <Section>
            <SectionLabel color={ACCENT} label="Process" />
            <h2 className="font-display text-3xl mb-10" style={{ color: "#1C1917", fontWeight: 300 }}>
              What I <em style={{ color: ACCENT }}>Did</em>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {PROCESS.map((step) => (
                <div key={step.title} className="p-6 rounded-2xl" style={{ background: "#FAF7F2" }}>
                  <span className="font-mono-dm text-xs tracking-widest" style={{ color: ACCENT }}>{step.num}</span>
                  <h3 className="font-display text-lg font-medium mt-2 mb-4" style={{ color: "#1C1917" }}>{step.title}</h3>
                  <p className="font-display text-4xl mb-1" style={{ color: ACCENT, fontWeight: 400 }}>{step.stat.value}</p>
                  <p className="font-mono-dm text-xs tracking-wide mb-4" style={{ color: "#6B6560" }}>{step.stat.label}</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B6560" }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20">
          <Section>
            <SectionLabel color={ACCENT} label="Audit" />
            <h2 className="font-display text-3xl mb-10" style={{ color: "#1C1917", fontWeight: 300 }}>
              Audit <em style={{ color: ACCENT }}>Report</em>
            </h2>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
              {AUDIT_TABLES.map((table) => (
                <div key={table.title}>
                  <h3 className="font-display text-xl mb-4" style={{ color: "#1C1917" }}>
                    {table.count} {table.title} Findings
                  </h3>
                  <div className="overflow-x-auto rounded-2xl" style={{ background: "#F5F0EA" }}>
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${ACCENT}20` }}>
                          <th className="text-left p-4 font-mono-dm text-xs tracking-wide uppercase" style={{ color: ACCENT }}>{table.title} Finding</th>
                          <th className="text-left p-4 font-mono-dm text-xs tracking-wide uppercase" style={{ color: ACCENT }}>Severity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {table.rows.map((row, i) => (
                          <tr key={row.finding} style={{ borderBottom: i < table.rows.length - 1 ? `1px solid ${ACCENT}10` : "none" }}>
                            <td className="p-4" style={{ color: "#1C1917" }}>{row.finding}</td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: `${SEVERITY_COLORS[row.severity]}20`, color: SEVERITY_COLORS[row.severity] }}>
                                {row.severity}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" style={{ background: "#F5F0EA" }}>
          <Section>
            <SectionLabel color={ACCENT} label="Competitive Analysis" />
            <h2 className="font-display text-3xl mb-8" style={{ color: "#1C1917", fontWeight: 300 }}>
              Competitive <em style={{ color: ACCENT }}>Analysis</em>
            </h2>
            <p className="text-lg leading-relaxed mb-10 max-w-3xl" style={{ color: "#6B6560" }}>
              Benchmarking X-Ray Home's existing website against the UK's two largest property competitors, Rightmove and Zoopla, across {COMPARISON.length} criteria.
            </p>

            {/* The table scrolls sideways below ~800px, so tell small screens there's more to see */}
            <p className="lg:hidden font-mono-dm text-xs tracking-wide mb-3" style={{ color: ACCENT }}>Swipe to compare →</p>
            <div className="overflow-x-auto rounded-2xl mb-14" style={{ background: "#FAF7F2" }}>
              <table className="w-full text-sm min-w-[760px]">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${ACCENT}20` }}>
                    <th className="text-left p-4 font-mono-dm text-xs tracking-wide uppercase w-[19%]" style={{ color: ACCENT }}>Criteria</th>
                    {COMPETITORS.map((c) => (
                      <th key={c.name} className="text-left p-4 w-[27%]">
                        <span className="flex items-center gap-2 whitespace-nowrap">
                          <img src={c.logo} alt={c.name} className={`${c.className} w-auto`} />
                          {c.caption && (
                            <span className="font-mono-dm text-[10px] tracking-wide uppercase font-normal" style={{ color: ACCENT }}>{c.caption}</span>
                          )}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, i) => (
                    <tr key={row.criterion} style={{ borderBottom: i < COMPARISON.length - 1 ? `1px solid ${ACCENT}10` : "none" }}>
                      <td className="p-4 align-top font-medium" style={{ color: "#1C1917" }}>{row.criterion}</td>
                      {row.cells.map((cell, j) => (
                        <td key={COMPETITORS[j].name} className="p-4 align-top">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: `${RATING_COLORS[cell.rating]}20`, color: RATING_COLORS[cell.rating] }}>
                            {cell.rating}
                          </span>
                          <p className="text-xs leading-relaxed mt-2" style={{ color: "#6B6560" }}>{cell.note}</p>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="font-display text-2xl mb-6" style={{ color: "#1C1917", fontWeight: 400 }}>Opportunities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {OPPORTUNITIES.map((item, i) => (
                <div key={item.title} className="p-6 rounded-2xl" style={{ background: "#FAF7F2" }}>
                  <div className="font-mono-dm text-xs tracking-wide mb-3 px-2 py-0.5 rounded-full inline-block" style={{ background: `${ACCENT}20`, color: ACCENT }}>
                    {i + 1}
                  </div>
                  <div className="font-display text-xl mb-2" style={{ color: "#1C1917", fontWeight: 400 }}>{item.title}</div>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B6560" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" id="design">
          <Section>
            <SectionLabel color={ACCENT} label="Design" />
            <h2 className="font-display text-3xl mb-10" style={{ color: "#1C1917", fontWeight: 300 }}>
              Design <em style={{ color: ACCENT }}>System</em>
            </h2>

            <div className="mb-12">
              <h3 className="font-mono-dm text-xs tracking-wide uppercase mb-4" style={{ color: ACCENT }}>Color Palette</h3>
              <div className="flex flex-wrap gap-4">
                {COLORS.map((color) => (
                  <div key={color.name} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#F5F0EA" }}>
                    {/* Outlined so the pale Tertiary swatch stays visible against the card */}
                    <div className="w-10 h-10 rounded-lg" style={{ background: color.hex, border: "1px solid rgba(28,25,23,0.1)" }} />
                    <div>
                      <div className="text-sm font-medium" style={{ color: "#1C1917" }}>{color.name}</div>
                      <div className="font-mono-dm text-xs" style={{ color: "#6B6560" }}>{color.hex}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-mono-dm text-xs tracking-wide uppercase mb-4" style={{ color: ACCENT }}>Typography</h3>
              <div className="p-6 rounded-2xl" style={{ background: "#F5F0EA" }}>
                <div className="text-2xl mb-2" style={{ color: "#1C1917", fontFamily: "'DM Sans', sans-serif" }}>DM Sans</div>
                <p className="text-sm mb-4" style={{ color: "#6B6560" }}>Low-contrast geometric sans-serif designed for legibility at smaller text sizes</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {FONT_WEIGHTS.map((w) => (
                    <div key={w.weight}>
                      <div className="text-sm" style={{ color: "#1C1917", fontFamily: "'DM Sans', sans-serif", fontWeight: Number(w.value) }}>{w.weight}</div>
                      <div className="font-mono-dm text-xs" style={{ color: ACCENT }}>{w.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" style={{ background: "#F5F0EA" }}>
          <Section>
            <SectionLabel color={ACCENT} label="Design" />
            <h2 className="font-display text-3xl mb-4" style={{ color: "#1C1917", fontWeight: 300 }}>
              Final <em style={{ color: ACCENT }}>Design</em>
            </h2>
            <p className="text-base leading-relaxed mb-12" style={{ color: "#6B6560" }}>
              Click a screen to view the full page.
            </p>
            <div className="flex flex-col gap-20">
              {SCREEN_GROUPS.map((group) => (
                <div key={group.title}>
                  <h3 className="font-display text-2xl mb-6" style={{ color: "#1C1917", fontWeight: 400 }}>
                    {group.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-14">
                    {group.screens.map((screen) => (
                      <button
                        key={screen.name}
                        type="button"
                        onClick={() => setOpenScreen(screen)}
                        className="group text-left"
                      >
                        {/* Browser-window frame, echoing the thumbnail; shows the top of the full-length page */}
                        <div
                          className="rounded-2xl overflow-hidden shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1"
                          style={{ background: "#FFFFFF", border: `1px solid ${ACCENT}20` }}
                        >
                          <div className="flex items-center gap-1.5 px-4 py-2.5" style={{ background: "#EEF0F4" }}>
                            <span className="w-2 h-2 rounded-full" style={{ background: "#C9CDD6" }} />
                            <span className="w-2 h-2 rounded-full" style={{ background: "#C9CDD6" }} />
                            <span className="w-2 h-2 rounded-full" style={{ background: "#C9CDD6" }} />
                          </div>
                          <div className="aspect-[16/10] overflow-hidden">
                            <img
                              src={screen.src}
                              alt={`X-Ray Home ${screen.name} page`}
                              loading="lazy"
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                        </div>
                        <p className="font-display text-lg mt-4 mb-1" style={{ color: "#1C1917", fontWeight: 400 }}>
                          {screen.name}
                        </p>
                        <p className="text-sm leading-relaxed" style={{ color: "#6B6560" }}>
                          {screen.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20">
          <Section>
            <SectionLabel color={ACCENT} label="Figma" />
            <h2 className="font-display text-3xl mb-10" style={{ color: "#1C1917", fontWeight: 300 }}>
              Figma <em style={{ color: ACCENT }}>File</em>
            </h2>
            <div className="flex justify-center">
              <iframe
                src={FIGMA_EMBED_URL}
                title="X-Ray Home Figma design file"
                width={1100}
                height={800}
                className="max-w-full rounded-2xl"
                style={{ border: "1px solid rgba(0,0,0,0.08)" }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </Section>
        </div>

        {/* Full-page lightbox. Radix primitives directly (not ui/dialog) so the overlay can
            sit above the sticky CaseStudyNav (z-55), which ui/dialog's z-50 overlay can't. */}
        <DialogPrimitive.Root open={openScreen !== null} onOpenChange={(open) => !open && setOpenScreen(null)}>
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-black/85" />
            <DialogPrimitive.Content
              className="fixed inset-0 z-[60] flex flex-col items-center p-4 md:p-10 outline-none"
              onClick={() => setOpenScreen(null)}
            >
              <div className="w-full max-w-5xl flex items-center justify-between gap-4 mb-4">
                <DialogPrimitive.Title className="font-display text-xl" style={{ color: "#FAF7F2", fontWeight: 400 }}>
                  {openScreen?.name}
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="sr-only">
                  {openScreen?.desc}
                </DialogPrimitive.Description>
                <DialogPrimitive.Close
                  className="shrink-0 w-10 h-10 rounded-full inline-flex items-center justify-center transition-opacity hover:opacity-80"
                  style={{ background: "#FAF7F2", color: "#1C1917" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
              </div>
              {/* Clicks on the page itself shouldn't close the lightbox — only the backdrop does */}
              <div
                className="w-full max-w-5xl flex-1 min-h-0 overflow-y-auto rounded-2xl"
                style={{ background: "#FFFFFF" }}
                onClick={(e) => e.stopPropagation()}
              >
                {openScreen && (
                  <img
                    src={openScreen.src}
                    alt={`X-Ray Home ${openScreen.name} page — full length`}
                    className="w-full h-auto block"
                  />
                )}
              </div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>

    </CaseStudyLayout>
  );
}
