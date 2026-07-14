"use client";

import { useTransition } from "react";
import { Gift } from "lucide-react";
import { toggleRewardsAction } from "@/lib/actions/rewards";

export function RewardsToggle({ enabled }: { enabled: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3 rounded-xl border border-sage-200 bg-white p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-peach-100 text-[#c17a52]">
        <Gift className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink-900">Beloningssysteem</p>
        <p className="text-xs text-ink-500">
          {enabled
            ? "Kinderen kunnen punten sparen en inwisselen in de winkel."
            : "Zet aan om punten en een beloningswinkel te gebruiken."}
        </p>
      </div>
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => void toggleRewardsAction(!enabled))}
        className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition disabled:opacity-60 ${
          enabled ? "border border-sage-200 text-ink-700 hover:bg-sage-100" : "bg-sage-600 text-white hover:bg-sage-700"
        }`}
      >
        {enabled ? "Uitzetten" : "Aanzetten"}
      </button>
    </div>
  );
}
