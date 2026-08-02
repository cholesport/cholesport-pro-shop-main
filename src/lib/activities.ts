import {
  ACTIVITIES_CATEGORIES,
  ACTIVITIES_PRICING,
  ACTIVITIES_SCHEDULE,
  type ActivityCategory,
  type ActivityCategoryId,
  type ActivityPriceUnit,
  type ActivityPricingPlan,
  type ActivityScheduleSlot,
} from "@/data/activities";
import {
  GROUP_LESSON_PRICING_SECTION_ID,
  isGroupLessonCategory,
} from "@/data/groupLessonPricing";

export function formatActivityPrice(price: number) {
  return price.toLocaleString("he-IL");
}

const PRICE_UNIT_LABELS: Record<ActivityPriceUnit, string> = {
  once: "לכניסה",
  month: "לחודש",
  card: "לכרטיסייה",
  trial: "לשיעור ניסיון",
};

export function getActivityPriceLabel(plan: ActivityPricingPlan) {
  if (plan.priceNote) return plan.priceNote;
  return PRICE_UNIT_LABELS[plan.priceUnit];
}

export function getActivityCategoryById(id: ActivityCategoryId): ActivityCategory | undefined {
  return ACTIVITIES_CATEGORIES.find((c) => c.id === id);
}

export function getPricingByCategory(categoryId: ActivityCategoryId): ActivityPricingPlan[] {
  return ACTIVITIES_PRICING.filter((p) => p.categoryId === categoryId);
}

export function getScheduleByCategory(categoryId: ActivityCategoryId): ActivityScheduleSlot[] {
  return ACTIVITIES_SCHEDULE.filter((s) => s.categoryId === categoryId);
}

export function getPricingCategoriesWithPlans(): ActivityCategoryId[] {
  const ids = new Set(ACTIVITIES_PRICING.map((p) => p.categoryId));
  return ACTIVITIES_CATEGORIES.map((c) => c.id).filter((id) => ids.has(id));
}

export function getActivityPlanById(planId: string) {
  return ACTIVITIES_PRICING.find((plan) => plan.id === planId);
}

export function isPunchCardPlan(plan: ActivityPricingPlan) {
  return Boolean(plan.isPunchCard || plan.priceUnit === "card");
}

export function getPunchCardPlans() {
  return ACTIVITIES_PRICING.filter(isPunchCardPlan);
}

export function getScheduleCategoriesWithSlots(): ActivityCategoryId[] {
  const ids = new Set(ACTIVITIES_SCHEDULE.map((s) => s.categoryId));
  return ACTIVITIES_CATEGORIES.map((c) => c.id).filter((id) => ids.has(id));
}

/** Anchor id for in-page pricing section per activity category. */
export function getActivityPricingSectionId(categoryId: ActivityCategoryId): string {
  if (isGroupLessonCategory(categoryId)) {
    return GROUP_LESSON_PRICING_SECTION_ID;
  }
  return `pricing-${categoryId}`;
}

export function getActivityPricingHref(categoryId: ActivityCategoryId): string {
  return `#${getActivityPricingSectionId(categoryId)}`;
}
