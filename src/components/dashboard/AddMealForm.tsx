"use client";

import { useActionState, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { createMealAction } from "@/lib/actions/meals";
import { RecipeImportField } from "@/components/dashboard/RecipeImportField";

export function AddMealForm({ defaultDate }: { defaultDate: string }) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [title, setTitle] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");

  const [state, formAction, pending] = useActionState(async (prevState: unknown, formData: FormData) => {
    const result = await createMealAction(prevState as never, formData);
    if (!result?.error) {
      formRef.current?.reset();
      setTitle("");
      setPrepTime("");
      setIngredients("");
      setInstructions("");
      setImageUrl("");
      setSourceUrl("");
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
        <Plus className="h-4 w-4" /> Maaltijd toevoegen
      </button>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-3 rounded-xl border border-sage-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink-900">Nieuwe maaltijd</p>
        <button type="button" onClick={() => setOpen(false)} className="text-ink-500 hover:text-ink-900">
          <X className="h-4 w-4" />
        </button>
      </div>
      {state?.error && <p className="text-sm text-[#a35b36]">{state.error}</p>}

      <RecipeImportField
        onImported={(recipe) => {
          if (recipe.title && !title) setTitle(recipe.title);
          if (recipe.prepTimeMinutes && !prepTime) setPrepTime(String(recipe.prepTimeMinutes));
          if (recipe.ingredients.length > 0) setIngredients(recipe.ingredients.join("\n"));
          if (recipe.instructions.length > 0) setInstructions(recipe.instructions.join("\n"));
          setImageUrl(recipe.imageUrl ?? "");
          setSourceUrl(recipe.sourceUrl);
        }}
      />

      <input
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Bijv. Romige orzo"
        required
        className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
      />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input
          name="date"
          type="date"
          required
          defaultValue={defaultDate}
          className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400"
        />
        <input
          name="prepTime"
          type="number"
          min="0"
          value={prepTime}
          onChange={(e) => setPrepTime(e.target.value)}
          placeholder="Minuten"
          className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-ink-500">Ingrediënten (één per regel)</label>
        <textarea
          name="ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder={"500g aardappelen\n2 uien\n..."}
          rows={3}
          className="w-full resize-none rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-ink-500">Bereidingswijze (één stap per regel)</label>
        <textarea
          name="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder={"Schil de aardappelen.\nKook alles gaar.\n..."}
          rows={3}
          className="w-full resize-none rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400"
        />
      </div>
      <textarea
        name="notes"
        placeholder="Notities (optioneel)"
        rows={2}
        className="w-full resize-none rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400"
      />
      <label className="flex items-center gap-2 text-sm text-ink-700">
        <input type="checkbox" name="favorite" className="h-4 w-4 rounded border-sage-300" />
        Favoriet
      </label>
      <input type="hidden" name="imageUrl" value={imageUrl} />
      <input type="hidden" name="sourceUrl" value={sourceUrl} />
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
