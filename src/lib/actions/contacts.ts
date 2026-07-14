"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Geef de contactpersoon een naam."),
  role: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: z.string().trim().toLowerCase().email("Vul een geldig e-mailadres in.").optional().or(z.literal("")),
  notes: z.string().trim().optional(),
});

export type ActionState = { error?: string } | undefined;

export async function createContactAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role") || undefined,
    phone: formData.get("phone") || undefined,
    email: formData.get("email") || undefined,
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ongeldige invoer." };
  }

  const { name, role, phone, email, notes } = parsed.data;

  await prisma.contact.create({
    data: {
      name,
      role: role || null,
      phone: phone || null,
      email: email || null,
      notes: notes || null,
      familyId: user.familyId,
    },
  });

  revalidatePath("/dashboard/contacts");
}

export async function updateContactAction(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role") || undefined,
    phone: formData.get("phone") || undefined,
    email: formData.get("email") || undefined,
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ongeldige invoer." };
  }

  const { name, role, phone, email, notes } = parsed.data;

  await prisma.contact.updateMany({
    where: { id, familyId: user.familyId },
    data: {
      name,
      role: role || null,
      phone: phone || null,
      email: email || null,
      notes: notes || null,
    },
  });

  revalidatePath("/dashboard/contacts");
}

export async function deleteContactAction(id: string) {
  const user = await requireUser();
  await prisma.contact.deleteMany({ where: { id, familyId: user.familyId } });
  revalidatePath("/dashboard/contacts");
}
