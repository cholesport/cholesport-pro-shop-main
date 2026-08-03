import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AccountPage } from "@/components/site/AccountPage";
import { buildPageSeoHead } from "@/lib/seo";

const accountSearchSchema = z.object({
  section: z.enum(["overview", "orders", "profile", "addresses", "passes"]).optional(),
});

export const Route = createFileRoute("/account")({
  validateSearch: accountSearchSchema,
  head: () => {
    const seo = buildPageSeoHead({
      title: "החשבון שלי - CHOLE sport",
      description:
        "התחברו לחשבון CHOLE sport לצפייה בהזמנות, ניהול כתובות ועדכון פרטים אישיים.",
      path: "/account",
      noIndex: true,
    });
    return { meta: seo.meta, links: seo.links };
  },
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
