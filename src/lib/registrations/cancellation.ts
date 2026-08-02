import { LATE_CANCELLATION_HOURS } from "@/data/registrations";

const JERUSALEM_TZ = "Asia/Jerusalem";

type JerusalemParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

function readJerusalemParts(date: Date): JerusalemParts {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: JERUSALEM_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? "0");

  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
  };
}

/** UTC timestamp for a Jerusalem wall-clock session start. */
export function getSessionStartMs(sessionDate: string, timeStart: string): number {
  const [year, month, day] = sessionDate.split("-").map(Number);
  const [hour, minute] = timeStart.split(":").map(Number);
  const base = Date.UTC(year, month - 1, day, hour, minute);

  for (let offsetHours = -14; offsetHours <= 14; offsetHours++) {
    const candidate = new Date(base - offsetHours * 60 * 60 * 1000);
    const parts = readJerusalemParts(candidate);
    if (
      parts.year === year &&
      parts.month === month &&
      parts.day === day &&
      parts.hour === hour &&
      parts.minute === minute
    ) {
      return candidate.getTime();
    }
  }

  return base;
}

export function getHoursUntilSessionStart(sessionDate: string, timeStart: string): number {
  const diffMs = getSessionStartMs(sessionDate, timeStart) - Date.now();
  return diffMs / (1000 * 60 * 60);
}

export function isLateCancellation(sessionDate: string, timeStart: string): boolean {
  const hoursUntil = getHoursUntilSessionStart(sessionDate, timeStart);
  return hoursUntil < LATE_CANCELLATION_HOURS;
}
