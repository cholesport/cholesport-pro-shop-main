import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Products } from "@/components/site/Products";
import { ShopCategoriesNav } from "@/components/site/ShopCategoriesNav";
import { SiteAreaReminders } from "@/components/site/SiteAreaReminders";
import { CATEGORIES_PAGE_SUBTITLE } from "@/data/categories";
import {
  SHOP_BRAND_SUPPORT,
  SHOP_BRAND_TAGLINE,
  SHOP_HUB_TITLE,
} from "@/data/shop";
import { saveSiteGatewayPreference } from "@/lib/siteGatewayPreference";

export function CategoriesIndexPage() {
  useEffect(() => {
    saveSiteGatewayPreference("shop");
  }, []);

  return (
    <div>
      {/* Mobile: categories grid, then large bestsellers slide */}
      <div className="md:hidden">
        <section className="px-3 pb-2 pt-1">
          <ShopCategoriesNav variant="hub" />
        </section>
        <Products showCategoriesLink={false} className="border-t border-border bg-secondary/20" />
      </div>

      {/* Desktop: header has category nav — hero + large bestsellers */}
      <div className="hidden md:block">
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

        <section className="mx-auto max-w-7xl px-4 pb-12 md:pb-16">
          <SiteAreaReminders />
        </section>
      </div>
    </div>
  );
}
