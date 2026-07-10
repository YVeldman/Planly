export type ParsedIcsEvent = {
  uid: string;
  title: string;
  start: Date;
  end: Date | null;
  description: string | null;
};

function unescapeIcsText(value: string) {
  return value
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}

function unfoldLines(raw: string) {
  const lines = raw.split(/\r\n|\n|\r/);
  const unfolded: string[] = [];
  for (const line of lines) {
    if ((line.startsWith(" ") || line.startsWith("\t")) && unfolded.length > 0) {
      unfolded[unfolded.length - 1] += line.slice(1);
    } else {
      unfolded.push(line);
    }
  }
  return unfolded;
}

function parseIcsDate(value: string): Date | null {
  const match = value.match(
    /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/
  );
  if (!match) return null;

  const [, year, month, day, hour, minute, second, utc] = match;

  if (hour === undefined) {
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  if (utc) {
    return new Date(
      Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second))
    );
  }

  return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second));
}

function parsePropertyLine(line: string): { name: string; value: string } | null {
  const colonIndex = line.indexOf(":");
  if (colonIndex === -1) return null;
  const rawName = line.slice(0, colonIndex);
  const value = line.slice(colonIndex + 1);
  const name = rawName.split(";")[0].toUpperCase();
  return { name, value };
}

export function parseIcs(raw: string): ParsedIcsEvent[] {
  const lines = unfoldLines(raw);
  const events: ParsedIcsEvent[] = [];

  let inEvent = false;
  let current: Partial<ParsedIcsEvent> & { uid?: string } = {};

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      inEvent = true;
      current = {};
      continue;
    }
    if (line === "END:VEVENT") {
      if (inEvent && current.uid && current.start) {
        events.push({
          uid: current.uid,
          title: current.title ?? "Afspraak",
          start: current.start,
          end: current.end ?? null,
          description: current.description ?? null,
        });
      }
      inEvent = false;
      continue;
    }
    if (!inEvent) continue;

    const property = parsePropertyLine(line);
    if (!property) continue;

    switch (property.name) {
      case "UID":
        current.uid = property.value.trim();
        break;
      case "SUMMARY":
        current.title = unescapeIcsText(property.value.trim());
        break;
      case "DESCRIPTION":
        current.description = unescapeIcsText(property.value.trim());
        break;
      case "DTSTART": {
        const date = parseIcsDate(property.value.trim());
        if (date) current.start = date;
        break;
      }
      case "DTEND": {
        const date = parseIcsDate(property.value.trim());
        if (date) current.end = date;
        break;
      }
    }
  }

  return events;
}
