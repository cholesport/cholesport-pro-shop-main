import type { Product, ProductFeature, ProductSpec } from "@/data/products";
import flexiRollImg from "@/assets/p-flexi-roll.png";
import flexiRollLargeImg from "@/assets/p-flexi-roll-12x2.png";
import { LAST_UNITS_STOCK_NOTE, QUANTITY_DEAL_BADGE } from "@/lib/productLabels";

export const FLEXI_ROLL_CATEGORY = "פלקסי רול";
export const FLEXI_ROLL_CATEGORY_SLUG = "flexi-roll";
export const FLEXI_ROLL_BRAND = "LEVITATE®";

export type FlexiRollVariant = {
  id: string;
  lengthM: number;
  widthM: number;
  thicknessM: number;
  price: number;
  img: string;
};

export const FLEXI_ROLL_VARIANTS: FlexiRollVariant[] = [
  {
    id: "flexi-roll-12x2x0.2",
    lengthM: 12,
    widthM: 2,
    thicknessM: 0.2,
    price: 5500,
    img: flexiRollLargeImg,
  },
  {
    id: "flexi-roll-12x1.5x0.4",
    lengthM: 12,
    widthM: 1.5,
    thicknessM: 0.4,
    price: 4800,
    img: flexiRollImg,
  },
];

export function formatFlexiRollSizeSlash(
  v: Pick<FlexiRollVariant, "lengthM" | "widthM" | "thicknessM">,
) {
  return `${v.lengthM}/${v.widthM}/${v.thicknessM}`;
}

export function formatFlexiRollDimensionsSpec(
  v: Pick<FlexiRollVariant, "lengthM" | "widthM" | "thicknessM">,
) {
  const thicknessCm = Math.round(v.thicknessM * 100);
  return `אורך ${v.lengthM} מ', רוחב ${v.widthM} מ', עובי ${thicknessCm} ס"מ`;
}

export function getFlexiRollTitle(v: FlexiRollVariant) {
  return `פלקסי רול (Flexi Roll) מקצועי - ${formatFlexiRollSizeSlash(v)} מטר`;
}

export function getFlexiRollSeoTitle(v: FlexiRollVariant) {
  return `פלקסי רול ${formatFlexiRollSizeSlash(v)} מטר`;
}

export function getFlexiRollSeoDescription(v: FlexiRollVariant) {
  return (
    `פלקסי רול מקצועי ${formatFlexiRollSizeSlash(v)} מטר מ-LEVITATE. ` +
    `משטח אימון גמיש ומתקפל לאימוני התעמלות, אקרובטיקה ונינג'ה. ` +
    `מחיר: ${v.price.toLocaleString("he-IL")} ₪ ליחידה. ` +
    `ברכישת יותר מיחידה אחת - 10% הנחה.`
  );
}

export function isFlexiRollProduct(product: Pick<Product, "id" | "cat">) {
  return product.cat === FLEXI_ROLL_CATEGORY;
}

export function getFlexiRollVariantById(id: string): FlexiRollVariant | undefined {
  return FLEXI_ROLL_VARIANTS.find((v) => v.id === id);
}

export function isFlexiRollProductId(productId: string) {
  return FLEXI_ROLL_VARIANTS.some((v) => v.id === productId);
}

/** 10% off when buying more than one Flexi Roll unit (cart-wide). */
export const FLEXI_ROLL_MULTI_UNIT_DISCOUNT = 0.1;

export const FLEXI_ROLL_MULTI_DEAL_COPY =
  "ברכישת יותר מיחידה אחת של פלקסי רול - 10% הנחה אוטומטית על כל יחידה.";

export function getFlexiRollCatalogPrice(productId: string): number | undefined {
  return getFlexiRollVariantById(productId)?.price;
}

/** Unit price after multi-unit deal. `flexiRollTotalQty` = total Flexi Roll units in the cart. */
export function getFlexiRollUnitPrice(productId: string, flexiRollTotalQty: number) {
  const catalog = getFlexiRollCatalogPrice(productId);
  if (catalog == null) return null;
  const qty = Math.max(0, Math.floor(flexiRollTotalQty));
  if (qty > 1) return Math.round(catalog * (1 - FLEXI_ROLL_MULTI_UNIT_DISCOUNT));
  return catalog;
}

export function getFlexiRollDealLabel(flexiRollTotalQty: number) {
  if (flexiRollTotalQty > 1) {
    return "הנחת כמות: 10% על פלקסי רול (מעל יחידה אחת)";
  }
  return null;
}

const FLEXI_ROLL_INTRO =
  "פלקסי רול (Flexi Roll) הוא משטח אימון מקצועי גמיש ומתקפל - נוח לפריסה, לאחסון ולהעברה. מתאים לחוגים, מתנ\"סים ואולמות אימון שצריכים משטח ארוך ואיכותי בלי לוותר על נוחות השימוש.";

const FLEXI_ROLL_FEATURES: ProductFeature[] = [
  { title: "מידות", description: "" },
  {
    title: "גמיש ומתקפל",
    description: "נוח לפריסה מהירה ולאחסון קומפקטי בין אימונים.",
  },
  {
    title: "משטח ארוך לאימון",
    description: "אורך 12 מטר - מרחב עבודה רציף לתרגילים, גלישות ומסלולי אימון.",
  },
  {
    title: "שתי אפשרויות מידה",
    description: "12/2/0.2 או 12/1.5/0.4 - בחרו את השילוב שמתאים לחלל ולסוג האימון.",
  },
  {
    title: "הנחת כמות",
    description: FLEXI_ROLL_MULTI_DEAL_COPY,
  },
  {
    title: "אחריות",
    description: "12 חודשי אחריות על פגמי ייצור.",
  },
];

const FLEXI_ROLL_AUDIENCE: ProductFeature[] = [
  {
    title: "חוגי התעמלות ואקרובטיקה",
    description: "משטח רציף לתרגול בטוח ומקצועי.",
  },
  {
    title: "נינג'ה וג׳ימבורי",
    description: "מתאים למסלולי אימון ותחנות תנועה.",
  },
  {
    title: "מתנ\"סים ואולמות",
    description: "קל לפריסה ולאחסון בין שיעורים.",
  },
];

export function buildFlexiRollProductExtra(
  variant: FlexiRollVariant,
  allIds: string[],
): Partial<Product> {
  const sizeSlash = formatFlexiRollSizeSlash(variant);
  const dimsSpec = formatFlexiRollDimensionsSpec(variant);
  const thicknessCm = Math.round(variant.thicknessM * 100);

  const features: ProductFeature[] = FLEXI_ROLL_FEATURES.map((f) =>
    f.title === "מידות" ? { ...f, description: dimsSpec } : f,
  );

  const specs: ProductSpec[] = [
    { label: "מידות", value: dimsSpec },
    { label: "אורך", value: `${variant.lengthM} מ'` },
    { label: "רוחב", value: `${variant.widthM} מ'` },
    { label: "עובי", value: `${thicknessCm} ס"מ` },
    { label: "סוג", value: "פלקסי רול (Flexi Roll)" },
    { label: "הנחת כמות", value: "10% ברכישת יותר מיחידה אחת" },
    { label: "מותג", value: "LEVITATE" },
    { label: "קטגוריה", value: FLEXI_ROLL_CATEGORY },
    { label: 'מק"ט', value: variant.id },
    { label: "אחריות", value: "12 חודשי אחריות על פגמי ייצור" },
  ];

  return {
    introTitle: getFlexiRollTitle(variant),
    introParagraphs: [
      FLEXI_ROLL_INTRO,
      FLEXI_ROLL_MULTI_DEAL_COPY,
      `המידה שבחרתם: ${sizeSlash} מטר - ${variant.price.toLocaleString("he-IL")} ₪ ליחידה. ניתן לעבור בין המידות בסרגל למעלה.`,
    ],
    featuresTitle: "למה לבחור בפלקסי רול?",
    features,
    specsTitle: "מפרט מלא",
    specs,
    warrantyTitle: "אחריות",
    warrantyText: "12 חודשי אחריות על פגמי ייצור.",
    audienceTitle: "למי הפלקסי רול מתאים?",
    audience: FLEXI_ROLL_AUDIENCE,
    ctaText: `הזמינו פלקסי רול ${sizeSlash} מטר - משטח אימון מקצועי ונוח לשימוש!`,
    badge: QUANTITY_DEAL_BADGE,
    stockNote: LAST_UNITS_STOCK_NOTE,
    relatedIds: allIds.filter((id) => id !== variant.id),
  };
}
