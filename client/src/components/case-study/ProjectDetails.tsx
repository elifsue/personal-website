import type { Tool } from "@/config/tools";

interface ProjectDetailsProps {
  color: string;
  /** Plain label/value rows, e.g. Role, Timeline, Location */
  items: { label: string; value: string }[];
  tools: Tool[];
}

/**
 * Full-width strip of project facts (role, timeline, location) followed by tool badges.
 * Every item takes only the width it needs and the set is centred in the strip (text stays
 * left-aligned within each item); the tools drop to
 * their own row only when they don't fit. Stacks on phones.
 */
export default function ProjectDetails({ color, items, tools }: ProjectDetailsProps) {
  return (
    <dl
      className="flex flex-col sm:flex-row sm:flex-wrap items-start justify-center gap-x-12 min-[1400px]:gap-x-24 gap-y-6 p-6 lg:p-8 rounded-2xl"
      style={{ background: "#F5F0EA" }}
    >
      {items.map((item) => (
        <div key={item.label} className="shrink-0">
          <dt className="font-mono-dm text-xs tracking-widest uppercase mb-2" style={{ color }}>{item.label}</dt>
          <dd className="text-base" style={{ color: "#1C1917" }}>{item.value}</dd>
        </div>
      ))}
      <div className="min-w-0">
        <dt className="font-mono-dm text-xs tracking-widest uppercase mb-2" style={{ color }}>Tools</dt>
        {/* -my-1 cancels the badges' vertical padding, so a row of badges takes the same
            height as a line of text and doesn't make the strip taller than the other facts */}
        <dd className="flex flex-wrap gap-2 -my-1">
          {tools.map((tool) => (
            <div key={tool.name} className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: "#FAF7F2" }}>
              <img src={tool.logo} alt={tool.name} className="w-5 h-5 object-contain" />
              <span className="font-mono-dm text-sm tracking-wide" style={{ color: "#1C1917" }}>{tool.name}</span>
            </div>
          ))}
        </dd>
      </div>
    </dl>
  );
}
