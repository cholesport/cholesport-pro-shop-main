import type { ActivityCategoryId } from "@/data/activities";

export type ActivityPassStatus = "active" | "depleted" | "expired" | "cancelled";

/** Prepaid punch card — entries debited on session registration. */
export type ActivityPass = {
  id: string;
  customerId: string;
  planId: string;
  categoryId: ActivityCategoryId;
  planName: string;
  categoryName: string;
  entriesTotal: number;
  entriesRemaining: number;
  participantName: string;
  participantAge?: string;
  phone: string;
  email?: string;
  purchasedAt: string;
  expiresAt?: string;
  status: ActivityPassStatus;
  createdAt: string;
  updatedAt: string;
};

export type ActivityPassRedemption = {
  id: string;
  passId: string;
  registrationId: string;
  sessionDate: string;
  slotId: string;
  redeemedAt: string;
};

export type StandingRegistrationStatus = "active" | "paused" | "cancelled";

/** Admin-managed recurring trainee enrollment template. */
export type StandingRegistration = {
  id: string;
  customerId?: string;
  categoryId: ActivityCategoryId;
  slotId: string;
  participantName: string;
  participantAge?: string;
  guardianName?: string;
  phone: string;
  email?: string;
  planId?: string;
  passId?: string;
  notes?: string;
  status: StandingRegistrationStatus;
  createdAt: string;
  updatedAt: string;
};

export type PassesStore = {
  passes: ActivityPass[];
  standingRegistrations: StandingRegistration[];
  redemptions: ActivityPassRedemption[];
  updatedAt: string;
};

export const PASS_STATUS_LABELS: Record<ActivityPassStatus, string> = {
  active: "פעילה",
  depleted: "נגמרה",
  expired: "פג תוקף",
  cancelled: "בוטלה",
};

export const STANDING_STATUS_LABELS: Record<StandingRegistrationStatus, string> = {
  active: "פעיל",
  paused: "מושהה",
  cancelled: "בוטל",
};
