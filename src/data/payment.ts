export const PAYMENT_INSTALLMENTS_COUNT = 6;

export const PAYMENT_INSTALLMENTS_LABEL = `${PAYMENT_INSTALLMENTS_COUNT} תשלומים ללא ריבית`;

export const PAYMENT_CARD_BRANDS = "Visa · Mastercard · Amex · Isracard";

export const PAYMENT_SUMMARY = `תשלום בכרטיס אשראי · ${PAYMENT_INSTALLMENTS_LABEL}`;

export const PAYMENT_DESCRIPTION =
  `ניתן לשלם בכרטיס אשראי בלבד. ניתן לחלק ל-${PAYMENT_INSTALLMENTS_COUNT} תשלומים ללא ריבית. תשלום מאובטח ומהיר.`;

export function formatInstallmentAmount(price: number): string {
  return `₪${Math.ceil(price / PAYMENT_INSTALLMENTS_COUNT).toLocaleString("he-IL")}`;
}
