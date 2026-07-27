interface SectionLabelProps {
  label: string;
  color: string;
}

export default function SectionLabel({ label, color }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-px" style={{ background: color }} />
      <span
        className="font-mono-dm text-xs tracking-[0.25em] uppercase"
        style={{ color }}
      >
        {label}
      </span>
    </div>
  );
}
