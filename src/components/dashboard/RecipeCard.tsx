"use client";

import { useActionState, useState, useTransition } from "react";
import { Clock, ExternalLink, HeartOff, CalendarPlus } from "lucide-react";
import { addRecipeToDayAction, unfavoriteMealAction } from "@/lib/actions/meals";
import { Modal } from "@/components/dashboard/Modal";
import { MealThumbnail } from "@/components/dashboard/MealThumbnail";

type Recipe = {
  id: string;
  title: string;
  prepTime: number | null;
  ingredients: string[];
  instructions: string[];
  imageUrl: string | null;
  sourceUrl: string | null;
};

export function RecipeCard({ recipe, defaultDate }: { recipe: Recipe; defaultDate: string }) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex flex-col overflow-hidden rounded-xl bg-white text-left shadow-sm transition hover:shadow-md"
      >
        <MealThumbnail src={recipe.imageUrl} alt={recipe.title} className="h-28 w-full" iconClassName="h-7 w-7" />
        <div className="p-3">
          <p className="truncate text-sm font-semibold text-ink-900">{recipe.title}</p>
          {recipe.prepTime && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-500">
              <Clock className="h-3 w-3" /> {recipe.prepTime} min
            </p>
          )}
        </div>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={recipe.title}>
        <div className="space-y-3">
          {recipe.imageUrl && (
            <MealThumbnail src={recipe.imageUrl} alt={recipe.title} className="h-40 w-full rounded-lg" iconClassName="h-8 w-8" />
          )}
          {recipe.prepTime && (
            <span className="inline-flex items-center gap-1 rounded-full bg-sage-100 px-2.5 py-1 text-xs font-medium text-sage-700">
              <Clock className="h-3 w-3" /> {recipe.prepTime} min
            </span>
          )}
          {recipe.ingredients.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-ink-500">Ingrediënten</p>
              <ul className="mt-1 space-y-1 text-sm text-ink-900">
                {recipe.ingredients.map((ingredient, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-sage-400" />
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {recipe.instructions.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-ink-500">Bereidingswijze</p>
              <ol className="mt-1 space-y-1.5 text-sm text-ink-900">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="shrink-0 font-semibold text-sage-600">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
          {recipe.sourceUrl && (
            <a
              href={recipe.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-sage-600 hover:underline"
            >
              <ExternalLink className="h-3 w-3" /> Bekijk origineel recept
            </a>
          )}

          <AddToDayForm mealId={recipe.id} defaultDate={defaultDate} onDone={() => setOpen(false)} />

          <button
            type="button"
            disabled={isPending}
            onClick={() => startTransition(() => void unfavoriteMealAction(recipe.title))}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-sage-200 py-2 text-sm font-medium text-ink-700 transition hover:bg-sage-100 disabled:opacity-60"
          >
            <HeartOff className="h-3.5 w-3.5" /> Verwijder uit favorieten
          </button>
        </div>
      </Modal>
    </>
  );
}

function AddToDayForm({
  mealId,
  defaultDate,
  onDone,
}: {
  mealId: string;
  defaultDate: string;
  onDone: () => void;
}) {
  const addToDay = addRecipeToDayAction.bind(null, mealId);
  const [state, formAction, pending] = useActionState(async (prevState: unknown, formData: FormData) => {
    const result = await addToDay(prevState as never, formData);
    if (!result?.error) onDone();
    return result;
  }, undefined);

  return (
    <form action={formAction} className="space-y-2 border-t border-sage-100 pt-3">
      {state?.error && <p className="text-xs text-[#a35b36]">{state.error}</p>}
      <div className="flex items-center gap-2">
        <input
          name="date"
          type="date"
          required
          defaultValue={defaultDate}
          className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400"
        />
        <button
          type="submit"
          disabled={pending}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-sage-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sage-700 disabled:opacity-60"
        >
          <CalendarPlus className="h-3.5 w-3.5" /> {pending ? "Bezig..." : "Inplannen"}
        </button>
      </div>
    </form>
  );
}
