import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { ShopOrder } from "@/data/shopOrders";
import { enrichShopOrderItem } from "@/lib/commerce/catalog";
import { getCustomerFromSessionToken } from "@/lib/customers/helpers.server";
import { resolveCustomerId } from "@/lib/customers/match.server";
import { loadCustomersStore } from "@/lib/customers/store.server";
import { assertAdminRegistrationsAccess } from "@/lib/registrations/auth.server";
import { notifyAdminShopOrder } from "@/lib/orders/notify.server";
import { loadShopOrdersStore, saveShopOrdersStore } from "@/lib/orders/store.server";

const orderItemSchema = z.object({
  productId: z.string().min(1),
  title: z.string().min(1),
  quantity: z.number().int().positive(),
  price: z.number().nonnegative(),
});

const createOrderSchema = z.object({
  customerToken: z.string().optional(),
  customer: z.object({
    firstName: z.string().min(1),
    lastName: z.string().optional(),
    phone: z.string().min(1),
    email: z.string().email().optional().or(z.literal("")),
  }),
  delivery: z.enum(["delivery", "pickup"]),
  notes: z.string().optional(),
  items: z.array(orderItemSchema).min(1),
  subtotal: z.number().nonnegative(),
  paymentUrl: z.string().url().optional(),
});

const authTokenSchema = z.object({
  authToken: z.string().min(1),
});

const updateStatusSchema = z.object({
  authToken: z.string().min(1),
  id: z.string().min(1),
  status: z.enum([
    "pending_payment",
    "paid",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ]),
});

function buildOrderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  return `CHOLE-${stamp.slice(-8)}`;
}

export const createShopOrder = createServerFn({ method: "POST" })
  .inputValidator(createOrderSchema)
  .handler(async ({ data }) => {
    const store = await loadShopOrdersStore();
    const now = new Date().toISOString();
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
        email: data.customer.email,
        phone: data.customer.phone,
      });
    }

    const order: ShopOrder = {
      id: crypto.randomUUID(),
      orderNumber: buildOrderNumber(),
      createdAt: now,
      updatedAt: now,
      status: "pending_payment",
      customerId,
      customer: {
        firstName: data.customer.firstName.trim(),
        lastName: data.customer.lastName?.trim() ?? "",
        phone: data.customer.phone.trim(),
        email: data.customer.email?.trim() || undefined,
      },
      delivery: data.delivery,
      notes: data.notes?.trim() || undefined,
      items: data.items.map((item) => enrichShopOrderItem(item)),
      subtotal: data.subtotal,
      paymentUrl: data.paymentUrl,
      source: "website",
    };

    store.orders.unshift(order);
    await saveShopOrdersStore(store);

    let emailSent = true;
    try {
      await notifyAdminShopOrder(order);
    } catch (error) {
      emailSent = false;
      console.error("Shop order email failed:", error);
    }

    return { order, emailSent };
  });

export const listShopOrders = createServerFn({ method: "POST" })
  .inputValidator(authTokenSchema)
  .handler(async ({ data }) => {
    assertAdminRegistrationsAccess(data.authToken);
    const store = await loadShopOrdersStore();
    return {
      orders: store.orders,
      updatedAt: store.updatedAt,
    };
  });

export const updateShopOrderStatus = createServerFn({ method: "POST" })
  .inputValidator(updateStatusSchema)
  .handler(async ({ data }) => {
    assertAdminRegistrationsAccess(data.authToken);
    const store = await loadShopOrdersStore();
    const index = store.orders.findIndex((order) => order.id === data.id);
    if (index < 0) {
      throw new Error("ההזמנה לא נמצאה.");
    }

    store.orders[index] = {
      ...store.orders[index],
      status: data.status,
      updatedAt: new Date().toISOString(),
    };

    await saveShopOrdersStore(store);
    return { order: store.orders[index], updatedAt: store.updatedAt };
  });
