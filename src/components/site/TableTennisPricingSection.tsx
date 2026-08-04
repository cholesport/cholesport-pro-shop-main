import { ActivityPricingCard } from "@/components/site/ActivityPricingCard";
import { FadeIn } from "@/components/site/FadeIn";
import { TABLE_TENNIS_CLUB_NOTICE } from "@/data/activities";
import { buildGroupLessonPricingPlans } from "@/data/groupLessonPricing";
import { TABLE_TENNIS_PRICING_SECTION_ID } from "@/data/tableTennis";
import { getActivityCategoryById, getPricingByCategory } from "@/lib/activities";

const openPlayPlans = getPricingByCategory("table-tennis");
const kidsPlans = buildGroupLessonPricingPlans("table-tennis-kids");
const trainingPlans = buildGroupLessonPricingPlans("table-tennis-training");
const openPlayCategory = getActivityCategoryById("table-tennis");
const kidsCategory = getActivityCategoryById("table-tennis-kids");
const trainingCategory = getActivityCategoryById("table-tennis-training");

export function TableTennisPricingSection() {
  return (
    <section
      id={TABLE_TENNIS_PRICING_SECTION_ID}
      className="scroll-mt-36 border-b border-border bg-background"
      aria-labelledby="table-tennis-pricing-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
        <FadeIn preset="section" immediate>
          <h2 id="table-tennis-pricing-heading" className="text-2xl font-black text-foreground md:text-3xl">
            מחירון והרשמה
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            כניסה למועדון, חוג לילדים ואימונים קבוצתיים — כל אחד בנפרד, בלי בלבול.
          </p>
        </FadeIn>

        <div className="mt-8 rounded-xl border border-accent/30 bg-accent/5 p-5 md:p-6">
          <h3 className="text-lg font-bold text-foreground">{TABLE_TENNIS_CLUB_NOTICE.title}</h3>
          <ul className="mt-3 space-y-2">
            {TABLE_TENNIS_CLUB_NOTICE.points.map((point) => (
              <li key={point} className="flex gap-2.5 text-sm leading-relaxed text-foreground">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10">
          <FadeIn preset="section" immediate index={1}>
            <h3 className="text-xl font-bold text-foreground">{openPlayCategory?.title}</h3>
            {openPlayCategory?.lead && (
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
                {openPlayCategory.lead}
              </p>
            )}
          </FadeIn>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {openPlayPlans.map((plan, index) => (
              <FadeIn key={plan.id} preset="card" index={index}>
                <ActivityPricingCard plan={plan} />
              </FadeIn>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <FadeIn preset="section" immediate index={2}>
            <h3 className="text-xl font-bold text-foreground">{kidsCategory?.title}</h3>
            {kidsCategory?.lead && (
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
                {kidsCategory.lead}
              </p>
            )}
          </FadeIn>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {kidsPlans.map((plan, index) => (
              <FadeIn key={plan.id} preset="card" index={index}>
                <ActivityPricingCard plan={plan} />
              </FadeIn>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <FadeIn preset="section" immediate index={3}>
            <h3 className="text-xl font-bold text-foreground">{trainingCategory?.title}</h3>
            {trainingCategory?.lead && (
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
                {trainingCategory.lead}
              </p>
            )}
          </FadeIn>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {trainingPlans.map((plan, index) => (
              <FadeIn key={plan.id} preset="card" index={index}>
                <ActivityPricingCard plan={plan} />
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
