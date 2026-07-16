import { CheckCircle2, Bell, Check } from "lucide-react";
import { LogoMark } from "@/components/Logo";

const timeline = [
  { time: "08:30", title: "Opvang brengen", who: "Sev · De Kleine Beer", dot: "bg-sage-600" },
  { time: "13:00", title: "Projectoverleg", who: "Yordi · Teams", dot: "bg-[#c17a52]" },
  { time: "17:30", title: "Zwemles", who: "Sev · De Bonte Wever", dot: "bg-[#d8b34a]" },
];

export function DashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-xl select-none">
      <div className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-peach-100/60 blur-3xl" />

      <div className="rounded-[1.75rem] border-8 border-ink-900 bg-white shadow-2xl">
        <div className="rounded-[1.1rem] bg-cream-50 p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <LogoMark className="h-5 w-5" />
            <span className="font-serif text-sm font-bold text-ink-900">Planly</span>
          </div>

          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#c17a52]">Dinsdag 14 juli</p>
          <p className="font-serif text-lg font-bold text-ink-900">Goedemorgen, Yordi.</p>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 rounded-xl bg-white p-2.5 shadow-sm">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sage-100 text-sage-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[8px] font-semibold uppercase tracking-wide text-ink-500">Taken</p>
                <p className="truncate text-[11px] font-semibold text-ink-900">2 van 3 klaar</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white p-2.5 shadow-sm">
              <div className="flex h-7 shrink-0 items-center justify-center rounded-lg bg-peach-100 px-1.5 text-[9px] font-bold text-[#a35b36]">
                17:30
              </div>
              <div className="min-w-0">
                <p className="text-[8px] font-semibold uppercase tracking-wide text-ink-500">Volgende</p>
                <p className="truncate text-[11px] font-semibold text-ink-900">Zwemles</p>
              </div>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-[1.3fr_1fr] gap-2">
            <div className="rounded-xl bg-white p-3 shadow-sm">
              <p className="mb-2 text-[9px] font-semibold uppercase tracking-wide text-ink-500">Planning</p>
              <div className="space-y-2">
                {timeline.map((item) => (
                  <div key={item.time} className="flex items-center gap-2">
                    <span className="w-8 shrink-0 text-[9px] font-semibold text-ink-500">{item.time}</span>
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${item.dot}`} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[10px] font-semibold text-ink-900">{item.title}</p>
                      <p className="truncate text-[8px] text-ink-500">{item.who}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-xl bg-sage-700 p-3 text-white">
              <div>
                <p className="text-[8px] font-semibold uppercase tracking-wide text-white/70">Vanavond</p>
                <p className="mt-1 font-serif text-sm font-bold">Romige orzo</p>
                <p className="text-[8px] text-white/70">25 min</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -right-4 -top-6 hidden w-40 rounded-xl bg-white p-2.5 shadow-lg sm:flex sm:items-start sm:gap-2">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-peach-100 text-[#a35b36]">
          <Bell className="h-3 w-3" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-ink-900">Straks</p>
          <p className="truncate text-[9px] text-ink-500">Zwemles · 17:30</p>
        </div>
      </div>

      <div className="absolute -bottom-5 -left-4 hidden w-44 rounded-xl bg-white p-2.5 shadow-lg sm:flex sm:items-start sm:gap-2">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sage-600">
          <Check className="h-3 w-3" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-ink-900">Taak afgerond</p>
          <p className="truncate text-[9px] text-ink-500">+2 punten voor Sev</p>
        </div>
      </div>
    </div>
  );
}
