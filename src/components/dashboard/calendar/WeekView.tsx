import Link from "next/link";
import { startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, format } from "date-fns";
import { nl } from "date-fns/locale";
import { prisma } from "@/lib/prisma";
import { CalendarEventCard } from "@/components/dashboard/CalendarEventCard";
import { CalendarNav } from "@/components/dashboard/calendar/CalendarNav";
import { zonedMidnight, addDaysToDateString, toZonedDateInputValue, todayDateStringInAppTimezone } from "@/lib/timezone";

type Member = { id: string; name: string };

export async function WeekView({
  reference,
  familyId,
  members,
}: {
  reference: Date;
  familyId: string;
  members: Member[];
}) {
  const weekStart = startOfWeek(reference, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(reference, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const weekStartStr = format(weekStart, "yyyy-MM-dd");
  const queryStart = zonedMidnight(weekStartStr);
  const queryEnd = zonedMidnight(addDaysToDateString(weekStartStr, 7));

  const events = await prisma.event.findMany({
    where: { familyId, startTime: { gte: queryStart, lt: queryEnd } },
    include: { assignee: true },
    orderBy: { startTime: "asc" },
  });

  const prevWeek = format(subWeeks(reference, 1), "yyyy-MM-dd");
  const nextWeek = format(addWeeks(reference, 1), "yyyy-MM-dd");
  const rangeLabel = `${format(weekStart, "d MMM", { locale: nl })} – ${format(weekEnd, "d MMM yyyy", { locale: nl })}`;
  const todayStr = todayDateStringInAppTimezone();

  return (
    <div>
      <CalendarNav
        rangeLabel={rangeLabel}
        prevHref={`/dashboard/calendar?view=week&date=${prevWeek}`}
        nextHref={`/dashboard/calendar?view=week&date=${nextWeek}`}
        todayHref="/dashboard/calendar?view=week"
      />

      <div className="grid grid-cols-1 gap-3 overflow-x-auto pb-2 sm:grid-cols-2 lg:grid-cols-7">
        {days.map((day) => {
          const dayIso = format(day, "yyyy-MM-dd");
          const dayEvents = events.filter((e) => toZonedDateInputValue(e.startTime) === dayIso);
          const isToday = dayIso === todayStr;
          return (
            <div
              key={dayIso}
              className={`min-w-0 rounded-2xl border p-3 ${
                isToday ? "border-sage-400 bg-sage-50" : "border-sage-200 bg-white"
              }`}
            >
              <Link
                href={`/dashboard/calendar?view=day&date=${dayIso}`}
                className="mb-2 flex items-center justify-between hover:opacity-70"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  {format(day, "EEE", { locale: nl })}
                </p>
                <p className={`text-sm font-bold ${isToday ? "text-sage-600" : "text-ink-900"}`}>
                  {format(day, "d")}
                </p>
              </Link>
              <div className="space-y-1.5">
                {dayEvents.map((event) => (
                  <CalendarEventCard key={event.id} event={event} members={members} />
                ))}
                {dayEvents.length === 0 && (
                  <p className="py-3 text-center text-[11px] text-ink-400">Geen afspraken</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
