import { useEffect, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { KidsCampsSection } from "@/components/site/KidsCampsSection";
import { KidsNinjaPricingSection } from "@/components/site/KidsNinjaPricingSection";
import { KidsNinjaScheduleSection } from "@/components/site/KidsNinjaScheduleSection";
import { HubLinkCard } from "@/components/site/SiteAreaHubPage";
import { KIDS_CAMPS_SECTION_ID } from "@/data/camps";
import { KIDS_SCHEDULE_SECTION_ID } from "@/data/kids";
import type { SiteAreaHub } from "@/data/siteGateway";
import { saveSiteGatewayPreference } from "@/lib/siteGatewayPreference";

type KidsAreaHubPageProps = {
  hub: SiteAreaHub;
};

type KidsView = "schedule" | "camps";

function resolveKidsView(hash: string): KidsView {
  return hash === KIDS_CAMPS_SECTION_ID ? "camps" : "schedule";
}

export function KidsAreaHubPage({ hub }: KidsAreaHubPageProps) {
  const navigate = useNavigate();
  const routerHash = useRouterState({
    select: (state) => state.location.hash.replace(/^#/, ""),
  });
  const [view, setView] = useState<KidsView>(() => resolveKidsView(routerHash));

  const quickLinks = hub.links.filter(
    (link) =>
      !link.href.includes("focus=ninja-kids") &&
      !link.href.includes(`#${KIDS_CAMPS_SECTION_ID}`) &&
      !link.href.includes("focus=camps"),
  );

  useEffect(() => {
    const nextView = resolveKidsView(routerHash);
    setView(nextView);

    if (nextView === "camps") {
      window.requestAnimationFrame(() => {
        document.getElementById(KIDS_CAMPS_SECTION_ID)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
      return;
    }

    if (routerHash === KIDS_SCHEDULE_SECTION_ID) {
      window.requestAnimationFrame(() => {
        document.getElementById(KIDS_SCHEDULE_SECTION_ID)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, [routerHash]);

  function openCampsView() {
    saveSiteGatewayPreference(hub.id);
    setView("camps");
    void navigate({ to: "/kids", hash: KIDS_CAMPS_SECTION_ID });
  }

  function openScheduleView() {
    setView("schedule");
    void navigate({ to: "/kids", hash: KIDS_SCHEDULE_SECTION_ID });
  }

  return (
    <div dir="rtl">
      <section
        className="relative overflow-hidden border-b border-border"
        aria-labelledby={`${hub.id}-hub-heading`}
      >
        <div className="relative min-h-[24vh] md:min-h-[28vh]">
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
          <div className="relative z-10 mx-auto flex min-h-[24vh] max-w-7xl flex-col justify-end px-4 pb-8 pt-14 md:min-h-[28vh] md:pb-10 md:pt-16">
            <Link
              to="/"
              className="mb-4 inline-flex w-fit items-center gap-2 text-sm font-medium text-white/80 transition hover:text-white"
            >
              <ArrowRight size={16} aria-hidden />
              חזרה לבחירת אזור
            </Link>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {hub.eyebrow}
            </p>
            <h1
              id={`${hub.id}-hub-heading`}
              className="mt-2 max-w-3xl text-balance text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-4xl"
            >
              {hub.headline}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 md:text-base">
              {hub.support}
            </p>
          </div>
        </div>
      </section>

      {view === "schedule" ? (
        <>
          <section
            className="border-b border-border bg-background"
            aria-labelledby="kids-quick-links-heading"
          >
            <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
              <h2 id="kids-quick-links-heading" className="sr-only">
                אפשרויות נוספות באזור הילדים
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <li>
                  <HubLinkCard
                    label="קייטנות"
                    description="קייטנת נינג'ה ואמנות — מחזורים, פעילויות והרשמה"
                    href={`/kids#${KIDS_CAMPS_SECTION_ID}`}
                    onNavigate={openCampsView}
                  />
                </li>
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <HubLinkCard
                      {...link}
                      onNavigate={() => saveSiteGatewayPreference(hub.id)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <KidsNinjaScheduleSection />
          <KidsNinjaPricingSection />
        </>
      ) : (
        <>
          <section className="border-b border-border bg-background">
            <div className="mx-auto max-w-7xl px-4 py-4">
              <Link
                to="/kids"
                hash={KIDS_SCHEDULE_SECTION_ID}
                onClick={openScheduleView}
                className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:underline"
              >
                <ArrowRight size={16} aria-hidden />
                חזרה ללו&quot;ז חוגים ומחירון
              </Link>
            </div>
          </section>
          <KidsCampsSection />
        </>
      )}
    </div>
  );
}

export function kidsCampsHref() {
  return `/kids#${KIDS_CAMPS_SECTION_ID}`;
}
