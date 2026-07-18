import { Link, useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";

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

export default function ProjectSwitcher() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentProject = projects.find((p) => p.slug === location) || projects[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono-dm text-[11px] tracking-wide transition-all duration-200"
        style={{
          background: `${currentProject.color}15`,
          color: currentProject.color,
          fontWeight: 600,
        }}
      >
        {currentProject.title}
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-2 rounded-xl py-2 min-w-[180px] shadow-lg"
          style={{
            background: "rgba(250,247,242,0.98)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          {projects.map((project) => {
            const isActive = location === project.slug;
            return (
              <Link key={project.slug} href={project.slug}>
                <button
                  onClick={() => setOpen(false)}
                  className="w-full text-left px-4 py-2.5 font-mono-dm text-xs tracking-wide transition-colors duration-200 hover:bg-black/[0.03]"
                  style={{
                    color: isActive ? project.color : "#6B6560",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: project.color, opacity: isActive ? 1 : 0.4 }}
                    />
                    {project.title}
                  </span>
                </button>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
