"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signupAction } from "@/lib/actions/auth";

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signupAction, undefined);

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <p className="rounded-lg bg-peach-100 px-4 py-2.5 text-sm text-[#a35b36]">
          {state.error}
        </p>
      )}
      <div>
        <label htmlFor="familyName" className="mb-1.5 block text-sm font-medium text-ink-900">
          Naam van jullie gezin
        </label>
        <input
          id="familyName"
          name="familyName"
          type="text"
          placeholder="Bijv. Familie de Vries"
          required
          className="w-full rounded-xl border border-sage-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
        />
      </div>
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink-900">
          Jouw naam
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Emma"
          required
          className="w-full rounded-xl border border-sage-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
        />
      </div>
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
          placeholder="Minimaal 8 tekens"
          required
          minLength={8}
          className="w-full rounded-xl border border-sage-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-sage-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sage-700 disabled:opacity-60"
      >
        {pending ? "Bezig..." : "Account aanmaken"}
      </button>
      <p className="text-center text-sm text-ink-500">
        Heb je al een account?{" "}
        <Link href="/login" className="font-medium text-sage-600 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
