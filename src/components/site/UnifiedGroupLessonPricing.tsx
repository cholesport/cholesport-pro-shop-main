import { Users } from "lucide-react";
import { ActivityPricingCard } from "@/components/site/ActivityPricingCard";
import { FadeIn } from "@/components/site/FadeIn";
import { Badge } from "@/components/ui/badge";
import { ACTIVITIES_CATEGORIES } from "@/data/activities";
import {
  buildUnifiedGroupLessonDisplayPlans,
  GROUP_LESSON_CATEGORY_IDS,
  GROUP_LESSON_PRICING_SECTION_ID,
} from "@/data/groupLessonPricing";

const unifiedPlans = buildUnifiedGroupLessonDisplayPlans();

export function UnifiedGroupLessonPricingBanner({
  highlighted = false,
}: {
  highlighted?: boolean;
}) {
  const categoryTitles = GROUP_LESSON_CATEGORY_IDS.map((id) => {
    const category = ACTIVITIES_CATEGORIES.find((row) => row.id === id);
    return category?.title ?? id;
  });

  return (
    <div
      id={GROUP_LESSON_PRICING_SECTION_ID}
      className={`mt-10 scroll-mt-24 rounded-2xl border-2 border-accent/35 bg-gradient-to-br from-accent/10 via-card to-card p-5 md:p-8 space-y-6 transition-colors duration-500 ${
        highlighted ? "ring-2 ring-accent/40 bg-accent/5" : ""
      }`}
    >
      <div className="flex flex-wrap items-start gap-3">
        <div className="rounded-lg bg-accent/15 p-2.5">
          <Users size={22} className="text-accent" />
        </div>
        <div className="space-y-2 flex-1 min-w-[16rem]">
          <Badge className="text-xs font-bold">מחירון אחיד</Badge>
          <h3 className="text-xl md:text-2xl font-black text-foreground">
            חוגים ואימונים קבוצתיים — אותם מחירים
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            <span className="font-semibold text-foreground">{categoryTitles.join(" · ")}</span>{" "}
            — כולם באותו מחירון. בחרו את הפעילות שמתאימה לכם, המסלולים והעלויות זהים.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {unifiedPlans.map((plan, i) => (
          <FadeIn key={plan.id} preset="card" index={i}>
            <ActivityPricingCard plan={plan} />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
