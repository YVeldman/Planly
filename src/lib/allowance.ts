import { prisma } from "@/lib/prisma";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Grants any weekly allowance points a child has accrued since we last
 * checked, computed from elapsed whole weeks rather than a scheduled job.
 * Safe to call on every Beloningen page load.
 */
export async function accrueAllowances(familyId: string) {
  const children = await prisma.user.findMany({
    where: {
      familyId,
      isChild: true,
      allowancePointsPerWeek: { not: null },
      allowanceStartDate: { not: null },
    },
  });

  const now = Date.now();

  for (const child of children) {
    if (!child.allowancePointsPerWeek || !child.allowanceStartDate) continue;

    const since = child.allowanceLastAccruedAt ?? child.allowanceStartDate;
    const elapsedWeeks = Math.floor((now - since.getTime()) / WEEK_MS);
    if (elapsedWeeks <= 0) continue;

    await prisma.$transaction([
      prisma.pointTransaction.create({
        data: {
          userId: child.id,
          amount: child.allowancePointsPerWeek * elapsedWeeks,
          reason:
            elapsedWeeks === 1
              ? "Wekelijks zakgeld"
              : `Wekelijks zakgeld (${elapsedWeeks} weken)`,
        },
      }),
      prisma.user.update({
        where: { id: child.id },
        data: { allowanceLastAccruedAt: new Date(since.getTime() + elapsedWeeks * WEEK_MS) },
      }),
    ]);
  }
}
