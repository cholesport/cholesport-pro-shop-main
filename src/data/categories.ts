import type { LucideIcon } from "lucide-react";
import { Dumbbell, Heart, Layers } from "lucide-react";
import tableTennisPaddle from "@/assets/table-tennis-paddle.png";
import proGameTablesIcon from "@/assets/pro-game-tables-icon.png";
import airfloorMatsIcon from "@/assets/airfloor-mats-icon.png";
import landingMatsIcon from "@/assets/landing-mats-icon.png";
import showRoomIcon from "@/assets/show-room-icon.png";
import { LANDING_MAT_VARIANTS } from "@/data/landingMats";
import { AIRFLOOR_MAT_VARIANTS } from "@/data/airfloorMats";
import {
  FLEXI_ROLL_CATEGORY,
  FLEXI_ROLL_CATEGORY_SLUG,
  FLEXI_ROLL_MULTI_DEAL_COPY,
  FLEXI_ROLL_VARIANTS,
  formatFlexiRollSizeSlash,
} from "@/data/flexiRoll";
import { SHOWROOM_ACTIVITIES } from "@/data/showroom";
import {
  getGymboreeProductIds,
  getGymboreeSubcategoryLabels,
  GYMBOREE_CATEGORY,
} from "@/data/gymboree";
import {
  getTrainingAccessoryProductIds,
  getTrainingAccessorySubcategoryLabels,
  TRAINING_ACCESSORIES_CATEGORY,
} from "@/data/trainingAccessories";

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

export const CATEGORIES_PAGE_TITLE = "קולקציית המוצרים";
export const CATEGORIES_PAGE_SUBTITLE =
  "כל הקטגוריות במקום אחד — בחרו תחום והמשיכו למוצרים שמתאימים לכם.";
export const CATEGORIES_PAGE_SEO_DESCRIPTION =
  "קולקציית המוצרים של CHOLE sport — אביזרי אימון, ציוד ג׳ימבורי, מזרני איירפלור, פלקסי רול, מזרני נחיתה, שולחנות משחק וציוד טניס שולחן.";


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
    description:
      "ציוד רך מקצועי לג׳ימבורי ולהתעמלות קרקע — ערכות טיפוס וגלישה, משולשים רכים ושיפועתי לתרגול בטוח.",
    subcategories: getGymboreeSubcategoryLabels(),
    subcategoryProductIds: getGymboreeProductIds(),
    productCats: [GYMBOREE_CATEGORY],
    icon: Heart,
  },
  {
    slug: "training-accessories",
    name: "אביזרי אימון",
    description:
      "אביזרי אימון מקצועיים — מזרני פאזל, קוביות פליאומטריות, כדור בוסו, סטפרים ופיתות לשיווי משקל.",
    subcategories: getTrainingAccessorySubcategoryLabels(),
    subcategoryProductIds: getTrainingAccessoryProductIds(),
    productCats: [TRAINING_ACCESSORIES_CATEGORY],
    icon: Dumbbell,
  },
  {
    slug: "airfloor-mats",
    name: "מזרני איירפלור",
    description:
      "מבצע מיוחד עכשיו על מזרני איירפלור — חיסכון של כ־16% ממחיר הקטלוג. 5 גדלים במלאי מ-LEVITATE, רוחב 2 מטר לבטיחות מרבית. כולל משאבה, ערכת תיקונים ופס חיבור. ניתן להזמין גם בגודל מיוחד.",
    subcategories: AIRFLOOR_MAT_VARIANTS.map((v) => `${v.lengthM}/${v.widthM}/${v.thicknessM} מטר`),
    subcategoryProductIds: AIRFLOOR_MAT_VARIANTS.map((v) => v.id),
    productCats: ["מזרני איירפלור"],
    image: airfloorMatsIcon,
  },
  {
    slug: FLEXI_ROLL_CATEGORY_SLUG,
    name: "פלקסי רול",
    description:
      `פלקסי רול (Flexi Roll) מקצועי מ-LEVITATE — משטח אימון גמיש ומתקפל באורך 12 מטר. שתי מידות: 12/2/0.2 ו-12/1.5/0.4. ${FLEXI_ROLL_MULTI_DEAL_COPY}`,
    subcategories: FLEXI_ROLL_VARIANTS.map((v) => `${formatFlexiRollSizeSlash(v)} מטר`),
    subcategoryProductIds: FLEXI_ROLL_VARIANTS.map((v) => v.id),
    productCats: [FLEXI_ROLL_CATEGORY],
    icon: Layers,
  },
  {
    slug: "landing-mats",
    name: "מזרני נחיתה במידות שונות",
    description:
      "מזרני נחיתה מחומר שמשונית עבה — פתחי אוורור אדומים לשינוע, ידיות חזקות מלפנים ומאחור, ו-5 גדלים במלאי. ניתן להזמין גם בגודל מיוחד.",
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
