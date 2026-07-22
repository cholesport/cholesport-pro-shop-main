import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AboutPage } from "@/components/site/AboutPage";
import {
  ABOUT_PATH,
  ABOUT_SEO_DESCRIPTION,
  ABOUT_SEO_TITLE,
} from "@/data/about";
import { buildPageSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => {
    const seo = buildPageSeoHead({
      title: ABOUT_SEO_TITLE,
      description: ABOUT_SEO_DESCRIPTION,
      path: ABOUT_PATH,
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: AboutRoute,
});

function AboutRoute() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
        <AboutPage />
      </main>
      <Footer />
    </div>
  );
}
