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
};

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
