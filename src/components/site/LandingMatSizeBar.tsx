import { Link } from "@tanstack/react-router";
import {
  formatLandingMatDimensions,
  LANDING_MAT_VARIANTS,
} from "@/data/landingMats";
import { CustomMatSizeNotice } from "@/components/site/CustomMatSizeNotice";

type LandingMatSizeBarProps = {
  currentProductId: string;
};

export function LandingMatSizeBar({ currentProductId }: LandingMatSizeBarProps) {
  return (
    <nav
      dir="rtl"
      className="mb-8"
      aria-labelledby="landing-mat-size-bar-heading"
    >
      <h2
        id="landing-mat-size-bar-heading"
        className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3"
      >
        מידות זמינות
      </h2>
      <div className="flex flex-wrap items-center gap-2">
        {LANDING_MAT_VARIANTS.map((variant) => {
          const isCurrent = variant.id === currentProductId;
          const label = formatLandingMatDimensions(variant);

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
        <CustomMatSizeNotice kind="landing" compact />
      </div>
      <CustomMatSizeNotice kind="landing" />
    </nav>
  );
}
