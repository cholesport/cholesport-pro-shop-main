import type { Product } from "@/data/products";

export function hasProductImage(product: Pick<Product, "img" | "images">) {
  if (product.img) return true;
  return product.images.some((src) => Boolean(src));
}
