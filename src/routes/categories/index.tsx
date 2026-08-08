import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CategoriesIndexPage } from "@/components/site/CategoriesIndexPage";
import {
  CATEGORIES_PAGE_SEO_DESCRIPTION,
  CATEGORIES_PAGE_TITLE,
} from "@/data/categories";
import { buildPageSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/categories/")({
  head: () => {
    const seo = buildPageSeoHead({
      title: `${CATEGORIES_PAGE_TITLE} - CHOLE sport | cholesport.co.il`,
      description: CATEGORIES_PAGE_SEO_DESCRIPTION,
      path: "/categories",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: CategoriesIndexRoute,
});

function CategoriesIndexRoute() {
  return (
    <div className="min-h-screen bg-background max-md:flex max-md:min-h-dvh max-md:flex-col max-md:overflow-hidden">
      <Header variant="shop" />
      <main id="main-content" className="max-md:flex max-md:min-h-0 max-md:flex-1 max-md:flex-col">
        <CategoriesIndexPage />
      </main>
      <div className="max-md:hidden">
        <Footer variant="shop" />
      </div>
    </div>
  );
}
