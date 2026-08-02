import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CategoryDefinition } from "@/data/categories";
import { getCategoryTheme } from "@/data/categoryThemes";
import { cn } from "@/lib/utils";

function CategoryIcon({
  icon: Icon,
  image,
  imageDisplay = "mask",
  tintClass,
  size = "lg",
}: {
  icon?: LucideIcon;
  image?: string;
  imageDisplay?: "mask" | "logo";
  tintClass: string;
  size?: "md" | "lg";
}) {
  const iconSize = size === "lg" ? 34 : 28;
  const imgSize = size === "lg" ? "size-10" : "size-8";

  if (image && imageDisplay === "logo") {
    return (
      <img
        src={image}
        alt=""
        aria-hidden
        className={cn(imgSize, "object-contain drop-shadow-sm")}
      />
    );
  }

  if (image) {
    return (
      <span
        aria-hidden
        className={cn(
          "inline-block bg-white",
          imgSize,
          "[mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]",
          "[-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]",
        )}
        style={{ maskImage: `url(${image})`, WebkitMaskImage: `url(${image})` }}
      />
    );
  }

  if (Icon) {
    return <Icon className={cn("transition", tintClass)} size={iconSize} aria-hidden />;
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

type CategoryCardProps = {
  category: CategoryDefinition;
  variant?: "featured" | "compact";
  className?: string;
};

/** Vibrant, conversion-focused category card. */
export function CategoryCard({ category, variant = "featured", className }: CategoryCardProps) {
  const theme = getCategoryTheme(category.slug);
  const optionCount = category.subcategories.length;
  const ctaLabel =
    optionCount > 0 ? `לקניה — ${optionCount} אפשרויות` : "לצפייה במוצרים";

  if (variant === "compact") {
    return (
      <Link
        to="/categories/$categorySlug"
        params={{ categorySlug: category.slug }}
        className={cn(
          "group relative flex h-full items-center gap-4 overflow-hidden rounded-2xl border-2 p-4",
          "transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-xl",
          theme.card,
          theme.glow,
          className,
        )}
      >
        {theme.badge && (
          <span
            className={cn(
              "absolute top-2.5 left-2.5 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide",
              theme.badge.className,
            )}
          >
            {theme.badge.label}
          </span>
        )}
        <div
          className={cn(
            "flex size-14 shrink-0 items-center justify-center rounded-xl transition group-hover:scale-110",
            theme.iconWrap,
          )}
        >
          <CategoryIcon
            icon={category.icon}
            image={category.image}
            imageDisplay={category.imageDisplay}
            tintClass={theme.iconTint}
            size="md"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              "text-base font-extrabold leading-snug text-foreground transition",
              theme.titleHover,
            )}
          >
            {category.name}
          </h3>
          <span
            className={cn(
              "mt-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold transition group-hover:scale-105",
              theme.cta,
            )}
          >
            לקניה עכשיו
            <ArrowLeft size={12} aria-hidden />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to="/categories/$categorySlug"
      params={{ categorySlug: category.slug }}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 p-5 md:p-6",
        "transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-2xl",
        theme.card,
        theme.glow,
        className,
      )}
    >
      {theme.badge && (
        <span
          className={cn(
            "absolute top-4 left-4 z-10 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide",
            theme.badge.className,
          )}
        >
          {theme.badge.label}
        </span>
      )}

      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex size-16 shrink-0 items-center justify-center rounded-2xl transition duration-300 group-hover:scale-110 group-hover:rotate-3",
            theme.iconWrap,
          )}
        >
          <CategoryIcon
            icon={category.icon}
            image={category.image}
            imageDisplay={category.imageDisplay}
            tintClass={theme.iconTint}
            size="lg"
          />
        </div>
        <div className="min-w-0 flex-1 pt-1">
          <h2
            className={cn(
              "text-xl font-black leading-tight text-foreground transition md:text-2xl",
              theme.titleHover,
            )}
          >
            {category.name}
          </h2>
        </div>
        <ArrowLeft
          size={20}
          className={cn(
            "mt-1 shrink-0 text-muted-foreground/50 transition group-hover:translate-x-[-4px] group-hover:text-foreground",
          )}
          aria-hidden
        />
      </div>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
        {categorySummary(category)}
      </p>

      <span
        className={cn(
          "mt-5 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition duration-300 group-hover:scale-105",
          theme.cta,
        )}
      >
        {ctaLabel}
        <ArrowLeft size={16} className="transition group-hover:translate-x-[-3px]" aria-hidden />
      </span>
    </Link>
  );
}
