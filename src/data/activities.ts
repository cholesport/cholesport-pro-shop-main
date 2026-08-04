import tableTennisImg from "@/assets/club-tt-action.png";
import tableTennisKidsImg from "@/assets/club-tt-kids.png";
import kidsImg from "@/assets/club-kids-ninja.png";
import eventsImg from "@/assets/club-events-climbing.png";
import { COMPANY } from "@/data/legal";
import { buildAllGroupLessonPricingPlans } from "@/data/groupLessonPricing";
import { NINJA_KIDS_CATEGORY_LEAD } from "@/data/kids";
import { TABLE_TENNIS_KIDS_AGE_LABEL, TABLE_TENNIS_KIDS_AGE_RANGE } from "@/data/tableTennis";
import { WHATSAPP_URL } from "@/lib/contact";

/** Legacy path — redirects to the relevant area page. */
export const ACTIVITIES_PATH = "/register";

export const ACTIVITIES_SEO_TITLE = "רישום לחוגים, פעילויות וכניסה למתחם | CHOLE sport";
export const ACTIVITIES_SEO_DESCRIPTION =
  "לו\"ז שיעורים, הרשמה ומחירון במתחם CHOLE TLV — כניסה למועדון טניס השולחן (מתחם הפינגפונג), אימוני טניס שולחן, חוגי נינג'ה לילדים, אימון פונקציונלי לבוגרים וקייטנות. תל אביב.";

/** Shown on monthly subscription plans at checkout. */
export const ACTIVITIES_SUBSCRIPTION_NOTICE =
  "מנוי חודשי - החיוב מתבצע בהוראת קבע (חיוב אוטומטי חודשי). ניתן לבטל בהתאם לתנאי המתחם.";

/** External payment until Grow API is connected. */
export const ACTIVITIES_EXTERNAL_PAYMENT_URL =
  "https://letts.co.il/payment/SjBMNjVUeEwrcWJIU2RLNXh6MHhPdz09";

export type ActivityCategoryId =
  | "table-tennis"
  | "table-tennis-kids"
  | "table-tennis-training"
  | "ninja-kids"
  | "functional-adults"
  | "camps";

export type ActivityPriceUnit = "once" | "month" | "card" | "trial";

/** Pricing plan - ready for future Grow product mapping. */
export type ActivityPricingPlan = {
  id: string;
  categoryId: ActivityCategoryId;
  name: string;
  description?: string;
  price: number;
  priceUnit: ActivityPriceUnit;
  priceNote?: string;
  /** Monthly plans billed via standing order (הוראת קבע). */
  isSubscription?: boolean;
  /** Punch-card plans — number of entries included. */
  entryCount?: number;
  isPunchCard?: boolean;
  /** Future: Grow / משולם product or package ID */
  growProductId?: string;
  paymentUrl?: string;
};

export type ActivityScheduleType = "weekly" | "seasonal";

export type ActivityScheduleSlot = {
  id: string;
  categoryId: ActivityCategoryId;
  title: string;
  /** Human-readable recurrence label (e.g. "שני ורביעי"). */
  day: string;
  timeStart: string;
  timeEnd: string;
  scheduleType: ActivityScheduleType;
  /** Weekday indices: 0=ראשון … 6=שבת. Used for daily calendar filtering. */
  weekdays: number[];
  ageRange?: string;
  level?: string;
  groupSize?: string;
  notes?: string;
  /** Future: Grow class / session ID */
  growSessionId?: string;
  registrationUrl?: string;
};

export type ActivityCategory = {
  id: ActivityCategoryId;
  title: string;
  lead: string;
  image: string;
  imageAlt: string;
};

export const ACTIVITIES_HERO = {
  eyebrow: "CHOLE TLV · מתחם ספורט",
  headline: "לו\"ז, הרשמה ומחירון — חוגים ומתחם הפינגפונג",
  support:
    "הרשמה אחת לכל מה שקורה במתחם: כניסה למועדון טניס השולחן (Open Play), חוגי נינג'ה לילדים, אימוני טניס שולחן, אימון פונקציונלי לבוגרים וקייטנות. המחירון מופיע בסוף העמוד.",
  shopCta: "רכישת ציוד ומוצרים",
  registerCta: "ללו\"ז השיעורים",
  pricingCta: "למחירון",
};

export const ACTIVITIES_WHATSAPP_RESERVE_LABEL = "המשך בוואטסאפ להרשמה";
export const ACTIVITIES_WHATSAPP_RESERVE_HINT =
  "לחיצה על הכפתור תפתח שיחת וואטסאפ - שם נשלים את ההרשמה יחד איתכם.";
export const ACTIVITIES_REGISTER_LESSON_LABEL = "הרשמה לשיעור";

/** Shared copy for registration CTAs across the site. */
export const ACTIVITIES_REGISTER_CTA_LABEL = "בחרו אזור: חוגים · פינגפונג · חנות";
/** Header / compact surfaces — gateway chooser. */
export const ACTIVITIES_REGISTER_CTA_HEADER = "מה מחפשים היום?";
export const ACTIVITIES_REGISTER_CTA_SHORT = ACTIVITIES_REGISTER_CTA_HEADER;
export const ACTIVITIES_REGISTER_BANNER_TITLE =
  "רוצים להירשם לחוג, אימון או כניסה למתחם הפינגפונג?";
export const ACTIVITIES_REGISTER_BANNER_TEXT =
  "לו\"ז שיעורים, מחירון והרשמה במקום אחד — כולל כניסה למועדון טניס השולחן (Open Play), חוגי נינג'ה, אימונים קבוצתיים ואימון פונקציונלי.";
export const ACTIVITIES_REGISTER_CALLOUT_TITLE =
  "רישום לחוגים, פעילויות וכניסה למתחם הפינגפונג";
export const ACTIVITIES_REGISTER_CALLOUT_TEXT =
  "הרשמה אחת לכל מה שקורה ב-CHOLE TLV — מועדון הפינגפונג (כניסות ומנוי), חוגים ואימונים קבוצתיים.";
export const ACTIVITIES_REGISTER_PROMO_DESC = "חוגים · מתחם פינגפונג · מחירון";
export const ACTIVITIES_SCHEDULE_HASH = "schedule";
export const ACTIVITIES_PRICING_HASH = "pricing";

export const TABLE_TENNIS_TABLE_COUNT = 6;

export const TABLE_TENNIS_CLUB_NOTICE = {
  title: "חשוב לדעת לפני ההרשמה",
  points: [
    "ההרשמה היא לכניסה למועדון טניס השולחן - לא להשכרת שולחן פרטי.",
    `במתחם ${TABLE_TENNIS_TABLE_COUNT} שולחנות פעילים - כולם משחקים, מתאמנים ונהנים יחד באווירה קהילתית.`,
    "ניתן לשריין משבצת כניסה בכל יום, בין 08:00 ל-22:00, במרווחים של שעתיים.",
  ],
  privateTableLead:
    "צריכים שולחן פרטי לסופ״ש ספציפי, אימון או אירוע? אנחנו מבינים את הצורך ושמחים לעזור.",
  privateTableCta: "שלחו הודעה בוואטסאפ לתיאום השכרת שולחן",
};

export const TABLE_TENNIS_PRIVATE_TABLE_MESSAGE =
  "שלום, אשמח לדבר על השכרת שולחן פרטי במועדון טניס השולחן של CHOLE TLV - אשמח לפרטים, תאריכים ותיאום. תודה!";

export function getTableTennisPrivateTableWhatsAppUrl() {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(TABLE_TENNIS_PRIVATE_TABLE_MESSAGE)}`;
}

const ALL_WEEKDAYS = [0, 1, 2, 3, 4, 5, 6] as const;

const TABLE_TENNIS_ENTRY_WINDOWS: Array<{ start: string; end: string }> = [
  { start: "08:00", end: "10:00" },
  { start: "10:00", end: "12:00" },
  { start: "12:00", end: "14:00" },
  { start: "14:00", end: "16:00" },
  { start: "16:00", end: "18:00" },
  { start: "18:00", end: "20:00" },
  { start: "20:00", end: "22:00" },
];

function buildTableTennisScheduleSlots(): ActivityScheduleSlot[] {
  return TABLE_TENNIS_ENTRY_WINDOWS.map((window) => ({
    id: `tt-club-entry-${window.start.replace(":", "")}`,
    categoryId: "table-tennis" as const,
    title: "כניסה למועדון טניס השולחן",
    day: "כל יום",
    timeStart: window.start,
    timeEnd: window.end,
    scheduleType: "weekly" as const,
    weekdays: [...ALL_WEEKDAYS],
    registrationUrl: ACTIVITIES_EXTERNAL_PAYMENT_URL,
  }));
}

const HEBREW_WEEKDAYS = [
  "יום ראשון",
  "יום שני",
  "יום שלישי",
  "יום רביעי",
  "יום חמישי",
  "יום שישי",
  "יום שבת",
] as const;

type NinjaKidsSlotDef = {
  id: string;
  title: string;
  weekday: number;
  timeStart: string;
  timeEnd: string;
  ageRange: string;
  notes?: string;
};

/** Official CHOLE ninja kids weekly schedule (from venue timetable). */
const NINJA_KIDS_WEEKLY_SCHEDULE: NinjaKidsSlotDef[] = [
  { id: "ninja-7plus-sun", title: "נינג'ה 7+", weekday: 0, timeStart: "15:00", timeEnd: "15:45", ageRange: "7+" },
  { id: "ninja-3-4-sun", title: "נינג'ה 3-4", weekday: 0, timeStart: "16:30", timeEnd: "17:10", ageRange: "3-4" },
  { id: "ninja-4-6-sun", title: "נינג'ה 4-6", weekday: 0, timeStart: "17:15", timeEnd: "18:00", ageRange: "4-6" },
  { id: "ninja-3-4-mon-a", title: "נינג'ה 3-4", weekday: 1, timeStart: "16:00", timeEnd: "16:45", ageRange: "3-4" },
  { id: "ninja-3-4-mon-b", title: "נינג'ה 3-4", weekday: 1, timeStart: "16:45", timeEnd: "17:30", ageRange: "3-4" },
  { id: "ninja-4-6-mon", title: "נינג'ה 4-6", weekday: 1, timeStart: "17:30", timeEnd: "18:15", ageRange: "4-6" },
  { id: "ninja-4-6-tue", title: "נינג'ה 4-6", weekday: 2, timeStart: "16:45", timeEnd: "17:30", ageRange: "4-6" },
  { id: "ninja-3-4-tue", title: "נינג'ה 3-4", weekday: 2, timeStart: "17:30", timeEnd: "18:15", ageRange: "3-4" },
  { id: "ninja-7plus-wed", title: "נינג'ה 7+", weekday: 3, timeStart: "15:30", timeEnd: "16:15", ageRange: "7+" },
  { id: "ninja-3-4-wed", title: "נינג'ה 3-4", weekday: 3, timeStart: "16:30", timeEnd: "17:15", ageRange: "3-4" },
  { id: "ninja-4-6-wed", title: "נינג'ה 4-6", weekday: 3, timeStart: "17:15", timeEnd: "18:00", ageRange: "4-6" },
  { id: "ninja-3-4-thu", title: "נינג'ה 3-4", weekday: 4, timeStart: "16:30", timeEnd: "17:15", ageRange: "3-4" },
  { id: "ninja-4-6-thu", title: "נינג'ה 4-6", weekday: 4, timeStart: "17:15", timeEnd: "18:00", ageRange: "4-6" },
  {
    id: "ninja-friday",
    title: "נינג'ה יום שישי",
    weekday: 5,
    timeStart: "08:30",
    timeEnd: "12:15",
    ageRange: "כל הגילאים",
    notes: "מפגש נינג'ה מורחב ביום שישי.",
  },
];

function buildNinjaKidsScheduleSlots(): ActivityScheduleSlot[] {
  return NINJA_KIDS_WEEKLY_SCHEDULE.map((def) => ({
    id: def.id,
    categoryId: "ninja-kids" as const,
    title: def.title,
    day: HEBREW_WEEKDAYS[def.weekday] ?? "",
    timeStart: def.timeStart,
    timeEnd: def.timeEnd,
    scheduleType: "weekly" as const,
    weekdays: [def.weekday],
    ageRange: def.ageRange,
    notes: def.notes,
    registrationUrl: ACTIVITIES_EXTERNAL_PAYMENT_URL,
  }));
}

type TableTennisTrainingSlotDef = {
  id: string;
  weekday: number;
  timeStart: string;
  timeEnd: string;
};

const TABLE_TENNIS_TRAINING_SCHEDULE: TableTennisTrainingSlotDef[] = [
  { id: "tt-training-sun", weekday: 0, timeStart: "18:15", timeEnd: "19:15" },
  { id: "tt-training-tue", weekday: 2, timeStart: "18:30", timeEnd: "19:30" },
];

function buildTableTennisTrainingSlots(): ActivityScheduleSlot[] {
  return TABLE_TENNIS_TRAINING_SCHEDULE.map((def) => ({
    id: def.id,
    categoryId: "table-tennis-training" as const,
    title: "אימון טניס שולחן",
    day: HEBREW_WEEKDAYS[def.weekday] ?? "",
    timeStart: def.timeStart,
    timeEnd: def.timeEnd,
    scheduleType: "weekly" as const,
    weekdays: [def.weekday],
    level: "כל הרמות",
    registrationUrl: ACTIVITIES_EXTERNAL_PAYMENT_URL,
  }));
}

type TableTennisKidsSlotDef = {
  id: string;
  weekday: number;
  timeStart: string;
  timeEnd: string;
};

const TABLE_TENNIS_KIDS_SCHEDULE: TableTennisKidsSlotDef[] = [
  { id: "tt-kids-tue", weekday: 2, timeStart: "15:30", timeEnd: "16:30" },
  { id: "tt-kids-thu", weekday: 4, timeStart: "15:30", timeEnd: "16:30" },
];

function buildTableTennisKidsSlots(): ActivityScheduleSlot[] {
  return TABLE_TENNIS_KIDS_SCHEDULE.map((def) => ({
    id: def.id,
    categoryId: "table-tennis-kids" as const,
    title: "חוג טניס שולחן לילדים",
    day: HEBREW_WEEKDAYS[def.weekday] ?? "",
    timeStart: def.timeStart,
    timeEnd: def.timeEnd,
    scheduleType: "weekly" as const,
    weekdays: [def.weekday],
    ageRange: TABLE_TENNIS_KIDS_AGE_RANGE,
    notes: "שיעורים אחרי הצהריים — ימי שלישי וחמישי.",
    registrationUrl: ACTIVITIES_EXTERNAL_PAYMENT_URL,
  }));
}

export const ACTIVITIES_CATEGORIES: ActivityCategory[] = [
  {
    id: "table-tennis",
    title: "טניס שולחן / Open Play",
    lead:
      "הרשמה לכניסה למועדון - משבצות של שעתיים בין 08:00 ל-22:00, כל יום. במתחם 6 שולחנות פעילים לכל המשחקים והאימונים.",
    image: tableTennisImg,
    imageAlt: "טניס שולחן במתחם CHOLE TLV",
  },
  {
    id: "table-tennis-kids",
    title: "חוג טניס שולחן לילדים",
    lead: `חוג טניס שולחן לילדים ${TABLE_TENNIS_KIDS_AGE_LABEL} — ימי שלישי וחמישי בשעה 15:30, אחרי הצהריים. מהצעדים הראשונים ועד רמה מתקדמת יותר, באווירה חברתית ומקצועית.`,
    image: tableTennisKidsImg,
    imageAlt: "ילדים בחוג טניס שולחן במתחם CHOLE TLV",
  },
  {
    id: "table-tennis-training",
    title: "אימוני טניס שולחן",
    lead:
      "אימונים קבוצתיים בטניס שולחן - יום ראשון 18:15–19:15 ויום שלישי 18:30–19:30. מתאים לכל הרמות.",
    image: tableTennisImg,
    imageAlt: "אימון טניס שולחן במתחם CHOLE TLV",
  },
  {
    id: "ninja-kids",
    title: "חוגי נינג'ה לילדים",
    lead: NINJA_KIDS_CATEGORY_LEAD,
    image: kidsImg,
    imageAlt: "חוג נינג'ה לילדים במתחם CHOLE TLV",
  },
  {
    id: "functional-adults",
    title: "אימון פונקציונלי לבוגרים",
    lead:
      "אימונים פונקציונליים בקבוצות קטנות של עד 10 מתאמנים — חיזוק, סיבולת ותנועה חכמה באווירה מקצועית ותומכת. מתאים לכל הרמות.",
    image: tableTennisImg,
    imageAlt: "אימון פונקציונלי לבוגרים במתחם CHOLE TLV",
  },
  {
    id: "camps",
    title: "קייטנות וחופשות",
    lead: "קייטנות ספורט בחופשות - שילוב נינג'ה, טניס שולחן ופעילויות קבוצתיות.",
    image: eventsImg,
    imageAlt: "פעילויות קייטנה במתחם CHOLE TLV",
  },
];

export const ACTIVITIES_PRICING: ActivityPricingPlan[] = [
  {
    id: "tt-single-entry",
    categoryId: "table-tennis",
    name: "כניסה חד-פעמית",
    description: "כניסה למועדון למשחק / אימון - משבצת של שעתיים (לא השכרת שולחן פרטי).",
    price: 50,
    priceUnit: "once",
    paymentUrl: ACTIVITIES_EXTERNAL_PAYMENT_URL,
  },
  {
    id: "tt-10-entries",
    categoryId: "table-tennis",
    name: "כרטיסיית 10 כניסות",
    description: "10 כניסות למועדון טניס השולחן - לשימוש גמיש לפי לוח הזמנים.",
    price: 500,
    priceUnit: "card",
    entryCount: 10,
    isPunchCard: true,
    paymentUrl: ACTIVITIES_EXTERNAL_PAYMENT_URL,
  },
  {
    id: "tt-monthly-unlimited",
    categoryId: "table-tennis",
    name: "מנוי חופשי חודשי",
    description: "גישה חופשית למועדון טניס השולחן לאורך החודש.",
    price: 320,
    priceUnit: "month",
    priceNote: "לחודש · הוראת קבע",
    isSubscription: true,
    paymentUrl: ACTIVITIES_EXTERNAL_PAYMENT_URL,
  },
  ...buildAllGroupLessonPricingPlans(),
];

/** Representative schedule - update here or sync from Grow API later. */
export const ACTIVITIES_SCHEDULE: ActivityScheduleSlot[] = [
  ...buildTableTennisScheduleSlots(),
  ...buildTableTennisKidsSlots(),
  ...buildTableTennisTrainingSlots(),
  ...buildNinjaKidsScheduleSlots(),
  {
    id: "functional-adults-tue",
    categoryId: "functional-adults",
    title: "אימון פונקציונלי לבוגרים",
    day: "שלישי",
    timeStart: "20:00",
    timeEnd: "21:00",
    scheduleType: "weekly",
    weekdays: [2],
    level: "כל הרמות",
    groupSize: "עד 10 מתאמנים",
    notes: "קבוצה קטנה, כל הרמות — בואו לחזק, להתאמן ולהרגיש טוב.",
    registrationUrl: ACTIVITIES_EXTERNAL_PAYMENT_URL,
  },
  {
    id: "functional-adults-thu",
    categoryId: "functional-adults",
    title: "אימון פונקציונלי לבוגרים",
    day: "חמישי",
    timeStart: "20:00",
    timeEnd: "21:00",
    scheduleType: "weekly",
    weekdays: [4],
    level: "כל הרמות",
    groupSize: "עד 10 מתאמנים",
    notes: "קבוצה קטנה, כל הרמות — בואו לחזק, להתאמן ולהרגיש טוב.",
    registrationUrl: ACTIVITIES_EXTERNAL_PAYMENT_URL,
  },
  {
    id: "camps-summer",
    categoryId: "camps",
    title: "קייטנת חופש גדול",
    day: "יולי - אוגוסט",
    timeStart: "08:30",
    timeEnd: "13:00",
    scheduleType: "seasonal",
    weekdays: [],
    ageRange: "5-12",
    notes: "תאריכים מדויקים ומחירים - בפרסום לפני כל חופשה. הרשמה מוקדמת מומלצת.",
    registrationUrl: ACTIVITIES_EXTERNAL_PAYMENT_URL,
  },
  {
    id: "camps-passover",
    categoryId: "camps",
    title: "קייטנת חופשת פסח",
    day: "חופשת פסח",
    timeStart: "08:30",
    timeEnd: "13:00",
    scheduleType: "seasonal",
    weekdays: [],
    ageRange: "5-12",
    notes: "לוח זמנים ומחירים יפורסמו לפני החופשה.",
    registrationUrl: ACTIVITIES_EXTERNAL_PAYMENT_URL,
  },
];

export const ACTIVITIES_WHATSAPP_MESSAGE =
  "שלום, הגעתי מעמוד הרישום באתר CHOLE - אשמח לפרטים על הרשמה לחוגים / פעילויות במתחם CHOLE TLV.";

export function getActivitiesWhatsAppUrl() {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(ACTIVITIES_WHATSAPP_MESSAGE)}`;
}

export const ACTIVITIES_VENUE = {
  name: "מתחם CHOLE TLV",
  address: COMPANY.address,
  phone: COMPANY.phone,
};
