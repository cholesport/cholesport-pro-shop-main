import type { Product } from "@/data/products";
import {
  getPuzzleMatUnitPrice,
  isPuzzleMatProductId,
} from "@/data/trainingAccessories";

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
    return Array.isArray(parsed) ? parsed.map(normalizeCartItem) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

/** Resolve unit price for a cart line (quantity deals for puzzle mats). */
export function getCartUnitPrice(productId: string, quantity: number, fallbackPrice: number) {
  if (isPuzzleMatProductId(productId)) {
    return getPuzzleMatUnitPrice(quantity);
  }
  return fallbackPrice;
}

function normalizeCartItem(item: CartItem): CartItem {
  const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
  return {
    ...item,
    quantity,
    price: getCartUnitPrice(item.productId, quantity, item.price),
  };
}

export function productToCartItem(product: Product, quantity: number): CartItem {
  const qty = Math.max(1, Math.floor(quantity));
  return {
    productId: product.id,
    title: product.title,
    brand: product.brand,
    price: getCartUnitPrice(product.id, qty, product.price),
    image: product.img ?? product.images[0] ?? "",
    quantity: qty,
  };
}

export function withUpdatedCartQuantity(item: CartItem, quantity: number): CartItem {
  const qty = Math.max(1, Math.floor(quantity));
  return {
    ...item,
    quantity: qty,
    price: getCartUnitPrice(item.productId, qty, item.price),
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
