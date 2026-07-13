import { Link } from "@tanstack/react-router";
import {
  AIRFLOOR_MAT_VARIANTS,
  formatAirfloorSizeSlash,
} from "@/data/airfloorMats";

type AirfloorSizeBarProps = {
  currentProductId: string;
};

export function AirfloorSizeBar({ currentProductId }: AirfloorSizeBarProps) {
  return (
    <nav
      dir="rtl"
      className="mb-8"
      aria-labelledby="airfloor-size-bar-heading"
    >
      <h2
        id="airfloor-size-bar-heading"
        className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3"
      >
        מידות זמינות
      </h2>
      <div className="flex flex-wrap gap-2">
        {AIRFLOOR_MAT_VARIANTS.map((variant) => {
          const isCurrent = variant.id === currentProductId;
          const label = `${formatAirfloorSizeSlash(variant)} מטר`;

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
    </nav>
  );
}
