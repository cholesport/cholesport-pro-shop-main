import { randomBytes } from "node:crypto";
import type { CustomerInquiryRecord, CustomerRecord } from "@/data/customers";
import { isValidAccountPhone } from "@/data/account";
import { hashCustomerPassword } from "@/lib/customers/password.server";
import {
  findCustomerByEmail,
  loadCustomersStore,
  normalizeCustomerEmail,
  saveCustomersStore,
} from "@/lib/customers/store.server";

export type CustomerLeadInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  inquiryType: string;
  source: string;
  summary: string;
  interestLabel: string;
  details?: Record<string, string>;
};

function createInquiryRecord(input: Omit<CustomerLeadInput, "firstName" | "lastName" | "email" | "phone">): CustomerInquiryRecord {
  return {
    id: crypto.randomUUID(),
    type: input.inquiryType,
    source: input.source,
    summary: input.summary,
    details: input.details,
    createdAt: new Date().toISOString(),
  };
}

function appendUniqueInterest(customer: CustomerRecord, interestLabel: string) {
  const interests = customer.interests ?? [];
  if (!interests.includes(interestLabel)) {
    customer.interests = [...interests, interestLabel];
  }
}

export async function upsertCustomerLeadFromInquiry(
  input: CustomerLeadInput,
): Promise<{ customerId: string; created: boolean }> {
  if (!isValidAccountPhone(input.phone)) {
    throw new Error("נא למלא מספר טלפון תקין.");
  }

  const store = await loadCustomersStore();
  const now = new Date().toISOString();
  const inquiry = createInquiryRecord(input);
  const existing = findCustomerByEmail(store, input.email);

  if (existing) {
    existing.firstName = input.firstName.trim() || existing.firstName;
    existing.lastName = input.lastName.trim() || existing.lastName;
    existing.phone = input.phone.trim() || existing.phone;
    existing.inquiries = [...(existing.inquiries ?? []), inquiry];
    appendUniqueInterest(existing, input.interestLabel);
    existing.updatedAt = now;
    await saveCustomersStore(store);
    return { customerId: existing.id, created: false };
  }

  const customer: CustomerRecord = {
    id: crypto.randomUUID(),
    email: normalizeCustomerEmail(input.email),
    passwordHash: hashCustomerPassword(randomBytes(32).toString("hex")),
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    phone: input.phone.trim(),
    registeredAt: now,
    updatedAt: now,
    accountType: "lead",
    interests: [input.interestLabel],
    inquiries: [inquiry],
  };

  store.customers.push(customer);
  await saveCustomersStore(store);
  return { customerId: customer.id, created: true };
}

export function isLeadCustomer(customer: CustomerRecord): boolean {
  return customer.accountType === "lead";
}
