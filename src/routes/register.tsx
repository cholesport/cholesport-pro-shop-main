import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ActivitiesPage } from "@/components/site/ActivitiesPage";
import {
  ACTIVITIES_PATH,
  ACTIVITIES_SEO_DESCRIPTION,
  ACTIVITIES_SEO_TITLE,
  type ActivityCategoryId,
} from "@/data/activities";
import { buildPageSeoHead } from "@/lib/seo";

const FOCUS_CATEGORIES: ActivityCategoryId[] = [
  "table-tennis",
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
  head: () => {
    const seo = buildPageSeoHead({
      title: ACTIVITIES_SEO_TITLE,
      description: ACTIVITIES_SEO_DESCRIPTION,
      path: ACTIVITIES_PATH,
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: RegisterRoute,
});

function RegisterRoute() {
  const { focus } = Route.useSearch();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
        <ActivitiesPage initialScheduleCategory={focus} />
      </main>
      <Footer />
    </div>
  );
}
