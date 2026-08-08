import { useState } from "react";
import { ArrowRight, DoorOpen, Users } from "lucide-react";
import { ActivityPricingCard } from "@/components/site/ActivityPricingCard";
import { FadeIn } from "@/components/site/FadeIn";
import { TableTennisTrainingMedia } from "@/components/site/TableTennisTrainingMedia";
import { TABLE_TENNIS_CLUB_NOTICE } from "@/data/activities";
import { buildGroupLessonPricingPlans } from "@/data/groupLessonPricing";
import {
  TABLE_TENNIS_LESSON_PROGRAMS,
  TABLE_TENNIS_PRICING_INTRO,
  TABLE_TENNIS_PRICING_PATHS,
  TABLE_TENNIS_PRICING_SECTION_ID,
  type TableTennisPricingPathId,
} from "@/data/tableTennis";
import { getPricingByCategory } from "@/lib/activities";
import type { ActivityPricingPlan } from "@/data/activities";
import { cn } from "@/lib/utils";

const openPlayPlans = getPricingByCategory("table-tennis");
const kidsPlans = buildGroupLessonPricingPlans("table-tennis-kids");
const trainingPlans = buildGroupLessonPricingPlans("table-tennis-training");

type LessonProgramId = (typeof TABLE_TENNIS_LESSON_PROGRAMS)[number]["id"];

const LESSON_PLANS: Record<LessonProgramId, ActivityPricingPlan[]> = {
  "table-tennis-kids": kidsPlans,
  "table-tennis-training": trainingPlans,
};

const PATH_ICONS = {
  "club-entry": DoorOpen,
  lessons: Users,
} as const;

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

function PricingPathSelector({
  activePath,
  onSelect,
}: {
  activePath: TableTennisPricingPathId;
  onSelect: (path: TableTennisPricingPathId) => void;
}) {
  return (
    <div
      className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:gap-4"
      role="tablist"
      aria-label="סוג הרשמה"
    >
      {TABLE_TENNIS_PRICING_PATHS.map((path) => {
        const Icon = PATH_ICONS[path.id];
        const isActive = activePath === path.id;

        return (
          <button
            key={path.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(path.id)}
            className={cn(
              "rounded-xl border-2 p-3 text-start transition md:p-5",
              isActive
                ? "border-accent bg-accent/10 shadow-sm"
                : "border-border bg-card hover:border-accent/40",
            )}
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg md:size-11",
                  isActive ? "bg-accent text-accent-foreground" : "bg-secondary text-foreground",
                )}
                aria-hidden
              >
                <Icon size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-foreground md:text-lg">{path.title}</p>
                <p className="mt-0.5 text-xs font-semibold text-accent md:text-sm">{path.tagline}</p>
                <p className="mt-1.5 text-xs leading-snug text-muted-foreground md:mt-2 md:text-sm md:leading-relaxed">
                  {path.whoIsItFor}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function PathDetailsList({ pathId }: { pathId: TableTennisPricingPathId }) {
  const path = TABLE_TENNIS_PRICING_PATHS.find((item) => item.id === pathId);
  if (!path) return null;

  return (
    <ul className="mt-3 space-y-1.5 rounded-lg border border-border bg-secondary/30 p-3 md:mt-4 md:p-4">
      {path.details.map((detail) => (
        <li key={detail} className="flex gap-2 text-xs leading-snug text-foreground md:text-sm">
          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
          {detail}
        </li>
      ))}
    </ul>
  );
}

function ClubEntryPanel() {
  return (
    <div role="tabpanel" aria-label="כניסה למועדון">
      <PathDetailsList pathId="club-entry" />

      <div className="mt-3 rounded-lg border border-accent/30 bg-accent/5 p-3 md:mt-6 md:rounded-xl md:p-5">
        <h3 className="text-sm font-bold text-foreground md:text-base">
          {TABLE_TENNIS_CLUB_NOTICE.title}
        </h3>
        <ul className="mt-2 space-y-1.5">
          {TABLE_TENNIS_CLUB_NOTICE.points.map((point) => (
            <li key={point} className="flex gap-2 text-xs leading-snug text-foreground md:text-sm">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" aria-hidden />
              {point}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 md:mt-6">
        <h3 className="text-sm font-bold text-foreground md:text-lg">בחרו אופן תשלום</h3>
        <p className="mt-1 text-xs text-muted-foreground md:text-sm">
          כניסה חד-פעמית, כרטיסייה או מנוי חודשי — לפי מה שנוח לכם.
        </p>
        <div className="mt-3 md:mt-4">
          <PricingPlansGrid plans={openPlayPlans} columns="lg:grid-cols-3" />
        </div>
      </div>
    </div>
  );
}

function LessonAudienceSelector({
  activeProgram,
  onSelect,
}: {
  activeProgram: LessonProgramId | null;
  onSelect: (programId: LessonProgramId) => void;
}) {
  return (
    <div>
      <h3 className="text-sm font-bold text-foreground md:text-base">למי מיועד החוג?</h3>
      <p className="mt-1 text-xs text-muted-foreground md:text-sm">
        בחרו את הקהל — ותגיעו ישר למחירון המתאים.
      </p>
      <div
        className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2"
        role="radiogroup"
        aria-label="בחירת קהל יעד לחוג"
      >
        {TABLE_TENNIS_LESSON_PROGRAMS.map((program) => {
          const isActive = activeProgram === program.id;

          return (
            <button
              key={program.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => onSelect(program.id)}
              className={cn(
                "rounded-xl border-2 p-3 text-start transition md:p-4",
                isActive
                  ? "border-accent bg-accent/10 shadow-sm"
                  : "border-border bg-card hover:border-accent/40",
              )}
            >
              <p className="text-sm font-black text-foreground md:text-base">{program.choiceLabel}</p>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">{program.audience}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LessonPricingBlock({
  programId,
  plans,
  onBack,
}: {
  programId: LessonProgramId;
  plans: ActivityPricingPlan[];
  onBack: () => void;
}) {
  const program = TABLE_TENNIS_LESSON_PROGRAMS.find((item) => item.id === programId);
  if (!program) return null;

  return (
    <div className="mt-4 md:mt-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline md:text-sm"
      >
        <ArrowRight size={14} aria-hidden />
        חזרה לבחירת חוג
      </button>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-bold text-foreground md:text-lg">{program.choiceLabel}</h3>
        <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-semibold text-foreground md:text-xs">
          {program.audience}
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground md:text-sm">{program.scheduleHint}</p>

      {programId === "table-tennis-training" && (
        <div className="mt-3">
          <TableTennisTrainingMedia compact />
        </div>
      )}

      <div className="mt-3 md:mt-4">
        <PricingPlansGrid plans={plans} />
      </div>
    </div>
  );
}

function GroupTrainingPanel() {
  const [lessonProgram, setLessonProgram] = useState<LessonProgramId | null>(null);

  return (
    <div role="tabpanel" aria-label="אימוני טניס שולחן קבוצתיים">
      <PathDetailsList pathId="lessons" />

      <LessonAudienceSelector activeProgram={lessonProgram} onSelect={setLessonProgram} />

      {lessonProgram && (
        <LessonPricingBlock
          programId={lessonProgram}
          plans={LESSON_PLANS[lessonProgram]}
          onBack={() => setLessonProgram(null)}
        />
      )}
    </div>
  );
}

export function TableTennisPricingSection() {
  const [activePath, setActivePath] = useState<TableTennisPricingPathId>("club-entry");

  function handlePathSelect(path: TableTennisPricingPathId) {
    setActivePath(path);
  }

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
          <p className="mt-1 max-w-2xl text-xs leading-snug text-muted-foreground md:mt-2 md:text-base md:leading-relaxed">
            {TABLE_TENNIS_PRICING_INTRO}
          </p>
        </FadeIn>

        <div className="mt-3 md:mt-8">
          <PricingPathSelector activePath={activePath} onSelect={handlePathSelect} />
        </div>

        <div className="mt-4 md:mt-6">
          {activePath === "club-entry" ? <ClubEntryPanel /> : <GroupTrainingPanel />}
        </div>
      </div>
    </section>
  );
}
