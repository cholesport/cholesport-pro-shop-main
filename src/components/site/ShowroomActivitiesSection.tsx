import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SHOWROOM_ACTIVITIES } from "@/data/showroom";
import { COMPANY } from "@/data/legal";
import { CLUB_PATH } from "@/data/club";

const SHOWROOM_ACTIVITY_LINKS: Record<string, string> = {
  "ninja-acrobatics-kids": "/kids",
  "table-tennis-kids-youth": "/table-tennis",
  "table-tennis-adults": "/table-tennis",
  "open-table-tennis": "/table-tennis",
  tournaments: `${CLUB_PATH}#events`,
};

export function ShowroomActivitiesSection() {
  const [openId, setOpenId] = useState<string>("");

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (SHOWROOM_ACTIVITIES.some((activity) => activity.id === hash)) {
      setOpenId(hash);
      window.setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  }, []);

  return (
    <section dir="rtl" aria-labelledby="showroom-activities-heading" className="mb-12">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="showroom-activities-heading" className="text-2xl font-black text-foreground">
            חוגים במתחם
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            לחצו על כל רובריקה כדי לפתוח פרטים, שעות והרשמה.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground transition hover:bg-accent/90"
        >
          בחרו אזור
        </Link>
      </div>

      <Accordion
        type="single"
        collapsible
        value={openId}
        onValueChange={setOpenId}
        className="space-y-3"
      >
        {SHOWROOM_ACTIVITIES.map((activity) => (
          <AccordionItem
            key={activity.id}
            id={activity.id}
            value={activity.id}
            className="scroll-mt-28 overflow-hidden rounded-xl border border-border bg-card px-4 md:px-5 border-b-0 last:border-b"
          >
            <AccordionTrigger className="py-5 text-base md:text-lg font-bold text-foreground hover:no-underline hover:text-accent [&[data-state=open]]:text-accent">
              {activity.title}
            </AccordionTrigger>
            <AccordionContent className="pb-5">
              <p className="text-sm font-medium text-foreground leading-relaxed">{activity.summary}</p>
              <ul className="mt-4 space-y-2.5">
                {activity.details.map((detail) => (
                  <li key={detail} className="flex gap-2.5 text-sm text-muted-foreground leading-relaxed">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                    {detail}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  to={SHOWROOM_ACTIVITY_LINKS[activity.id] ?? "/"}
                  className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-bold text-accent-foreground transition hover:bg-accent/90"
                >
                  לפרטים, לו&quot;ז והרשמה
                </Link>
                <a
                  href={`tel:${COMPANY.phone.replace(/-/g, "")}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-accent"
                >
                  <Phone size={16} aria-hidden />
                  טלפון: {COMPANY.phone}
                </a>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
