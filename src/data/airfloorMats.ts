import type { Product, ProductFeature, ProductSpec } from "@/data/products";

export const AIRFLOOR_MAT_CATEGORY = "\u05de\u05d6\u05e8\u05e0\u05d9 \u05d0\u05d9\u05d9\u05e8\u05e4\u05dc\u05d5\u05e8";
export const AIRFLOOR_MAT_CATEGORY_SLUG = "airfloor-mats";
export const AIRFLOOR_MAT_BRAND = "LEVITATE\u00ae";

export type AirfloorMatVariant = {
  id: string;
  lengthM: number;
  widthM: number;
  thicknessM: number;
  /** Current sale price */
  price: number;
  /** Regular price before sale */
  was: number;
  showSafetyNotice: boolean;
};

/** Sale prices (price) vs regular catalog prices (was). */
export const AIRFLOOR_MAT_VARIANTS: AirfloorMatVariant[] = [
  { id: "airfloor-3x2x0.2", lengthM: 3, widthM: 2, thicknessM: 0.2, price: 1890, was: 2250, showSafetyNotice: true },
  { id: "airfloor-4x2x0.2", lengthM: 4, widthM: 2, thicknessM: 0.2, price: 2520, was: 3000, showSafetyNotice: true },
  { id: "airfloor-6x2x0.2", lengthM: 6, widthM: 2, thicknessM: 0.2, price: 3780, was: 4500, showSafetyNotice: false },
  { id: "airfloor-8x2x0.2", lengthM: 8, widthM: 2, thicknessM: 0.2, price: 5040, was: 6000, showSafetyNotice: false },
  { id: "airfloor-10x2x0.2", lengthM: 10, widthM: 2, thicknessM: 0.2, price: 6300, was: 7500, showSafetyNotice: false },
];

export const AIRFLOOR_SALE_HEADLINE = "מבצע מיוחד עכשיו על מזרני איירפלור";
export const AIRFLOOR_SALE_COPY =
  "כל המידות במחיר מבצע — חיסכון של כ־16% ממחיר הקטלוג. הזדמנות מצוינת לשדרג את משטח האימון במחיר שלא חוזר כל יום.";

export function getAirfloorSalePercent(v: Pick<AirfloorMatVariant, "price" | "was">) {
  if (v.was <= v.price) return 0;
  return Math.round(((v.was - v.price) / v.was) * 100);
}

export const AIRFLOOR_SAFETY_NOTICE =
  "\u05e9\u05d9\u05de\u05d5 \u05dc\u05d1: \u05de\u05d6\u05e8\u05df \u05d6\u05d4 \u05de\u05d2\u05d9\u05e2 \u05d1\u05e8\u05d5\u05d7\u05d1 \u05e8\u05d7\u05d1 \u05e9\u05dc 2 \u05de\u05d8\u05e8\u05d9\u05dd. \u05d0\u05e0\u05d5 \u05de\u05ea\u05e2\u05e7\u05e9\u05d9\u05dd \u05e2\u05dc \u05e8\u05d5\u05d7\u05d1 \u05d6\u05d4 \u05d2\u05dd \u05d1\u05de\u05d6\u05e8\u05e0\u05d9\u05dd \u05d4\u05e7\u05e6\u05e8\u05d9\u05dd \u05d9\u05d5\u05ea\u05e8 \u05e9\u05dc\u05e0\u05d5, \u05db\u05d3\u05d9 \u05dc\u05d4\u05e2\u05e0\u05d9\u05e7 \u05dc\u05db\u05dd \u05de\u05e9\u05d8\u05d7 \u05e0\u05d7\u05d9\u05ea\u05d4 \u05d1\u05d8\u05d5\u05d7, \u05de\u05e8\u05d5\u05d5\u05d7 \u05d5\u05d9\u05e6\u05d9\u05d1 \u05d9\u05d5\u05ea\u05e8 \u05e9\u05de\u05d5\u05e0\u05e2 \u05e0\u05e4\u05d9\u05dc\u05d5\u05ea \u05de\u05d7\u05d5\u05e5 \u05dc\u05de\u05e9\u05d8\u05d7 \u05d5\u05e9\u05d5\u05de\u05e8 \u05e2\u05dc \u05d4\u05de\u05e9\u05ea\u05de\u05e9\u05d9\u05dd \u05dc\u05d0\u05d5\u05e8\u05da \u05db\u05dc \u05d4\u05d0\u05d9\u05de\u05d5\u05df.";

export function formatAirfloorSizeSlash(v: Pick<AirfloorMatVariant, "lengthM" | "widthM" | "thicknessM">) {
  return `${v.lengthM}/${v.widthM}/${v.thicknessM}`;
}

export function formatAirfloorDimensionsSpec(v: Pick<AirfloorMatVariant, "lengthM" | "widthM" | "thicknessM">) {
  const thicknessCm = Math.round(v.thicknessM * 100);
  return `\u05d0\u05d5\u05e8\u05da ${v.lengthM} \u05de', \u05e8\u05d5\u05d7\u05d1 ${v.widthM} \u05de', \u05e2\u05d5\u05d1\u05d9 ${thicknessCm} \u05e1"\u05de`;
}

export function getAirfloorMatTitle(v: AirfloorMatVariant) {
  return `\u05de\u05d6\u05e8\u05df \u05d0\u05d9\u05d9\u05e8\u05e4\u05dc\u05d5\u05e8 (AirFloor) \u05de\u05e7\u05e6\u05d5\u05e2\u05d9 - ${formatAirfloorSizeSlash(v)} \u05de\u05d8\u05e8`;
}

export function getAirfloorMatSeoTitle(v: AirfloorMatVariant) {
  return `\u05de\u05d6\u05e8\u05df \u05d0\u05d9\u05d9\u05e8\u05e4\u05dc\u05d5\u05e8 ${formatAirfloorSizeSlash(v)} \u05de\u05d8\u05e8`;
}

export function getAirfloorMatSeoDescription(v: AirfloorMatVariant) {
  const salePct = getAirfloorSalePercent(v);
  return (
    `מבצע איירפלור: מזרן מקצועי ${formatAirfloorSizeSlash(v)} מטר מ-LEVITATE` +
    (salePct > 0 ? ` — ${salePct}% הנחה` : "") +
    `. מחיר מבצע ${v.price.toLocaleString("he-IL")} ₪` +
    (v.was > v.price ? ` במקום ${v.was.toLocaleString("he-IL")} ₪` : "") +
    `. כולל משאבה, ערכת תיקונים ופס חיבור. ניתן להזמין גם בגודל מיוחד.`
  );
}

export function isAirfloorMatProduct(product: Pick<Product, "id" | "cat">) {
  return product.cat === AIRFLOOR_MAT_CATEGORY;
}

export function getAirfloorMatVariantById(id: string): AirfloorMatVariant | undefined {
  return AIRFLOOR_MAT_VARIANTS.find((v) => v.id === id);
}

export function shouldShowAirfloorSafetyNotice(productId: string) {
  const variant = getAirfloorMatVariantById(productId);
  return Boolean(variant?.showSafetyNotice);
}

const AIRFLOOR_INTRO =
  "הכירו את הדור הבא של משטחי האימון. מזרן האיירפלור של LV מציע שילוב מושלם בין גמישות, בלימת זעזועים ועמידות גבוהה, המותאם למתעמלים, אקרובטים ואוהבי נינג'ה. המזרן מגיע כערכה מלאה הכוללת משאבה, ערכת תיקונים ופס חיבור ייעודי.";

const AIRFLOOR_INTRO_CUSTOM_SIZE =
  "מעבר למידות שבקטלוג — ניתן להזמין מזרן איירפלור גם בגודל מיוחד לפי הצורך שלכם. בחרו מידה מהסרגל למעלה, או פנו אלינו בוואטסאפ להצעה על מידה מותאמת.";

const AIRFLOOR_INTRO_SALE =
  `${AIRFLOOR_SALE_HEADLINE} — המחיר שאתם רואים הוא מחיר מבצע מוזל ממחיר הקטלוג. כדאי לנצל עכשיו: איכות מקצועית של LEVITATE במחיר שלא חוזר כל יום.`;

const AIRFLOOR_FEATURES: ProductFeature[] = [
  { title: "מידות", description: "" },
  {
    title: "גודל מיוחד",
    description:
      "צריכים מידה שלא מופיעה בקטלוג? ניתן להזמין מזרן איירפלור בגודל מיוחד — תאמו איתנו בוואטסאפ ונחזור עם הצעה.",
  },
  {
    title: "בטיחות",
    description: "רוחב 2 מטרים להגנה מקסימלית (ייחודי למזרנים שלנו).",
  },
  {
    title: "ערכה מלאה",
    description:
      "כולל משאבה חזקה לניפוח מהיר, ערכת תיקונים מקצועית ופס חיבור להצמדת מספר מזרנים.",
  },
  {
    title: "חומרים",
    description: "טכנולוגיית עמידות גבוהה נגד שחיקה וקריעה.",
  },
  {
    title: "אחריות",
    description: "12 חודשי אחריות על פגמי ייצור.",
  },
];

const AIRFLOOR_AUDIENCE: ProductFeature[] = [
  {
    title: "\u05de\u05ea\u05e2\u05de\u05dc\u05d9\u05dd \u05d5\u05d0\u05e7\u05e8\u05d5\u05d1\u05d8\u05d9\u05dd",
    description: "\u05de\u05e9\u05d8\u05d7 \u05d0\u05d9\u05de\u05d5\u05df \u05de\u05e7\u05e6\u05d5\u05e2\u05d9 \u05dc\u05ea\u05e8\u05d2\u05d9\u05dc\u05d9 \u05d2\u05d9\u05dc, \u05e7\u05e4\u05d9\u05e6\u05d5\u05ea \u05d5\u05e8\u05d5\u05d8\u05d9\u05e0\u05d5\u05ea.",
  },
  {
    title: "\u05d7\u05d5\u05d2\u05d9 \u05e0\u05d9\u05e0\u05d2'\u05d4 \u05d5\u05d2\u05f3\u05d9\u05de\u05d1\u05d5\u05e8\u05d9",
    description: "\u05de\u05e9\u05d8\u05d7 \u05d1\u05d8\u05d5\u05d7 \u05d5\u05d2\u05de\u05d9\u05e9 \u05dc\u05d0\u05d9\u05de\u05d5\u05e0\u05d9 \u05ea\u05e0\u05d5\u05e2\u05d4, \u05e7\u05e4\u05d9\u05e6\u05d4 \u05d5\u05d2\u05dc\u05d2\u05d5\u05dc\u05d9\u05dd \u05d1\u05de\u05d2\u05d5\u05d5\u05df \u05e8\u05de\u05d5\u05ea.",
  },
  {
    title: "\u05de\u05ea\u05e0\"\u05e1\u05d9\u05dd \u05d5\u05d0\u05d5\u05dc\u05de\u05d5\u05ea \u05d0\u05d9\u05de\u05d5\u05df",
    description: "\u05e4\u05ea\u05e8\u05d5\u05df \u05de\u05e7\u05e6\u05d5\u05e2\u05d9 \u05dc\u05d7\u05d5\u05d2\u05d9\u05dd \u05e2\u05dd \u05e2\u05de\u05d9\u05d3\u05d5\u05ea \u05d2\u05d1\u05d5\u05d4\u05d4 \u05dc\u05e9\u05d9\u05de\u05d5\u05e9 \u05d9\u05d5\u05de\u05d9\u05d5\u05de\u05d9.",
  },
];

export function buildAirfloorMatProductExtra(
  variant: AirfloorMatVariant,
  allIds: string[],
): Partial<Product> {
  const sizeSlash = formatAirfloorSizeSlash(variant);
  const dimsSpec = formatAirfloorDimensionsSpec(variant);
  const thicknessCm = Math.round(variant.thicknessM * 100);

  const features: ProductFeature[] = AIRFLOOR_FEATURES.map((f) =>
    f.title === "מידות" ? { ...f, description: dimsSpec } : f,
  );

  const specs: ProductSpec[] = [
    { label: "מידות", value: dimsSpec },
    { label: "אורך", value: `${variant.lengthM} מ'` },
    { label: "רוחב", value: `${variant.widthM} מ'` },
    { label: "עובי", value: `${thicknessCm} ס"מ` },
    { label: "בטיחות", value: "רוחב 2 מטר להגנה מקסימלית" },
    { label: "ערכה מלאה", value: "משאבה, ערכת תיקונים, פס חיבור" },
    { label: "גודל מיוחד", value: "ניתן להזמנה בוואטסאפ לפי מידות מותאמות" },
    { label: "מותג", value: "LEVITATE" },
    { label: "קטגוריה", value: AIRFLOOR_MAT_CATEGORY },
    { label: "מק\"ט", value: variant.id },
    { label: "אחריות", value: "12 חודשי אחריות על פגמי ייצור" },
  ];

  const salePct = getAirfloorSalePercent(variant);
  const salePriceLabel = `${variant.price.toLocaleString("he-IL")} ₪`;
  const wasPriceLabel = `${variant.was.toLocaleString("he-IL")} ₪`;

  return {
    introTitle: getAirfloorMatTitle(variant),
    introParagraphs: [AIRFLOOR_INTRO_SALE, AIRFLOOR_INTRO, AIRFLOOR_INTRO_CUSTOM_SIZE],
    featuresTitle: "מפרט טכני ומה בחבילה?",
    features,
    specsTitle: "מפרט מלא",
    specs: [
      ...specs.slice(0, 4),
      {
        label: "מחיר מבצע",
        value:
          salePct > 0
            ? `${salePriceLabel} במקום ${wasPriceLabel} (חיסכון ~${salePct}%)`
            : salePriceLabel,
      },
      ...specs.slice(4),
    ],
    warrantyTitle: "אחריות",
    warrantyText: "12 חודשי אחריות על פגמי ייצור.",
    audienceTitle: "למי המזרן מתאים?",
    audience: AIRFLOOR_AUDIENCE,
    ctaText: `מבצע איירפלור ${sizeSlash} מטר — ${salePriceLabel} במקום ${wasPriceLabel}. הזמינו עכשיו!`,
    relatedIds: [...allIds.filter((id) => id !== variant.id), "landing-mat-250x200x30"],
  };
}
