import { HERO_SLIDE_TRANSITION_MS, HERO_SLIDES } from "@/data/heroSlides";

type HeroCarouselProps = {
  activeIndex: number;
  goToSlide: (index: number) => void;
  className?: string;
};

export function HeroCarousel({ activeIndex, goToSlide, className = "" }: HeroCarouselProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div
        dir="ltr"
        className="flex h-full transition-transform ease-in-out motion-reduce:transition-none"
        style={{
          transform: `translateX(-${activeIndex * 100}%)`,
          transitionDuration: `${HERO_SLIDE_TRANSITION_MS}ms`,
        }}
      >
        {HERO_SLIDES.map((slide) => (
          <img
            key={slide.src}
            src={slide.src}
            alt=""
            className="min-w-full h-full shrink-0 object-cover bg-white"
            draggable={false}
          />
        ))}
      </div>

      <div className="pointer-events-auto absolute bottom-5 inset-x-0 flex justify-center gap-2 z-10">
        {HERO_SLIDES.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => goToSlide(index)}
            aria-label={`מעבר לשקופית ${index + 1} מתוך ${HERO_SLIDES.length}`}
            aria-current={index === activeIndex ? "true" : undefined}
            className={`h-1.5 transition-all ${
              index === activeIndex
                ? "w-8 bg-white"
                : "w-1.5 bg-white/45 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
