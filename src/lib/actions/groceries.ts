"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export type ActionState = { error?: string } | undefined;

const grocerySchema = z.object({
  name: z.string().trim().min(1, "Vul iets in."),
});

export async function createGroceryItemAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = grocerySchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ongeldige invoer." };
  }

  await prisma.groceryItem.create({
    data: { name: parsed.data.name, familyId: user.familyId },
  });

  revalidatePath("/dashboard/groceries");
  revalidatePath("/dashboard");
}

export async function toggleGroceryItemAction(id: string, done: boolean) {
  const user = await requireUser();
  await prisma.groceryItem.updateMany({
    where: { id, familyId: user.familyId },
    data: { done },
  });
  revalidatePath("/dashboard/groceries");
  revalidatePath("/dashboard");
}

export async function deleteGroceryItemAction(id: string) {
  const user = await requireUser();
  await prisma.groceryItem.deleteMany({ where: { id, familyId: user.familyId } });
  revalidatePath("/dashboard/groceries");
  revalidatePath("/dashboard");
}

export async function addIngredientsToGroceriesAction(ingredients: string[]) {
  const user = await requireUser();

  const names = ingredients.map((i) => i.trim()).filter(Boolean);
  if (names.length === 0) return;

  await prisma.groceryItem.createMany({
    data: names.map((name) => ({ name, familyId: user.familyId })),
  });

  revalidatePath("/dashboard/groceries");
  revalidatePath("/dashboard");
}
