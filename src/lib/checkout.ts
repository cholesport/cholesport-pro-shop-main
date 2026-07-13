import { HOMEPAGE_PRODUCTS, type Product } from "@/data/products";

/** Products suggested at checkout — homepage items not already in the cart. */
export function getCheckoutSuggestions(cartProductIds: string[], limit = 6): Product[] {
  return HOMEPAGE_PRODUCTS.filter((p) => !cartProductIds.includes(p.id)).slice(0, limit);
}
