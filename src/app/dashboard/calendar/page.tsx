import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { AddEventForm } from "@/components/dashboard/AddEventForm";
import { ViewSwitcher } from "@/components/dashboard/calendar/ViewSwitcher";
import { DayView } from "@/components/dashboard/calendar/DayView";
import { WeekView } from "@/components/dashboard/calendar/WeekView";
import { MonthView } from "@/components/dashboard/calendar/MonthView";
import { todayDateStringInAppTimezone } from "@/lib/timezone";

type ViewKey = "day" | "week" | "month";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; view?: string }>;
}) {
  const user = await requireUser();
  const { date, view: viewParam } = await searchParams;
  const view: ViewKey = viewParam === "day" || viewParam === "month" ? viewParam : "week";

  const referenceDateStr = date ?? todayDateStringInAppTimezone();
  const reference = new Date(referenceDateStr);

  const members = await prisma.user.findMany({
    where: { familyId: user.familyId },
    select: { id: true, name: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-2xl font-bold text-ink-900">Agenda</h1>
        <ViewSwitcher view={view} date={date} />
      </div>

      {view === "day" && <DayView reference={reference} familyId={user.familyId} members={members} />}
      {view === "week" && <WeekView reference={reference} familyId={user.familyId} members={members} />}
      {view === "month" && <MonthView reference={reference} familyId={user.familyId} />}

      <div className="mx-auto mt-6 max-w-sm">
        <AddEventForm members={members} defaultDate={referenceDateStr} />
      </div>
    </div>
  );
}
