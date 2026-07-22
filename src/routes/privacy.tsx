import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { LegalDocument } from "@/components/site/LegalDocument";
import { PRIVACY_SECTIONS, COMPANY } from "@/data/legal";
import { buildPageSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => {
    const seo = buildPageSeoHead({
      title: `מדיניות פרטיות - ${COMPANY.name}`,
      description:
        "מדיניות הפרטיות של CHOLE sport - איסוף מידע, שימוש, עוגיות וזכויות המשתמש בהתאם לחוק הגנת הפרטיות.",
      path: "/privacy",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: PrivacyRoute,
});

function PrivacyRoute() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
        <LegalDocument
          title="מדיניות פרטיות"
          subtitle={`${COMPANY.name} מחויבת להגן על פרטיותכם. מסמך זה מפרט כיצד אנו אוספים, משתמשים ושומרים על המידע האישי שלכם.`}
          sections={PRIVACY_SECTIONS}
          relatedLink={{ label: "תנאי שימוש", to: "/terms" }}
        />
      </main>
      <Footer />
    </div>
  );
}
