import { Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/data/categories";
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
    return <img src={image} alt="" aria-hidden className="size-8 object-contain" />;
  }

  if (image) {
    return (
      <span
        aria-hidden
        className="inline-block size-8 bg-foreground group-hover:bg-accent transition [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]"
        style={{ maskImage: `url(${image})`, WebkitMaskImage: `url(${image})` }}
      />
    );
  }

  if (Icon) {
    return <Icon className="text-foreground group-hover:text-accent transition" size={28} />;
  }

  return null;
}

export function Categories() {
  return (
    <section id="categories" className="max-w-7xl mx-auto px-4 py-16 md:py-20">
      <div className="mb-10 max-w-xl">
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">תחומי ספורט</h2>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          בחרו תחום והמשיכו למוצרים — בלי רעש, בלי מבצעי ענק על כל המסך.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
        {CATEGORIES.map(({ slug, name, icon, image, imageDisplay }) => (
          <Link
            key={slug}
            to="/categories/$categorySlug"
            params={{ categorySlug: slug }}
            className="group flex items-center gap-4 bg-background px-5 py-6 hover:bg-secondary/70 transition"
          >
            <div className="shrink-0 size-12 flex items-center justify-center border border-border bg-card group-hover:border-accent/50 transition">
              <CategoryIcon icon={icon} image={image} imageDisplay={imageDisplay} />
            </div>
            <span className="text-base font-semibold text-foreground group-hover:text-accent transition leading-snug">
              {name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
