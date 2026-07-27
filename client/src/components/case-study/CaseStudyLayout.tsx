import CustomCursor from "@/components/CustomCursor";
import CaseStudyNav from "@/components/CaseStudyNav";
import CaseStudyFooter from "@/components/CaseStudyFooter";
import CaseStudySidebar from "./CaseStudySidebar";
import BackToPortfolio from "./BackToPortfolio";
import CaseStudyHeader from "./CaseStudyHeader";
import useCaseStudyMeta from "@/hooks/useCaseStudyMeta";
import type { ProjectConfig } from "@/config/projects";

interface CaseStudyLayoutProps {
  config: ProjectConfig;
  /** Hero content rendered inside CaseStudyHeader (tags, title, description, CTAs) */
  heroContent: React.ReactNode;
  /** Main page sections rendered after the header */
  children: React.ReactNode;
}

/**
 * Full case study page layout. Composes:
 * - CustomCursor
 * - CaseStudySidebar (desktop sidebar + mobile nav)
 * - BackToPortfolio floating button
 * - CaseStudyNav (horizontal project tabs)
 * - CaseStudyHeader (mobile thumbnail + desktop 2-col hero)
 * - Children (page-specific content sections)
 * - CaseStudyFooter (other projects + contact CTA)
 */
export default function CaseStudyLayout({
  config,
  heroContent,
  children,
}: CaseStudyLayoutProps) {
  useCaseStudyMeta(config.meta);

  return (
    <div className="min-h-screen" style={{ background: "#FAF7F2" }}>
      <CustomCursor />
      <CaseStudySidebar navLinks={config.navLinks} accentColor={config.accentColor} />
      <BackToPortfolio />

      <main className="lg:pl-20">
        <CaseStudyNav />
        <CaseStudyHeader
          thumbnailUrl={config.thumbnailUrl}
          thumbnailAlt={config.thumbnailAlt}
        >
          {heroContent}
        </CaseStudyHeader>

        {children}

        <CaseStudyFooter currentProject={config.slug.replace("/", "") as "character-pad" | "kiddiwear" | "wireframe-prototyper"} />
      </main>
    </div>
  );
}
