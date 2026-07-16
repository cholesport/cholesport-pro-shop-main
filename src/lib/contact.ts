import type { CartItem } from "@/lib/cart";
import { formatPrice } from "@/lib/cart";
import {
  CUSTOM_MAT_SIZE_COPY,
  type CustomMatSizeKind,
} from "@/data/customMatSize";

/** Display phone (local format). */
export const CONTACT_PHONE_DISPLAY = "054-2366279";

/** Digits only, local Israeli mobile. */
export const CONTACT_PHONE_LOCAL = "0542366279";

/** E.164 without + for wa.me links. */
export const CONTACT_PHONE_E164 = "972542366279";

export const WHATSAPP_URL = `https://wa.me/${CONTACT_PHONE_E164}`;

const SHIPPING_WHATSAPP_MESSAGE =
  "שלום, אשמח לתאם משלוח ולהבין עלויות עבור הזמנה מ-CHOLE sport";

/** WhatsApp deep link to coordinate delivery and shipping costs. */
export function getShippingWhatsAppUrl(extraNote?: string) {
  const text = extraNote
    ? `${SHIPPING_WHATSAPP_MESSAGE}\n${extraNote}`
    : SHIPPING_WHATSAPP_MESSAGE;
  return `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`;
}

export type OrderWhatsAppDetails = {
  items: CartItem[];
  subtotal: number;
  delivery: "pickup" | "delivery";
  firstName?: string;
  lastName?: string;
  phone?: string;
  notes?: string;
};

/** Pre-filled WhatsApp message with cart contents for completing purchase offline. */
export function buildOrderWhatsAppMessage(details: OrderWhatsAppDetails) {
  const lines = details.items.map(
    (item) =>
      `• ${item.title} × ${item.quantity} — ₪${formatPrice(item.price * item.quantity)}`,
  );
  const deliveryLabel =
    details.delivery === "pickup" ? "איסוף עצמי מהחנות" : "משלוח לכתובת (לתיאום)";
  const name = [details.firstName, details.lastName].filter(Boolean).join(" ").trim();

  const parts = [
    "שלום, אשמח להשלים הזמנה מ-CHOLE sport:",
    "",
    ...lines,
    "",
    `סה״כ מוצרים: ₪${formatPrice(details.subtotal)}`,
    `אספקה: ${deliveryLabel}`,
  ];

  if (name) parts.push(`שם: ${name}`);
  if (details.phone) parts.push(`טלפון: ${details.phone}`);
  if (details.notes?.trim()) parts.push(`הערות: ${details.notes.trim()}`);

  parts.push("", "אשמח לתיאום תשלום והמשך הזמנה בוואטסאפ.");
  return parts.join("\n");
}

export function getOrderWhatsAppUrl(details: OrderWhatsAppDetails) {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(buildOrderWhatsAppMessage(details))}`;
}

/** Prefill WhatsApp for custom-size landing / airfloor mat quotes. */
export function getCustomMatSizeWhatsAppUrl(kind: CustomMatSizeKind) {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(CUSTOM_MAT_SIZE_COPY[kind].whatsappMessage)}`;
}
