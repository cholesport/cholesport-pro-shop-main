/** Shared copy for custom-size mat ordering (landing + airfloor). */

export type CustomMatSizeKind = "landing" | "airfloor";

export const CUSTOM_MAT_SIZE_COPY = {
  landing: {
    title: "צריכים גודל מיוחד?",
    description:
      "מעבר למידות שבקטלוג - ניתן להזמין מזרן נחיתה במידות מותאמות אישית. כתבו לנו בוואטסאפ את המידות הרצויות ונחזור עם הצעה.",
    cta: "הזמנת מזרן נחיתה בגודל מיוחד",
    whatsappMessage:
      "שלום, אשמח להזמין מזרן נחיתה בגודל מיוחד מ-CHOLE sport.\nהמידות שאני צריך/ה: (אורך × רוחב × עובי)",
  },
  airfloor: {
    title: "צריכים מזרן איירפלור בגודל מיוחד?",
    description:
      "מעבר למידות שבקטלוג - ניתן להזמין מזרן איירפלור (AirFloor) במידות מותאמות אישית. כתבו לנו בוואטסאפ את המידות הרצויות ונחזור עם הצעה.",
    cta: "הזמנת איירפלור בגודל מיוחד",
    whatsappMessage:
      "שלום, אשמח להזמין מזרן איירפלור (AirFloor) בגודל מיוחד מ-CHOLE sport.\nהמידות שאני צריך/ה: (אורך × רוחב × עובי)",
  },
} as const;
