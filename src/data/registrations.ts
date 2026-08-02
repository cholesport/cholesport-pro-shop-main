import type { ActivityCategoryId } from "@/data/activities";

export type ActivityRegistrationStatus = "confirmed" | "pending" | "cancelled";

export type ActivityRegistrationSource =
  | "manual"
  | "whatsapp"
  | "payment"
  | "grow"
  | "pass"
  | "standing";

/** One participant registered for a specific class session (date + schedule slot). */
export type ActivityRegistration = {
  id: string;
  /** Linked website account when email/phone matches a registered customer. */
  customerId?: string;
  categoryId: ActivityCategoryId;
  /** Denormalized for admin / customer views. */
  categoryName?: string;
  /** Matches `ActivityScheduleSlot.id` from activities data. */
  slotId: string;
  /** Session date (YYYY-MM-DD) for this occurrence. */
  sessionDate: string;
  participantName: string;
  participantAge?: string;
  guardianName?: string;
  phone: string;
  email?: string;
  planId?: string;
  planName?: string;
  isSubscription?: boolean;
  /** Punch card used for this session. */
  passId?: string;
  notes?: string;
  status: ActivityRegistrationStatus;
  source: ActivityRegistrationSource;
  createdAt: string;
  updatedAt: string;
};

export type RegistrationsStore = {
  registrations: ActivityRegistration[];
  updatedAt: string;
};

export const REGISTRATION_STATUS_LABELS: Record<ActivityRegistrationStatus, string> = {
  confirmed: "מאושר",
  pending: "ממתין",
  cancelled: "בוטל",
};

/** Hours before session start — late customer cancellation may cost a punch. */
export const LATE_CANCELLATION_HOURS = 4;

export const REGISTRATION_SOURCE_LABELS: Record<ActivityRegistrationSource, string> = {
  manual: "הזנה ידנית",
  whatsapp: "וואטסאפ",
  payment: "תשלום",
  grow: "משולם",
  pass: "כרטיסייה",
  standing: "רישום קבוע",
};
