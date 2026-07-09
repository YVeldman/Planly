"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/lib/actions/auth";

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="callbackUrl" value={callbackUrl ?? "/dashboard"} />
      {state?.error && (
        <p className="rounded-lg bg-peach-100 px-4 py-2.5 text-sm text-[#a35b36]">
          {state.error}
        </p>
      )}
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink-900">
          E-mailadres
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="jij@voorbeeld.nl"
          required
          className="w-full rounded-xl border border-sage-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink-900">
          Wachtwoord
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          className="w-full rounded-xl border border-sage-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-sage-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sage-700 disabled:opacity-60"
      >
        {pending ? "Bezig..." : "Inloggen"}
      </button>
      <p className="text-center text-sm text-ink-500">
        Nog geen account?{" "}
        <Link href="/signup" className="font-medium text-sage-600 hover:underline">
          Maak er een aan
        </Link>
      </p>
    </form>
  );
}
