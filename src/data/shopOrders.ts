export type ShopOrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type ShopDeliveryMethod = "delivery" | "pickup";

export type ShopOrderItem = {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  /** Product.cat from catalog — for grouping. */
  productCat?: string;
  categorySlug?: string;
  categoryName?: string;
};

export type ShopOrderCustomer = {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
};

/** Website storefront order — stored server-side for admin tracking. */
export type ShopOrder = {
  id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  status: ShopOrderStatus;
  /** Linked website account when email/phone matches a registered customer. */
  customerId?: string;
  customer: ShopOrderCustomer;
  delivery: ShopDeliveryMethod;
  notes?: string;
  items: ShopOrderItem[];
  subtotal: number;
  paymentUrl?: string;
  source: "website";
};

export type ShopOrdersStore = {
  orders: ShopOrder[];
  updatedAt: string;
};

export const SHOP_ORDER_STATUS_LABELS: Record<ShopOrderStatus, string> = {
  pending_payment: "ממתין לתשלום",
  paid: "שולם",
  processing: "בטיפול",
  shipped: "בדרך",
  delivered: "נמסר",
  cancelled: "בוטל",
};

export const SHOP_DELIVERY_LABELS: Record<ShopDeliveryMethod, string> = {
  delivery: "משלוח לכתובת",
  pickup: "איסוף עצמי",
};
