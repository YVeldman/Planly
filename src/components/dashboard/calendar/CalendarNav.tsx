import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CalendarNav({
  rangeLabel,
  prevHref,
  nextHref,
  todayHref,
}: {
  rangeLabel: string;
  prevHref: string;
  nextHref: string;
  todayHref: string;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm capitalize text-ink-500">{rangeLabel}</p>
      <div className="flex items-center gap-2">
        <Link
          href={prevHref}
          className="rounded-full border border-sage-200 p-2 text-ink-700 hover:bg-sage-100"
          aria-label="Vorige"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <Link
          href={todayHref}
          className="rounded-full border border-sage-200 px-3 py-2 text-xs font-medium text-ink-700 hover:bg-sage-100"
        >
          Vandaag
        </Link>
        <Link
          href={nextHref}
          className="rounded-full border border-sage-200 p-2 text-ink-700 hover:bg-sage-100"
          aria-label="Volgende"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
