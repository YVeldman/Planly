"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Vul je naam in."),
  color: z.string().min(1),
});

const familyNameSchema = z.object({
  familyName: z.string().trim().min(2, "Geef je gezin een naam (minimaal 2 tekens)."),
});

export type ActionState = { error?: string } | undefined;

export async function updateProfileAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    color: formData.get("color"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ongeldige invoer." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { name: parsed.data.name, color: parsed.data.color },
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
}

export async function updateFamilyNameAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = familyNameSchema.safeParse({ familyName: formData.get("familyName") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ongeldige invoer." };
  }

  await prisma.family.update({
    where: { id: user.familyId },
    data: { name: parsed.data.familyName },
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
}
