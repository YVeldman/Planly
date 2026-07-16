import Link from "next/link";
import { CheckCircle2, Clock, Star, ArrowRight } from "lucide-react";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { TodayTimeline } from "@/components/dashboard/TodayTimeline";
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

const timeFormatter = new Intl.DateTimeFormat("nl-NL", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: APP_TIMEZONE,
});

export default async function DashboardPage() {
  const user = await requireUser();
  const todayStr = todayDateStringInAppTimezone();
  const dayStart = zonedMidnight(todayStr);
  const dayEnd = zonedMidnight(addDaysToDateString(todayStr, 1));

  const [events, tasks, meals, members, family] = await Promise.all([
    prisma.event.findMany({
      where: {
        familyId: user.familyId,
        startTime: { gte: dayStart, lt: dayEnd },
      },
      include: { assignee: true },
      orderBy: { startTime: "asc" },
    }),
    prisma.task.findMany({
      where: { familyId: user.familyId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.meal.findMany({
      where: { familyId: user.familyId, date: { gte: dayStart, lt: dayEnd } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.user.findMany({
      where: { familyId: user.familyId },
      select: { id: true, name: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.family.findUnique({ where: { id: user.familyId } }),
  ]);

  const dateKicker = new Intl.DateTimeFormat("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: APP_TIMEZONE,
  }).format(dayStart);

  const doneTasks = tasks.filter((t) => t.done).length;
  const totalTasks = tasks.length;
  const taskProgress = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

  const now = new Date();
  const nextEvent = events.find((e) => e.startTime >= now) ?? null;

  const todaysMeal = meals[0] ?? null;

  let totalPoints: number | null = null;
  if (family?.rewardsEnabled) {
    const result = await prisma.pointTransaction.aggregate({
      where: { user: { familyId: user.familyId, isChild: true } },
      _sum: { amount: true },
    });
    totalPoints = result._sum.amount ?? 0;
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#c17a52]">{dateKicker}</p>
          <h1 className="font-serif text-3xl font-bold text-ink-900">
            {greeting()}, {user.name?.split(" ")[0]}.
          </h1>
          <p className="mt-1 text-sm text-ink-500">Dit staat er vandaag voor jullie klaar.</p>
        </div>
        <Link
          href="/dashboard/tasks"
          className="shrink-0 rounded-full bg-sage-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sage-700"
        >
          + Nieuwe taak
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sage-100 text-sage-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">Taken</p>
            <p className="truncate text-sm font-semibold text-ink-900">
              {totalTasks === 0 ? "Nog geen taken" : `${doneTasks} van ${totalTasks} klaar`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
          <div className="flex h-10 shrink-0 items-center justify-center rounded-lg bg-peach-100 px-2.5 text-xs font-bold text-[#a35b36]">
            {nextEvent ? timeFormatter.format(nextEvent.startTime) : <Clock className="h-4 w-4" />}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">Volgende</p>
            <p className="truncate text-sm font-semibold text-ink-900">
              {nextEvent
                ? nextEvent.assignee
                  ? `${nextEvent.title} van ${nextEvent.assignee.name}`
                  : nextEvent.title
                : "Niks meer vandaag"}
            </p>
          </div>
        </div>

        {family?.rewardsEnabled && (
          <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cream-200 text-[#8a7255]">
              <Star className="h-5 w-5 fill-current" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">Beloningen</p>
              <p className="truncate text-sm font-semibold text-ink-900">{totalPoints} punten gespaard</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_1fr]">
        <TodayTimeline events={events} members={members} />

        <div className="space-y-4">
          <div className="rounded-2xl bg-sage-700 p-5 text-white shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Vanavond op tafel</p>
            {todaysMeal ? (
              <>
                <h2 className="mt-1 font-serif text-xl font-bold">{todaysMeal.title}</h2>
                <p className="mt-1 text-sm text-white/80">
                  {[todaysMeal.notes, todaysMeal.prepTime ? `${todaysMeal.prepTime} min` : null]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </>
            ) : (
              <p className="mt-1 text-sm text-white/80">Nog geen maaltijd gepland voor vandaag.</p>
            )}
            <Link
              href="/dashboard/groceries"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-white hover:underline"
            >
              Bekijk boodschappen <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Samen doen</p>
              <span className="shrink-0 text-xs font-semibold text-ink-500">
                {doneTasks}/{totalTasks}
              </span>
            </div>
            <h2 className="font-serif text-lg font-bold text-ink-900">Taken</h2>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-sage-100">
              <div
                className="h-full rounded-full bg-sage-600 transition-all"
                style={{ width: `${taskProgress}%` }}
              />
            </div>
            <Link
              href="/dashboard/tasks"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-sage-600 hover:underline"
            >
              Open alle taken <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
