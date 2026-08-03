import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ACTIVITIES_EXTERNAL_PAYMENT_URL, ACTIVITIES_PRICING } from "@/data/activities";
import type { ActivityRegistration } from "@/data/registrations";
import { PAYMENT_PENDING_SLOT_ID } from "@/data/registrations";
import { enrichActivityRegistration } from "@/lib/commerce/unified.server";
import { ensureDemoCustomerData } from "@/lib/demo/seed.server";
import { resolveCustomerId } from "@/lib/customers/match.server";
import { loadCustomersStore } from "@/lib/customers/store.server";
import { redeemPassForSession } from "@/lib/passes/redeem.server";
import { loadPassesStore } from "@/lib/passes/store.server";
import { cancelActivityRegistrationInternal } from "@/lib/registrations/cancel.server";
import { buildAdminRegistrationCustomerOptions } from "@/lib/registrations/customers.server";
import { getScheduleSlotById } from "@/lib/registrations/helpers";
import { notifyAdminActivityPayment } from "@/lib/registrations/notify.server";
import { assertAdminRegistrationsAccess } from "@/lib/registrations/auth.server";
import {
  loadRegistrationsStore,
  saveRegistrationsStore,
} from "@/lib/registrations/store.server";
import { getCustomerFromSessionToken } from "@/lib/customers/helpers.server";
import { formatScheduleDateIso } from "@/lib/activitySchedule";

const authTokenSchema = z.object({
  authToken: z.string().min(1),
});

const registrationInputSchema = z.object({
  authToken: z.string().min(1),
  registration: z.object({
    id: z.string().optional(),
    categoryId: z.enum([
      "table-tennis",
      "table-tennis-training",
      "ninja-kids",
      "functional-adults",
      "camps",
    ]),
    slotId: z.string().min(1),
    sessionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    participantName: z.string().min(1),
    participantAge: z.string().optional(),
    guardianName: z.string().optional(),
    phone: z.string().min(1),
    email: z.string().optional(),
    planId: z.string().optional(),
    notes: z.string().optional(),
    status: z.enum(["confirmed", "pending", "cancelled"]),
    source: z.enum(["manual", "whatsapp", "payment", "grow", "pass", "standing"]),
  }),
});

const deleteSchema = z.object({
  authToken: z.string().min(1),
  id: z.string().min(1),
});

const cancelSchema = z.object({
  authToken: z.string().min(1),
  id: z.string().min(1),
});

const customerTokenSchema = z.object({
  customerToken: z.string().min(1),
});

const customerCancelSchema = customerTokenSchema.extend({
  registrationId: z.string().min(1),
});

const adminRegisterSchema = z.object({
  authToken: z.string().min(1),
  slotId: z.string().min(1),
  sessionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  customerKey: z.string().optional(),
  participantName: z.string().min(1),
  participantAge: z.string().optional(),
  guardianName: z.string().optional(),
  phone: z.string().min(1),
  email: z.string().optional(),
  passId: z.string().optional(),
  planId: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["confirmed", "pending"]).default("confirmed"),
});

const activityPaymentSchema = z.object({
  customerToken: z.string().optional(),
  planId: z.string().min(1),
  participantName: z.string().min(1),
  participantAge: z.string().optional(),
  guardianName: z.string().optional(),
  phone: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  notes: z.string().optional(),
});

export const createActivityPaymentRegistration = createServerFn({ method: "POST" })
  .inputValidator(activityPaymentSchema)
  .handler(async ({ data }) => {
    const plan = ACTIVITIES_PRICING.find((row) => row.id === data.planId);
    if (!plan) {
      throw new Error("מסלול התשלום לא נמצא.");
    }

    const customersStore = await loadCustomersStore();
    let customerId: string | undefined;

    if (data.customerToken) {
      try {
        const { customer } = await getCustomerFromSessionToken(data.customerToken);
        customerId = customer.id;
      } catch {
        customerId = undefined;
      }
    }

    if (!customerId) {
      customerId = resolveCustomerId(customersStore, {
        email: data.email || undefined,
        phone: data.phone,
      });
    }

    const store = await loadRegistrationsStore();
    const now = new Date().toISOString();
    const sessionDate = formatScheduleDateIso(new Date());
    const paymentUrl = plan.paymentUrl ?? ACTIVITIES_EXTERNAL_PAYMENT_URL;

    const payload: ActivityRegistration = enrichActivityRegistration({
      id: crypto.randomUUID(),
      customerId,
      categoryId: plan.categoryId,
      slotId: PAYMENT_PENDING_SLOT_ID,
      sessionDate,
      participantName: data.participantName.trim(),
      participantAge: data.participantAge?.trim() || undefined,
      guardianName: data.guardianName?.trim() || undefined,
      phone: data.phone.trim(),
      email: data.email?.trim() || undefined,
      planId: plan.id,
      notes:
        data.notes?.trim() ||
        `נרשם לתשלום אונליין (${plan.name}) — ממתין לאישור ותיאום שיעור.`,
      status: "pending",
      source: "payment",
      createdAt: now,
      updatedAt: now,
    });

    store.registrations.unshift(payload);
    await saveRegistrationsStore(store);

    try {
      await notifyAdminActivityPayment(payload);
    } catch (error) {
      console.error("Activity payment notify failed:", error);
    }

    return {
      registration: payload,
      paymentUrl,
      updatedAt: store.updatedAt,
    };
  });

export const listRegistrationCustomerOptions = createServerFn({ method: "POST" })
  .inputValidator(authTokenSchema)
  .handler(async ({ data }) => {
    assertAdminRegistrationsAccess(data.authToken);
    await ensureDemoCustomerData();

    const [customersStore, registrationsStore, passesStore] = await Promise.all([
      loadCustomersStore(),
      loadRegistrationsStore(),
      loadPassesStore(),
    ]);

    return {
      customers: buildAdminRegistrationCustomerOptions({
        accounts: customersStore.customers,
        registrations: registrationsStore.registrations,
        passes: passesStore.passes,
      }),
      updatedAt: new Date().toISOString(),
    };
  });

export const adminRegisterToSession = createServerFn({ method: "POST" })
  .inputValidator(adminRegisterSchema)
  .handler(async ({ data }) => {
    assertAdminRegistrationsAccess(data.authToken);

    const slot = getScheduleSlotById(data.slotId);
    if (!slot) {
      throw new Error("משבצת השיעור לא נמצאה.");
    }

    const customersStore = await loadCustomersStore();
    let customerId: string | undefined;

    if (data.customerKey?.startsWith("id:")) {
      customerId = data.customerKey.slice(3);
    } else {
      customerId = resolveCustomerId(customersStore, {
        email: data.email,
        phone: data.phone,
      });
    }

    if (data.passId) {
      if (!customerId) {
        throw new Error("ניכוי מכרטיסייה אפשרי רק ללקוח עם חשבון במערכת.");
      }

      const result = await redeemPassForSession({
        passId: data.passId,
        customerId,
        slotId: data.slotId,
        sessionDate: data.sessionDate,
        participantName: data.participantName,
        participantAge: data.participantAge,
        source: "pass",
      });

      return {
        registration: result.registration,
        pass: result.pass,
        updatedAt: new Date().toISOString(),
      };
    }

    const store = await loadRegistrationsStore();
    const now = new Date().toISOString();

    const payload: ActivityRegistration = enrichActivityRegistration({
      id: crypto.randomUUID(),
      customerId,
      categoryId: slot.categoryId,
      slotId: data.slotId,
      sessionDate: data.sessionDate,
      participantName: data.participantName.trim(),
      participantAge: data.participantAge?.trim() || undefined,
      guardianName: data.guardianName?.trim() || undefined,
      phone: data.phone.trim(),
      email: data.email?.trim() || undefined,
      planId: data.planId?.trim() || undefined,
      notes: data.notes?.trim() || undefined,
      status: data.status,
      source: "manual",
      createdAt: now,
      updatedAt: now,
    });

    store.registrations.unshift(payload);
    await saveRegistrationsStore(store);

    return { registration: payload, updatedAt: store.updatedAt };
  });

export const listActivityRegistrations = createServerFn({ method: "POST" })
  .inputValidator(authTokenSchema)
  .handler(async ({ data }) => {
    assertAdminRegistrationsAccess(data.authToken);
    const store = await loadRegistrationsStore();
    return {
      registrations: store.registrations,
      updatedAt: store.updatedAt,
    };
  });

export const upsertActivityRegistration = createServerFn({ method: "POST" })
  .inputValidator(registrationInputSchema)
  .handler(async ({ data }) => {
    assertAdminRegistrationsAccess(data.authToken);
    const store = await loadRegistrationsStore();
    const customersStore = await loadCustomersStore();
    const now = new Date().toISOString();
    const input = data.registration;

    const customerId = resolveCustomerId(customersStore, {
      email: input.email,
      phone: input.phone,
    });

    const payload: ActivityRegistration = enrichActivityRegistration({
      id: input.id ?? crypto.randomUUID(),
      customerId,
      categoryId: input.categoryId,
      slotId: input.slotId,
      sessionDate: input.sessionDate,
      participantName: input.participantName.trim(),
      participantAge: input.participantAge?.trim() || undefined,
      guardianName: input.guardianName?.trim() || undefined,
      phone: input.phone.trim(),
      email: input.email?.trim() || undefined,
      planId: input.planId?.trim() || undefined,
      notes: input.notes?.trim() || undefined,
      status: input.status,
      source: input.source,
      createdAt: now,
      updatedAt: now,
    });

    const existingIndex = store.registrations.findIndex((row) => row.id === payload.id);
    if (
      existingIndex >= 0 &&
      store.registrations[existingIndex].status !== "cancelled" &&
      payload.status === "cancelled"
    ) {
      const result = await cancelActivityRegistrationInternal({
        registrationId: store.registrations[existingIndex].id,
        cancelledBy: "admin",
      });
      return {
        registration: result.registration,
        passAction: result.passAction,
        pass: result.pass,
        updatedAt: store.updatedAt,
      };
    }

    if (existingIndex >= 0) {
      payload.createdAt = store.registrations[existingIndex].createdAt;
      store.registrations[existingIndex] = payload;
    } else {
      store.registrations.push(payload);
    }

    await saveRegistrationsStore(store);
    return { registration: payload, updatedAt: store.updatedAt };
  });

export const cancelActivityRegistration = createServerFn({ method: "POST" })
  .inputValidator(cancelSchema)
  .handler(async ({ data }) => {
    assertAdminRegistrationsAccess(data.authToken);
    const result = await cancelActivityRegistrationInternal({
      registrationId: data.id,
      cancelledBy: "admin",
    });
    const store = await loadRegistrationsStore();
    return {
      registration: result.registration,
      passAction: result.passAction,
      pass: result.pass,
      updatedAt: store.updatedAt,
    };
  });

export const deleteActivityRegistration = createServerFn({ method: "POST" })
  .inputValidator(deleteSchema)
  .handler(async ({ data }) => {
    assertAdminRegistrationsAccess(data.authToken);
    const result = await cancelActivityRegistrationInternal({
      registrationId: data.id,
      cancelledBy: "admin",
    });
    const store = await loadRegistrationsStore();
    return {
      ok: true as const,
      registration: result.registration,
      passAction: result.passAction,
      pass: result.pass,
      updatedAt: store.updatedAt,
    };
  });

export const listCustomerActivityRegistrations = createServerFn({ method: "POST" })
  .inputValidator(customerTokenSchema)
  .handler(async ({ data }) => {
    const { customer } = await getCustomerFromSessionToken(data.customerToken);
    const store = await loadRegistrationsStore();
    const today = formatScheduleDateIso(new Date());

    const registrations = store.registrations
      .filter(
        (row) =>
          row.customerId === customer.id &&
          row.status !== "cancelled" &&
          row.sessionDate >= today,
      )
      .sort((a, b) => {
        const dateCmp = a.sessionDate.localeCompare(b.sessionDate, "he");
        if (dateCmp !== 0) return dateCmp;
        return a.participantName.localeCompare(b.participantName, "he");
      });

    return { registrations, updatedAt: store.updatedAt };
  });

export const cancelCustomerActivityRegistration = createServerFn({ method: "POST" })
  .inputValidator(customerCancelSchema)
  .handler(async ({ data }) => {
    const { customer } = await getCustomerFromSessionToken(data.customerToken);
    const result = await cancelActivityRegistrationInternal({
      registrationId: data.registrationId,
      cancelledBy: "customer",
      customerId: customer.id,
    });
    const store = await loadRegistrationsStore();
    return {
      registration: result.registration,
      passAction: result.passAction,
      pass: result.pass,
      updatedAt: store.updatedAt,
    };
  });
