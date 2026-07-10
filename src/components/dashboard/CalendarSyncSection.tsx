"use client";

import { useActionState, useState, useTransition } from "react";
import { Check, Copy, Plus, RefreshCw, Trash2, X } from "lucide-react";
import {
  addExternalFeedAction,
  deleteExternalFeedAction,
  regenerateIcsTokenAction,
  syncExternalFeedAction,
} from "@/lib/actions/calendarSync";

type Feed = {
  id: string;
  name: string;
  url: string;
  lastSyncedAt: Date | null;
  lastError: string | null;
};

export function CalendarSyncSection({ icsToken, feeds }: { icsToken: string; feeds: Feed[] }) {
  const [copied, setCopied] = useState(false);
  const [regenPending, startRegen] = useTransition();

  const feedUrl =
    typeof window !== "undefined" ? `${window.location.origin}/api/calendar/${icsToken}` : `/api/calendar/${icsToken}`;

  async function copyLink() {
    await navigator.clipboard.writeText(feedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-sage-200 bg-white p-4">
        <p className="text-sm font-semibold text-ink-900">Bekijk Planly in Apple of Google Agenda</p>
        <p className="mt-1 text-xs text-ink-500">
          Voeg deze link toe als agenda-abonnement in Apple Agenda of Google Agenda om alle Planly-afspraken
          daar te zien.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <input
            readOnly
            value={feedUrl}
            onFocus={(e) => e.currentTarget.select()}
            className="w-full truncate rounded-lg border border-sage-200 bg-cream-50 px-3 py-2 text-xs text-ink-700 outline-none"
          />
          <button
            type="button"
            onClick={copyLink}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-sage-200 px-3 py-2 text-xs font-medium text-ink-700 hover:bg-sage-100"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Gekopieerd" : "Kopieer"}
          </button>
        </div>
        <button
          type="button"
          disabled={regenPending}
          onClick={() =>
            startRegen(() => {
              void regenerateIcsTokenAction();
            })
          }
          className="mt-2 text-xs font-medium text-ink-500 hover:text-[#a35b36] hover:underline disabled:opacity-60"
        >
          Link verlopen? Genereer een nieuwe
        </button>
      </div>

      <div className="rounded-xl border border-sage-200 bg-white p-4">
        <p className="text-sm font-semibold text-ink-900">Agenda&apos;s importeren</p>
        <p className="mt-1 text-xs text-ink-500">
          Voeg de geheime iCal-link van je Apple- of Google Agenda toe om die afspraken in Planly te zien.
        </p>

        <div className="mt-3 space-y-2">
          {feeds.map((feed) => (
            <FeedRow key={feed.id} feed={feed} />
          ))}
        </div>

        <div className="mt-3">
          <AddFeedForm />
        </div>
      </div>
    </div>
  );
}

function FeedRow({ feed }: { feed: Feed }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3 rounded-lg border border-sage-200 p-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink-900">{feed.name}</p>
        <p className="truncate text-xs text-ink-400">{feed.url}</p>
        {feed.lastError ? (
          <p className="mt-0.5 text-xs text-[#a35b36]">{feed.lastError}</p>
        ) : feed.lastSyncedAt ? (
          <p className="mt-0.5 text-xs text-ink-400">
            Laatst gesynchroniseerd: {new Date(feed.lastSyncedAt).toLocaleString("nl-NL")}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(() => {
            void syncExternalFeedAction(feed.id);
          })
        }
        className="shrink-0 rounded-lg p-2 text-ink-500 transition hover:bg-sage-100"
        aria-label={`Synchroniseer ${feed.name}`}
      >
        <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(() => {
            void deleteExternalFeedAction(feed.id);
          })
        }
        className="shrink-0 rounded-lg p-2 text-ink-400 transition hover:bg-peach-100 hover:text-[#a35b36]"
        aria-label={`Verwijder ${feed.name}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function AddFeedForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(async (prevState: unknown, formData: FormData) => {
    const result = await addExternalFeedAction(prevState as never, formData);
    if (!result?.error) {
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
        <Plus className="h-4 w-4" /> Agenda koppelen
      </button>
    );
  }

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-sage-200 bg-cream-50 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink-900">Agenda koppelen</p>
        <button type="button" onClick={() => setOpen(false)} className="text-ink-500 hover:text-ink-900">
          <X className="h-4 w-4" />
        </button>
      </div>
      {state?.error && <p className="text-sm text-[#a35b36]">{state.error}</p>}
      <input
        name="name"
        placeholder="Naam (bijv. Werk van Emma)"
        required
        className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
      />
      <input
        name="url"
        type="url"
        placeholder="https:// of webcal:// iCal-link"
        required
        className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
      />
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-sage-600 py-2 text-sm font-semibold text-white transition hover:bg-sage-700 disabled:opacity-60"
      >
        {pending ? "Koppelen..." : "Koppelen"}
      </button>
    </form>
  );
}
