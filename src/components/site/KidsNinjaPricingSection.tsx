import { ActivityPricingCard } from "@/components/site/ActivityPricingCard";
import { FadeIn } from "@/components/site/FadeIn";
import { getActivityCategoryById } from "@/lib/activities";
import { KIDS_PRICING_SECTION_ID } from "@/data/kids";
import { buildGroupLessonPricingPlans } from "@/data/groupLessonPricing";

const ninjaPlans = buildGroupLessonPricingPlans("ninja-kids");
const ninjaCategory = getActivityCategoryById("ninja-kids");

export function KidsNinjaPricingSection() {
  return (
    <section
      id={KIDS_PRICING_SECTION_ID}
      className="scroll-mt-28 border-b border-border bg-background md:scroll-mt-36"
      aria-labelledby="kids-pricing-heading"
    >
      <div className="mx-auto max-w-7xl px-3 py-4 md:px-4 md:py-14">
        <FadeIn preset="section" immediate>
          <h2
            id="kids-pricing-heading"
            className="text-lg font-black text-foreground md:text-3xl"
          >
            מחירון והרשמה
          </h2>
          {ninjaCategory?.lead && (
            <p className="mt-1 hidden max-w-2xl text-muted-foreground md:mt-2 md:block">
              {ninjaCategory.lead}
            </p>
          )}
        </FadeIn>

        <div className="mt-3 grid grid-cols-2 gap-2 md:mt-8 md:gap-6 lg:grid-cols-4">
          {ninjaPlans.map((plan, index) => (
            <FadeIn key={plan.id} preset="card" index={index}>
              <ActivityPricingCard plan={plan} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
