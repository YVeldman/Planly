"use client";

import { useActionState, useState } from "react";
import { Pencil, MapPin, Users } from "lucide-react";
import { updateEventAction } from "@/lib/actions/events";
import { categoryOptions, getCategory } from "@/lib/categories";
import { Modal } from "@/components/dashboard/Modal";
import { LocationInput } from "@/components/dashboard/LocationInput";
import { APP_TIMEZONE, toZonedDateInputValue, toZonedTimeInputValue } from "@/lib/timezone";

type Member = { id: string; name: string };

type Event = {
  id: string;
  title: string;
  category: string;
  startTime: Date;
  endTime: Date | null;
  location: string | null;
  notes: string | null;
  assignee: { id: string; name: string } | null;
};

const timeFormatter = new Intl.DateTimeFormat("nl-NL", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: APP_TIMEZONE,
});

const dateFormatter = new Intl.DateTimeFormat("nl-NL", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: APP_TIMEZONE,
});

export function EventDetailModal({
  event,
  members,
  open,
  onClose,
}: {
  event: Event;
  members: Member[];
  open: boolean;
  onClose: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const category = getCategory(event.category);
  const time = event.endTime
    ? `${timeFormatter.format(event.startTime)} – ${timeFormatter.format(event.endTime)}`
    : timeFormatter.format(event.startTime);

  function handleClose() {
    setEditing(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title={editing ? "Afspraak bewerken" : event.title}>
      {editing ? (
        <EventEditForm event={event} members={members} onDone={() => setEditing(false)} onCancel={() => setEditing(false)} />
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${category.bg} ${category.fg}`}>
              {category.label}
            </span>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-500">Wanneer</p>
            <p className="text-sm capitalize text-ink-900">{dateFormatter.format(event.startTime)}</p>
            <p className="text-sm text-ink-900">{time}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-500">Wie</p>
            <p className="flex items-center gap-1.5 text-sm text-ink-900">
              <Users className="h-3.5 w-3.5 text-ink-500" /> {event.assignee ? event.assignee.name : "Hele gezin"}
            </p>
          </div>
          {event.location && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-ink-500">Locatie</p>
              <p className="flex items-center gap-1.5 text-sm text-ink-900">
                <MapPin className="h-3.5 w-3.5 text-ink-500" /> {event.location}
              </p>
            </div>
          )}
          {event.notes && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-ink-500">Notities</p>
              <p className="whitespace-pre-wrap text-sm text-ink-900">{event.notes}</p>
            </div>
          )}
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-sage-600 py-2 text-sm font-semibold text-white transition hover:bg-sage-700"
          >
            <Pencil className="h-3.5 w-3.5" /> Bewerken
          </button>
        </div>
      )}
    </Modal>
  );
}

function EventEditForm({
  event,
  members,
  onDone,
  onCancel,
}: {
  event: Event;
  members: Member[];
  onDone: () => void;
  onCancel: () => void;
}) {
  const updateWithId = updateEventAction.bind(null, event.id);
  const [state, formAction, pending] = useActionState(async (prevState: unknown, formData: FormData) => {
    const result = await updateWithId(prevState as never, formData);
    if (!result?.error) onDone();
    return result;
  }, undefined);

  return (
    <form action={formAction} className="space-y-3">
      {state?.error && <p className="text-sm text-[#a35b36]">{state.error}</p>}
      <input
        name="title"
        defaultValue={event.title}
        placeholder="Bijv. Tandarts Sophie"
        required
        autoFocus
        className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
      />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input
          name="date"
          type="date"
          required
          defaultValue={toZonedDateInputValue(event.startTime)}
          className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400"
        />
        <select
          name="category"
          defaultValue={event.category}
          className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400"
        >
          {categoryOptions.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input
          name="startTime"
          type="time"
          required
          defaultValue={toZonedTimeInputValue(event.startTime)}
          className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400"
        />
        <input
          name="endTime"
          type="time"
          defaultValue={event.endTime ? toZonedTimeInputValue(event.endTime) : ""}
          className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400"
        />
      </div>
      <select
        name="assigneeId"
        defaultValue={event.assignee?.id ?? ""}
        className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400"
      >
        <option value="">Hele gezin</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
      <LocationInput defaultValue={event.location ?? ""} />
      <textarea
        name="notes"
        defaultValue={event.notes ?? ""}
        placeholder="Notities (optioneel)"
        rows={2}
        className="w-full resize-none rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-lg border border-sage-200 py-2 text-sm font-medium text-ink-700 transition hover:bg-sage-100"
        >
          Annuleren
        </button>
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-sage-600 py-2 text-sm font-semibold text-white transition hover:bg-sage-700 disabled:opacity-60"
        >
          {pending ? "Bezig..." : "Opslaan"}
        </button>
      </div>
    </form>
  );
}
