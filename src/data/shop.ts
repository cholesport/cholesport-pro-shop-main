import {
  BRAND_CORPORATE_TAGLINE,
  BRAND_HERO_HEADLINE,
  BRAND_HERO_SUBHEADLINE,
} from "@/data/brand";

export const SHOP_PATH = "/categories";

export const SHOP_HUB_TITLE = "חנות הציוד";
export const SHOP_HUB_SUBTITLE =
  "בחרו קטגוריה או גללו בין המוצרים — שולחנות, ג'ימבורי, איירפלור, מזרני נחיתה ואביזרי אימון.";

/** Header strip + shop hero — restored from the pre-gateway homepage. */
export const SHOP_BRAND_TAGLINE = BRAND_CORPORATE_TAGLINE;
export const SHOP_BRAND_HEADLINE = BRAND_HERO_HEADLINE;
export const SHOP_BRAND_SUPPORT = BRAND_HERO_SUBHEADLINE;

export const SHOP_OTHER_AREAS_TITLE = "גם ב-CHOLE";

export const SHOP_OTHER_AREAS = [
  {
    label: "מתחם טניס שולחן",
    href: "/table-tennis",
  },
  {
    label: "חוגי נינג'ה לילדים ונוער",
    href: "/kids",
  },
] as const;
