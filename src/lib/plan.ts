export type Plan = "free" | "premium";

export function isPremium(plan: string): boolean {
  return plan === "premium";
}
