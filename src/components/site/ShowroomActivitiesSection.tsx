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
      <div className="mb-6">
        <h2 id="showroom-activities-heading" className="text-2xl font-black text-foreground">
          חוגים במתחם
        </h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
          לחצו על כל רובריקה כדי לפתוח פרטים, שעות והרשמה.
        </p>
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
              <a
                href={`tel:${COMPANY.phone.replace(/-/g, "")}`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
              >
                <Phone size={16} aria-hidden />
                לפרטים והרשמה: {COMPANY.phone}
              </a>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
