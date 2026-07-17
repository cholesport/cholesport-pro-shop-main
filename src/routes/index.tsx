import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { ClubTeaser } from "@/components/site/ClubTeaser";
import { Categories } from "@/components/site/Categories";
import { Promo } from "@/components/site/Promo";
import { Products } from "@/components/site/Products";
import { BrandsSection } from "@/components/site/BrandLogos";
import { Footer } from "@/components/site/Footer";
import { BRAND_HERO_HEADLINE, BRAND_NAME } from "@/data/brand";
import { SITE_HOST, SITE_SEO_DESCRIPTION } from "@/data/site";
import { buildPageSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => {
    const title = `${BRAND_NAME} | ${SITE_HOST} — ${BRAND_HERO_HEADLINE}`;
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
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
        <Hero />
        <ClubTeaser />
        <Products />
        <BrandsSection />
        <Promo />
        <Categories />
      </main>
      <Footer />
    </div>
  );
}
