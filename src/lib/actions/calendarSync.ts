"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { parseIcs } from "@/lib/icsParser";

export type ActionState = { error?: string } | undefined;

const feedSchema = z.object({
  name: z.string().trim().min(1, "Geef de agenda een naam."),
  url: z
    .string()
    .trim()
    .url("Vul een geldige agenda-URL in.")
    .refine((url) => url.startsWith("http://") || url.startsWith("https://") || url.startsWith("webcal://"), {
      message: "De URL moet beginnen met http://, https:// of webcal://.",
    }),
});

function normalizeUrl(url: string) {
  return url.startsWith("webcal://") ? "https://" + url.slice("webcal://".length) : url;
}

async function runSync(feedId: string, familyId: string) {
  const feed = await prisma.externalCalendarFeed.findFirst({ where: { id: feedId, familyId } });
  if (!feed) return { error: "Agenda niet gevonden." };

  try {
    const response = await fetch(normalizeUrl(feed.url), { signal: AbortSignal.timeout(10_000) });
    if (!response.ok) {
      throw new Error(`Server antwoordde met status ${response.status}`);
    }
    const body = await response.text();
    const vevents = parseIcs(body);

    await prisma.$transaction(
      vevents.map((event) =>
        prisma.event.upsert({
          where: {
            externalFeedId_externalUid: {
              externalFeedId: feed.id,
              externalUid: event.uid,
            },
          },
          create: {
            title: event.title,
            category: "other",
            startTime: event.start,
            endTime: event.end,
            location: event.location,
            notes: event.description,
            familyId,
            source: "external",
            externalUid: event.uid,
            externalFeedId: feed.id,
          },
          update: {
            title: event.title,
            startTime: event.start,
            endTime: event.end,
            location: event.location,
            notes: event.description,
          },
        })
      )
    );

    await prisma.externalCalendarFeed.update({
      where: { id: feed.id },
      data: { lastSyncedAt: new Date(), lastError: null },
    });

    return {};
  } catch (err) {
    const message = err instanceof Error ? err.message : "Onbekende fout bij synchroniseren.";
    await prisma.externalCalendarFeed.update({
      where: { id: feed.id },
      data: { lastError: message },
    });
    return { error: `Kon agenda niet ophalen: ${message}` };
  }
}

export async function addExternalFeedAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = feedSchema.safeParse({
    name: formData.get("name"),
    url: formData.get("url"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ongeldige invoer." };
  }

  const { name, url } = parsed.data;

  const feed = await prisma.externalCalendarFeed.create({
    data: { name, url, familyId: user.familyId },
  });

  const result = await runSync(feed.id, user.familyId);

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/calendar");
  revalidatePath("/dashboard");

  return result;
}

export async function syncExternalFeedAction(feedId: string) {
  const user = await requireUser();
  const result = await runSync(feedId, user.familyId);

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/calendar");
  revalidatePath("/dashboard");

  return result;
}

export async function deleteExternalFeedAction(feedId: string) {
  const user = await requireUser();
  await prisma.externalCalendarFeed.deleteMany({ where: { id: feedId, familyId: user.familyId } });

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/calendar");
  revalidatePath("/dashboard");
}

export async function regenerateIcsTokenAction() {
  const user = await requireUser();
  await prisma.family.update({
    where: { id: user.familyId },
    data: { icsToken: randomUUID() },
  });

  revalidatePath("/dashboard/settings");
}
