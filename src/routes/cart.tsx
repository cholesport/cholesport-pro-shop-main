import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CartPage } from "@/components/site/CartPage";
import { buildPageSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/cart")({
  head: () => {
    const seo = buildPageSeoHead({
      title: "עגלת קניות — CHOLE sport",
      description: "עגלת הקניות שלכם ב-CHOLE sport.",
      path: "/cart",
      noIndex: true,
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: CartRoute,
});

function CartRoute() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
        <CartPage />
      </main>
      <Footer />
    </div>
  );
}
