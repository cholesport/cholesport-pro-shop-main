import { getPhoneDigits } from "@/data/account";
import type { CustomerRecord, CustomersStore } from "@/data/customers";
import { findCustomerByEmail } from "@/lib/customers/store.server";

export function normalizeCustomerPhone(phone: string): string {
  const digits = getPhoneDigits(phone);
  if (digits.startsWith("972") && digits.length >= 11) {
    return `0${digits.slice(3)}`;
  }
  return digits;
}

export function findCustomerByPhone(
  store: CustomersStore,
  phone: string,
): CustomerRecord | undefined {
  const normalized = normalizeCustomerPhone(phone);
  if (!normalized) return undefined;

  return store.customers.find(
    (customer) => normalizeCustomerPhone(customer.phone) === normalized,
  );
}

export function resolveCustomerId(
  store: CustomersStore,
  opts: { customerId?: string; email?: string; phone?: string },
): string | undefined {
  if (opts.customerId) {
    const byId = store.customers.find((customer) => customer.id === opts.customerId);
    if (byId) return byId.id;
  }

  if (opts.email) {
    const byEmail = findCustomerByEmail(store, opts.email);
    if (byEmail) return byEmail.id;
  }

  if (opts.phone) {
    const byPhone = findCustomerByPhone(store, opts.phone);
    if (byPhone) return byPhone.id;
  }

  return undefined;
}
