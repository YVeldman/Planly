"use client";

import { useActionState, useState } from "react";
import { Pencil, Users, CalendarDays } from "lucide-react";
import { updateTaskAction } from "@/lib/actions/tasks";
import { categoryOptions, getCategory } from "@/lib/categories";
import { Modal } from "@/components/dashboard/Modal";
import { APP_TIMEZONE, toZonedDateInputValue } from "@/lib/timezone";

type Member = { id: string; name: string };

type Task = {
  id: string;
  title: string;
  done: boolean;
  category: string;
  dueDate: Date | null;
  assignee: { id: string; name: string; color: string } | null;
};

const dueDateFormatter = new Intl.DateTimeFormat("nl-NL", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: APP_TIMEZONE,
});

export function TaskDetailModal({
  task,
  members,
  open,
  onClose,
}: {
  task: Task;
  members: Member[];
  open: boolean;
  onClose: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const category = getCategory(task.category);

  function handleClose() {
    setEditing(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title={editing ? "Taak bewerken" : task.title}>
      {editing ? (
        <TaskEditForm task={task} members={members} onDone={() => setEditing(false)} onCancel={() => setEditing(false)} />
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${category.bg} ${category.fg}`}>
              {category.label}
            </span>
            {task.done && (
              <span className="rounded-full bg-sage-100 px-2.5 py-1 text-xs font-medium text-sage-700">
                Afgerond
              </span>
            )}
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-500">Wie</p>
            <p className="flex items-center gap-1.5 text-sm text-ink-900">
              <Users className="h-3.5 w-3.5 text-ink-500" /> {task.assignee ? task.assignee.name : "Niemand"}
            </p>
          </div>
          {task.dueDate && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-ink-500">Vervaldatum</p>
              <p className="flex items-center gap-1.5 text-sm capitalize text-ink-900">
                <CalendarDays className="h-3.5 w-3.5 text-ink-500" /> {dueDateFormatter.format(task.dueDate)}
              </p>
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

function TaskEditForm({
  task,
  members,
  onDone,
  onCancel,
}: {
  task: Task;
  members: Member[];
  onDone: () => void;
  onCancel: () => void;
}) {
  const updateWithId = updateTaskAction.bind(null, task.id);
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
        defaultValue={task.title}
        placeholder="Bijv. Boodschappen doen"
        required
        autoFocus
        className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
      />
      <div className="grid grid-cols-2 gap-2">
        <select
          name="category"
          defaultValue={task.category}
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
          defaultValue={task.assignee?.id ?? ""}
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
      <input
        name="dueDate"
        type="date"
        defaultValue={task.dueDate ? toZonedDateInputValue(task.dueDate) : ""}
        className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400"
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
