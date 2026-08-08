import { Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/data/categories";
import { cn } from "@/lib/utils";

type ShopCategoriesNavProps = {
  /**
   * hub — full-height vertical list for /categories (mobile-first, fit one screen)
   * sticky — compact bar on category/product pages so other categories stay visible
   */
  variant: "hub" | "sticky";
  activeSlug?: string;
  className?: string;
};

export function ShopCategoriesNav({
  variant,
  activeSlug,
  className,
}: ShopCategoriesNavProps) {
  if (variant === "hub") {
    return (
      <nav
        className={cn("flex min-h-0 flex-1 flex-col", className)}
        aria-label="קטגוריות החנות"
      >
        <ul
          className="grid min-h-0 flex-1 gap-px overflow-hidden rounded-xl border border-border bg-border"
          style={{ gridTemplateRows: `repeat(${CATEGORIES.length}, minmax(0, 1fr))` }}
        >
          {CATEGORIES.map((category) => {
            const isActive = activeSlug === category.slug;
            return (
              <li key={category.slug} className="min-h-0">
                <Link
                  to="/categories/$categorySlug"
                  params={{ categorySlug: category.slug }}
                  className={cn(
                    "flex h-full items-center justify-between gap-2 bg-background px-3 py-1.5 text-start transition",
                    "hover:bg-secondary/60 active:bg-secondary",
                    isActive && "bg-accent/10",
                  )}
                >
                  <span
                    className={cn(
                      "truncate text-sm font-bold leading-tight text-foreground",
                      isActive && "text-accent",
                    )}
                  >
                    {category.name}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground" aria-hidden>
                    ←
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  return (
    <nav
      className={cn(
        // Below shop header (logo + brand strip) on mobile; static on desktop
        "sticky top-[7.25rem] z-40 border-b border-border bg-background/95 backdrop-blur-md md:static md:top-auto md:z-auto md:border-0 md:bg-transparent md:backdrop-blur-none",
        className,
      )}
      aria-label="מעבר בין קטגוריות"
    >
      <div className="mx-auto max-w-7xl px-3 py-2 md:hidden">
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          קטגוריות
        </p>
        <ul className="grid grid-cols-2 gap-1.5">
          {CATEGORIES.map((category) => {
            const isActive = activeSlug === category.slug;
            return (
              <li key={category.slug}>
                <Link
                  to="/categories/$categorySlug"
                  params={{ categorySlug: category.slug }}
                  className={cn(
                    "flex min-h-9 items-center justify-center rounded-lg border px-2 py-1.5 text-center text-[11px] font-bold leading-snug transition",
                    isActive
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border bg-card text-foreground hover:border-accent/40 hover:text-accent",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {category.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Desktop: compact reminder strip under page header (header already has full nav) */}
      <div className="mx-auto hidden max-w-7xl px-4 py-3 md:block">
        <ul className="flex flex-wrap gap-2" aria-label="קטגוריות החנות">
          {CATEGORIES.map((category) => {
            const isActive = activeSlug === category.slug;
            return (
              <li key={category.slug}>
                <Link
                  to="/categories/$categorySlug"
                  params={{ categorySlug: category.slug }}
                  className={cn(
                    "inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-bold transition",
                    isActive
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border bg-card text-foreground hover:border-accent/40 hover:text-accent",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {category.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
