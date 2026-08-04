import type {
  CustomerCommerceActivity,
  CustomerCommerceCategoryGroup,
  CustomerCommerceHistory,
  CustomerCommerceShopOrder,
  CommerceDomain,
  ServiceCustomerSummary,
  ShopCustomerSummary,
  UnifiedCustomerSummary,
} from "@/data/commerce";
import type { CustomerRecord } from "@/data/customers";
import type { ActivityPass } from "@/data/passes";
import type { StandingRegistration } from "@/data/passes";
import type { ActivityRegistration } from "@/data/registrations";
import type { ShopOrder } from "@/data/shopOrders";
import {
  getActivityCategoryMeta,
  getActivityPlanMeta,
  enrichShopOrderItem,
} from "@/lib/commerce/catalog";
import {
  findCustomerByPhone,
  normalizeCustomerPhone,
  resolveCustomerId,
} from "@/lib/customers/match.server";
import {
  findCustomerByEmail,
  findCustomerById,
  loadCustomersStore,
  normalizeCustomerEmail,
} from "@/lib/customers/store.server";
import { loadRegistrationsStore, saveRegistrationsStore } from "@/lib/registrations/store.server";
import { loadShopOrdersStore, saveShopOrdersStore } from "@/lib/orders/store.server";
import { loadPassesStore } from "@/lib/passes/store.server";

type MatchableCustomer = {
  customerId?: string;
  email?: string;
  phone: string;
};

function matchesCustomerRef(
  record: MatchableCustomer,
  ref: MatchableCustomer,
): boolean {
  if (record.customerId && ref.customerId && record.customerId === ref.customerId) {
    return true;
  }
  if (record.email && ref.email) {
    if (normalizeCustomerEmail(record.email) === normalizeCustomerEmail(ref.email)) {
      return true;
    }
  }
  return normalizeCustomerPhone(record.phone) === normalizeCustomerPhone(ref.phone);
}

function toShopOrderView(order: ShopOrder): CustomerCommerceShopOrder {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    createdAt: order.createdAt,
    status: order.status,
    subtotal: order.subtotal,
    delivery: order.delivery,
    items: order.items.map((item) => ({
      productId: item.productId,
      title: item.title,
      quantity: item.quantity,
      price: item.price,
      categorySlug: item.categorySlug,
      categoryName: item.categoryName,
      productCat: item.productCat,
    })),
  };
}

function toActivityView(registration: ActivityRegistration): CustomerCommerceActivity {
  const categoryMeta = getActivityCategoryMeta(registration.categoryId);
  const planMeta = getActivityPlanMeta(registration.planId);

  return {
    id: registration.id,
    categoryId: registration.categoryId,
    categoryName: registration.categoryName ?? categoryMeta.categoryName,
    planId: registration.planId,
    planName: registration.planName ?? planMeta.planName,
    isSubscription: registration.isSubscription ?? planMeta.isSubscription,
    participantName: registration.participantName,
    sessionDate: registration.sessionDate,
    status: registration.status,
    createdAt: registration.createdAt,
  };
}

function isActiveSubscription(activity: CustomerCommerceActivity): boolean {
  return Boolean(activity.isSubscription && activity.status !== "cancelled");
}

export function buildCustomerCommerceHistory(
  ref: MatchableCustomer,
  orders: ShopOrder[],
  registrations: ActivityRegistration[],
): CustomerCommerceHistory {
  const shopOrders = orders
    .filter((order) =>
      matchesCustomerRef(
        {
          customerId: order.customerId,
          email: order.customer.email,
          phone: order.customer.phone,
        },
        ref,
      ),
    )
    .map(toShopOrderView);

  const activities = registrations
    .filter((registration) =>
      matchesCustomerRef(
        {
          customerId: registration.customerId,
          email: registration.email,
          phone: registration.phone,
        },
        ref,
      ),
    )
    .map(toActivityView);

  const categoryMap = new Map<string, CustomerCommerceCategoryGroup>();

  for (const order of shopOrders) {
    for (const item of order.items) {
      const categoryKey = item.categorySlug ?? item.productCat ?? "other";
      const categoryName = item.categoryName ?? "מוצרים אחרים";
      const group =
        categoryMap.get(`shop:${categoryKey}`) ??
        ({
          domain: "shop",
          categoryKey,
          categoryName,
          shopOrders: [],
          shopItemCount: 0,
          activities: [],
          activeSubscriptions: [],
        } satisfies CustomerCommerceCategoryGroup);

      if (!group.shopOrders.some((row) => row.id === order.id)) {
        group.shopOrders.push(order);
      }
      group.shopItemCount += item.quantity;
      categoryMap.set(`shop:${categoryKey}`, group);
    }
  }

  for (const activity of activities) {
    const categoryKey = activity.categoryId;
    const group =
      categoryMap.get(`activities:${categoryKey}`) ??
      ({
        domain: "activities",
        categoryKey,
        categoryName: activity.categoryName,
        shopOrders: [],
        shopItemCount: 0,
        activities: [],
        activeSubscriptions: [],
      } satisfies CustomerCommerceCategoryGroup);

    group.activities.push(activity);
    if (isActiveSubscription(activity)) {
      group.activeSubscriptions.push(activity);
    }
    categoryMap.set(`activities:${categoryKey}`, group);
  }

  const categories = [...categoryMap.values()].sort((a, b) =>
    a.categoryName.localeCompare(b.categoryName, "he"),
  );

  return {
    shopOrders,
    activities,
    categories,
    stats: {
      shopOrderCount: shopOrders.length,
      activityCount: activities.length,
      subscriptionCount: activities.filter(isActiveSubscription).length,
    },
  };
}

function getCustomerDisplayName(customer: CustomerRecord): string {
  return `${customer.firstName} ${customer.lastName}`.trim();
}

function getGuestDisplayName(opts: {
  firstName?: string;
  lastName?: string;
  participantName?: string;
  email?: string;
  phone: string;
}): string {
  const fullName = [opts.firstName, opts.lastName].filter(Boolean).join(" ").trim();
  if (fullName) return fullName;
  if (opts.participantName) return opts.participantName;
  if (opts.email) return opts.email;
  return opts.phone;
}

function buildSummaryKey(opts: {
  customerId?: string;
  email?: string;
  phone: string;
}): string {
  if (opts.customerId) return `id:${opts.customerId}`;
  if (opts.email) return `email:${normalizeCustomerEmail(opts.email)}`;
  return `phone:${normalizeCustomerPhone(opts.phone)}`;
}

export function buildUnifiedCustomerSummaries(
  customers: CustomerRecord[],
  orders: ShopOrder[],
  registrations: ActivityRegistration[],
): UnifiedCustomerSummary[] {
  const summaries = new Map<string, UnifiedCustomerSummary>();

  function ensureSummary(opts: {
    key: string;
    customerId?: string;
    email?: string;
    phone: string;
    name: string;
    hasAccount: boolean;
  }) {
    const existing = summaries.get(opts.key);
    if (existing) {
      if (!existing.customerId && opts.customerId) existing.customerId = opts.customerId;
      if (!existing.email && opts.email) existing.email = opts.email;
      if (!existing.hasAccount && opts.hasAccount) existing.hasAccount = opts.hasAccount;
      if (existing.name === existing.phone && opts.name !== opts.phone) {
        existing.name = opts.name;
      }
      return existing;
    }

    const created: UnifiedCustomerSummary = {
      key: opts.key,
      customerId: opts.customerId,
      email: opts.email,
      phone: opts.phone,
      name: opts.name,
      hasAccount: opts.hasAccount,
      shopOrderCount: 0,
      activityCount: 0,
      subscriptionCount: 0,
      lastActivityAt: "",
      categoryNames: [],
    };
    summaries.set(opts.key, created);
    return created;
  }

  for (const customer of customers) {
    ensureSummary({
      key: buildSummaryKey({
        customerId: customer.id,
        email: customer.email,
        phone: customer.phone,
      }),
      customerId: customer.id,
      email: customer.email,
      phone: customer.phone,
      name: getCustomerDisplayName(customer),
      hasAccount: true,
    });
  }

  for (const order of orders) {
    const key = buildSummaryKey({
      customerId: order.customerId,
      email: order.customer.email,
      phone: order.customer.phone,
    });
    const summary = ensureSummary({
      key,
      customerId: order.customerId,
      email: order.customer.email,
      phone: order.customer.phone,
      name: getGuestDisplayName({
        firstName: order.customer.firstName,
        lastName: order.customer.lastName,
        email: order.customer.email,
        phone: order.customer.phone,
      }),
      hasAccount: Boolean(order.customerId),
    });
    summary.shopOrderCount += 1;
    summary.lastActivityAt = [summary.lastActivityAt, order.createdAt]
      .filter(Boolean)
      .sort()
      .at(-1) ?? order.createdAt;
    for (const item of order.items) {
      const categoryName = item.categoryName ?? "מוצרים";
      if (!summary.categoryNames.includes(categoryName)) {
        summary.categoryNames.push(categoryName);
      }
    }
  }

  for (const registration of registrations) {
    const key = buildSummaryKey({
      customerId: registration.customerId,
      email: registration.email,
      phone: registration.phone,
    });
    const categoryMeta = getActivityCategoryMeta(registration.categoryId);
    const planMeta = getActivityPlanMeta(registration.planId);
    const summary = ensureSummary({
      key,
      customerId: registration.customerId,
      email: registration.email,
      phone: registration.phone,
      name: getGuestDisplayName({
        participantName: registration.participantName,
        email: registration.email,
        phone: registration.phone,
      }),
      hasAccount: Boolean(registration.customerId),
    });
    summary.activityCount += 1;
    if (
      (registration.isSubscription ?? planMeta.isSubscription) &&
      registration.status !== "cancelled"
    ) {
      summary.subscriptionCount += 1;
    }
    summary.lastActivityAt = [summary.lastActivityAt, registration.updatedAt]
      .filter(Boolean)
      .sort()
      .at(-1) ?? registration.updatedAt;
    const categoryName = registration.categoryName ?? categoryMeta.categoryName;
    if (!summary.categoryNames.includes(categoryName)) {
      summary.categoryNames.push(categoryName);
    }
  }

  return [...summaries.values()].sort((a, b) =>
    b.lastActivityAt.localeCompare(a.lastActivityAt),
  );
}

export function buildShopCustomerSummaries(orders: ShopOrder[]): ShopCustomerSummary[] {
  const summaries = new Map<string, ShopCustomerSummary>();

  for (const order of orders) {
    const key = buildSummaryKey({
      customerId: order.customerId,
      email: order.customer.email,
      phone: order.customer.phone,
    });
    const existing = summaries.get(key);
    const summary: ShopCustomerSummary = existing ?? {
      key,
      customerId: order.customerId,
      email: order.customer.email,
      phone: order.customer.phone,
      name: getGuestDisplayName({
        firstName: order.customer.firstName,
        lastName: order.customer.lastName,
        email: order.customer.email,
        phone: order.customer.phone,
      }),
      hasAccount: Boolean(order.customerId),
      shopOrderCount: 0,
      totalSpent: 0,
      lastOrderAt: order.createdAt,
      categoryNames: [],
    };

    summary.shopOrderCount += 1;
    summary.totalSpent += order.subtotal;
    summary.lastOrderAt = [summary.lastOrderAt, order.createdAt].sort().at(-1) ?? order.createdAt;
    if (!summary.customerId && order.customerId) summary.customerId = order.customerId;
    if (!summary.email && order.customer.email) summary.email = order.customer.email;
    if (!summary.hasAccount && order.customerId) summary.hasAccount = true;

    for (const item of order.items) {
      const categoryName = item.categoryName ?? "מוצרים";
      if (!summary.categoryNames.includes(categoryName)) {
        summary.categoryNames.push(categoryName);
      }
    }

    summaries.set(key, summary);
  }

  return [...summaries.values()].sort((a, b) => b.lastOrderAt.localeCompare(a.lastOrderAt));
}

export function buildServiceCustomerSummaries(
  registrations: ActivityRegistration[],
  passes: ActivityPass[],
  standingRegistrations: StandingRegistration[],
): ServiceCustomerSummary[] {
  const summaries = new Map<string, ServiceCustomerSummary>();

  function ensureServiceSummary(opts: {
    key: string;
    customerId?: string;
    email?: string;
    phone: string;
    name: string;
    hasAccount: boolean;
  }): ServiceCustomerSummary {
    const existing = summaries.get(opts.key);
    if (existing) {
      if (!existing.customerId && opts.customerId) existing.customerId = opts.customerId;
      if (!existing.email && opts.email) existing.email = opts.email;
      if (!existing.hasAccount && opts.hasAccount) existing.hasAccount = opts.hasAccount;
      if (existing.name === existing.phone && opts.name !== opts.phone) {
        existing.name = opts.name;
      }
      return existing;
    }

    const created: ServiceCustomerSummary = {
      key: opts.key,
      customerId: opts.customerId,
      email: opts.email,
      phone: opts.phone,
      name: opts.name,
      hasAccount: opts.hasAccount,
      activityCount: 0,
      subscriptionCount: 0,
      passCount: 0,
      activePassPunches: 0,
      standingCount: 0,
      inquiryCount: 0,
      lastActivityAt: "",
      categoryNames: [],
    };
    summaries.set(opts.key, created);
    return created;
  }

  for (const registration of registrations) {
    const key = buildSummaryKey({
      customerId: registration.customerId,
      email: registration.email,
      phone: registration.phone,
    });
    const categoryMeta = getActivityCategoryMeta(registration.categoryId);
    const planMeta = getActivityPlanMeta(registration.planId);
    const summary = ensureServiceSummary({
      key,
      customerId: registration.customerId,
      email: registration.email,
      phone: registration.phone,
      name: getGuestDisplayName({
        participantName: registration.participantName,
        email: registration.email,
        phone: registration.phone,
      }),
      hasAccount: Boolean(registration.customerId),
    });

    summary.activityCount += 1;
    if (
      (registration.isSubscription ?? planMeta.isSubscription) &&
      registration.status !== "cancelled"
    ) {
      summary.subscriptionCount += 1;
    }
    summary.lastActivityAt =
      [summary.lastActivityAt, registration.updatedAt].filter(Boolean).sort().at(-1) ??
      registration.updatedAt;
    const categoryName = registration.categoryName ?? categoryMeta.categoryName;
    if (!summary.categoryNames.includes(categoryName)) {
      summary.categoryNames.push(categoryName);
    }
  }

  for (const pass of passes) {
    const key = buildSummaryKey({
      customerId: pass.customerId,
      email: pass.email,
      phone: pass.phone,
    });
    const summary = ensureServiceSummary({
      key,
      customerId: pass.customerId,
      email: pass.email,
      phone: pass.phone,
      name: pass.participantName,
      hasAccount: true,
    });

    summary.passCount += 1;
    if (pass.status === "active") {
      summary.activePassPunches += pass.entriesRemaining;
    }
    summary.lastActivityAt =
      [summary.lastActivityAt, pass.updatedAt].filter(Boolean).sort().at(-1) ?? pass.updatedAt;
    if (!summary.categoryNames.includes(pass.categoryName)) {
      summary.categoryNames.push(pass.categoryName);
    }
  }

  for (const standing of standingRegistrations) {
    if (standing.status === "cancelled") continue;

    const key = buildSummaryKey({
      customerId: standing.customerId,
      email: standing.email,
      phone: standing.phone,
    });
    const categoryMeta = getActivityCategoryMeta(standing.categoryId);
    const summary = ensureServiceSummary({
      key,
      customerId: standing.customerId,
      email: standing.email,
      phone: standing.phone,
      name: standing.participantName,
      hasAccount: Boolean(standing.customerId),
    });

    summary.standingCount += 1;
    summary.lastActivityAt =
      [summary.lastActivityAt, standing.updatedAt].filter(Boolean).sort().at(-1) ??
      standing.updatedAt;
    if (!summary.categoryNames.includes(categoryMeta.categoryName)) {
      summary.categoryNames.push(categoryMeta.categoryName);
    }
  }

  return [...summaries.values()].sort((a, b) =>
    b.lastActivityAt.localeCompare(a.lastActivityAt),
  );
}

export function mergeLeadCustomersIntoServiceSummaries(
  customers: CustomerRecord[],
  summaries: ServiceCustomerSummary[],
): ServiceCustomerSummary[] {
  const merged = new Map(summaries.map((summary) => [summary.key, { ...summary }]));

  for (const customer of customers) {
    const inquiries = customer.inquiries ?? [];
    const interests = customer.interests ?? [];
    if (inquiries.length === 0 && interests.length === 0) continue;

    const key = buildSummaryKey({
      customerId: customer.id,
      email: customer.email,
      phone: customer.phone,
    });

    const existing = merged.get(key);
    const summary: ServiceCustomerSummary = existing ?? {
      key,
      customerId: customer.id,
      email: customer.email,
      phone: customer.phone,
      name: getCustomerDisplayName(customer),
      hasAccount: true,
      isLeadAccount: customer.accountType === "lead",
      activityCount: 0,
      subscriptionCount: 0,
      passCount: 0,
      activePassPunches: 0,
      standingCount: 0,
      inquiryCount: 0,
      lastActivityAt: "",
      categoryNames: [],
      interestLabels: [],
    };

    summary.customerId = customer.id;
    summary.email = customer.email;
    summary.phone = customer.phone;
    summary.hasAccount = true;
    summary.isLeadAccount = customer.accountType === "lead";
    summary.inquiryCount = Math.max(summary.inquiryCount, inquiries.length);
    summary.interestLabels = [...new Set([...(summary.interestLabels ?? []), ...interests])];

    for (const interest of interests) {
      if (!summary.categoryNames.includes(interest)) {
        summary.categoryNames.push(interest);
      }
    }

    const latestInquiryAt = inquiries
      .map((inquiry) => inquiry.createdAt)
      .sort()
      .at(-1);
    if (latestInquiryAt) {
      summary.lastActivityAt =
        [summary.lastActivityAt, latestInquiryAt].filter(Boolean).sort().at(-1) ?? latestInquiryAt;
    }

    merged.set(key, summary);
  }

  return [...merged.values()].sort((a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt));
}

export function filterHistoryByDomain(
  history: CustomerCommerceHistory,
  domain: CommerceDomain,
): CustomerCommerceHistory {
  if (domain === "shop") {
    return {
      shopOrders: history.shopOrders,
      activities: [],
      categories: history.categories.filter((group) => group.domain === "shop"),
      stats: {
        shopOrderCount: history.stats.shopOrderCount,
        activityCount: 0,
        subscriptionCount: 0,
      },
    };
  }

  return {
    shopOrders: [],
    activities: history.activities,
    categories: history.categories.filter((group) => group.domain === "activities"),
    stats: {
      shopOrderCount: 0,
      activityCount: history.stats.activityCount,
      subscriptionCount: history.stats.subscriptionCount,
    },
  };
}

export async function backfillCustomerLinks(): Promise<void> {
  const [customersStore, ordersStore, registrationsStore] = await Promise.all([
    loadCustomersStore(),
    loadShopOrdersStore(),
    loadRegistrationsStore(),
  ]);

  let ordersDirty = false;
  let registrationsDirty = false;

  for (const order of ordersStore.orders) {
    const customerId = resolveCustomerId(customersStore, {
      customerId: order.customerId,
      email: order.customer.email,
      phone: order.customer.phone,
    });
    if (customerId && order.customerId !== customerId) {
      order.customerId = customerId;
      ordersDirty = true;
    }

    const enrichedItems = order.items.map((item) => {
      if (item.categoryName) return item;
      return enrichShopOrderItem(item);
    });
    if (enrichedItems.some((item, index) => item !== order.items[index])) {
      order.items = enrichedItems;
      ordersDirty = true;
    }
  }

  for (const registration of registrationsStore.registrations) {
    const customerId = resolveCustomerId(customersStore, {
      customerId: registration.customerId,
      email: registration.email,
      phone: registration.phone,
    });
    if (customerId && registration.customerId !== customerId) {
      registration.customerId = customerId;
      registrationsDirty = true;
    }

    const enriched = enrichActivityRegistration(registration);
    if (
      enriched.categoryName !== registration.categoryName ||
      enriched.planName !== registration.planName ||
      enriched.isSubscription !== registration.isSubscription
    ) {
      Object.assign(registration, enriched);
      registrationsDirty = true;
    }
  }

  await Promise.all([
    ordersDirty ? saveShopOrdersStore(ordersStore) : Promise.resolve(),
    registrationsDirty ? saveRegistrationsStore(registrationsStore) : Promise.resolve(),
  ]);
}

export async function getCustomerCommerceHistoryForAccount(
  customer: CustomerRecord,
): Promise<CustomerCommerceHistory> {
  await backfillCustomerLinks();

  const [ordersStore, registrationsStore] = await Promise.all([
    loadShopOrdersStore(),
    loadRegistrationsStore(),
  ]);

  return buildCustomerCommerceHistory(
    {
      customerId: customer.id,
      email: customer.email,
      phone: customer.phone,
    },
    ordersStore.orders,
    registrationsStore.registrations,
  );
}

export async function getUnifiedCustomerDetail(
  customerKey: string,
  domain?: CommerceDomain,
) {
  await backfillCustomerLinks();

  const [customersStore, ordersStore, registrationsStore, passesStore] = await Promise.all([
    loadCustomersStore(),
    loadShopOrdersStore(),
    loadRegistrationsStore(),
    loadPassesStore(),
  ]);

  let ref: MatchableCustomer | undefined;

  if (customerKey.startsWith("id:")) {
    const customerId = customerKey.slice(3);
    const customer = findCustomerById(customersStore, customerId);
    if (customer) {
      ref = { customerId: customer.id, email: customer.email, phone: customer.phone };
    }
  } else if (customerKey.startsWith("email:")) {
    const email = customerKey.slice(6);
    const customer = findCustomerByEmail(customersStore, email);
    ref = {
      customerId: customer?.id,
      email,
      phone: customer?.phone ?? "",
    };
  } else if (customerKey.startsWith("phone:")) {
    const phone = customerKey.slice(6);
    const customer = findCustomerByPhone(customersStore, phone);
    ref = {
      customerId: customer?.id,
      email: customer?.email,
      phone: customer?.phone ?? phone,
    };
  }

  if (!ref || !ref.phone) {
    throw new Error("הלקוח לא נמצא.");
  }

  const history = buildCustomerCommerceHistory(
    ref,
    ordersStore.orders,
    registrationsStore.registrations,
  );

  const filteredHistory = domain ? filterHistoryByDomain(history, domain) : history;

  const passes =
    domain === "activities"
      ? passesStore.passes.filter((pass) =>
          matchesCustomerRef(
            { customerId: pass.customerId, email: pass.email, phone: pass.phone },
            ref,
          ),
        )
      : [];

  const account =
    ref.customerId ? findCustomerById(customersStore, ref.customerId) : undefined;

  return {
    key: customerKey,
    domain,
    account: account
      ? {
          id: account.id,
          email: account.email,
          phone: account.phone,
          name: getCustomerDisplayName(account),
          accountType: account.accountType,
          interests: account.interests,
          inquiries: account.inquiries,
        }
      : undefined,
    history: filteredHistory,
    passes,
  };
}

export async function listUnifiedCustomersForAdmin() {
  await backfillCustomerLinks();

  const [customersStore, ordersStore, registrationsStore, passesStore] = await Promise.all([
    loadCustomersStore(),
    loadShopOrdersStore(),
    loadRegistrationsStore(),
    loadPassesStore(),
  ]);

  return {
    shopCustomers: buildShopCustomerSummaries(ordersStore.orders),
    serviceCustomers: mergeLeadCustomersIntoServiceSummaries(
      customersStore.customers,
      buildServiceCustomerSummaries(
        registrationsStore.registrations,
        passesStore.passes,
        passesStore.standingRegistrations,
      ),
    ),
    customers: buildUnifiedCustomerSummaries(
      customersStore.customers,
      ordersStore.orders,
      registrationsStore.registrations,
    ),
    updatedAt: new Date().toISOString(),
  };
}

export function enrichActivityRegistration(
  registration: ActivityRegistration,
): ActivityRegistration {
  const categoryMeta = getActivityCategoryMeta(registration.categoryId);
  const planMeta = getActivityPlanMeta(registration.planId);

  return {
    ...registration,
    categoryName: registration.categoryName ?? categoryMeta.categoryName,
    planName: registration.planName ?? planMeta.planName,
    isSubscription: registration.isSubscription ?? planMeta.isSubscription,
  };
}
