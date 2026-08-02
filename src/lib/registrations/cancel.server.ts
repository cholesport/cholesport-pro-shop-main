import type { ActivityPass, PassesStore } from "@/data/passes";
import type { ActivityRegistration } from "@/data/registrations";
import { isLateCancellation } from "@/lib/registrations/cancellation";
import { getScheduleSlotById } from "@/lib/registrations/helpers";
import {
  deductPassPenaltyForCancellation,
  findRedemptionByRegistrationId,
  refundPassForRegistration,
} from "@/lib/passes/redeem.server";
import {
  getActivePassesForCustomer,
  loadPassesStore,
  savePassesStore,
} from "@/lib/passes/store.server";
import {
  loadRegistrationsStore,
  saveRegistrationsStore,
} from "@/lib/registrations/store.server";

export type RegistrationCancelPassAction = "refunded" | "deducted" | "none";

export type CancelRegistrationResult = {
  registration: ActivityRegistration;
  pass?: ActivityPass;
  passAction: RegistrationCancelPassAction;
};

async function applyPassPolicyForCancellation(
  passesStore: PassesStore,
  registration: ActivityRegistration,
  cancelledBy: "admin" | "customer",
  slotTimeStart: string,
): Promise<{ pass?: ActivityPass; passAction: RegistrationCancelPassAction }> {
  const redemption = findRedemptionByRegistrationId(passesStore, registration.id);

  if (cancelledBy === "admin") {
    const pass = refundPassForRegistration(passesStore, registration.id);
    return { pass, passAction: pass ? "refunded" : "none" };
  }

  const late = isLateCancellation(registration.sessionDate, slotTimeStart);

  if (redemption) {
    if (late) {
      return { passAction: "none" };
    }
    const pass = refundPassForRegistration(passesStore, registration.id);
    return { pass, passAction: pass ? "refunded" : "none" };
  }

  if (!late || !registration.customerId) {
    return { passAction: "none" };
  }

  const activePasses = getActivePassesForCustomer(passesStore, registration.customerId).filter(
    (pass) => pass.categoryId === registration.categoryId,
  );
  if (activePasses.length === 0) {
    return { passAction: "none" };
  }

  const pass = deductPassPenaltyForCancellation(passesStore, {
    customerId: registration.customerId,
    categoryId: registration.categoryId,
    registrationId: registration.id,
    slotId: registration.slotId,
    sessionDate: registration.sessionDate,
  });

  return { pass, passAction: "deducted" };
}

export async function cancelActivityRegistrationInternal(input: {
  registrationId: string;
  cancelledBy: "admin" | "customer";
  customerId?: string;
}): Promise<CancelRegistrationResult> {
  const [registrationsStore, passesStore] = await Promise.all([
    loadRegistrationsStore(),
    loadPassesStore(),
  ]);

  const registration = registrationsStore.registrations.find(
    (row) => row.id === input.registrationId,
  );
  if (!registration) {
    throw new Error("ההרשמה לא נמצאה.");
  }
  if (registration.status === "cancelled") {
    throw new Error("ההרשמה כבר בוטלה.");
  }

  if (input.cancelledBy === "customer") {
    if (!input.customerId || registration.customerId !== input.customerId) {
      throw new Error("אין הרשאה לבטל הרשמה זו.");
    }
  }

  const slot = getScheduleSlotById(registration.slotId);
  if (!slot) {
    throw new Error("משבצת השיעור לא נמצאה.");
  }

  const { pass, passAction } = await applyPassPolicyForCancellation(
    passesStore,
    registration,
    input.cancelledBy,
    slot.timeStart,
  );

  const now = new Date().toISOString();
  registration.status = "cancelled";
  registration.updatedAt = now;

  await Promise.all([
    saveRegistrationsStore(registrationsStore),
    savePassesStore(passesStore),
  ]);

  return { registration, pass, passAction };
}
