import choleLogo from "@/assets/chole-sport-logo.png";
import levitateLogo from "@/assets/brands/levitate-logo.png";
import levitateLogoOnDark from "@/assets/brands/levitate-logo-on-dark.png";
import pongBotLogo from "@/assets/brands/pong-bot-logo.png";

/**
 * Brands carried in the CHOLE sport storefront.
 * Add new entries here when more manufacturers are introduced -
 * the homepage strip, footer, PDP mark, and category headers read from this list.
 */
export type StoreBrand = {
  id: string;
  name: string;
  /** Logo for light backgrounds */
  logo: string;
  /** Optional logo for dark backgrounds (falls back to `logo`) */
  logoOnDark?: string;
  /** Values that match `Product.brand` (with or without ®) */
  productBrands: string[];
  /** Category slugs where this brand should be featured in the page header */
  categorySlugs: string[];
  /** Optional deep-link for the logo (category or section) */
  href: string;
  /** Extra classes on the logo image (optical size matching) */
  markClassName?: string;
  /** Optional taller height classes keyed by the row's base heightClass */
  markHeightClassByBase?: Record<string, string>;
};

export const STORE_BRANDS: StoreBrand[] = [
  {
    id: "chole",
    name: "CHOLE",
    logo: choleLogo,
    productBrands: ["CHOLE®", "CHOLE"],
    categorySlugs: ["pro-game-tables", "table-tennis-equipment", "training-accessories"],
    href: "/#products",
  },
  {
    id: "levitate",
    name: "LEVITATE",
    logo: levitateLogo,
    logoOnDark: levitateLogoOnDark,
    productBrands: ["LEVITATE®", "LEVITATE"],
    categorySlugs: ["airfloor-mats", "flexi-roll", "landing-mats", "gymboree"],
    href: "/categories/airfloor-mats",
  },
  {
    id: "pong-bot",
    name: "PONG BOT",
    logo: pongBotLogo,
    productBrands: ["PONG BOT®", "PONG BOT"],
    categorySlugs: ["table-tennis-equipment"],
    href: "/products/pong-bot-nova-s-pro",
    // Stacked wordmark needs a taller frame to match wide single-line logos.
    markHeightClassByBase: {
      "h-5": "h-7",
      "h-7": "h-10",
      "h-7 md:h-8": "h-10 md:h-11",
      "h-8": "h-11",
      "h-10 md:h-12": "h-14 md:h-16",
    },
  },
];

export const BRANDS_SECTION_TITLE = "המותגים שלנו";
export const BRANDS_SECTION_SUBTITLE =
  "ציוד מקצועי מבית CHOLE, LEVITATE ו-PONG BOT - ובהמשך עוד מותגים שיצטרפו לחנות.";

function normalizeBrandKey(value: string) {
  return value.replace(/®/g, "").trim().toUpperCase();
}

export function getStoreBrandByProductBrand(productBrand: string): StoreBrand | undefined {
  const key = normalizeBrandKey(productBrand);
  return STORE_BRANDS.find((brand) =>
    brand.productBrands.some((candidate) => normalizeBrandKey(candidate) === key),
  );
}

export function getStoreBrandByCategorySlug(slug: string): StoreBrand | undefined {
  return STORE_BRANDS.find((brand) => brand.categorySlugs.includes(slug));
}

export function getBrandLogo(brand: StoreBrand, variant: "light" | "dark" = "light") {
  if (variant === "dark") return brand.logoOnDark ?? brand.logo;
  return brand.logo;
}

/** Resolve display height so optically-smaller marks match neighbors. */
export function getBrandMarkHeightClass(brand: StoreBrand, baseHeightClass: string) {
  return brand.markHeightClassByBase?.[baseHeightClass] ?? baseHeightClass;
}
