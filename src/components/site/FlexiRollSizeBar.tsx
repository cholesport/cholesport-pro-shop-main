import { Link } from "@tanstack/react-router";
import {
  FLEXI_ROLL_MULTI_DEAL_COPY,
  FLEXI_ROLL_VARIANTS,
  formatFlexiRollSizeSlash,
} from "@/data/flexiRoll";

type FlexiRollSizeBarProps = {
  currentProductId: string;
};

export function FlexiRollSizeBar({ currentProductId }: FlexiRollSizeBarProps) {
  return (
    <nav dir="rtl" className="mb-4" aria-labelledby="flexi-roll-size-bar-heading">
      <h2
        id="flexi-roll-size-bar-heading"
        className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2"
      >
        מידות זמינות — פלקסי רול
      </h2>
      <div className="flex flex-wrap items-center gap-2">
        {FLEXI_ROLL_VARIANTS.map((variant) => {
          const isCurrent = variant.id === currentProductId;
          const label = `${formatFlexiRollSizeSlash(variant)} מטר`;

          return (
            <Link
              key={variant.id}
              to="/products/$productId"
              params={{ productId: variant.id }}
              aria-current={isCurrent ? "page" : undefined}
              className={`px-4 py-2 text-sm font-medium transition ${
                isCurrent
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-foreground hover:bg-accent/10 hover:text-accent"
              }`}
            >
              <span dir="ltr" className="unicode-bidi-plaintext inline-block">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
      <p className="mt-2 text-xs font-medium text-accent">{FLEXI_ROLL_MULTI_DEAL_COPY}</p>
    </nav>
  );
}
