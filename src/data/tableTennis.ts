import type { ActivityCategoryId } from "@/data/activities";

export const TABLE_TENNIS_SCHEDULE_SECTION_ID = "schedule";
export const TABLE_TENNIS_PRICING_SECTION_ID = "pricing";

export const TABLE_TENNIS_KIDS_AGE_MIN = 8;
export const TABLE_TENNIS_KIDS_AGE_MAX = 14;
export const TABLE_TENNIS_KIDS_AGE_RANGE = `${TABLE_TENNIS_KIDS_AGE_MIN}–${TABLE_TENNIS_KIDS_AGE_MAX}`;
export const TABLE_TENNIS_KIDS_AGE_LABEL = `גילאי ${TABLE_TENNIS_KIDS_AGE_RANGE}`;

export const TABLE_TENNIS_SCHEDULE_CATEGORY_IDS = [
  "table-tennis",
  "table-tennis-kids",
  "table-tennis-training",
] as const satisfies readonly ActivityCategoryId[];

export type TableTennisPricingPathId = "club-entry" | "lessons";

export const TABLE_TENNIS_PRICING_INTRO =
  "חדשים אצלנו? יש שני סוגי הרשמה שונים — בחרו מה שמתאים לכם:";

export const TABLE_TENNIS_PRICING_PATHS = [
  {
    id: "club-entry" as const,
    title: "כניסה למועדון",
    tagline: "באים לשחק בחופשיות",
    whoIsItFor: "רוצים להגיע, לשחק וליהנות — בלי חוג קבוע.",
    details: [
      "שוריינו משבצת של שעתיים (08:00–22:00, כל יום)",
      "מתאים למשחק עם חברים, אימון עצמאי או פשוט כיף",
      "לא כולל השכרת שולחן פרטי לאירוע",
    ],
  },
  {
    id: "lessons" as const,
    title: "שיעורים ואימונים",
    tagline: "חוג קבוע עם מדריך",
    whoIsItFor: "רוצים להירשם לחוג או אימון קבוצתי קבוע — עם מדריך וקבוצה קבועה.",
    details: [
      "חוג ילדים (גילאי 8–14) — ימי שלישי וחמישי",
      "אימונים קבוצתיים לבוגרים ונוער — כל הרמות",
      "אותם מחירים לכל סוגי השיעורים",
    ],
  },
] as const;

export const TABLE_TENNIS_LESSON_PROGRAMS = [
  {
    id: "table-tennis-kids" as const,
    tabLabel: "חוג ילדים",
    scheduleHint: "ימי ג׳ וה׳ · 15:30–16:30",
    audience: "גילאי 8–14",
  },
  {
    id: "table-tennis-training" as const,
    tabLabel: "אימונים קבוצתיים",
    scheduleHint: "יום א׳ 18:15 · יום ג׳ 18:30",
    audience: "בוגרים ונוער · כל הרמות",
  },
] as const;
