import { LANDING_MAT_AIRFLOOR_MARKETING } from "@/data/landingMats";

export function LandingMatAirfloorSection() {
  const { title, paragraphs, bullets } = LANDING_MAT_AIRFLOOR_MARKETING;

  return (
    <section
      dir="rtl"
      className="mt-16 max-w-3xl rounded-2xl border-2 border-accent/30 bg-accent/5 p-6 md:p-8"
      aria-labelledby="landing-mat-airfloor-heading"
    >
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-foreground">
          AirFloor
        </span>
        <h2 id="landing-mat-airfloor-heading" className="text-xl md:text-2xl font-black text-foreground">
          {title}
        </h2>
      </div>

      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </div>

      <ul className="mt-6 space-y-2 text-sm font-semibold text-foreground">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2">
            <span className="text-accent shrink-0" aria-hidden>
              ✓
            </span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
