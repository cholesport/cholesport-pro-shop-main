import { useEffect, useState } from "react";
import { ArrowLeft, Calendar } from "lucide-react";
import { ActivityDailySchedule } from "@/components/site/ActivityDailySchedule";
import { FadeIn } from "@/components/site/FadeIn";
import {
  TABLE_TENNIS_SCHEDULE_CATEGORY_IDS,
  TABLE_TENNIS_SCHEDULE_SECTION_ID,
  TABLE_TENNIS_PRICING_SECTION_ID,
} from "@/data/tableTennis";
import type { ActivityCategoryId } from "@/data/activities";
import type { ActivityPass } from "@/data/passes";
import { loadAccountSession } from "@/lib/accountSession";
import { listCustomerPasses } from "@/lib/api/passes.functions";
import { safeAction } from "@/lib/safeAction";

export function TableTennisScheduleSection() {
  const [scheduleCategory, setScheduleCategory] = useState<ActivityCategoryId>("table-tennis");
  const [passes, setPasses] = useState<ActivityPass[]>([]);
  const [customerToken, setCustomerToken] = useState<string | undefined>();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const session = loadAccountSession();
    if (!session) return;
    if (session.isAdmin) {
      setIsAdmin(true);
      return;
    }
    if (!session.customerToken) return;
    setCustomerToken(session.customerToken);
    void safeAction(
      () => listCustomerPasses({ data: { customerToken: session.customerToken! } }),
      {
        fallbackMessage: "לא הצלחנו לטעון כרטיסיות.",
        notify: false,
      },
    ).then((result) => {
      if (result) setPasses(result.passes);
    });
  }, []);

  return (
    <section
      id={TABLE_TENNIS_SCHEDULE_SECTION_ID}
      className="scroll-mt-28 border-b border-border bg-secondary/30 md:scroll-mt-36"
      aria-labelledby="table-tennis-schedule-heading"
    >
      <div className="mx-auto max-w-7xl px-3 py-4 md:px-4 md:py-14">
        <FadeIn preset="section" immediate>
          <div className="mb-2 flex flex-wrap items-end justify-between gap-2 md:mb-6 md:gap-4">
            <div>
              <div className="flex items-center gap-1.5 md:mb-2 md:gap-2">
                <Calendar size={18} className="text-accent md:size-6" aria-hidden />
                <h2
                  id="table-tennis-schedule-heading"
                  className="text-lg font-black text-foreground md:text-3xl"
                >
                  לו&quot;ז השיעורים
                </h2>
              </div>
              <p className="hidden max-w-2xl text-base text-muted-foreground md:block md:text-lg">
                בחרו סוג פעילות, תאריך מהלוח וראו מה מתקיים באותו יום — Open Play, חוג ילדים
                או אימון קבוצתי.
              </p>
            </div>
          </div>
        </FadeIn>

        <ActivityDailySchedule
          categoryId={scheduleCategory}
          onCategoryChange={setScheduleCategory}
          categoryIds={[...TABLE_TENNIS_SCHEDULE_CATEGORY_IDS]}
          customerToken={customerToken}
          passes={passes}
          onPassesChange={setPasses}
          adminMode={isAdmin}
          pricingHref={`#${TABLE_TENNIS_PRICING_SECTION_ID}`}
        />

        {!isAdmin && (
          <FadeIn preset="section" immediate index={2} className="mt-8 text-center">
            <a
              href={`#${TABLE_TENNIS_PRICING_SECTION_ID}`}
              className="inline-flex items-center gap-1 text-sm font-bold text-accent hover:underline"
            >
              המשיכו למחירון והרשמה
              <ArrowLeft size={14} aria-hidden />
            </a>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
