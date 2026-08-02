import type { ActivityPass, StandingRegistration } from "@/data/passes";
import type { ActivityRegistration } from "@/data/registrations";
import { enrichActivityRegistration } from "@/lib/commerce/unified.server";
import {
  findNextDateForSlot,
  formatScheduleDateIso,
} from "@/lib/activitySchedule";
import { getScheduleSlotById } from "@/lib/registrations/helpers";
import { loadRegistrationsStore, saveRegistrationsStore } from "@/lib/registrations/store.server";
import { redeemPassForSession } from "@/lib/passes/redeem.server";
import type { PassesStore } from "@/data/passes";

export async function registerStandingForNextSessionInternal(
  standing: StandingRegistration,
): Promise<{
  registration: ActivityRegistration;
  pass?: ActivityPass;
  sessionDate: string;
}> {
  const slot = getScheduleSlotById(standing.slotId);
  if (!slot) {
    throw new Error("משבצת השיעור לא נמצאה.");
  }

  const nextDate = findNextDateForSlot(slot);
  if (!nextDate) {
    throw new Error("לא נמצא שיעור קרוב למשבצת הזו.");
  }

  const sessionDate = formatScheduleDateIso(nextDate);

  if (standing.passId && standing.customerId) {
    const result = await redeemPassForSession({
      passId: standing.passId,
      customerId: standing.customerId,
      slotId: standing.slotId,
      sessionDate,
      participantName: standing.participantName,
      participantAge: standing.participantAge,
      source: "standing",
    });
    return {
      registration: result.registration,
      pass: result.pass,
      sessionDate,
    };
  }

  const registrationsStore = await loadRegistrationsStore();
  const now = new Date().toISOString();
  const registration = enrichActivityRegistration({
    id: crypto.randomUUID(),
    customerId: standing.customerId,
    categoryId: standing.categoryId,
    slotId: standing.slotId,
    sessionDate,
    participantName: standing.participantName,
    participantAge: standing.participantAge,
    guardianName: standing.guardianName,
    phone: standing.phone,
    email: standing.email,
    planId: standing.planId,
    status: "confirmed",
    source: "standing",
    notes: standing.notes,
    createdAt: now,
    updatedAt: now,
  });

  registrationsStore.registrations.unshift(registration);
  await saveRegistrationsStore(registrationsStore);

  return { registration, sessionDate };
}

export function getStandingRegistrationById(
  store: PassesStore,
  standingId: string,
): StandingRegistration | undefined {
  return store.standingRegistrations.find((row) => row.id === standingId);
}
