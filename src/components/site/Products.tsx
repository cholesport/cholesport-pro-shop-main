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

export function Products() {
  const products = HOMEPAGE_PRODUCTS;
  const [api, setApi] = useState<CarouselApi>();
  useEmblaWheelScroll(api);

  return (
    <section id="products" className="max-w-7xl mx-auto px-4 py-16 md:py-20">
      <FadeIn preset="section" className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div className="max-w-lg">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
            {HOMEPAGE_FEATURED_TITLE}
          </h2>
          <p className="text-muted-foreground mt-3 leading-relaxed">{HOMEPAGE_FEATURED_SUBTITLE}</p>
        </div>
        <Link
          to="/categories"
          className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
        >
          לכל הקטגוריות
          <ArrowLeft size={16} aria-hidden />
        </Link>
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
        <CarouselContent className="-mr-4 ml-0 cursor-grab active:cursor-grabbing">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="pl-0 pr-4 basis-[78%] sm:basis-[48%] md:basis-[32%] lg:basis-[24%] select-none"
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {products.length > 2 && (
          <>
            <CarouselPrevious className="hidden sm:flex -right-3 md:-right-4 left-auto top-[38%] -translate-y-1/2 z-10 bg-background/95 shadow-sm" />
            <CarouselNext className="hidden sm:flex -left-3 md:-left-4 right-auto top-[38%] -translate-y-1/2 z-10 bg-background/95 shadow-sm" />
          </>
        )}
      </Carousel>
      </FadeIn>
    </section>
  );
}
