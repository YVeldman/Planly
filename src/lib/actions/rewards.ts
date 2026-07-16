"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export type ActionState = { error?: string } | undefined;

async function requireChildInFamily(childId: string, familyId: string) {
  const child = await prisma.user.findFirst({ where: { id: childId, familyId, isChild: true } });
  if (!child) throw new Error("Kind niet gevonden.");
  return child;
}

export async function toggleRewardsAction(enabled: boolean) {
  const user = await requireUser();
  await prisma.family.update({
    where: { id: user.familyId },
    data: { rewardsEnabled: enabled },
  });
  revalidatePath("/dashboard/rewards");
}

const rewardItemSchema = z.object({
  name: z.string().trim().min(1, "Geef de beloning een naam."),
  pointCost: z.coerce.number().int().min(1, "Kies een puntenprijs van minimaal 1."),
  emoji: z.string().trim().optional(),
});

export async function createRewardItemAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = rewardItemSchema.safeParse({
    name: formData.get("name"),
    pointCost: formData.get("pointCost"),
    emoji: formData.get("emoji") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ongeldige invoer." };
  }

  const { name, pointCost, emoji } = parsed.data;

  await prisma.rewardItem.create({
    data: { name, pointCost, emoji: emoji || null, familyId: user.familyId },
  });

  revalidatePath("/dashboard/rewards");
}

export async function deleteRewardItemAction(id: string) {
  const user = await requireUser();
  await prisma.rewardItem.deleteMany({ where: { id, familyId: user.familyId } });
  revalidatePath("/dashboard/rewards");
}

const awardSchema = z.object({
  childId: z.string().min(1),
  amount: z.coerce.number().int(),
  reason: z.string().trim().min(1, "Geef een reden op."),
});

export async function awardPointsAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = awardSchema.safeParse({
    childId: formData.get("childId"),
    amount: formData.get("amount"),
    reason: formData.get("reason"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ongeldige invoer." };
  }

  const { childId, amount, reason } = parsed.data;
  if (amount === 0) {
    return { error: "Vul een aantal punten in." };
  }

  try {
    await requireChildInFamily(childId, user.familyId);
  } catch {
    return { error: "Kind niet gevonden." };
  }

  await prisma.pointTransaction.create({
    data: { userId: childId, amount, reason },
  });

  revalidatePath("/dashboard/rewards");
}

export async function redeemRewardAction(childId: string, rewardItemId: string) {
  const user = await requireUser();

  const [child, item] = await Promise.all([
    prisma.user.findFirst({ where: { id: childId, familyId: user.familyId, isChild: true } }),
    prisma.rewardItem.findFirst({ where: { id: rewardItemId, familyId: user.familyId } }),
  ]);

  if (!child || !item) {
    return { error: "Kind of beloning niet gevonden." };
  }

  const balance = await getChildBalance(childId);
  if (balance < item.pointCost) {
    return { error: `${child.name} heeft niet genoeg punten voor ${item.name}.` };
  }

  await prisma.pointTransaction.create({
    data: {
      userId: childId,
      amount: -item.pointCost,
      reason: `Ingewisseld: ${item.name}`,
      rewardItemId: item.id,
    },
  });

  revalidatePath("/dashboard/rewards");
}

const allowanceSchema = z.object({
  childId: z.string().min(1),
  pointsPerWeek: z.string().optional(),
});

export async function setAllowanceAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = allowanceSchema.safeParse({
    childId: formData.get("childId"),
    pointsPerWeek: formData.get("pointsPerWeek") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ongeldige invoer." };
  }

  const { childId, pointsPerWeek } = parsed.data;

  try {
    await requireChildInFamily(childId, user.familyId);
  } catch {
    return { error: "Kind niet gevonden." };
  }

  const points = pointsPerWeek ? Number(pointsPerWeek) : null;

  if (points === null || points <= 0) {
    await prisma.user.update({
      where: { id: childId },
      data: { allowancePointsPerWeek: null, allowanceStartDate: null, allowanceLastAccruedAt: null },
    });
  } else {
    await prisma.user.update({
      where: { id: childId },
      data: {
        allowancePointsPerWeek: points,
        allowanceStartDate: new Date(),
        allowanceLastAccruedAt: new Date(),
      },
    });
  }

  revalidatePath("/dashboard/rewards");
}

export async function getChildBalance(childId: string) {
  const result = await prisma.pointTransaction.aggregate({
    where: { userId: childId },
    _sum: { amount: true },
  });
  return result._sum.amount ?? 0;
}
