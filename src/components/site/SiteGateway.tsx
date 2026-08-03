import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { FadeIn } from "@/components/site/FadeIn";
import {
  SITE_GATEWAY_CARDS,
  SITE_GATEWAY_HEADLINE,
  SITE_GATEWAY_SUBHEADLINE,
  type SiteGatewayAreaId,
} from "@/data/siteGateway";
import { saveSiteGatewayPreference } from "@/lib/siteGatewayPreference";
import { cn } from "@/lib/utils";

function GatewayCard({
  id,
  title,
  subtitle,
  image,
  imageAlt,
  href,
  accentClass,
  index,
}: (typeof SITE_GATEWAY_CARDS)[number] & { index: number }) {
  function handleSelect() {
    saveSiteGatewayPreference(id);
  }

  const isExternal = href.startsWith("http");

  const cardContent = (
    <>
      <img
        src={image}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] brightness-[0.88] contrast-[1.05] saturate-[0.95]"
      />
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t opacity-90 transition-opacity duration-300 group-hover:opacity-95",
          accentClass,
        )}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 opacity-60"
        aria-hidden
      />
      <div className="relative flex h-full min-h-[220px] flex-col justify-end p-6 text-white sm:min-h-[280px] md:p-8">
        <h2 className="text-2xl font-extrabold leading-tight md:text-3xl">{title}</h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/90 md:text-base">
          {subtitle}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white/95 transition group-hover:gap-3">
          כניסה לאזור
          <ArrowLeft size={18} aria-hidden />
        </span>
      </div>
    </>
  );

  const className =
    "group relative block overflow-hidden rounded-2xl border border-border/60 bg-primary text-start shadow-[var(--shadow-card)] transition hover:border-accent/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2";

  if (isExternal) {
    return (
      <FadeIn preset="card" index={index}>
        <a href={href} className={className} onClick={handleSelect}>
          {cardContent}
        </a>
      </FadeIn>
    );
  }

  return (
    <FadeIn preset="card" index={index}>
      <Link
        to={href}
        className={className}
        onClick={handleSelect}
        aria-label={`${title} — ${subtitle}`}
      >
        {cardContent}
      </Link>
    </FadeIn>
  );
}

export function SiteGateway() {
  return (
    <section
      className="relative overflow-hidden border-b border-border"
      aria-labelledby="gateway-heading"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.94_0.02_145)_0%,transparent_55%)]" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-16 lg:py-20">
        <FadeIn preset="hero" immediate index={0} className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            CHOLE sport
          </p>
          <h1
            id="gateway-heading"
            className="mt-4 text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl"
          >
            {SITE_GATEWAY_HEADLINE}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            {SITE_GATEWAY_SUBHEADLINE}
          </p>
        </FadeIn>

        <div
          className="mt-10 grid gap-4 sm:gap-5 md:mt-14 md:grid-cols-3"
          role="list"
          aria-label="בחירת אזור באתר"
        >
          {SITE_GATEWAY_CARDS.map((card, index) => (
            <div key={card.id as SiteGatewayAreaId} role="listitem">
              <GatewayCard {...card} index={index} />
            </div>
          ))}
        </div>

        <FadeIn preset="section" delay={120} className="mt-10 text-center">
          <Link
            to="/about"
            className="text-sm font-medium text-muted-foreground underline-offset-4 transition hover:text-accent hover:underline"
          >
            על CHOLE sport
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
