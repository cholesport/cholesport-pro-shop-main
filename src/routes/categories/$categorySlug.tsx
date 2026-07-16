import { createFileRoute, notFound } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CategoryPage } from "@/components/site/CategoryPage";
import { getCategoryBySlug } from "@/data/categories";
import { getProductsForCategory } from "@/lib/categories";
import { buildPageSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/categories/$categorySlug")({
  loader: ({ params }) => {
    const category = getCategoryBySlug(params.categorySlug);
    if (!category) throw notFound();
    return { category, products: getProductsForCategory(category) };
  },
  head: ({ loaderData }) => {
    const seo = buildPageSeoHead({
      title: `${loaderData.category.name} — CHOLE sport | cholesport.co.il`,
      description:
        loaderData.category.description ||
        `קנו ${loaderData.category.name} ב-CHOLE sport (cholesport.co.il).`,
      path: `/categories/${loaderData.category.slug}`,
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: CategoryRoute,
});

function CategoryRoute() {
  const { category, products } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
        <CategoryPage category={category} products={products} />
      </main>
      <Footer />
    </div>
  );
}
