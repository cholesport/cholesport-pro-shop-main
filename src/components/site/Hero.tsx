import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { HeroCarousel } from "@/components/site/HeroCarousel";
import { FadeIn } from "@/components/site/FadeIn";
import { useHeroCarousel } from "@/hooks/useHeroCarousel";
import {
  BRAND_CORPORATE_TAGLINE,
  BRAND_HERO_CTA,
  BRAND_HERO_SUBHEADLINE,
} from "@/data/brand";

/**
 * Full-bleed dark veil graded top → bottom across the entire upper hero,
 * so copy stays readable while product photos remain visible lower down.
 */
const HERO_OVERLAY = [
  "linear-gradient(180deg,",
  "oklch(0.07 0.01 60 / 0.78) 0%,",
  "oklch(0.09 0.01 60 / 0.62) 28%,",
  "oklch(0.12 0.01 60 / 0.38) 58%,",
  "oklch(0.16 0.01 60 / 0.16) 82%,",
  "oklch(0.18 0.01 60 / 0.04) 100%)",
].join(" ");

export function Hero() {
  const { activeIndex, goToSlide, pause, resume } = useHeroCarousel();

  return (
    <section
      className="relative overflow-hidden border-b border-border"
      aria-labelledby="hero-heading"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div className="relative min-h-[78vh] md:min-h-[85vh]">
        <HeroCarousel activeIndex={activeIndex} goToSlide={goToSlide} />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: HERO_OVERLAY }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex min-h-[78vh] md:min-h-[85vh] max-w-7xl items-start px-4 pt-10 pb-24 sm:pt-14 md:pt-16 md:pb-28">
          <div className="w-full max-w-3xl text-white lg:max-w-4xl">
            <FadeIn preset="hero" immediate index={0} className="mb-5 inline-flex items-center gap-3 md:mb-6">
              <span className="h-px w-8 bg-accent/80" aria-hidden />
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accent sm:text-xs">
                {BRAND_CORPORATE_TAGLINE}
              </span>
              <span className="h-px w-8 bg-accent/80" aria-hidden />
            </FadeIn>

            <FadeIn preset="hero" immediate index={1} as="h1" id="hero-heading" className="text-balance text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              <span className="text-accent">CHOLE</span>
              <span> ציוד ספורט שמתוכנן על ידי ספורטאים.</span>
            </FadeIn>

            <FadeIn preset="hero" immediate index={2} as="p" className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-white/95 sm:text-lg md:mt-6 md:text-xl md:leading-relaxed">
              {BRAND_HERO_SUBHEADLINE}
            </FadeIn>

            <FadeIn preset="hero" immediate index={3} className="mt-8 sm:mt-10">
              <Link
                to="/categories"
                className="inline-flex items-center justify-center gap-2 bg-accent px-8 py-3.5 text-sm font-bold tracking-wide text-accent-foreground transition hover:opacity-90 sm:text-base"
              >
                {BRAND_HERO_CTA}
                <ArrowLeft size={18} aria-hidden />
              </Link>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
