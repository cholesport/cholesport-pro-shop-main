import { ACTIVITIES_PRICING, type ActivityCategoryId } from "@/data/activities";
import type { ActivityPass } from "@/data/passes";
import type { ActivityRegistration } from "@/data/registrations";
import { getActivityCategoryMeta, getActivityPlanMeta } from "@/lib/commerce/catalog";
import { enrichActivityRegistration } from "@/lib/commerce/unified.server";
import { loadRegistrationsStore, saveRegistrationsStore } from "@/lib/registrations/store.server";
import { getScheduleSlotById } from "@/lib/registrations/helpers";
import type { PassesStore } from "@/data/passes";
import { findPassById, loadPassesStore, savePassesStore } from "@/lib/passes/store.server";
import { formatScheduleDateIso } from "@/lib/activitySchedule";

export function isPunchCardPlanId(planId: string): boolean {
  const plan = ACTIVITIES_PRICING.find((row) => row.id === planId);
  return Boolean(plan?.isPunchCard || plan?.priceUnit === "card");
}

export function getPunchCardEntryCount(planId: string): number {
  const plan = ACTIVITIES_PRICING.find((row) => row.id === planId);
  if (!plan) return 0;
  if (plan.entryCount) return plan.entryCount;
  if (plan.id === "tt-10-entries") return 10;
  if (plan.id === "ninja-8-lessons") return 8;
  return 0;
}

function refreshPassStatus(pass: ActivityPass): void {
  if (pass.entriesRemaining <= 0) {
    pass.status = "depleted";
    return;
  }
  if (pass.expiresAt && new Date(pass.expiresAt).getTime() < Date.now()) {
    pass.status = "expired";
  }
}

function hasExistingRegistration(
  registrations: ActivityRegistration[],
  opts: { slotId: string; sessionDate: string; phone: string; participantName: string },
): boolean {
  return registrations.some(
    (row) =>
      row.slotId === opts.slotId &&
      row.sessionDate === opts.sessionDate &&
      row.phone === opts.phone &&
      row.participantName === opts.participantName &&
      row.status !== "cancelled",
  );
}

export async function redeemPassForSession(input: {
  passId: string;
  customerId: string;
  slotId: string;
  sessionDate: string;
  participantName?: string;
  participantAge?: string;
  source: "pass" | "standing";
}): Promise<{
  pass: ActivityPass;
  registration: ActivityRegistration;
}> {
  const [passesStore, registrationsStore] = await Promise.all([
    loadPassesStore(),
    loadRegistrationsStore(),
  ]);

  const pass = findPassById(passesStore, input.passId);
  if (!pass) {
    throw new Error("הכרטיסייה לא נמצאה.");
  }
  if (pass.customerId !== input.customerId) {
    throw new Error("הכרטיסייה לא שייכת לחשבון הזה.");
  }
  if (pass.status !== "active" || pass.entriesRemaining <= 0) {
    throw new Error("אין ניקובים פנויים בכרטיסייה.");
  }

  const slot = getScheduleSlotById(input.slotId);
  if (!slot) {
    throw new Error("משבצת השיעור לא נמצאה.");
  }
  if (slot.categoryId !== pass.categoryId) {
    throw new Error("הכרטיסייה לא מתאימה לקטגוריה הזו.");
  }

  const participantName = input.participantName?.trim() || pass.participantName;
  const participantAge = input.participantAge?.trim() || pass.participantAge;

  if (
    hasExistingRegistration(registrationsStore.registrations, {
      slotId: input.slotId,
      sessionDate: input.sessionDate,
      phone: pass.phone,
      participantName,
    })
  ) {
    throw new Error("כבר קיימת הרשמה לשיעור הזה בתאריך שנבחר.");
  }

  const today = formatScheduleDateIso(new Date());
  if (input.sessionDate < today) {
    throw new Error("לא ניתן להירשם לתאריך שעבר.");
  }

  const now = new Date().toISOString();
  const registration = enrichActivityRegistration({
    id: crypto.randomUUID(),
    customerId: input.customerId,
    categoryId: pass.categoryId as ActivityCategoryId,
    slotId: input.slotId,
    sessionDate: input.sessionDate,
    participantName,
    participantAge,
    phone: pass.phone,
    email: pass.email,
    planId: pass.planId,
    passId: pass.id,
    status: "confirmed",
    source: input.source,
    createdAt: now,
    updatedAt: now,
  });

  pass.entriesRemaining -= 1;
  pass.updatedAt = now;
  refreshPassStatus(pass);

  const redemption = {
    id: crypto.randomUUID(),
    passId: pass.id,
    registrationId: registration.id,
    sessionDate: input.sessionDate,
    slotId: input.slotId,
    redeemedAt: now,
  };

  registrationsStore.registrations.unshift(registration);
  passesStore.redemptions.unshift(redemption);

  await Promise.all([
    savePassesStore(passesStore),
    saveRegistrationsStore(registrationsStore),
  ]);

  return { pass, registration };
}

export function findRedemptionByRegistrationId(
  store: PassesStore,
  registrationId: string,
) {
  return store.redemptions.find((row) => row.registrationId === registrationId);
}

export function refundPassForRegistration(
  passesStore: PassesStore,
  registrationId: string,
): ActivityPass | undefined {
  const redemption = findRedemptionByRegistrationId(passesStore, registrationId);
  if (!redemption) return undefined;

  const pass = findPassById(passesStore, redemption.passId);
  passesStore.redemptions = passesStore.redemptions.filter((row) => row.id !== redemption.id);

  if (!pass) return undefined;

  const now = new Date().toISOString();
  pass.entriesRemaining = Math.min(pass.entriesTotal, pass.entriesRemaining + 1);
  pass.updatedAt = now;
  refreshPassStatus(pass);
  if (pass.entriesRemaining > 0 && pass.status === "depleted") {
    pass.status = "active";
  }

  return pass;
}

export function deductPassPenaltyForCancellation(
  passesStore: PassesStore,
  input: {
    customerId: string;
    categoryId: ActivityCategoryId;
    registrationId: string;
    slotId: string;
    sessionDate: string;
  },
): ActivityPass {
  const pass = passesStore.passes.find(
    (row) =>
      row.customerId === input.customerId &&
      row.categoryId === input.categoryId &&
      row.status === "active" &&
      row.entriesRemaining > 0,
  );
  if (!pass) {
    throw new Error("אין כרטיסייה פעילה לניכוי (ביטול מאוחר).");
  }

  const now = new Date().toISOString();
  pass.entriesRemaining -= 1;
  pass.updatedAt = now;
  refreshPassStatus(pass);

  passesStore.redemptions.push({
    id: crypto.randomUUID(),
    passId: pass.id,
    registrationId: input.registrationId,
    sessionDate: input.sessionDate,
    slotId: input.slotId,
    redeemedAt: now,
  });

  return pass;
}

export function createPassRecord(input: {
  customerId: string;
  planId: string;
  participantName: string;
  participantAge?: string;
  phone: string;
  email?: string;
  entriesTotal?: number;
  entriesRemaining?: number;
}): ActivityPass {
  const planMeta = getActivityPlanMeta(input.planId);
  const plan = ACTIVITIES_PRICING.find((row) => row.id === input.planId);
  if (!plan || !isPunchCardPlanId(input.planId)) {
    throw new Error("מסלול הכרטיסייה לא תקין.");
  }

  const categoryMeta = getActivityCategoryMeta(plan.categoryId);
  const entriesTotal = input.entriesTotal ?? getPunchCardEntryCount(input.planId);
  const entriesRemaining = input.entriesRemaining ?? entriesTotal;
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    customerId: input.customerId,
    planId: input.planId,
    categoryId: plan.categoryId,
    planName: planMeta.planName ?? plan.name,
    categoryName: categoryMeta.categoryName,
    entriesTotal,
    entriesRemaining,
    participantName: input.participantName.trim(),
    participantAge: input.participantAge?.trim() || undefined,
    phone: input.phone.trim(),
    email: input.email?.trim() || undefined,
    purchasedAt: now,
    status: entriesRemaining > 0 ? "active" : "depleted",
    createdAt: now,
    updatedAt: now,
  };
}
