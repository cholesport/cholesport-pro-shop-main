import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FunctionalAreaHubPage } from "@/components/site/FunctionalAreaHubPage";
import { FUNCTIONAL_HUB_HEADLINE, FUNCTIONAL_HUB_SUPPORT } from "@/data/functional";
import { buildPageSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/functional")({
  head: () => {
    const seo = buildPageSeoHead({
      title: `${FUNCTIONAL_HUB_HEADLINE} | CHOLE sport`,
      description: FUNCTIONAL_HUB_SUPPORT,
      path: "/functional",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: FunctionalRoute,
});

function FunctionalRoute() {
  return (
    <div className="min-h-screen bg-background">
      <Header variant="minimal" />
      <main id="main-content">
        <FunctionalAreaHubPage />
      </main>
      <Footer />
    </div>
  );
}
