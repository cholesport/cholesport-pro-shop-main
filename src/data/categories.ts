import type { LucideIcon } from "lucide-react";
import { Heart } from "lucide-react";
import tableTennisPaddle from "@/assets/table-tennis-paddle.png";
import proGameTablesIcon from "@/assets/pro-game-tables-icon.png";
import airfloorMatsIcon from "@/assets/airfloor-mats-icon.png";
import landingMatsIcon from "@/assets/landing-mats-icon.png";
import showRoomIcon from "@/assets/show-room-icon.png";
import { LANDING_MAT_VARIANTS } from "@/data/landingMats";
import { AIRFLOOR_MAT_VARIANTS } from "@/data/airfloorMats";
import { SHOWROOM_ACTIVITIES } from "@/data/showroom";

/** Maps product.cat values in products.ts to each storefront category. */
export type CategoryDefinition = {
  slug: string;
  name: string;
  /** Placeholder — fill in later with marketing copy. */
  description: string;
  /** Optional anchor IDs aligned with subcategories (same order) — for in-page links. */
  subcategoryAnchorIds?: string[];
  subcategories: string[];
  productCats: string[];
  icon?: LucideIcon;
  image?: string;
  /** Full-color logo vs tinted silhouette mask. */
  imageDisplay?: "mask" | "logo";
  /** Optional product IDs aligned with subcategories (same order). */
  subcategoryProductIds?: string[];
};

export const CATEGORIES: CategoryDefinition[] = [
  {
    slug: "table-tennis-equipment",
    name: "ציוד טניס שולחן",
    description: "",
    subcategories: ["PONG BOT NOVA S PRO", "מחבטים", "כדורים", "רשתות ועמודים"],
    subcategoryProductIds: ["pong-bot-nova-s-pro"],
    productCats: ["טניס שולחן"],
    image: tableTennisPaddle,
  },
  {
    slug: "pro-game-tables",
    name: "שולחנות משחק מקצועיים",
    description: "",
    subcategories: ["CHOLE PRO 25", "CHOLE outdoor 18", "CHOLE NAVY6"],
    subcategoryProductIds: ["chole-pro-25", "chole-outdoor-18", "chole-navy6"],
    productCats: ["שולחנות משחק"],
    image: proGameTablesIcon,
  },
  {
    slug: "gymboree",
    name: "ציוד ג׳ימבורי",
    description: "",
    subcategories: ["מזרני יוגה", "בלוקים ורצועות", "ריפורמרים", "גלילי קצף"],
    productCats: [],
    icon: Heart,
  },
  {
    slug: "airfloor-mats",
    name: "מזרני איירפלור",
    description:
      "מזרני איירפלור מקצועיים מ-LEVITATE — 5 גדלים, רוחב 2 מטר לבטיחות מרבית. כולל משאבה, ערכת תיקונים ופס חיבור.",
    subcategories: AIRFLOOR_MAT_VARIANTS.map((v) => `${v.lengthM}/${v.widthM}/${v.thicknessM} מטר`),
    subcategoryProductIds: AIRFLOOR_MAT_VARIANTS.map((v) => v.id),
    productCats: ["מזרני איירפלור"],
    image: airfloorMatsIcon,
  },
  {
    slug: "landing-mats",
    name: "מזרני נחיתה במידות שונות",
    description:
      "מזרני נחיתה מחומר שמשונית עבה — 5 גדלים שונים לפי הצורך. ספיגת זעזועים מקצועית, בטיחות ועמידות לאורך זמן.",
    subcategories: [
      "250×120×20 ס\"מ",
      "250×120×30 ס\"מ",
      "250×150×20 ס\"מ",
      "250×150×30 ס\"מ",
      "250×200×30 ס\"מ",
    ],
    subcategoryProductIds: LANDING_MAT_VARIANTS.map((v) => v.id),
    productCats: ["מזרני נחיתה"],
    image: landingMatsIcon,
  },
  {
    slug: "show-room",
    name: "SHOW ROOM",
    description:
      "מתחם האימונים שלנו — חוגי נינג'ה, אקרובטיקה, טניס שולחן וטורנירים. ניתן גם לבדוק מוצרים לפני הרכישה.",
    subcategories: SHOWROOM_ACTIVITIES.map((activity) => activity.title),
    subcategoryAnchorIds: SHOWROOM_ACTIVITIES.map((activity) => activity.id),
    productCats: [],
    image: showRoomIcon,
    imageDisplay: "logo",
  },
];

/** Header / mega-menu lookup: category name → subcategory labels. */
export const CATEGORY_SUBCATEGORIES = Object.fromEntries(
  CATEGORIES.map((c) => [c.name, c.subcategories]),
) as Record<string, string[]>;

export function getCategoryBySlug(slug: string): CategoryDefinition | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getAllCategorySlugs(): string[] {
  return CATEGORIES.map((c) => c.slug);
}
