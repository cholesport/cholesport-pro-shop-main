import type { ActivityScheduleSlot } from "@/data/activities";
import { WHATSAPP_URL } from "@/lib/contact";

const LONG_DATE = new Intl.DateTimeFormat("he-IL", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const STRIP_WEEKDAY = new Intl.DateTimeFormat("he-IL", { weekday: "short" });
const STRIP_MONTH = new Intl.DateTimeFormat("he-IL", { month: "short" });

/** Calendar horizon for day picker (days ahead from today). */
export const SCHEDULE_CALENDAR_DAYS = 28;

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return startOfDay(d);
}

export function formatScheduleDateLong(date: Date): string {
  return LONG_DATE.format(date);
}

export function formatScheduleDateIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Parse YYYY-MM-DD in local timezone (avoids UTC shift from `new Date(iso)`). */
export function parseScheduleDateIso(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return startOfDay(new Date(y, m - 1, d));
}

export function formatScheduleStripLabel(date: Date): { weekday: string; day: number; month: string } {
  return {
    weekday: STRIP_WEEKDAY.format(date),
    day: date.getDate(),
    month: STRIP_MONTH.format(date),
  };
}

export function getUpcomingScheduleDays(count = SCHEDULE_CALENDAR_DAYS, from = new Date()): Date[] {
  const start = startOfDay(from);
  return Array.from({ length: count }, (_, i) => addDays(start, i));
}

export function slotOccursOnDate(slot: ActivityScheduleSlot, date: Date): boolean {
  if (slot.scheduleType === "seasonal") return false;
  return slot.weekdays.includes(date.getDay());
}

export function getSlotsForDate(
  slots: ActivityScheduleSlot[],
  date: Date,
): ActivityScheduleSlot[] {
  return slots
    .filter((slot) => slotOccursOnDate(slot, date))
    .sort((a, b) => a.timeStart.localeCompare(b.timeStart, "he"));
}

export function countSlotsOnDate(slots: ActivityScheduleSlot[], date: Date): number {
  return getSlotsForDate(slots, date).length;
}

export function getSeasonalSlots(slots: ActivityScheduleSlot[]): ActivityScheduleSlot[] {
  return slots.filter((slot) => slot.scheduleType === "seasonal");
}

export function getWeeklySlots(slots: ActivityScheduleSlot[]): ActivityScheduleSlot[] {
  return slots.filter((slot) => slot.scheduleType === "weekly");
}

export function findNextDateWithSlots(
  slots: ActivityScheduleSlot[],
  from: Date,
  withinDays = SCHEDULE_CALENDAR_DAYS,
): Date | null {
  const days = getUpcomingScheduleDays(withinDays, from);
  for (const day of days) {
    if (countSlotsOnDate(slots, day) > 0) return day;
  }
  return null;
}

export function findNextDateForSlot(
  slot: ActivityScheduleSlot,
  from: Date = new Date(),
  withinDays = SCHEDULE_CALENDAR_DAYS,
): Date | null {
  const days = getUpcomingScheduleDays(withinDays, from);
  for (const day of days) {
    if (slotOccursOnDate(slot, day)) return day;
  }
  return null;
}

export function buildActivityReservationWhatsAppUrl(
  slot: ActivityScheduleSlot,
  date: Date,
  categoryTitle: string,
): string {
  const dateLabel = formatScheduleDateLong(date);
  const isClubEntry = slot.categoryId === "table-tennis";
  const message = isClubEntry
    ? [
        "שלום, אשמח לשריין כניסה למועדון טניס השולחן:",
        "",
        `תאריך: ${dateLabel}`,
        `משבצת כניסה: ${slot.timeStart}–${slot.timeEnd}`,
        "(כניסה למועדון - לא השכרת שולחן פרטי)",
        "מתחם CHOLE TLV",
      ].join("\n")
    : [
        "שלום, אשמח לשריין מקום לשיעור:",
        "",
        `שיעור: ${slot.title}`,
        `תאריך: ${dateLabel}`,
        `שעה: ${slot.timeStart}–${slot.timeEnd}`,
        `קטגוריה: ${categoryTitle}`,
        "מתחם CHOLE TLV",
      ].join("\n");

  return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
}

export function buildActivityReservationPaymentUrl(
  slot: ActivityScheduleSlot,
  date: Date,
  baseUrl: string,
): string {
  const params = new URLSearchParams({
    activity: slot.id,
    date: formatScheduleDateIso(date),
  });
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}${params.toString()}`;
}
