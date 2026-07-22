/** Shown when installments may still be arranged via WhatsApp. */
export const PAYMENT_INSTALLMENTS_COUNT = 6;

export const PAYMENT_INSTALLMENTS_LABEL = `עד ${PAYMENT_INSTALLMENTS_COUNT} תשלומים בתיאום`;

export const PAYMENT_CARD_BRANDS = "Visa · Mastercard · Amex · Isracard";

/** Short line for cart / promo surfaces. */
export const PAYMENT_SUMMARY = "רכישה ותשלום בוואטסאפ";

/** Product accordion + legal-facing payment explanation. */
export const PAYMENT_DESCRIPTION =
  "נכון לעכשיו אין סליקה באתר. לאחר בחירת המוצרים שולחים הזמנה בוואטסאפ - שם משלימים את הפרטים, התיאום והתשלום (כולל אפשרות לתשלומים בתיאום).";

/** Prominent notice for cart / checkout. */
export const PAYMENT_WHATSAPP_NOTICE =
  "הרכישה והתשלום מתבצעים כרגע בוואטסאפ בלבד - אין תשלום אונליין באתר.";

export function formatInstallmentAmount(price: number): string {
  return `₪${Math.ceil(price / PAYMENT_INSTALLMENTS_COUNT).toLocaleString("he-IL")}`;
}
