import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CheckoutPage } from "@/components/site/CheckoutPage";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "השלמת רכישה — CHOLE sport" },
      { name: "description", content: "השלימו את הרכישה שלכם ב-CHOLE sport." },
    ],
  }),
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
