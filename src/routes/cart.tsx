import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CartPage } from "@/components/site/CartPage";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "עגלת קניות — CHOLE sport" },
      { name: "description", content: "עגלת הקניות שלכם ב-CHOLE sport." },
    ],
  }),
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
