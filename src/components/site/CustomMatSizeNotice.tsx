import { MessageCircle } from "lucide-react";
import type { CustomMatSizeKind } from "@/data/customMatSize";
import { CUSTOM_MAT_SIZE_COPY } from "@/data/customMatSize";
import { getCustomMatSizeWhatsAppUrl } from "@/lib/contact";

type CustomMatSizeNoticeProps = {
  kind: CustomMatSizeKind;
  /** Compact variant under size chips; default is a fuller callout. */
  compact?: boolean;
};

/** Visible CTA so shoppers notice custom mat sizes are available. */
export function CustomMatSizeNotice({ kind, compact = false }: CustomMatSizeNoticeProps) {
  const copy = CUSTOM_MAT_SIZE_COPY[kind];
  const href = getCustomMatSizeWhatsAppUrl(kind);

  if (compact) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold border-2 border-accent text-accent bg-accent/5 hover:bg-accent hover:text-accent-foreground transition"
      >
        <MessageCircle size={16} aria-hidden />
        גודל מיוחד - הזמנה בוואטסאפ
      </a>
    );
  }

  return (
    <aside
      className="mt-4 rounded-xl border border-accent/35 bg-accent/5 p-4 md:p-5"
      aria-label={copy.title}
    >
      <p className="text-base font-extrabold text-foreground">{copy.title}</p>
      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{copy.description}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-2 rounded-none bg-accent px-4 py-2.5 text-sm font-bold text-accent-foreground hover:bg-accent/90 transition"
      >
        <MessageCircle size={18} aria-hidden />
        {copy.cta}
      </a>
    </aside>
  );
}
