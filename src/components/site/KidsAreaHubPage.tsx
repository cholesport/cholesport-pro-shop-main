import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { KidsAreaSubNav } from "@/components/site/KidsAreaSubNav";
import { KidsCampsSection } from "@/components/site/KidsCampsSection";
import { KidsFirstTimeInfoSection } from "@/components/site/KidsFirstTimeInfoSection";
import { KidsNinjaPricingSection } from "@/components/site/KidsNinjaPricingSection";
import { KidsNinjaScheduleSection } from "@/components/site/KidsNinjaScheduleSection";
import { KIDS_CAMPS_SECTION_ID } from "@/data/camps";
import { KIDS_FIRST_TIME_SECTION_ID, KIDS_SCHEDULE_SECTION_ID } from "@/data/kids";
import type { SiteAreaHub } from "@/data/siteGateway";
import { saveSiteGatewayPreference } from "@/lib/siteGatewayPreference";

type KidsAreaHubPageProps = {
  hub: SiteAreaHub;
};

type KidsView = "schedule" | "camps" | "first-time";

function resolveKidsView(hash: string): KidsView {
  if (hash === KIDS_CAMPS_SECTION_ID) return "camps";
  if (hash === KIDS_FIRST_TIME_SECTION_ID) return "first-time";
  return "schedule";
}

function syncKidsUrlHash(hash: string) {
  if (typeof window === "undefined") return;
  const nextUrl = hash ? `/kids#${hash}` : "/kids";
  window.history.replaceState(null, "", nextUrl);
}

function scrollToSectionTop(sectionId: string) {
  window.setTimeout(() => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "auto", block: "start" });
      return;
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, 0);
}

export function KidsAreaHubPage({ hub }: KidsAreaHubPageProps) {
  const [view, setView] = useState<KidsView>("schedule");

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    setView(resolveKidsView(hash));
  }, []);

  useEffect(() => {
    if (view === "camps") {
      scrollToSectionTop(KIDS_CAMPS_SECTION_ID);
      return;
    }
    if (view === "first-time") {
      scrollToSectionTop(KIDS_FIRST_TIME_SECTION_ID);
    }
  }, [view]);

  function openCampsView() {
    saveSiteGatewayPreference(hub.id);
    setView("camps");
    syncKidsUrlHash(KIDS_CAMPS_SECTION_ID);
  }

  function openFirstTimeView() {
    saveSiteGatewayPreference(hub.id);
    setView("first-time");
    syncKidsUrlHash(KIDS_FIRST_TIME_SECTION_ID);
  }

  function openScheduleView() {
    setView("schedule");
    syncKidsUrlHash(KIDS_SCHEDULE_SECTION_ID);
    window.requestAnimationFrame(() => {
      document.getElementById(KIDS_SCHEDULE_SECTION_ID)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

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

      <KidsAreaSubNav
        view={view}
        onOpenCamps={openCampsView}
        onOpenFirstTime={openFirstTimeView}
        onOpenSchedule={openScheduleView}
      />

      {view === "schedule" ? (
        <>
          <KidsNinjaScheduleSection />
          <KidsNinjaPricingSection />
        </>
      ) : view === "camps" ? (
        <>
          <section className="hidden border-b border-border bg-background md:block">
            <div className="mx-auto max-w-7xl px-4 py-4">
              <button
                type="button"
                onClick={openScheduleView}
                className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:underline"
              >
                <ArrowRight size={16} aria-hidden />
                חזרה ללו&quot;ז חוגים ומחירון
              </button>
            </div>
          </section>
          <KidsCampsSection />
        </>
      ) : (
        <>
          <section className="hidden border-b border-border bg-background md:block">
            <div className="mx-auto max-w-7xl px-4 py-4">
              <button
                type="button"
                onClick={openScheduleView}
                className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:underline"
              >
                <ArrowRight size={16} aria-hidden />
                חזרה ללו&quot;ז חוגים ומחירון
              </button>
            </div>
          </section>
          <KidsFirstTimeInfoSection />
        </>
      )}
    </div>
  );
}

export function kidsCampsHref() {
  return `/kids#${KIDS_CAMPS_SECTION_ID}`;
}

export function kidsFirstTimeHref() {
  return `/kids#${KIDS_FIRST_TIME_SECTION_ID}`;
}
