/**
 * Site-wide fade / motion timings.
 * Tweak values here to tune each zone without hunting through components.
 *
 * duration - fade length in ms
 * delay - base delay before the zone starts
 * stagger - extra delay between sibling items (ms × index)
 * y - subtle upward drift in px (0 = pure fade)
 * ease - CSS easing
 */

export type FadePresetName =
  | "page"
  | "hero"
  | "section"
  | "sectionSlow"
  | "card"
  | "promo"
  | "footer"
  | "floating"
  | "detail";

export type FadePreset = {
  duration: number;
  delay: number;
  stagger: number;
  y: number;
  ease: string;
};

export const FADE_PRESETS: Record<FadePresetName, FadePreset> = {
  /** Full-page enter on route change */
  page: {
    duration: 420,
    delay: 0,
    stagger: 0,
    y: 8,
    ease: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  /** Hero copy on first paint */
  hero: {
    duration: 700,
    delay: 80,
    stagger: 110,
    y: 18,
    ease: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  /** Homepage / category sections scrolling into view */
  section: {
    duration: 650,
    delay: 0,
    stagger: 70,
    y: 16,
    ease: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  sectionSlow: {
    duration: 850,
    delay: 40,
    stagger: 90,
    y: 20,
    ease: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  /** Product / category cards in a grid */
  card: {
    duration: 520,
    delay: 0,
    stagger: 55,
    y: 14,
    ease: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  promo: {
    duration: 600,
    delay: 0,
    stagger: 80,
    y: 12,
    ease: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  footer: {
    duration: 700,
    delay: 0,
    stagger: 60,
    y: 14,
    ease: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  floating: {
    duration: 500,
    delay: 400,
    stagger: 0,
    y: 10,
    ease: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  /** Product detail blocks */
  detail: {
    duration: 560,
    delay: 0,
    stagger: 65,
    y: 12,
    ease: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
};
