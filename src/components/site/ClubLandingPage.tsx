import { useEffect, useRef } from "react";
import { ArrowLeft, Instagram, MapPin, MessageCircle } from "lucide-react";
import { FadeIn } from "@/components/site/FadeIn";
import {
  CLUB_BRAND,
  CLUB_FINAL_CTA,
  CLUB_HERO,
  CLUB_INSTAGRAM_HANDLE,
  CLUB_INSTAGRAM_URL,
  CLUB_INTRO,
  CLUB_PILLARS,
  CLUB_PRACTICAL,
  CLUB_WHATSAPP_GROUP_URL,
  getClubInterestWhatsAppUrl,
} from "@/data/club";
import { COMPANY } from "@/data/legal";
import { cn } from "@/lib/utils";

/** Soft cinematic grade — muted, professional, never harsh. */
const MEDIA_GRADE =
  "brightness-[0.92] contrast-[1.06] saturate-[0.92]";

const MEDIA_SHADE = [
  "radial-gradient(ellipse at center,",
  "transparent 42%,",
  "oklch(0.12 0.01 60 / 0.28) 100%),",
  "linear-gradient(180deg,",
  "oklch(0.1 0.01 60 / 0.22) 0%,",
  "transparent 38%,",
  "transparent 62%,",
  "oklch(0.1 0.01 60 / 0.34) 100%)",
].join(" ");

const HERO_OVERLAY = [
  "linear-gradient(180deg,",
  "oklch(0.07 0.01 60 / 0.78) 0%,",
  "oklch(0.09 0.01 60 / 0.58) 36%,",
  "oklch(0.12 0.01 60 / 0.36) 68%,",
  "oklch(0.14 0.01 60 / 0.5) 100%),",
  "radial-gradient(ellipse at 55% 40%,",
  "transparent 35%,",
  "oklch(0.08 0.01 60 / 0.35) 100%)",
].join(" ");

type ClubShadedMediaProps = {
  src: string;
  alt: string;
  className?: string;
  /** Decorative hero media — hide from screen readers when copy is enough. */
  decorative?: boolean;
  objectPosition?: string;
  /** Optional muted looping background video (falls back to poster image). */
  videoSrc?: string;
};

function ClubShadedMedia({
  src,
  alt,
  className,
  decorative = false,
  objectPosition = "center",
  videoSrc,
}: ClubShadedMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc) return;

    // Always silent — browsers may ignore the muted attribute in some cases.
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlayback = () => {
      if (reduceMotion.matches || document.documentElement.classList.contains("a11y-reduce-motion")) {
        video.pause();
        return;
      }
      void video.play().catch(() => {
        /* Autoplay can be blocked; poster image remains. */
      });
    };

    syncPlayback();
    reduceMotion.addEventListener("change", syncPlayback);
    return () => reduceMotion.removeEventListener("change", syncPlayback);
  }, [videoSrc]);

  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-primary", className)}>
      {videoSrc ? (
        <video
          ref={videoRef}
          className={cn("absolute inset-0 h-full w-full object-cover", MEDIA_GRADE)}
          style={{ objectPosition }}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={src}
          aria-hidden={decorative || undefined}
          disablePictureInPicture
          controls={false}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : (
        <img
          src={src}
          alt={decorative ? "" : alt}
          aria-hidden={decorative || undefined}
          className={cn("absolute inset-0 h-full w-full object-cover", MEDIA_GRADE)}
          style={{ objectPosition }}
        />
      )}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: MEDIA_SHADE }}
        aria-hidden
      />
    </div>
  );
}

export function ClubLandingPage() {
  return (
    <div dir="rtl">
      <section
        className="relative overflow-hidden border-b border-border"
        aria-labelledby="club-hero-heading"
      >
        <div className="relative min-h-[72vh] md:min-h-[80vh]">
          <ClubShadedMedia
            src={CLUB_HERO.image}
            alt={CLUB_HERO.imageAlt}
            videoSrc={CLUB_HERO.videoSrc}
            decorative
            objectPosition="center 30%"
          />
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{ background: HERO_OVERLAY }}
            aria-hidden
          />

          <div className="relative z-10 mx-auto flex min-h-[72vh] md:min-h-[80vh] max-w-7xl items-end px-4 pb-14 pt-20 md:pb-20 md:pt-24">
            <div className="w-full max-w-3xl text-white">
              <FadeIn preset="hero" immediate index={0} className="mb-4 inline-flex items-center gap-3">
                <span className="h-px w-8 bg-accent/80" aria-hidden />
                <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accent sm:text-xs">
                  {CLUB_HERO.brand}
                </span>
                <span className="h-px w-8 bg-accent/80" aria-hidden />
              </FadeIn>

              <FadeIn
                preset="hero"
                immediate
                index={1}
                as="h1"
                id="club-hero-heading"
                className="text-balance text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
              >
                {CLUB_HERO.headline}
              </FadeIn>

              <FadeIn
                preset="hero"
                immediate
                index={2}
                as="p"
                className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-white/95 sm:text-lg md:mt-6"
              >
                {CLUB_HERO.support}
              </FadeIn>

              <FadeIn
                preset="hero"
                immediate
                index={3}
                className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10"
              >
                <a
                  href={getClubInterestWhatsAppUrl("general")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-accent px-7 py-3.5 text-sm font-bold tracking-wide text-accent-foreground transition hover:opacity-90 sm:text-base"
                >
                  {CLUB_HERO.primaryCta}
                  <ArrowLeft size={18} aria-hidden />
                </a>
                <a
                  href={CLUB_INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-white/35 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/12 sm:text-base"
                >
                  <Instagram size={18} aria-hidden />
                  {CLUB_HERO.secondaryCta}
                </a>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
          <FadeIn preset="section" as="p" className="text-lg leading-relaxed text-foreground md:text-xl">
            {CLUB_INTRO}
          </FadeIn>
          <FadeIn
            preset="section"
            delay={80}
            className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground"
          >
            <MapPin size={16} className="text-accent shrink-0" aria-hidden />
            {COMPANY.address}
          </FadeIn>
        </div>
      </section>

      {CLUB_PILLARS.map((pillar, index) => {
        const imageFirst = index % 2 === 1;

        return (
          <section
            key={pillar.id}
            id={pillar.id}
            aria-labelledby={`${pillar.id}-heading`}
            className="border-b border-border"
          >
            <div className="mx-auto grid max-w-7xl items-center gap-0 lg:grid-cols-2">
              <FadeIn
                preset="section"
                className={cn(
                  "relative min-h-[300px] overflow-hidden md:min-h-[460px]",
                  imageFirst ? "lg:order-2" : "lg:order-1",
                )}
              >
                <ClubShadedMedia
                  src={pillar.image}
                  alt={pillar.imageAlt}
                  objectPosition={pillar.id === "kids" ? "center 35%" : "center"}
                />
              </FadeIn>

              <FadeIn
                preset="section"
                delay={60}
                className={cn(
                  "px-4 py-12 md:px-10 md:py-16 lg:px-14",
                  imageFirst ? "lg:order-1" : "lg:order-2",
                )}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  {CLUB_BRAND}
                </p>
                <h2
                  id={`${pillar.id}-heading`}
                  className="mt-3 text-2xl font-extrabold text-foreground md:text-3xl"
                >
                  {pillar.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                  {pillar.lead}
                </p>
                <ul className="mt-6 space-y-2.5">
                  {pillar.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 text-sm leading-relaxed text-foreground md:text-base"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={getClubInterestWhatsAppUrl(pillar.whatsappIntent)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-accent transition hover:underline"
                >
                  <MessageCircle size={18} aria-hidden />
                  {pillar.ctaLabel}
                </a>
              </FadeIn>
            </div>
          </section>
        );
      })}

      <section
        aria-labelledby="club-practical-heading"
        className="border-b border-border bg-secondary/40"
      >
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <FadeIn preset="section">
            <h2
              id="club-practical-heading"
              className="text-2xl font-extrabold text-foreground md:text-3xl"
            >
              {CLUB_PRACTICAL.title}
            </h2>
          </FadeIn>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {CLUB_PRACTICAL.items.map((item, index) => (
              <FadeIn key={item.label} preset="section" index={index}>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  {item.label}
                </p>
                {"href" in item && item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block text-sm leading-relaxed text-foreground underline-offset-4 transition hover:text-accent hover:underline md:text-base"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-2 text-sm leading-relaxed text-foreground md:text-base">
                    {item.value}
                  </p>
                )}
              </FadeIn>
            ))}
          </div>
          <FadeIn preset="section" delay={120} className="mt-10 flex flex-wrap gap-3">
            <a
              href={CLUB_WHATSAPP_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              <MessageCircle size={16} aria-hidden />
              קבוצת וואטסאפ לטניס שולחן
            </a>
            <a
              href={CLUB_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent"
            >
              <Instagram size={16} aria-hidden />
              @{CLUB_INSTAGRAM_HANDLE}
            </a>
          </FadeIn>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center md:py-20">
          <FadeIn preset="section" as="h2" className="text-2xl font-extrabold md:text-3xl">
            {CLUB_FINAL_CTA.title}
          </FadeIn>
          <FadeIn
            preset="section"
            delay={60}
            as="p"
            className="mt-4 text-base leading-relaxed text-primary-foreground/90 md:text-lg"
          >
            {CLUB_FINAL_CTA.text}
          </FadeIn>
          <FadeIn
            preset="section"
            delay={120}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href={getClubInterestWhatsAppUrl("general")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-accent px-7 py-3.5 text-sm font-bold text-accent-foreground transition hover:opacity-90"
            >
              <MessageCircle size={18} aria-hidden />
              שלחו הודעה בוואטסאפ
            </a>
            <a
              href={CLUB_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-primary-foreground/30 px-6 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-foreground/10"
            >
              <Instagram size={18} aria-hidden />
              עקבו באינסטגרם
            </a>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
