import { Calendar, Clock, MapPin, Phone, Sparkles } from "lucide-react";
import { CampInquiryDialog } from "@/components/site/CampInquiryDialog";
import {
  getCampSessionStatus,
  KIDS_CAMPS_SECTION_ID,
  NINJA_ART_SUMMER_CAMP,
  type CampSession,
} from "@/data/camps";
import { cn } from "@/lib/utils";

function SessionCard({ session }: { session: CampSession }) {
  const status = getCampSessionStatus(session);

  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3 text-center transition",
        status === "active" && "border-accent bg-accent/10 shadow-sm",
        status === "upcoming" && "border-border bg-card",
        status === "past" && "border-border/60 bg-muted/30 opacity-70",
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {session.label}
      </p>
      <p className="mt-1 text-lg font-extrabold text-foreground">{session.dates}</p>
      {status === "active" && (
        <p className="mt-1 text-xs font-bold text-accent">מתקיים עכשיו</p>
      )}
      {status === "upcoming" && (
        <p className="mt-1 text-xs font-medium text-muted-foreground">בקרוב</p>
      )}
    </div>
  );
}

export function KidsCampsSection() {
  const camp = NINJA_ART_SUMMER_CAMP;
  const hasActiveSession = camp.sessions.some((s) => getCampSessionStatus(s) === "active");

  return (
    <section
      id={KIDS_CAMPS_SECTION_ID}
      className="scroll-mt-24 border-b border-border bg-secondary/20"
      aria-labelledby="kids-camps-heading"
    >
      <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
          <div className="border-b border-border bg-background p-4 md:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              קייטנה פעילה עכשיו
            </p>
            <h2 id="kids-camps-heading" className="mt-2 text-2xl font-extrabold text-foreground md:text-3xl">
              {camp.title}
            </h2>
            <p className="mt-1 text-sm font-medium text-muted-foreground md:text-base">
              {camp.titleEn} · {camp.brand}
            </p>
          </div>

          <div className="grid gap-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="flex items-center justify-center border-b border-border bg-muted/25 p-4 md:p-6 lg:border-b-0 lg:border-e">
              <img
                src={camp.flyerImage}
                alt={camp.flyerAlt}
                className="max-h-[min(380px,52vh)] w-full max-w-sm object-contain"
                loading="lazy"
              />
            </div>

            <div className="p-5 md:p-6 lg:p-8">
              <p className="text-base font-semibold leading-relaxed text-foreground md:text-lg">
                {camp.tagline}
              </p>

              <ul className="mt-5 space-y-2">
                {camp.activities.map((activity) => (
                  <li
                    key={activity}
                    className="flex gap-2 text-sm leading-relaxed text-foreground md:text-base"
                  >
                    <Sparkles size={16} className="mt-1 shrink-0 text-accent" aria-hidden />
                    <span>{activity}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                  <span>{camp.venue}</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <Clock size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                  <span>{camp.hours}</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <Calendar size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                  <span>{camp.ageGroups.join(" · ")}</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <Phone size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                  <a href={`tel:${camp.phone.replace(/-/g, "")}`} className="hover:text-accent transition">
                    {camp.phone}
                  </a>
                </div>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">{camp.ageNote}</p>

              {hasActiveSession && (
                <p className="mt-4 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-sm font-semibold text-foreground">
                  יש מחזור פעיל כרגע — מקומות אחרונים. שלחו פנייה ונחזור אליכם עם פרטים.
                </p>
              )}

              <div className="mt-6">
                <CampInquiryDialog />
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                לאחר השליחה נחזור אליכם במייל או בטלפון עם פרטים מלאים על מחיר, מקומות פנויים ותיאום הרשמה.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-bold text-foreground">מחזורי הקייטנה — אוגוסט 2026</h3>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {camp.sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
