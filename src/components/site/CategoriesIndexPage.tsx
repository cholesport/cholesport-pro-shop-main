import { Link } from "@tanstack/react-router";
import { ChevronLeft, Sparkles, Zap } from "lucide-react";
import { ActivitiesRegisterCta } from "@/components/site/ActivitiesRegisterCta";
import { CategoryCard } from "@/components/site/CategoryCard";
import {
  CATEGORIES,
  CATEGORIES_PAGE_SUBTITLE,
  CATEGORIES_PAGE_TITLE,
} from "@/data/categories";
import {
  ACTIVITIES_REGISTER_CALLOUT_TEXT,
  ACTIVITIES_REGISTER_CALLOUT_TITLE,
  ACTIVITIES_SCHEDULE_HASH,
} from "@/data/activities";
import { FadeIn } from "@/components/site/FadeIn";

export function CategoriesIndexPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-accent transition mb-8"
      >
        <ChevronLeft size={16} />
        חזרה לדף הבית
      </Link>

      {/* Hero header */}
      <FadeIn preset="section" immediate className="relative mb-10 overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-slate-800 to-sky-900" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 80%, oklch(0.706 0.147 63.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, oklch(0.55 0.15 250) 0%, transparent 45%)",
          }}
        />
        <div className="relative px-6 py-10 md:px-10 md:py-14 text-white">
          <div className="flex items-center gap-2 text-accent mb-4">
            <Zap size={18} aria-hidden className="fill-accent" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">CHOLE sport Collection</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight max-w-2xl">
            {CATEGORIES_PAGE_TITLE}
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/85 leading-relaxed max-w-xl">
            {CATEGORIES_PAGE_SUBTITLE}
          </p>
        </div>
      </FadeIn>

      {/* Registration CTA strip */}
      <FadeIn
        preset="section"
        immediate
        className="relative mb-10 overflow-hidden rounded-2xl border-2 border-accent/60 shadow-lg shadow-accent/15"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-orange-100/80 to-sky-100/60" />
        <div className="relative flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-md">
              <Sparkles size={20} aria-hidden />
            </span>
            <div>
              <p className="text-lg font-black text-foreground">{ACTIVITIES_REGISTER_CALLOUT_TITLE}</p>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {ACTIVITIES_REGISTER_CALLOUT_TEXT}
              </p>
            </div>
          </div>
          <ActivitiesRegisterCta hash={ACTIVITIES_SCHEDULE_HASH} size="lg" className="shrink-0 shadow-lg" />
        </div>
      </FadeIn>

      {/* Category grid */}
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {CATEGORIES.map((category, index) => (
          <FadeIn key={category.slug} as="li" preset="card" index={index}>
            <CategoryCard category={category} variant="featured" />
          </FadeIn>
        ))}
      </ul>
    </div>
  );
}
