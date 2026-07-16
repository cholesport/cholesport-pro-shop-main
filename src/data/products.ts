import cholePro25 from "@/assets/p-chole-pro-25.png";
import choleOutdoor18 from "@/assets/p-chole-outdoor-18.png";
import choleOutdoor18Playback from "@/assets/p-chole-outdoor-18-playback.png";
import choleNavy6 from "@/assets/p-chole-navy6.png";
import choleNavy6Folded from "@/assets/p-chole-navy6-folded.png";
import pongBotNovaSPro from "@/assets/p-pong-bot-nova-s-pro.png";
import landingMatImg from "@/assets/p-landing-mat.png";
import airfloorImg from "@/assets/p-airfloor.png";
import { PAYMENT_DESCRIPTION } from "@/data/payment";
import { SHOWROOM_DESCRIPTION, SHOWROOM_TITLE } from "@/data/showroom";
import { CONTACT_PHONE_DISPLAY } from "@/lib/contact";
import {
  buildLandingMatProductExtra,
  getLandingMatTitle,
  LANDING_MAT_CATEGORY,
  LANDING_MAT_VARIANTS,
  LANDING_MAT_BRAND,
} from "@/data/landingMats";
import {
  buildAirfloorMatProductExtra,
  getAirfloorMatTitle,
  AIRFLOOR_MAT_CATEGORY,
  AIRFLOOR_MAT_VARIANTS,
  AIRFLOOR_MAT_BRAND,
} from "@/data/airfloorMats";
import {
  buildGymboreeProductExtra,
  GYMBOREE_BRAND,
  GYMBOREE_CATEGORY,
  GYMBOREE_PRODUCTS,
} from "@/data/gymboree";
import {
  buildTrainingAccessoryProductExtra,
  TRAINING_ACCESSORIES_BRAND,
  TRAINING_ACCESSORIES_CATEGORY,
  TRAINING_ACCESSORIES_PRODUCTS,
} from "@/data/trainingAccessories";

export type ProductFeature = { title: string; description: string };
export type ProductSpec = { label: string; value: string };
export type ProductAccordion = { title: string; content: string };

export type ProductFeatureHighlight = {
  image: string;
  title: string;
  caption: string;
  /** Feature title prefix — highlight renders after the matching bullet. */
  afterFeaturePrefix: string;
};

export type Product = {
  id: string;
  /** Optional until a product photo is available — UI shows a text placeholder. */
  img?: string;
  images: string[];
  brand: string;
  title: string;
  sku: string;
  cat: string;
  price: number;
  was: number;
  rating: number;
  reviews: number;
  badge?: string;
  stockNote?: string;
  introTitle: string;
  introParagraphs: string[];
  featuresTitle: string;
  features: ProductFeature[];
  specsTitle: string;
  specs: ProductSpec[];
  warrantyTitle: string;
  warrantyText: string;
  audienceTitle: string;
  audience: ProductFeature[];
  ctaText: string;
  videoNote?: string;
  featureHighlight?: ProductFeatureHighlight;
  accordion: ProductAccordion[];
  relatedIds: string[];
};

const DEFAULT_ACCORDION: ProductAccordion[] = [
  {
    title: "מדיניות משלוחים",
    content:
      `איסוף עצמי זמין מהחנות בבית השואבה 6, תל אביב — ללא עלות משלוח. למשלוח לכתובת יש לתאם ישירות בוואטסאפ בטלפון ${CONTACT_PHONE_DISPLAY} לקבלת פרטים על עלויות וזמני אספקה.`,
  },
  {
    title: "אפשרויות תשלום",
    content: PAYMENT_DESCRIPTION,
  },
  {
    title: "אחריות על המוצר",
    content: "אחריות לשנה על כל הציוד בחנות. שירות מקצועי ותמיכה לאחר הרכישה.",
  },
  {
    title: SHOWROOM_TITLE,
    content: SHOWROOM_DESCRIPTION,
  },
];

function makeProduct(
  base: Pick<
    Product,
    "id" | "brand" | "title" | "sku" | "cat" | "price" | "was" | "rating" | "reviews" | "badge"
  > & { img?: string },
  extra?: Partial<Product>,
): Product {
  return {
    img: base.img,
    images: base.img ? [base.img] : [],
    stockNote: "נותרו יחידות אחרונות",
    introTitle: base.title,
    introParagraphs: [
      `${base.title} — ציוד מקצועי באיכות גבוהה, מתאים לאימון, לפנאי ולשימוש יומיומי.`,
      "נבחר בקפידה על ידי צוות CHOLE sport כדי להעניק לכם ביצועים, עמידות וערך מעולה.",
    ],
    featuresTitle: "למה לבחור במוצר הזה?",
    features: [
      {
        title: "איכות מקצועית",
        description: "חומרים עמידים וגימור מדויק לשימוש ממושך.",
      },
      {
        title: "מתאים לכל רמה",
        description: "ממתחילים ועד ספורטאים מנוסים — הכל במוצר אחד.",
      },
      {
        title: "ערך מעולה",
        description: "מחיר תחרותי יחד עם אחריות ושירות מלא.",
      },
    ],
    specsTitle: "מפרט טכני",
    specs: [
      { label: "קטגוריה", value: base.cat },
      { label: "מק\"ט", value: base.sku },
      { label: "מותג", value: base.brand.replace("®", "") },
    ],
    warrantyTitle: "אחריות מלאה למוצר שלך:",
    warrantyText:
      "12 חודשי אחריות מלאה מבית CHOLE sport. אנחנו כאן לכל שאלה — לפני, במהלך ואחרי הקנייה.",
    audienceTitle: "למי המוצר מתאים?",
    audience: [
      { title: "שימוש ביתי", description: "מושלם לחיזוק, אימון ופעילות משפחתית." },
      { title: "מתנ\"סים ומוסדות", description: "עמידות גבוהה לשימוש יומיומי." },
      { title: "מאמנים וספורטאים", description: "ציוד מקצועי לתוצאות אמיתיות." },
    ],
    ctaText: "הזמינו עכשיו ותיהנו מציוד מקצועי במחיר מעולה!",
    accordion: DEFAULT_ACCORDION,
    relatedIds: [],
    ...base,
    ...extra,
  };
}

export const PONG_BOT_NOVA_S_PRO_ID = "pong-bot-nova-s-pro";
export const PONG_BOT_NOVA_S_PRO_STOCK_NOTE =
  "כרגע לא במלאי — ניתן להזמין מראש, והמלאי יחזור בקרוב.";

export const PRODUCTS: Product[] = [
  makeProduct(
    {
      id: "chole-pro-25",
      img: cholePro25,
      brand: "CHOLE®",
      title: "CHOLE PRO 25 — שולחן טניס שולחן מקצועי פנים, פלטה 25 מ\"מ",
      sku: "chole-pro-25",
      cat: "שולחנות משחק",
      price: 3600,
      was: 3600,
      rating: 0,
      reviews: 0,
    },
    {
      introTitle: "CHOLE PRO 25 — שולחן מקצועי פנים, פלטה 25 מ\"מ",
      introParagraphs: [
        "שולחן מקצועי פנים, לשחקנים שרוצים לקחת את רמת המשחק שלהם לרמה הבאה.",
        "דגם CHOLE PRO 25 מציע פלטת משחק בעובי 25 מ\"מ, מסגרת מתכת חזקה, רשת מקצועית וגלגלים לניידות — הכל בגימור פרימיום לשימוש ביתי, במועדון או במתנ\"ס.",
      ],
      featuresTitle: "למה לבחור ב-CHOLE PRO 25?",
      features: [
        {
          title: "פלטה 25 מ\"מ מקצועית",
          description: "משטח משחק בעובי 25 מ\"מ, שליטה מדויקת בכדור וחוויית משחק ברמה תחרותית.",
        },
        {
          title: "שלדה יציבה ועמידה",
          description: "מסגרת מתכת כהה ורגליים חזקות שמבטיחות יציבות מלאה גם במשחקים אינטנסיביים.",
        },
        {
          title: "רשת מקצועית",
          description: "רשת שחורה איכותית עם מערכת עמודים מקצועית — מוכנה למשחק מיד לאחר ההרכבה.",
        },
        {
          title: "ניידות ונוחות",
          description: "גלגלים עם נעילה ברגליים הפנימיות מאפשרים הזזה קלה ואחסון נוח בין משחקים.",
        },
      ],
      specsTitle: "מפרט טכני:",
      specs: [
        { label: "דגם", value: "CHOLE PRO 25" },
        { label: "סוג", value: "שולחן טניס שולחן מקצועי פנימי" },
        { label: "עובי פלטה", value: "25 מ\"מ" },
        { label: "מותג", value: "CHOLE" },
        { label: "קטגוריה", value: "שולחנות משחק מקצועיים" },
        { label: "מק\"ט", value: "chole-pro-25" },
      ],
      audienceTitle: "למי השולחן מתאים?",
      audience: [
        {
          title: "שחקני טניס שולחן",
          description: "למי שמחפש שולחן פנימי מקצועי עם פלטה 25 מ\"מ לשיפור רמת המשחק.",
        },
        {
          title: "בית ומועדון",
          description: "מתאים לחדר משחקים ביתי, מועדון ספורט או מתנ\"ס.",
        },
        {
          title: "מאמנים וקבוצות",
          description: "משטח איכותי לאימונים שוטפים ולתחרויות ברמה גבוהה.",
        },
      ],
      ctaText: "העלו את רמת המשחק שלכם — הזמינו את CHOLE PRO 25 עכשיו!",
      relatedIds: ["chole-navy6", "chole-outdoor-18", "pong-bot-nova-s-pro"],
    },
  ),
  makeProduct(
    {
      id: "chole-outdoor-18",
      img: choleOutdoor18,
      brand: "CHOLE®",
      title: "CHOLE outdoor 18 — שולחן טניס שולחן מקצועי לאזורי חוץ",
      sku: "chole-outdoor-18",
      cat: "שולחנות משחק",
      price: 2950,
      was: 2950,
      rating: 0,
      reviews: 0,
      badge: "Outdoor",
    },
    {
      images: [choleOutdoor18, choleOutdoor18Playback],
      featureHighlight: {
        image: choleOutdoor18Playback,
        title: "קיפול חצי (Playback) — משחק עצמי ואחסון חכם",
        caption:
          "מצב הקיפול מאפשר אימון עצמי עם חצי השולחן כקיר חזרה, וקיפול מהיר של שני החלקים הנפרדים לחיסכון מקום מקסימלי באחסון.",
        afterFeaturePrefix: "2 חלקים",
      },
      introTitle: "עמידות מקצועית בחוץ — ביצועים שלא מוותרים על מזג האוויר",
      introParagraphs: [
        "CHOLE outdoor 18 הוא שולחן טניס שולחן מקצועי שתוכנן במיוחד לאזורי חוץ — גינות, מרפסות, מוסדות ומתחמי ספורט.",
        "פלטה בעובי 18 מ\"מ, שלדה עמידה וגלגלים חזקים — הכל במערכת קומפактית מ-2 חלקים נפרדים שמאפשרת אחסון קל. מוכנים למשחק? הוסיפו לעגלה וקבלו ציוד שמחזיק לאורך זמן.",
      ],
      featuresTitle: "למה CHOLE outdoor 18?",
      features: [
        {
          title: "פלטה 18 מ\"מ מקצועית",
          description: "משטח משחק בעובי 18 מ\"מ המבטיח קפיצת כדור יציבה ומדויקת — גם בחוץ.",
        },
        {
          title: "עמידות מלאה בכל מזג אוויר",
          description: "עמיד לחלוטין בגשם, שמש ולחות — מתאים לשימוש יומיומי באזורי חוץ.",
        },
        {
          title: "2 חלקים נפרדים — קיפול ואחסון קל",
          description: "מורכב משני חצאים עצמאיים, לקיפול מהיר וחיסכון מקסימלי במקום אחסון.",
        },
        {
          title: "יציבות למשחק אינטנסיבי",
          description: "רגליים חזקות ועמידות במיוחד המבטיחות בסיס יציב גם במשחקים תחרותיים.",
        },
        {
          title: "גלגלים גדולים לניידות בחוץ",
          description: "גלגלים עמידים וגדולים המותאמים לתנועה נוחה גם על משטחי חוץ שונים.",
        },
      ],
      specsTitle: "מפרט טכני",
      specs: [
        { label: "דגם", value: "CHOLE outdoor 18" },
        { label: "סוג", value: "שולחן טניס שולחן מקצועי לחוץ" },
        { label: "עובי פלטה", value: "18 מ\"מ" },
        { label: "עמידות", value: "עמיד בגשם, שמש ולחות" },
        { label: "מבנה", value: "2 חלקים נפרדים — קיפול ואחסון קל" },
        { label: "ניידות", value: "גלגלים גדולים ועמידים" },
        { label: "מותג", value: "CHOLE" },
        { label: "קטגוריה", value: "שולחנות משחק מקצועיים" },
        { label: "מק\"ט", value: "chole-outdoor-18" },
      ],
      audienceTitle: "למי השולחן מתאים?",
      audience: [
        {
          title: "בתים עם גינה או מרפסת",
          description: "שולחן מקצועי שמחזיק מעמד בחוץ — לכל המשפחה.",
        },
        {
          title: "מוסדות ומתנ\"סים",
          description: "עמידות גבוהה לשימוש יומיומי באזורים פתוחים.",
        },
        {
          title: "מועדוני ספורט ומלונות",
          description: "ציוד מקצועי שמעניק חוויית משחק ברמה גבוהה לאורחים ולחברים.",
        },
      ],
      ctaText: "מוכנים למשחק בחוץ? הזמינו את CHOLE outdoor 18 עכשיו!",
      relatedIds: ["chole-navy6", "chole-pro-25", "pong-bot-nova-s-pro"],
    },
  ),
  makeProduct(
    {
      id: "chole-navy6",
      img: choleNavy6,
      brand: "CHOLE®",
      title: "CHOLE NAVY6 — שולחן טניס שולחן מקצועי לחוץ",
      sku: "chole-navy6",
      cat: "שולחנות משחק",
      price: 3290,
      was: 3290,
      rating: 0,
      reviews: 0,
      badge: "NAVY6",
    },
    {
      images: [choleNavy6, choleNavy6Folded],
      featureHighlight: {
        image: choleNavy6Folded,
        title: "קיפול חכם — חיסכון מקסימלי במקום",
        caption:
          "חיסכון מקסימלי במקום: עיצוב חכם המאפשר קיפול מהיר ואחסון נוח בכל פינה — השולחן נשאר בחצר, לא צריך לפנות לו מחסן.",
        afterFeaturePrefix: "אחסון",
      },
      introTitle: "המשחק לא עוצר בחוץ — הכירו את ה-NAVY6",
      introParagraphs: [
        "דמיינו משחק טניס שולחן מקצועי בחצר — בלי לדאוג לגשם, בלי לכסות כל יום, בלי להתפשר על הקפיצה. CHOLE NAVY6 נבנה בדיוק בשביל זה.",
        "שולחן Outdoor לשחקנים שרוצים איכות מקצועית בבית — הורים, חובבים ומשפחות שלא מוכנים לוותר על ביצועים. פלטת מלמין 6 מ\"מ, שלדה עמידה וגלגלים מסיביים: הכל במערכת אחת שנותנת לכם שקט נפשי לשנים.",
        "CHOLE NAVY6 מתוכנן לעמוד בתנאי מזג אוויר משתנים — שמש ישירה, לחות ושינויי טמפרטורה — לאורך שנים. לא צריך לפרק ולשמור בכל סוף עונה; השולחן נשאר בחוץ, מוכן למשחק הבא. זה השולחן שקונים פעם אחת.",
      ],
      featuresTitle: "למה NAVY6 הוא השולחן האחרון שתצטרכו?",
      features: [
        {
          title: "פלטת מלמין 6 מ\"מ = דיוק של מקצוענים",
          description:
            "משטח משחק איכותי בעובי 6 מ\"מ המבטיח קפיצת כדור עקבית וביצועים גבוהים — שליטה מדויקת בכדור בכל משחק.",
        },
        {
          title: "עמידות חוץ מלאה — שקט נפשי לשנים",
          description:
            "מתוכנן לעמוד בשמש, לחות ושינויי טמפרטורה — בלי צורך לכסות את השולחן בכל יום. בנוי לחיים בחוץ.",
        },
        {
          title: "גלגלים מסיביים = ניוד קל על כל משטח",
          description:
            "גלגלים גדולים ועמידים, מותאמים במיוחד לשטח חוץ — מרצפות, דשא ומשטחים לא אחידים.",
        },
        {
          title: "יציבות תחרותית",
          description: "רגליים חזקות ויציבות במיוחד — בסיס איתן למשחק אינטנסיבי, גם כשהמשחק מתחמם.",
        },
        {
          title: "אחסון — קיפול נוח ומהיר",
          description: "עיצוב חכם לקיפול מהיר וחיסכון במקום כשלא משחקים — השולחן לא תופס את כל החצר.",
        },
      ],
      specsTitle: "מפרט טכני",
      specs: [
        { label: "דגם", value: "CHOLE NAVY6 (Outdoor)" },
        { label: "סוג", value: "שולחן טניס שולחן מקצועי לחוץ" },
        { label: "משטח משחק", value: "פלטת מלמין 6 מ\"מ" },
        { label: "עמידות", value: "שמש, לחות ושינויי טמפרטורה" },
        { label: "ניידות", value: "גלגלים מסיביים לשטח חוץ" },
        { label: "אחסון", value: "קיפול נוח ומהיר" },
        { label: "מותג", value: "CHOLE" },
        { label: "קטגוריה", value: "שולחנות משחק מקצועיים" },
        { label: "מק\"ט", value: "chole-navy6" },
      ],
      audienceTitle: "למי NAVY6 מתאים?",
      audience: [
        {
          title: "משפחות עם חצר",
          description: "שולחן מקצועי שכל המשפחה נהנית ממנו — בלי דאגות מזג אוויר.",
        },
        {
          title: "שחקני חובבים",
          description: "רוצים איכות מקצועית בבית, עם ביצועים שמרגישים כמו במועדון.",
        },
        {
          title: "מתחמי ספורט ומלונות",
          description: "ציוד עמיד שמחזיק מעמד בשימוש יומיומי באזורים פתוחים.",
        },
      ],
      ctaText: "מוכנים לשחק בחוץ בלי פשרות? הזמינו את CHOLE NAVY6 — השולחן האחרון שתצטרכו.",
      relatedIds: ["chole-outdoor-18", "chole-pro-25", "pong-bot-nova-s-pro"],
    },
  ),
  makeProduct(
    {
      id: "pong-bot-nova-s-pro",
      img: pongBotNovaSPro,
      brand: "PONG BOT®",
      title: "PONG BOT NOVA S PRO — רובוט אימון טניס שולחן מקצועי",
      sku: "pong-bot-nova-s-pro",
      cat: "טניס שולחן",
      price: 1850,
      was: 2000,
      rating: 0,
      reviews: 0,
      badge: "מתנה: אוסף כדורים",
    },
    {
      introTitle: "ה-Ultimate Partner לאימון אישי — NOVA S PRO מבית PONG BOT",
      introParagraphs: [
        "רובוט האימון NOVA S PRO הוא פתרון ה-All-in-one הכי מתקדם שיש — שותף אימון אישי שמאפשר לכם להתאמן בקצב שלכם, בכל שעה, ללא צורך בבן זוג.",
        "תכולת הערכה: 100 כדורי טניס שולחן + רשת. בנוסף — מקבלים מתנה יחד עם הערכה: אוסף כדורים.",
        "נבחר על ידי CHOLE sport כחלק מההיצע המקצועי שלנו בקטגוריית ציוד טניס שולחן — ציוד משלים אידיאלי לשולחן CHOLE שלכם.",
      ],
      featuresTitle: "למה NOVA S PRO?",
      features: [
        {
          title: "שותף אימון אישי 24/7",
          description: "אימון עצמאי בכל רמה — מהתחלה ועד רמה תחרותית, בלי תלות בבן זוג.",
        },
        {
          title: "100 כדורים + רשת",
          description: "תכולת הערכה: 100 כדורי טניס שולחן + רשת — מוכנים לאימון מיד.",
        },
        {
          title: "מתנה: אוסף כדורים",
          description: "מקבלים מתנה יחד עם הערכה — אוסף כדורים לאיסוף נוח ומהיר אחרי האימון.",
        },
        {
          title: "דיוק ועקביות",
          description: "שליטה מדויקת במהירות, סיבוב וזווית — לשיפור טכניקה ותגובות במשחק.",
        },
        {
          title: "קומפקטי ונייד",
          description: "עיצוב מקצועי קומפקטי שמתאים לחדר משחקים, מועדון או חצר עם שולחן CHOLE.",
        },
      ],
      specsTitle: "מפרט טכני",
      specs: [
        { label: "דגם", value: "PONG BOT NOVA S PRO" },
        { label: "מותג", value: "PONG BOT" },
        { label: "סוג", value: "רובוט אימון טניס שולחן" },
        { label: "תכולת ערכה", value: "100 כדורי טניס שולחן + רשת" },
        { label: "מתנה", value: "אוסף כדורים" },
        { label: "קטגוריה", value: "ציוד טניס שולחן" },
        { label: "מק\"ט", value: "pong-bot-nova-s-pro" },
      ],
      audienceTitle: "למי הרובוט מתאים?",
      audience: [
        {
          title: "שחקנים מתקדמים",
          description: "מי שרוצה לשפר ביצועים עם אימון ממוקד ועקבי — בלי להמתין לבן זוג.",
        },
        {
          title: "משפחות עם שולחן CHOLE",
          description: "השלמה מושלמת לשולחן הביתי — כל אחד יכול להתאמן בקצב שלו.",
        },
        {
          title: "מועדונים ומתנ\"סים",
          description: "ציוד משלים מקצועי לאימונים עצמאיים ולחוגי טניס שולחן.",
        },
      ],
      ctaText: "שדרגו את האימון שלכם — הזמינו את NOVA S PRO עכשיו!",
      stockNote: PONG_BOT_NOVA_S_PRO_STOCK_NOTE,
      relatedIds: ["chole-pro-25", "chole-navy6", "chole-outdoor-18"],
    },
  ),
  ...LANDING_MAT_VARIANTS.map((variant) =>
    makeProduct(
      {
        id: variant.id,
        img: landingMatImg,
        brand: LANDING_MAT_BRAND,
        title: getLandingMatTitle(variant),
        sku: variant.id,
        cat: LANDING_MAT_CATEGORY,
        price: variant.price,
        was: variant.price,
        rating: 0,
        reviews: 0,
      },
      buildLandingMatProductExtra(
        variant,
        LANDING_MAT_VARIANTS.map((v) => v.id),
      ),
    ),
  ),
  ...AIRFLOOR_MAT_VARIANTS.map((variant) =>
    makeProduct(
      {
        id: variant.id,
        img: airfloorImg,
        brand: AIRFLOOR_MAT_BRAND,
        title: getAirfloorMatTitle(variant),
        sku: variant.id,
        cat: AIRFLOOR_MAT_CATEGORY,
        price: variant.price,
        was: variant.was,
        rating: 0,
        reviews: 0,
        badge: "מבצע",
      },
      buildAirfloorMatProductExtra(
        variant,
        AIRFLOOR_MAT_VARIANTS.map((v) => v.id),
      ),
    ),
  ),
  ...GYMBOREE_PRODUCTS.map((definition) =>
    makeProduct(
      {
        id: definition.id,
        img: definition.img,
        brand: GYMBOREE_BRAND,
        title: definition.title,
        sku: definition.id,
        cat: GYMBOREE_CATEGORY,
        price: definition.price,
        was: definition.price,
        rating: 0,
        reviews: 0,
      },
      buildGymboreeProductExtra(
        definition,
        GYMBOREE_PRODUCTS.map((p) => p.id),
      ),
    ),
  ),
  ...TRAINING_ACCESSORIES_PRODUCTS.map((definition) =>
    makeProduct(
      {
        id: definition.id,
        img: definition.img,
        brand: TRAINING_ACCESSORIES_BRAND,
        title: definition.title,
        sku: definition.id,
        cat: TRAINING_ACCESSORIES_CATEGORY,
        price: definition.price,
        was: definition.price,
        rating: 0,
        reviews: 0,
        badge: definition.badge,
      },
      buildTrainingAccessoryProductExtra(
        definition,
        TRAINING_ACCESSORIES_PRODUCTS.map((p) => p.id),
      ),
    ),
  ),
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getRelatedProducts(product: Product): Product[] {
  return product.relatedIds
    .map((id) => getProductById(id))
    .filter((p): p is Product => Boolean(p));
}

export const TABLE_TENNIS_EQUIPMENT_CATEGORY_SLUG = "table-tennis-equipment";

/** Curated mix across categories for the homepage "נבחרת CHOLE" carousel. */
export const HOMEPAGE_FEATURED_PRODUCT_IDS = [
  "chole-pro-25",
  "gymboree-climb-slide-3pc",
  "training-plyo-boxes-4pc",
  "airfloor-6x2x0.2",
  "landing-mat-250x150x30",
  "chole-navy6",
  "training-bosu-ball",
  "gymboree-soft-triangles-4pc",
  PONG_BOT_NOVA_S_PRO_ID,
  "training-hurdle-23",
  "gymboree-incline-mat",
  "chole-outdoor-18",
  "training-puzzle-mat-blue-red",
  "airfloor-4x2x0.2",
  "landing-mat-250x200x30",
] as const;

/** Products shown on the homepage featured carousel. */
export const HOMEPAGE_PRODUCTS: Product[] = HOMEPAGE_FEATURED_PRODUCT_IDS.map((id) =>
  getProductByIdOrThrow(id),
);

/** All products in the "טניס שולחן" category — accessories & training gear. */
export function getTableTennisEquipmentProducts(): Product[] {
  return PRODUCTS.filter((p) => p.cat === "טניס שולחן");
}

export function getProductByIdOrThrow(id: string): Product {
  const product = getProductById(id);
  if (!product) throw new Error(`Product not found: ${id}`);
  return product;
}
