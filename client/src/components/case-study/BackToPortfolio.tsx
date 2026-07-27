import { Link } from "wouter";

export default function BackToPortfolio() {
  return (
    <Link
      href="/"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-mono-dm text-sm tracking-wide transition-all duration-300 hover:scale-105 shadow-lg"
      style={{ background: "#1C1917", color: "#FAF7F2" }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      Back to Portfolio
    </Link>
  );
}
