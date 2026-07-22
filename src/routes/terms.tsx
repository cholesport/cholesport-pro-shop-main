import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { LegalDocument } from "@/components/site/LegalDocument";
import { TERMS_SECTIONS, COMPANY } from "@/data/legal";
import { buildPageSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () => {
    const seo = buildPageSeoHead({
      title: `תנאי שימוש - ${COMPANY.name}`,
      description:
        "תנאי השימוש של CHOLE sport - רכישות מקוונות, משלוחים, החזרות, אחריות ודין ישראלי.",
      path: "/terms",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: TermsRoute,
});

function TermsRoute() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
        <LegalDocument
          title="תנאי שימוש"
          subtitle={`ברוכים הבאים ל-${COMPANY.name}. השימוש באתר ובשירותינו כפוף לתנאים המפורטים להלן.`}
          sections={TERMS_SECTIONS}
          relatedLink={{ label: "מדיניות פרטיות", to: "/privacy" }}
        />
      </main>
      <Footer />
    </div>
  );
}
