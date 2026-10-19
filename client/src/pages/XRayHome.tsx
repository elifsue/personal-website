import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { CircleHelp, Gem, LayoutTemplate, Wrench } from "lucide-react";
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
  { icon: LayoutTemplate, title: "Limited by the Template", desc: "The template was hard to customise for features like property search, events, and market news." },
  { icon: CircleHelp, title: "Confusing Experience", desc: "Buyers and tenants found it difficult to find properties or get in touch." },
  { icon: Gem, title: "Didn't Feel Premium", desc: "The off-the-shelf look didn't match a high-end, boutique agency." },
  { icon: Wrench, title: "Slow & Costly to Maintain", desc: "The plugin-heavy setup was slow and costly to maintain." },
];

const INTERVIEW_SETUP = ["4 Turkish clients", "2 in Türkiye, 2 in the UK", "One-to-one", "Conducted in Turkish"];

const INTERVIEW_INSIGHTS = [
  { title: "Speaking Turkish Builds Trust", desc: "Talking to an agent in Turkish was the main reason participants chose X-Ray Home. They wanted to see who they'd be dealing with and how to reach them." },
  { title: "UK Jargon Is a Barrier", desc: "Terms like leasehold, EPC and stamp duty kept coming up. Participants could find the numbers but didn't always know what they meant for them." },
  { title: "The Full Picture, Remotely", desc: "Buyers in Türkiye couldn't easily visit, so they relied on floor plans, total costs and the local area to decide if a property was worth pursuing." },
  { title: "Fear of Overpaying", desc: "Participants worried about paying too much in an unfamiliar market, so they wanted to compare prices with similar homes nearby." },
];

const PERSONAS = [
  {
    name: "Kemal Çelik",
    photo: `${IMG}/personas/kemal-celik.svg`,
    details: ["52", "Ankara, Türkiye", "Business owner"],
    quote: "I want someone who speaks my language and tells me straight.",
    bio: "Kemal wants a London flat for his daughter while she studies at UCL, then plans to rent it out. He gets by in English, but not with leases and contracts, so he'd rather work with a Turkish-speaking agent he can call and trust.",
    goals: [
      "Buy a flat near the Tube that's easy to rent out later",
      "Know the full cost upfront, including overseas stamp duty",
      "Do most of it remotely, with video viewings",
    ],
    frustrations: [
      "UK terms like leasehold and EPC with no explanation",
      "Agents he can't properly talk to, so he's never sure he has the full picture",
    ],
  },
  {
    name: "Ayşe Demir",
    photo: `${IMG}/personas/ayse-demir.svg`,
    details: ["45", "Reading, UK", "Runs a family bakery, moved to the UK 12 years ago"],
    quote: "In Turkish I can ask anything. In English I just nod along.",
    bio: "Ayşe and her husband have rented for years and are finally ready to buy a family home. Her English is fine at the bakery, but mortgages and solicitors are another story. Her daughter usually translates, but for something this big she wants to understand it herself.",
    goals: [
      "Buy a three-bedroom house near her children's school",
      "Have every step explained in Turkish by someone who knows the UK process",
      "Feel sure she isn't overpaying",
    ],
    frustrations: [
      "Calls and paperwork full of terms she has to look up",
      "Relying on her daughter to translate",
      "Not knowing which agents she can trust",
    ],
  },
];

// Kemal's journey on the current site; mood runs from -2 (worst) to 2 (best)
const JOURNEY = [
  {
    stage: "Search",
    feeling: "Hopeful",
    mood: 1,
    doing: "Browses flats from Ankara, looking for one near the Tube.",
    pain: "Hard to judge an area he has never visited.",
    opportunity: "Show nearby transport, schools and amenities.",
  },
  {
    stage: "Evaluate",
    feeling: "Confused",
    mood: -1,
    doing: "Opens a listing to check the details.",
    pain: "No floor plan or EPC, so he can't picture the flat from abroad.",
    opportunity: "Floor plans, key facts and EPC on every listing.",
  },
  {
    stage: "Compare",
    feeling: "Worried",
    mood: -2,
    doing: "Weighs up the price against other flats.",
    pain: "No way to tell if the price is fair.",
    opportunity: "Show similar properties nearby.",
  },
  {
    stage: "Get in Touch",
    feeling: "Hesitant",
    mood: -1,
    doing: "Wants to ask questions in Turkish.",
    pain: "Unclear who to contact about the listing, or how.",
    opportunity: "A named agent and a clear next step on every listing.",
  },
  {
    stage: "Book a Viewing",
    feeling: "Frustrated",
    mood: -2,
    doing: "Tries to arrange a viewing from abroad.",
    pain: "Visiting in person isn't always possible.",
    opportunity: "Offer video viewings.",
  },
];

// Curve geometry in a 0–100 box, with each point centred over its stage column
const journeyX = (i: number) => ((i + 0.5) / JOURNEY.length) * 100;
const moodY = (mood: number) => 50 - mood * 18;
const JOURNEY_PATH = JOURNEY.map((step, i) => {
  if (i === 0) return `M ${journeyX(0)} ${moodY(step.mood)}`;
  const prevY = moodY(JOURNEY[i - 1].mood);
  const midX = (journeyX(i - 1) + journeyX(i)) / 2;
  return `C ${midX} ${prevY} ${midX} ${moodY(step.mood)} ${journeyX(i)} ${moodY(step.mood)}`;
}).join(" ");

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
    { rating: "Partial", note: "Generic template with leftover demo content" },
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
    title: "User Interviews",
    stat: { value: "4", label: "Clients interviewed" },
    desc: "Interviewed X-Ray Home's Turkish clients in the UK and Türkiye to understand their needs, then turned the findings into two user personas.",
  },
  {
    title: "Audit",
    stat: { value: "19", label: "Usability & accessibility issues" },
    desc: "Conducted a comprehensive audit of the existing WordPress website, uncovering key user pain points that needed to be addressed in the redesign.",
  },
  {
    title: "Competitive Analysis",
    stat: { value: "2", label: "UK property competitors benchmarked" },
    desc: "Benchmarked the existing website against Rightmove and Zoopla, revealing gaps the redesign could close and opportunities to set X-Ray Home apart.",
  },
  {
    title: "Design System",
    stat: { value: "30", label: "Structured components" },
    desc: "Built a design system of components, variants, and color tokens, aligning the product's visual language across the website and enabling scalable reuse.",
  },
  {
    title: "Redesign",
    stat: { value: "11", label: "Final screens" },
    desc: "Redesigned the entire consumer website from the ground up, applying the design system across every page.",
  },
  {
    title: "Usability Testing",
    stat: { value: "4", label: "New users tested the redesign" },
    desc: "Ran moderated usability tests of the redesign with new participants, confirming the key journeys worked and finding what to improve next.",
  },
];

// Each colour with the text colour paired with it in the design
const COLORS = [
  { name: "Primary", hex: "#1B2A4A", text: "#FFFFFF" },
  { name: "Primary Variant", hex: "#38486B", text: "#FFFFFF" },
  { name: "Secondary", hex: "#AE5F05", text: "#FFFFFF" },
  { name: "Tertiary", hex: "#FEF3C7", text: "#AE5F05" },
];

// WCAG 2.2 relative luminance and contrast ratio, so the palette's ratios are computed rather than typed in
function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(a: string, b: string) {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
}

const wcagLevel = (ratio: number) => (ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : ratio >= 3 ? "AA Large" : "Fail");

const FONT_WEIGHTS = [
  { weight: "Regular", value: "400" },
  { weight: "Medium", value: "500" },
  { weight: "Semibold", value: "600" },
  { weight: "Bold", value: "700" },
];

const FONTS = [
  { name: "Outfit", role: "Headings", desc: "Geometric sans-serif with rounded, open letterforms that keep headings clean and modern" },
  { name: "DM Sans", role: "Body text", desc: "Low-contrast geometric sans-serif designed for legibility at smaller text sizes" },
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

// Label colour inside each severity fill, picked by the fill's luminance
const SEVERITY_INK: Record<Severity, string> = { High: "#FFFFFF", Medium: "#1C1917" };

const SEVERITIES: Severity[] = ["High", "Medium"];

// Findings per table split by severity, for the summary chart above the tables
const AUDIT_SUMMARY = AUDIT_TABLES.map((table) => ({
  title: table.title,
  total: table.count,
  segments: SEVERITIES.map((severity) => ({ severity, count: table.rows.filter((row) => row.severity === severity).length })),
}));

const AUDIT_TOTAL = AUDIT_SUMMARY.reduce((sum, row) => sum + row.total, 0);
const AUDIT_MAX = Math.max(...AUDIT_SUMMARY.map((row) => row.total));

// Close-up crops of the final screens
const DETAILS = `${IMG}/details`;

// Each decision ties back to an audit finding or a competitive analysis opportunity;
// maxWidth keeps the small crops near their natural size instead of blowing them up, and
// width/height reserve their space before the lazy load so the sidebar's scroll targets don't shift
const DECISIONS = [
  {
    title: "Search First",
    desc: "The homepage now opens with a property search, so buyers and tenants can start looking straight away instead of scrolling a long page with no clear place to begin.",
    addresses: "Audit finding: no clear primary journey on the homepage",
    src: `${DETAILS}/decision-search-first.png`,
    width: 1048,
    height: 310,
    alt: "Homepage hero with a search bar for listing type, location, property type and price range",
    maxWidth: undefined,
  },
  {
    title: "Tabs Instead of One Long Page",
    desc: "Floor plans, key facts and the EPC rating sit in Overview, Floor Plan and Location tabs, matching what buyers expect from Rightmove and Zoopla while keeping each listing easy to scan.",
    addresses: "Opportunity: Competitor-Standard Listings",
    src: `${DETAILS}/decision-floor-plan.png`,
    width: 880,
    height: 760,
    alt: "Property page with Overview, Floor Plan and Location tabs, showing the ground floor plan",
    maxWidth: "520px",
  },
  {
    title: "A Named Agent on Every Listing",
    desc: "Every listing shows the agent's name, photo and contact details, with Book a Viewing and Request Information right beside them.",
    addresses: "Opportunity: A Clear Next Step",
    src: `${DETAILS}/decision-next-step.png`,
    width: 440,
    height: 390,
    alt: "Agent card with a photo, phone, email, and Book a Viewing and Request Information buttons",
    maxWidth: "380px",
  },
  {
    title: "Pounds, Not Dollars",
    desc: "A mortgage calculator in pounds replaces the theme's generic one that defaulted to dollars, giving buyers an instant monthly estimate on every listing.",
    addresses: "Opportunity: Built-In Buyer Tools",
    src: `${DETAILS}/decision-mortgage-calculator.png`,
    width: 440,
    height: 510,
    alt: "Mortgage calculator with purchase price, deposit and term in pounds, estimating a monthly payment",
    maxWidth: "360px",
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
      { name: "Homepage", desc: "Property search, featured listings, upcoming events, testimonials, and latest market news", src: `${IMG}/home.png` },
    ],
  },
  {
    title: "Properties",
    screens: [
      { name: "Property Listings", desc: "Filterable listings with property type, price, size, and more", src: `${IMG}/properties.png` },
      { name: "Property Details — Overview", desc: "Photo gallery, key facts, agent contact, and mortgage calculator", src: `${IMG}/property-overview.png` },
      { name: "Property Details — Floor Plan", desc: "Floor plan tab with key features", src: `${IMG}/property-floor-plan.png` },
      { name: "Property Details — Location", desc: "Map with nearby transport, schools, amenities, and restaurants", src: `${IMG}/property-location.png` },
    ],
  },
  {
    title: "Company",
    screens: [
      { name: "Services", desc: "Sales, lettings, valuations, management, conveyancing, and mortgage advice", src: `${IMG}/services.png` },
      { name: "About", desc: "Company story, key figures, and core values", src: `${IMG}/about.png` },
      { name: "Events", desc: "Upcoming and past expos, webinars, open houses, and seminars", src: `${IMG}/events.png` },
      { name: "Contact Us", desc: "Contact form, office hours, office locations, and FAQs", src: `${IMG}/contact.png` },
    ],
  },
  {
    title: "Market News",
    screens: [
      { name: "Market News", desc: "Property insights filterable by category", src: `${IMG}/market-news.png` },
      { name: "Market News Article", desc: "Long-form article with data table and related articles", src: `${IMG}/market-news-article.png` },
    ],
  },
];

const TEST_SETUP = ["4 new participants", "Moderated", "Figma prototype", "Think-aloud", "4 tasks"];

// Each task covers a journey the audit flagged on the old site, to check the redesign fixed it
const TEST_TASKS = [
  {
    title: "Find a Property",
    prompt: "Find a detached house for sale in London.",
    observed: "Participants started from the homepage search, then narrowed results with the Rent/Sale toggle and property type filters. Clear labels meant they didn't second-guess their filters.",
    src: `${DETAILS}/test-find-property.png`,
    alt: "Property listings with filters for listing type, location, property type and price range",
  },
  {
    title: "Check a Listing",
    prompt: "Pick a property you like and decide if it's worth a viewing.",
    observed: "Key facts, the floor plan and the EPC rating gave participants what they needed to decide, and Book a Viewing on the agent card was easy to spot.",
    src: `${DETAILS}/test-check-listing.png`,
    alt: "Property page showing the title, price, key facts and the Overview, Floor Plan and Location tabs",
  },
  {
    title: "Find an Event",
    prompt: "Find an upcoming event and check when it's happening.",
    observed: "The Upcoming and Past Events tabs and the date badge on each event made it quick to see what was on and when.",
    src: `${DETAILS}/test-find-event.png`,
    alt: "Events page with Upcoming and Past Events tabs and a date badge on each event",
  },
  {
    title: "Get in Touch",
    prompt: "Send the agency a message about buying a home.",
    observed: "Participants filled in the shorter contact form quickly, with no repeated questions to slow them down.",
    src: `${DETAILS}/test-get-in-touch.png`,
    alt: "Contact form with name, email, phone, subject and message fields, next to office hours",
  },
];

const NEXT_STEPS = [
  { title: "Language Switcher in the Header", desc: "Participants looked for a Turkish version at the top of the page, but the language switcher sits in the footer." },
  { title: "Compare Properties Side by Side", desc: "Participants switched back and forth between listings to compare them, and wanted to see prices, sizes and key facts side by side." },
  { title: "Book a Video Viewing", desc: "Participants buying from Türkiye wanted to book a video viewing, as visiting in person wasn't always possible." },
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
                Working closely with the Product Manager, I interviewed clients and evaluated the existing experience, then redesigned the entire consumer website and tested it with new users, providing a foundation for the new development.
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

        <div className="px-8 lg:px-32 py-20">
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
                  <div className="flex items-start justify-between mb-4">
                    <div className="font-mono-dm text-xs tracking-wide px-2 py-0.5 rounded-full" style={{ background: `${ACCENT}20`, color: ACCENT }}>
                      {i + 1}
                    </div>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${ACCENT}15` }}>
                      <item.icon size={20} strokeWidth={1.75} color={ACCENT} aria-hidden="true" />
                    </div>
                  </div>
                  <h3 className="font-display text-xl mb-2" style={{ color: "#1C1917", fontWeight: 400 }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B6560" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" style={{ background: "#F5F0EA" }}>
          <Section>
            <SectionLabel color={ACCENT} label="Process" />
            <h2 className="font-display text-3xl mb-10" style={{ color: "#1C1917", fontWeight: 300 }}>
              What I <em style={{ color: ACCENT }}>Did</em>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {PROCESS.map((step, i) => (
                <div key={step.title} className="p-6 rounded-2xl" style={{ background: "#FAF7F2" }}>
                  <div className="flex mb-4">
                    <div className="font-mono-dm text-xs tracking-wide px-2 py-0.5 rounded-full" style={{ background: `${ACCENT}20`, color: ACCENT }}>
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="font-display text-xl mb-4" style={{ color: "#1C1917", fontWeight: 400 }}>{step.title}</h3>
                  <p className="font-display text-4xl mb-1" style={{ color: ACCENT, fontWeight: 400 }}>{step.stat.value}</p>
                  <p className="font-mono-dm text-xs tracking-wide mb-4" style={{ color: "#6B6560" }}>{step.stat.label}</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B6560" }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" id="research">
          <Section>
            <SectionLabel color={ACCENT} label="User Interviews" />
            <h2 className="font-display text-3xl mb-8" style={{ color: "#1C1917", fontWeight: 300 }}>
              User <em style={{ color: ACCENT }}>Interviews</em>
            </h2>
            <p className="text-lg leading-relaxed mb-6 max-w-3xl" style={{ color: "#6B6560" }}>
              Before changing anything, I wanted to understand who X-Ray Home's clients are and what they need from the website. Most of them are Turkish, living either in Türkiye or in the UK. Many aren't fluent in English and choose X-Ray Home because they can talk to an agent in their own language, which makes it easier to ask questions and to trust the answers. I interviewed 4 clients, two from each group, about how they look for property, what they need to know before booking a viewing, and how they get in touch with agents.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              {INTERVIEW_SETUP.map((item) => (
                <span key={item} className="px-3 py-1.5 rounded-full font-mono-dm text-xs tracking-wide" style={{ background: `${ACCENT}15`, color: ACCENT }}>
                  {item}
                </span>
              ))}
            </div>

            <h3 className="font-display text-2xl mb-6" style={{ color: "#1C1917", fontWeight: 400 }}>Key Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {INTERVIEW_INSIGHTS.map((item, i) => (
                <div key={item.title} className="p-6 rounded-2xl" style={{ background: "#F5F0EA" }}>
                  <div className="flex mb-4">
                    <div className="font-mono-dm text-xs tracking-wide px-2 py-0.5 rounded-full" style={{ background: `${ACCENT}20`, color: ACCENT }}>
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="font-display text-xl mb-2" style={{ color: "#1C1917", fontWeight: 400 }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B6560" }}>{item.desc}</p>
                </div>
              ))}
            </div>

            <p className="text-lg leading-relaxed max-w-3xl" style={{ color: "#6B6560" }}>
              These conversations went beyond the confusing experience outlined in the problem: clients needed a site that explains the UK buying process clearly and helps them feel sure they aren't overpaying.
            </p>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" id="users" style={{ background: "#F5F0EA" }}>
          <Section>
            <SectionLabel color={ACCENT} label="Users" />
            <h2 className="font-display text-3xl mb-8" style={{ color: "#1C1917", fontWeight: 300 }}>
              User <em style={{ color: ACCENT }}>Personas</em>
            </h2>
            <p className="text-lg leading-relaxed mb-10 max-w-3xl" style={{ color: "#6B6560" }}>
              Participants fell into two groups: clients buying from Türkiye, and Turkish families already settled in the UK. Based on the interviews, I defined a persona for each group.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {PERSONAS.map((persona) => (
                <div key={persona.name} className="p-8 rounded-2xl" style={{ background: "#FAF7F2" }}>
                  <div className="flex items-center gap-4 mb-6">
                    {/* Illustrated (Avataaars via DiceBear), since the personas aren't real people */}
                    <img
                      src={persona.photo}
                      alt={`Cartoon portrait of ${persona.name}`}
                      className="w-16 h-16 shrink-0 rounded-full"
                    />
                    <div>
                      <h3 className="font-display text-2xl" style={{ color: "#1C1917", fontWeight: 400 }}>{persona.name}</h3>
                      <p className="font-mono-dm text-xs tracking-wide" style={{ color: "#6B6560" }}>{persona.details.join(" · ")}</p>
                    </div>
                  </div>

                  <blockquote className="font-display text-lg italic leading-relaxed mb-6 pl-4" style={{ color: "#1C1917", borderLeft: `2px solid ${ACCENT}` }}>
                    “{persona.quote}”
                  </blockquote>

                  <p className="text-sm leading-relaxed mb-8" style={{ color: "#6B6560" }}>{persona.bio}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { title: "Goals", items: persona.goals },
                      { title: "Frustrations", items: persona.frustrations },
                    ].map((list) => (
                      <div key={list.title}>
                        <h4 className="font-mono-dm text-xs tracking-wide uppercase mb-3" style={{ color: ACCENT }}>{list.title}</h4>
                        <ul className="space-y-2">
                          {list.items.map((item) => (
                            <li key={item} className="text-sm leading-relaxed pl-4 relative" style={{ color: "#1C1917" }}>
                              <span className="absolute left-0 top-[0.55em] w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20">
          <Section>
            <SectionLabel color={ACCENT} label="Journey Map" />
            <h2 className="font-display text-3xl mb-8" style={{ color: "#1C1917", fontWeight: 300 }}>
              User Journey <em style={{ color: ACCENT }}>Map</em>
            </h2>
            <p className="text-lg leading-relaxed mb-10 max-w-3xl" style={{ color: "#6B6560" }}>
              To see where the current experience lets clients down, I mapped Kemal's journey on the current site, from searching for a flat to booking a viewing, using what I heard in the interviews.
            </p>

            {/* The map scrolls sideways below ~900px, so tell small screens there's more to see */}
            <p className="lg:hidden font-mono-dm text-xs tracking-wide mb-3" style={{ color: ACCENT }}>Swipe to follow the journey →</p>
            <div className="overflow-x-auto rounded-2xl" style={{ background: "#F5F0EA" }}>
              <div
                className="grid min-w-[880px] p-6 md:p-8"
                style={{ gridTemplateColumns: `112px repeat(${JOURNEY.length}, minmax(0, 1fr))` }}
              >
                <div />
                {JOURNEY.map((step, i) => (
                  <div key={step.stage} className="px-3 pb-5">
                    <div className="flex mb-3">
                      <div className="font-mono-dm text-xs tracking-wide px-2 py-0.5 rounded-full" style={{ background: `${ACCENT}20`, color: ACCENT }}>
                        {i + 1}
                      </div>
                    </div>
                    <h3 className="font-display text-xl" style={{ color: "#1C1917", fontWeight: 400 }}>{step.stage}</h3>
                  </div>
                ))}

                <h4 className="font-mono-dm text-xs tracking-wide uppercase pt-4" style={{ color: ACCENT, borderTop: `1px solid ${ACCENT}20` }}>Feeling</h4>
                <div className="pt-4" style={{ gridColumn: `span ${JOURNEY.length}`, borderTop: `1px solid ${ACCENT}20` }}>
                  {/* The line stretches with the box; the dots are HTML so they stay round */}
                  <div className="relative h-28">
                    <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                      <line x1="0" x2="100" y1={moodY(0)} y2={moodY(0)} stroke="#1C1917" strokeOpacity="0.12" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                      <path d={JOURNEY_PATH} fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                    </svg>
                    {JOURNEY.map((step, i) => (
                      <span
                        key={step.stage}
                        className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
                        style={{ left: `${journeyX(i)}%`, top: `${moodY(step.mood)}%`, background: ACCENT, boxShadow: "0 0 0 2px #F5F0EA" }}
                      />
                    ))}
                  </div>
                  <div className="grid mt-2" style={{ gridTemplateColumns: `repeat(${JOURNEY.length}, minmax(0, 1fr))` }}>
                    {JOURNEY.map((step) => (
                      <p key={step.stage} className="px-3 text-sm font-medium text-center" style={{ color: "#1C1917" }}>{step.feeling}</p>
                    ))}
                  </div>
                </div>

                {[
                  { label: "Doing", key: "doing" as const },
                  { label: "Pain point", key: "pain" as const },
                  { label: "Opportunity", key: "opportunity" as const },
                ].map((row) => (
                  <div key={row.key} className="contents">
                    <h4 className="font-mono-dm text-xs tracking-wide uppercase pt-4 mt-4" style={{ color: ACCENT, borderTop: `1px solid ${ACCENT}10` }}>{row.label}</h4>
                    {JOURNEY.map((step) => (
                      <p key={step.stage} className="px-3 pt-4 mt-4 text-sm leading-relaxed" style={{ color: row.key === "doing" ? "#1C1917" : "#6B6560", borderTop: `1px solid ${ACCENT}10` }}>
                        {step[row.key]}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" id="analysis" style={{ background: "#F5F0EA" }}>
          <Section>
            <SectionLabel color={ACCENT} label="Audit" />
            <h2 className="font-display text-3xl mb-8" style={{ color: "#1C1917", fontWeight: 300 }}>
              Audit <em style={{ color: ACCENT }}>Report</em>
            </h2>
            <p className="text-lg leading-relaxed mb-10 max-w-3xl" style={{ color: "#6B6560" }}>
              Alongside the interviews, I used ChatGPT to audit the existing site for usability and accessibility issues, then combined its findings with the problems participants raised into the tables below.
            </p>

            {/* Summary of the tables: one stacked bar per table, counts labelled in each segment, the tables being its table view */}
            <div className="rounded-2xl p-6 md:p-8 mb-12" style={{ background: "#FAF7F2" }}>
              <h3 className="font-display text-xl mb-6" style={{ color: "#1C1917", fontWeight: 400 }}>{AUDIT_TOTAL} findings by type and severity</h3>
              <div className="flex gap-5 mb-5">
                {SEVERITIES.map((severity) => (
                  <span key={severity} className="flex items-center gap-2 text-xs" style={{ color: "#6B6560" }}>
                    <span className="w-3 h-3 rounded-sm" style={{ background: SEVERITY_COLORS[severity] }} />
                    {severity}
                  </span>
                ))}
              </div>
              <div className="space-y-4">
                {AUDIT_SUMMARY.map((row) => (
                  <div key={row.title} className="grid grid-cols-[96px_1fr] md:grid-cols-[120px_1fr] items-center gap-4">
                    <span className="text-sm" style={{ color: "#1C1917" }}>{row.title}</span>
                    <div className="flex items-center gap-3">
                      {/* Scaled to the longest bar, leaving room for the total at the tip */}
                      <div
                        className="flex gap-[2px]"
                        style={{ width: `calc((100% - 2.5rem) * ${row.total / AUDIT_MAX})` }}
                        role="img"
                        aria-label={`${row.title}: ${row.segments.map((s) => `${s.count} ${s.severity.toLowerCase()}`).join(", ")}`}
                      >
                        {row.segments.filter((s) => s.count > 0).map((segment, i, shown) => (
                          <div
                            key={segment.severity}
                            title={`${segment.count} ${segment.severity.toLowerCase()} severity`}
                            className="h-6 flex items-center justify-center text-xs font-medium"
                            style={{
                              flex: `${segment.count} 1 0`,
                              background: SEVERITY_COLORS[segment.severity],
                              color: SEVERITY_INK[segment.severity],
                              borderRadius: i === shown.length - 1 ? "0 4px 4px 0" : 0,
                            }}
                          >
                            {segment.count}
                          </div>
                        ))}
                      </div>
                      <span className="text-sm" style={{ color: "#6B6560" }}>{row.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
              {AUDIT_TABLES.map((table) => (
                <div key={table.title}>
                  <h3 className="font-display text-xl mb-4" style={{ color: "#1C1917" }}>
                    {table.count} {table.title} Findings
                  </h3>
                  <div className="overflow-x-auto rounded-2xl" style={{ background: "#FAF7F2" }}>
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

        <div className="px-8 lg:px-32 py-20">
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
            <div className="overflow-x-auto rounded-2xl mb-14" style={{ background: "#F5F0EA" }}>
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
                <div key={item.title} className="p-6 rounded-2xl" style={{ background: "#F5F0EA" }}>
                  <div className="flex mb-4">
                    <div className="font-mono-dm text-xs tracking-wide px-2 py-0.5 rounded-full" style={{ background: `${ACCENT}20`, color: ACCENT }}>
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="font-display text-xl mb-2" style={{ color: "#1C1917", fontWeight: 400 }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B6560" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" id="design" style={{ background: "#F5F0EA" }}>
          <Section>
            <SectionLabel color={ACCENT} label="Information Architecture" />
            <h2 className="font-display text-3xl mb-8" style={{ color: "#1C1917", fontWeight: 300 }}>
              Information <em style={{ color: ACCENT }}>Architecture</em>
            </h2>
            <p className="text-lg leading-relaxed mb-10 max-w-3xl" style={{ color: "#6B6560" }}>
              The redesigned site is organised around seven main pages, which appear in the same order in the header on every page. Properties holds the most content, so listings are split into sale and rent, each property's details sit in Overview, Floor Plan and Location tabs, and every property page offers a clear next step: booking a viewing or requesting information.
            </p>
            <div className="w-full overflow-x-auto rounded-2xl p-4" style={{ background: "#FAF7F2" }}>
              <img
                src={`${IMG}/information-architecture.png`}
                alt="X-Ray Home information architecture diagram showing Home, Properties, Services, About, Events, Market News, Contact Us and Legal, with the pages and sections under each"
                className="w-full h-auto min-w-[800px]"
              />
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20">
          <Section>
            <SectionLabel color={ACCENT} label="Design" />
            <h2 className="font-display text-3xl mb-10" style={{ color: "#1C1917", fontWeight: 300 }}>
              Design <em style={{ color: ACCENT }}>System</em>
            </h2>

            <div className="mb-12">
              <h3 className="font-mono-dm text-xs tracking-wide uppercase mb-2" style={{ color: ACCENT }}>Color Palette</h3>
              <p className="text-sm mb-4" style={{ color: "#6B6560" }}>
                Each colour with the text colour paired with it, and the WCAG level the pair meets.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {COLORS.map((color) => {
                  const ratio = contrastRatio(color.hex, color.text);
                  return (
                    <div key={color.name} className="rounded-xl overflow-hidden" style={{ background: "#F5F0EA" }}>
                      {/* Outlined so the pale Tertiary swatch stays visible against the card */}
                      <div
                        className="h-24 p-3 flex items-end justify-between rounded-t-xl"
                        style={{ background: color.hex, color: color.text, border: "1px solid rgba(28,25,23,0.1)" }}
                      >
                        <span className="text-3xl leading-none" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>Aa</span>
                        <span className="font-mono-dm text-xs">{ratio.toFixed(1)}:1</span>
                      </div>
                      <div className="p-3 flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm font-medium" style={{ color: "#1C1917" }}>{color.name}</div>
                          <div className="font-mono-dm text-xs" style={{ color: "#6B6560" }}>{color.hex}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap" style={{ background: `${ACCENT}15`, color: ACCENT }}>
                          {wcagLevel(ratio)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="font-mono-dm text-xs tracking-wide uppercase mb-4" style={{ color: ACCENT }}>Typography</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {FONTS.map((font) => (
                  <div key={font.name} className="p-6 rounded-2xl" style={{ background: "#F5F0EA" }}>
                    <div className="font-mono-dm text-xs tracking-wide mb-3 px-2 py-0.5 rounded-full inline-block" style={{ background: `${ACCENT}20`, color: ACCENT }}>
                      {font.role}
                    </div>
                    <div className="text-2xl mb-2" style={{ color: "#1C1917", fontFamily: `'${font.name}', sans-serif` }}>{font.name}</div>
                    <p className="text-sm mb-4" style={{ color: "#6B6560" }}>{font.desc}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {FONT_WEIGHTS.map((w) => (
                        <div key={w.weight}>
                          <div className="text-sm" style={{ color: "#1C1917", fontFamily: `'${font.name}', sans-serif`, fontWeight: Number(w.value) }}>{w.weight}</div>
                          <div className="font-mono-dm text-xs" style={{ color: ACCENT }}>{w.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20" style={{ background: "#F5F0EA" }}>
          <Section>
            <SectionLabel color={ACCENT} label="Design" />
            <h2 className="font-display text-3xl mb-8" style={{ color: "#1C1917", fontWeight: 300 }}>
              Key Design <em style={{ color: ACCENT }}>Decisions</em>
            </h2>
            <p className="text-lg leading-relaxed mb-14 max-w-3xl" style={{ color: "#6B6560" }}>
              The redesign's biggest decisions came straight from the audit and the competitive analysis.
            </p>
            <div className="flex flex-col gap-16">
              {DECISIONS.map((decision, i) => (
                <div key={decision.title} className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
                  {/* Images alternate sides on wide screens so the rows don't read as one column */}
                  <div className={`lg:col-span-3 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                    <img
                      src={decision.src}
                      alt={decision.alt}
                      width={decision.width}
                      height={decision.height}
                      loading="lazy"
                      className="w-full h-auto rounded-2xl shadow-sm mx-auto"
                      style={{ maxWidth: decision.maxWidth, border: `1px solid ${ACCENT}20` }}
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <div className="flex mb-4">
                      <div className="font-mono-dm text-xs tracking-wide px-2 py-0.5 rounded-full" style={{ background: `${ACCENT}20`, color: ACCENT }}>
                        {i + 1}
                      </div>
                    </div>
                    <h3 className="font-display text-2xl mb-3" style={{ color: "#1C1917", fontWeight: 400 }}>{decision.title}</h3>
                    <p className="text-base leading-relaxed mb-5" style={{ color: "#6B6560" }}>{decision.desc}</p>
                    <h4 className="font-mono-dm text-xs tracking-wide uppercase mb-1" style={{ color: ACCENT }}>Addresses</h4>
                    <p className="text-sm leading-relaxed" style={{ color: "#1C1917" }}>{decision.addresses}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="px-8 lg:px-32 py-20">
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

        <div className="px-8 lg:px-32 py-20" id="testing" style={{ background: "#F5F0EA" }}>
          <Section>
            <SectionLabel color={ACCENT} label="Usability Testing" />
            <h2 className="font-display text-3xl mb-8" style={{ color: "#1C1917", fontWeight: 300 }}>
              Moderated Usability <em style={{ color: ACCENT }}>Testing</em>
            </h2>
            <p className="text-lg leading-relaxed mb-6 max-w-3xl" style={{ color: "#6B6560" }}>
              Once the redesign was complete, I ran moderated usability tests on the Figma prototype with 4 new participants who hadn't taken part in the interviews, again matching the Turkish clients the agency mostly works with. In one-to-one sessions, each participant thought aloud while working through four tasks, and I followed up whenever they hesitated.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              {TEST_SETUP.map((item) => (
                <span key={item} className="px-3 py-1.5 rounded-full font-mono-dm text-xs tracking-wide" style={{ background: `${ACCENT}15`, color: ACCENT }}>
                  {item}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
              {TEST_TASKS.map((task, i) => (
                <div key={task.title} className="p-6 rounded-2xl" style={{ background: "#FAF7F2" }}>
                  <div className="aspect-[16/9] rounded-xl overflow-hidden mb-5" style={{ border: `1px solid ${ACCENT}20` }}>
                    <img src={task.src} alt={task.alt} loading="lazy" className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="flex mb-4">
                    <div className="font-mono-dm text-xs tracking-wide px-2 py-0.5 rounded-full" style={{ background: `${ACCENT}20`, color: ACCENT }}>
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="font-display text-xl mb-2" style={{ color: "#1C1917", fontWeight: 400 }}>{task.title}</h3>
                  <p className="text-sm italic leading-relaxed mb-4" style={{ color: "#1C1917" }}>“{task.prompt}”</p>
                  <h4 className="font-mono-dm text-xs tracking-wide uppercase mb-2" style={{ color: ACCENT }}>What happened</h4>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B6560" }}>{task.observed}</p>
                </div>
              ))}
            </div>

            <h3 className="font-display text-2xl mb-6" style={{ color: "#1C1917", fontWeight: 400 }}>Next Steps</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {NEXT_STEPS.map((item, i) => (
                <div key={item.title} className="p-6 rounded-2xl" style={{ background: "#FAF7F2" }}>
                  <div className="flex mb-4">
                    <div className="font-mono-dm text-xs tracking-wide px-2 py-0.5 rounded-full" style={{ background: `${ACCENT}20`, color: ACCENT }}>
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="font-display text-xl mb-2" style={{ color: "#1C1917", fontWeight: 400 }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B6560" }}>{item.desc}</p>
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
