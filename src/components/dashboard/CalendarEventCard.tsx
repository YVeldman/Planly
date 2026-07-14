"use client";

import { useState, useTransition } from "react";
import { MapPin, X } from "lucide-react";
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

export function CalendarEventCard({ event, members = [] }: { event: Event; members?: Member[] }) {
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
        className={`group relative cursor-pointer rounded-lg ${category.bg} px-2.5 py-2 text-left`}
      >
        <p className={`truncate text-[11px] font-semibold ${category.fg}`}>{time}</p>
        <p className="truncate text-xs font-medium text-ink-900">{event.title}</p>
        {event.assignee && <p className="truncate text-[10px] text-ink-500">{event.assignee.name}</p>}
        {event.location && (
          <p className="flex items-center gap-0.5 truncate text-[10px] text-ink-400">
            <MapPin className="h-2.5 w-2.5 shrink-0" /> {event.location}
          </p>
        )}
        <button
          type="button"
          disabled={isPending}
          onClick={(e) => {
            e.stopPropagation();
            startTransition(() => deleteEventAction(event.id));
          }}
          className="absolute right-1 top-1 rounded p-0.5 text-ink-400 opacity-0 transition hover:bg-white/60 hover:text-[#a35b36] group-hover:opacity-100"
          aria-label="Verwijder afspraak"
        >
          <X className="h-3 w-3" />
        </button>
      </div>

      <EventDetailModal event={event} members={members} open={detailOpen} onClose={() => setDetailOpen(false)} />
    </>
  );
}
