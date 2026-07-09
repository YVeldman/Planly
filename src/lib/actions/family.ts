"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

const memberSchema = z.object({
  name: z.string().trim().min(2, "Vul een naam in."),
  email: z.string().trim().toLowerCase().email("Vul een geldig e-mailadres in."),
  password: z.string().min(8, "Wachtwoord moet minimaal 8 tekens zijn."),
  color: z.string().min(1),
});

export type ActionState = { error?: string } | undefined;

export async function addFamilyMemberAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = memberSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    color: formData.get("color"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ongeldige invoer." };
  }

  const { name, email, password, color } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Er bestaat al een account met dit e-mailadres." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      color,
      role: "member",
      familyId: user.familyId,
    },
  });

  revalidatePath("/dashboard/family");
  revalidatePath("/dashboard");
}

export async function removeFamilyMemberAction(memberId: string) {
  const user = await requireUser();

  if (memberId === user.id) {
    return { error: "Je kunt jezelf niet verwijderen." };
  }

  await prisma.user.deleteMany({
    where: { id: memberId, familyId: user.familyId },
  });

  revalidatePath("/dashboard/family");
  revalidatePath("/dashboard");
}
