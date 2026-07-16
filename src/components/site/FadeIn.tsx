import {
  createElement,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { FADE_PRESETS, type FadePresetName } from "@/data/motion";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { cn } from "@/lib/utils";

type FadeInProps = {
  children: ReactNode;
  /** Timing preset from `src/data/motion.ts` — tweak values there. */
  preset?: FadePresetName;
  /** Extra delay on top of the preset (ms). */
  delay?: number;
  /** Stagger index for sibling items (uses preset.stagger). */
  index?: number;
  /** Animate on mount (hero / above the fold) instead of waiting for scroll. */
  immediate?: boolean;
  className?: string;
  as?: ElementType;
  style?: CSSProperties;
  id?: string;
} & Omit<HTMLAttributes<HTMLElement>, "style" | "className" | "children" | "id">;

/** Clean fade (+ light rise) for sections, cards, and page zones. */
export function FadeIn({
  children,
  preset = "section",
  delay = 0,
  index = 0,
  immediate = false,
  className,
  as = "div",
  style,
  id,
  ...rest
}: FadeInProps) {
  const config = FADE_PRESETS[preset];
  const [ref, visible] = useInViewOnce<HTMLElement>({ immediate });
  const totalDelay = config.delay + delay + index * config.stagger;

  return createElement(
    as,
    {
      ...rest,
      ref,
      id,
      className: cn("fade-motion", visible && "is-visible", className),
      style: {
        ...style,
        "--fade-duration": `${config.duration}ms`,
        "--fade-delay": `${totalDelay}ms`,
        "--fade-ease": config.ease,
        "--fade-y": `${config.y}px`,
      } as CSSProperties,
    },
    children,
  );
}

type PageFadeProps = {
  children: ReactNode;
  /** Remount key — typically the current pathname. */
  pageKey: string;
  className?: string;
};

/** Soft enter animation when navigating between routes. */
export function PageFade({ children, pageKey, className }: PageFadeProps) {
  const config = FADE_PRESETS.page;

  return (
    <div
      key={pageKey}
      className={cn("page-fade-motion", className)}
      style={
        {
          "--fade-duration": `${config.duration}ms`,
          "--fade-delay": `${config.delay}ms`,
          "--fade-ease": config.ease,
          "--fade-y": `${config.y}px`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
