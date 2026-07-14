"use client";

import { useState, useTransition } from "react";
import { MapPin, Trash2 } from "lucide-react";
import { deleteEventAction } from "@/lib/actions/events";
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

export function EventRow({ event, members = [] }: { event: Event; members?: Member[] }) {
  const [isPending, startTransition] = useTransition();
  const [detailOpen, setDetailOpen] = useState(false);
  const category = getCategory(event.category);
  const time = event.endTime
    ? `${timeFormatter.format(event.startTime)} – ${timeFormatter.format(event.endTime)}`
    : timeFormatter.format(event.startTime);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setDetailOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setDetailOpen(true);
          }
        }}
        className="flex cursor-pointer items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm transition hover:shadow-md"
      >
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${category.bg} ${category.fg}`}>
          <category.icon className="h-4.5 w-4.5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink-900">{event.title}</p>
          <p className="text-xs text-ink-500">{event.assignee ? event.assignee.name : "Hele gezin"}</p>
          {event.location && (
            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-ink-400">
              <MapPin className="h-3 w-3 shrink-0" /> {event.location}
            </p>
          )}
        </div>
        <span className="shrink-0 text-xs font-medium text-ink-500">{time}</span>
        <button
          type="button"
          disabled={isPending}
          onClick={(e) => {
            e.stopPropagation();
            startTransition(() => deleteEventAction(event.id));
          }}
          className="shrink-0 rounded-lg p-1.5 text-ink-400 transition hover:bg-peach-100 hover:text-[#a35b36]"
          aria-label="Verwijder afspraak"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <EventDetailModal event={event} members={members} open={detailOpen} onClose={() => setDetailOpen(false)} />
    </>
  );
}
