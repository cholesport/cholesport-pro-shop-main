import type { Product } from "@/data/products";
import {
  getPuzzleMatUnitPrice,
  isPuzzleMatProductId,
} from "@/data/trainingAccessories";
import {
  getFlexiRollCatalogPrice,
  getFlexiRollUnitPrice,
  isFlexiRollProductId,
} from "@/data/flexiRoll";

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
    if (!Array.isArray(parsed)) return [];
    return withRecalculatedPrices(parsed.map(normalizeCartItemShape));
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

function normalizeCartItemShape(item: CartItem): CartItem {
  return {
    ...item,
    quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
  };
}

export function getFlexiRollCartQuantity(
  items: Pick<CartItem, "productId" | "quantity">[],
) {
  return items.reduce(
    (sum, item) =>
      isFlexiRollProductId(item.productId) ? sum + item.quantity : sum,
    0,
  );
}

/** Recompute unit prices for quantity deals (puzzle mats, flexi roll). */
export function withRecalculatedPrices(items: CartItem[]): CartItem[] {
  const flexiQty = getFlexiRollCartQuantity(items);

  return items.map((item) => {
    const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));

    if (isPuzzleMatProductId(item.productId)) {
      return { ...item, quantity, price: getPuzzleMatUnitPrice(quantity) };
    }

    if (isFlexiRollProductId(item.productId)) {
      const price = getFlexiRollUnitPrice(item.productId, flexiQty);
      return {
        ...item,
        quantity,
        price: price ?? getFlexiRollCatalogPrice(item.productId) ?? item.price,
      };
    }

    return { ...item, quantity };
  });
}

/** @deprecated prefer withRecalculatedPrices for multi-item deals */
export function getCartUnitPrice(productId: string, quantity: number, fallbackPrice: number) {
  if (isPuzzleMatProductId(productId)) {
    return getPuzzleMatUnitPrice(quantity);
  }
  if (isFlexiRollProductId(productId)) {
    return getFlexiRollUnitPrice(productId, quantity) ?? fallbackPrice;
  }
  return fallbackPrice;
}

export function productToCartItem(product: Product, quantity: number): CartItem {
  const qty = Math.max(1, Math.floor(quantity));
  return {
    productId: product.id,
    title: product.title,
    brand: product.brand,
    price: product.price,
    image: product.img ?? product.images[0] ?? "",
    quantity: qty,
  };
}

export function withUpdatedCartQuantity(item: CartItem, quantity: number): CartItem {
  const qty = Math.max(1, Math.floor(quantity));
  return {
    ...item,
    quantity: qty,
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
