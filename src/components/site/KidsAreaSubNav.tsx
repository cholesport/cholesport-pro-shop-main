import {
  KIDS_FIRST_TIME_INFO_LABEL,
  KIDS_PRICING_SECTION_ID,
  KIDS_SCHEDULE_SECTION_ID,
} from "@/data/kids";
import { cn } from "@/lib/utils";

type KidsAreaSubNavProps = {
  view: "schedule" | "camps" | "first-time";
  onOpenCamps: () => void;
  onOpenFirstTime: () => void;
  onOpenSchedule: () => void;
};

function scrollToSection(sectionId: string) {
  window.requestAnimationFrame(() => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

export function KidsAreaSubNav({
  view,
  onOpenCamps,
  onOpenFirstTime,
  onOpenSchedule,
}: KidsAreaSubNavProps) {
  const itemClass = (active: boolean) =>
    cn(
      "inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg px-4 py-2.5 text-sm font-bold transition",
      active
        ? "bg-accent text-accent-foreground shadow-sm"
        : "border border-border bg-card text-foreground hover:border-accent/40 hover:text-accent",
    );

  const firstTimeInfoButton =
    view === "first-time" ? (
      <span className={itemClass(true)} aria-current="page">
        {KIDS_FIRST_TIME_INFO_LABEL}
      </span>
    ) : (
      <button type="button" className={itemClass(false)} onClick={onOpenFirstTime}>
        {KIDS_FIRST_TIME_INFO_LABEL}
      </button>
    );

  return (
    <nav
      className="sticky top-[4.25rem] z-40 border-b border-border bg-background/95 backdrop-blur-md"
      aria-label="ניווט באזור הילדים"
    >
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 [-webkit-overflow-scrolling:touch]">
        {view === "camps" ? (
          <>
            <button type="button" className={itemClass(false)} onClick={onOpenSchedule}>
              לו&quot;ז חוגים
            </button>
            <span className={itemClass(true)} aria-current="page">
              קייטנות
            </span>
            {firstTimeInfoButton}
          </>
        ) : view === "first-time" ? (
          <>
            <button type="button" className={itemClass(false)} onClick={onOpenSchedule}>
              לו&quot;ז חוגים
            </button>
            <button type="button" className={itemClass(false)} onClick={onOpenCamps}>
              קייטנות
            </button>
            {firstTimeInfoButton}
          </>
        ) : (
          <>
            <button
              type="button"
              className={itemClass(true)}
              aria-current="page"
              onClick={() => scrollToSection(KIDS_SCHEDULE_SECTION_ID)}
            >
              לו&quot;ז השיעורים
            </button>
            <button
              type="button"
              className={itemClass(false)}
              onClick={() => scrollToSection(KIDS_PRICING_SECTION_ID)}
            >
              מחירון
            </button>
            <button type="button" className={itemClass(false)} onClick={onOpenCamps}>
              קייטנות
            </button>
            {firstTimeInfoButton}
          </>
        )}
      </div>
    </nav>
  );
}
