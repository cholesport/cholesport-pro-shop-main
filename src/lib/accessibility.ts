export type A11ySettings = {
  fontSize: "normal" | "large" | "xlarge";
  highContrast: boolean;
  highlightLinks: boolean;
  readableFont: boolean;
  reduceMotion: boolean;
};

export const A11Y_STORAGE_KEY = "chole-a11y-settings";

export const DEFAULT_A11Y: A11ySettings = {
  fontSize: "normal",
  highContrast: false,
  highlightLinks: false,
  readableFont: false,
  reduceMotion: false,
};

export function loadA11ySettings(): A11ySettings {
  if (typeof window === "undefined") return DEFAULT_A11Y;
  try {
    const raw = localStorage.getItem(A11Y_STORAGE_KEY);
    if (!raw) return DEFAULT_A11Y;
    return { ...DEFAULT_A11Y, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_A11Y;
  }
}

export function saveA11ySettings(settings: A11ySettings) {
  localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(settings));
}

export function applyA11ySettings(settings: A11ySettings) {
  const root = document.documentElement;
  root.classList.remove(
    "a11y-font-large",
    "a11y-font-xlarge",
    "a11y-high-contrast",
    "a11y-highlight-links",
    "a11y-readable-font",
    "a11y-reduce-motion",
  );

  if (settings.fontSize === "large") root.classList.add("a11y-font-large");
  if (settings.fontSize === "xlarge") root.classList.add("a11y-font-xlarge");
  if (settings.highContrast) root.classList.add("a11y-high-contrast");
  if (settings.highlightLinks) root.classList.add("a11y-highlight-links");
  if (settings.readableFont) root.classList.add("a11y-readable-font");
  if (settings.reduceMotion) root.classList.add("a11y-reduce-motion");
}
