import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { HOMEPAGE_PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/site/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  HOMEPAGE_FEATURED_SUBTITLE,
  HOMEPAGE_FEATURED_TITLE,
} from "@/data/brand";
import { useEmblaWheelScroll } from "@/hooks/useEmblaWheelScroll";
import { CAROUSEL_SETTLE_DURATION } from "@/lib/carouselMotion";
import { FadeIn } from "@/components/site/FadeIn";
import { cn } from "@/lib/utils";

type ProductsProps = {
  /** Hide "לכל הקטגוריות" when already on the categories hub. */
  showCategoriesLink?: boolean;
  className?: string;
};

export function Products({ showCategoriesLink = true, className }: ProductsProps) {
  const products = HOMEPAGE_PRODUCTS;
  const [api, setApi] = useState<CarouselApi>();
  useEmblaWheelScroll(api);

  return (
    <section
      id="products"
      className={cn(
        "mx-auto max-w-7xl px-3 py-8 md:px-4 md:py-16 lg:py-20",
        className,
      )}
    >
      <FadeIn
        preset="section"
        className="mb-5 flex flex-wrap items-end justify-between gap-3 md:mb-10 md:gap-4"
      >
        <div className="max-w-xl">
          <h2 className="text-2xl font-extrabold text-foreground md:text-4xl">
            {HOMEPAGE_FEATURED_TITLE}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:mt-3 md:text-base">
            {HOMEPAGE_FEATURED_SUBTITLE}
          </p>
        </div>
        {showCategoriesLink && (
          <Link
            to="/categories"
            className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
          >
            לכל הקטגוריות
            <ArrowLeft size={16} aria-hidden />
          </Link>
        )}
      </FadeIn>

      <FadeIn preset="sectionSlow" delay={80}>
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            direction: "rtl",
            loop: true,
            dragFree: true,
            duration: CAROUSEL_SETTLE_DURATION,
            skipSnaps: false,
          }}
          className="w-full touch-pan-y"
        >
          <CarouselContent className="-mr-3 ml-0 cursor-grab active:cursor-grabbing md:-mr-5">
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="basis-[88%] select-none pl-0 pr-3 sm:basis-[58%] md:basis-[46%] md:pr-5 lg:basis-[38%]"
              >
                <ProductCard product={product} size="featured" />
              </CarouselItem>
            ))}
          </CarouselContent>
          {products.length > 1 && (
            <>
              <CarouselPrevious className="absolute top-[42%] z-10 hidden -translate-y-1/2 bg-background/95 shadow-sm sm:flex -right-2 left-auto md:-right-3" />
              <CarouselNext className="absolute top-[42%] z-10 hidden -translate-y-1/2 bg-background/95 shadow-sm sm:flex -left-2 right-auto md:-left-3" />
            </>
          )}
        </Carousel>
      </FadeIn>
    </section>
  );
}
