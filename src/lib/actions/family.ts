"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

const memberSchema = z.object({
  name: z.string().trim().min(2, "Vul een naam in."),
  email: z.string().trim().toLowerCase().optional(),
  password: z.string().optional(),
  color: z.string().min(1),
  isChild: z.string().optional(),
});

export type ActionState = { error?: string } | undefined;

export async function addFamilyMemberAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = memberSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email") || undefined,
    password: formData.get("password") || undefined,
    color: formData.get("color"),
    isChild: formData.get("isChild") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ongeldige invoer." };
  }

  const { name, email, password, color } = parsed.data;
  const isChild = parsed.data.isChild === "on";

  if (isChild) {
    // Children get a lightweight profile only: no login, no email needed.
    // Parents manage their tasks and reward points on their behalf.
    await prisma.user.create({
      data: {
        name,
        color,
        role: "member",
        isChild: true,
        familyId: user.familyId,
      },
    });
  } else {
    if (!email || !z.string().email().safeParse(email).success) {
      return { error: "Vul een geldig e-mailadres in." };
    }
    if (!password || password.length < 8) {
      return { error: "Wachtwoord moet minimaal 8 tekens zijn." };
    }

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
  }

  revalidatePath("/dashboard/settings");
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

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
}
