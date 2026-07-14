import type { Product } from "@/data/products";
import { hasProductImage } from "@/lib/productMedia";

type ProductMediaProps = {
  product: Pick<Product, "title" | "img" | "images">;
  alt?: string;
  className?: string;
  imgClassName?: string;
  /** object-cover for cards; object-contain for PDP gallery */
  fit?: "cover" | "contain";
  loading?: "lazy" | "eager";
};

/** Renders a product photo, or a clean text placeholder when no image is set. */
export function ProductMedia({
  product,
  alt,
  className = "",
  imgClassName = "",
  fit = "cover",
  loading = "lazy",
}: ProductMediaProps) {
  const src = product.images[0] ?? product.img;

  if (!hasProductImage(product) || !src) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-secondary px-3 text-center ${className}`}
        role="img"
        aria-label={alt ?? product.title}
      >
        <span className="text-sm font-semibold leading-snug text-foreground/80 line-clamp-4">
          {product.title}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt ?? product.title}
      loading={loading}
      className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"} ${imgClassName}`}
    />
  );
}
