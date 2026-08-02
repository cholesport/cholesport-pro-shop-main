import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ResetPasswordPage } from "@/components/site/ResetPasswordPage";
import { buildPageSeoHead } from "@/lib/seo";

const resetSearchSchema = z.object({
  token: z.string().optional(),
});

export const Route = createFileRoute("/account/reset-password")({
  validateSearch: resetSearchSchema,
  head: () => {
    const seo = buildPageSeoHead({
      title: "איפוס סיסמה | CHOLE sport",
      description: "בחירת סיסמה חדשה לחשבון CHOLE sport.",
      path: "/account/reset-password",
      noIndex: true,
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: ResetPasswordRoute,
});

function ResetPasswordRoute() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
        <ResetPasswordPage />
      </main>
      <Footer />
    </div>
  );
}
