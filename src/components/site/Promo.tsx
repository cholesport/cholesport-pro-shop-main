import { Link } from "@tanstack/react-router";
import { PAYMENT_SUMMARY } from "@/data/payment";
import { CONTACT_PHONE_DISPLAY, getShippingWhatsAppUrl, WHATSAPP_URL } from "@/lib/contact";
import { COMPANY } from "@/data/legal";
import { CLUB_PATH } from "@/data/club";
import { FadeIn } from "@/components/site/FadeIn";

const ITEMS = [
  {
    title: "איסוף מהחנות",
    desc: COMPANY.address,
  },
  {
    title: "משלוח בתיאום",
    desc: `וואטסאפ ${CONTACT_PHONE_DISPLAY}`,
    href: getShippingWhatsAppUrl(),
  },
  {
    title: "רכישה ותשלום",
    desc: PAYMENT_SUMMARY,
    href: WHATSAPP_URL,
  },
  {
    title: "מתחם CHOLE TLV",
    desc: "טניס שולחן · חוגי ילדים",
    to: CLUB_PATH,
  },
] as const;

export function Promo() {
  return (
    <section className="border-y border-border bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {ITEMS.map((item, index) => (
            <FadeIn key={item.title} preset="promo" index={index} className="min-w-0">
              <p className="text-xs font-semibold tracking-[0.16em] uppercase text-accent mb-2">
                {item.title}
              </p>
              {"href" in item && item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm md:text-base font-medium text-primary-foreground/90 hover:text-accent transition underline-offset-4 hover:underline"
                >
                  {item.desc}
                </a>
              ) : "to" in item && item.to ? (
                <Link
                  to={item.to}
                  className="text-sm md:text-base font-medium text-primary-foreground/90 hover:text-accent transition underline-offset-4 hover:underline"
                >
                  {item.desc}
                </Link>
              ) : (
                <p className="text-sm md:text-base font-medium text-primary-foreground/90">
                  {item.desc}
                </p>
              )}
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
