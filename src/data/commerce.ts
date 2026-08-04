import type { ActivityCategoryId } from "@/data/activities";
import type { ActivityRegistrationStatus } from "@/data/registrations";
import type { ShopDeliveryMethod, ShopOrderStatus } from "@/data/shopOrders";

export type CommerceDomain = "shop" | "activities";

export type CustomerCommerceShopOrder = {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: ShopOrderStatus;
  subtotal: number;
  delivery: ShopDeliveryMethod;
  items: {
    productId: string;
    title: string;
    quantity: number;
    price: number;
    categorySlug?: string;
    categoryName?: string;
    productCat?: string;
  }[];
};

export type CustomerCommerceActivity = {
  id: string;
  categoryId: ActivityCategoryId;
  categoryName: string;
  planId?: string;
  planName?: string;
  isSubscription?: boolean;
  participantName: string;
  sessionDate: string;
  status: ActivityRegistrationStatus;
  createdAt: string;
};

export type CustomerCommerceCategoryGroup = {
  domain: CommerceDomain;
  categoryKey: string;
  categoryName: string;
  shopOrders: CustomerCommerceShopOrder[];
  shopItemCount: number;
  activities: CustomerCommerceActivity[];
  activeSubscriptions: CustomerCommerceActivity[];
};

export type CustomerCommerceHistory = {
  shopOrders: CustomerCommerceShopOrder[];
  activities: CustomerCommerceActivity[];
  categories: CustomerCommerceCategoryGroup[];
  stats: {
    shopOrderCount: number;
    activityCount: number;
    subscriptionCount: number;
  };
};

export type UnifiedCustomerSummary = {
  key: string;
  customerId?: string;
  email?: string;
  phone: string;
  name: string;
  hasAccount: boolean;
  shopOrderCount: number;
  activityCount: number;
  subscriptionCount: number;
  lastActivityAt: string;
  categoryNames: string[];
};

/** Customers who ordered products from the shop. */
export type ShopCustomerSummary = {
  key: string;
  customerId?: string;
  email?: string;
  phone: string;
  name: string;
  hasAccount: boolean;
  shopOrderCount: number;
  totalSpent: number;
  lastOrderAt: string;
  categoryNames: string[];
};

/** Customers who registered for activities / hold punch cards or subscriptions. */
export type ServiceCustomerSummary = {
  key: string;
  customerId?: string;
  email?: string;
  phone: string;
  name: string;
  hasAccount: boolean;
  isLeadAccount?: boolean;
  activityCount: number;
  subscriptionCount: number;
  passCount: number;
  activePassPunches: number;
  standingCount: number;
  inquiryCount: number;
  lastActivityAt: string;
  categoryNames: string[];
  interestLabels?: string[];
};

export type AdminCustomerInquiry = {
  id: string;
  type: string;
  source: string;
  summary: string;
  details?: Record<string, string>;
  createdAt: string;
};

export type AdminCustomerAccountMeta = {
  id: string;
  email: string;
  phone: string;
  name: string;
  accountType?: "registered" | "lead";
  interests?: string[];
  inquiries?: AdminCustomerInquiry[];
};

export type SegmentedAdminCustomers = {
  shopCustomers: ShopCustomerSummary[];
  serviceCustomers: ServiceCustomerSummary[];
  updatedAt: string;
};
