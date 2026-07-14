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
 * Soft black veil over the full frame + stronger panel behind the copy,
 * so white text pops without crushing product photos.
 */
const HERO_OVERLAY =
  "linear-gradient(270deg, oklch(0.12 0.01 60 / 0.55) 0%, oklch(0.14 0.01 60 / 0.28) 42%, oklch(0.16 0.01 60 / 0.12) 100%)";

const HERO_COPY_SCRIM =
  "linear-gradient(180deg, oklch(0.08 0.01 60 / 0.55) 0%, oklch(0.1 0.01 60 / 0.42) 55%, oklch(0.12 0.01 60 / 0.22) 100%)";

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

        <div className="relative z-10 mx-auto flex min-h-[78vh] md:min-h-[85vh] max-w-7xl items-start px-4 pt-10 pb-24 sm:pt-14 md:pt-16 md:pb-28">
          <div
            className="w-full max-w-3xl rounded-xl px-5 py-6 text-white sm:px-7 sm:py-7 lg:max-w-4xl"
            style={{ background: HERO_COPY_SCRIM }}
          >
            <div className="mb-5 inline-flex items-center gap-3 md:mb-6">
              <span className="h-px w-8 bg-accent/80" aria-hidden />
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accent sm:text-xs">
                {BRAND_CORPORATE_TAGLINE}
              </span>
              <span className="h-px w-8 bg-accent/80" aria-hidden />
            </div>

            <h1
              id="hero-heading"
              className="text-balance text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
            >
              <span className="text-accent">CHOLE</span>
              <span> ציוד ספורט שמתוכנן על ידי ספורטאים.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-white/95 sm:text-lg md:mt-6 md:text-xl md:leading-relaxed">
              {BRAND_HERO_SUBHEADLINE}
            </p>

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
