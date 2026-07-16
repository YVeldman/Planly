"use client";

import { useActionState, useState, useTransition } from "react";
import { Check, Plus, Trash2, X } from "lucide-react";
import { createRewardItemAction, deleteRewardItemAction, redeemRewardAction } from "@/lib/actions/rewards";

type Child = { id: string; name: string };
type RewardItem = { id: string; name: string; pointCost: number; emoji: string | null };

export function RewardShop({
  items,
  kids,
  redeemedKeys,
}: {
  items: RewardItem[];
  kids: Child[];
  redeemedKeys: string[];
}) {
  const redeemedSet = new Set(redeemedKeys);

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="rounded-xl bg-white px-4 py-6 text-center text-sm text-ink-500 shadow-sm">
          Nog niks in de winkel. Voeg een beloning toe.
        </p>
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <RewardItemCard key={item.id} item={item} kids={kids} redeemedSet={redeemedSet} />
        ))}
      </div>
      <AddRewardItemForm />
    </div>
  );
}

function RewardItemCard({
  item,
  kids,
  redeemedSet,
}: {
  item: RewardItem;
  kids: Child[];
  redeemedSet: Set<string>;
}) {
  const [isPending, startTransition] = useTransition();
  const [childId, setChildId] = useState(kids[0]?.id ?? "");
  const [error, setError] = useState<string | null>(null);

  const selectedChild = kids.find((c) => c.id === childId);
  const alreadyRedeemed = childId ? redeemedSet.has(`${childId}:${item.id}`) : false;

  return (
    <div className="flex flex-col rounded-xl border border-sage-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-peach-100 text-lg">
          {item.emoji || "🎁"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink-900">{item.name}</p>
          <p className="text-xs text-ink-500">{item.pointCost} punten</p>
        </div>
        <button
          type="button"
          disabled={isPending}
          onClick={() => startTransition(() => void deleteRewardItemAction(item.id))}
          className="shrink-0 rounded-lg p-1.5 text-ink-400 transition hover:bg-peach-100 hover:text-[#a35b36]"
          aria-label={`Verwijder ${item.name}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      {kids.length > 0 && (
        <div className="mt-3 space-y-2 border-t border-sage-100 pt-3">
          <select
            value={childId}
            onChange={(e) => setChildId(e.target.value)}
            className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400"
          >
            {kids.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {alreadyRedeemed && (
            <p className="flex items-center gap-1.5 text-xs font-medium text-sage-600">
              <Check className="h-3.5 w-3.5" /> Al ingewisseld voor {selectedChild?.name}
            </p>
          )}
          <button
            type="button"
            disabled={isPending || !childId}
            onClick={() =>
              startTransition(async () => {
                setError(null);
                const result = await redeemRewardAction(childId, item.id);
                if (result?.error) setError(result.error);
              })
            }
            className="w-full rounded-lg bg-sage-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sage-700 disabled:opacity-60"
          >
            {alreadyRedeemed ? "Nog een keer inwisselen" : "Wissel in"}
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-xs text-[#a35b36]">{error}</p>}
    </div>
  );
}

function AddRewardItemForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(async (prevState: unknown, formData: FormData) => {
    const result = await createRewardItemAction(prevState as never, formData);
    if (!result?.error) setOpen(false);
    return result;
  }, undefined);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-sage-300 py-2.5 text-sm font-medium text-sage-600 transition hover:bg-sage-50"
      >
        <Plus className="h-4 w-4" /> Beloning toevoegen
      </button>
    );
  }

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-sage-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink-900">Nieuwe beloning</p>
        <button type="button" onClick={() => setOpen(false)} className="text-ink-500 hover:text-ink-900">
          <X className="h-4 w-4" />
        </button>
      </div>
      {state?.error && <p className="text-sm text-[#a35b36]">{state.error}</p>}
      <div className="flex gap-2">
        <input
          name="emoji"
          placeholder="🎁"
          maxLength={4}
          className="w-16 rounded-lg border border-sage-200 px-3 py-2 text-center text-sm outline-none focus:border-sage-400"
        />
        <input
          name="name"
          placeholder="Bijv. Extra half uur schermtijd"
          required
          autoFocus
          className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
        />
      </div>
      <input
        name="pointCost"
        type="number"
        min="1"
        placeholder="Puntenprijs"
        required
        className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400"
      />
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
