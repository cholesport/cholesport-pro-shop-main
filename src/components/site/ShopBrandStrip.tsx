import {
  SHOP_BRAND_HEADLINE,
  SHOP_BRAND_TAGLINE,
} from "@/data/shop";

/** Restored shop positioning line — shown in the header on shop routes instead of activity CTAs. */
export function ShopBrandStrip() {
  return (
    <div className="border-b border-border/60 pb-3 md:pb-3.5 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent sm:text-[11px]">
        {SHOP_BRAND_TAGLINE}
      </p>
      <p className="mt-1.5 text-sm font-bold leading-snug text-foreground md:text-[15px]">
        {SHOP_BRAND_HEADLINE}
      </p>
    </div>
  );
}
