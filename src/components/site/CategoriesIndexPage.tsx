import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { Products } from "@/components/site/Products";
import { SiteAreaReminders } from "@/components/site/SiteAreaReminders";
import {
  CATEGORIES,
  CATEGORIES_PAGE_SUBTITLE,
  type CategoryDefinition,
} from "@/data/categories";
import {
  SHOP_BRAND_SUPPORT,
  SHOP_BRAND_TAGLINE,
  SHOP_HUB_TITLE,
} from "@/data/shop";
import { saveSiteGatewayPreference } from "@/lib/siteGatewayPreference";
import type { LucideIcon } from "lucide-react";

function CategoryIcon({
  icon: Icon,
  image,
  imageDisplay = "mask",
}: {
  icon?: LucideIcon;
  image?: string;
  imageDisplay?: "mask" | "logo";
}) {
  if (image && imageDisplay === "logo") {
    return <img src={image} alt="" aria-hidden className="size-9 object-contain" />;
  }

  if (image) {
    return (
      <span
        aria-hidden
        className="inline-block size-9 bg-primary group-hover:bg-accent transition [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]"
        style={{ maskImage: `url(${image})`, WebkitMaskImage: `url(${image})` }}
      />
    );
  }

  if (Icon) {
    return <Icon className="text-primary group-hover:text-accent transition" size={32} aria-hidden />;
  }

  return null;
}

function categorySummary(category: CategoryDefinition) {
  if (category.description) return category.description;
  if (category.subcategories.length > 0) {
    return category.subcategories.slice(0, 3).join(" · ");
  }
  return "לחצו לצפייה במוצרים בקטגוריה זו.";
}

export function CategoriesIndexPage() {
  useEffect(() => {
    saveSiteGatewayPreference("shop");
  }, []);

  return (
    <div>
      <section className="border-b border-border bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowRight size={16} aria-hidden />
            חזרה לבחירת אזור
          </Link>

          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
            {SHOP_BRAND_TAGLINE}
          </p>
          <h1 className="mt-3 max-w-3xl text-balance text-3xl font-extrabold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {SHOP_HUB_TITLE}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {SHOP_BRAND_SUPPORT}
          </p>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">{CATEGORIES_PAGE_SUBTITLE}</p>
        </div>
      </section>

      <Products showCategoriesLink={false} />

      <section
        className="mx-auto max-w-7xl px-4 pb-12 md:pb-16"
        aria-labelledby="shop-categories-heading"
      >
        <div className="mb-8 max-w-xl border-b border-border pb-6">
          <h2 id="shop-categories-heading" className="text-2xl font-extrabold text-foreground md:text-3xl">
            קטגוריות
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
            בחרו תחום והמשיכו למוצרים.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-2">
          {CATEGORIES.map((category) => (
            <li key={category.slug}>
              <Link
                to="/categories/$categorySlug"
                params={{ categorySlug: category.slug }}
                className="group flex h-full items-start gap-5 bg-background px-5 py-7 transition hover:bg-secondary/50 md:px-6 md:py-8"
              >
                <div className="flex size-14 shrink-0 items-center justify-center border border-border bg-card transition group-hover:border-accent/50">
                  <CategoryIcon
                    icon={category.icon}
                    image={category.image}
                    imageDisplay={category.imageDisplay}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold leading-snug text-foreground transition group-hover:text-accent md:text-xl">
                      {category.name}
                    </h3>
                    <ChevronLeft
                      size={18}
                      className="mt-1 shrink-0 text-muted-foreground transition group-hover:text-accent"
                      aria-hidden
                    />
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {categorySummary(category)}
                  </p>
                  {category.subcategories.length > 0 && (
                    <p className="mt-3 text-xs font-medium text-muted-foreground/80">
                      {category.subcategories.length} אפשרויות
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <SiteAreaReminders className="mt-10" />
      </section>
    </div>
  );
}
