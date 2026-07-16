import { LogoMark } from "@/components/Logo";

const days = [
  { label: "Ma", date: "13", items: [{ text: "School", bg: "bg-sage-100" }, { text: "Boodschappen", bg: "bg-peach-100" }] },
  { label: "Di", date: "14", items: [{ text: "Projectoverleg", bg: "bg-peach-100" }, { text: "Zwemles", bg: "bg-[#f3e4ae]" }] },
  { label: "Wo", date: "15", items: [{ text: "Thuiswerken", bg: "bg-[#f3e4ae]" }, { text: "Speeltuin", bg: "bg-sage-100" }] },
  { label: "Do", date: "16", items: [{ text: "Opvang", bg: "bg-sage-100" }, { text: "Pasta avond", bg: "bg-peach-100" }] },
  { label: "Vr", date: "17", items: [{ text: "Vrije middag", bg: "bg-sage-100" }, { text: "Filmavond", bg: "bg-[#f3e4ae]" }] },
];

export function WeekPreview() {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-xl sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LogoMark className="h-5 w-5" />
          <span className="font-serif text-base font-bold text-ink-900">Deze week</span>
        </div>
        <span className="rounded-full bg-sage-600 px-3 py-1.5 text-[11px] font-semibold text-white">+ Toevoegen</span>
      </div>
      <div className="grid grid-cols-5 divide-x divide-sage-100 rounded-2xl border border-sage-100">
        {days.map((day) => (
          <div key={day.label} className="min-h-[120px] p-2">
            <p className="text-center text-[9px] font-semibold uppercase tracking-wide text-ink-400">{day.label}</p>
            <p className="text-center text-sm font-bold text-ink-900">{day.date}</p>
            <div className="mt-2 space-y-1">
              {day.items.map((item) => (
                <p
                  key={item.text}
                  className={`truncate rounded px-1.5 py-1 text-[9px] font-medium text-ink-900 ${item.bg}`}
                >
                  {item.text}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between rounded-xl bg-cream-100 px-3 py-2.5">
        <div>
          <p className="text-xs font-semibold text-ink-900">Gezinsmoment</p>
          <p className="text-[10px] text-ink-500">Zaterdag · Bioscoopje &amp; pannenkoeken</p>
        </div>
        <div className="flex -space-x-1.5">
          <span className="h-4 w-4 rounded-full border-2 border-white bg-sage-600" />
          <span className="h-4 w-4 rounded-full border-2 border-white bg-[#c17a52]" />
          <span className="h-4 w-4 rounded-full border-2 border-white bg-[#d8b34a]" />
        </div>
      </div>
    </div>
  );
}
