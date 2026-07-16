import {
  BookOpen,
  Briefcase,
  HeartPulse,
  Users,
  Dumbbell,
  UtensilsCrossed,
  ShoppingCart,
  Circle,
  type LucideIcon,
} from "lucide-react";

export type CategoryKey =
  | "school"
  | "work"
  | "health"
  | "family"
  | "sport"
  | "meal"
  | "chore"
  | "other";

export const categories: Record<
  CategoryKey,
  { label: string; icon: LucideIcon; bg: string; fg: string; dot: string }
> = {
  school: { label: "School", icon: BookOpen, bg: "bg-[#e4dcf5]", fg: "text-[#7a63b0]", dot: "bg-[#7a63b0]" },
  work: { label: "Werk", icon: Briefcase, bg: "bg-sage-100", fg: "text-sage-600", dot: "bg-sage-600" },
  health: { label: "Gezondheid", icon: HeartPulse, bg: "bg-peach-100", fg: "text-[#c17a52]", dot: "bg-[#c17a52]" },
  family: { label: "Familie", icon: Users, bg: "bg-peach-100", fg: "text-[#c17a52]", dot: "bg-[#c17a52]" },
  sport: { label: "Sport", icon: Dumbbell, bg: "bg-sage-100", fg: "text-sage-600", dot: "bg-sage-600" },
  meal: { label: "Eten", icon: UtensilsCrossed, bg: "bg-peach-100", fg: "text-[#c17a52]", dot: "bg-[#c17a52]" },
  chore: { label: "Klusje", icon: ShoppingCart, bg: "bg-cream-200", fg: "text-[#8a7255]", dot: "bg-[#8a7255]" },
  other: { label: "Overig", icon: Circle, bg: "bg-sage-100", fg: "text-sage-600", dot: "bg-sage-600" },
};

export function getCategory(key: string) {
  return categories[key as CategoryKey] ?? categories.other;
}

export const categoryOptions = Object.entries(categories).map(([value, meta]) => ({
  value,
  label: meta.label,
}));

export const memberColors = [
  "#6b8a5c",
  "#a7b89a",
  "#e9c5b2",
  "#ddab8f",
  "#7a63b0",
  "#5e6b5e",
  "#c17a52",
  "#8a7255",
];
