import { PRODUCTS, type Product } from "@/data/products";
import type { CategoryDefinition } from "@/data/categories";
import { LANDING_MAT_CATEGORY } from "@/data/landingMats";
import { AIRFLOOR_MAT_CATEGORY } from "@/data/airfloorMats";

/** Returns products whose cat tag matches the category mapping. */
export function getProductsForCategory(category: CategoryDefinition): Product[] {
  if (category.productCats.length === 0) return [];
  const products = PRODUCTS.filter((p) => category.productCats.includes(p.cat));
  if (
    category.productCats.includes(LANDING_MAT_CATEGORY) ||
    category.productCats.includes(AIRFLOOR_MAT_CATEGORY)
  ) {
    return [...products].sort((a, b) => a.price - b.price);
  }
  return products;
}
