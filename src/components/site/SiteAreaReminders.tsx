import { Link } from "@tanstack/react-router";
import { SHOP_OTHER_AREAS, SHOP_OTHER_AREAS_TITLE } from "@/data/shop";
import { cn } from "@/lib/utils";

type SiteAreaRemindersProps = {
  className?: string;
  /** Show link back to the three-area gateway. */
  showGatewayLink?: boolean;
};

export function SiteAreaReminders({
  className,
  showGatewayLink = true,
}: SiteAreaRemindersProps) {
  return (
    <aside
      className={cn(
        "rounded-xl border border-border/80 bg-secondary/25 px-4 py-4 md:px-5 md:py-5",
        className,
      )}
      aria-label="אזורים נוספים באתר"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {SHOP_OTHER_AREAS_TITLE}
      </p>
      <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm">
        {SHOP_OTHER_AREAS.map((area, index) => (
          <span key={area.href} className="inline-flex items-center gap-2">
            {index > 0 && (
              <span className="text-muted-foreground/40" aria-hidden>
                ·
              </span>
            )}
            <Link
              to={area.href}
              className="font-medium text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
            >
              {area.label}
            </Link>
          </span>
        ))}
        {showGatewayLink && (
          <>
            <span className="text-muted-foreground/40" aria-hidden>
              ·
            </span>
            <Link
              to="/"
              className="font-medium text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
            >
              כל האזורים
            </Link>
          </>
        )}
      </p>
    </aside>
  );
}
