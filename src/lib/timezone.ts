export const APP_TIMEZONE = "Europe/Amsterdam";

const offsetFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: APP_TIMEZONE,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

function zonedOffsetMs(instant: Date): number {
  const parts = offsetFormatter.formatToParts(instant).reduce<Record<string, string>>((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});

  const asIfUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );

  return asIfUtc - instant.getTime();
}

/**
 * Interprets a "YYYY-MM-DD" date and "HH:mm" time as wall-clock time in
 * APP_TIMEZONE (accounting for CET/CEST) and returns the matching UTC Date,
 * regardless of the server process's own timezone.
 */
export function zonedDateTime(date: string, time: string): Date {
  const asIfUtc = new Date(`${date}T${time}:00Z`);
  const offset = zonedOffsetMs(asIfUtc);
  return new Date(asIfUtc.getTime() - offset);
}

/** Same as zonedDateTime but for a date-only value (midnight in APP_TIMEZONE). */
export function zonedMidnight(date: string): Date {
  return zonedDateTime(date, "00:00");
}

const nowPartsFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: APP_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  hourCycle: "h23",
});

function nowInAppTimezoneParts() {
  const parts = nowPartsFormatter.formatToParts(new Date()).reduce<Record<string, string>>((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});
  return { dateStr: `${parts.year}-${parts.month}-${parts.day}`, hour: Number(parts.hour) };
}

/** Today's calendar date ("YYYY-MM-DD") as observed in APP_TIMEZONE right now. */
export function todayDateStringInAppTimezone(): string {
  return nowInAppTimezoneParts().dateStr;
}

/** Current hour (0-23) as observed in APP_TIMEZONE right now. */
export function currentHourInAppTimezone(): number {
  return nowInAppTimezoneParts().hour;
}

/** Adds `days` calendar days to a "YYYY-MM-DD" string (pure date arithmetic, no timezone involved). */
export function addDaysToDateString(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

const dateInputFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: APP_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const timeInputFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: APP_TIMEZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** Formats a Date as "YYYY-MM-DD" in APP_TIMEZONE, for use as an <input type="date"> value. */
export function toZonedDateInputValue(date: Date): string {
  return dateInputFormatter.format(date);
}

/** Formats a Date as "HH:mm" in APP_TIMEZONE, for use as an <input type="time"> value. */
export function toZonedTimeInputValue(date: Date): string {
  return timeInputFormatter.format(date);
}
