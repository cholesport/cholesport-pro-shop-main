import type { CustomerRecord } from "@/data/customers";
import { CUSTOMER_AVATAR_MAX_BYTES } from "@/data/customers";
import type { UserProfile } from "@/data/account";
import { findCustomerById, loadCustomersStore } from "@/lib/customers/store.server";
import { verifyCustomerSessionToken } from "@/lib/customers/session.server";

export function customerToProfile(customer: CustomerRecord, isNew = false): UserProfile {
  return {
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    phone: customer.phone,
    avatarUrl: customer.avatarDataUrl,
    isNew,
    registeredAt: customer.registeredAt,
  };
}

export function assertValidAvatarDataUrl(avatarDataUrl: string | undefined): void {
  if (!avatarDataUrl) return;
  if (!avatarDataUrl.startsWith("data:image/")) {
    throw new Error("תמונת פרופיל לא תקינה.");
  }
  const base64Length = avatarDataUrl.split(",")[1]?.length ?? 0;
  const approxBytes = Math.ceil((base64Length * 3) / 4);
  if (approxBytes > CUSTOMER_AVATAR_MAX_BYTES) {
    throw new Error("תמונת הפרופיל גדולה מדי. נסו תמונה קטנה יותר.");
  }
}

export async function getCustomerFromSessionToken(customerToken: string | undefined) {
  const session = verifyCustomerSessionToken(customerToken);
  if (!session) {
    throw new Error("פג תוקף ההתחברות. התחברו מחדש.");
  }

  const store = await loadCustomersStore();
  const customer = findCustomerById(store, session.customerId);
  if (!customer || customer.email.trim().toLowerCase() !== session.email) {
    throw new Error("החשבון לא נמצא.");
  }

  return { store, customer, session };
}
