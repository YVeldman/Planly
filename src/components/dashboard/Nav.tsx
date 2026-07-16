"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarDays, CheckCircle2, UtensilsCrossed, Heart, ShoppingCart, Gift, Contact, Settings } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/calendar", label: "Agenda", icon: CalendarDays },
  { href: "/dashboard/meals", label: "Maaltijden", icon: UtensilsCrossed },
  { href: "/dashboard/recipes", label: "Mijn recepten", icon: Heart },
  { href: "/dashboard/groceries", label: "Boodschappen", icon: ShoppingCart },
  { href: "/dashboard/tasks", label: "Taken", icon: CheckCircle2 },
  { href: "/dashboard/rewards", label: "Beloningen", icon: Gift },
  { href: "/dashboard/contacts", label: "Contacten", icon: Contact },
  { href: "/dashboard/settings", label: "Instellingen", icon: Settings },
];

export function DashboardNavDesktop() {
  const pathname = usePathname();

  return (
    <nav className="hidden w-56 shrink-0 flex-col gap-1 border-r border-sage-200 bg-cream-50 p-4 md:flex">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              active
                ? "bg-sage-600 text-white shadow-sm"
                : "text-ink-700 hover:bg-sage-100"
            }`}
          >
            <item.icon className="h-4.5 w-4.5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardNavMobile() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-1 overflow-x-auto border-t border-sage-200 bg-white/95 px-2 py-2 backdrop-blur md:hidden">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex shrink-0 flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-medium ${
              active ? "text-sage-600" : "text-ink-500"
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
