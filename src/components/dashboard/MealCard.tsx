"use client";

import { useActionState, useState, useTransition } from "react";
import { UtensilsCrossed, Clock, Star, Trash2, Pencil } from "lucide-react";
import { deleteMealAction, updateMealAction } from "@/lib/actions/meals";
import { Modal } from "@/components/dashboard/Modal";
import { toZonedDateInputValue } from "@/lib/timezone";

type Meal = {
  id: string;
  title: string;
  date: Date;
  prepTime: number | null;
  notes: string | null;
  favorite: boolean;
};

export function MealCard({ meal }: { meal: Meal }) {
  const [isPending, startTransition] = useTransition();
  const [detailOpen, setDetailOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  function handleClose() {
    setEditing(false);
    setDetailOpen(false);
  }

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
        className="flex cursor-pointer items-center gap-3 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-peach-100 text-[#c17a52]">
          <UtensilsCrossed className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink-900">{meal.title}</p>
          <div className="mt-0.5 flex items-center gap-3 text-xs text-ink-500">
            {meal.prepTime && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {meal.prepTime} min
              </span>
            )}
            {meal.favorite && (
              <span className="flex items-center gap-1 text-[#c17a52]">
                <Star className="h-3 w-3 fill-current" /> Favoriet
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          disabled={isPending}
          onClick={(e) => {
            e.stopPropagation();
            startTransition(() => void deleteMealAction(meal.id));
          }}
          className="shrink-0 rounded-lg p-1.5 text-ink-400 transition hover:bg-peach-100 hover:text-[#a35b36]"
          aria-label="Verwijder maaltijd"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <Modal open={detailOpen} onClose={handleClose} title={editing ? "Maaltijd bewerken" : meal.title}>
        {editing ? (
          <MealEditForm meal={meal} onDone={() => setEditing(false)} onCancel={() => setEditing(false)} />
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {meal.prepTime && (
                <span className="flex items-center gap-1 rounded-full bg-sage-100 px-2.5 py-1 text-xs font-medium text-sage-700">
                  <Clock className="h-3 w-3" /> {meal.prepTime} min
                </span>
              )}
              {meal.favorite && (
                <span className="flex items-center gap-1 rounded-full bg-peach-100 px-2.5 py-1 text-xs font-medium text-[#c17a52]">
                  <Star className="h-3 w-3 fill-current" /> Favoriet
                </span>
              )}
            </div>
            {meal.notes && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-500">Notities</p>
                <p className="whitespace-pre-wrap text-sm text-ink-900">{meal.notes}</p>
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
    </>
  );
}

function MealEditForm({
  meal,
  onDone,
  onCancel,
}: {
  meal: Meal;
  onDone: () => void;
  onCancel: () => void;
}) {
  const updateWithId = updateMealAction.bind(null, meal.id);
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
        defaultValue={meal.title}
        placeholder="Bijv. Romige orzo"
        required
        autoFocus
        className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
      />
      <div className="grid grid-cols-2 gap-2">
        <input
          name="date"
          type="date"
          required
          defaultValue={toZonedDateInputValue(meal.date)}
          className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400"
        />
        <input
          name="prepTime"
          type="number"
          min="0"
          defaultValue={meal.prepTime ?? ""}
          placeholder="Minuten"
          className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400"
        />
      </div>
      <textarea
        name="notes"
        defaultValue={meal.notes ?? ""}
        placeholder="Notities (optioneel)"
        rows={2}
        className="w-full resize-none rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400"
      />
      <label className="flex items-center gap-2 text-sm text-ink-700">
        <input type="checkbox" name="favorite" defaultChecked={meal.favorite} className="h-4 w-4 rounded border-sage-300" />
        Favoriet
      </label>
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
