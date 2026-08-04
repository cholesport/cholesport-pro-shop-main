import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import {
  GatewayCardImage,
  GatewayCardOverlay,
  GatewayCardProductMarquee,
  GatewayCardVideo,
} from "@/components/site/GatewayCardMedia";
import {
  SITE_GATEWAY_CARDS,
  SITE_GATEWAY_HEADLINE,
  SITE_GATEWAY_SUBHEADLINE,
  type SiteGatewayAreaId,
  type SiteGatewayCard,
} from "@/data/siteGateway";
import { saveSiteGatewayPreference } from "@/lib/siteGatewayPreference";
import { cn } from "@/lib/utils";

function GatewayCardMedia({ card }: { card: SiteGatewayCard }) {
  if (card.mediaType === "video") {
    return <GatewayCardVideo poster={card.image} videoSrc={card.videoSrc} />;
  }
  if (card.mediaType === "marquee") {
    return <GatewayCardProductMarquee />;
  }
  return <GatewayCardImage src={card.image} />;
}

function GatewayCard(card: SiteGatewayCard) {
  const { id, title, subtitle, href } = card;

  function handleSelect() {
    saveSiteGatewayPreference(id);
  }

  const isExternal = href.startsWith("http");

  const className = cn(
    "gateway-card group relative block w-full overflow-hidden rounded-xl border border-border/80 bg-primary text-start",
    "shadow-[var(--shadow-card)] transition duration-300",
    "hover:border-foreground/20 hover:shadow-lg",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
  );

  const cardContent = (
    <>
      <GatewayCardMedia card={card} />
      <GatewayCardOverlay />
      <div className="relative flex min-h-[200px] flex-col justify-end p-5 text-white sm:min-h-[220px] md:min-h-[280px] md:p-8">
        <span
          className="mb-3 inline-flex w-fit items-center gap-2 border border-white/25 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm"
          aria-hidden
        >
          CHOLE
        </span>
        <h2 className="text-xl font-extrabold leading-tight sm:text-2xl md:text-3xl">{title}</h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/85 md:text-base">
          {subtitle}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent transition group-hover:gap-3 md:mt-5">
          כניסה לאזור
          <ArrowLeft size={18} aria-hidden />
        </span>
      </div>
    </>
  );

  if (isExternal) {
    return (
      <a href={href} className={className} onClick={handleSelect}>
        {cardContent}
      </a>
    );
  }

  return (
    <Link
      to={href}
      className={className}
      onClick={handleSelect}
      aria-label={`${title} — ${subtitle}`}
    >
      {cardContent}
    </Link>
  );
}

export function SiteGateway() {
  return (
    <section
      className="site-gateway relative border-b border-border bg-background"
      aria-labelledby="gateway-heading"
    >
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            CHOLE sport
          </p>
          <h1
            id="gateway-heading"
            className="mt-3 text-balance text-2xl font-extrabold tracking-tight text-foreground sm:mt-4 sm:text-3xl md:text-4xl lg:text-5xl"
          >
            {SITE_GATEWAY_HEADLINE}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base md:text-lg">
            {SITE_GATEWAY_SUBHEADLINE}
          </p>
        </div>

        <div
          className="mt-6 grid grid-cols-1 gap-3 sm:mt-10 sm:gap-4 md:mt-14 md:grid-cols-3 md:gap-5"
          role="list"
          aria-label="בחירת אזור באתר"
        >
          {SITE_GATEWAY_CARDS.map((card) => (
            <div key={card.id as SiteGatewayAreaId} role="listitem" className="min-h-[200px]">
              <GatewayCard {...card} />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center sm:mt-10">
          <Link
            to="/about"
            className="text-sm font-medium text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
          >
            קצת עלינו ואיך הכל התחיל
          </Link>
        </div>
      </div>
    </section>
  );
}
