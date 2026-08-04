import { useEffect, useState } from "react";
import { ArrowLeft, Calendar } from "lucide-react";
import { ActivityDailySchedule } from "@/components/site/ActivityDailySchedule";
import { FadeIn } from "@/components/site/FadeIn";
import { FUNCTIONAL_PRICING_SECTION_ID, FUNCTIONAL_SCHEDULE_SECTION_ID } from "@/data/functional";
import type { ActivityPass } from "@/data/passes";
import { loadAccountSession } from "@/lib/accountSession";
import { listCustomerPasses } from "@/lib/api/passes.functions";
import { safeAction } from "@/lib/safeAction";

export function FunctionalScheduleSection() {
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
      id={FUNCTIONAL_SCHEDULE_SECTION_ID}
      className="scroll-mt-36 border-b border-border bg-secondary/30"
      aria-labelledby="functional-schedule-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
        <FadeIn preset="section" immediate>
          <div className="mb-2 flex items-center gap-2">
            <Calendar size={24} className="text-accent" aria-hidden />
            <h2 id="functional-schedule-heading" className="text-2xl font-black text-foreground md:text-3xl">
              לו&quot;ז השיעורים
            </h2>
          </div>
          <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
            בחרו תאריך מהלוח וראו מתי מתקיימים אימוני הפונקציונלי — עם אפשרות לשריין מקום.
          </p>
        </FadeIn>

        <ActivityDailySchedule
          categoryId="functional-adults"
          onCategoryChange={() => {}}
          categoryIds={["functional-adults"]}
          customerToken={customerToken}
          passes={passes}
          onPassesChange={setPasses}
          adminMode={isAdmin}
          pricingHref={`#${FUNCTIONAL_PRICING_SECTION_ID}`}
          showCategoryNav={false}
        />

        {!isAdmin && (
          <FadeIn preset="section" immediate index={2} className="mt-8 text-center">
            <a
              href={`#${FUNCTIONAL_PRICING_SECTION_ID}`}
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
