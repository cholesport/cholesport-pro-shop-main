import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  ACCOUNT_PASSWORD_MIN_LENGTH,
  isAdminAccountEmail,
  isValidAccountPhone,
} from "@/data/account";
import {
  assertValidAvatarDataUrl,
  customerToProfile,
  getCustomerFromSessionToken,
} from "@/lib/customers/helpers.server";
import { sendPasswordResetEmail } from "@/lib/customers/notify.server";
import {
  hashCustomerPassword,
  verifyCustomerPassword,
} from "@/lib/customers/password.server";
import { createPasswordResetToken, verifyPasswordResetToken } from "@/lib/customers/reset.server";
import { createCustomerSessionToken } from "@/lib/customers/session.server";
import {
  findCustomerByEmail,
  loadCustomersStore,
  normalizeCustomerEmail,
  saveCustomersStore,
} from "@/lib/customers/store.server";

const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  password: z.string().min(ACCOUNT_PASSWORD_MIN_LENGTH),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const customerTokenSchema = z.object({
  customerToken: z.string().min(1),
});

const updateProfileSchema = customerTokenSchema.extend({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(1),
});

const updateAvatarSchema = customerTokenSchema.extend({
  avatarDataUrl: z.string().optional(),
});

const requestResetSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(ACCOUNT_PASSWORD_MIN_LENGTH),
});

export const registerCustomer = createServerFn({ method: "POST" })
  .inputValidator(registerSchema)
  .handler(async ({ data }) => {
    if (isAdminAccountEmail(data.email)) {
      throw new Error("כתובת האימייל הזו מיועדת לחשבון המנהל בלבד.");
    }
    if (!isValidAccountPhone(data.phone)) {
      throw new Error("נא להזין מספר טלפון תקין.");
    }

    const store = await loadCustomersStore();
    if (findCustomerByEmail(store, data.email)) {
      throw new Error("כבר קיים חשבון עם האימייל הזה.");
    }

    const now = new Date().toISOString();
    const customer = {
      id: crypto.randomUUID(),
      email: normalizeCustomerEmail(data.email),
      passwordHash: hashCustomerPassword(data.password),
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      phone: data.phone.trim(),
      registeredAt: now,
      updatedAt: now,
    };

    store.customers.push(customer);
    await saveCustomersStore(store);

    const customerToken = createCustomerSessionToken(customer.id, customer.email);
    return {
      customerToken,
      profile: customerToProfile(customer, true),
    };
  });

export const loginCustomer = createServerFn({ method: "POST" })
  .inputValidator(loginSchema)
  .handler(async ({ data }) => {
    if (isAdminAccountEmail(data.email)) {
      return { found: false as const };
    }

    const store = await loadCustomersStore();
    const customer = findCustomerByEmail(store, data.email);
    if (!customer || !verifyCustomerPassword(data.password, customer.passwordHash)) {
      throw new Error("אימייל או סיסמה שגויים.");
    }

    const customerToken = createCustomerSessionToken(customer.id, customer.email);
    return {
      found: true as const,
      customerToken,
      profile: customerToProfile(customer),
    };
  });

export const updateCustomerProfile = createServerFn({ method: "POST" })
  .inputValidator(updateProfileSchema)
  .handler(async ({ data }) => {
    if (!isValidAccountPhone(data.phone)) {
      throw new Error("נא להזין מספר טלפון תקין.");
    }

    const { store, customer } = await getCustomerFromSessionToken(data.customerToken);
    customer.firstName = data.firstName.trim();
    customer.lastName = data.lastName.trim();
    customer.phone = data.phone.trim();
    customer.updatedAt = new Date().toISOString();

    await saveCustomersStore(store);
    return { profile: customerToProfile(customer) };
  });

export const updateCustomerAvatar = createServerFn({ method: "POST" })
  .inputValidator(updateAvatarSchema)
  .handler(async ({ data }) => {
    assertValidAvatarDataUrl(data.avatarDataUrl);

    const { store, customer } = await getCustomerFromSessionToken(data.customerToken);
    customer.avatarDataUrl = data.avatarDataUrl || undefined;
    customer.updatedAt = new Date().toISOString();

    await saveCustomersStore(store);
    return { profile: customerToProfile(customer) };
  });

export const requestCustomerPasswordReset = createServerFn({ method: "POST" })
  .inputValidator(requestResetSchema)
  .handler(async ({ data }) => {
    if (isAdminAccountEmail(data.email)) {
      throw new Error("לחשבון המנהל יש להשתמש באיפוס סיסמה ידני.");
    }

    const store = await loadCustomersStore();
    const customer = findCustomerByEmail(store, data.email);

    if (customer) {
      const token = createPasswordResetToken(customer.email);
      await sendPasswordResetEmail(customer.email, token);
    }

    return {
      ok: true as const,
      message:
        "אם קיים חשבון עם האימייל הזה, נשלח אליו קישור מאומת לאיפוס סיסמה (תקף לשעה).",
    };
  });

export const resetCustomerPassword = createServerFn({ method: "POST" })
  .inputValidator(resetPasswordSchema)
  .handler(async ({ data }) => {
    const email = verifyPasswordResetToken(data.token);
    if (!email) {
      throw new Error("הקישור לא תקף או שפג תוקפו. בקשו קישור חדש.");
    }

    const store = await loadCustomersStore();
    const customer = findCustomerByEmail(store, email);
    if (!customer) {
      throw new Error("החשבון לא נמצא.");
    }

    customer.passwordHash = hashCustomerPassword(data.password);
    customer.updatedAt = new Date().toISOString();
    await saveCustomersStore(store);

    return { ok: true as const };
  });

export const getCustomerProfile = createServerFn({ method: "POST" })
  .inputValidator(customerTokenSchema)
  .handler(async ({ data }) => {
    const { customer } = await getCustomerFromSessionToken(data.customerToken);
    return { profile: customerToProfile(customer) };
  });
