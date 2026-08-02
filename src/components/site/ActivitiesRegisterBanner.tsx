import { FadeIn } from "@/components/site/FadeIn";
import { ActivitiesRegisterCta } from "@/components/site/ActivitiesRegisterCta";
import {
  ACTIVITIES_PRICING_HASH,
  ACTIVITIES_REGISTER_BANNER_TEXT,
  ACTIVITIES_REGISTER_BANNER_TITLE,
  ACTIVITIES_SCHEDULE_HASH,
} from "@/data/activities";

export function ActivitiesRegisterBanner() {
  return (
    <section
      dir="rtl"
      aria-labelledby="activities-register-banner-heading"
      className="border-y-2 border-accent/50 bg-gradient-to-l from-accent via-accent to-accent/90 text-accent-foreground"
    >
      <FadeIn preset="promo" immediate className="mx-auto max-w-7xl px-4 py-6 md:py-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent-foreground/80">
              CHOLE TLV · מתחם ספורט
            </p>
            <h2
              id="activities-register-banner-heading"
              className="mt-1 text-xl font-black leading-tight md:text-2xl"
            >
              {ACTIVITIES_REGISTER_BANNER_TITLE}
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-accent-foreground/95 md:text-base">
              {ACTIVITIES_REGISTER_BANNER_TEXT}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row sm:items-center">
            <ActivitiesRegisterCta
              variant="onDarkOutline"
              size="lg"
              hash={ACTIVITIES_SCHEDULE_HASH}
              label={'ללו"ז והרשמה'}
              icon="calendar"
              className="w-full border-white/60 bg-white/10 text-white hover:bg-white hover:text-accent sm:w-auto"
            />
            <ActivitiesRegisterCta
              variant="onDark"
              size="lg"
              hash={ACTIVITIES_PRICING_HASH}
              label="למחירון"
              icon="card"
              className="w-full bg-white text-accent hover:bg-white/90 sm:w-auto"
            />
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
