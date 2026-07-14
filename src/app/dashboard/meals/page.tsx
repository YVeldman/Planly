import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, format } from "date-fns";
import { nl } from "date-fns/locale";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { MealCard } from "@/components/dashboard/MealCard";
import { AddMealForm } from "@/components/dashboard/AddMealForm";
import {
  zonedMidnight,
  addDaysToDateString,
  toZonedDateInputValue,
  todayDateStringInAppTimezone,
} from "@/lib/timezone";

export default async function MealsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const user = await requireUser();
  const { date } = await searchParams;

  const referenceDateStr = date ?? todayDateStringInAppTimezone();
  const reference = new Date(referenceDateStr);

  const weekStart = startOfWeek(reference, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(reference, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const weekStartStr = format(weekStart, "yyyy-MM-dd");
  const queryStart = zonedMidnight(weekStartStr);
  const queryEnd = zonedMidnight(addDaysToDateString(weekStartStr, 7));

  const meals = await prisma.meal.findMany({
    where: { familyId: user.familyId, date: { gte: queryStart, lt: queryEnd } },
    orderBy: { date: "asc" },
  });

  const prevWeek = format(subWeeks(reference, 1), "yyyy-MM-dd");
  const nextWeek = format(addWeeks(reference, 1), "yyyy-MM-dd");
  const rangeLabel = `${format(weekStart, "d MMM", { locale: nl })} – ${format(weekEnd, "d MMM yyyy", { locale: nl })}`;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink-900">Maaltijden</h1>
          <p className="mt-1 text-sm capitalize text-ink-500">{rangeLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/meals?date=${prevWeek}`}
            className="rounded-full border border-sage-200 p-2 text-ink-700 hover:bg-sage-100"
            aria-label="Vorige week"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <Link
            href="/dashboard/meals"
            className="rounded-full border border-sage-200 px-3 py-2 text-xs font-medium text-ink-700 hover:bg-sage-100"
          >
            Deze week
          </Link>
          <Link
            href={`/dashboard/meals?date=${nextWeek}`}
            className="rounded-full border border-sage-200 p-2 text-ink-700 hover:bg-sage-100"
            aria-label="Volgende week"
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-2xl space-y-6">
        {days.map((day) => {
          const dayIso = format(day, "yyyy-MM-dd");
          const dayMeals = meals.filter((m) => toZonedDateInputValue(m.date) === dayIso);
          return (
            <div key={dayIso}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500">
                {format(day, "EEEE d MMMM", { locale: nl })}
              </p>
              <div className="space-y-2">
                {dayMeals.map((meal) => (
                  <MealCard key={meal.id} meal={meal} />
                ))}
                {dayMeals.length === 0 && (
                  <p className="rounded-xl bg-white px-4 py-4 text-center text-sm text-ink-400 shadow-sm">
                    Nog geen maaltijd gepland
                  </p>
                )}
              </div>
            </div>
          );
        })}

        <AddMealForm defaultDate={referenceDateStr} />
      </div>
    </div>
  );
}
