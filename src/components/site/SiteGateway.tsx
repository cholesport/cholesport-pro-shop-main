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
  SITE_GATEWAY_SUBHEADLINE_MOBILE,
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
  const { id, title, subtitle, shortSubtitle, href } = card;

  function handleSelect() {
    saveSiteGatewayPreference(id);
  }

  const isExternal = href.startsWith("http");

  const className = cn(
    "gateway-card group relative block h-full w-full overflow-hidden rounded-xl border border-border/80 bg-primary text-start",
    "shadow-[var(--shadow-card)] transition duration-300",
    "hover:border-foreground/20 hover:shadow-lg",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
  );

  const cardContent = (
    <>
      <GatewayCardMedia card={card} />
      <GatewayCardOverlay />
      <div
        className={cn(
          "relative flex min-h-[200px] flex-col justify-end p-5 text-white sm:min-h-[220px] md:min-h-[280px] md:p-8",
          "max-md:min-h-0 max-md:flex-1 max-md:justify-end max-md:p-3",
        )}
      >
        <span
          className="mb-3 inline-flex w-fit items-center gap-2 border border-white/25 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm max-md:hidden"
          aria-hidden
        >
          CHOLE
        </span>
        <h2 className="text-xl font-extrabold leading-tight sm:text-2xl md:text-3xl max-md:text-[1.05rem] max-md:leading-snug">
          {title}
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/85 md:text-base max-md:mt-1 max-md:line-clamp-2 max-md:text-xs max-md:leading-snug">
          <span className="md:hidden">{shortSubtitle}</span>
          <span className="hidden md:inline">{subtitle}</span>
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent transition group-hover:gap-3 md:mt-5 max-md:mt-1.5 max-md:text-xs">
          כניסה לאזור
          <ArrowLeft size={18} className="max-md:size-3.5" aria-hidden />
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
      className={cn(
        "site-gateway relative border-b border-border bg-background",
        "max-md:flex max-md:h-full max-md:flex-1 max-md:flex-col max-md:border-b-0",
      )}
      aria-labelledby="gateway-heading"
    >
      <div
        className={cn(
          "relative mx-auto w-full max-w-7xl px-4 py-8 sm:py-12 md:py-16 lg:py-20",
          "max-md:flex max-md:min-h-0 max-md:flex-1 max-md:flex-col max-md:px-3 max-md:py-3",
        )}
      >
        <div className="mx-auto max-w-3xl shrink-0 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground max-md:hidden">
            CHOLE sport
          </p>
          <h1
            id="gateway-heading"
            className={cn(
              "mt-3 text-balance text-2xl font-extrabold tracking-tight text-foreground sm:mt-4 sm:text-3xl md:text-4xl lg:text-5xl",
              "max-md:mt-0 max-md:text-xl",
            )}
          >
            {SITE_GATEWAY_HEADLINE}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base md:text-lg max-md:mt-1.5 max-md:text-xs max-md:leading-snug">
            <span className="md:hidden">{SITE_GATEWAY_SUBHEADLINE_MOBILE}</span>
            <span className="hidden md:inline">{SITE_GATEWAY_SUBHEADLINE}</span>
          </p>
        </div>

        <div
          className={cn(
            "mt-6 grid grid-cols-1 gap-3 sm:mt-10 sm:gap-4 md:mt-14 md:grid-cols-3 md:gap-5",
            "max-md:mt-2 max-md:min-h-0 max-md:flex-1 max-md:grid-rows-3 max-md:gap-2",
          )}
          role="list"
          aria-label="בחירת אזור באתר"
        >
          {SITE_GATEWAY_CARDS.map((card) => (
            <div
              key={card.id as SiteGatewayAreaId}
              role="listitem"
              className="min-h-[200px] max-md:min-h-0 max-md:h-full"
            >
              <GatewayCard {...card} />
            </div>
          ))}
        </div>

        <div className="mt-8 shrink-0 text-center sm:mt-10 max-md:mt-2">
          <Link
            to="/about"
            className="text-sm font-medium text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline max-md:text-xs"
          >
            קצת עלינו ואיך הכל התחיל
          </Link>
        </div>
      </div>
    </section>
  );
}
