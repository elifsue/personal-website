import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";

const projects = [
  {
    slug: "/character-pad",
    title: "Character Pad",
    color: "#E67E22",
  },
  {
    slug: "/kiddiwear",
    title: "Kiddiwear",
    color: "#BF5836",
  },
  {
    slug: "/wireframe-prototyper",
    title: "Wireframe Prototyper Skill",
    color: "#7B5EA7",
  },
];

export { projects };

export default function CaseStudyNav() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="hidden lg:flex sticky top-0 z-[55] items-center justify-center gap-1 px-4 py-2.5 transition-shadow duration-300"
      style={{
        background: "rgba(250,247,242,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        boxShadow: scrolled ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
      }}
    >
      {projects.map((project) => {
        const isActive = location === project.slug;
        return (
          <Link key={project.slug} href={project.slug}>
            <button
              className="relative px-4 py-2 rounded-full font-mono-dm text-xs tracking-wide transition-all duration-300"
              style={{
                background: isActive ? `${project.color}15` : "transparent",
                color: isActive ? project.color : "#6B6560",
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {project.title}
              {isActive && (
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                  style={{ background: project.color }}
                />
              )}
            </button>
          </Link>
        );
      })}
    </div>
  );
}
