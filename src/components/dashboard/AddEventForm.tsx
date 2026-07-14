"use client";

import { useActionState, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { createEventAction } from "@/lib/actions/events";
import { categoryOptions } from "@/lib/categories";

type Member = { id: string; name: string };

export function AddEventForm({
  members,
  defaultDate,
}: {
  members: Member[];
  defaultDate: string;
}) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(async (prevState: unknown, formData: FormData) => {
    const result = await createEventAction(prevState as never, formData);
    if (!result?.error) {
      formRef.current?.reset();
      setOpen(false);
    }
    return result;
  }, undefined);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-sage-300 py-2.5 text-sm font-medium text-sage-600 transition hover:bg-sage-50"
      >
        <Plus className="h-4 w-4" /> Afspraak toevoegen
      </button>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-3 rounded-xl border border-sage-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink-900">Nieuwe afspraak</p>
        <button type="button" onClick={() => setOpen(false)} className="text-ink-500 hover:text-ink-900">
          <X className="h-4 w-4" />
        </button>
      </div>
      {state?.error && <p className="text-sm text-[#a35b36]">{state.error}</p>}
      <input
        name="title"
        placeholder="Bijv. Tandarts Sophie"
        required
        autoFocus
        className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
      />
      <div className="grid grid-cols-2 gap-2">
        <input
          name="date"
          type="date"
          required
          defaultValue={defaultDate}
          className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400"
        />
        <select
          name="category"
          defaultValue="other"
          className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400"
        >
          {categoryOptions.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input
          name="startTime"
          type="time"
          required
          defaultValue="09:00"
          className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400"
        />
        <input
          name="endTime"
          type="time"
          className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400"
        />
      </div>
      <select
        name="assigneeId"
        defaultValue=""
        className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400"
      >
        <option value="">Hele gezin</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
      <input
        name="location"
        placeholder="Locatie (bijv. Tandartspraktijk, Hoofdstraat 12)"
        className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
      />
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-sage-600 py-2 text-sm font-semibold text-white transition hover:bg-sage-700 disabled:opacity-60"
      >
        {pending ? "Bezig..." : "Toevoegen"}
      </button>
    </form>
  );
}
