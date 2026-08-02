import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  MessageCircle,
  UserPlus,
  Users,
} from "lucide-react";
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
              "px-4 py-2.5 text-sm font-semibold transition rounded-lg",
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

  return (
    <div className="mt-6 rounded-xl border-2 border-accent/35 bg-card p-4 md:p-5 space-y-4">
      <h4 className="font-bold text-foreground text-base md:text-lg">{TABLE_TENNIS_CLUB_NOTICE.title}</h4>
      <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
        {TABLE_TENNIS_CLUB_NOTICE.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <div className="rounded-lg border border-border bg-secondary/40 p-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {TABLE_TENNIS_CLUB_NOTICE.privateTableLead}
        </p>
        <Button asChild variant="outline" className="mt-3 font-semibold w-full sm:w-auto">
          <a href={privateTableUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={16} />
            {TABLE_TENNIS_CLUB_NOTICE.privateTableCta}
          </a>
        </Button>
        <p className="mt-2 text-xs text-muted-foreground">{ACTIVITIES_WHATSAPP_RESERVE_HINT}</p>
      </div>
    </div>
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
}) {
  const whatsappUrl = buildActivityReservationWhatsAppUrl(slot, date, categoryTitle);
  const pricingHref = getActivityPricingHref(slot.categoryId);

  return (
    <article className="rounded-xl border-2 border-border bg-card overflow-hidden hover:border-accent/40 transition">
      <div className="flex flex-col sm:flex-row">
        <div className="bg-accent/10 border-b sm:border-b-0 sm:border-s border-border px-5 py-4 sm:py-5 sm:min-w-[140px] flex sm:flex-col items-center justify-center gap-1 text-center shrink-0">
          <Clock size={20} className="text-accent mb-1 hidden sm:block" aria-hidden />
          <p className="text-xl sm:text-2xl font-black text-foreground tabular-nums" dir="ltr">
            {slot.timeStart}
          </p>
          <p className="text-xs font-semibold text-muted-foreground">עד {slot.timeEnd}</p>
        </div>
        <div className="flex-1 p-5">
          <p className="text-xs font-bold text-accent mb-1">{formatScheduleDateLong(date)}</p>
          <h3 className="text-lg font-bold text-foreground">{slot.title}</h3>
          {isClubEntry && (
            <p className="mt-1 text-xs font-semibold text-accent">
              כניסה למועדון · לא השכרת שולחן פרטי
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {slot.ageRange && (
              <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground">
                גילאים {slot.ageRange}
              </span>
            )}
            {slot.level && (
              <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground">
                {slot.level}
              </span>
            )}
            {slot.groupSize && (
              <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground">
                <Users size={12} aria-hidden />
                {slot.groupSize}
              </span>
            )}
          </div>
          {slot.notes && (
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{slot.notes}</p>
          )}
          {adminMode ? (
            onAdminRegisterSlot ? (
              <div className="mt-4">
                <Button
                  type="button"
                  className="font-bold w-full sm:w-auto"
                  onClick={() =>
                    onAdminRegisterSlot(slot, formatScheduleDateIso(date))
                  }
                >
                  <UserPlus size={16} />
                  רישום לקוח לשיעור
                </Button>
              </div>
            ) : null
          ) : (
            <>
              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <Button asChild className="font-bold flex-1 sm:self-start">
                  <a href={pricingHref}>
                    <UserPlus size={16} />
                    {ACTIVITIES_REGISTER_LESSON_LABEL}
                  </a>
                </Button>
                <div className="flex-1">
                  <Button asChild variant="outline" className="font-semibold w-full">
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                      <MessageCircle size={16} />
                      {ACTIVITIES_WHATSAPP_RESERVE_LABEL}
                    </a>
                  </Button>
                  <p className="mt-1.5 text-xs text-muted-foreground text-center sm:text-start">
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
      </div>
    </article>
  );
}

function SeasonalCard({
  slot,
  adminMode = false,
}: {
  slot: ActivityScheduleSlot;
  adminMode?: boolean;
}) {
  const pricingHref = getActivityPricingHref(slot.categoryId);
  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <p className="text-xs font-bold text-accent">{slot.day}</p>
      <h3 className="mt-1 text-lg font-bold text-foreground">{slot.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {slot.timeStart}–{slot.timeEnd}
        {slot.ageRange ? ` · גילאים ${slot.ageRange}` : ""}
      </p>
      {slot.notes && (
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{slot.notes}</p>
      )}
      {!adminMode && (
        <Button asChild className="mt-4 font-bold">
          <a href={pricingHref}>
            <UserPlus size={16} />
            {ACTIVITIES_REGISTER_LESSON_LABEL}
          </a>
        </Button>
      )}
    </article>
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
      <div className="sticky top-[72px] z-30 py-3 -mx-4 px-4 bg-secondary/95 backdrop-blur border-y border-border/60 lg:static lg:bg-transparent lg:border-0 lg:py-0 lg:mx-0 lg:px-0">
        <CategoryNav activeId={categoryId} onSelect={onCategoryChange} ids={categoryIds} />
      </div>

      {activeCategory && (
        <div className="mt-6 rounded-xl border border-accent/30 bg-accent/5 p-4 md:p-5">
          <h3 className="font-bold text-foreground text-lg">{activeCategory.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{activeCategory.lead}</p>
        </div>
      )}

      {isTableTennis && !adminMode && <TableTennisClubNotice />}

      {isSeasonalOnly ? (
        <div className="mt-6 space-y-4">
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
          <div className="mt-6 rounded-xl border-2 border-accent/40 bg-card p-4 md:p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <CalendarDays className="text-accent shrink-0 mt-0.5" size={22} aria-hidden />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {isTableTennis ? "אתם שוריינים כניסה לתאריך" : "אתם נרשמים לתאריך"}
                  </p>
                  <p className="text-xl md:text-2xl font-black text-foreground mt-0.5">
                    {formatScheduleDateLong(selectedDate)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
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
                  onClick={() => setSelectedDate(today)}
                  className="font-semibold text-sm"
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
          <div className="mt-4 relative">
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
          <div className="mt-6 space-y-4" role="tabpanel">
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
                />
              ))
            )}
          </div>

          {seasonalSlots.length > 0 && (
            <div className="mt-10 pt-8 border-t border-border">
              <h4 className="font-bold text-foreground mb-4">קייטנות ואירועים עונתיים</h4>
              <div className="space-y-4">
                {seasonalSlots.map((slot) => (
                  <SeasonalCard key={slot.id} slot={slot} adminMode={adminMode} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
