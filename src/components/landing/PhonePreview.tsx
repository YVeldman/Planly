import { BookOpen, Briefcase, Heart, UtensilsCrossed, Dumbbell } from "lucide-react";

const agenda = [
  { time: "08:30", title: "School brengen", who: "Sophie", icon: BookOpen, bg: "bg-[#e4dcf5]", fg: "text-[#7a63b0]" },
  { time: "10:00", title: "Teamoverleg", who: "Werk", icon: Briefcase, bg: "bg-sage-100", fg: "text-sage-600" },
  { time: "12:30", title: "Lunch met oma", who: "Familie", icon: Heart, bg: "bg-peach-100", fg: "text-[#c17a52]" },
  { time: "16:00", title: "Voetbaltraining", who: "Noah", icon: Dumbbell, bg: "bg-sage-100", fg: "text-sage-600" },
  { time: "18:30", title: "Etenstijd", who: "Gezin", icon: UtensilsCrossed, bg: "bg-peach-100", fg: "text-[#c17a52]" },
];

const avatars = [
  { name: "Emma", color: "#a7b89a" },
  { name: "Mark", color: "#e9c5b2" },
  { name: "Sophie", color: "#cfd9c6" },
  { name: "Noah", color: "#ddab8f" },
];

export function PhonePreview() {
  return (
    <div className="relative mx-auto w-full max-w-[320px] select-none">
      <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-sage-300/30 blur-3xl" />
      <div className="rounded-[2.5rem] border-8 border-ink-900 bg-white shadow-2xl">
        <div className="rounded-[2rem] bg-cream-50 px-5 pb-5 pt-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-ink-500">Goedemorgen, Emma ☀️</p>
              <p className="text-sm font-semibold text-ink-900">Maandag 13 mei</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-sage-100" />
          </div>

          <div className="mb-4 flex gap-2">
            {avatars.map((a) => (
              <div key={a.name} className="flex flex-col items-center gap-1">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: a.color }}
                >
                  {a.name[0]}
                </div>
                <span className="text-[9px] text-ink-500">{a.name}</span>
              </div>
            ))}
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-dashed border-sage-300 text-sage-500">
              +
            </div>
          </div>

          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-ink-900">Vandaag</p>
            <p className="text-[11px] text-sage-600">Alles bekijken</p>
          </div>

          <div className="space-y-2">
            {agenda.map((item) => (
              <div
                key={item.time}
                className="flex items-center gap-3 rounded-xl bg-white p-2.5 shadow-sm"
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.bg} ${item.fg}`}>
                  <item.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-ink-900">{item.title}</p>
                  <p className="text-[10px] text-ink-500">{item.who}</p>
                </div>
                <span className="shrink-0 text-[10px] text-ink-500">{item.time}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-around rounded-2xl bg-white py-2.5 shadow-sm">
            <div className="h-2 w-2 rounded-full bg-sage-500" />
            <div className="h-2 w-2 rounded-full bg-sage-200" />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-600 text-white">+</div>
            <div className="h-2 w-2 rounded-full bg-sage-200" />
            <div className="h-2 w-2 rounded-full bg-sage-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
