import type { Product } from "@/data/products";

export type CartItem = {
  productId: string;
  title: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
};

export const CART_STORAGE_KEY = "chole-cart";

export function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function productToCartItem(product: Product, quantity: number): CartItem {
  return {
    productId: product.id,
    title: product.title,
    brand: product.brand,
    price: product.price,
    image: product.img,
    quantity,
  };
}

export function getCartTotalQuantity(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function formatPrice(n: number) {
  return n.toLocaleString("he-IL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
