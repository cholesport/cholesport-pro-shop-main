import type { Product, ProductFeature, ProductSpec } from "@/data/products";
import climbSlideKitImg from "@/assets/hero/slide-07-soft-play.png";
import softTrianglesImg from "@/assets/hero/slide-05-wedge-red.png";
import inclineMatImg from "@/assets/p-gymboree-incline.png";

export const GYMBOREE_CATEGORY = "ציוד ג׳ימבורי";
export const GYMBOREE_CATEGORY_SLUG = "gymboree";
export const GYMBOREE_BRAND = "LEVITATE®";

export type GymboreeProductDefinition = {
  id: string;
  title: string;
  /** Short label for category / mega-menu chips and PDP switcher. */
  subcategoryLabel: string;
  dimensions: string;
  price: number;
  img: string;
  introTitle: string;
  introParagraphs: string[];
  featuresTitle: string;
  features: ProductFeature[];
  specs: ProductSpec[];
  ctaText: string;
  seoDescription: string;
};

export const GYMBOREE_PRODUCTS: GymboreeProductDefinition[] = [
  {
    id: "gymboree-climb-slide-3pc",
    title: "ערכת טיפוס וגלישה 3 חלקים",
    subcategoryLabel: "ערכת טיפוס וגלישה 3 חלקים",
    dimensions: "205/60/45 ס\"מ",
    price: 2100,
    img: climbSlideKitImg,
    introTitle: "ערכת טיפוס וגלישה מקצועית - 3 חלקים לג׳ימבורי",
    introParagraphs: [
      "ערכת טיפוס וגלישה מבית LEVITATE - שלושה חלקים רכים שמתחברים למסלול אחד: מדרגות לטיפוס, קובייה מרכזית כפלטפורמה, ושיפוע לגלישה.",
      "המידות הכוללות 205/60/45 ס\"מ מאפשרות פעילות דינמית באולם, בחוג או בבית - בלי לתפוס את כל החלל.",
      "ציפוי עמיד ונקי, ספוג איכותי ועיצוב צבעוני שמזמין ילדים לזוז, לטפס ולשחק בבטחה.",
    ],
    featuresTitle: "למה לבחור בערכת הטיפוס והגלישה?",
    features: [
      {
        title: "3 חלקים משולבים",
        description: "מדרגות, פלטפורמה ושיפוע לגלישה - מסלול טיפוס ומשחק אחד שלם שניתן לסדר מחדש לפי הצורך.",
      },
      {
        title: "ריפוד רך ובטוח",
        description: "ספוג איכותי עם ציפוי עמיד וקל לניקוי - מתאים לשימוש יומיומי עם ילדים.",
      },
      {
        title: "מידות נוחות לאולם",
        description: "205/60/45 ס\"מ - גודל שמאפשר פעילות דינמית בחוגים, במתנ\"סים ובחדר משחקים ביתי.",
      },
      {
        title: "מוטוריקה ושיווי משקל",
        description: "טיפוס, מעבר וגלישה מחזקים קואורדינציה, ביטחון בתנועה ומשחק פעיל.",
      },
    ],
    specs: [
      { label: "מידות", value: "205/60/45 ס\"מ" },
      { label: "מבנה", value: "3 חלקים - מדרגות, קובייה ושיפוע" },
      { label: "חומר", value: "ספוג רך עם ציפוי PVC / שמשונית" },
      { label: "שימוש", value: "ג׳ימבורי, חוגים ופעילות ילדים" },
    ],
    ctaText: "הזמינו את ערכת הטיפוס והגלישה - והפכו כל חלל למסלול תנועה!",
    seoDescription:
      "ערכת טיפוס וגלישה 3 חלקים לג׳ימבורי - מידות 205/60/45 ס\"מ. מדרגות, קובייה ושיפוע מבית LEVITATE. מחיר: 2,100 ₪.",
  },
  {
    id: "gymboree-soft-triangles-4pc",
    title: "4 יחידות משולשים רכים אדום ירוק",
    subcategoryLabel: "משולשים רכים אדום ירוק (4 יח׳)",
    dimensions: "70/70 ס\"מ",
    price: 2800,
    img: softTrianglesImg,
    introTitle: "סט משולשים רכים - 4 יחידות אדום וירוק",
    introParagraphs: [
      "סט של 4 משולשים רכים בצבעי אדום וירוק מבית LEVITATE - ציוד בסיסי לג׳ימבורי, שיווי משקל, טיפוס ומשחק מוטורי.",
      "כל יחידה במידות 70/70 ס״מ: יציבה, רכה ונוחה לערימה, לפיזור בתחנות ולבניית מסלולים בקבוצה.",
      "הצבעים הבולטים עוזרים לילדים לזהות תחנות במהירות ומעניקים לחלל מראה אנרגטי ומזמין.",
    ],
    featuresTitle: "למה לבחור בסט המשולשים?",
    features: [
      {
        title: "4 יחידות בסט",
        description: "מספיק לבניית מסלולים, תחנות ותרגילי שיווי משקל - גם בחוג עם כמה ילדים במקביל.",
      },
      {
        title: "צבעים בולטים",
        description: "אדום וירוק - זיהוי קל לילדים ועיצוב שממלא את החלל באנרגיה.",
      },
      {
        title: "מידות 70/70",
        description: "משולש נוח לאחיזה, לטיפוס, לישיבה ולתרגילי יציבות.",
      },
      {
        title: "גמישות בסידור",
        description: "ניתן לפזר, לערום או לחבר לרצף - מתאים לתוכניות אימון משתנות.",
      },
    ],
    specs: [
      { label: "מידות", value: "70/70 ס\"מ" },
      { label: "כמות", value: "4 יחידות" },
      { label: "צבעים", value: "אדום וירוק" },
      { label: "חומר", value: "ספוג רך עם ציפוי PVC / שמשונית" },
      { label: "שימוש", value: "ג׳ימבורי, מוטוריקה ושיווי משקל" },
    ],
    ctaText: "השלימו את מתחם הג׳ימבורי - הזמינו את סט המשולשים עכשיו!",
    seoDescription:
      "4 יחידות משולשים רכים אדום ירוק לג׳ימבורי - מידות 70/70 ס\"מ. סט מוטוריקה מבית LEVITATE. מחיר: 2,800 ₪.",
  },
  {
    id: "gymboree-incline-mat",
    title: "שיפועתי להתעמלות קרקע ולג׳ימבורי",
    subcategoryLabel: "שיפועתי להתעמלות קרקע",
    dimensions: "70/35/150/5 ס\"מ",
    price: 750,
    img: inclineMatImg,
    introTitle: "שיפועתי מקצועית - להתעמלות קרקע ולג׳ימבורי",
    introParagraphs: [
      "שיפועתי (wedge) מבית LEVITATE להתעמלות קרקע ולג׳ימבורי - לתרגול גלגולים, כניסות לתרגילים, מעברים וחיזוק מוטורי.",
      "מידות 70/35/150/5 ס\"מ: קומפקטית, יציבה ונוחה לשימוש באולם, בחוג או בבית.",
      "ידית נשיאה מובנית מקלה על ניוד ואחסון - כך שהשיפועתי זמינה בכל פעם שצריך תחנת תרגול.",
    ],
    featuresTitle: "למה לבחור בשיפועתי?",
    features: [
      {
        title: "שיפוע מדויק לתרגול",
        description: "זווית נוחה לגלגולים, כניסות ומעברים - לילדים, למתחילים ולתרגול חוזר.",
      },
      {
        title: "דואל-יוז",
        description: "מתאימה להתעמלות קרקע ולפעילות ג׳ימבורי באותו חלל - ציוד אחד, שני שימושים.",
      },
      {
        title: "קלה לניוד",
        description: "מידות קומפקטיות עם ידית נשיאה - הזזה ואחסון פשוטים בין שיעורים.",
      },
      {
        title: "ציפוי עמיד",
        description: "משטח קל לניקוי שמתאים לשימוש יומיומי באולמות ובחוגים.",
      },
    ],
    specs: [
      { label: "מידות", value: "70/35/150/5 ס\"מ" },
      { label: "סוג", value: "מזרן שיפוע / wedge" },
      { label: "חומר", value: "ספוג רך עם ציפוי PVC / שמשונית" },
      { label: "שימוש", value: "התעמלות קרקע וג׳ימבורי" },
    ],
    ctaText: "הזמינו את השיפועתי - תרגול בטוח ומדויק בכל שיעור!",
    seoDescription:
      "שיפועתי להתעמלות קרקע ולג׳ימבורי - מידות 70/35/150/5 ס\"מ. מזרן שיפוע מבית LEVITATE. מחיר: 750 ₪.",
  },
];

const GYMBOREE_AUDIENCE: ProductFeature[] = [
  {
    title: "חוגי ג׳ימבורי",
    description: "ציוד רך ובטוח למסלולים, תחנות ותרגול מוטורי עם ילדים.",
  },
  {
    title: "מתנ\"סים ובתי ספר",
    description: "עמידות לשימוש יומיומי - פתרון מקצועי לאולמות פעילות.",
  },
  {
    title: "שימוש ביתי",
    description: "מתאים לחדר משחקים או לפינת פעילות בבית.",
  },
];

export function isGymboreeProduct(product: Pick<Product, "id" | "cat">) {
  return product.cat === GYMBOREE_CATEGORY;
}

export function getGymboreeProductById(id: string): GymboreeProductDefinition | undefined {
  return GYMBOREE_PRODUCTS.find((p) => p.id === id);
}

export function getGymboreeSeoTitle(definition: GymboreeProductDefinition) {
  return `${definition.title} ${definition.dimensions}`;
}

export function getGymboreeSeoDescription(definition: GymboreeProductDefinition) {
  return definition.seoDescription;
}

export function getGymboreeSubcategoryLabels(): string[] {
  return GYMBOREE_PRODUCTS.map((p) => p.subcategoryLabel);
}

export function getGymboreeProductIds(): string[] {
  return GYMBOREE_PRODUCTS.map((p) => p.id);
}

export function buildGymboreeProductExtra(
  definition: GymboreeProductDefinition,
  allIds: string[],
): Partial<Product> {
  return {
    introTitle: definition.introTitle,
    introParagraphs: definition.introParagraphs,
    featuresTitle: definition.featuresTitle,
    features: definition.features,
    specsTitle: "מפרט טכני",
    specs: [
      ...definition.specs,
      { label: "מותג", value: "LEVITATE" },
      { label: "קטגוריה", value: GYMBOREE_CATEGORY },
      { label: "מק\"ט", value: definition.id },
    ],
    warrantyTitle: "אחריות מלאה לציוד הג׳ימבורי שלכם:",
    warrantyText:
      "12 חודשי אחריות על פגמי ייצור מבית LEVITATE דרך CHOLE sport. אנחנו כאן לכל שאלה - לפני, במהלך ואחרי הקנייה.",
    audienceTitle: "למי המוצר מתאים?",
    audience: GYMBOREE_AUDIENCE,
    ctaText: definition.ctaText,
    relatedIds: allIds.filter((id) => id !== definition.id),
  };
}
