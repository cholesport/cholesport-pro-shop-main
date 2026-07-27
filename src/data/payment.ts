/** Shared storefront payment copy - secure checkout (Boost App). */

export const PAYMENT_INSTALLMENTS_COUNT = 6;

export const PAYMENT_INSTALLMENTS_LABEL = `עד ${PAYMENT_INSTALLMENTS_COUNT} תשלומים`;

export const PAYMENT_CARD_BRANDS = "Visa · Mastercard · Amex · Isracard";

/** Short line for cards / promo / PDP. */
export const PAYMENT_SUMMARY = "רכישה מאובטחת";

/** Product accordion + legal-facing payment explanation. */
export const PAYMENT_DESCRIPTION =
  "הרכישה מתבצעת בתשלום מאובטח. פרטי האשראי לא נשמרים באתר CHOLE. ניתן לפרוס לתשלומים בהתאם לאפשרויות בדף התשלום.";

/** Prominent notice for cart / checkout / PDP. */
export const PAYMENT_SECURE_NOTICE =
  "תשלום מאובטח - פרטי האשראי לא נשמרים באתר CHOLE.";

/** @deprecated Use PAYMENT_SECURE_NOTICE */
export const PAYMENT_WHATSAPP_NOTICE = PAYMENT_SECURE_NOTICE;

export function formatInstallmentAmount(price: number): string {
  return `₪${Math.ceil(price / PAYMENT_INSTALLMENTS_COUNT).toLocaleString("he-IL")}`;
}
