import { useCallback, useEffect, useState } from "react";
import { HERO_SLIDE_INTERVAL_MS, HERO_SLIDES } from "@/data/heroSlides";

/** Auto-advances hero slides; pauses while hovered. */
export function useHeroCarousel(intervalMs = HERO_SLIDE_INTERVAL_MS) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slideCount = HERO_SLIDES.length;

  const goToNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % slideCount);
  }, [slideCount]);

  const goToSlide = useCallback(
    (index: number) => {
      if (index >= 0 && index < slideCount) setActiveIndex(index);
    },
    [slideCount],
  );

  const pause = useCallback(() => setPaused(true), []);
  const resume = useCallback(() => setPaused(false), []);

  useEffect(() => {
    if (paused || slideCount <= 1) return;
    const timer = window.setInterval(goToNext, intervalMs);
    return () => window.clearInterval(timer);
  }, [goToNext, intervalMs, paused, slideCount]);

  return { activeIndex, goToSlide, slideCount, pause, resume };
}
