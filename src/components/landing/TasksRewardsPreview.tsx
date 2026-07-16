import { Star } from "lucide-react";

export function TasksRewardsPreview() {
  return (
    <div className="relative mx-auto w-full max-w-sm py-6">
      <div className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-sage-200/40 blur-3xl" />

      {/* Back phone: tasks list */}
      <div className="mx-auto w-56 rounded-[2rem] border-8 border-ink-900 bg-white p-3 shadow-xl">
        <p className="text-[9px] font-semibold uppercase tracking-wide text-ink-400">Dinsdag</p>
        <div className="flex items-center justify-between">
          <p className="font-serif text-base font-bold text-ink-900">Mijn taken</p>
          <span className="flex items-center gap-0.5 text-xs font-bold text-[#c17a52]">
            6 <Star className="h-3 w-3 fill-current" />
          </span>
        </div>
        <p className="mt-1 text-[9px] text-ink-500">2 van 3 klaar — lekker bezig!</p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-sage-100">
          <div className="h-full w-2/3 rounded-full bg-sage-600" />
        </div>
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 rounded-lg bg-sage-50 p-2">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-sage-600 text-white">
              <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none">
                <path d="M2 6l2.5 2.5L10 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-medium text-ink-500 line-through">Speelgoed opruimen</p>
              <p className="text-[8px] text-ink-400">+2 punten</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg p-2">
            <span className="h-4 w-4 shrink-0 rounded border-2 border-sage-300" />
            <div className="min-w-0">
              <p className="truncate text-[10px] font-medium text-ink-900">Tafel dekken</p>
              <p className="text-[8px] text-ink-400">+1 punt</p>
            </div>
          </div>
        </div>
        <div className="mt-3 rounded-lg bg-peach-100 p-2">
          <p className="text-[8px] font-semibold uppercase tracking-wide text-[#a35b36]">Bijna verdiend</p>
          <p className="text-[10px] font-semibold text-ink-900">Samen ijsje halen</p>
          <p className="text-[8px] text-ink-500">6 van 8 punten</p>
        </div>
      </div>

      {/* Front phone: celebration */}
      <div className="absolute -right-2 bottom-0 w-40 rounded-[1.75rem] border-8 border-ink-900 bg-sage-700 p-4 text-center text-white shadow-2xl">
        <div className="flex justify-center gap-1 text-[#f3e4ae]">
          <Star className="h-3 w-3 fill-current" />
          <Star className="h-3 w-3 fill-current" />
          <Star className="h-3 w-3 fill-current" />
        </div>
        <p className="mt-2 font-serif text-sm font-bold">Goed gedaan!</p>
        <p className="mt-1 text-[9px] text-white/70">Weer een stapje dichter bij je beloning.</p>
        <div className="mx-auto mt-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
          <Star className="h-6 w-6 fill-[#f3e4ae] text-[#f3e4ae]" />
        </div>
      </div>
    </div>
  );
}
