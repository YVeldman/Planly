"use client";

import { useActionState } from "react";
import { resendVerificationAction } from "@/lib/actions/auth";

export function ResendVerificationForm({ email }: { email?: string }) {
  const [state, formAction, pending] = useActionState(resendVerificationAction, undefined);

  if (state?.success) {
    return (
      <p className="rounded-lg bg-sage-100 px-4 py-2.5 text-sm text-sage-700">
        Nieuwe bevestigingsmail verstuurd naar {state.email}.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      {state?.error && (
        <p className="rounded-lg bg-peach-100 px-4 py-2.5 text-sm text-[#a35b36]">{state.error}</p>
      )}
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          name="email"
          type="email"
          defaultValue={email}
          placeholder="jij@voorbeeld.nl"
          required
          className="w-full rounded-xl border border-sage-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-xl bg-sage-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-700 disabled:opacity-60"
        >
          {pending ? "Bezig..." : "Opnieuw versturen"}
        </button>
      </div>
    </form>
  );
}
