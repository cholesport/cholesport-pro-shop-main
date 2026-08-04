import {
  TABLE_TENNIS_PRICING_SECTION_ID,
  TABLE_TENNIS_SCHEDULE_SECTION_ID,
} from "@/data/tableTennis";
import { cn } from "@/lib/utils";

function scrollToSection(sectionId: string) {
  window.requestAnimationFrame(() => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

export function TableTennisAreaSubNav() {
  const itemClass = (active: boolean) =>
    cn(
      "inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg px-4 py-2.5 text-sm font-bold transition",
      active
        ? "bg-accent text-accent-foreground shadow-sm"
        : "border border-border bg-card text-foreground hover:border-accent/40 hover:text-accent",
    );

  return (
    <nav
      className="sticky top-[4.25rem] z-40 border-b border-border bg-background/95 backdrop-blur-md"
      aria-label="ניווט באזור טניס השולחן"
    >
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 [-webkit-overflow-scrolling:touch]">
        <button
          type="button"
          className={itemClass(true)}
          aria-current="page"
          onClick={() => scrollToSection(TABLE_TENNIS_SCHEDULE_SECTION_ID)}
        >
          לו&quot;ז השיעורים
        </button>
        <button
          type="button"
          className={itemClass(false)}
          onClick={() => scrollToSection(TABLE_TENNIS_PRICING_SECTION_ID)}
        >
          מחירון
        </button>
      </div>
    </nav>
  );
}
