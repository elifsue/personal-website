import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Section, SectionLabel, CaseStudyLayout } from "@/components/case-study";
import { projectConfigs } from "@/config/projects";

const IMG = `${import.meta.env.BASE_URL}images/xray-home`;

const ACCENT = "#2E4372";
const FIGMA_URL = "https://www.figma.com/design/5VZpQsViJwXVZPqJaYycRU/X-Ray-Home?node-id=107-2&t=0IOIIMpYdRoclDm1-1";
const FIGMA_EMBED_URL = "https://embed.figma.com/design/5VZpQsViJwXVZPqJaYycRU/X-Ray-Home?node-id=107-2&embed-host=share";

const ROLE = [
  { label: "Role", value: "UI/UX Designer Intern" },
  { label: "Timeline", value: "Jan 2026 – Apr 2026" },
  { label: "Location", value: "London, UK" },
];

const TOOLS = [
  { name: "Figma", logo: `${IMG}/figma-logo.png` },
  { name: "ChatGPT", logo: `${IMG}/chatgpt-logo.svg` },
];

const STATS = [
  { value: "19", label: "Usability issues uncovered" },
  { value: "26", label: "Design system components" },
  { value: "11", label: "Final screens" },
];

const PROCESS = [
  {
    num: "01",
    title: "Usability Testing",
    desc: "Ran a usability test on the existing website, uncovering 19 accessibility and usability issues, then translated the findings into targeted design improvements that elevated the overall user experience.",
  },
  {
    num: "02",
    title: "Design System",
    desc: "Built a design system with 26 structured components, variants, and color tokens, aligning the product's visual language across the website and enabling scalable reuse.",
  },
  {
    num: "03",
    title: "Redesign",
    desc: "Led the end-to-end redesign of the homepage, property listings, and property detail pages, applying the design system to ensure consistent accessibility compliance and visual coherence at scale.",
  },
];

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

        <div className="px-8 lg:px-32 py-20" id="overview" style={{ background: "#F5F0EA" }}>
          <Section>
            <SectionLabel color={ACCENT} label="Overview" />
            <h2 className="font-display text-3xl mb-8" style={{ color: "#1C1917", fontWeight: 300 }}>
              About <em style={{ color: ACCENT }}>X-Ray Home</em>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 lg:gap-16">
              <div className="space-y-6">
                <p className="text-base leading-relaxed" style={{ color: "#6B6560" }}>
                  X-Ray Home is a London-based real estate agency offering property sales, lettings, valuations, management, conveyancing, and mortgage advice, with offices in London and Istanbul serving buyers, sellers, landlords, tenants, and investors across England and Türkiye.
                </p>
                <p className="text-base leading-relaxed" style={{ color: "#6B6560" }}>
                  As a UI/UX Designer Intern, I evaluated the existing website through usability testing, built a design system to unify its visual language, and redesigned the website, from the homepage and property search through to company, events, and market news pages.
                </p>
                <div className="grid grid-cols-3 gap-4 pt-4">
                  {STATS.map((stat) => (
                    <div key={stat.label}>
                      <p className="font-display text-4xl mb-1" style={{ color: ACCENT, fontWeight: 400 }}>{stat.value}</p>
                      <p className="font-mono-dm text-xs tracking-wide" style={{ color: "#6B6560" }}>{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <dl className="p-6 rounded-2xl space-y-4 self-start" style={{ background: "#FAF7F2" }}>
                {ROLE.map((item) => (
                  <div key={item.label}>
                    <dt className="font-mono-dm text-xs tracking-widest uppercase mb-1" style={{ color: ACCENT }}>{item.label}</dt>
                    <dd className="text-base" style={{ color: "#1C1917" }}>{item.value}</dd>
                  </div>
                ))}
                <div>
                  <dt className="font-mono-dm text-xs tracking-widest uppercase mb-2" style={{ color: ACCENT }}>Tools</dt>
                  <dd className="flex flex-wrap gap-3">
                    {TOOLS.map((tool) => (
                      <div key={tool.name} className="flex items-center gap-3 px-4 py-2.5 rounded-full" style={{ background: "#F5F0EA" }}>
                        <img src={tool.logo} alt={tool.name} className="w-5 h-5 object-contain" />
                        <span className="font-mono-dm text-sm tracking-wide" style={{ color: "#1C1917" }}>{tool.name}</span>
                      </div>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" id="process">
          <Section>
            <SectionLabel color={ACCENT} label="Process" />
            <h2 className="font-display text-3xl mb-10" style={{ color: "#1C1917", fontWeight: 300 }}>
              What I <em style={{ color: ACCENT }}>Did</em>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PROCESS.map((step) => (
                <div key={step.title} className="p-6 rounded-2xl" style={{ background: "#F5F0EA" }}>
                  <span className="font-mono-dm text-xs tracking-widest" style={{ color: ACCENT }}>{step.num}</span>
                  <h3 className="font-display text-lg font-medium mt-2 mb-3" style={{ color: "#1C1917" }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B6560" }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" id="design" style={{ background: "#F5F0EA" }}>
          <Section>
            <SectionLabel color={ACCENT} label="Design" />
            <h2 className="font-display text-3xl mb-4" style={{ color: "#1C1917", fontWeight: 300 }}>
              Final <em style={{ color: ACCENT }}>Design</em>
            </h2>
            <p className="text-base leading-relaxed mb-12" style={{ color: "#6B6560" }}>
              Click a screen to view the full page.
            </p>
            <div className="flex flex-col gap-14">
              {SCREEN_GROUPS.map((group) => (
                <div key={group.title}>
                  <h3 className="font-display text-2xl mb-6" style={{ color: "#1C1917", fontWeight: 400 }}>
                    {group.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
