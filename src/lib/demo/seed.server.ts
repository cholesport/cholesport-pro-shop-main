import {
  DEMO_CUSTOMER_EMAIL,
  DEMO_CUSTOMER_PASSWORD,
  DEMO_CUSTOMER_PROFILE,
} from "@/data/demo";
import { hashCustomerPassword } from "@/lib/customers/password.server";
import {
  findCustomerByEmail,
  loadCustomersStore,
  normalizeCustomerEmail,
  saveCustomersStore,
} from "@/lib/customers/store.server";
import { loadPassesStore, savePassesStore } from "@/lib/passes/store.server";
import { createPassRecord } from "@/lib/passes/redeem.server";

const DEMO_PASS_IDS = {
  tableTennis: "demo-pass-tt-10",
  ninja: "demo-pass-ninja-8",
} as const;

const DEMO_STANDING_ID = "demo-standing-ninja";

/** Ensures demo customer + sample punch cards exist for admin preview. */
export async function ensureDemoCustomerData(): Promise<void> {
  const customersStore = await loadCustomersStore();
  let customer = findCustomerByEmail(customersStore, DEMO_CUSTOMER_EMAIL);

  if (!customer) {
    const now = new Date().toISOString();
    customer = {
      id: "demo-customer-chole",
      email: normalizeCustomerEmail(DEMO_CUSTOMER_EMAIL),
      passwordHash: hashCustomerPassword(DEMO_CUSTOMER_PASSWORD),
      firstName: DEMO_CUSTOMER_PROFILE.firstName,
      lastName: DEMO_CUSTOMER_PROFILE.lastName,
      phone: DEMO_CUSTOMER_PROFILE.phone,
      registeredAt: now,
      updatedAt: now,
    };
    customersStore.customers.push(customer);
    await saveCustomersStore(customersStore);
  }

  const passesStore = await loadPassesStore();
  let dirty = false;

  if (!passesStore.passes.some((pass) => pass.id === DEMO_PASS_IDS.tableTennis)) {
    const pass = createPassRecord({
      customerId: customer.id,
      planId: "tt-10-entries",
      participantName: `${customer.firstName} ${customer.lastName}`,
      phone: customer.phone,
      email: customer.email,
      entriesTotal: 10,
      entriesRemaining: 7,
    });
    pass.id = DEMO_PASS_IDS.tableTennis;
    passesStore.passes.push(pass);
    dirty = true;
  }

  if (!passesStore.passes.some((pass) => pass.id === DEMO_PASS_IDS.ninja)) {
    const pass = createPassRecord({
      customerId: customer.id,
      planId: "ninja-8-lessons",
      participantName: `${customer.firstName} ${customer.lastName}`,
      phone: customer.phone,
      email: customer.email,
      entriesTotal: 8,
      entriesRemaining: 5,
    });
    pass.id = DEMO_PASS_IDS.ninja;
    passesStore.passes.push(pass);
    dirty = true;
  }

  if (!passesStore.standingRegistrations.some((row) => row.id === DEMO_STANDING_ID)) {
    const now = new Date().toISOString();
    passesStore.standingRegistrations.push({
      id: DEMO_STANDING_ID,
      customerId: customer.id,
      categoryId: "ninja-kids",
      slotId: "ninja-4-6-tue",
      participantName: `${customer.firstName} ${customer.lastName}`,
      phone: customer.phone,
      email: customer.email,
      passId: DEMO_PASS_IDS.ninja,
      planId: "ninja-8-lessons",
      notes: "דוגמה לרישום קבוע — שלישי 16:45",
      status: "active",
      createdAt: now,
      updatedAt: now,
    });
    dirty = true;
  }

  if (dirty) {
    await savePassesStore(passesStore);
  }
}

export function isDemoCustomerEmail(email: string): boolean {
  return normalizeCustomerEmail(email) === normalizeCustomerEmail(DEMO_CUSTOMER_EMAIL);
}
