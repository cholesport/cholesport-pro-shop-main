import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ActivitiesPage } from "@/components/site/ActivitiesPage";
import {
  ACTIVITIES_PATH,
  ACTIVITIES_SEO_DESCRIPTION,
  ACTIVITIES_SEO_TITLE,
} from "@/data/activities";
import { buildPageSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/register")({
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
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
        <ActivitiesPage />
      </main>
      <Footer />
    </div>
  );
}
