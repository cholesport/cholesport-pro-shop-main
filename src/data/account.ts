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
  /** True for freshly registered accounts — start with empty orders/addresses. */
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

/** Digits only from a phone string (allows formatting like 054-2366279). */
export function getPhoneDigits(phone: string) {
  return phone.replace(/\D/g, "");
}

/** Israeli mobile: 05X + 7 digits (10 total), or +9725X... */
export function isValidIsraeliMobile(phone: string) {
  const digits = getPhoneDigits(phone);
  if (/^05\d{8}$/.test(digits)) return true;
  if (/^9725\d{8}$/.test(digits)) return true;
  return false;
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
  if (!phone) return "נא למלא טלפון נייד";
  if (!isValidIsraeliMobile(phone)) {
    return "נא להזין טלפון נייד תקין (למשל 054-1234567)";
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
