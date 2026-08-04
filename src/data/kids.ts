export const KIDS_SCHEDULE_SECTION_ID = "schedule";
export const KIDS_PRICING_SECTION_ID = "pricing";

export const KIDS_FIRST_TIME_INFO_LABEL = "כל הפרטים החשובים לפעם הראשונה";
export const KIDS_FIRST_TIME_SECTION_ID = "first-time";

export const NINJA_KIDS_AGE_MIN = 3;
export const NINJA_KIDS_AGE_MAX = 12;
export const NINJA_KIDS_AGE_RANGE = `${NINJA_KIDS_AGE_MIN}–${NINJA_KIDS_AGE_MAX}`;
export const NINJA_KIDS_AGE_FROM_LABEL = `מגיל ${NINJA_KIDS_AGE_RANGE}`;
export const NINJA_KIDS_AGE_GROUPS_LABEL = `גילאי ${NINJA_KIDS_AGE_RANGE}`;
export const NINJA_KIDS_AGE_UP_TO_LABEL = `מגיל ${NINJA_KIDS_AGE_MIN} עד ${NINJA_KIDS_AGE_MAX}`;

export type KidsFirstTimeTopic = {
  id: string;
  title: string;
  paragraphs: string[];
};

export const KIDS_FIRST_TIME_TOPICS: KidsFirstTimeTopic[] = [
  {
    id: "access",
    title: "נגישות והגעה",
    paragraphs: [
      "מומלץ להגיע עם אופניים או עגלות — זו הדרך הכי פשוטה והנגישה למתחם.",
      "אם מגיעים ברכב, יש איפה לעמוד, אבל זה פשוט יותר מורכב.",
    ],
  },
  {
    id: "what-to-bring",
    title: "מה להביא לשיעור",
    paragraphs: [
      "חשוב מאוד שהילדים יביאו בקבוק מים ובגדים נוחים.",
      "השיעורים מתקיימים ללא נעליים. עדיף גם בלי גרביים, כדי שלא יחליקו.",
    ],
  },
  {
    id: "ages-and-confidence",
    title: "גיל והתפתחות",
    paragraphs: [
      `השיעורים מתחילים מגיל ${NINJA_KIDS_AGE_MIN}. לילדים יש רמות ביטחון עצמי שונות — חלקם עם יותר ביטחון וחלקם עם פחות.`,
      "חשוב מאוד שההורים יבינו שעבור חלק מהילדים ההתפתחות וההיפתחות זה תהליך, ולוקח זמן עד שהם מרגישים בנוח.",
    ],
  },
  {
    id: "parents-presence",
    title: "נוכחות הורים בשיעור",
    paragraphs: [
      "יש ילדים שצריכים את ההורים איתם, ואנחנו מאפשרים את זה כדי שיוכלו להרגיש בנוח ולהיפתח לאט לאט.",
      "לילדים שמרגישים כבר בנוח אנחנו ממליצים שההורים ישחררו ויתנו להם לעשות את השיעור לבד.",
    ],
  },
  {
    id: "parents-area",
    title: "לאזור ההורים",
    paragraphs: [
      "יש פינת ישיבה להורים עם מקרר שתייה.",
      "יש לנו תמי 4 למילוי מים.",
    ],
  },
];

export const NINJA_KIDS_HUB_SUPPORT =
  `חוגי נינג'ה ואקרובטיקה לילדים ונוער ${NINJA_KIDS_AGE_FROM_LABEL}, בליווי מדריכים מקצועיים.`;

export const NINJA_KIDS_CATEGORY_LEAD =
  `חוגי נינג'ה לילדים ${NINJA_KIDS_AGE_FROM_LABEL} שאוהבים לקפוץ, לרוץ ולהתגלגל — מסלולי נינג'ה ואקרובטיקה עם אתגרים מותאמים. קבוצות לפי גיל: 3–4, 4–6 ו-7+.`;
