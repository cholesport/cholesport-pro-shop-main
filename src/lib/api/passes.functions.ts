import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { ActivityPass, StandingRegistration } from "@/data/passes";
import { ensureDemoCustomerData } from "@/lib/demo/seed.server";
import { getCustomerFromSessionToken } from "@/lib/customers/helpers.server";
import { resolveCustomerId } from "@/lib/customers/match.server";
import { loadCustomersStore } from "@/lib/customers/store.server";
import { assertAdminRegistrationsAccess } from "@/lib/registrations/auth.server";
import {
  createPassRecord,
  redeemPassForSession,
} from "@/lib/passes/redeem.server";
import {
  getStandingRegistrationById,
  registerStandingForNextSessionInternal,
} from "@/lib/passes/standing.server";
import {
  findPassById,
  getPassesForCustomer,
  loadPassesStore,
  savePassesStore,
} from "@/lib/passes/store.server";

const authTokenSchema = z.object({
  authToken: z.string().min(1),
});

const customerTokenSchema = z.object({
  customerToken: z.string().min(1),
});

const redeemSchema = customerTokenSchema.extend({
  passId: z.string().min(1),
  slotId: z.string().min(1),
  sessionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  participantName: z.string().optional(),
  participantAge: z.string().optional(),
});

const issuePassSchema = authTokenSchema.extend({
  customerId: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  planId: z.string().min(1),
  participantName: z.string().min(1),
  participantAge: z.string().optional(),
  entriesTotal: z.number().int().positive().optional(),
  entriesRemaining: z.number().int().nonnegative().optional(),
});

const adjustPassSchema = authTokenSchema.extend({
  passId: z.string().min(1),
  entriesRemaining: z.number().int().nonnegative(),
});

const standingSchema = authTokenSchema.extend({
  standing: z.object({
    id: z.string().optional(),
    customerId: z.string().optional(),
    categoryId: z.enum([
      "table-tennis",
      "table-tennis-kids",
      "table-tennis-training",
      "ninja-kids",
      "functional-adults",
      "camps",
    ]),
    slotId: z.string().min(1),
    participantName: z.string().min(1),
    participantAge: z.string().optional(),
    guardianName: z.string().optional(),
    phone: z.string().min(1),
    email: z.string().optional(),
    planId: z.string().optional(),
    passId: z.string().optional(),
    notes: z.string().optional(),
    status: z.enum(["active", "paused", "cancelled"]),
  }),
});

const standingActionSchema = authTokenSchema.extend({
  standingId: z.string().min(1),
});

const deleteStandingSchema = authTokenSchema.extend({
  id: z.string().min(1),
});

export const listCustomerPasses = createServerFn({ method: "POST" })
  .inputValidator(customerTokenSchema)
  .handler(async ({ data }) => {
    await ensureDemoCustomerData();
    const { customer } = await getCustomerFromSessionToken(data.customerToken);
    const store = await loadPassesStore();
    return {
      passes: getPassesForCustomer(store, customer.id).sort((a, b) =>
        b.updatedAt.localeCompare(a.updatedAt),
      ),
    };
  });

export const redeemCustomerPass = createServerFn({ method: "POST" })
  .inputValidator(redeemSchema)
  .handler(async ({ data }) => {
    const { customer } = await getCustomerFromSessionToken(data.customerToken);
    const result = await redeemPassForSession({
      passId: data.passId,
      customerId: customer.id,
      slotId: data.slotId,
      sessionDate: data.sessionDate,
      participantName: data.participantName,
      participantAge: data.participantAge,
      source: "pass",
    });
    return result;
  });

export const listAdminPasses = createServerFn({ method: "POST" })
  .inputValidator(authTokenSchema)
  .handler(async ({ data }) => {
    assertAdminRegistrationsAccess(data.authToken);
    await ensureDemoCustomerData();
    const store = await loadPassesStore();
    return {
      passes: store.passes.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
      standingRegistrations: store.standingRegistrations.sort((a, b) =>
        b.updatedAt.localeCompare(a.updatedAt),
      ),
      updatedAt: store.updatedAt,
    };
  });

export const issueAdminPass = createServerFn({ method: "POST" })
  .inputValidator(issuePassSchema)
  .handler(async ({ data }) => {
    assertAdminRegistrationsAccess(data.authToken);
    const customersStore = await loadCustomersStore();
    const customerId = resolveCustomerId(customersStore, {
      customerId: data.customerId,
      email: data.email,
      phone: data.phone,
    });
    if (!customerId) {
      throw new Error("לא נמצא לקוח — צריך חשבון רשום או התאמת אימייל/טלפון.");
    }

    const customer = customersStore.customers.find((row) => row.id === customerId);
    if (!customer) {
      throw new Error("הלקוח לא נמצא.");
    }

    const pass = createPassRecord({
      customerId,
      planId: data.planId,
      participantName: data.participantName,
      participantAge: data.participantAge,
      phone: data.phone?.trim() || customer.phone,
      email: data.email?.trim() || customer.email,
      entriesTotal: data.entriesTotal,
      entriesRemaining: data.entriesRemaining,
    });

    const store = await loadPassesStore();
    store.passes.unshift(pass);
    await savePassesStore(store);
    return { pass, updatedAt: store.updatedAt };
  });

export const adjustAdminPass = createServerFn({ method: "POST" })
  .inputValidator(adjustPassSchema)
  .handler(async ({ data }) => {
    assertAdminRegistrationsAccess(data.authToken);
    const store = await loadPassesStore();
    const pass = findPassById(store, data.passId);
    if (!pass) {
      throw new Error("הכרטיסייה לא נמצאה.");
    }

    pass.entriesRemaining = data.entriesRemaining;
    if (pass.entriesRemaining > pass.entriesTotal) {
      pass.entriesTotal = pass.entriesRemaining;
    }
    pass.status = pass.entriesRemaining > 0 ? "active" : "depleted";
    pass.updatedAt = new Date().toISOString();

    await savePassesStore(store);
    return { pass, updatedAt: store.updatedAt };
  });

export const upsertStandingRegistration = createServerFn({ method: "POST" })
  .inputValidator(standingSchema)
  .handler(async ({ data }) => {
    assertAdminRegistrationsAccess(data.authToken);
    const customersStore = await loadCustomersStore();
    const store = await loadPassesStore();
    const input = data.standing;
    const now = new Date().toISOString();

    const customerId =
      input.customerId ||
      resolveCustomerId(customersStore, {
        email: input.email,
        phone: input.phone,
      });

    const payload: StandingRegistration = {
      id: input.id ?? crypto.randomUUID(),
      customerId,
      categoryId: input.categoryId,
      slotId: input.slotId,
      participantName: input.participantName.trim(),
      participantAge: input.participantAge?.trim() || undefined,
      guardianName: input.guardianName?.trim() || undefined,
      phone: input.phone.trim(),
      email: input.email?.trim() || undefined,
      planId: input.planId?.trim() || undefined,
      passId: input.passId?.trim() || undefined,
      notes: input.notes?.trim() || undefined,
      status: input.status,
      createdAt: now,
      updatedAt: now,
    };

    const index = store.standingRegistrations.findIndex((row) => row.id === payload.id);
    if (index >= 0) {
      payload.createdAt = store.standingRegistrations[index].createdAt;
      store.standingRegistrations[index] = payload;
    } else {
      store.standingRegistrations.unshift(payload);
    }

    await savePassesStore(store);
    return { standing: payload, updatedAt: store.updatedAt };
  });

export const deleteStandingRegistration = createServerFn({ method: "POST" })
  .inputValidator(deleteStandingSchema)
  .handler(async ({ data }) => {
    assertAdminRegistrationsAccess(data.authToken);
    const store = await loadPassesStore();
    const next = store.standingRegistrations.filter((row) => row.id !== data.id);
    if (next.length === store.standingRegistrations.length) {
      throw new Error("הרישום הקבוע לא נמצא.");
    }
    store.standingRegistrations = next;
    await savePassesStore(store);
    return { ok: true as const, updatedAt: store.updatedAt };
  });

export const registerStandingForNextSession = createServerFn({ method: "POST" })
  .inputValidator(standingActionSchema)
  .handler(async ({ data }) => {
    assertAdminRegistrationsAccess(data.authToken);
    const store = await loadPassesStore();
    const standing = await getStandingRegistrationById(store, data.standingId);
    if (!standing) {
      throw new Error("הרישום הקבוע לא נמצא.");
    }
    if (standing.status !== "active") {
      throw new Error("הרישום הקבוע אינו פעיל.");
    }

    return registerStandingForNextSessionInternal(standing);
  });

export const registerAllStandingForNextSession = createServerFn({ method: "POST" })
  .inputValidator(authTokenSchema)
  .handler(async ({ data }) => {
    assertAdminRegistrationsAccess(data.authToken);
    const store = await loadPassesStore();
    const active = store.standingRegistrations.filter((row) => row.status === "active");
    const results: Array<{ standingId: string; ok: boolean; message: string }> = [];

    for (const standing of active) {
      try {
        await registerStandingForNextSessionInternal(standing);
        results.push({
          standingId: standing.id,
          ok: true,
          message: `${standing.participantName}: נרשם לשיעור הקרוב`,
        });
      } catch (error) {
        results.push({
          standingId: standing.id,
          ok: false,
          message:
            error instanceof Error
              ? `${standing.participantName}: ${error.message}`
              : `${standing.participantName}: שגיאה`,
        });
      }
    }

    return { results };
  });
