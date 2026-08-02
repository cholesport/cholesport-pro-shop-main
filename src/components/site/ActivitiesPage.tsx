import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, MapPin, MessageCircle, ShoppingBag, UserPlus } from "lucide-react";
import { ActivityPricingCard } from "@/components/site/ActivityPricingCard";
import { FadeIn } from "@/components/site/FadeIn";
import { ActivityDailySchedule } from "@/components/site/ActivityDailySchedule";
import { UnifiedGroupLessonPricingBanner } from "@/components/site/UnifiedGroupLessonPricing";
import { Button } from "@/components/ui/button";
import {
  ACTIVITIES_CATEGORIES,
  ACTIVITIES_HERO,
  ACTIVITIES_VENUE,
  getActivitiesWhatsAppUrl,
  type ActivityCategoryId,
} from "@/data/activities";
import { CLUB_PATH } from "@/data/club";
import { GROUP_LESSON_PRICING_SECTION_ID } from "@/data/groupLessonPricing";
import {
  getActivityCategoryById,
  getActivityPricingSectionId,
  getPricingByCategory,
  getScheduleCategoriesWithSlots,
} from "@/lib/activities";
import type { ActivityPass } from "@/data/passes";
import { loadAccountSession } from "@/lib/accountSession";
import { listCustomerPasses } from "@/lib/api/passes.functions";

export function ActivitiesPage() {
  const [scheduleCategory, setScheduleCategory] = useState<ActivityCategoryId>("table-tennis");
  const [passes, setPasses] = useState<ActivityPass[]>([]);
  const [customerToken, setCustomerToken] = useState<string | undefined>();
  const [isAdmin, setIsAdmin] = useState(false);
  const [highlightedPricingCategory, setHighlightedPricingCategory] = useState<string | null>(
    null,
  );
  const pricingCategories = getScheduleCategoriesWithSlots().filter((id) => id !== "camps");
  const clubPricingCategories = pricingCategories.filter((id) => id === "table-tennis");
  const scheduleCategories = ACTIVITIES_CATEGORIES.map((c) => c.id);

  function resolvePricingSectionId(hash: string): string {
    if (hash === GROUP_LESSON_PRICING_SECTION_ID) return hash;
    if (!hash.startsWith("pricing-")) return hash;
    const categoryId = hash.slice("pricing-".length) as ActivityCategoryId;
    return getActivityPricingSectionId(categoryId);
  }

  function renderPricingCategorySection(categoryId: ActivityCategoryId, sectionIndex: number) {
    const category = getActivityCategoryById(categoryId);
    const plans = getPricingByCategory(categoryId);
    const sectionId = getActivityPricingSectionId(categoryId);
    const isHighlighted =
      highlightedPricingCategory === sectionId ||
      highlightedPricingCategory === `pricing-${categoryId}`;
    const gridCols =
      plans.length >= 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : plans.length === 3
          ? "sm:grid-cols-2 lg:grid-cols-3"
          : "sm:grid-cols-2";

    return (
      <div
        key={categoryId}
        id={sectionId}
        className={`mt-10 scroll-mt-24 rounded-2xl transition-colors duration-500 ${
          isHighlighted ? "bg-accent/5 ring-2 ring-accent/40 p-4 md:p-6 -mx-4 md:mx-0" : ""
        }`}
      >
        <FadeIn preset="section" immediate index={sectionIndex + 1}>
          <h3 className="text-xl font-bold text-foreground mb-1">
            {category?.title ?? categoryId}
          </h3>
          {category?.lead && (
            <p className="text-sm text-muted-foreground mb-6 max-w-3xl leading-relaxed">
              {category.lead}
            </p>
          )}
        </FadeIn>

        {plans.length > 0 ? (
          <div className={`grid ${gridCols} gap-4 md:gap-6`}>
            {plans.map((plan, i) => (
              <FadeIn key={plan.id} preset="card" index={i}>
                <ActivityPricingCard plan={plan} />
              </FadeIn>
            ))}
          </div>
        ) : (
          <FadeIn preset="section" immediate className="rounded-xl border border-dashed p-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              להרשמה ופרטים על מחירים בתחום הזה — פנו אלינו בוואטסאפ ונשמח לעזור.
            </p>
            <Button asChild variant="outline" className="mt-4 font-semibold">
              <a href={getActivitiesWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={16} />
                שאלה בוואטסאפ
              </a>
            </Button>
          </FadeIn>
        )}
      </div>
    );
  }

  useEffect(() => {
    function syncPricingHighlight() {
      const hash = window.location.hash.replace("#", "");
      if (!hash.startsWith("pricing-")) return;

      const sectionId = resolvePricingSectionId(hash);
      setHighlightedPricingCategory(sectionId);
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      window.setTimeout(() => setHighlightedPricingCategory(null), 2500);
    }

    syncPricingHighlight();
    window.addEventListener("hashchange", syncPricingHighlight);
    return () => window.removeEventListener("hashchange", syncPricingHighlight);
  }, []);

  useEffect(() => {
    const session = loadAccountSession();
    if (!session) return;
    if (session.isAdmin) {
      setIsAdmin(true);
      return;
    }
    if (!session.customerToken) return;
    setCustomerToken(session.customerToken);
    void listCustomerPasses({ data: { customerToken: session.customerToken } }).then((result) =>
      setPasses(result.passes),
    );
  }, []);

  return (
    <div dir="rtl">
      {/* Hero */}
      <section
        className="relative border-b border-border bg-primary text-primary-foreground overflow-hidden"
        aria-labelledby="activities-hero-heading"
      >
        <div className="absolute inset-0 bg-[linear-gradient(135deg,oklch(0.12_0.02_60)_0%,oklch(0.18_0.03_55)_50%,oklch(0.14_0.02_60)_100%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 md:py-20">
          <FadeIn preset="hero" immediate index={0}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-4">
              {ACTIVITIES_HERO.eyebrow}
            </p>
          </FadeIn>
          <FadeIn preset="hero" immediate index={1} as="h1" id="activities-hero-heading" className="text-3xl md:text-4xl lg:text-5xl font-black max-w-3xl leading-tight">
            {ACTIVITIES_HERO.headline}
          </FadeIn>
          <FadeIn preset="hero" immediate index={2} as="p" className="mt-4 max-w-2xl text-base md:text-lg text-primary-foreground/90 leading-relaxed">
            {ACTIVITIES_HERO.support}
          </FadeIn>
          <FadeIn preset="hero" immediate index={3} className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
            <Button asChild size="lg" className="font-bold bg-accent text-accent-foreground hover:bg-accent/90">
              <a href="#schedule">
                <Calendar size={18} />
                {ACTIVITIES_HERO.registerCta}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-bold border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
              <a href="#pricing">
                {ACTIVITIES_HERO.pricingCta}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-bold border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/categories">
                <ShoppingBag size={18} />
                {ACTIVITIES_HERO.shopCta}
              </Link>
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* Schedule - primary focus */}
      <section id="schedule" className="border-b border-border bg-secondary/30 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <FadeIn preset="section" immediate>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={24} className="text-accent" />
                  <h2 className="text-2xl md:text-4xl font-black text-foreground">לו&quot;ז השיעורים</h2>
                </div>
                <p className="text-muted-foreground max-w-2xl text-base md:text-lg">
                  בחרו קטגוריה, תאריך מהלוח, וראו בדיוק אילו שיעורים מתקיימים באותו יום - עם אפשרות לשריין מקום.
                </p>
              </div>
            </div>
          </FadeIn>

          <ActivityDailySchedule
            categoryId={scheduleCategory}
            onCategoryChange={setScheduleCategory}
            categoryIds={scheduleCategories}
            customerToken={customerToken}
            passes={passes}
            onPassesChange={setPasses}
            adminMode={isAdmin}
          />

          {!isAdmin && (
            <FadeIn preset="section" immediate index={2} className="mt-8 text-center">
              <a
                href="#pricing-table-tennis"
                className="inline-flex items-center gap-1 text-sm font-bold text-accent hover:underline"
              >
                המשיכו למחירון והרשמה
                <ArrowLeft size={14} />
              </a>
            </FadeIn>
          )}
        </div>
      </section>

      {/* Pricing - at the end (hidden for admin — use account panel) */}
      {!isAdmin && (
      <section id="pricing" className="mx-auto max-w-7xl px-4 py-12 md:py-16 scroll-mt-20">
        <FadeIn preset="section" immediate>
          <h2 className="text-2xl md:text-3xl font-black text-foreground">מחירון והרשמה</h2>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            כניסה למועדון טניס השולחן (מתחם הפינגפונג) — מחירון נפרד. חוגים ואימונים קבוצתיים
            (נינג&apos;ה, אימוני טניס שולחן ואימון פונקציונלי) — מחירון אחיד. הכל באותו עמוד
            הרשמה.
          </p>
        </FadeIn>

        {clubPricingCategories.map((categoryId, index) =>
          renderPricingCategorySection(categoryId, index),
        )}

        <UnifiedGroupLessonPricingBanner
          highlighted={highlightedPricingCategory === GROUP_LESSON_PRICING_SECTION_ID}
        />

        <FadeIn preset="section" immediate index={2} className="mt-10 rounded-xl border border-border bg-secondary/40 p-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-bold text-foreground">כניסה למועדון Open Play</span> — מחירון
            נפרד לכניסות ומנוי חופשי (ראו את הסעיף הראשון). חוגים ואימונים קבוצתיים — מחירון אחיד
            למעלה.
          </p>
        </FadeIn>
      </section>
      )}

      {/* Venue + CTA */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <FadeIn preset="section" immediate>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <MapPin size={20} className="text-accent" />
                {ACTIVITIES_VENUE.name}
              </h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {ACTIVITIES_VENUE.address}
                <br />
                {ACTIVITIES_VENUE.phone}
              </p>
              <Link
                to={CLUB_PATH}
                className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-accent hover:underline"
              >
                לעמוד המתחם המלא
                <ArrowLeft size={14} />
              </Link>
            </FadeIn>
            {!isAdmin ? (
              <FadeIn preset="section" immediate index={1} className="rounded-xl border border-accent/40 bg-accent/5 p-6">
                <h3 className="font-bold text-foreground text-lg">מוכנים להירשם?</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  בחרו את סוג הפעילות במחירון — כניסה למתחם הפינגפונג, מנויים, כרטיסיות ורכישה
                  אונליין. לשאלות — וואטסאפ.
                </p>
                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <Button asChild className="font-bold flex-1">
                    <a href="#pricing-table-tennis">
                      <UserPlus size={16} />
                      למחירון והרשמה
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="font-bold flex-1">
                    <a href={getActivitiesWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
                      <MessageCircle size={16} />
                      וואטסאפ
                    </a>
                  </Button>
                </div>
              </FadeIn>
            ) : (
              <FadeIn preset="section" immediate index={1} className="rounded-xl border border-accent/40 bg-accent/5 p-6">
                <h3 className="font-bold text-foreground text-lg">ניהול הרשמות</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  לרישום לקוחות קיימים לשיעורים — עברו ללוח השיעורים בחשבון הניהול.
                </p>
                <Button asChild className="mt-5 font-bold">
                  <Link to="/account" search={{ section: "registrations" }}>
                    <Calendar size={16} />
                    לוח שיעורים וניהול נרשמים
                  </Link>
                </Button>
              </FadeIn>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
