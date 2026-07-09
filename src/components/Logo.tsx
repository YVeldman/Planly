export function LogoMark({ className = "", tone = "sage" }: { className?: string; tone?: "sage" | "cream" | "dark" }) {
  const strokeColor =
    tone === "sage" ? "var(--color-sage-500)" : tone === "dark" ? "var(--color-sage-800)" : "#ffffff";

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6 24L24 8L42 24"
        stroke={strokeColor}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 20V38C10 39.1 10.9 40 12 40H36C37.1 40 38 39.1 38 38V20"
        stroke={strokeColor}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 30c0-1.7 1.3-3 3-2.9.9 0 1.7.5 2 1.2.3-.7 1.1-1.2 2-1.2 1.7-.1 3 1.2 3 2.9 0 2.2-3.4 4.6-5 5.5-1.6-.9-5-3.3-5-5.5z"
        fill={strokeColor}
      />
    </svg>
  );
}

export function Logo({ className = "", tone = "sage" }: { className?: string; tone?: "sage" | "cream" | "dark" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <LogoMark className="h-8 w-8" tone={tone} />
      <span
        className={`font-serif text-2xl font-bold ${
          tone === "cream" ? "text-white" : "text-ink-900"
        }`}
      >
        Planly
      </span>
    </div>
  );
}
