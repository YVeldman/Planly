"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { sendPushToUser } from "@/lib/push";

const taskSchema = z.object({
  title: z.string().trim().min(1, "Geef de taak een titel."),
  category: z.string().min(1),
  dueDate: z.string().optional(),
  assigneeId: z.string().optional(),
});

export type ActionState = { error?: string } | undefined;

export async function createTaskAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = taskSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    dueDate: formData.get("dueDate") || undefined,
    assigneeId: formData.get("assigneeId") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ongeldige invoer." };
  }

  const { title, category, dueDate, assigneeId } = parsed.data;

  await prisma.task.create({
    data: {
      title,
      category,
      dueDate: dueDate ? new Date(`${dueDate}T00:00:00`) : null,
      familyId: user.familyId,
      assigneeId: assigneeId || null,
    },
  });

  if (assigneeId && assigneeId !== user.id) {
    await sendPushToUser(assigneeId, {
      title: "Nieuwe taak toegewezen",
      body: `${user.name} heeft je een taak gegeven: ${title}`,
      url: "/dashboard/tasks",
    }).catch(() => {});
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
}

export async function toggleTaskAction(id: string, done: boolean) {
  const user = await requireUser();
  await prisma.task.updateMany({
    where: { id, familyId: user.familyId },
    data: { done },
  });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
}

export async function deleteTaskAction(id: string) {
  const user = await requireUser();
  await prisma.task.deleteMany({ where: { id, familyId: user.familyId } });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
}
