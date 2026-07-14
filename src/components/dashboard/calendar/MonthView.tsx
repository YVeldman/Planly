import Link from "next/link";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  eachDayOfInterval,
  format,
  isSameMonth,
} from "date-fns";
import { nl } from "date-fns/locale";
import { prisma } from "@/lib/prisma";
import { getCategory } from "@/lib/categories";
import { CalendarNav } from "@/components/dashboard/calendar/CalendarNav";
import { zonedMidnight, addDaysToDateString, toZonedDateInputValue, todayDateStringInAppTimezone } from "@/lib/timezone";

const weekdayLabels = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

export async function MonthView({ reference, familyId }: { reference: Date; familyId: string }) {
  const monthStart = startOfMonth(reference);
  const monthEnd = endOfMonth(reference);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const gridStartStr = format(gridStart, "yyyy-MM-dd");
  const gridEndStr = format(gridEnd, "yyyy-MM-dd");
  const queryStart = zonedMidnight(gridStartStr);
  const queryEnd = zonedMidnight(addDaysToDateString(gridEndStr, 1));

  const events = await prisma.event.findMany({
    where: { familyId, startTime: { gte: queryStart, lt: queryEnd } },
    orderBy: { startTime: "asc" },
  });

  const todayStr = todayDateStringInAppTimezone();
  const prevMonth = format(subMonths(reference, 1), "yyyy-MM-dd");
  const nextMonth = format(addMonths(reference, 1), "yyyy-MM-dd");
  const rangeLabel = format(reference, "MMMM yyyy", { locale: nl });

  return (
    <div>
      <CalendarNav
        rangeLabel={rangeLabel}
        prevHref={`/dashboard/calendar?view=month&date=${prevMonth}`}
        nextHref={`/dashboard/calendar?view=month&date=${nextMonth}`}
        todayHref="/dashboard/calendar?view=month"
      />

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-2xl border border-sage-200 bg-sage-200">
        {weekdayLabels.map((label) => (
          <div
            key={label}
            className="bg-cream-50 py-2 text-center text-xs font-semibold uppercase tracking-wide text-ink-500"
          >
            {label}
          </div>
        ))}
        {days.map((day) => {
          const dayIso = format(day, "yyyy-MM-dd");
          const dayEvents = events.filter((e) => toZonedDateInputValue(e.startTime) === dayIso);
          const inMonth = isSameMonth(day, reference);
          const isToday = dayIso === todayStr;
          const visible = dayEvents.slice(0, 3);
          const overflow = dayEvents.length - visible.length;

          return (
            <Link
              key={dayIso}
              href={`/dashboard/calendar?view=day&date=${dayIso}`}
              className={`flex min-h-[88px] flex-col gap-1 p-1.5 text-left transition hover:bg-sage-50 sm:min-h-[104px] ${
                inMonth ? "bg-white" : "bg-cream-50"
              }`}
            >
              <span
                className={`text-xs font-semibold ${
                  isToday
                    ? "flex h-5 w-5 items-center justify-center rounded-full bg-sage-600 text-white"
                    : inMonth
                      ? "text-ink-900"
                      : "text-ink-400"
                }`}
              >
                {format(day, "d")}
              </span>
              <div className="space-y-0.5">
                {visible.map((event) => {
                  const category = getCategory(event.category);
                  return (
                    <p
                      key={event.id}
                      className={`truncate rounded px-1 py-0.5 text-[10px] font-medium ${category.bg} ${category.fg}`}
                    >
                      {event.title}
                    </p>
                  );
                })}
                {overflow > 0 && <p className="text-[10px] text-ink-400">+{overflow} meer</p>}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
