import Link from "next/link";

const views = [
  { key: "day", label: "Dag" },
  { key: "week", label: "Week" },
  { key: "month", label: "Maand" },
] as const;

export function ViewSwitcher({ view, date }: { view: string; date?: string }) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-sage-200 bg-white p-1">
      {views.map((v) => {
        const href = `/dashboard/calendar?view=${v.key}${date ? `&date=${date}` : ""}`;
        const active = view === v.key;
        return (
          <Link
            key={v.key}
            href={href}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              active ? "bg-sage-600 text-white" : "text-ink-700 hover:bg-sage-100"
            }`}
          >
            {v.label}
          </Link>
        );
      })}
    </div>
  );
}
