import { useEffect } from "react";
import type { CarouselApi } from "@/components/ui/carousel";
import {
  CAROUSEL_WHEEL_DURATION,
  CAROUSEL_WHEEL_FRICTION,
  CAROUSEL_WHEEL_SENSITIVITY,
} from "@/lib/carouselMotion";

/**
 * Continuous wheel/trackpad scrolling with fixed duration + friction,
 * so the strip moves at a steady, satisfying pace instead of jumpy snaps.
 */
export function useEmblaWheelScroll(api: CarouselApi | undefined) {
  useEffect(() => {
    if (!api) return;

    const root = api.rootNode();

    const onWheel = (event: WheelEvent) => {
      const dominantDelta =
        Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;

      if (Math.abs(dominantDelta) < 1) return;

      event.preventDefault();

      let delta = dominantDelta;
      if (event.deltaMode === 1) delta *= 16;
      if (event.deltaMode === 2) delta *= root.clientWidth;

      const engine = api.internalEngine();
      const rtl = engine.options.direction === "rtl";
      // Match finger/wheel direction: content should travel with the gesture, not against it.
      const distance = (rtl ? -delta : delta) * CAROUSEL_WHEEL_SENSITIVITY;

      engine.scrollBody.useDuration(CAROUSEL_WHEEL_DURATION).useFriction(CAROUSEL_WHEEL_FRICTION);
      engine.scrollTo.distance(distance, false);
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, [api]);
}
