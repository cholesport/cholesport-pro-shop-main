import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import type { Product } from "@/data/products";
import { PAYMENT_SUMMARY } from "@/data/payment";
import { BrandMark } from "@/components/site/BrandLogos";
import { ProductMedia } from "@/components/site/ProductMedia";
import { getStoreBrandByProductBrand } from "@/data/brands";
import { isAllowedProductBadge, isAllowedStockNote, isOutOfStockNote } from "@/lib/productLabels";

type ProductCardProps = {
  product: Product;
  /** Larger media + type for bestsellers / featured carousels. */
  size?: "default" | "featured";
};

export function ProductCard({ product: p, size = "default" }: ProductCardProps) {
  const off = p.was > p.price ? Math.round(((p.was - p.price) / p.was) * 100) : 0;
  const storeBrand = getStoreBrandByProductBrand(p.brand);
  const showBadge = isAllowedProductBadge(p.badge);
  const showStockNote = isAllowedStockNote(p.stockNote);
  const outOfStock = isOutOfStockNote(p.stockNote) || p.outOfStock;
  const featured = size === "featured";

  return (
    <article className="group flex flex-col">
      <Link to="/products/$productId" params={{ productId: p.id }} className="block">
        <div
          className={`relative overflow-hidden border border-border bg-white ${
            featured ? "aspect-square md:aspect-[4/5]" : "aspect-[4/5]"
          }`}
        >
          <ProductMedia
            product={p}
            alt={p.title}
            fit="contain"
            imgClassName={`transition duration-500 group-hover:scale-[1.02] ${
              featured ? "p-4 md:p-5" : "p-3"
            }`}
          />
          {showBadge && (
            <span className="absolute top-3 start-3 z-10 bg-accent text-accent-foreground text-[11px] font-bold tracking-wide px-2 py-1">
              {p.badge}
            </span>
          )}
          {showStockNote && (
            <span
              className={`absolute start-3 z-10 max-w-[calc(100%-1.5rem)] rounded-md px-2 py-1 text-[11px] font-bold text-white ${
                outOfStock ? "bg-foreground" : "bg-amber-500"
              } ${showBadge ? "top-11" : "top-3"}`}
            >
              {p.stockNote}
            </span>
          )}
          {off > 0 && (
            <span className="absolute top-3 end-3 bg-foreground text-background text-[11px] font-bold px-2 py-1">
              ‎-{off}%
            </span>
          )}
        </div>
      </Link>
      <div className={`flex flex-1 flex-col ${featured ? "pt-3 md:pt-5" : "pt-4"}`}>
        {storeBrand ? (
          <BrandMark brand={storeBrand} heightClass={featured ? "h-6" : "h-5"} linked={false} />
        ) : (
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {p.brand.replace("®", "")}
          </span>
        )}
        <Link to="/products/$productId" params={{ productId: p.id }}>
          <h3
            className={`mt-1.5 font-semibold leading-snug text-foreground transition hover:text-accent ${
              featured
                ? "line-clamp-3 min-h-[3.75rem] text-base md:text-lg"
                : "line-clamp-2 min-h-[2.75rem]"
            }`}
          >
            {p.title}
          </h3>
        </Link>
        {p.reviews > 0 && (
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <Star size={13} className="fill-accent text-accent" />
            <span className="font-semibold text-foreground">{p.rating}</span>
            <span>({p.reviews})</span>
          </div>
        )}
        <div className="mt-3 flex items-baseline gap-2">
          <span
            className={`font-extrabold text-foreground ${
              featured ? "text-xl md:text-2xl" : "text-lg"
            }`}
          >
            {p.price.toLocaleString("he-IL")} ₪
          </span>
          {p.was > p.price && (
            <span className="text-sm text-foreground line-through">
              {p.was.toLocaleString("he-IL")} ₪
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{PAYMENT_SUMMARY}</p>
      </div>
    </article>
  );
}
