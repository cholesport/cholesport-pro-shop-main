import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { HeroCarousel } from "@/components/site/HeroCarousel";
import { useHeroCarousel } from "@/hooks/useHeroCarousel";
import {
  BRAND_CORPORATE_TAGLINE,
  BRAND_HERO_CTA,
  BRAND_HERO_SUBHEADLINE,
} from "@/data/brand";

/**
 * Subtle dark overlay — keeps product photos bright while white text stays readable.
 * Stronger on the copy side, lighter across the rest of the frame.
 */
const HERO_OVERLAY =
  "linear-gradient(270deg, oklch(0.14 0.02 165 / 0.62) 0%, oklch(0.16 0.02 165 / 0.4) 45%, oklch(0.18 0.02 165 / 0.22) 100%)";

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

        <div className="absolute inset-0 pointer-events-none" style={{ background: HERO_OVERLAY }} />

        <div className="relative z-10 mx-auto flex min-h-[78vh] md:min-h-[85vh] max-w-7xl items-center px-4 py-16 md:py-20">
          <div className="w-full max-w-3xl text-white lg:max-w-4xl">
            {/* 1. Small top branding */}
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-white md:text-sm">
              <span className="text-accent">CHOLE</span>
              <span className="text-white/70"> sport</span>
            </p>

            {/* 2. Secondary tag */}
            <div className="mb-5 inline-flex items-center gap-3 md:mb-6">
              <span className="h-px w-8 bg-accent/80" aria-hidden />
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accent sm:text-xs">
                {BRAND_CORPORATE_TAGLINE}
              </span>
              <span className="h-px w-8 bg-accent/80" aria-hidden />
            </div>

            {/* 3. Main H1 */}
            <h1
              id="hero-heading"
              className="text-balance text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
            >
              <span className="text-accent">CHOLE</span>
              <span> ציוד ספורט שמתוכנן על ידי ספורטאים.</span>
            </h1>

            {/* 4. Subheadline */}
            <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-white/92 sm:text-lg md:mt-6 md:text-xl md:leading-relaxed">
              {BRAND_HERO_SUBHEADLINE}
            </p>

            {/* 5. CTA */}
            <div className="mt-8 sm:mt-10">
              <Link
                to="/categories"
                className="inline-flex items-center justify-center gap-2 bg-accent px-8 py-3.5 text-sm font-bold tracking-wide text-accent-foreground transition hover:opacity-90 sm:text-base"
              >
                {BRAND_HERO_CTA}
                <ArrowLeft size={18} aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
