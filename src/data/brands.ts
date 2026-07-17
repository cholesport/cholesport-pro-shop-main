import choleLogo from "@/assets/chole-sport-logo.png";
import levitateLogo from "@/assets/brands/levitate-logo.png";
import levitateLogoOnDark from "@/assets/brands/levitate-logo-on-dark.png";

/**
 * Brands carried in the CHOLE sport storefront.
 * Add new entries here when more manufacturers are introduced —
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
];

export const BRANDS_SECTION_TITLE = "המותגים שלנו";
export const BRANDS_SECTION_SUBTITLE =
  "ציוד מקצועי מבית CHOLE ו-LEVITATE — ובהמשך עוד מותגים שיצטרפו לחנות.";

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
