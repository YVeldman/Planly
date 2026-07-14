"use client";

import { useActionState, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { createTaskAction } from "@/lib/actions/tasks";
import { categoryOptions } from "@/lib/categories";

type Member = { id: string; name: string };

export function AddTaskForm({ members }: { members: Member[] }) {
  const [open, setOpen] = useState(false);
  const [assigneeId, setAssigneeId] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(async (prevState: unknown, formData: FormData) => {
    const result = await createTaskAction(prevState as never, formData);
    if (!result?.error) {
      formRef.current?.reset();
      setAssigneeId("");
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
        <Plus className="h-4 w-4" /> Taak toevoegen
      </button>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-3 rounded-xl border border-sage-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink-900">Nieuwe taak</p>
        <button type="button" onClick={() => setOpen(false)} className="text-ink-500 hover:text-ink-900">
          <X className="h-4 w-4" />
        </button>
      </div>
      {state?.error && <p className="text-sm text-[#a35b36]">{state.error}</p>}
      <input
        name="title"
        placeholder="Bijv. Boodschappen doen"
        required
        autoFocus
        className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
      />
      <div className="grid grid-cols-2 gap-2">
        <select
          name="category"
          defaultValue="chore"
          className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400"
        >
          {categoryOptions.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <select
          name="assigneeId"
          defaultValue=""
          onChange={(e) => setAssigneeId(e.target.value)}
          className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400"
        >
          <option value="">Niemand</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>
      {assigneeId && (
        <label className="flex items-center gap-2 text-sm text-ink-700">
          <input
            type="checkbox"
            name="notify"
            defaultChecked
            className="h-4 w-4 rounded border-sage-300"
          />
          Stuur melding naar toegewezen persoon
        </label>
      )}
      <input
        name="dueDate"
        type="date"
        className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400"
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
