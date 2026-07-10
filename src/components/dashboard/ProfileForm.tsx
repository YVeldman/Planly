"use client";

import { useActionState, useState } from "react";
import { updateProfileAction } from "@/lib/actions/profile";
import { memberColors } from "@/lib/categories";

type Me = { name: string; color: string };

export function ProfileForm({ me }: { me: Me }) {
  const [color, setColor] = useState(me.color);
  const [state, formAction, pending] = useActionState(updateProfileAction, undefined);

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-sage-200 bg-white p-4">
      <p className="text-sm font-semibold text-ink-900">Mijn profiel</p>
      {state?.error && <p className="text-sm text-[#a35b36]">{state.error}</p>}
      <input
        name="name"
        defaultValue={me.name}
        required
        className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
      />
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
        className="rounded-lg bg-sage-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sage-700 disabled:opacity-60"
      >
        {pending ? "Bezig..." : "Opslaan"}
      </button>
    </form>
  );
}
