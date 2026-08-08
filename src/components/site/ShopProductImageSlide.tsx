import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  getProductSlideImage,
  getShopSlideProducts,
  shuffleProducts,
} from "@/lib/shopProductSlide";
import { cn } from "@/lib/utils";
import type { Product } from "@/data/products";

type ShopProductImageSlideProps = {
  className?: string;
};

export function ShopProductImageSlide({ className }: ShopProductImageSlideProps) {
  const [products, setProducts] = useState<Product[]>(() => getShopSlideProducts());

  useEffect(() => {
    setProducts(shuffleProducts(getShopSlideProducts()));
  }, []);

  if (products.length === 0) return null;

  const track = [...products, ...products];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-secondary/40",
        className,
      )}
      aria-label="תצוגת מוצרים מהחנות"
    >
      <div
        dir="ltr"
        className="shop-product-image-slide flex w-max items-stretch"
      >
        {track.map((product, index) => (
          <Link
            key={`${product.id}-${index}`}
            to="/products/$productId"
            params={{ productId: product.id }}
            className="relative h-20 w-20 shrink-0 border-e border-border/60 bg-card sm:h-24 sm:w-24"
            aria-label={product.title}
          >
            <img
              src={getProductSlideImage(product)}
              alt=""
              className="h-full w-full object-contain object-center p-1.5"
              loading={index < 6 ? "eager" : "lazy"}
              decoding="async"
              draggable={false}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
