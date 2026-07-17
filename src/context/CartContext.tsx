import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  getCartSubtotal,
  getCartTotalQuantity,
  loadCart,
  productToCartItem,
  saveCart,
  withRecalculatedPrices,
  withUpdatedCartQuantity,
  type CartItem,
} from "@/lib/cart";
import type { Product } from "@/data/products";

type CartContextValue = {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveCart(items);
  }, [items, hydrated]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    const addQty = Math.max(1, Math.floor(quantity));
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      const next = existing
        ? prev.map((item) =>
            item.productId === product.id
              ? withUpdatedCartQuantity(item, item.quantity + addQty)
              : item,
          )
        : [...prev, productToCartItem(product, addQty)];
      return withRecalculatedPrices(next);
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => withRecalculatedPrices(prev.filter((item) => item.productId !== productId)));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) =>
        withRecalculatedPrices(prev.filter((item) => item.productId !== productId)),
      );
      return;
    }
    setItems((prev) =>
      withRecalculatedPrices(
        prev.map((item) =>
          item.productId === productId ? withUpdatedCartQuantity(item, quantity) : item,
        ),
      ),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      totalQuantity: getCartTotalQuantity(items),
      subtotal: getCartSubtotal(items),
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
