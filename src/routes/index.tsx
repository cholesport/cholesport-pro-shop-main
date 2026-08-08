import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { SiteGateway } from "@/components/site/SiteGateway";
import { Footer } from "@/components/site/Footer";
import { BRAND_NAME } from "@/data/brand";
import { SITE_HOST, SITE_SEO_DESCRIPTION } from "@/data/site";
import { SITE_GATEWAY_HEADLINE } from "@/data/siteGateway";
import { buildPageSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => {
    const title = `${BRAND_NAME} | ${SITE_HOST} - ${SITE_GATEWAY_HEADLINE}`;
    const seo = buildPageSeoHead({
      title,
      description: SITE_SEO_DESCRIPTION,
      path: "/",
    });
    return {
      meta: seo.meta,
      links: seo.links,
    };
  },
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background max-md:flex max-md:min-h-dvh max-md:flex-col max-md:overflow-hidden">
      <Header variant="minimal" />
      <main id="main-content" className="max-md:flex max-md:min-h-0 max-md:flex-1">
        <SiteGateway />
      </main>
      <div className="max-md:hidden">
        <Footer />
      </div>
    </div>
  );
}
