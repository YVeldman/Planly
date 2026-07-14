import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { accrueAllowances } from "@/lib/allowance";
import { RewardsToggle } from "@/components/dashboard/RewardsToggle";
import { ChildRewardsCard } from "@/components/dashboard/ChildRewardsCard";
import { RewardShop } from "@/components/dashboard/RewardShop";

export default async function RewardsPage() {
  const user = await requireUser();

  const family = await prisma.family.findUnique({ where: { id: user.familyId } });
  if (!family) return null;

  if (family.rewardsEnabled) {
    await accrueAllowances(user.familyId);
  }

  const [children, rewardItems] = await Promise.all([
    prisma.user.findMany({
      where: { familyId: user.familyId, isChild: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.rewardItem.findMany({
      where: { familyId: user.familyId },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const balances = await Promise.all(
    children.map(async (child) => {
      const result = await prisma.pointTransaction.aggregate({
        where: { userId: child.id },
        _sum: { amount: true },
      });
      return { childId: child.id, balance: result._sum.amount ?? 0 };
    })
  );
  const balanceByChild = new Map(balances.map((b) => [b.childId, b.balance]));

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-ink-900">Beloningen</h1>
        <p className="mt-1 text-sm text-ink-500">
          Ken punten toe voor goed gedrag of klusjes, en laat kinderen ze inwisselen in de winkel.
        </p>
      </div>

      <RewardsToggle enabled={family.rewardsEnabled} />

      {family.rewardsEnabled && (
        <>
          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500">Kinderen</h2>
            {children.length === 0 && (
              <p className="rounded-xl bg-white px-4 py-6 text-center text-sm text-ink-500 shadow-sm">
                Nog geen kindprofielen. Voeg er een toe via Instellingen → Gezinslid toevoegen.
              </p>
            )}
            {children.map((child) => (
              <ChildRewardsCard
                key={child.id}
                child={child}
                balance={balanceByChild.get(child.id) ?? 0}
              />
            ))}
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500">Winkel</h2>
            <RewardShop
              items={rewardItems}
              kids={children.map((c) => ({ id: c.id, name: c.name }))}
            />
          </section>
        </>
      )}
    </div>
  );
}
