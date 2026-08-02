import type { AdminRegistrationCustomerOption } from "@/data/adminRegistrationCustomers";
import type { CustomerRecord } from "@/data/customers";
import type { ActivityPass } from "@/data/passes";
import type { ActivityRegistration } from "@/data/registrations";
import { normalizeCustomerPhone } from "@/lib/customers/match.server";
import { normalizeCustomerEmail } from "@/lib/customers/store.server";

function buildContactKey(opts: {
  customerId?: string;
  email?: string;
  phone: string;
}): string {
  if (opts.customerId) return `id:${opts.customerId}`;
  if (opts.email) return `email:${normalizeCustomerEmail(opts.email)}`;
  return `phone:${normalizeCustomerPhone(opts.phone)}`;
}

function getDisplayName(customer: CustomerRecord): string {
  return `${customer.firstName} ${customer.lastName}`.trim();
}

function mapPass(pass: ActivityPass): AdminRegistrationCustomerOption["activePasses"][number] {
  return {
    id: pass.id,
    planId: pass.planId,
    planName: pass.planName,
    categoryId: pass.categoryId,
    categoryName: pass.categoryName,
    entriesRemaining: pass.entriesRemaining,
    entriesTotal: pass.entriesTotal,
  };
}

export function buildAdminRegistrationCustomerOptions(input: {
  accounts: CustomerRecord[];
  registrations: ActivityRegistration[];
  passes: ActivityPass[];
}): AdminRegistrationCustomerOption[] {
  const map = new Map<string, AdminRegistrationCustomerOption>();

  function ensureOption(opts: {
    key: string;
    customerId?: string;
    fullName: string;
    phone: string;
    email?: string;
    hasAccount: boolean;
    seenAt: string;
  }): AdminRegistrationCustomerOption {
    const existing = map.get(opts.key);
    if (existing) {
      if (!existing.customerId && opts.customerId) existing.customerId = opts.customerId;
      if (!existing.email && opts.email) existing.email = opts.email;
      if (!existing.hasAccount && opts.hasAccount) existing.hasAccount = opts.hasAccount;
      if (existing.fullName === existing.phone && opts.fullName !== opts.phone) {
        existing.fullName = opts.fullName;
      }
      existing.lastSeenAt = [existing.lastSeenAt, opts.seenAt].sort().at(-1) ?? opts.seenAt;
      return existing;
    }

    const created: AdminRegistrationCustomerOption = {
      key: opts.key,
      customerId: opts.customerId,
      fullName: opts.fullName,
      phone: opts.phone,
      email: opts.email,
      hasAccount: opts.hasAccount,
      activePasses: [],
      lastSeenAt: opts.seenAt,
    };
    map.set(opts.key, created);
    return created;
  }

  for (const account of input.accounts) {
    ensureOption({
      key: buildContactKey({
        customerId: account.id,
        email: account.email,
        phone: account.phone,
      }),
      customerId: account.id,
      fullName: getDisplayName(account),
      phone: account.phone,
      email: account.email,
      hasAccount: true,
      seenAt: account.updatedAt,
    });
  }

  for (const registration of input.registrations) {
    ensureOption({
      key: buildContactKey({
        customerId: registration.customerId,
        email: registration.email,
        phone: registration.phone,
      }),
      customerId: registration.customerId,
      fullName: registration.participantName,
      phone: registration.phone,
      email: registration.email,
      hasAccount: Boolean(registration.customerId),
      seenAt: registration.updatedAt,
    });
  }

  for (const pass of input.passes) {
    const option = ensureOption({
      key: buildContactKey({
        customerId: pass.customerId,
        email: pass.email,
        phone: pass.phone,
      }),
      customerId: pass.customerId,
      fullName: pass.participantName,
      phone: pass.phone,
      email: pass.email,
      hasAccount: Boolean(pass.customerId),
      seenAt: pass.updatedAt,
    });

    if (pass.status === "active" && pass.entriesRemaining > 0) {
      const mapped = mapPass(pass);
      if (!option.activePasses.some((row) => row.id === mapped.id)) {
        option.activePasses.push(mapped);
      }
    }
  }

  return [...map.values()].sort((a, b) => {
    const name = a.fullName.localeCompare(b.fullName, "he");
    if (name !== 0) return name;
    return b.lastSeenAt.localeCompare(a.lastSeenAt);
  });
}
