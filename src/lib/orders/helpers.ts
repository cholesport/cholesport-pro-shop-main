import {
  SHOP_DELIVERY_LABELS,
  SHOP_ORDER_STATUS_LABELS,
  type ShopOrder,
  type ShopOrderStatus,
} from "@/data/shopOrders";

export function formatShopOrderPrice(amount: number): string {
  return amount.toLocaleString("he-IL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function getShopOrderStatusLabel(status: ShopOrderStatus): string {
  return SHOP_ORDER_STATUS_LABELS[status];
}

export function getShopDeliveryLabel(delivery: ShopOrder["delivery"]): string {
  return SHOP_DELIVERY_LABELS[delivery];
}

export function getShopOrderCustomerName(order: ShopOrder): string {
  return `${order.customer.firstName} ${order.customer.lastName}`.trim() || "לקוח";
}

export function getShopOrderItemCount(order: ShopOrder): number {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}

export function filterShopOrders(
  orders: ShopOrder[],
  filters: { status?: ShopOrderStatus; query?: string },
): ShopOrder[] {
  const q = filters.query?.trim().toLowerCase();

  return orders
    .filter((order) => {
      if (filters.status && order.status !== filters.status) return false;
      if (!q) return true;

      const haystack = [
        order.orderNumber,
        order.customer.firstName,
        order.customer.lastName,
        order.customer.phone,
        order.customer.email,
        order.notes,
        ...order.items.map((item) => item.title),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function shopOrderStatusVariant(status: ShopOrderStatus) {
  switch (status) {
    case "delivered":
      return "secondary" as const;
    case "shipped":
    case "paid":
      return "default" as const;
    case "processing":
    case "pending_payment":
      return "outline" as const;
    case "cancelled":
      return "destructive" as const;
  }
}
