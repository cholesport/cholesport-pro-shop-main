import { useEffect, useRef, useState, type RefObject } from "react";

type UseInViewOnceOptions = {
  rootMargin?: string;
  threshold?: number;
  /** When true, skip observer and mark visible immediately (above-the-fold). */
  immediate?: boolean;
};

function isElementInViewport(node: Element, rootMargin = "0px") {
  const margin = Number.parseFloat(rootMargin) || 0;
  const rect = node.getBoundingClientRect();
  return rect.top < window.innerHeight + margin && rect.bottom > -margin;
}

/** Fires once when the element enters the viewport. */
export function useInViewOnce<T extends Element>(
  options: UseInViewOnceOptions = {},
): [RefObject<T | null>, boolean] {
  const { rootMargin = "0px 0px -4% 0px", threshold = 0.05, immediate = false } = options;
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

    if (isElementInViewport(node, "48px")) {
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

    // Mobile Safari can miss the first intersection pass — never leave sections hidden.
    const fallback = window.setTimeout(() => setVisible(true), 250);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [immediate, visible, rootMargin, threshold]);

  return [ref, visible];
}
