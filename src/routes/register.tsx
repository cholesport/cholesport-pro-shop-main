import { createFileRoute, redirect } from "@tanstack/react-router";
import type { ActivityCategoryId } from "@/data/activities";
import { resolveRegisterRedirect } from "@/lib/registerRedirects";

const FOCUS_CATEGORIES: ActivityCategoryId[] = [
  "table-tennis",
  "table-tennis-kids",
  "table-tennis-training",
  "ninja-kids",
  "functional-adults",
  "camps",
];

export const Route = createFileRoute("/register")({
  validateSearch: (search: Record<string, unknown>) => ({
    focus:
      typeof search.focus === "string" &&
      FOCUS_CATEGORIES.includes(search.focus as ActivityCategoryId)
        ? (search.focus as ActivityCategoryId)
        : undefined,
  }),
  beforeLoad: ({ search, location }) => {
    const hash = location.hash.replace(/^#/, "") || undefined;
    const target = resolveRegisterRedirect(search.focus, hash);
    throw redirect({
      to: target.to,
      hash: target.hash,
      replace: true,
    });
  },
  component: RegisterRoute,
});

function RegisterRoute() {
  return null;
}
