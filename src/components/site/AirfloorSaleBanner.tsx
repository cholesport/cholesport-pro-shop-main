import {
  AIRFLOOR_SALE_COPY,
  AIRFLOOR_SALE_HEADLINE,
} from "@/data/airfloorMats";

/** Prominent sale callout for airfloor category / PDP. */
export function AirfloorSaleBanner({ className = "" }: { className?: string }) {
  return (
    <aside
      className={`rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 md:px-5 md:py-4 ${className}`}
      aria-label={AIRFLOOR_SALE_HEADLINE}
    >
      <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-accent">
        <span className="rounded-sm bg-accent px-2 py-0.5 text-accent-foreground">מבצע</span>
        עכשיו באתר
      </p>
      <p className="mt-1.5 text-base md:text-lg font-extrabold text-foreground leading-snug">
        {AIRFLOOR_SALE_HEADLINE}
      </p>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{AIRFLOOR_SALE_COPY}</p>
    </aside>
  );
}
