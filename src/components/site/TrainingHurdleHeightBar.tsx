import { Link } from "@tanstack/react-router";
import { HURDLE_HEIGHT_VARIANTS, HURDLE_PRODUCT_TITLE } from "@/data/trainingAccessories";

type TrainingHurdleHeightBarProps = {
  currentProductId: string;
};

function formatPrice(n: number) {
  return n.toLocaleString("he-IL");
}

export function TrainingHurdleHeightBar({ currentProductId }: TrainingHurdleHeightBarProps) {
  return (
    <nav dir="rtl" className="mb-8" aria-labelledby="training-hurdle-height-bar-heading">
      <h2
        id="training-hurdle-height-bar-heading"
        className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3"
      >
        {HURDLE_PRODUCT_TITLE} — אפשרויות רכישה
      </h2>
      <div className="flex flex-wrap gap-2">
        {HURDLE_HEIGHT_VARIANTS.map((variant) => {
          const isCurrent = variant.id === currentProductId;
          const label = `${variant.heightCm} ס״מ · ${formatPrice(variant.price)} ₪`;

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
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
