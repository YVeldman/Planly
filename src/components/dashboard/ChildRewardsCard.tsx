"use client";

import { useActionState, useState } from "react";
import { Coins } from "lucide-react";
import { awardPointsAction, setAllowanceAction } from "@/lib/actions/rewards";

type Child = {
  id: string;
  name: string;
  color: string;
  allowancePointsPerWeek: number | null;
};

export function ChildRewardsCard({ child, balance }: { child: Child; balance: number }) {
  const [showAward, setShowAward] = useState(false);
  const [showAllowance, setShowAllowance] = useState(false);

  return (
    <div className="rounded-xl border border-sage-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: child.color }}
        >
          {child.name[0]?.toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink-900">{child.name}</p>
          <p className="flex items-center gap-1 text-xs text-ink-500">
            <Coins className="h-3 w-3" /> {balance} punten
            {child.allowancePointsPerWeek ? ` · ${child.allowancePointsPerWeek}/week` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowAward((v) => !v);
            setShowAllowance(false);
          }}
          className="shrink-0 rounded-full border border-sage-200 px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-sage-100"
        >
          Punten toekennen
        </button>
        <button
          type="button"
          onClick={() => {
            setShowAllowance((v) => !v);
            setShowAward(false);
          }}
          className="shrink-0 rounded-full border border-sage-200 px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-sage-100"
        >
          Zakgeld
        </button>
      </div>

      {showAward && <AwardPointsForm childId={child.id} onDone={() => setShowAward(false)} />}
      {showAllowance && (
        <AllowanceForm
          childId={child.id}
          pointsPerWeek={child.allowancePointsPerWeek}
          onDone={() => setShowAllowance(false)}
        />
      )}
    </div>
  );
}

function AwardPointsForm({ childId, onDone }: { childId: string; onDone: () => void }) {
  const [state, formAction, pending] = useActionState(async (prevState: unknown, formData: FormData) => {
    const result = await awardPointsAction(prevState as never, formData);
    if (!result?.error) onDone();
    return result;
  }, undefined);

  return (
    <form action={formAction} className="mt-3 space-y-2 border-t border-sage-100 pt-3">
      <input type="hidden" name="childId" value={childId} />
      {state?.error && <p className="text-sm text-[#a35b36]">{state.error}</p>}
      <div>
        <input
          name="amount"
          type="number"
          defaultValue={10}
          required
          className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400"
        />
        <p className="mt-1 text-[11px] text-ink-400">Gebruik een negatief getal om punten af te trekken.</p>
      </div>
      <input
        name="reason"
        placeholder="Reden (bijv. kamer opgeruimd)"
        required
        className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400"
      />
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-sage-600 py-2 text-sm font-semibold text-white transition hover:bg-sage-700 disabled:opacity-60"
      >
        {pending ? "Bezig..." : "Toekennen"}
      </button>
    </form>
  );
}

function AllowanceForm({
  childId,
  pointsPerWeek,
  onDone,
}: {
  childId: string;
  pointsPerWeek: number | null;
  onDone: () => void;
}) {
  const [state, formAction, pending] = useActionState(async (prevState: unknown, formData: FormData) => {
    const result = await setAllowanceAction(prevState as never, formData);
    if (!result?.error) onDone();
    return result;
  }, undefined);

  return (
    <form action={formAction} className="mt-3 space-y-2 border-t border-sage-100 pt-3">
      <input type="hidden" name="childId" value={childId} />
      {state?.error && <p className="text-sm text-[#a35b36]">{state.error}</p>}
      <p className="text-xs text-ink-500">
        Wekelijks vast aantal punten (bijv. zakgeld). Laat leeg om uit te zetten.
      </p>
      <div className="flex gap-2">
        <input
          name="pointsPerWeek"
          type="number"
          min="0"
          defaultValue={pointsPerWeek ?? ""}
          placeholder="Punten per week"
          className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-lg bg-sage-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sage-700 disabled:opacity-60"
        >
          {pending ? "..." : "Opslaan"}
        </button>
      </div>
    </form>
  );
}
