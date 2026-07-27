import Section from "./Section";

interface CaseStudyHeaderProps {
  thumbnailUrl: string;
  thumbnailAlt: string;
  /** The hero content (tags, title, description, CTAs) rendered on the left side */
  children: React.ReactNode;
}

/**
 * Shared header pattern for case study pages:
 * - Mobile: full-width thumbnail above the fold
 * - Desktop: 2-column grid with hero content left, thumbnail right
 */
export default function CaseStudyHeader({
  thumbnailUrl,
  thumbnailAlt,
  children,
}: CaseStudyHeaderProps) {
  return (
    <>
      {/* Mobile Thumbnail — full width, no rounded corners */}
      <div className="lg:hidden mt-[72px]">
        <img
          src={thumbnailUrl}
          alt={thumbnailAlt}
          className="w-full h-auto"
        />
      </div>

      <header className="pt-12 pb-20 px-8 lg:py-20 lg:px-32" id="overview">
        <Section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Hero content */}
            <div>{children}</div>

            {/* Right: Thumbnail (desktop only) */}
            <div className="hidden lg:block">
              <div className="rounded-2xl overflow-hidden">
                <img
                  src={thumbnailUrl}
                  alt={thumbnailAlt}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </Section>
      </header>
    </>
  );
}
