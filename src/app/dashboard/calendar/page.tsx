import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
  parseISO,
} from "date-fns";
import { nl } from "date-fns/locale";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { CalendarEventCard } from "@/components/dashboard/CalendarEventCard";
import { AddEventForm } from "@/components/dashboard/AddEventForm";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const user = await requireUser();
  const { date } = await searchParams;

  const reference = date ? parseISO(date) : new Date();
  const weekStart = startOfWeek(reference, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(reference, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const [events, members] = await Promise.all([
    prisma.event.findMany({
      where: { familyId: user.familyId, startTime: { gte: weekStart, lte: weekEnd } },
      include: { assignee: true },
      orderBy: { startTime: "asc" },
    }),
    prisma.user.findMany({
      where: { familyId: user.familyId },
      select: { id: true, name: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const prevWeek = format(subWeeks(reference, 1), "yyyy-MM-dd");
  const nextWeek = format(addWeeks(reference, 1), "yyyy-MM-dd");

  const rangeLabel = `${format(weekStart, "d MMM", { locale: nl })} – ${format(weekEnd, "d MMM yyyy", { locale: nl })}`;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink-900">Agenda</h1>
          <p className="mt-1 text-sm capitalize text-ink-500">{rangeLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/calendar?date=${prevWeek}`}
            className="rounded-full border border-sage-200 p-2 text-ink-700 hover:bg-sage-100"
            aria-label="Vorige week"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <Link
            href="/dashboard/calendar"
            className="rounded-full border border-sage-200 px-3 py-2 text-xs font-medium text-ink-700 hover:bg-sage-100"
          >
            Vandaag
          </Link>
          <Link
            href={`/dashboard/calendar?date=${nextWeek}`}
            className="rounded-full border border-sage-200 p-2 text-ink-700 hover:bg-sage-100"
            aria-label="Volgende week"
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 overflow-x-auto pb-2 sm:grid-cols-2 lg:grid-cols-7">
        {days.map((day) => {
          const dayEvents = events.filter((e) => isSameDay(e.startTime, day));
          const dayIso = format(day, "yyyy-MM-dd");
          return (
            <div
              key={dayIso}
              className={`min-w-0 rounded-2xl border p-3 ${
                isToday(day) ? "border-sage-400 bg-sage-50" : "border-sage-200 bg-white"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  {format(day, "EEE", { locale: nl })}
                </p>
                <p className={`text-sm font-bold ${isToday(day) ? "text-sage-600" : "text-ink-900"}`}>
                  {format(day, "d")}
                </p>
              </div>
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

      <div className="mx-auto mt-6 max-w-sm">
        <AddEventForm members={members} defaultDate={format(new Date(), "yyyy-MM-dd")} />
      </div>
    </div>
  );
}
