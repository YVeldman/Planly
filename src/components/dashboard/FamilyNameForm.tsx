"use client";

import { useActionState } from "react";
import { updateFamilyNameAction } from "@/lib/actions/profile";

export function FamilyNameForm({ familyName }: { familyName: string }) {
  const [state, formAction, pending] = useActionState(updateFamilyNameAction, undefined);

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-sage-200 bg-white p-4">
      <p className="text-sm font-semibold text-ink-900">Gezinsnaam</p>
      {state?.error && <p className="text-sm text-[#a35b36]">{state.error}</p>}
      <div className="flex gap-2">
        <input
          name="familyName"
          defaultValue={familyName}
          required
          className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-lg bg-sage-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sage-700 disabled:opacity-60"
        >
          {pending ? "Bezig..." : "Opslaan"}
        </button>
      </div>
    </form>
  );
}
