import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { FadeIn } from "@/components/site/FadeIn";
import { CLUB_PATH, CLUB_TEASER } from "@/data/club";

/** Compact strip - visible if relevant, never competing with the shop hero. */
export function ClubTeaser() {
  return (
    <aside
      dir="rtl"
      aria-label={CLUB_TEASER.label}
      className="border-b border-border bg-secondary/55"
    >
      <FadeIn preset="promo" immediate className="mx-auto max-w-7xl px-4 py-3 md:py-3.5">
        <Link
          to={CLUB_PATH}
          className="group flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
        >
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
              {CLUB_TEASER.label}
            </p>
            <p className="mt-0.5 text-sm text-foreground/85 group-hover:text-foreground transition">
              {CLUB_TEASER.text}
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-accent transition group-hover:gap-2.5">
            {CLUB_TEASER.cta}
            <ArrowLeft size={16} aria-hidden />
          </span>
        </Link>
      </FadeIn>
    </aside>
  );
}
