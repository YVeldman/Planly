"use client";

import { useActionState, useRef } from "react";
import { createGroceryItemAction } from "@/lib/actions/groceries";

export function AddGroceryForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(async (prevState: unknown, formData: FormData) => {
    const result = await createGroceryItemAction(prevState as never, formData);
    if (!result?.error) formRef.current?.reset();
    return result;
  }, undefined);

  return (
    <form ref={formRef} action={formAction} className="space-y-2">
      {state?.error && <p className="text-sm text-[#a35b36]">{state.error}</p>}
      <div className="flex gap-2 rounded-xl bg-white p-2 shadow-sm">
        <input
          name="name"
          placeholder="Wat moet er mee?"
          required
          autoFocus
          className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-lg bg-sage-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sage-700 disabled:opacity-60"
        >
          {pending ? "..." : "Toevoegen"}
        </button>
      </div>
    </form>
  );
}
