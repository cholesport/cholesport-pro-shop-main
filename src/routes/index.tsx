import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Categories } from "@/components/site/Categories";
import { Promo } from "@/components/site/Promo";
import { Products } from "@/components/site/Products";
import { BrandsSection } from "@/components/site/BrandLogos";
import { Footer } from "@/components/site/Footer";
import { BRAND_HERO_HEADLINE, BRAND_NAME, BRAND_SEO_DESCRIPTION } from "@/data/brand";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${BRAND_NAME} — ${BRAND_HERO_HEADLINE}` },
      { name: "description", content: BRAND_SEO_DESCRIPTION },
      { property: "og:title", content: `${BRAND_NAME} — ${BRAND_HERO_HEADLINE}` },
      { property: "og:description", content: BRAND_SEO_DESCRIPTION },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
        <Hero />
        <Products />
        <BrandsSection />
        <Promo />
        <Categories />
      </main>
      <Footer />
    </div>
  );
}
