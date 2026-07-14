"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
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

export function EventRow({ event }: { event: Event }) {
  const [isPending, startTransition] = useTransition();
  const category = getCategory(event.category);
  const time = event.endTime
    ? `${timeFormatter.format(event.startTime)} – ${timeFormatter.format(event.endTime)}`
    : timeFormatter.format(event.startTime);

  return (
    <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${category.bg} ${category.fg}`}>
        <category.icon className="h-4.5 w-4.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink-900">{event.title}</p>
        <p className="text-xs text-ink-500">{event.assignee ? event.assignee.name : "Hele gezin"}</p>
      </div>
      <span className="shrink-0 text-xs font-medium text-ink-500">{time}</span>
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => deleteEventAction(event.id))}
        className="shrink-0 rounded-lg p-1.5 text-ink-400 transition hover:bg-peach-100 hover:text-[#a35b36]"
        aria-label="Verwijder afspraak"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
