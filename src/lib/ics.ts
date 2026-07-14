function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function toIcsDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function foldLine(line: string) {
  if (line.length <= 74) return line;
  const chunks: string[] = [];
  let rest = line;
  while (rest.length > 74) {
    chunks.push(rest.slice(0, 74));
    rest = " " + rest.slice(74);
  }
  chunks.push(rest);
  return chunks.join("\r\n");
}

export type IcsEvent = {
  uid: string;
  title: string;
  startTime: Date;
  endTime: Date | null;
  location?: string | null;
  notes?: string | null;
  assigneeName?: string | null;
};

export function buildIcsFeed(calendarName: string, events: IcsEvent[]) {
  const now = toIcsDate(new Date());

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Planly//Family Planner//NL",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeIcsText(calendarName)}`,
  ];

  for (const event of events) {
    const end = event.endTime ?? new Date(event.startTime.getTime() + 60 * 60 * 1000);
    const description = [event.notes, event.assigneeName ? `Wie: ${event.assigneeName}` : null]
      .filter(Boolean)
      .join("\\n");

    lines.push(
      "BEGIN:VEVENT",
      `UID:${escapeIcsText(event.uid)}`,
      `DTSTAMP:${now}`,
      `DTSTART:${toIcsDate(event.startTime)}`,
      `DTEND:${toIcsDate(end)}`,
      `SUMMARY:${escapeIcsText(event.title)}`
    );
    if (event.location) {
      lines.push(`LOCATION:${escapeIcsText(event.location)}`);
    }
    if (description) {
      lines.push(`DESCRIPTION:${escapeIcsText(description)}`);
    }
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");

  return lines.map(foldLine).join("\r\n") + "\r\n";
}
