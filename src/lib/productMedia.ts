import type { Product } from "@/data/products";
import { isAirfloorMatProduct } from "@/data/airfloorMats";
import { isFlexiRollProduct } from "@/data/flexiRoll";
import { isLandingMatProduct } from "@/data/landingMats";

export function hasProductImage(product: Pick<Product, "img" | "images">) {
  if (product.img) return true;
  return product.images.some((src) => Boolean(src));
}

/** Mat / roll photos should stay fully visible (no crop). */
export function shouldContainProductImage(product: Pick<Product, "id" | "cat">) {
  return (
    isLandingMatProduct(product) ||
    isAirfloorMatProduct(product) ||
    isFlexiRollProduct(product)
  );
}
