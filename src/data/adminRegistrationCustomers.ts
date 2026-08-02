import type { ActivityCategoryId } from "@/data/activities";

export type AdminRegistrationCustomerPass = {
  id: string;
  planId: string;
  planName: string;
  categoryId: ActivityCategoryId;
  categoryName: string;
  entriesRemaining: number;
  entriesTotal: number;
};

/** Existing contact the admin can register to a class session. */
export type AdminRegistrationCustomerOption = {
  key: string;
  customerId?: string;
  fullName: string;
  phone: string;
  email?: string;
  hasAccount: boolean;
  activePasses: AdminRegistrationCustomerPass[];
  lastSeenAt: string;
};

export type AdminRegistrationCustomerOptions = {
  customers: AdminRegistrationCustomerOption[];
  updatedAt: string;
};
