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
      className="scroll-mt-36 border-b border-border bg-background"
      aria-labelledby="kids-pricing-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
        <FadeIn preset="section" immediate>
          <h2 id="kids-pricing-heading" className="text-2xl font-black text-foreground md:text-3xl">
            מחירון והרשמה
          </h2>
          {ninjaCategory?.lead && (
            <p className="mt-2 max-w-2xl text-muted-foreground">{ninjaCategory.lead}</p>
          )}
        </FadeIn>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
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
