import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { TableTennisAreaSubNav } from "@/components/site/TableTennisAreaSubNav";
import { TableTennisPricingSection } from "@/components/site/TableTennisPricingSection";
import { TableTennisScheduleSection } from "@/components/site/TableTennisScheduleSection";
import type { SiteAreaHub } from "@/data/siteGateway";
import { saveSiteGatewayPreference } from "@/lib/siteGatewayPreference";

type TableTennisAreaHubPageProps = {
  hub: SiteAreaHub;
};

export function TableTennisAreaHubPage({ hub }: TableTennisAreaHubPageProps) {
  return (
    <div dir="rtl">
      <section
        className="relative overflow-hidden border-b border-border"
        aria-labelledby={`${hub.id}-hub-heading`}
      >
        <div className="relative min-h-[20vh] md:min-h-[24vh]">
          <img
            src={hub.image}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.82] contrast-[1.06] saturate-[0.92]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/55 to-primary/25"
            aria-hidden
          />
          <div className="relative z-10 mx-auto flex min-h-[20vh] max-w-7xl flex-col justify-end px-4 pb-6 pt-12 md:min-h-[24vh] md:pb-8 md:pt-14">
            <Link
              to="/"
              className="mb-3 inline-flex w-fit items-center gap-2 text-sm font-medium text-white/80 transition hover:text-white"
              onClick={() => saveSiteGatewayPreference(hub.id)}
            >
              <ArrowRight size={16} aria-hidden />
              חזרה לבחירת אזור
            </Link>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {hub.eyebrow}
            </p>
            <h1
              id={`${hub.id}-hub-heading`}
              className="mt-2 max-w-3xl text-balance text-xl font-extrabold leading-tight text-white sm:text-2xl md:text-3xl"
            >
              {hub.headline}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/90">
              {hub.support}
            </p>
          </div>
        </div>
      </section>

      <TableTennisAreaSubNav />
      <TableTennisScheduleSection />
      <TableTennisPricingSection />
    </div>
  );
}
