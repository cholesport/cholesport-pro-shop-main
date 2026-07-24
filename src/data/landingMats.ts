import type { Product, ProductFeature, ProductSpec } from "@/data/products";
import { LAST_UNITS_STOCK_NOTE, OUT_OF_STOCK_NOTE } from "@/lib/productLabels";

export const LANDING_MAT_CATEGORY = "מזרני נחיתה";
export const LANDING_MAT_CATEGORY_SLUG = "landing-mats";
export const LANDING_MAT_BRAND = "LEVITATE®";
export type LandingMatVariant = {
  id: string;
  lengthCm: number;
  widthCm: number;
  thicknessCm: number;
  price: number;
  outOfStock?: boolean;
};

/** Sizes and prices from product catalog (אורך / רוחב / עובי, cm). */
export const LANDING_MAT_VARIANTS: LandingMatVariant[] = [
  { id: "landing-mat-200x120x20", lengthCm: 200, widthCm: 120, thicknessCm: 20, price: 1150 },
  { id: "landing-mat-250x120x20", lengthCm: 250, widthCm: 120, thicknessCm: 20, price: 1600, outOfStock: true },
  { id: "landing-mat-250x120x30", lengthCm: 250, widthCm: 120, thicknessCm: 30, price: 1950 },
  { id: "landing-mat-250x150x20", lengthCm: 250, widthCm: 150, thicknessCm: 20, price: 2150 },
  { id: "landing-mat-250x150x30", lengthCm: 250, widthCm: 150, thicknessCm: 30, price: 2550 },
  { id: "landing-mat-250x200x30", lengthCm: 250, widthCm: 200, thicknessCm: 30, price: 3250 },
];

export const LANDING_MAT_AIRFLOOR_ID = "landing-mat-250x200x30";

export function isLandingMatAirfloorProduct(productId: string) {
  return productId === LANDING_MAT_AIRFLOOR_ID;
}

export function formatLandingMatDimensions(v: Pick<LandingMatVariant, "lengthCm" | "widthCm" | "thicknessCm">) {
  return `${v.lengthCm}×${v.widthCm}×${v.thicknessCm} ס"מ`;
}

export function formatLandingMatDimensionsSlash(v: Pick<LandingMatVariant, "lengthCm" | "widthCm" | "thicknessCm">) {
  return `${v.lengthCm} / ${v.widthCm} / ${v.thicknessCm} ס"מ`;
}

export function getLandingMatTitle(v: LandingMatVariant) {
  return `מזרן נחיתה LEVITATE ${formatLandingMatDimensions(v)}`;
}

export function getLandingMatSeoTitle(v: LandingMatVariant) {
  return `מזרן נחיתה ${formatLandingMatDimensions(v)}`;
}

export function getLandingMatSeoDescription(v: LandingMatVariant) {
  if (v.id === LANDING_MAT_AIRFLOOR_ID) {
    return (
      "מזרן נחיתה 250×200×30 ס\"מ - משטח נחיתה ייעודי ל-AirFloor. " +
      "פתחי אוורור אדומים לשינוע, ידיות חזקות מלפנים ומאחור, וניתן להזמין גם בגודל מיוחד."
    );
  }
  return (
    `מזרן נחיתה מקצועי ${formatLandingMatDimensions(v)} מחומר שמשונית עבה - ` +
    `פתחי אוורור אדומים לשינוע, ידיות חזקות, ספיגת זעזועים. ניתן להזמין גם בגודל מיוחד. ` +
    `מחיר: ${v.price.toLocaleString("he-IL")} ₪.`
  );
}

export function isLandingMatProduct(product: Pick<Product, "id" | "cat">) {
  return product.cat === LANDING_MAT_CATEGORY;
}

export function getLandingMatVariantById(id: string): LandingMatVariant | undefined {
  return LANDING_MAT_VARIANTS.find((v) => v.id === id);
}

export function getLandingMatSubcategoryLabels(): string[] {
  return LANDING_MAT_VARIANTS.map((v) => formatLandingMatDimensions(v));
}

const LANDING_MAT_FEATURES: ProductFeature[] = [
  {
    title: "ספיגת זעזועים מקצועית",
    description:
      "מבנה ספוג רב-שכבתי וציפוי שמשונית עבה שמקטין עומס על המפרקים - בטיחות מירבית בנחיתות, קפיצות ותרגילי אקרובטיקה.",
  },
  {
    title: "חומר שמשונית עמיד",
    description:
      "ציפוי PVC / שמשונית איכותי, עמיד בפני שחיקה, קרעים ולחות - מתאים לשימוש יומיומי במתנ\"סים, חוגים ובית.",
  },
  {
    title: "פתחי אוורור אדומים - גם לשינוע",
    description:
      "פתחי האוורור בצבע אדום בדפנות המזרן משחררים אוויר במהירות בעת נחיתה לספיגה אחידה ויציבה - ומשמשים גם לאחיזה ולשינוע נוח של המזרן.",
  },
  {
    title: "ידיות חזקות מלפנים ומאחור",
    description:
      "בחלק הקדמי והאחורי של המזרן מותקנות ידיות חזקות לשינוע בטוח - להרמה והזזה בלי לגרור על הרצפה.",
  },
  {
    title: "מידות במלאי + גודל מיוחד",
    description:
      "6 גדלים בקטלוג - ממזרן קומפקטי ועד משטח רחב. צריכים מידה אחרת? ניתן להזמין מזרן נחיתה בגודל מיוחד בוואטסאפ.",
  },
];

const LANDING_MAT_AIRFLOOR_FEATURES: ProductFeature[] = [
  ...LANDING_MAT_FEATURES.filter((f) => f.title !== "מידות במלאי + גודל מיוחד"),
  {
    title: "התאמה מדויקת לרוחב AirFloor",
    description:
      "רוחב 200 ס\"מ - תואם ברוחב המקובל של מזרני איירפלור, ליצירת רצף בטיחותי מושלם בין משטח האימון לנחיתה.",
  },
  {
    title: "בלימה מקסימלית - 30 ס\"מ עובי",
    description:
      "עובי 30 ס\"מ מספק ספיגת זעזועים עמוקה - חיוני לנחיתות מגובה, קפיצות ותרגילי כוח.",
  },
  {
    title: "משטח נחיתה של 2.5 מטר",
    description:
      "אורך 250 ס\"מ (2.5 מ') מעניק משטח נחיתה ובלימה אופטימליים - לעבודה בטוחה, מדויקת וללא פשרות.",
  },
];

const LANDING_MAT_AUDIENCE: ProductFeature[] = [
  {
    title: "ג׳ימבורי ואקרובטיקה",
    description: "משטח נחיתה בטוח לתרגילים, קפיצות וגלגולים - לילדים ונוער.",
  },
  {
    title: "מתנ\"סים ובתי ספר",
    description: "עמידות גבוהה לשימוש יומיומי - פתרון מקצועי לחוגי התעמלות ונינג'ה.",
  },
  {
    title: "שימוש ביתי",
    description: "מזרן נחיתה איכותי לחצר, לחדר כושר או למרפסת - שקט נפשי להורים.",
  },
];

const LANDING_MAT_AIRFLOOR_AUDIENCE: ProductFeature[] = [
  {
    title: "מאמנים ומתקני AirFloor",
    description:
      "פתרון הנחיתה המומלץ לחוגי אקרובטיקה, ג׳ימבורי ונינג'ה - משלים את מערכת האיירפלור בצורה מקצועית ובטוחה.",
  },
  {
    title: "מתנ\"סים ואולמות אימון",
    description: "משטח נחיתה רחב ועמיד - לעבודה יומיומית עם קבוצות ורמות מתקדמות.",
  },
  {
    title: "בעלי מתקנים פרטיים",
    description: "השקעה חד-פעמית שמבטיחה רצף בטיחותי מלא מקצה האיירפלור ועד הרצפה.",
  },
];

export const LANDING_MAT_AIRFLOOR_MARKETING = {
  title: "משטח נחיתה ל-AirFloor - הציוד המשלים ההכרחי",
  paragraphs: [
    "מזרן הנחיתה 250×200×30 ס\"מ הוא הפתרון האידיאלי כמשטח נחיתה ייעודי למערכות AirFloor - עבור מאמנים, מתנ\"סים ובעלי מתקנים שמחפשים רמה מקצועית של בטיחות וביצועים.",
    "רוחב 200 ס\"מ תואם במדויק לרוחב המקובל של מזרני איירפלור - כך נוצר רצף בטיחותי מושלם: מהאימון על האיירפלור, דרך המעבר, ועד לבלימה המלאה על משטח הנחיתה. בלי פערים, בלי פשרות.",
    "עם עובי 30 ס\"מ ואורך 2.5 מטר, המזרן מעניק את משטח הנחיתה והבלימה האופטימליים - ספיגת זעזועים עמוקה שמאפשרת עבודה בטוחה, מדויקת ועקבית, גם בתרגילים מתקדמים וגם בחוגים עם נפח גבוה.",
  ],
  bullets: [
    "רוחב 200 ס\"מ - התאמה מלאה לרוחב AirFloor המקובל",
    "עובי 30 ס\"מ - בלימה מקסימלית לנחיתות מגובה",
    "אורך 2.5 מ' - משטח נחיתה רחב לעבודה מדויקת",
  ],
} as const;



export const LANDING_MAT_AIRFLOOR_WARRANTY = {
  title: "אחריות ושירות - מזרן נחיתה מקצועי (250/200/30)",
  introBefore:
    "אנו ב-LV עומדים מאחורי איכות הציוד שלנו. מזרן זה מיוצר מחומרים ברמה הגבוהה ביותר כדי לספק בלימת זעזועים אופטימלית ועבודה רציפה ובטוחה (אידאלי לשילוב עם מערכות איירפלור). כדי שתתאמנו בשקט נפשי, המזרן מגיע עם ",
  introHighlight: "12 חודשי אחריות",
  introAfter: " על פגמי ייצור.",
  includesTitle: "האחריות שלנו כוללת קודם כל את השקט שלכם:",
  includes: [
    {
      title: "פגמים בייצור",
      description:
        "כשלים בתפרים, ברוכסנים או בחיבורי מעטפת ה-PVC המקצועית שמונעים מהמזרן לתפקד כראוי.",
    },
    {
      title: "ליקויים בחומר",
      description:
        "פגמים יוצאי דופן במילוי הפנימי בעת קבלת המוצר, שאינם מאפשרים בלימה בטיחותית.",
    },
  ],
  excludesTitle: "מה האחריות אינה מכסה? (השקיפות חשובה לנו:)",
  excludes: [
    {
      title: "בלאי טבעי",
      description:
        "מזרן נחיתה נועד לספוג אימפקט גבוה. התרככות הדרגתית של הספוג לאחר חודשים ושנים של קפיצות היא תהליך טבעי, תקין לחלוטין ואינה נחשבת לפגם.",
    },
    {
      title: "נזק פיזי או שימוש חריג",
      description:
        "קרעים כתוצאה משימוש בחפצים חדים, נעליים עם עקבים/פקקים, או נזק שנגרם עקב גרירת המזרן על רצפה מחוספסת (אנו ממליצים תמיד להרים את המזרן בעת הזזתו בעזרת הידיות).",
    },
    {
      title: "תנאי סביבה ואחסון",
      description:
        "נזקים שנגרמו כתוצאה מחשיפה ממושכת לשמש ישירה (דהייה/התייבשות החומר), חשיפה לגשם או לחות מתמשכת שעלולה לגרום לעובש.",
    },
  ],
  closingTitle: "ההבטחה שלנו:",
  closingText:
    "המזרן הזה נועד לעבוד קשה ולשמור עליכם. תחזוקה בסיסית ואחסון נכון יבטיחו לכם משטח נחיתה בטיחותי ואמין לשנים ארוכות. לכל שאלה, התייעצות טכנית או שירות - הצוות שלנו תמיד כאן בשבילכם.",
} as const;

export function buildLandingMatProductExtra(
  variant: LandingMatVariant,
  allIds: string[],
): Partial<Product> {
  const dims = formatLandingMatDimensions(variant);
  const dimsSlash = formatLandingMatDimensionsSlash(variant);
  const isAirfloor = variant.id === LANDING_MAT_AIRFLOOR_ID;

  const specs: ProductSpec[] = [
    { label: "מידות (אורך / רוחב / עובי)", value: dimsSlash },
    { label: "אורך", value: `${variant.lengthCm} ס"מ` },
    { label: "רוחב", value: `${variant.widthCm} ס"מ` },
    { label: "עובי", value: `${variant.thicknessCm} ס"מ` },
    { label: "חומר", value: "שמשונית עבה (PVC)" },
    {
      label: "פתחי אוורור",
      value: "אדומים - לשחרור אוויר, אחיזה ושינוע",
    },
    {
      label: "ידיות",
      value: "ידיות חזקות בחלק הקדמי והאחורי לשינוע",
    },
    {
      label: "גודל מיוחד",
      value: "ניתן להזמנה בוואטסאפ לפי מידות מותאמות",
    },
    { label: "מותג", value: "LEVITATE" },
    { label: "קטגוריה", value: "מזרני נחיתה במידות שונות" },
    { label: "מק\"ט", value: variant.id },
  ];

  if (isAirfloor) {
    specs.splice(4, 0, { label: "שימוש מומלץ", value: "משטח נחיתה ל-AirFloor" });
  }

  const base: Partial<Product> = {
    introTitle: isAirfloor
      ? "משטח נחיתה מקצועי ל-AirFloor - 250×200×30 ס\"מ"
      : `מזרן נחיתה מקצועי - ${dims}`,
    introParagraphs: isAirfloor
      ? [
          `מזרן הנחיתה הגדול ביותר בסדרה - ${dimsSlash} - תוכנן במיוחד כמשטח נחיתה ייעודי למערכות AirFloor.`,
          "רוחב 200 ס\"מ תואם לרוחב המקובל של מזרני איירפלור, ליצירת רצף בטיחותי מושלם מקצה האימון ועד הבלימה.",
          "פתחי אוורור אדומים לשינוע ואחיזה, ידיות חזקות מלפנים ומאחור, ועובי 30 ס\"מ עם אורך 2.5 מ' לבלימה מקצועית. ניתן להזמין גם בגודל מיוחד.",
        ]
      : [
          `מזרן נחיתה LEVITATE בגודל ${dimsSlash} - מחומר שמשונית עבה, לספיגת זעזועים מקסימלית ובטיחות בכל נחיתה.`,
          "מזרני הנחיתה שלנו תוכננו לאימוני ג׳ימבורי, אקרובטיקה, נינג'ה וקפיצה לגובה - עם פתחי אוורור אדומים שמשמשים גם לשינוע, וידיות חזקות בחלק הקדמי והאחורי.",
          "בחרו מידה מהקטלוג בסרגל למעלה - ואם אתם צריכים מידה אחרת, אפשר להזמין מזרן נחיתה בגודל מיוחד בוואטסאפ.",
        ],
    featuresTitle: isAirfloor ? "למה זה הציוד המשלים הנכון ל-AirFloor?" : "למה לבחור במזרן נחיתה LEVITATE?",
    features: isAirfloor ? LANDING_MAT_AIRFLOOR_FEATURES : LANDING_MAT_FEATURES,
    specsTitle: "מפרט טכני",
    specs,
    audienceTitle: "למי המזרן מתאים?",
    audience: isAirfloor ? LANDING_MAT_AIRFLOOR_AUDIENCE : LANDING_MAT_AUDIENCE,
    ctaText: isAirfloor
      ? "השלימו את מערכת ה-AirFloor שלכם - הזמינו עכשיו!"
      : `הזמינו מזרן נחיתה ${dims} - בטיחות ואיכות מקצועית!`,
    stockNote: variant.outOfStock ? OUT_OF_STOCK_NOTE : LAST_UNITS_STOCK_NOTE,
    outOfStock: Boolean(variant.outOfStock),
    relatedIds: allIds.filter((id) => id !== variant.id),
  };

  return base;
}
