import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { LegalDocument } from "@/components/site/LegalDocument";
import { TERMS_SECTIONS, COMPANY } from "@/data/legal";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: `תנאי שימוש — ${COMPANY.name}` },
      {
        name: "description",
        content: "תנאי השימוש של CHOLE sport — רכישות מקוונות, משלוחים, החזרות, אחריות ודין ישראלי.",
      },
    ],
  }),
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
