/** Canonical production site identity for SEO and absolute URLs. */

export const SITE_ORIGIN = "https://cholesport.co.il";
export const SITE_HOST = "cholesport.co.il";
export const SITE_WWW_HOST = "www.cholesport.co.il";

export const SITE_NAME = "CHOLE sport";
export const SITE_NAME_HE = "צ׳ולה ספורט";

/** Absolute URL helper (path may start with `/` or be empty). */
export function absoluteUrl(path = "/") {
  if (!path || path === "/") return SITE_ORIGIN;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_ORIGIN}${normalized}`;
}

export const SITE_DEFAULT_OG_IMAGE = absoluteUrl("/og-image.png");

export const SITE_SEO_TITLE =
  "CHOLE sport | cholesport.co.il — ציוד ספורט מקצועי";

export const SITE_SEO_DESCRIPTION =
  "CHOLE sport (cholesport.co.il) — חנות ציוד ספורט מקצועי: שולחנות טניס שולחן, אביזרי אימון, ג׳ימבורי, מזרני איירפלור ונחיתה. הזמנה ותשלום בוואטסאפ · בית השואבה 6, תל אביב.";

export const SITE_KEYWORDS = [
  "CHOLE sport",
  "cholesport",
  "cholesport.co.il",
  "www.cholesport.co.il",
  "צ׳ולה ספורט",
  "ציוד ספורט",
  "טניס שולחן",
  "מזרני איירפלור",
  "ג׳ימבורי",
  "אביזרי אימון",
  "תל אביב",
].join(", ");
