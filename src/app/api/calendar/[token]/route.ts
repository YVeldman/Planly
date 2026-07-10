import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildIcsFeed } from "@/lib/ics";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const family = await prisma.family.findUnique({ where: { icsToken: token } });
  if (!family) {
    return NextResponse.json({ error: "Onbekende agenda-link." }, { status: 404 });
  }

  const events = await prisma.event.findMany({
    where: { familyId: family.id },
    include: { assignee: true },
    orderBy: { startTime: "asc" },
  });

  const feed = buildIcsFeed(family.name, events.map((event) => ({
    uid: `${event.id}@planly.app`,
    title: event.title,
    startTime: event.startTime,
    endTime: event.endTime,
    notes: event.notes,
    assigneeName: event.assignee?.name,
  })));

  return new NextResponse(feed, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="${family.name}.ics"`,
      "Cache-Control": "no-store",
    },
  });
}
