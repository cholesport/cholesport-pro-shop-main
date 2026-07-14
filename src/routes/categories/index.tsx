import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CategoriesIndexPage } from "@/components/site/CategoriesIndexPage";
import {
  CATEGORIES_PAGE_SEO_DESCRIPTION,
  CATEGORIES_PAGE_TITLE,
} from "@/data/categories";

export const Route = createFileRoute("/categories/")({
  head: () => ({
    meta: [
      { title: `${CATEGORIES_PAGE_TITLE} — CHOLE sport` },
      { name: "description", content: CATEGORIES_PAGE_SEO_DESCRIPTION },
    ],
  }),
  component: CategoriesIndexRoute,
});

function CategoriesIndexRoute() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
        <CategoriesIndexPage />
      </main>
      <Footer />
    </div>
  );
}
