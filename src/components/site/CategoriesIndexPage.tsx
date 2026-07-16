import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import {
  CATEGORIES,
  CATEGORIES_PAGE_SUBTITLE,
  CATEGORIES_PAGE_TITLE,
  type CategoryDefinition,
} from "@/data/categories";
import type { LucideIcon } from "lucide-react";
import { FadeIn } from "@/components/site/FadeIn";

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
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition mb-8"
      >
        <ChevronLeft size={16} />
        חזרה לדף הבית
      </Link>

      <FadeIn preset="section" immediate className="mb-10 pb-8 border-b border-border max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">{CATEGORIES_PAGE_TITLE}</h1>
        <p className="text-muted-foreground mt-3 leading-relaxed">{CATEGORIES_PAGE_SUBTITLE}</p>
      </FadeIn>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
        {CATEGORIES.map((category, index) => (
          <FadeIn key={category.slug} as="li" preset="card" index={index}>
            <Link
              to="/categories/$categorySlug"
              params={{ categorySlug: category.slug }}
              className="group flex h-full items-start gap-5 bg-background px-5 py-7 md:px-6 md:py-8 hover:bg-secondary/70 transition"
            >
              <div className="shrink-0 size-14 flex items-center justify-center border border-border bg-card group-hover:border-accent/50 transition">
                <CategoryIcon
                  icon={category.icon}
                  image={category.image}
                  imageDisplay={category.imageDisplay}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg md:text-xl font-bold text-foreground group-hover:text-accent transition leading-snug">
                    {category.name}
                  </h2>
                  <ChevronLeft
                    size={18}
                    className="shrink-0 mt-1 text-muted-foreground group-hover:text-accent transition"
                    aria-hidden
                  />
                </div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {categorySummary(category)}
                </p>
                {category.subcategories.length > 0 && (
                  <p className="mt-3 text-xs font-medium text-muted-foreground/80">
                    {category.subcategories.length} אפשרויות
                  </p>
                )}
              </div>
            </Link>
          </FadeIn>
        ))}
      </ul>
    </div>
  );
}
