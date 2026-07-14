import Link from "next/link";
import { startOfWeek, addDays, format } from "date-fns";
import { nl } from "date-fns/locale";

export function WeekStrip({ reference, todayStr }: { reference: Date; todayStr: string }) {
  const weekStart = startOfWeek(reference, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="mb-6 flex justify-between gap-1.5 sm:gap-2">
      {days.map((day) => {
        const dayIso = format(day, "yyyy-MM-dd");
        const isToday = dayIso === todayStr;
        return (
          <Link
            key={dayIso}
            href={`/dashboard/calendar?view=day&date=${dayIso}`}
            className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2 transition ${
              isToday ? "bg-sage-600 text-white shadow-sm" : "text-ink-700 hover:bg-sage-100"
            }`}
          >
            <span className={`text-[10px] font-semibold uppercase tracking-wide ${isToday ? "text-white/80" : "text-ink-400"}`}>
              {format(day, "EEE", { locale: nl })}
            </span>
            <span className="text-sm font-bold">{format(day, "d")}</span>
          </Link>
        );
      })}
    </div>
  );
}
