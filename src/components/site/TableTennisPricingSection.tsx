import { ChevronDown } from "lucide-react";
import { ActivityPricingCard } from "@/components/site/ActivityPricingCard";
import { FadeIn } from "@/components/site/FadeIn";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TABLE_TENNIS_CLUB_NOTICE } from "@/data/activities";
import { buildGroupLessonPricingPlans } from "@/data/groupLessonPricing";
import { TABLE_TENNIS_PRICING_SECTION_ID } from "@/data/tableTennis";
import { getActivityCategoryById, getPricingByCategory } from "@/lib/activities";
import type { ActivityPricingPlan } from "@/data/activities";

const openPlayPlans = getPricingByCategory("table-tennis");
const kidsPlans = buildGroupLessonPricingPlans("table-tennis-kids");
const trainingPlans = buildGroupLessonPricingPlans("table-tennis-training");
const openPlayCategory = getActivityCategoryById("table-tennis");
const kidsCategory = getActivityCategoryById("table-tennis-kids");
const trainingCategory = getActivityCategoryById("table-tennis-training");

function PricingPlansGrid({
  plans,
  columns = "lg:grid-cols-4",
}: {
  plans: ActivityPricingPlan[];
  columns?: string;
}) {
  return (
    <div className={`grid grid-cols-2 gap-2 md:gap-6 ${columns}`}>
      {plans.map((plan, index) => (
        <FadeIn key={plan.id} preset="card" index={index}>
          <ActivityPricingCard plan={plan} />
        </FadeIn>
      ))}
    </div>
  );
}

function PricingCategoryBlock({
  title,
  lead,
  plans,
  columns = "lg:grid-cols-4",
  className = "",
}: {
  title?: string;
  lead?: string;
  plans: ActivityPricingPlan[];
  columns?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {title && <h3 className="text-base font-bold text-foreground md:text-xl">{title}</h3>}
      {lead && (
        <p className="mt-1 hidden max-w-2xl text-sm text-muted-foreground md:mt-2 md:block md:text-base">
          {lead}
        </p>
      )}
      <div className="mt-3 md:mt-6">
        <PricingPlansGrid plans={plans} columns={columns} />
      </div>
    </div>
  );
}

function ClubNotice({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <details className="group rounded-lg border border-accent/30 bg-accent/5 p-3 open:pb-3">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-bold text-foreground [&::-webkit-details-marker]:hidden">
          {TABLE_TENNIS_CLUB_NOTICE.title}
          <ChevronDown
            size={16}
            className="shrink-0 text-muted-foreground transition group-open:rotate-180"
            aria-hidden
          />
        </summary>
        <ul className="mt-2 space-y-1.5">
          {TABLE_TENNIS_CLUB_NOTICE.points.map((point) => (
            <li key={point} className="flex gap-2 text-xs leading-snug text-foreground">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" aria-hidden />
              {point}
            </li>
          ))}
        </ul>
      </details>
    );
  }

  return (
    <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 md:p-6">
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
  );
}

export function TableTennisPricingSection() {
  return (
    <section
      id={TABLE_TENNIS_PRICING_SECTION_ID}
      className="scroll-mt-28 border-b border-border bg-background md:scroll-mt-36"
      aria-labelledby="table-tennis-pricing-heading"
    >
      <div className="mx-auto max-w-7xl px-3 py-4 md:px-4 md:py-14">
        <FadeIn preset="section" immediate>
          <h2
            id="table-tennis-pricing-heading"
            className="text-lg font-black text-foreground md:text-3xl"
          >
            מחירון והרשמה
          </h2>
          <p className="mt-1 hidden max-w-2xl text-muted-foreground md:mt-2 md:block">
            כניסה למועדון, חוג לילדים ואימונים קבוצתיים — כל אחד בנפרד, בלי בלבול.
          </p>
        </FadeIn>

        <div className="mt-3 md:mt-8">
          <div className="md:hidden">
            <ClubNotice compact />
          </div>
          <div className="hidden md:block">
            <ClubNotice />
          </div>
        </div>

        <div className="mt-4 md:hidden">
          <Tabs defaultValue="open-play">
            <TabsList className="grid h-auto w-full grid-cols-3 gap-1 p-1">
              <TabsTrigger value="open-play" className="px-1 py-2 text-xs font-bold">
                כניסה למועדון
              </TabsTrigger>
              <TabsTrigger value="kids" className="px-1 py-2 text-xs font-bold">
                חוג ילדים
              </TabsTrigger>
              <TabsTrigger value="training" className="px-1 py-2 text-xs font-bold">
                אימונים
              </TabsTrigger>
            </TabsList>
            <TabsContent value="open-play" className="mt-3">
              <PricingCategoryBlock plans={openPlayPlans} columns="lg:grid-cols-3" />
            </TabsContent>
            <TabsContent value="kids" className="mt-3">
              <PricingCategoryBlock plans={kidsPlans} />
            </TabsContent>
            <TabsContent value="training" className="mt-3">
              <PricingCategoryBlock plans={trainingPlans} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="hidden md:block">
          <div className="mt-10">
            <FadeIn preset="section" immediate index={1}>
              <h3 className="text-xl font-bold text-foreground">{openPlayCategory?.title}</h3>
              {openPlayCategory?.lead && (
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
                  {openPlayCategory.lead}
                </p>
              )}
            </FadeIn>
            <div className="mt-6">
              <PricingPlansGrid plans={openPlayPlans} columns="lg:grid-cols-3" />
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
            <div className="mt-6">
              <PricingPlansGrid plans={kidsPlans} />
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
            <div className="mt-6">
              <PricingPlansGrid plans={trainingPlans} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
