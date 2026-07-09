"use client";

import { useActionState, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { addFamilyMemberAction } from "@/lib/actions/family";
import { memberColors } from "@/lib/categories";

export function AddMemberForm() {
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState(memberColors[0]);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(async (prevState: unknown, formData: FormData) => {
    const result = await addFamilyMemberAction(prevState as never, formData);
    if (!result?.error) {
      formRef.current?.reset();
      setColor(memberColors[0]);
      setOpen(false);
    }
    return result;
  }, undefined);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-sage-300 py-3 text-sm font-medium text-sage-600 transition hover:bg-sage-50"
      >
        <Plus className="h-4 w-4" /> Gezinslid toevoegen
      </button>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-3 rounded-xl border border-sage-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink-900">Nieuw gezinslid</p>
        <button type="button" onClick={() => setOpen(false)} className="text-ink-500 hover:text-ink-900">
          <X className="h-4 w-4" />
        </button>
      </div>
      {state?.error && <p className="text-sm text-[#a35b36]">{state.error}</p>}
      <input
        name="name"
        placeholder="Naam"
        required
        autoFocus
        className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
      />
      <input
        name="email"
        type="email"
        placeholder="E-mailadres"
        required
        className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
      />
      <input
        name="password"
        type="password"
        placeholder="Tijdelijk wachtwoord (min. 8 tekens)"
        required
        minLength={8}
        className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
      />
      <p className="text-xs text-ink-500">
        We sturen een bevestigingsmail naar dit adres. Pas na bevestigen kan dit gezinslid inloggen.
      </p>
      <div>
        <p className="mb-1.5 text-xs font-medium text-ink-700">Kleur</p>
        <input type="hidden" name="color" value={color} />
        <div className="flex flex-wrap gap-2">
          {memberColors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`h-7 w-7 rounded-full transition ${
                color === c ? "ring-2 ring-offset-2 ring-sage-500" : ""
              }`}
              style={{ backgroundColor: c }}
              aria-label={`Kies kleur ${c}`}
            />
          ))}
        </div>
      </div>
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
