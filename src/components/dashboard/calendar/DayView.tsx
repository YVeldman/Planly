import { addDays, subDays, format } from "date-fns";
import { nl } from "date-fns/locale";
import { prisma } from "@/lib/prisma";
import { EventRow } from "@/components/dashboard/EventRow";
import { CalendarNav } from "@/components/dashboard/calendar/CalendarNav";
import { zonedMidnight, addDaysToDateString } from "@/lib/timezone";

type Member = { id: string; name: string };

export async function DayView({
  reference,
  familyId,
  members,
}: {
  reference: Date;
  familyId: string;
  members: Member[];
}) {
  const dateStr = format(reference, "yyyy-MM-dd");
  const dayStart = zonedMidnight(dateStr);
  const dayEnd = zonedMidnight(addDaysToDateString(dateStr, 1));

  const events = await prisma.event.findMany({
    where: { familyId, startTime: { gte: dayStart, lt: dayEnd } },
    include: { assignee: true },
    orderBy: { startTime: "asc" },
  });

  const prevDay = format(subDays(reference, 1), "yyyy-MM-dd");
  const nextDay = format(addDays(reference, 1), "yyyy-MM-dd");
  const rangeLabel = format(reference, "EEEE d MMMM yyyy", { locale: nl });

  return (
    <div>
      <CalendarNav
        rangeLabel={rangeLabel}
        prevHref={`/dashboard/calendar?view=day&date=${prevDay}`}
        nextHref={`/dashboard/calendar?view=day&date=${nextDay}`}
        todayHref="/dashboard/calendar?view=day"
      />
      <div className="mx-auto max-w-lg space-y-2">
        {events.length === 0 && (
          <p className="rounded-xl bg-white px-4 py-6 text-center text-sm text-ink-500 shadow-sm">
            Geen afspraken op deze dag.
          </p>
        )}
        {events.map((event) => (
          <EventRow key={event.id} event={event} members={members} />
        ))}
      </div>
    </div>
  );
}
