import { ActivityPricingCard } from "@/components/site/ActivityPricingCard";
import { FadeIn } from "@/components/site/FadeIn";
import { FUNCTIONAL_PRICING_SECTION_ID } from "@/data/functional";
import { buildGroupLessonPricingPlans } from "@/data/groupLessonPricing";
import { getActivityCategoryById } from "@/lib/activities";

const functionalPlans = buildGroupLessonPricingPlans("functional-adults");
const functionalCategory = getActivityCategoryById("functional-adults");

export function FunctionalPricingSection() {
  return (
    <section
      id={FUNCTIONAL_PRICING_SECTION_ID}
      className="scroll-mt-36 border-b border-border bg-background"
      aria-labelledby="functional-pricing-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
        <FadeIn preset="section" immediate>
          <h2 id="functional-pricing-heading" className="text-2xl font-black text-foreground md:text-3xl">
            מחירון והרשמה
          </h2>
          {functionalCategory?.lead && (
            <p className="mt-2 max-w-2xl text-muted-foreground">{functionalCategory.lead}</p>
          )}
        </FadeIn>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
          {functionalPlans.map((plan, index) => (
            <FadeIn key={plan.id} preset="card" index={index}>
              <ActivityPricingCard plan={plan} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
