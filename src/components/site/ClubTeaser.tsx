import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { FadeIn } from "@/components/site/FadeIn";
import { CLUB_PATH, CLUB_TEASER } from "@/data/club";

/** Compact strip linking to the CHOLE TLV venue page. */
export function ClubTeaser() {
  return (
    <aside
      dir="rtl"
      aria-label={CLUB_TEASER.label}
      className="border-b border-sky-800/40 bg-sky-600 text-white"
    >
      <FadeIn preset="promo" immediate className="mx-auto max-w-7xl px-4 py-4 md:py-5">
        <Link
          to={CLUB_PATH}
          className="group flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
        >
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-100">
              {CLUB_TEASER.label}
            </p>
            <p className="mt-1 text-sm font-medium text-white/95 md:text-base group-hover:text-white transition">
              {CLUB_TEASER.text}
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-white transition group-hover:gap-2.5">
            {CLUB_TEASER.cta}
            <ArrowLeft size={16} aria-hidden />
          </span>
        </Link>
      </FadeIn>
    </aside>
  );
}
