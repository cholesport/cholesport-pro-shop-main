import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { LegalDocument } from "@/components/site/LegalDocument";
import { PRIVACY_SECTIONS, COMPANY } from "@/data/legal";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: `מדיניות פרטיות — ${COMPANY.name}` },
      {
        name: "description",
        content: "מדיניות הפרטיות של CHOLE sport — איסוף מידע, שימוש, עוגיות וזכויות המשתמש בהתאם לחוק הגנת הפרטיות.",
      },
    ],
  }),
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
