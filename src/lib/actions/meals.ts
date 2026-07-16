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
  ingredients: z.string().optional(),
  instructions: z.string().optional(),
  imageUrl: z.string().trim().optional(),
  sourceUrl: z.string().trim().optional(),
});

function linesToList(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

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
    ingredients: formData.get("ingredients") || undefined,
    instructions: formData.get("instructions") || undefined,
    imageUrl: formData.get("imageUrl") || undefined,
    sourceUrl: formData.get("sourceUrl") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ongeldige invoer." };
  }

  const { title, date, prepTime, notes, favorite, ingredients, instructions, imageUrl, sourceUrl } = parsed.data;

  await prisma.meal.create({
    data: {
      title,
      date: zonedMidnight(date),
      prepTime: prepTime ? Number(prepTime) : null,
      notes: notes || null,
      favorite: favorite === "on",
      ingredients: linesToList(ingredients),
      instructions: linesToList(instructions),
      imageUrl: imageUrl || null,
      sourceUrl: sourceUrl || null,
      familyId: user.familyId,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/meals");
  revalidatePath("/dashboard/recipes");
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
    ingredients: formData.get("ingredients") || undefined,
    instructions: formData.get("instructions") || undefined,
    imageUrl: formData.get("imageUrl") || undefined,
    sourceUrl: formData.get("sourceUrl") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ongeldige invoer." };
  }

  const { title, date, prepTime, notes, favorite, ingredients, instructions, imageUrl, sourceUrl } = parsed.data;

  await prisma.meal.updateMany({
    where: { id, familyId: user.familyId },
    data: {
      title,
      date: zonedMidnight(date),
      prepTime: prepTime ? Number(prepTime) : null,
      notes: notes || null,
      favorite: favorite === "on",
      ingredients: linesToList(ingredients),
      instructions: linesToList(instructions),
      imageUrl: imageUrl || null,
      sourceUrl: sourceUrl || null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/meals");
  revalidatePath("/dashboard/recipes");
}

export async function deleteMealAction(id: string) {
  const user = await requireUser();
  await prisma.meal.deleteMany({ where: { id, familyId: user.familyId } });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/meals");
  revalidatePath("/dashboard/recipes");
}

export async function unfavoriteMealAction(title: string) {
  const user = await requireUser();
  await prisma.meal.updateMany({
    where: { title, familyId: user.familyId, favorite: true },
    data: { favorite: false },
  });
  revalidatePath("/dashboard/recipes");
  revalidatePath("/dashboard/meals");
}

const addToDaySchema = z.object({
  date: z.string().min(1, "Kies een dag."),
});

export async function addRecipeToDayAction(
  sourceMealId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = addToDaySchema.safeParse({ date: formData.get("date") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ongeldige invoer." };
  }

  const source = await prisma.meal.findFirst({ where: { id: sourceMealId, familyId: user.familyId } });
  if (!source) {
    return { error: "Recept niet gevonden." };
  }

  await prisma.meal.create({
    data: {
      title: source.title,
      date: zonedMidnight(parsed.data.date),
      prepTime: source.prepTime,
      notes: source.notes,
      favorite: true,
      ingredients: source.ingredients,
      instructions: source.instructions,
      imageUrl: source.imageUrl,
      sourceUrl: source.sourceUrl,
      familyId: user.familyId,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/meals");
  revalidatePath("/dashboard/recipes");
}
