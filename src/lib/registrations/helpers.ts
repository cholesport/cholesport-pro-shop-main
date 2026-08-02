import {
  ACTIVITIES_PRICING,
  ACTIVITIES_SCHEDULE,
  type ActivityCategoryId,
  type ActivityScheduleSlot,
} from "@/data/activities";
import {
  REGISTRATION_SOURCE_LABELS,
  REGISTRATION_STATUS_LABELS,
  type ActivityRegistration,
  type ActivityRegistrationStatus,
} from "@/data/registrations";
import { getSlotsForDate } from "@/lib/activitySchedule";

export function getActivityPlanLabel(planId?: string): string {
  if (!planId) return "—";
  const plan = ACTIVITIES_PRICING.find((row) => row.id === planId);
  return plan?.name ?? planId;
}

export function getPricingPlansForCategory(categoryId: ActivityCategoryId) {
  return ACTIVITIES_PRICING.filter((plan) => plan.categoryId === categoryId);
}

export function getScheduleSlotById(slotId: string): ActivityScheduleSlot | undefined {
  return ACTIVITIES_SCHEDULE.find((slot) => slot.id === slotId);
}

/** All recurring slots for a category (not filtered by calendar day). */
export function getScheduleSlotsForCategory(
  categoryId: ActivityCategoryId,
): ActivityScheduleSlot[] {
  return ACTIVITIES_SCHEDULE.filter((slot) => slot.categoryId === categoryId);
}

export function formatRegistrationSlotLabel(
  registration: Pick<ActivityRegistration, "slotId" | "sessionDate">,
): string {
  const slot = getScheduleSlotById(registration.slotId);
  if (!slot) return registration.slotId;
  return `${slot.title} · ${slot.timeStart}–${slot.timeEnd}`;
}

export function formatStandingSlotLabel(slotId: string): string {
  const slot = getScheduleSlotById(slotId);
  if (!slot) return slotId;
  return `${slot.title} · ${slot.day} · ${slot.timeStart}–${slot.timeEnd}`;
}

export function getRegistrationStatusLabel(status: ActivityRegistrationStatus): string {
  return REGISTRATION_STATUS_LABELS[status];
}

export function getRegistrationSourceLabel(
  source: ActivityRegistration["source"],
): string {
  return REGISTRATION_SOURCE_LABELS[source];
}

export function filterRegistrations(
  registrations: ActivityRegistration[],
  filters: {
    categoryId?: ActivityCategoryId;
    sessionDate?: string;
    slotId?: string;
    status?: ActivityRegistrationStatus;
    query?: string;
  },
): ActivityRegistration[] {
  const q = filters.query?.trim().toLowerCase();

  return registrations
    .filter((row) => {
      if (filters.categoryId && row.categoryId !== filters.categoryId) return false;
      if (filters.sessionDate && row.sessionDate !== filters.sessionDate) return false;
      if (filters.slotId && row.slotId !== filters.slotId) return false;
      if (filters.status && row.status !== filters.status) return false;
      if (!q) return true;

      const haystack = [
        row.participantName,
        row.guardianName,
        row.phone,
        row.email,
        row.notes,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    })
    .sort((a, b) => {
      const dateCmp = b.sessionDate.localeCompare(a.sessionDate, "he");
      if (dateCmp !== 0) return dateCmp;
      return a.participantName.localeCompare(b.participantName, "he");
    });
}

export function getSlotsForCategoryAndDate(
  categoryId: ActivityCategoryId,
  date: Date,
): ActivityScheduleSlot[] {
  const categorySlots = ACTIVITIES_SCHEDULE.filter((slot) => slot.categoryId === categoryId);
  return getSlotsForDate(categorySlots, date);
}
