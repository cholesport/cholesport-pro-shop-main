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
