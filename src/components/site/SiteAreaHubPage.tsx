import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/site/FadeIn";
import type { SiteAreaHub } from "@/data/siteGateway";
import { saveSiteGatewayPreference } from "@/lib/siteGatewayPreference";
import { cn } from "@/lib/utils";

type SiteAreaHubPageProps = {
  hub: SiteAreaHub;
};

export function SiteAreaHubPage({ hub }: SiteAreaHubPageProps) {
  return (
    <div dir="rtl">
      <section
        className="relative overflow-hidden border-b border-border"
        aria-labelledby={`${hub.id}-hub-heading`}
      >
        <div className="relative min-h-[42vh] md:min-h-[48vh]">
          <img
            src={hub.image}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover brightness-[0.82] contrast-[1.06] saturate-[0.92]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/55 to-primary/25"
            aria-hidden
          />
          <div className="relative z-10 mx-auto flex min-h-[42vh] max-w-7xl flex-col justify-end px-4 pb-10 pt-16 md:min-h-[48vh] md:pb-14 md:pt-20">
            <FadeIn preset="hero" immediate index={0}>
              <Link
                to="/"
                className="mb-6 inline-flex w-fit items-center gap-2 text-sm font-medium text-white/80 transition hover:text-white"
              >
                <ArrowRight size={16} aria-hidden />
                חזרה לבחירת אזור
              </Link>
            </FadeIn>
            <FadeIn preset="hero" immediate index={1}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                {hub.eyebrow}
              </p>
            </FadeIn>
            <FadeIn
              preset="hero"
              immediate
              index={2}
              as="h1"
              id={`${hub.id}-hub-heading`}
              className="mt-3 max-w-3xl text-balance text-3xl font-extrabold leading-tight text-white md:text-4xl lg:text-5xl"
            >
              {hub.headline}
            </FadeIn>
            <FadeIn
              preset="hero"
              immediate
              index={3}
              as="p"
              className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg"
            >
              {hub.support}
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background" aria-labelledby={`${hub.id}-links-heading`}>
        <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
          <FadeIn preset="section" immediate>
            <h2 id={`${hub.id}-links-heading`} className="text-xl font-extrabold text-foreground md:text-2xl">
              לאן תרצו להמשיך?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">
              בחרו את הנושא שמעניין אתכם — בלי מידע מיותר.
            </p>
          </FadeIn>

          <ul className="mt-8 space-y-3">
            {hub.links.map((link) => (
              <li key={link.href}>
                <HubLinkCard
                  {...link}
                  onNavigate={() => saveSiteGatewayPreference(hub.id)}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function parseInternalHref(href: string) {
  const hashIndex = href.indexOf("#");
  const withoutHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const hash = hashIndex >= 0 ? href.slice(hashIndex + 1) : undefined;
  const [pathname, search = ""] = withoutHash.split("?");
  const searchParams = Object.fromEntries(new URLSearchParams(search));
  return { pathname, searchParams, hash };
}

function HubLinkCard({
  label,
  description,
  href,
  external,
  onNavigate,
}: SiteAreaHub["links"][number] & { onNavigate: () => void }) {
  const className = cn(
    "group flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 transition",
    "hover:border-accent/50 hover:bg-secondary/40",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
  );

  const content = (
    <>
      <div className="min-w-0 text-start">
        <p className="text-base font-bold text-foreground group-hover:text-accent transition">
          {label}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <ArrowLeft
        size={20}
        className="shrink-0 text-muted-foreground transition group-hover:text-accent group-hover:-translate-x-0.5"
        aria-hidden
      />
    </>
  );

  if (external || href.startsWith("http")) {
    return (
      <a href={href} className={className} onClick={onNavigate}>
        {content}
      </a>
    );
  }

  const { pathname, searchParams, hash } = parseInternalHref(href);

  return (
    <Link
      to={pathname}
      search={searchParams}
      hash={hash}
      className={className}
      onClick={onNavigate}
    >
      {content}
    </Link>
  );
}
