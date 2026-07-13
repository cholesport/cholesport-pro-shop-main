import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AccountPage } from "@/components/site/AccountPage";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "החשבון שלי — CHOLE sport" },
      { name: "description", content: "התחברו לחשבון CHOLE sport לצפייה בהזמנות, ניהול כתובות ועדכון פרטים אישיים." },
    ],
  }),
  component: AccountRoute,
});

function AccountRoute() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
        <AccountPage />
      </main>
      <Footer />
    </div>
  );
}
