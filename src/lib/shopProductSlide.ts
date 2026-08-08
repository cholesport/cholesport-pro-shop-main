import { PRODUCTS, type Product } from "@/data/products";
import { hasProductImage } from "@/lib/productMedia";

/** Products that have a real image suitable for the shop hub slide. */
export function getShopSlideProducts(): Product[] {
  return PRODUCTS.filter((product) => hasProductImage(product));
}

/** Fisher–Yates shuffle (client-side; call after mount to avoid SSR mismatch). */
export function shuffleProducts<T>(items: readonly T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const current = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = current;
  }
  return arr;
}

export function getProductSlideImage(product: Product): string {
  return product.images[0] ?? product.img;
}
