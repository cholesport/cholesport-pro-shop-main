import { LANDING_MAT_AIRFLOOR_WARRANTY } from "@/data/landingMats";

type WarrantyItem = {
  title: string;
  description: string;
};

function WarrantyList({
  items,
  variant,
}: {
  items: readonly WarrantyItem[];
  variant: "includes" | "excludes";
}) {
  return (
    <ul className="mt-4 space-y-4 text-sm leading-relaxed">
      {items.map((item) => (
        <li key={item.title} className="flex items-start gap-3">
          <span
            className={`mt-1 shrink-0 font-bold ${variant === "includes" ? "text-accent" : "text-muted-foreground"}`}
            aria-hidden
          >
            {variant === "includes" ? "✓" : "•"}
          </span>
          <div>
            <strong className="font-bold text-foreground">{item.title}:</strong>{" "}
            <span className="text-muted-foreground">{item.description}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function LandingMatWarrantySection() {
  const {
    title,
    introBefore,
    introHighlight,
    introAfter,
    includesTitle,
    includes,
    excludesTitle,
    excludes,
    closingTitle,
    closingText,
  } = LANDING_MAT_AIRFLOOR_WARRANTY;

  return (
    <section dir="rtl" className="mt-12 max-w-3xl" aria-labelledby="landing-mat-warranty-heading">
      <h2 id="landing-mat-warranty-heading" className="text-xl font-bold text-foreground mb-4">
        {title}
      </h2>

      <p className="text-sm leading-relaxed text-muted-foreground">
        {introBefore}
        <strong className="font-bold text-foreground">{introHighlight}</strong>
        {introAfter}
      </p>

      <h3 className="mt-8 text-base font-bold text-foreground">{includesTitle}</h3>
      <WarrantyList items={includes} variant="includes" />

      <h3 className="mt-8 text-base font-bold text-foreground">{excludesTitle}</h3>
      <WarrantyList items={excludes} variant="excludes" />

      <div className="mt-8 rounded-xl border border-border bg-secondary/40 p-5">
        <h3 className="text-base font-bold text-foreground">{closingTitle}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{closingText}</p>
      </div>
    </section>
  );
}
