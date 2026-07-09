"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

const eventSchema = z.object({
  title: z.string().trim().min(1, "Geef de afspraak een titel."),
  category: z.string().min(1),
  date: z.string().min(1, "Kies een datum."),
  startTime: z.string().min(1, "Kies een starttijd."),
  endTime: z.string().optional(),
  assigneeId: z.string().optional(),
  notes: z.string().optional(),
});

export type ActionState = { error?: string } | undefined;

function toDateTime(date: string, time: string) {
  return new Date(`${date}T${time}:00`);
}

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
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ongeldige invoer." };
  }

  const { title, category, date, startTime, endTime, assigneeId, notes } = parsed.data;

  await prisma.event.create({
    data: {
      title,
      category,
      startTime: toDateTime(date, startTime),
      endTime: endTime ? toDateTime(date, endTime) : null,
      notes: notes || null,
      familyId: user.familyId,
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
