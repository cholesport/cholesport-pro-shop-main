export type OrderStatus = "בטיפול" | "בדרך" | "נמסר" | "בוטל";

export type Order = {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: { title: string; qty: number; price: number }[];
};

export type Address = {
  id: string;
  label: string;
  name: string;
  street: string;
  city: string;
  zip: string;
  phone: string;
  isDefault: boolean;
};

export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  /** True for freshly registered accounts - start with empty orders/addresses. */
  isNew?: boolean;
  registeredAt?: string;
};

/** Owner notification inbox for new customer signups. */
export const NEW_CUSTOMER_NOTIFY_EMAIL = "hillelisaacs@gmail.com";

export const ACCOUNT_SESSION_KEY = "chole-account-session";

/** Minimum password length for registration. */
export const ACCOUNT_PASSWORD_MIN_LENGTH = 8;

export type RegisterFormInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
};

/** Digits only from a phone string (allows formatting like spaces / dashes). */
export function getPhoneDigits(phone: string) {
  return phone.replace(/\D/g, "");
}

/**
 * Accepts Israeli mobiles and international numbers.
 * Requires enough digits for a real phone (7-15 per E.164).
 */
export function isValidAccountPhone(phone: string) {
  const digits = getPhoneDigits(phone);
  return digits.length >= 7 && digits.length <= 15;
}

export function validateRegisterForm(input: RegisterFormInput): string | null {
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const email = input.email.trim();
  const phone = input.phone.trim();
  const password = input.password;

  if (!firstName) return "נא למלא שם פרטי";
  if (!lastName) return "נא למלא שם משפחה";
  if (!email) return "נא למלא כתובת אימייל";
  if (!phone) return "נא למלא מספר טלפון";
  if (!isValidAccountPhone(phone)) {
    return "נא להזין מספר טלפון תקין (כולל קידומת מדינה אם מחוץ לישראל)";
  }
  if (password.length < ACCOUNT_PASSWORD_MIN_LENGTH) {
    return `הסיסמה חייבת להכיל לפחות ${ACCOUNT_PASSWORD_MIN_LENGTH} תווים`;
  }
  return null;
}

export const MOCK_USER: UserProfile = {
  firstName: "יוסי",
  lastName: "כהן",
  email: "yossi@example.com",
  phone: "054-1234567",
};

export const MOCK_ORDERS: Order[] = [
  {
    id: "10234",
    date: "10.06.2025",
    status: "נמסר",
    total: 1249.9,
    items: [
      { title: "מזרן איירפלור 3×1 מ'", qty: 1, price: 899.9 },
      { title: "כדורי טניס שולחן 40+ (6 יח')", qty: 2, price: 175 },
    ],
  },
  {
    id: "10198",
    date: "22.05.2025",
    status: "בדרך",
    total: 589,
    items: [{ title: "שולחן טניס שולחן חוץ", qty: 1, price: 589 }],
  },
  {
    id: "10155",
    date: "08.04.2025",
    status: "בטיפול",
    total: 2100,
    items: [
      { title: "מזרן נחיתה 200×200×20 ס\"מ", qty: 1, price: 1450 },
      { title: "משולש ג'ימבורי 120 ס\"מ", qty: 2, price: 325 },
    ],
  },
];

export const MOCK_ADDRESSES: Address[] = [
  {
    id: "1",
    label: "בית",
    name: "יוסי כהן",
    street: "רוטשילד 12",
    city: "תל אביב",
    zip: "6688101",
    phone: "054-1234567",
    isDefault: true,
  },
  {
    id: "2",
    label: "עבודה",
    name: "יוסי כהן",
    street: "המלאכה 5",
    city: "ראשון לציון",
    zip: "7560204",
    phone: "054-1234567",
    isDefault: false,
  },
];

export function formatPrice(n: number) {
  return n.toLocaleString("he-IL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function getAccountOrders(profile: UserProfile): Order[] {
  return profile.isNew ? [] : MOCK_ORDERS;
}

export function getAccountAddresses(profile: UserProfile): Address[] {
  return profile.isNew ? [] : MOCK_ADDRESSES;
}
