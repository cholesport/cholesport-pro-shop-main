import { useEffect, useRef, useState, type RefObject } from "react";

type UseInViewOnceOptions = {
  rootMargin?: string;
  threshold?: number;
  /** When true, skip observer and mark visible immediately (above-the-fold). */
  immediate?: boolean;
};

/** Fires once when the element enters the viewport. */
export function useInViewOnce<T extends Element>(
  options: UseInViewOnceOptions = {},
): [RefObject<T | null>, boolean] {
  const { rootMargin = "0px 0px -8% 0px", threshold = 0.12, immediate = false } = options;
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(immediate);

  useEffect(() => {
    if (immediate || visible) return;
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [immediate, visible, rootMargin, threshold]);

  return [ref, visible];
}
