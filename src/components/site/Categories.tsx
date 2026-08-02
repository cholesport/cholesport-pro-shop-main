import { Link } from "@tanstack/react-router";
import { ArrowLeft, Flame } from "lucide-react";
import { CategoryCard } from "@/components/site/CategoryCard";
import { CATEGORIES } from "@/data/categories";
import { FadeIn } from "@/components/site/FadeIn";

export function Categories() {
  return (
    <section id="categories" className="relative overflow-hidden py-16 md:py-24">
      {/* Subtle energetic background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
        style={{
          background:
            "linear-gradient(180deg, oklch(0.975 0.008 145) 0%, oklch(0.96 0.02 80 / 0.4) 50%, oklch(0.975 0.008 145) 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4">
        <FadeIn preset="section" className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">
              <Flame size={14} aria-hidden className="fill-accent" />
              קולקציית 2026
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-foreground leading-tight">
              תחומי ספורט
            </h2>
            <p className="text-muted-foreground mt-3 leading-relaxed">
              ציוד מקצועי שמתוכנן על ידי ספורטאים — בחרו תחום והתחילו לקנות.
            </p>
          </div>
          <Link
            to="/categories"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-accent to-orange-500 px-6 py-3 text-sm font-bold text-accent-foreground shadow-lg shadow-accent/25 transition hover:scale-105 hover:shadow-xl hover:shadow-accent/35"
          >
            לכל הקטגוריות
            <ArrowLeft size={16} aria-hidden />
          </Link>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {CATEGORIES.map((category, index) => (
            <FadeIn key={category.slug} preset="card" index={index}>
              <CategoryCard category={category} variant="compact" />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
