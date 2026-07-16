"use client";

import { useState } from "react";
import { getCategory } from "@/lib/categories";
import { APP_TIMEZONE } from "@/lib/timezone";
import { EventDetailModal } from "@/components/dashboard/EventDetailModal";

type Member = { id: string; name: string };

type Event = {
  id: string;
  title: string;
  category: string;
  startTime: Date;
  endTime: Date | null;
  location: string | null;
  notes: string | null;
  assignee: { id: string; name: string; color: string } | null;
};

const timeFormatter = new Intl.DateTimeFormat("nl-NL", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: APP_TIMEZONE,
});

export function TodayTimeline({ events, members }: { events: Event[]; members: Member[] }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Vandaag</p>
          <h2 className="font-serif text-lg font-bold text-ink-900">Planning</h2>
        </div>
        <span className="shrink-0 text-xs text-ink-500">
          {events.length} {events.length === 1 ? "afspraak" : "afspraken"}
        </span>
      </div>

      {events.length === 0 ? (
        <p className="py-8 text-center text-sm text-ink-500">Nog geen afspraken vandaag. Geniet van de rust 🌿</p>
      ) : (
        <div className="space-y-0">
          {events.map((event, i) => (
            <TimelineRow key={event.id} event={event} members={members} isLast={i === events.length - 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function TimelineRow({
  event,
  members,
  isLast,
}: {
  event: Event;
  members: Member[];
  isLast: boolean;
}) {
  const [open, setOpen] = useState(false);
  const category = getCategory(event.category);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full gap-4 rounded-lg py-2 text-left transition hover:bg-sage-50"
      >
        <span className="w-11 shrink-0 pt-0.5 text-xs font-semibold text-ink-500">
          {timeFormatter.format(event.startTime)}
        </span>
        <span className="flex shrink-0 flex-col items-center">
          <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${category.dot}`} />
          {!isLast && <span className="mt-1 w-px flex-1 bg-sage-200" />}
        </span>
        <span className="min-w-0 flex-1 pb-3">
          <span className="block truncate text-sm font-semibold text-ink-900">{event.title}</span>
          <span className="block truncate text-xs text-ink-500">
            {[event.assignee?.name ?? "Hele gezin", event.location].filter(Boolean).join(" · ")}
          </span>
        </span>
      </button>
      <EventDetailModal event={event} members={members} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
