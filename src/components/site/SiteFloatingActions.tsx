import whatsappIcon from "@/assets/whatsapp.png";
import instagramIcon from "@/assets/instagram.png";
import { AccessibilityWidget } from "@/components/site/AccessibilityWidget";
import { WHATSAPP_URL } from "@/lib/contact";

const INSTAGRAM_URL = "https://www.instagram.com/cholesport";

export function SiteFloatingActions() {
  return (
    <aside
      className="fixed right-4 bottom-4 z-[100] flex flex-col items-end gap-3 pointer-events-none"
      aria-label="קיצורי דרך צף"
    >
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="CHOLE sport באינסטגרם"
        className="pointer-events-auto flex items-center justify-center size-14 rounded-full shadow-lg hover:scale-105 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E1306C] focus-visible:ring-offset-2 overflow-hidden"
      >
        <img
          src={instagramIcon}
          alt=""
          aria-hidden="true"
          width={56}
          height={56}
          className="size-14 rounded-full object-cover"
          draggable={false}
        />
      </a>
      <div className="pointer-events-auto">
        <AccessibilityWidget />
      </div>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="שליחת הודעת WhatsApp ל-CHOLE sport"
        className="pointer-events-auto flex items-center justify-center size-14 rounded-full shadow-lg hover:scale-105 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
      >
        <img
          src={whatsappIcon}
          alt=""
          aria-hidden="true"
          width={56}
          height={56}
          className="size-14 rounded-full object-cover"
          draggable={false}
        />
      </a>
    </aside>
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
