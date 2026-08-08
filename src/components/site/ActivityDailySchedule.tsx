import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  MessageCircle,
  UserPlus,
  Users,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  ACTIVITIES_CATEGORIES,
  ACTIVITIES_WHATSAPP_RESERVE_HINT,
  ACTIVITIES_WHATSAPP_RESERVE_LABEL,
  ACTIVITIES_REGISTER_LESSON_LABEL,
  TABLE_TENNIS_CLUB_NOTICE,
  getTableTennisPrivateTableWhatsAppUrl,
  type ActivityCategoryId,
  type ActivityScheduleSlot,
} from "@/data/activities";
import { getScheduleByCategory, getActivityPricingHref } from "@/lib/activities";
import type { ActivityPass } from "@/data/passes";
import { CustomerPassQuickRegister } from "@/components/site/CustomerPassesPanel";
import { TableTennisTrainingMedia } from "@/components/site/TableTennisTrainingMedia";
import {
  addDays,
  buildActivityReservationWhatsAppUrl,
  countSlotsOnDate,
  findNextDateWithSlots,
  formatScheduleDateIso,
  formatScheduleDateLong,
  formatScheduleStripLabel,
  getSeasonalSlots,
  getSlotsForDate,
  getUpcomingScheduleDays,
  isSameDay,
  startOfDay,
} from "@/lib/activitySchedule";
import { cn } from "@/lib/utils";

type ActivityDailyScheduleProps = {
  categoryId: ActivityCategoryId;
  onCategoryChange: (id: ActivityCategoryId) => void;
  categoryIds: ActivityCategoryId[];
  customerToken?: string;
  passes?: ActivityPass[];
  onPassesChange?: (passes: ActivityPass[]) => void;
  adminMode?: boolean;
  onAdminRegisterSlot?: (slot: ActivityScheduleSlot, sessionDate: string) => void;
  /** Override in-page pricing anchor (e.g. kids area uses #pricing). */
  pricingHref?: string;
  showCategoryNav?: boolean;
};

function CategoryNav({
  activeId,
  onSelect,
  ids,
}: {
  activeId: ActivityCategoryId;
  onSelect: (id: ActivityCategoryId) => void;
  ids: ActivityCategoryId[];
}) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="קטגוריות פעילות">
      {ids.map((id) => {
        const category = ACTIVITIES_CATEGORIES.find((c) => c.id === id);
        if (!category) return null;
        const isActive = activeId === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(id)}
            className={cn(
              "rounded-lg px-2.5 py-2 text-xs font-semibold transition md:px-4 md:py-2.5 md:text-sm",
              isActive
                ? "bg-accent text-accent-foreground shadow-sm"
                : "bg-card border border-border text-foreground hover:border-accent/40 hover:text-accent",
            )}
          >
            {category.title}
          </button>
        );
      })}
    </div>
  );
}

function TableTennisClubNotice() {
  const privateTableUrl = getTableTennisPrivateTableWhatsAppUrl();

  const noticeBody = (
    <>
      <ul className="space-y-1.5 text-xs leading-snug text-muted-foreground md:space-y-2 md:text-sm md:leading-relaxed">
        {TABLE_TENNIS_CLUB_NOTICE.points.map((point) => (
          <li key={point} className="flex gap-2 md:list-item md:list-disc md:list-inside">
            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent md:hidden" aria-hidden />
            {point}
          </li>
        ))}
      </ul>
      <div className="rounded-lg border border-border bg-secondary/40 p-3 md:p-4">
        <p className="text-xs leading-snug text-muted-foreground md:text-sm md:leading-relaxed">
          {TABLE_TENNIS_CLUB_NOTICE.privateTableLead}
        </p>
        <Button asChild variant="outline" size="sm" className="mt-2 w-full font-semibold md:mt-3 sm:w-auto">
          <a href={privateTableUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={14} className="md:size-4" />
            {TABLE_TENNIS_CLUB_NOTICE.privateTableCta}
          </a>
        </Button>
        <p className="mt-1.5 hidden text-xs text-muted-foreground md:block">
          {ACTIVITIES_WHATSAPP_RESERVE_HINT}
        </p>
      </div>
    </>
  );

  return (
    <>
      <details className="group mt-3 rounded-lg border-2 border-accent/35 bg-card p-3 open:pb-3 md:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-bold text-foreground [&::-webkit-details-marker]:hidden">
          {TABLE_TENNIS_CLUB_NOTICE.title}
          <ChevronDown
            size={16}
            className="shrink-0 text-muted-foreground transition group-open:rotate-180"
            aria-hidden
          />
        </summary>
        <div className="mt-2 space-y-3">{noticeBody}</div>
      </details>

      <div className="mt-6 hidden space-y-4 rounded-xl border-2 border-accent/35 bg-card p-4 md:block md:p-5">
        <h4 className="text-base font-bold text-foreground md:text-lg">
          {TABLE_TENNIS_CLUB_NOTICE.title}
        </h4>
        {noticeBody}
      </div>
    </>
  );
}

function DailySessionCard({
  slot,
  date,
  categoryTitle,
  isClubEntry = false,
  customerToken,
  passes = [],
  onPassRedeemed,
  adminMode = false,
  onAdminRegisterSlot,
  pricingHref,
}: {
  slot: ActivityScheduleSlot;
  date: Date;
  categoryTitle: string;
  isClubEntry?: boolean;
  customerToken?: string;
  passes?: ActivityPass[];
  onPassRedeemed?: (pass: ActivityPass) => void;
  adminMode?: boolean;
  onAdminRegisterSlot?: (slot: ActivityScheduleSlot, sessionDate: string) => void;
  pricingHref?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const whatsappUrl = buildActivityReservationWhatsAppUrl(slot, date, categoryTitle);
  const registerHref = pricingHref ?? getActivityPricingHref(slot.categoryId);
  const actionsId = `session-actions-${slot.id}-${formatScheduleDateIso(date)}`;

  return (
    <article
      className={cn(
        "overflow-hidden rounded-xl border-2 bg-card transition",
        expanded ? "border-accent/50" : "border-border hover:border-accent/40",
      )}
    >
      <div className="flex flex-col sm:flex-row">
        <div className="flex shrink-0 items-center justify-center gap-1 border-b border-border bg-accent/10 px-4 py-3 text-center sm:min-w-[120px] sm:flex-col sm:border-b-0 sm:border-s sm:px-5 sm:py-4">
          <Clock size={18} className="mb-1 hidden text-accent sm:block" aria-hidden />
          <p className="text-lg font-black tabular-nums text-foreground sm:text-2xl" dir="ltr">
            {slot.timeStart}
          </p>
          <p className="text-[11px] font-semibold text-muted-foreground sm:text-xs">עד {slot.timeEnd}</p>
        </div>

        <div className="min-w-0 flex-1">
          <button
            type="button"
            className="w-full p-3 text-start sm:p-5"
            aria-expanded={expanded}
            aria-controls={actionsId}
            onClick={() => setExpanded((open) => !open)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="mb-0.5 text-[11px] font-bold text-accent sm:mb-1 sm:text-xs">
                  {formatScheduleDateLong(date)}
                </p>
                <h3 className="text-base font-bold text-foreground sm:text-lg">{slot.title}</h3>
                {isClubEntry && (
                  <p className="mt-1 text-[11px] font-semibold text-accent sm:text-xs">
                    כניסה למועדון · לא השכרת שולחן פרטי
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
                  {slot.ageRange && (
                    <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[11px] font-semibold text-foreground sm:px-2.5 sm:py-1 sm:text-xs">
                      גילאים {slot.ageRange}
                    </span>
                  )}
                  {slot.level && (
                    <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[11px] font-semibold text-foreground sm:px-2.5 sm:py-1 sm:text-xs">
                      {slot.level}
                    </span>
                  )}
                  {slot.groupSize && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-[11px] font-semibold text-foreground sm:px-2.5 sm:py-1 sm:text-xs">
                      <Users size={12} aria-hidden />
                      {slot.groupSize}
                    </span>
                  )}
                </div>
                {slot.notes && !expanded && (
                  <p className="mt-2 line-clamp-1 text-xs text-muted-foreground sm:mt-3 sm:text-sm">
                    {slot.notes}
                  </p>
                )}
              </div>
              <span
                className={cn(
                  "mt-0.5 flex shrink-0 items-center gap-1 rounded-md border border-border px-2 py-1 text-[10px] font-bold text-muted-foreground sm:text-xs",
                  expanded && "border-accent/40 text-accent",
                )}
              >
                {expanded ? "סגור" : "הרשמה"}
                <ChevronDown
                  size={14}
                  className={cn("transition", expanded && "rotate-180")}
                  aria-hidden
                />
              </span>
            </div>
          </button>

          {expanded && (
            <div id={actionsId} className="border-t border-border px-3 pb-3 pt-3 sm:px-5 sm:pb-5">
              {slot.notes && (
                <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{slot.notes}</p>
              )}
              {adminMode ? (
                onAdminRegisterSlot ? (
                  <Button
                    type="button"
                    className="w-full font-bold sm:w-auto"
                    onClick={() => onAdminRegisterSlot(slot, formatScheduleDateIso(date))}
                  >
                    <UserPlus size={16} />
                    רישום לקוח לשיעור
                  </Button>
                ) : null
              ) : (
                <>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button asChild className="flex-1 font-bold sm:self-start">
                      <a href={registerHref}>
                        <UserPlus size={16} />
                        {ACTIVITIES_REGISTER_LESSON_LABEL}
                      </a>
                    </Button>
                    <div className="flex-1">
                      <Button asChild variant="outline" className="w-full font-semibold">
                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                          <MessageCircle size={16} />
                          {ACTIVITIES_WHATSAPP_RESERVE_LABEL}
                        </a>
                      </Button>
                      <p className="mt-1.5 text-center text-xs text-muted-foreground sm:text-start">
                        {ACTIVITIES_WHATSAPP_RESERVE_HINT}
                      </p>
                    </div>
                  </div>
                  <CustomerPassQuickRegister
                    passes={passes}
                    customerToken={customerToken}
                    categoryId={slot.categoryId}
                    slotId={slot.id}
                    sessionDate={formatScheduleDateIso(date)}
                    onRedeemed={(pass) => {
                      onPassRedeemed?.(pass);
                    }}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function SeasonalCard({
  slot,
  adminMode = false,
  pricingHref,
}: {
  slot: ActivityScheduleSlot;
  adminMode?: boolean;
  pricingHref?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const registerHref = pricingHref ?? getActivityPricingHref(slot.categoryId);
  const actionsId = `seasonal-actions-${slot.id}`;

  return (
    <article
      className={cn(
        "rounded-xl border bg-card transition",
        expanded ? "border-accent/50" : "border-border hover:border-accent/40",
      )}
    >
      <button
        type="button"
        className="w-full p-4 text-start sm:p-5"
        aria-expanded={expanded}
        aria-controls={actionsId}
        onClick={() => setExpanded((open) => !open)}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-accent">{slot.day}</p>
            <h3 className="mt-1 text-base font-bold text-foreground sm:text-lg">{slot.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {slot.timeStart}–{slot.timeEnd}
              {slot.ageRange ? ` · גילאים ${slot.ageRange}` : ""}
            </p>
          </div>
          <span
            className={cn(
              "mt-0.5 flex shrink-0 items-center gap-1 rounded-md border border-border px-2 py-1 text-[10px] font-bold text-muted-foreground sm:text-xs",
              expanded && "border-accent/40 text-accent",
            )}
          >
            {expanded ? "סגור" : "הרשמה"}
            <ChevronDown
              size={14}
              className={cn("transition", expanded && "rotate-180")}
              aria-hidden
            />
          </span>
        </div>
      </button>
      {expanded && (
        <div id={actionsId} className="border-t border-border px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
          {slot.notes && (
            <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{slot.notes}</p>
          )}
          {!adminMode && (
            <Button asChild className="font-bold">
              <a href={registerHref}>
                <UserPlus size={16} />
                {ACTIVITIES_REGISTER_LESSON_LABEL}
              </a>
            </Button>
          )}
        </div>
      )}
    </article>
  );
}

function ScheduleAccountPrompt() {
  return (
    <div className="mt-4 rounded-lg border border-border bg-card px-3 py-2.5 text-center md:mt-6 md:px-4 md:py-3">
      <p className="text-xs text-muted-foreground md:text-sm">
        יש לכם מנוי או כרטיסייה?{" "}
        <Link to="/account" className="font-bold text-accent hover:underline">
          היכנסו לחשבון
        </Link>{" "}
        לצפייה ברכישות האחרונות ובמנויים הפעילים.
      </p>
    </div>
  );
}

export function ActivityDailySchedule({
  categoryId,
  onCategoryChange,
  categoryIds,
  customerToken,
  passes = [],
  onPassesChange,
  adminMode = false,
  onAdminRegisterSlot,
  pricingHref,
  showCategoryNav = true,
}: ActivityDailyScheduleProps) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [selectedDate, setSelectedDate] = useState(today);
  const stripRef = useRef<HTMLDivElement>(null);

  const allSlots = useMemo(() => getScheduleByCategory(categoryId), [categoryId]);
  const weeklySlots = useMemo(
    () => allSlots.filter((s) => s.scheduleType === "weekly"),
    [allSlots],
  );
  const seasonalSlots = useMemo(() => getSeasonalSlots(allSlots), [allSlots]);
  const isSeasonalOnly = weeklySlots.length === 0 && seasonalSlots.length > 0;

  const calendarDays = useMemo(() => getUpcomingScheduleDays(), []);
  const daySessions = useMemo(
    () => getSlotsForDate(weeklySlots, selectedDate),
    [weeklySlots, selectedDate],
  );

  const isTableTennis = categoryId === "table-tennis";
  const isTableTennisTraining = categoryId === "table-tennis-training";
  const sessionUnitLabel = isTableTennis ? "משבצות כניסה" : "שיעורים";
  const activeCategory = ACTIVITIES_CATEGORIES.find((c) => c.id === categoryId);

  useEffect(() => {
    const slots = getScheduleByCategory(categoryId).filter((s) => s.scheduleType === "weekly");
    const next = findNextDateWithSlots(slots, today) ?? today;
    setSelectedDate(next);
  }, [categoryId, today]);

  function scrollStripBy(direction: -1 | 1) {
    stripRef.current?.scrollBy({ left: direction * 220, behavior: "smooth" });
  }

  function goToPrevDay() {
    const idx = calendarDays.findIndex((d) => isSameDay(d, selectedDate));
    if (idx > 0) setSelectedDate(calendarDays[idx - 1]!);
  }

  function goToNextDay() {
    const idx = calendarDays.findIndex((d) => isSameDay(d, selectedDate));
    if (idx >= 0 && idx < calendarDays.length - 1) setSelectedDate(calendarDays[idx + 1]!);
  }

  function handlePassRedeemed(pass: ActivityPass) {
    onPassesChange?.(
      passes.map((row) => (row.id === pass.id ? pass : row)),
    );
  }

  return (
    <div>
      {showCategoryNav && categoryIds.length > 1 && (
        <div className="sticky top-[72px] z-30 -mx-3 border-y border-border/60 bg-secondary/95 px-3 py-2 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:py-0 lg:static">
          <CategoryNav activeId={categoryId} onSelect={onCategoryChange} ids={categoryIds} />
        </div>
      )}

      {activeCategory && categoryIds.length > 1 && (
        <div className="mt-2 hidden rounded-lg border border-accent/30 bg-accent/5 p-2 md:mt-6 md:block md:rounded-xl md:p-5">
          <h3 className="text-sm font-bold text-foreground md:text-lg">{activeCategory.title}</h3>
          <p className="mt-1 hidden text-sm leading-relaxed text-muted-foreground md:block">
            {activeCategory.lead}
          </p>
        </div>
      )}

      {/* Mobile: video as hero above the schedule. Desktop: side-by-side above. */}
      {isTableTennisTraining && (
        <>
          <div className="mt-2 md:hidden">
            <TableTennisTrainingMedia compact layout="video-only" />
          </div>
          <div className="mt-4 hidden md:block">
            <TableTennisTrainingMedia compact layout="side-by-side" />
          </div>
        </>
      )}

      {isTableTennis && !adminMode && <TableTennisClubNotice />}

      {!adminMode && <ScheduleAccountPrompt />}

      {isSeasonalOnly ? (
        <div className="mt-4 space-y-4 md:mt-6">
          <p className="text-sm text-muted-foreground">
            קייטנות ואירועים עונתיים - תאריכים מדויקים יפורסמו לפני כל חופשה.
          </p>
          {seasonalSlots.map((slot) => (
            <SeasonalCard key={slot.id} slot={slot} adminMode={adminMode} />
          ))}
        </div>
      ) : (
        <>
          {/* Selected date header */}
          <div className="mt-3 rounded-xl border-2 border-accent/40 bg-card p-3 md:mt-6 md:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 md:gap-4">
              <div className="flex items-start gap-2 md:gap-3">
                <CalendarDays className="mt-0.5 shrink-0 text-accent md:size-[22px]" size={18} aria-hidden />
                <div>
                  <p className="hidden text-xs font-bold uppercase tracking-wider text-muted-foreground md:block">
                    {isTableTennis ? "אתם שוריינים כניסה לתאריך" : "אתם נרשמים לתאריך"}
                  </p>
                  <p className="text-base font-black text-foreground md:mt-0.5 md:text-2xl">
                    {formatScheduleDateLong(selectedDate)}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground md:mt-1 md:text-sm">
                    {daySessions.length === 0
                      ? `אין ${sessionUnitLabel} ביום זה - בחרו יום אחר מהלוח`
                      : `${daySessions.length} ${sessionUnitLabel} ביום שנבחר`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={goToPrevDay}
                  aria-label="יום קודם"
                  className="shrink-0"
                >
                  <ChevronRight size={18} />
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedDate(today)}
                  className="text-xs font-semibold md:text-sm"
                >
                  היום
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={goToNextDay}
                  aria-label="יום הבא"
                  className="shrink-0"
                >
                  <ChevronLeft size={18} />
                </Button>
              </div>
            </div>
          </div>

          {/* Day strip */}
          <div className="relative mt-2 md:mt-4">
            <div
              ref={stripRef}
              className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin"
              role="listbox"
              aria-label="בחירת תאריך"
            >
              {calendarDays.map((day) => {
                const { weekday, day: dayNum, month } = formatScheduleStripLabel(day);
                const selected = isSameDay(day, selectedDate);
                const isToday = isSameDay(day, today);
                const sessionCount = countSlotsOnDate(weeklySlots, day);

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "snap-start shrink-0 flex flex-col items-center justify-center min-w-[4.5rem] px-3 py-3 rounded-xl border-2 transition",
                      selected
                        ? "border-accent bg-accent text-accent-foreground shadow-md"
                        : sessionCount > 0
                          ? "border-border bg-card hover:border-accent/50"
                          : "border-border/60 bg-card/50 text-muted-foreground hover:border-border",
                    )}
                  >
                    <span className="text-[10px] font-semibold uppercase">{weekday}</span>
                    <span className="text-xl font-black leading-none mt-0.5">{dayNum}</span>
                    <span className="text-[10px] mt-0.5 opacity-80">{month}</span>
                    {sessionCount > 0 && (
                      <span
                        className={cn(
                          "mt-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                          selected ? "bg-accent-foreground/20" : "bg-accent/15 text-accent",
                        )}
                      >
                        {sessionCount} {isTableTennis ? "משבצות" : "שיעורים"}
                      </span>
                    )}
                    {isToday && !selected && (
                      <span className="mt-1 text-[9px] font-bold text-accent">היום</span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="hidden md:flex absolute inset-y-0 start-0 items-center">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="rounded-full shadow -translate-x-1/2"
                onClick={() => scrollStripBy(-1)}
                aria-label="גלילה אחורה"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
            <div className="hidden md:flex absolute inset-y-0 end-0 items-center">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="rounded-full shadow translate-x-1/2"
                onClick={() => scrollStripBy(1)}
                aria-label="גלילה קדימה"
              >
                <ChevronLeft size={16} />
              </Button>
            </div>
          </div>

          {/* Sessions for selected day */}
          <div className="mt-4 space-y-2 md:mt-6 md:space-y-4" role="tabpanel">
            {daySessions.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card/50 py-12 px-6 text-center">
                <p className="font-semibold text-foreground">
                  {isTableTennis ? "אין משבצות כניסה בתאריך זה" : "אין שיעורים בתאריך זה"}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  בחרו יום אחר מהלוח למעלה, או פנו אלינו בוואטסאפ לתיאום.
                </p>
                {findNextDateWithSlots(weeklySlots, addDays(selectedDate, 1)) && (
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 font-semibold"
                    onClick={() => {
                      const next = findNextDateWithSlots(weeklySlots, addDays(selectedDate, 1));
                      if (next) setSelectedDate(next);
                    }}
                  >
                    ליום הקרוב עם {isTableTennis ? "משבצות" : "שיעורים"}
                  </Button>
                )}
              </div>
            ) : (
              daySessions.map((slot) => (
                <DailySessionCard
                  key={`${slot.id}-${selectedDate.toISOString()}`}
                  slot={slot}
                  date={selectedDate}
                  categoryTitle={activeCategory?.title ?? ""}
                  isClubEntry={isTableTennis}
                  customerToken={customerToken}
                  passes={passes}
                  onPassRedeemed={handlePassRedeemed}
                  adminMode={adminMode}
                  onAdminRegisterSlot={onAdminRegisterSlot}
                  pricingHref={pricingHref}
                />
              ))
            )}
          </div>

          {seasonalSlots.length > 0 && (
            <div className="mt-10 border-t border-border pt-8">
              <h4 className="mb-4 font-bold text-foreground">קייטנות ואירועים עונתיים</h4>
              <div className="space-y-4">
                {seasonalSlots.map((slot) => (
                  <SeasonalCard key={slot.id} slot={slot} adminMode={adminMode} pricingHref={pricingHref} />
                ))}
              </div>
            </div>
          )}

          {/* Mobile: training photo at the bottom so the schedule stays central */}
          {isTableTennisTraining && (
            <div className="mt-6 md:hidden">
              <TableTennisTrainingMedia compact layout="image-only" />
            </div>
          )}
        </>
      )}

      {isSeasonalOnly && isTableTennisTraining && (
        <div className="mt-6 md:hidden">
          <TableTennisTrainingMedia compact layout="image-only" />
        </div>
      )}
    </div>
  );
}
