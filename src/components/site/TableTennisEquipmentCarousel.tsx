import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  getTableTennisEquipmentProducts,
  TABLE_TENNIS_EQUIPMENT_CATEGORY_SLUG,
  type Product,
} from "@/data/products";

type TableTennisEquipmentCarouselProps = {
  /** Exclude the current product from the carousel (e.g. when viewing the robot page). */
  excludeProductId?: string;
  /** Prioritize this product first in the carousel (e.g. the training robot). */
  prioritizeProductId?: string;
};

function sortEquipment(products: Product[], prioritizeId?: string): Product[] {
  if (!prioritizeId) return products;
  const prioritized = products.find((p) => p.id === prioritizeId);
  const rest = products.filter((p) => p.id !== prioritizeId);
  return prioritized ? [prioritized, ...rest] : products;
}

export function TableTennisEquipmentCarousel({
  excludeProductId,
  prioritizeProductId,
}: TableTennisEquipmentCarouselProps) {
  const products = sortEquipment(
    getTableTennisEquipmentProducts().filter((p) => p.id !== excludeProductId),
    prioritizeProductId,
  );

  if (products.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-border" aria-labelledby="tt-equipment-carousel-heading">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h2 id="tt-equipment-carousel-heading" className="text-xl font-bold text-foreground">
            עוד מציוד הטניס שולחן שלנו
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            מוצרים משלימים ומקצועיים — רובוטי אימון, מחבטים, כדורים ועוד
          </p>
        </div>
        <Link
          to="/categories/$categorySlug"
          params={{ categorySlug: TABLE_TENNIS_EQUIPMENT_CATEGORY_SLUG }}
          className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
        >
          לכל קטגוריית ציוד טניס שולחן
          <ArrowLeft size={16} />
        </Link>
      </div>

      <Carousel
        opts={{ align: "start", direction: "rtl" }}
        className="w-full"
      >
        <CarouselContent className="-mr-4 ml-0">
          {products.map((product) => (
            <CarouselItem key={product.id} className="pl-0 pr-4 basis-[72%] sm:basis-[48%] md:basis-[32%] lg:basis-[24%]">
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {products.length > 2 && (
          <>
            <CarouselPrevious className="hidden md:flex -right-4 left-auto top-1/2 -translate-y-1/2" />
            <CarouselNext className="hidden md:flex -left-4 right-auto top-1/2 -translate-y-1/2" />
          </>
        )}
      </Carousel>
    </section>
  );
}
