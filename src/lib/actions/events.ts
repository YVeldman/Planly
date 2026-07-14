"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { zonedDateTime } from "@/lib/timezone";

const eventSchema = z.object({
  title: z.string().trim().min(1, "Geef de afspraak een titel."),
  category: z.string().min(1),
  date: z.string().min(1, "Kies een datum."),
  startTime: z.string().min(1, "Kies een starttijd."),
  endTime: z.string().optional(),
  assigneeId: z.string().optional(),
  location: z.string().trim().optional(),
  notes: z.string().optional(),
});

export type ActionState = { error?: string } | undefined;

export async function createEventAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = eventSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    date: formData.get("date"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime") || undefined,
    assigneeId: formData.get("assigneeId") || undefined,
    location: formData.get("location") || undefined,
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ongeldige invoer." };
  }

  const { title, category, date, startTime, endTime, assigneeId, location, notes } = parsed.data;

  await prisma.event.create({
    data: {
      title,
      category,
      startTime: zonedDateTime(date, startTime),
      endTime: endTime ? zonedDateTime(date, endTime) : null,
      location: location || null,
      notes: notes || null,
      familyId: user.familyId,
      assigneeId: assigneeId || null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/calendar");
}

export async function updateEventAction(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = eventSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    date: formData.get("date"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime") || undefined,
    assigneeId: formData.get("assigneeId") || undefined,
    location: formData.get("location") || undefined,
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ongeldige invoer." };
  }

  const { title, category, date, startTime, endTime, assigneeId, location, notes } = parsed.data;

  await prisma.event.updateMany({
    where: { id, familyId: user.familyId },
    data: {
      title,
      category,
      startTime: zonedDateTime(date, startTime),
      endTime: endTime ? zonedDateTime(date, endTime) : null,
      location: location || null,
      notes: notes || null,
      assigneeId: assigneeId || null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/calendar");
}

export async function deleteEventAction(id: string) {
  const user = await requireUser();
  await prisma.event.deleteMany({ where: { id, familyId: user.familyId } });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/calendar");
}
