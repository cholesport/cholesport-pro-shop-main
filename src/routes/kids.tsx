import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SiteAreaHubPage } from "@/components/site/SiteAreaHubPage";
import { KIDS_HUB, KIDS_HUB_HEADLINE } from "@/data/siteGateway";
import { buildPageSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/kids")({
  head: () => {
    const seo = buildPageSeoHead({
      title: `${KIDS_HUB_HEADLINE} | CHOLE sport`,
      description: KIDS_HUB.support,
      path: "/kids",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: KidsRoute,
});

function KidsRoute() {
  return (
    <div className="min-h-screen bg-background">
      <Header variant="minimal" />
      <main id="main-content">
        <SiteAreaHubPage hub={KIDS_HUB} />
      </main>
      <Footer />
    </div>
  );
}
