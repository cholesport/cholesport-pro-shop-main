import whatsappIcon from "@/assets/whatsapp.png";
import { AccessibilityWidget } from "@/components/site/AccessibilityWidget";
import { FadeIn } from "@/components/site/FadeIn";
import { WHATSAPP_URL } from "@/lib/contact";

const FLOAT_BTN =
  "pointer-events-auto flex items-center justify-center size-10 rounded-full shadow-md hover:scale-105 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 overflow-hidden";

export function SiteFloatingActions() {
  return (
    <FadeIn
      preset="floating"
      immediate
      as="aside"
      className="fixed left-3 bottom-3 z-[100] flex flex-col items-start gap-2 pointer-events-none sm:left-4 sm:bottom-4"
      aria-label="קיצורי דרך צף"
    >
      <div className="pointer-events-auto">
        <AccessibilityWidget />
      </div>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="שליחת הודעת WhatsApp ל-CHOLE sport"
        className={`${FLOAT_BTN} focus-visible:ring-[#25D366]`}
      >
        <img
          src={whatsappIcon}
          alt=""
          aria-hidden="true"
          width={40}
          height={40}
          className="size-10 rounded-full object-cover"
          draggable={false}
        />
      </a>
    </FadeIn>
  );
}

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:text-sm focus:font-semibold focus:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      דלג לתוכן הראשי
    </a>
  );
}
