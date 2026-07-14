import { Link } from "@tanstack/react-router";
import { ChevronLeft, MapPin, Phone } from "lucide-react";
import type { CategoryDefinition } from "@/data/categories";
import type { Product } from "@/data/products";
import { ProductCard } from "@/components/site/ProductCard";
import { COMPANY } from "@/data/legal";
import { SHOWROOM_PAGE_PARAGRAPHS } from "@/data/showroom";
import { ShowroomActivitiesSection } from "@/components/site/ShowroomActivitiesSection";
import { BrandMark } from "@/components/site/BrandLogos";
import { getStoreBrandByCategorySlug } from "@/data/brands";
import type { LucideIcon } from "lucide-react";

type CategoryPageProps = {
  category: CategoryDefinition;
  products: Product[];
};

function CategoryIcon({
  icon: Icon,
  image,
  imageDisplay = "mask",
  sizeClass = "size-10",
}: {
  icon?: LucideIcon;
  image?: string;
  imageDisplay?: "mask" | "logo";
  sizeClass?: string;
}) {
  if (image && imageDisplay === "logo") {
    return <img src={image} alt="" aria-hidden className={`${sizeClass} object-contain`} />;
  }

  if (image) {
    return (
      <span
        aria-hidden
        className="inline-block size-10 bg-primary [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]"
        style={{ maskImage: `url(${image})`, WebkitMaskImage: `url(${image})` }}
      />
    );
  }
  if (Icon) return <Icon className="text-primary" size={40} aria-hidden />;
  return null;
}

export function CategoryPage({ category, products }: CategoryPageProps) {
  const isShowRoom = category.slug === "show-room";
  const introParagraphs = isShowRoom ? SHOWROOM_PAGE_PARAGRAPHS : category.description ? [category.description] : [];
  const storeBrand = getStoreBrandByCategorySlug(category.slug);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <Link
        to="/categories"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition mb-8"
      >
        <ChevronLeft size={16} />
        חזרה לקטגוריות
      </Link>

      <header className="flex flex-col md:flex-row md:items-center gap-6 mb-10 pb-8 border-b border-border">
        <div className="w-16 h-16 border border-border bg-secondary flex items-center justify-center shrink-0">
          <CategoryIcon icon={category.icon} image={category.image} imageDisplay={category.imageDisplay} />
        </div>
        <div className="flex-1">
          {storeBrand && (
            <div className="mb-3">
              <BrandMark brand={storeBrand} heightClass="h-8 md:h-9" linked={false} />
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">{category.name}</h1>
          {introParagraphs.length > 0 ? (
            <div className="mt-3 space-y-3 max-w-2xl">
              {introParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground/60 mt-3 text-sm italic">תיאור הקטגוריה יתווסף בקרוב.</p>
          )}

          {isShowRoom && (
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <p className="inline-flex items-center gap-2 text-foreground">
                <MapPin size={16} className="text-accent shrink-0" aria-hidden />
                {COMPANY.address}, צמוד למחסן
              </p>
              <a
                href={`tel:${COMPANY.phone.replace(/-/g, "")}`}
                className="inline-flex items-center gap-2 text-accent font-semibold hover:underline"
              >
                <Phone size={16} aria-hidden />
                {COMPANY.phone}
              </a>
            </div>
          )}
        </div>
      </header>

      {isShowRoom ? (
        <ShowroomActivitiesSection />
      ) : (
        category.subcategories.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
              מידות זמינות
            </h2>
            <div className="flex flex-wrap gap-2">
              {category.subcategories.map((sub, index) => {
                const productId = category.subcategoryProductIds?.[index];
                const chipClass =
                  "px-4 py-2 bg-secondary text-sm font-medium text-foreground hover:bg-accent/10 hover:text-accent transition";

                if (productId) {
                  return (
                    <Link
                      key={sub}
                      to="/products/$productId"
                      params={{ productId }}
                      className={chipClass}
                    >
                      {sub}
                    </Link>
                  );
                }

                return (
                  <span key={sub} className={chipClass}>
                    {sub}
                  </span>
                );
              })}
            </div>
          </section>
        )
      )}

      {!isShowRoom && (
        <section>
          <div className="flex items-end justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-foreground">מוצרים</h2>
            {products.length > 0 && (
              <span className="text-sm text-muted-foreground">{products.length} מוצרים</span>
            )}
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card border border-border rounded-xl">
              <p className="text-muted-foreground">מוצרים בקטגוריה זו יתווספו בקרוב.</p>
              <Link to="/" className="inline-block mt-4 text-sm font-semibold text-accent hover:underline">
                חזרה לדף הבית
              </Link>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
