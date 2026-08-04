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
