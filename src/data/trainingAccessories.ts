import type { Product, ProductFeature, ProductSpec } from "@/data/products";
import puzzleGreyBlackImg from "@/assets/p-puzzle-mat-grey-black.png";
import puzzleGreyBlackAltImg from "@/assets/p-puzzle-mat-grey-black-alt.png";
import balancePitaImg from "@/assets/p-balance-pita.png";
import hurdlesOrangeImg from "@/assets/p-hurdles-orange.png";
import plyoBoxes4pcImg from "@/assets/p-plyo-boxes-4pc.png";
import plyoSoftBoxImg from "@/assets/p-plyo-soft-box.png";
import { QUANTITY_DEAL_BADGE } from "@/lib/productLabels";

export const TRAINING_ACCESSORIES_CATEGORY = "אביזרי אימון";
export const TRAINING_ACCESSORIES_CATEGORY_SLUG = "training-accessories";
export const TRAINING_ACCESSORIES_BRAND = "CHOLE®";

/** Puzzle-mat unit price (regular) and bulk quantity deal. */
export const PUZZLE_MAT_UNIT_PRICE = 120;
/** Deal applies from this quantity and above (inclusive). */
export const PUZZLE_MAT_BULK_THRESHOLD = 50;
export const PUZZLE_MAT_BULK_PRICE = 85;

export const PUZZLE_MAT_PRODUCT_IDS = [
  "training-puzzle-mat-blue-red",
  "training-puzzle-mat-grey-black",
] as const;

export function isPuzzleMatProductId(productId: string) {
  return (PUZZLE_MAT_PRODUCT_IDS as readonly string[]).includes(productId);
}

export function getPuzzleMatSavingsPercent() {
  return Math.round(
    ((PUZZLE_MAT_UNIT_PRICE - PUZZLE_MAT_BULK_PRICE) / PUZZLE_MAT_UNIT_PRICE) * 100,
  );
}

/**
 * Unit price by quantity:
 * 1–49 → 120 ₪ · מ-50 יח׳ → 85 ₪
 */
export function getPuzzleMatUnitPrice(quantity: number) {
  const qty = Math.max(0, Math.floor(quantity));
  if (qty >= PUZZLE_MAT_BULK_THRESHOLD) return PUZZLE_MAT_BULK_PRICE;
  return PUZZLE_MAT_UNIT_PRICE;
}

export function getPuzzleMatDealLabel(quantity: number) {
  if (getPuzzleMatUnitPrice(quantity) === PUZZLE_MAT_BULK_PRICE) {
    return `דיל כמות פעיל: ${PUZZLE_MAT_BULK_PRICE} ₪ ליחידה במקום ${PUZZLE_MAT_UNIT_PRICE} ₪ — חסכתם כ-${getPuzzleMatSavingsPercent()}%!`;
  }
  return null;
}

/** Short prompt under the qty input — pushes customers toward the bulk deal. */
export function getPuzzleMatQuantityHint(quantity: number) {
  const qty = Math.max(0, Math.floor(quantity));
  if (qty >= PUZZLE_MAT_BULK_THRESHOLD) {
    return `מעולה! ההנחה פעילה — ${PUZZLE_MAT_BULK_PRICE} ₪ ליחידה על כל הכמות.`;
  }
  const remaining = PUZZLE_MAT_BULK_THRESHOLD - qty;
  return `עוד ${remaining} יח׳ ותקבלו ${PUZZLE_MAT_BULK_PRICE} ₪ ליחידה במקום ${PUZZLE_MAT_UNIT_PRICE} ₪ (כ-${getPuzzleMatSavingsPercent()}% הנחה).`;
}

export const PUZZLE_MAT_DEAL_HEADLINE = `מ-${PUZZLE_MAT_BULK_THRESHOLD} יחידות — רק ${PUZZLE_MAT_BULK_PRICE} ₪ ליחידה`;

export const PUZZLE_MAT_DEAL_BANNER =
  `דיל כמות חזק: מחיר רגיל ${PUZZLE_MAT_UNIT_PRICE} ₪ ליחידה. ` +
  `ברכישת ${PUZZLE_MAT_BULK_THRESHOLD} יחידות ומעלה — המחיר יורד ל-${PUZZLE_MAT_BULK_PRICE} ₪ ליחידה ` +
  `(כ-${getPuzzleMatSavingsPercent()}% הנחה על כל יחידה). ככל שמזמינים יותר — חוסכים יותר.`;

export const PUZZLE_MAT_DEAL_BADGE = QUANTITY_DEAL_BADGE;

export const BALANCE_PITA_COLORS = ["סגול", "ירוק", "אדום", "ורוד"] as const;

export type HurdleHeightVariant = {
  id: string;
  heightCm: number;
  price: number;
};

/** Strong plastic hurdles — purchase options by height. */
export const HURDLE_HEIGHT_VARIANTS: HurdleHeightVariant[] = [
  { id: "training-hurdle-23", heightCm: 23, price: 25 },
  { id: "training-hurdle-30", heightCm: 30, price: 35 },
  { id: "training-hurdle-40", heightCm: 40, price: 45 },
];

export const HURDLE_PRODUCT_TITLE = "משוכות פלסטיק חזקות";
export const HURDLE_COLOR = "כתום";

export type TrainingAccessoryDefinition = {
  id: string;
  title: string;
  subcategoryLabel: string;
  price: number;
  img?: string;
  images?: string[];
  badge?: string;
  introTitle: string;
  introParagraphs: string[];
  featuresTitle: string;
  features: ProductFeature[];
  specs: ProductSpec[];
  ctaText: string;
  seoDescription: string;
};

function puzzleMatPricingCopy() {
  return PUZZLE_MAT_DEAL_BANNER;
}

function puzzleMatSpecs(): ProductSpec[] {
  return [
    { label: "עובי", value: '4 ס"מ' },
    { label: "מחיר ליחידה", value: `${PUZZLE_MAT_UNIT_PRICE} ₪` },
    {
      label: `דיל מ-${PUZZLE_MAT_BULK_THRESHOLD} יח׳`,
      value: `${PUZZLE_MAT_BULK_PRICE} ₪ ליחידה (במקום ${PUZZLE_MAT_UNIT_PRICE} ₪)`,
    },
  ];
}

function buildHurdleDefinition(variant: HurdleHeightVariant): TrainingAccessoryDefinition {
  const heightLabel = `${variant.heightCm} ס״מ`;
  return {
    id: variant.id,
    title: `${HURDLE_PRODUCT_TITLE} — ${heightLabel}`,
    subcategoryLabel: `משוכה ${heightLabel}`,
    price: variant.price,
    img: hurdlesOrangeImg,
    images: [hurdlesOrangeImg],
    introTitle: `${HURDLE_PRODUCT_TITLE} בגובה ${heightLabel}`,
    introParagraphs: [
      `${HURDLE_PRODUCT_TITLE} לאימוני זריזות, קואורדינציה ומסלולי ריצה — צבע ${HURDLE_COLOR}.`,
      `גובה ${heightLabel} · ${variant.price} ₪ ליחידה. אפשרויות נוספות: 23 ס״מ — 25 ₪ · 30 ס״מ — 35 ₪ · 40 ס״מ — 45 ₪.`,
    ],
    featuresTitle: "למה לבחור במשוכות האלה?",
    features: [
      {
        title: "פלסטיק חזק",
        description: "מבנה עמיד לאימונים חוזרים באולם ובמגרש.",
      },
      {
        title: "בחירת גובה",
        description: "שלוש אפשרויות רכישה — 23, 30 ו-40 ס״מ — לפי רמת האימון.",
      },
      {
        title: "קל לפריסה",
        description: "ציוד קומפקטי לתחנות זריזות ולאימוני קבוצה.",
      },
    ],
    specs: [
      { label: "סוג", value: HURDLE_PRODUCT_TITLE },
      { label: "צבע", value: HURDLE_COLOR },
      { label: "גובה", value: heightLabel },
      { label: "מחיר ליחידה", value: `${variant.price} ₪` },
      { label: "23 ס״מ", value: "25 ₪ ליחידה" },
      { label: "30 ס״מ", value: "35 ₪ ליחידה" },
      { label: "40 ס״מ", value: "45 ₪ ליחידה" },
    ],
    ctaText: `הזמינו ${HURDLE_PRODUCT_TITLE} בגובה ${heightLabel} — ובנו מסלול זריזות מדויק!`,
    seoDescription: `${HURDLE_PRODUCT_TITLE} בגובה ${heightLabel} — ${variant.price} ₪ ליחידה. צבע ${HURDLE_COLOR}. אביזרי אימון ב-CHOLE sport.`,
  };
}

export const TRAINING_ACCESSORIES_PRODUCTS: TrainingAccessoryDefinition[] = [
  {
    id: "training-puzzle-mat-blue-red",
    title: "מזרן פאזל 4 ס״מ — כחול אדום",
    subcategoryLabel: "מזרן פאזל כחול אדום",
    price: PUZZLE_MAT_UNIT_PRICE,
    badge: PUZZLE_MAT_DEAL_BADGE,
    introTitle: "מזרן פאזל מקצועי בעובי 4 ס״מ — כחול ואדום",
    introParagraphs: [
      "מזרן פאזל בעובי 4 ס״מ בצבעי כחול ואדום — משטח אימון מודולרי שמתחבר בקלות ליצירת רצפה בטוחה באולם, בחדר כושר או בבית.",
      puzzleMatPricingCopy(),
    ],
    featuresTitle: "למה לבחור במזרן הפאזל?",
    features: [
      {
        title: "עובי 4 ס״מ",
        description: "ריפוד נוח לאימון, יוגה, משחקים ופעילות יומיומית.",
      },
      {
        title: "חיבור פאזל",
        description: "פיסות שמתחברות זו לזו ליצירת משטח רציף לפי גודל החלל.",
      },
      {
        title: "צבעים בולטים",
        description: "כחול ואדום — מראה אנרגטי וזיהוי קל באולם.",
      },
      {
        title: PUZZLE_MAT_DEAL_HEADLINE,
        description: `מחיר רגיל ${PUZZLE_MAT_UNIT_PRICE} ₪ ליחידה. מ-${PUZZLE_MAT_BULK_THRESHOLD} יח׳ — רק ${PUZZLE_MAT_BULK_PRICE} ₪ ליחידה (כ-${getPuzzleMatSavingsPercent()}% הנחה). משתלם במיוחד לאולמות ולחוגים.`,
      },
    ],
    specs: [...puzzleMatSpecs(), { label: "צבע", value: "כחול / אדום" }, { label: "סוג", value: "מזרן פאזל מודולרי" }],
    ctaText: `הזמינו מ-${PUZZLE_MAT_BULK_THRESHOLD} יח׳ וחסכו — מזרני פאזל כחול-אדום במחיר דיל!`,
    seoDescription: `מזרן פאזל 4 ס"מ כחול אדום — ${PUZZLE_MAT_UNIT_PRICE} ₪ ליחידה, מ-${PUZZLE_MAT_BULK_THRESHOLD} יח׳ רק ${PUZZLE_MAT_BULK_PRICE} ₪. אביזרי אימון ב-CHOLE sport.`,
  },
  {
    id: "training-puzzle-mat-grey-black",
    title: "מזרן פאזל 4 ס״מ — אפור שחור",
    subcategoryLabel: "מזרן פאזל אפור שחור",
    price: PUZZLE_MAT_UNIT_PRICE,
    img: puzzleGreyBlackImg,
    images: [puzzleGreyBlackImg, puzzleGreyBlackAltImg],
    badge: PUZZLE_MAT_DEAL_BADGE,
    introTitle: "מזרן פאזל מקצועי בעובי 4 ס״מ — אפור ושחור",
    introParagraphs: [
      "מזרן פאזל בעובי 4 ס״מ בגווני אפור ושחור — מראה נקי ומודרני לחדרי כושר, סטודיו ומתחמי אימון.",
      puzzleMatPricingCopy(),
    ],
    featuresTitle: "למה לבחור במזרן הפאזל?",
    features: [
      {
        title: "עובי 4 ס״מ",
        description: "ספיגה נוחה לאימון קרקע, חיזוק ופעילות קבוצתית.",
      },
      {
        title: "חיבור פאזל",
        description: "הרכבה מהירה והתאמה לכל גודל חלל.",
      },
      {
        title: "גוונים ניטרליים",
        description: "אפור ושחור — משתלבים בכל עיצוב אולם.",
      },
      {
        title: PUZZLE_MAT_DEAL_HEADLINE,
        description: `מחיר רגיל ${PUZZLE_MAT_UNIT_PRICE} ₪ ליחידה. מ-${PUZZLE_MAT_BULK_THRESHOLD} יח׳ — רק ${PUZZLE_MAT_BULK_PRICE} ₪ ליחידה (כ-${getPuzzleMatSavingsPercent()}% הנחה). משתלם במיוחד לאולמות ולחוגים.`,
      },
    ],
    specs: [...puzzleMatSpecs(), { label: "צבע", value: "אפור / שחור" }, { label: "סוג", value: "מזרן פאזל מודולרי" }],
    ctaText: `הזמינו מ-${PUZZLE_MAT_BULK_THRESHOLD} יח׳ וחסכו — מזרני פאזל אפור-שחור במחיר דיל!`,
    seoDescription: `מזרן פאזל 4 ס"מ אפור שחור — ${PUZZLE_MAT_UNIT_PRICE} ₪ ליחידה, מ-${PUZZLE_MAT_BULK_THRESHOLD} יח׳ רק ${PUZZLE_MAT_BULK_PRICE} ₪. אביזרי אימון ב-CHOLE sport.`,
  },
  {
    id: "training-plyo-soft-box",
    title: "קוביה פליאומטרית רכה מונעת החלקה",
    subcategoryLabel: "קוביה פליאומטרית רכה",
    price: 750,
    img: plyoSoftBoxImg,
    images: [plyoSoftBoxImg],
    introTitle: "קוביה פליאומטרית רכה — 3 גבהים בקוביה אחת",
    introParagraphs: [
      "קוביה פליאומטרית רכה מונעת החלקה לאימוני קפיצה, כוח וזריזות — עם סימון גבהים מובנה לשימוש בטוח ומגוון.",
      'מידות 76×50×60 ס״מ — קוביה אחת לשלושה כיווני עבודה, מתאימה לבית, לסטודיו ולמתנ"ס.',
    ],
    featuresTitle: "למה לבחור בקוביה הרכה?",
    features: [
      {
        title: "מבנה רך ובטיחותי",
        description: "פחות עומס על מפרקים בהשוואה לקוביות קשיחות — אידיאלי לאימון יומיומי.",
      },
      {
        title: "מונעת החלקה",
        description: "בסיס יציב שמעניק ביטחון בקפיצות ובירידות.",
      },
      {
        title: "3 גבהים בקוביה אחת",
        description: "סימון ברור על הצלעות מאפשר לבחור גובה לפי הרמה והתרגיל.",
      },
      {
        title: "מידות מקצועיות",
        description: '76×50×60 ס"מ — נוחה לאחסון ולעבודה באולמות קטנים וגדולים.',
      },
    ],
    specs: [
      { label: "מידות", value: '76×50×60 ס"מ' },
      { label: "סוג", value: "קוביה פליאומטרית רכה (soft plyo)" },
      { label: "תכונה", value: "מונעת החלקה · 3 גבהים" },
    ],
    ctaText: "שדרגו את אימוני הקפיצה — הזמינו את הקוביה הפליאומטרית הרכה!",
    seoDescription: 'קוביה פליאומטרית רכה מונעת החלקה 76×50×60 ס"מ — 3 גבהים בקוביה אחת. מחיר: 750 ₪.',
  },
  {
    id: "training-plyo-boxes-4pc",
    title: "4 קוביות פליאומטריות במגוון גדלים",
    subcategoryLabel: "סט 4 קוביות פליאומטריות",
    price: 2250,
    img: plyoBoxes4pcImg,
    images: [plyoBoxes4pcImg],
    introTitle: "סט 4 קוביות פליאומטריות — מגוון גבהים לאימון מתקדם",
    introParagraphs: [
      "סט של 4 קוביות פליאומטריות בצבעים וגבהים שונים — ירוק, תכלת, אדום ושחור — למגוון רחב של תרגילי קפיצה, מדרגות וכוח.",
      'רוחב 75 ס״מ · אורך 90 ס״מ · גבהים: 15 / 30 / 45 / 60 ס״מ. ניתן לרכוש במשקל של 40/60 ק"ג.',
    ],
    featuresTitle: "למה לבחור בסט הקוביות?",
    features: [
      {
        title: "4 גבהים בסט אחד",
        description: '15, 30, 45 ו-60 ס"מ — התקדמות הדרגתית לכל רמה.',
      },
      {
        title: "מגוון שימושים",
        description: "קפיצות, מדרגות, תחנות אימון קבוצתיות ועבודה פונקציונלית.",
      },
      {
        title: "מידות אחידות לרוחב ולאורך",
        description: 'רוחב 75 ס"מ ואורך 90 ס"מ — יציבות ונוחות בעמידה ובקפיצה.',
      },
      {
        title: "בחירת משקל",
        description: 'זמין במשקל 40 או 60 ק"ג — לפי הצורך באימון ובמתקן.',
      },
    ],
    specs: [
      { label: "כמות", value: "4 קוביות" },
      { label: "רוחב", value: '75 ס"מ' },
      { label: "אורך", value: '90 ס"מ' },
      { label: "גובה ירוקה", value: '15 ס"מ' },
      { label: "גובה תכלת", value: '30 ס"מ' },
      { label: "גובה אדומה", value: '45 ס"מ' },
      { label: "גובה שחורה", value: '60 ס"מ' },
      { label: "משקל זמין", value: '40 / 60 ק"ג' },
    ],
    ctaText: "השלימו תחנת פליו מלאה — הזמינו את סט 4 הקוביות עכשיו!",
    seoDescription: 'סט 4 קוביות פליאומטריות בגבהים 15–60 ס"מ — רוחב 75 ואורך 90. מחיר: 2,250 ₪.',
  },
  {
    id: "training-bosu-ball",
    title: "כדור בוסו",
    subcategoryLabel: "כדור בוסו",
    price: 220,
    introTitle: "כדור בוסו לאימון שיווי משקל וליבה",
    introParagraphs: [
      "כדור בוסו מקצועי לאימוני שיווי משקל, ליבה, שיקום וכוח פונקציונלי — עם ידיות התנגדות לתרגול מגוון.",
      "קוטר 59 ס״מ — מתאים לבית, לסטודיו ולחדרי כושר.",
    ],
    featuresTitle: "למה לבחור בכדור הבוסו?",
    features: [
      {
        title: "שיווי משקל וליבה",
        description: "משטח לא יציב שמפעיל שרירים מייצבים בכל תרגיל.",
      },
      {
        title: "ידיות התנגדות",
        description: "מאפשרות שילוב של תרגילי ידיים ופלג גוף עליון.",
      },
      {
        title: "קוטר 59 ס״מ",
        description: "גודל נוח לרוב המשתמשים ולמגוון רמות.",
      },
    ],
    specs: [
      { label: "קוטר", value: '59 ס"מ' },
      { label: "סוג", value: "כדור בוסו / מאמן שיווי משקל" },
      { label: "תוספת", value: "ידיות התנגדות" },
    ],
    ctaText: "חזקו שיווי משקל וליבה — הזמינו כדור בוסו עכשיו!",
    seoDescription: 'כדור בוסו בקוטר 59 ס"מ עם ידיות התנגדות — אימון שיווי משקל וליבה. מחיר: 220 ₪.',
  },
  ...HURDLE_HEIGHT_VARIANTS.map(buildHurdleDefinition),
  {
    id: "training-balance-pita",
    title: "פיתה לשיווי משקל",
    subcategoryLabel: "פיתה לשיווי משקל",
    price: 50,
    img: balancePitaImg,
    images: [balancePitaImg],
    introTitle: "פיתה לשיווי משקל — בחירת צבע",
    introParagraphs: [
      `פיתה (דיסקית) לשיווי משקל — אפשרות בחירה בין ארבעה צבעים: ${BALANCE_PITA_COLORS.join(", ")}.`,
      "מחיר: 50 ₪ ליחידה. מתאימה לבית, לחוגים ולחדרי כושר — ציינו את הצבע הרצוי בהזמנה בוואטסאפ.",
    ],
    featuresTitle: "למה לבחור בפיתה?",
    features: [
      {
        title: "בחירת צבע",
        description: `${BALANCE_PITA_COLORS.join(" · ")} — בחרו את הצבע שמתאים לכם.`,
      },
      {
        title: "אימון שיווי משקל",
        description: "משטח לא יציב שמאתגר יציבות ושיווי משקל דינמי.",
      },
      {
        title: "מחיר נוח ליחידה",
        description: "50 ₪ ליחידה — קל להרכיב סט מלא לאולם.",
      },
    ],
    specs: [
      { label: "אפשרויות צבע", value: BALANCE_PITA_COLORS.join(" · ") },
      { label: "מחיר", value: "50 ₪ ליחידה" },
      { label: "שימוש", value: "שיווי משקל, יציבות ומוטוריקה" },
    ],
    ctaText: "השלימו תחנת שיווי משקל — בחרו צבע והזמינו פיתה!",
    seoDescription: `פיתה לשיווי משקל בצבעים ${BALANCE_PITA_COLORS.join(", ")} — 50 ₪ ליחידה. אביזרי אימון ב-CHOLE sport.`,
  },
];

const TRAINING_ACCESSORIES_AUDIENCE: ProductFeature[] = [
  {
    title: "חדרי כושר וסטודיו",
    description: "ציוד עמיד לאימונים יומיומיים ולתחנות קבוצתיות.",
  },
  {
    title: 'מתנ"סים ובתי ספר',
    description: "פתרונות מקצועיים במחיר נגיש למוסדות.",
  },
  {
    title: "אימון ביתי",
    description: "ציוד קומפקטי שמתאים גם לחדר כושר ביתי.",
  },
];

export function isTrainingAccessoryProduct(product: Pick<Product, "id" | "cat">) {
  return product.cat === TRAINING_ACCESSORIES_CATEGORY;
}

export function isHurdleProduct(productId: string) {
  return HURDLE_HEIGHT_VARIANTS.some((v) => v.id === productId);
}

export function getHurdleVariantById(id: string): HurdleHeightVariant | undefined {
  return HURDLE_HEIGHT_VARIANTS.find((v) => v.id === id);
}

export function getTrainingAccessoryById(id: string): TrainingAccessoryDefinition | undefined {
  return TRAINING_ACCESSORIES_PRODUCTS.find((p) => p.id === id);
}

export function getTrainingAccessorySeoTitle(definition: TrainingAccessoryDefinition) {
  return definition.title;
}

export function getTrainingAccessorySeoDescription(definition: TrainingAccessoryDefinition) {
  return definition.seoDescription;
}

export function getTrainingAccessorySubcategoryLabels(): string[] {
  return TRAINING_ACCESSORIES_PRODUCTS.map((p) => p.subcategoryLabel);
}

export function getTrainingAccessoryProductIds(): string[] {
  return TRAINING_ACCESSORIES_PRODUCTS.map((p) => p.id);
}

/** Category / nav chips — one entry for hurdles, then height picker on PDP. */
export function getTrainingAccessoryNavProducts(): TrainingAccessoryDefinition[] {
  const result: TrainingAccessoryDefinition[] = [];
  let hurdleAdded = false;

  for (const product of TRAINING_ACCESSORIES_PRODUCTS) {
    if (isHurdleProduct(product.id)) {
      if (hurdleAdded) continue;
      result.push({
        ...product,
        id: HURDLE_HEIGHT_VARIANTS[0].id,
        subcategoryLabel: HURDLE_PRODUCT_TITLE,
        title: HURDLE_PRODUCT_TITLE,
      });
      hurdleAdded = true;
      continue;
    }
    result.push(product);
  }
  return result;
}

export function buildTrainingAccessoryProductExtra(
  definition: TrainingAccessoryDefinition,
  allIds: string[],
): Partial<Product> {
  const images =
    definition.images && definition.images.length > 0
      ? definition.images
      : definition.img
        ? [definition.img]
        : [];

  return {
    img: definition.img,
    images,
    introTitle: definition.introTitle,
    introParagraphs: definition.introParagraphs,
    featuresTitle: definition.featuresTitle,
    features: definition.features,
    specsTitle: "מפרט טכני",
    specs: [
      ...definition.specs,
      { label: "מותג", value: "CHOLE" },
      { label: "קטגוריה", value: TRAINING_ACCESSORIES_CATEGORY },
      { label: 'מק"ט', value: definition.id },
    ],
    warrantyTitle: "אחריות מלאה לאביזרי האימון שלכם:",
    warrantyText:
      "12 חודשי אחריות על פגמי ייצור מבית CHOLE sport. אנחנו כאן לכל שאלה — לפני, במהלך ואחרי הקנייה.",
    audienceTitle: "למי המוצר מתאים?",
    audience: TRAINING_ACCESSORIES_AUDIENCE,
    ctaText: definition.ctaText,
    relatedIds: allIds.filter((id) => id !== definition.id),
    ...(isPuzzleMatProductId(definition.id)
      ? { badge: definition.badge ?? PUZZLE_MAT_DEAL_BADGE }
      : definition.badge
        ? { badge: definition.badge }
        : {}),
  };
}
