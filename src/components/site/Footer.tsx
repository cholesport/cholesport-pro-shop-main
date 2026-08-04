import { Link } from "@tanstack/react-router";
import { PAYMENT_SUMMARY } from "@/data/payment";
import logo from "@/assets/chole-sport-logo.png";
import { ActivitiesRegisterCta } from "@/components/site/ActivitiesRegisterCta";
import { COMPANY } from "@/data/legal";
import { CONTACT_PHONE_DISPLAY, WHATSAPP_URL } from "@/lib/contact";
import { BrandLogoRow } from "@/components/site/BrandLogos";
import { SiteAreaReminders } from "@/components/site/SiteAreaReminders";
import { FadeIn } from "@/components/site/FadeIn";
import {
  ACTIVITIES_REGISTER_CALLOUT_TEXT,
  ACTIVITIES_REGISTER_CALLOUT_TITLE,
  ACTIVITIES_REGISTER_CTA_LABEL,
  ACTIVITIES_SCHEDULE_HASH,
} from "@/data/activities";

type FooterLink = {
  label: string;
  href?: string;
  to?: "/privacy" | "/terms" | "/account" | "/categories" | "/club" | "/about" | "/register";
};

const COLS: Record<string, FooterLink[]> = {
  חנות: [
    { label: "נבחרת מוצרי CHOLE", href: "/#products" },
    { label: "המותגים שלנו", href: "/#brands" },
    { label: "קטגוריות", to: "/categories" },
    { label: "SHOW ROOM", href: "/categories/show-room" },
    { label: "מתחם CHOLE TLV", to: "/club" },
    { label: ACTIVITIES_REGISTER_CTA_LABEL, to: "/register" },
    { label: "אודות", to: "/about" },
  ],
  שירות: [
    { label: "צור קשר בוואטסאפ", href: WHATSAPP_URL },
    { label: "איסוף מהחנות", href: "/checkout" },
    { label: "החזרות", to: "/terms" },
    { label: "מעקב הזמנה", to: "/account" },
  ],
  משפטי: [
    { label: "מדיניות פרטיות", to: "/privacy" },
    { label: "תנאי שימוש", to: "/terms" },
  ],
};

function FooterLinkItem({ link }: { link: FooterLink }) {
  const className = "text-sm text-muted-foreground hover:text-accent transition";

  if (link.to) {
    return (
      <Link to={link.to} className={className}>
        {link.label}
      </Link>
    );
  }

  return (
    <a href={link.href ?? "#"} className={className} target={link.href?.startsWith("http") ? "_blank" : undefined} rel={link.href?.startsWith("http") ? "noopener noreferrer" : undefined}>
      {link.label}
    </a>
  );
}

export function Footer({ variant = "full" }: { variant?: "full" | "shop" }) {
  return (
    <footer className="mt-20 border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 py-14">
        {variant === "full" ? (
          <FadeIn preset="footer" className="mb-10 rounded-2xl border-2 border-accent/40 bg-accent/10 p-5 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-lg font-black text-foreground">{ACTIVITIES_REGISTER_CALLOUT_TITLE}</p>
                <p className="mt-1 text-sm text-muted-foreground max-w-xl">
                  {ACTIVITIES_REGISTER_CALLOUT_TEXT}
                </p>
              </div>
              <ActivitiesRegisterCta hash={ACTIVITIES_SCHEDULE_HASH} size="lg" className="shrink-0" />
            </div>
          </FadeIn>
        ) : (
          <FadeIn preset="footer" className="mb-10">
            <SiteAreaReminders />
          </FadeIn>
        )}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <FadeIn preset="footer" className="md:col-span-5">
            <img src={logo} alt="CHOLE sport" className="h-14 w-auto mb-5" />
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              CHOLE sport - ציוד ספורט מקצועי מהיבואן לצרכן. {COMPANY.address}.
            </p>
            <div className="mt-5">
              <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-muted-foreground mb-3">
                המותגים שלנו
              </p>
              <BrandLogoRow heightClass="h-7" />
            </div>
            <p className="mt-5 text-sm font-medium text-foreground">
              <span dir="ltr" className="inline-block">
                {CONTACT_PHONE_DISPLAY}
              </span>
            </p>
          </FadeIn>

          {Object.entries(COLS).map(([title, links], index) => (
            <FadeIn key={title} preset="footer" index={index + 1} className="md:col-span-2">
              <h4 className="text-xs font-bold tracking-[0.16em] uppercase text-foreground mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <FooterLinkItem link={link} />
                  </li>
                ))}
              </ul>
            </FadeIn>
          ))}
        </div>
      </div>
      <FadeIn preset="footer" delay={120} className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} CHOLE sport</p>
          <p>
            {PAYMENT_SUMMARY}
          </p>
        </div>
      </FadeIn>
    </footer>
  );
}
