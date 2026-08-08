import { Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/data/categories";
import { cn } from "@/lib/utils";

type ShopCategoriesNavProps = {
  /**
   * hub — 2-column grid on /categories (mobile shop entry)
   * sticky — same grid, sticky on category/product pages
   */
  variant: "hub" | "sticky";
  activeSlug?: string;
  className?: string;
};

function CategoryGrid({
  activeSlug,
  dense = false,
}: {
  activeSlug?: string;
  dense?: boolean;
}) {
  return (
    <>
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        קטגוריות
      </p>
      <ul className={cn("grid grid-cols-2", dense ? "gap-1.5" : "gap-2")}>
        {CATEGORIES.map((category) => {
          const isActive = activeSlug === category.slug;
          return (
            <li key={category.slug}>
              <Link
                to="/categories/$categorySlug"
                params={{ categorySlug: category.slug }}
                className={cn(
                  "flex items-center justify-center rounded-lg border px-2 text-center font-bold leading-snug transition",
                  dense
                    ? "min-h-9 py-1.5 text-[11px]"
                    : "min-h-11 py-2 text-xs sm:text-sm",
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
    </>
  );
}

export function ShopCategoriesNav({
  variant,
  activeSlug,
  className,
}: ShopCategoriesNavProps) {
  if (variant === "hub") {
    return (
      <nav className={cn("shrink-0", className)} aria-label="קטגוריות החנות">
        <CategoryGrid activeSlug={activeSlug} />
      </nav>
    );
  }

  return (
    <nav
      className={cn(
        "sticky top-[7.25rem] z-40 border-b border-border bg-background/95 backdrop-blur-md md:static md:top-auto md:z-auto md:border-0 md:bg-transparent md:backdrop-blur-none",
        className,
      )}
      aria-label="מעבר בין קטגוריות"
    >
      <div className="mx-auto max-w-7xl px-3 py-2 md:hidden">
        <CategoryGrid activeSlug={activeSlug} dense />
      </div>

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
