import {
  ACTIVITIES_EXTERNAL_PAYMENT_URL,
  type ActivityCategoryId,
  type ActivityPricingPlan,
} from "@/data/activities";

/** Categories that share the same group-lesson pricing tier. */
export const GROUP_LESSON_CATEGORY_IDS = [
  "ninja-kids",
  "table-tennis-kids",
  "table-tennis-training",
  "functional-adults",
] as const satisfies readonly ActivityCategoryId[];

export type GroupLessonCategoryId = (typeof GROUP_LESSON_CATEGORY_IDS)[number];

export const GROUP_LESSON_PRICING_SECTION_ID = "pricing-group-lessons";

export const GROUP_LESSON_PRICING_SUMMARY = [
  { label: "שיעור ניסיון", price: 65, note: "לשיעור" },
  { label: "מנוי פעם בשבוע", price: 270, note: "לחודש · הוראת קבע" },
  { label: "מנוי פעמיים בשבוע", price: 425, note: "לחודש · הוראת קבע" },
  { label: "כרטיסייה 8 שיעורים", price: 600, note: "לכרטיסייה" },
] as const;

type GroupLessonPlanCopy = {
  trialDescription: string;
  weeklyOnceDescription: string;
  weeklyTwiceDescription: string;
  cardDescription: string;
  cardName: string;
};

const GROUP_LESSON_COPY: Record<GroupLessonCategoryId, GroupLessonPlanCopy> = {
  "ninja-kids": {
    trialDescription: "שיעור ניסיון ראשון בחוג הנינג'ה לילדים.",
    weeklyOnceDescription: "שיעור קבוע אחד בשבוע בחוג הנינג'ה לילדים.",
    weeklyTwiceDescription: "שני שיעורים קבועים בשבוע בחוג הנינג'ה לילדים.",
    cardName: "כרטיסייה של 8 שיעורים",
    cardDescription: "8 שיעורים בחוג הנינג'ה לילדים — לשימוש גמיש לפי לוח הזמנים.",
  },
  "table-tennis-kids": {
    trialDescription: "שיעור ניסיון ראשון בחוג טניס השולחן לילדים.",
    weeklyOnceDescription: "שיעור קבוע אחד בשבוע בחוג טניס שולחן לילדים.",
    weeklyTwiceDescription: "שני שיעורים קבועים בשבוע בחוג טניס שולחן לילדים.",
    cardName: "כרטיסייה של 8 שיעורים",
    cardDescription: "8 שיעורי טניס שולחן לילדים — לשימוש גמיש לפי לוח הזמנים.",
  },
  "table-tennis-training": {
    trialDescription: "שיעור ניסיון ראשון באימון טניס השולחן הקבוצתי.",
    weeklyOnceDescription: "אימון קבוע אחד בשבוע בטניס שולחן — מתאים לכל הרמות.",
    weeklyTwiceDescription: "שני אימונים קבועים בשבוע בטניס שולחן — התקדמות מהירה יותר.",
    cardName: "כרטיסייה של 8 אימונים",
    cardDescription: "8 אימוני טניס שולחן — לשימוש גמיש לפי לוח הזמנים.",
  },
  "functional-adults": {
    trialDescription: "שיעור ניסיון ראשון באימון הפונקציונלי לבוגרים.",
    weeklyOnceDescription: "אימון קבוע אחד בשבוע — קבוצה קטנה וליווי אישי.",
    weeklyTwiceDescription: "שני אימונים קבועים בשבוע — התקדמות מהירה יותר בכושר ובתנועה.",
    cardName: "כרטיסייה של 8 אימונים",
    cardDescription: "8 אימונים פונקציונליים — לשימוש גמיש לפי לוח הזמנים.",
  },
};

const PLAN_PREFIX: Record<GroupLessonCategoryId, string> = {
  "ninja-kids": "ninja",
  "table-tennis-kids": "tt-kids",
  "table-tennis-training": "tt-training",
  "functional-adults": "functional",
};

export function isGroupLessonCategory(
  categoryId: ActivityCategoryId,
): categoryId is GroupLessonCategoryId {
  return (GROUP_LESSON_CATEGORY_IDS as readonly ActivityCategoryId[]).includes(categoryId);
}

export function buildGroupLessonPricingPlans(
  categoryId: GroupLessonCategoryId,
): ActivityPricingPlan[] {
  const copy = GROUP_LESSON_COPY[categoryId];
  const prefix = PLAN_PREFIX[categoryId];
  const paymentUrl = ACTIVITIES_EXTERNAL_PAYMENT_URL;

  return [
    {
      id: `${prefix}-trial`,
      categoryId,
      name: "שיעור ניסיון",
      description: copy.trialDescription,
      price: 65,
      priceUnit: "trial",
      paymentUrl,
    },
    {
      id: `${prefix}-weekly-once`,
      categoryId,
      name: "מנוי פעם בשבוע",
      description: copy.weeklyOnceDescription,
      price: 270,
      priceUnit: "month",
      priceNote: "לחודש · הוראת קבע",
      isSubscription: true,
      paymentUrl,
    },
    {
      id: `${prefix}-weekly-twice`,
      categoryId,
      name: "מנוי פעמיים בשבוע",
      description: copy.weeklyTwiceDescription,
      price: 425,
      priceUnit: "month",
      priceNote: "לחודש · הוראת קבע",
      isSubscription: true,
      paymentUrl,
    },
    {
      id: `${prefix}-8-lessons`,
      categoryId,
      name: copy.cardName,
      description: copy.cardDescription,
      price: 600,
      priceUnit: "card",
      entryCount: 8,
      isPunchCard: true,
      paymentUrl,
    },
  ];
}

export function buildAllGroupLessonPricingPlans(): ActivityPricingPlan[] {
  return GROUP_LESSON_CATEGORY_IDS.flatMap((categoryId) =>
    buildGroupLessonPricingPlans(categoryId),
  );
}

/** Generic plans for the unified pricing UI (same prices, shared copy). */
export function buildUnifiedGroupLessonDisplayPlans(): ActivityPricingPlan[] {
  const paymentUrl = ACTIVITIES_EXTERNAL_PAYMENT_URL;

  return [
    {
      id: "group-lesson-trial",
      categoryId: "ninja-kids",
      name: "שיעור ניסיון",
      description:
        "שיעור ניסיון בחוג או אימון קבוצתי — נינג'ה לילדים, אימוני טניס שולחן או אימון פונקציונלי לבוגרים.",
      price: 65,
      priceUnit: "trial",
      paymentUrl,
    },
    {
      id: "group-lesson-weekly-once",
      categoryId: "ninja-kids",
      name: "מנוי פעם בשבוע",
      description: "שיעור או אימון קבוע אחד בשבוע — בכל החוגים והאימונים הקבוצתיים.",
      price: 270,
      priceUnit: "month",
      priceNote: "לחודש · הוראת קבע",
      isSubscription: true,
      paymentUrl,
    },
    {
      id: "group-lesson-weekly-twice",
      categoryId: "ninja-kids",
      name: "מנוי פעמיים בשבוע",
      description: "שני שיעורים או אימונים קבועים בשבוע — התקדמות מהירה יותר.",
      price: 425,
      priceUnit: "month",
      priceNote: "לחודש · הוראת קבע",
      isSubscription: true,
      paymentUrl,
    },
    {
      id: "group-lesson-8-lessons",
      categoryId: "ninja-kids",
      name: "כרטיסייה של 8 שיעורים",
      description: "8 שיעורים או אימונים — לשימוש גמיש לפי לוח הזמנים, בכל החוגים הקבוצתיים.",
      price: 600,
      priceUnit: "card",
      entryCount: 8,
      isPunchCard: true,
      paymentUrl,
    },
  ];
}
