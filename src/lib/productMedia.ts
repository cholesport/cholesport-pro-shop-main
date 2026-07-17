import type { Product } from "@/data/products";

export function hasProductImage(product: Pick<Product, "img" | "images">) {
  if (product.img) return true;
  return product.images.some((src) => Boolean(src));
}

/** Prefer full product visibility (no crop) over filling the frame. */
export function shouldContainProductImage(_product?: Pick<Product, "id" | "cat">) {
  return true;
}
