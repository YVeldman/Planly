"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { zonedMidnight } from "@/lib/timezone";

const mealSchema = z.object({
  title: z.string().trim().min(1, "Geef de maaltijd een naam."),
  date: z.string().min(1, "Kies een dag."),
  prepTime: z.string().optional(),
  notes: z.string().trim().optional(),
  favorite: z.string().optional(),
});

export type ActionState = { error?: string } | undefined;

export async function createMealAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = mealSchema.safeParse({
    title: formData.get("title"),
    date: formData.get("date"),
    prepTime: formData.get("prepTime") || undefined,
    notes: formData.get("notes") || undefined,
    favorite: formData.get("favorite") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ongeldige invoer." };
  }

  const { title, date, prepTime, notes, favorite } = parsed.data;

  await prisma.meal.create({
    data: {
      title,
      date: zonedMidnight(date),
      prepTime: prepTime ? Number(prepTime) : null,
      notes: notes || null,
      favorite: favorite === "on",
      familyId: user.familyId,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/meals");
}

export async function updateMealAction(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = mealSchema.safeParse({
    title: formData.get("title"),
    date: formData.get("date"),
    prepTime: formData.get("prepTime") || undefined,
    notes: formData.get("notes") || undefined,
    favorite: formData.get("favorite") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ongeldige invoer." };
  }

  const { title, date, prepTime, notes, favorite } = parsed.data;

  await prisma.meal.updateMany({
    where: { id, familyId: user.familyId },
    data: {
      title,
      date: zonedMidnight(date),
      prepTime: prepTime ? Number(prepTime) : null,
      notes: notes || null,
      favorite: favorite === "on",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/meals");
}

export async function deleteMealAction(id: string) {
  const user = await requireUser();
  await prisma.meal.deleteMany({ where: { id, familyId: user.familyId } });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/meals");
}
