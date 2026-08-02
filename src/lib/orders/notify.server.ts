import { NEW_CUSTOMER_NOTIFY_EMAIL } from "@/data/account";
import {
  SHOP_DELIVERY_LABELS,
  SHOP_ORDER_STATUS_LABELS,
  type ShopOrder,
} from "@/data/shopOrders";
import { getServerConfig } from "@/lib/config.server";

function formatPrice(amount: number): string {
  return amount.toLocaleString("he-IL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function buildItemsTable(order: ShopOrder): string {
  return order.items
    .map(
      (item, index) =>
        `${index + 1}. ${item.title} × ${item.quantity} — ₪${formatPrice(item.price * item.quantity)}`,
    )
    .join("\n");
}

export async function notifyAdminShopOrder(order: ShopOrder): Promise<void> {
  const to = getServerConfig().newCustomerNotifyEmail || NEW_CUSTOMER_NOTIFY_EMAIL;
  const customerName = `${order.customer.firstName} ${order.customer.lastName}`.trim() || "לקוח";
  const when = new Date(order.createdAt).toLocaleString("he-IL", {
    timeZone: "Asia/Jerusalem",
  });

  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      _subject: `הזמנה חדשה מהאתר #${order.orderNumber} — ${customerName}`,
      _template: "table",
      _captcha: "false",
      orderNumber: order.orderNumber,
      status: SHOP_ORDER_STATUS_LABELS[order.status],
      customerName,
      phone: order.customer.phone || "לא צוין",
      email: order.customer.email || "לא צוין",
      delivery: SHOP_DELIVERY_LABELS[order.delivery],
      subtotal: `₪${formatPrice(order.subtotal)}`,
      itemsCount: String(order.items.reduce((sum, item) => sum + item.quantity, 0)),
      notes: order.notes?.trim() || "אין",
      createdAt: when,
      products: buildItemsTable(order),
      message: [
        `התקבלה הזמנה חדשה מאתר CHOLE sport (#${order.orderNumber}).`,
        "",
        "מוצרים:",
        buildItemsTable(order),
        "",
        `סה״כ: ₪${formatPrice(order.subtotal)}`,
        `אספקה: ${SHOP_DELIVERY_LABELS[order.delivery]}`,
        order.notes?.trim() ? `הערות: ${order.notes.trim()}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`שליחת מייל הזמנה נכשלה (${response.status}) ${detail}`.trim());
  }
}
