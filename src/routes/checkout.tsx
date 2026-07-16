import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CheckoutPage } from "@/components/site/CheckoutPage";
import { buildPageSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/checkout")({
  head: () => {
    const seo = buildPageSeoHead({
      title: "השלמת רכישה — CHOLE sport",
      description: "השלימו את הרכישה שלכם ב-CHOLE sport.",
      path: "/checkout",
      noIndex: true,
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: CheckoutRoute,
});

function CheckoutRoute() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
        <CheckoutPage />
      </main>
      <Footer />
    </div>
  );
}
