"use client";

import { useTransition } from "react";
import { X } from "lucide-react";
import { deleteEventAction } from "@/lib/actions/events";
import { getCategory } from "@/lib/categories";

type Event = {
  id: string;
  title: string;
  category: string;
  startTime: Date;
  endTime: Date | null;
  assignee: { name: string; color: string } | null;
};

const timeFormatter = new Intl.DateTimeFormat("nl-NL", { hour: "2-digit", minute: "2-digit" });

export function CalendarEventCard({ event }: { event: Event }) {
  const [isPending, startTransition] = useTransition();
  const category = getCategory(event.category);
  const time = event.endTime
    ? `${timeFormatter.format(event.startTime)} – ${timeFormatter.format(event.endTime)}`
    : timeFormatter.format(event.startTime);

  return (
    <div className={`group relative rounded-lg ${category.bg} px-2.5 py-2 text-left`}>
      <p className={`truncate text-[11px] font-semibold ${category.fg}`}>{time}</p>
      <p className="truncate text-xs font-medium text-ink-900">{event.title}</p>
      {event.assignee && <p className="truncate text-[10px] text-ink-500">{event.assignee.name}</p>}
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => deleteEventAction(event.id))}
        className="absolute right-1 top-1 rounded p-0.5 text-ink-400 opacity-0 transition hover:bg-white/60 hover:text-[#a35b36] group-hover:opacity-100"
        aria-label="Verwijder afspraak"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
