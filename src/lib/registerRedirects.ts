import type { ActivityCategoryId } from "@/data/activities";
import { KIDS_CAMPS_SECTION_ID } from "@/data/camps";
import { KIDS_SCHEDULE_SECTION_ID } from "@/data/kids";
import { FUNCTIONAL_SCHEDULE_SECTION_ID } from "@/data/functional";
import { TABLE_TENNIS_SCHEDULE_SECTION_ID, TABLE_TENNIS_PRICING_SECTION_ID } from "@/data/tableTennis";

const FOCUS_PATHS: Record<ActivityCategoryId, string> = {
  "table-tennis": "/table-tennis",
  "table-tennis-kids": "/table-tennis",
  "table-tennis-training": "/table-tennis",
  "ninja-kids": "/kids",
  "functional-adults": "/functional",
  camps: "/kids",
};

const FOCUS_DEFAULT_HASH: Partial<Record<ActivityCategoryId, string>> = {
  camps: KIDS_CAMPS_SECTION_ID,
};

const PRICING_HASHES = new Set([
  "pricing",
  TABLE_TENNIS_PRICING_SECTION_ID,
  "pricing-group-lessons",
]);

export function resolveRegisterRedirect(
  focus?: ActivityCategoryId,
  hash?: string,
): { to: string; hash?: string } {
  if (!focus) {
    return { to: "/" };
  }

  const to = FOCUS_PATHS[focus];
  if (!hash) {
    return { to, hash: FOCUS_DEFAULT_HASH[focus] ?? getDefaultScheduleHash(focus) };
  }

  if (hash === "schedule" || hash.startsWith("pricing")) {
    return { to, hash: normalizePricingHash(focus, hash) };
  }

  return { to, hash };
}

function getDefaultScheduleHash(focus: ActivityCategoryId): string {
  if (focus === "ninja-kids") return KIDS_SCHEDULE_SECTION_ID;
  if (focus === "functional-adults") return FUNCTIONAL_SCHEDULE_SECTION_ID;
  return TABLE_TENNIS_SCHEDULE_SECTION_ID;
}

function normalizePricingHash(focus: ActivityCategoryId, hash: string): string {
  if (hash === "schedule") {
    return getDefaultScheduleHash(focus);
  }

  if (!PRICING_HASHES.has(hash) && !hash.startsWith("pricing-")) {
    return hash;
  }

  if (focus === "ninja-kids") return "pricing";
  if (focus === "functional-adults") return FUNCTIONAL_PRICING_SECTION_ID;
  return TABLE_TENNIS_PRICING_SECTION_ID;
}
