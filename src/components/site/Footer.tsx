import { Link } from "@tanstack/react-router";
import { PAYMENT_SUMMARY } from "@/data/payment";
import { Facebook } from "lucide-react";
import logo from "@/assets/chole-sport-logo.png";
import instagramIcon from "@/assets/instagram.png";
import { COMPANY } from "@/data/legal";
import { CONTACT_PHONE_DISPLAY, WHATSAPP_URL } from "@/lib/contact";
import { BrandLogoRow } from "@/components/site/BrandLogos";

type FooterLink = { label: string; href?: string; to?: "/privacy" | "/terms" | "/account" | "/categories" };

const COLS: Record<string, FooterLink[]> = {
  חנות: [
    { label: "נבחרת מוצרי CHOLE", href: "/#products" },
    { label: "המותגים שלנו", href: "/#brands" },
    { label: "קטגוריות", to: "/categories" },
    { label: "SHOW ROOM", href: "/categories/show-room" },
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

const INSTAGRAM_URL = "https://www.instagram.com/cholesport";
const FACEBOOK_URL = "https://www.facebook.com/cholesport";

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

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <img src={logo} alt="CHOLE sport" className="h-14 w-auto mb-5" />
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              CHOLE sport — ציוד ספורט מקצועי מהיבואן לצרכן. {COMPANY.address}.
            </p>
            <div className="mt-5">
              <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-muted-foreground mb-3">
                המותגים שלנו
              </p>
              <BrandLogoRow heightClass="h-7" />
            </div>
            <p className="mt-5 text-sm font-medium text-foreground" dir="ltr">
              {CONTACT_PHONE_DISPLAY}
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition"
                aria-label="CHOLE sport בפייסבוק"
              >
                <Facebook size={16} strokeWidth={2} aria-hidden />
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition"
                aria-label="CHOLE sport באינסטגרם"
              >
                <img
                  src={instagramIcon}
                  alt=""
                  className="size-4 rounded-full object-cover"
                  aria-hidden
                />
              </a>
            </div>
          </div>

          {Object.entries(COLS).map(([title, links]) => (
            <div key={title} className="md:col-span-2">
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
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} CHOLE sport</p>
          <p>
            {PAYMENT_SUMMARY}
          </p>
        </div>
      </div>
    </footer>
  );
}
