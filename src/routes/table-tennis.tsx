import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SiteAreaHubPage } from "@/components/site/SiteAreaHubPage";
import { TABLE_TENNIS_HUB } from "@/data/siteGateway";
import { buildPageSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/table-tennis")({
  head: () => {
    const seo = buildPageSeoHead({
      title: "טניס שולחן | CHOLE sport",
      description: TABLE_TENNIS_HUB.support,
      path: "/table-tennis",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: TableTennisRoute,
});

function TableTennisRoute() {
  return (
    <div className="min-h-screen bg-background">
      <Header variant="minimal" />
      <main id="main-content">
        <SiteAreaHubPage hub={TABLE_TENNIS_HUB} />
      </main>
      <Footer />
    </div>
  );
}
