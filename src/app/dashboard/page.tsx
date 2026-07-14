import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { EventRow } from "@/components/dashboard/EventRow";
import { TaskRow } from "@/components/dashboard/TaskRow";
import { AddEventForm } from "@/components/dashboard/AddEventForm";
import { AddTaskForm } from "@/components/dashboard/AddTaskForm";
import {
  APP_TIMEZONE,
  addDaysToDateString,
  currentHourInAppTimezone,
  todayDateStringInAppTimezone,
  zonedMidnight,
} from "@/lib/timezone";

function greeting() {
  const hour = currentHourInAppTimezone();
  if (hour < 12) return "Goedemorgen";
  if (hour < 18) return "Goedemiddag";
  return "Goedenavond";
}

export default async function DashboardPage() {
  const user = await requireUser();
  const todayStr = todayDateStringInAppTimezone();
  const dayStart = zonedMidnight(todayStr);
  const dayEnd = zonedMidnight(addDaysToDateString(todayStr, 1));

  const [events, tasks, members] = await Promise.all([
    prisma.event.findMany({
      where: {
        familyId: user.familyId,
        startTime: { gte: dayStart, lt: dayEnd },
      },
      include: { assignee: true },
      orderBy: { startTime: "asc" },
    }),
    prisma.task.findMany({
      where: { familyId: user.familyId, done: false },
      include: { assignee: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.user.findMany({
      where: { familyId: user.familyId },
      select: { id: true, name: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const dateLabel = new Intl.DateTimeFormat("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: APP_TIMEZONE,
  }).format(dayStart);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-ink-900">
          {greeting()}, {user.name?.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm capitalize text-ink-500">{dateLabel}</p>
      </div>

      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500">Vandaag</h2>
          <Link href="/dashboard/calendar" className="text-xs font-medium text-sage-600 hover:underline">
            Volledige agenda
          </Link>
        </div>
        <div className="space-y-2">
          {events.length === 0 && (
            <p className="rounded-xl bg-white px-4 py-6 text-center text-sm text-ink-500 shadow-sm">
              Nog geen afspraken vandaag. Geniet van de rust 🌿
            </p>
          )}
          {events.map((event) => (
            <EventRow key={event.id} event={event} members={members} />
          ))}
        </div>
        <div className="mt-3">
          <AddEventForm members={members} defaultDate={todayStr} />
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500">
            Taken <span className="text-ink-400">({tasks.length} openstaand)</span>
          </h2>
          <Link href="/dashboard/tasks" className="text-xs font-medium text-sage-600 hover:underline">
            Bekijk alles
          </Link>
        </div>
        <div className="space-y-2">
          {tasks.length === 0 && (
            <p className="rounded-xl bg-white px-4 py-6 text-center text-sm text-ink-500 shadow-sm">
              Alle taken zijn afgerond. Goed bezig! 🎉
            </p>
          )}
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} members={members} />
          ))}
        </div>
        <div className="mt-3">
          <AddTaskForm members={members} />
        </div>
      </section>
    </div>
  );
}
