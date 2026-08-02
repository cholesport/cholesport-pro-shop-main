import type {
  ActivePassReportRow,
  ActiveSubscriptionReportRow,
  AdminReportsSnapshot,
} from "@/data/adminReports";
import { getActivityCategoryMeta, getActivityPlanMeta } from "@/lib/commerce/catalog";
import { backfillCustomerLinks } from "@/lib/commerce/unified.server";
import { ensureDemoCustomerData } from "@/lib/demo/seed.server";
import { loadPassesStore } from "@/lib/passes/store.server";
import { loadRegistrationsStore } from "@/lib/registrations/store.server";

function subscriptionKey(row: {
  participantName: string;
  phone: string;
  planId?: string;
}): string {
  return `${row.phone}:${row.participantName}:${row.planId ?? "unknown"}`;
}

export async function buildAdminReportsSnapshot(): Promise<AdminReportsSnapshot> {
  await backfillCustomerLinks();
  await ensureDemoCustomerData();

  const [registrationsStore, passesStore] = await Promise.all([
    loadRegistrationsStore(),
    loadPassesStore(),
  ]);

  const subscriptionMap = new Map<string, ActiveSubscriptionReportRow>();

  for (const registration of registrationsStore.registrations) {
    const planMeta = getActivityPlanMeta(registration.planId);
    const isSubscription = registration.isSubscription ?? planMeta.isSubscription;
    if (!isSubscription || registration.status === "cancelled" || !registration.planId) {
      continue;
    }

    const categoryMeta = getActivityCategoryMeta(registration.categoryId);
    const key = subscriptionKey(registration);
    const row: ActiveSubscriptionReportRow = {
      id: registration.id,
      participantName: registration.participantName,
      phone: registration.phone,
      email: registration.email,
      planId: registration.planId,
      planName: registration.planName ?? planMeta.planName ?? registration.planId,
      categoryName: registration.categoryName ?? categoryMeta.categoryName,
      status: registration.status,
      updatedAt: registration.updatedAt,
      hasAccount: Boolean(registration.customerId),
    };

    const existing = subscriptionMap.get(key);
    if (!existing || existing.updatedAt < row.updatedAt) {
      subscriptionMap.set(key, row);
    }
  }

  const activePasses: ActivePassReportRow[] = passesStore.passes
    .filter((pass) => pass.status === "active" && pass.entriesRemaining > 0)
    .map((pass) => ({
      id: pass.id,
      participantName: pass.participantName,
      phone: pass.phone,
      email: pass.email,
      planId: pass.planId,
      planName: pass.planName,
      categoryName: pass.categoryName,
      entriesRemaining: pass.entriesRemaining,
      entriesTotal: pass.entriesTotal,
      status: pass.status,
      purchasedAt: pass.purchasedAt,
      updatedAt: pass.updatedAt,
      hasAccount: Boolean(pass.customerId),
    }))
    .sort((a, b) => {
      const category = a.categoryName.localeCompare(b.categoryName, "he");
      if (category !== 0) return category;
      return a.participantName.localeCompare(b.participantName, "he");
    });

  const activeSubscriptions = [...subscriptionMap.values()].sort((a, b) => {
    const category = a.categoryName.localeCompare(b.categoryName, "he");
    if (category !== 0) return category;
    return a.participantName.localeCompare(b.participantName, "he");
  });

  return {
    activeSubscriptions,
    activePasses,
    updatedAt: new Date().toISOString(),
  };
}
