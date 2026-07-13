import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { COMPANY, type LegalSection } from "@/data/legal";

type LegalDocumentProps = {
  title: string;
  subtitle: string;
  sections: LegalSection[];
  relatedLink?: { label: string; to: "/privacy" | "/terms" };
};

export function LegalDocument({ title, subtitle, sections, relatedLink }: LegalDocumentProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition mb-8"
      >
        <ChevronLeft size={16} />
        חזרה לחנות
      </Link>

      <header className="mb-10 pb-8 border-b border-border">
        <h1 className="text-3xl md:text-4xl font-black text-foreground">{title}</h1>
        <p className="text-muted-foreground mt-3 leading-relaxed">{subtitle}</p>
        <p className="text-xs text-muted-foreground mt-4">עודכן לאחרונה: {COMPANY.lastUpdated}</p>
      </header>

      <article className="space-y-10 text-foreground leading-relaxed">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-bold text-foreground mb-3">{section.title}</h2>
            {section.paragraphs?.map((p, i) => (
              <p key={i} className="text-sm text-muted-foreground mb-3 last:mb-0">
                {p}
              </p>
            ))}
            {section.bullets && (
              <ul className="list-disc list-outside me-4 space-y-2 text-sm text-muted-foreground mt-3">
                {section.bullets.map((item, i) => (
                  <li key={i} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            )}
            {section.paragraphsAfter?.map((p, i) => (
              <p key={`after-${i}`} className="text-sm text-muted-foreground mb-3 last:mb-0 mt-3">
                {p}
              </p>
            ))}
          </section>
        ))}
      </article>

      {relatedLink && (
        <footer className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            ראו גם:{" "}
            <Link to={relatedLink.to} className="text-accent hover:underline font-medium">
              {relatedLink.label}
            </Link>
          </p>
        </footer>
      )}

      <p className="mt-8 text-xs text-muted-foreground/80 leading-relaxed">
        מסמך זה נועד לספק מידע כללי ואינו מהווה ייעוץ משפטי. לשאלות ספציפיות, מומלץ להיוועץ בעורך דין.
      </p>
    </div>
  );
}
