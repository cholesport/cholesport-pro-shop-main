import { Link } from "@tanstack/react-router";
import { GYMBOREE_PRODUCTS } from "@/data/gymboree";

type GymboreeProductBarProps = {
  currentProductId: string;
};

export function GymboreeProductBar({ currentProductId }: GymboreeProductBarProps) {
  return (
    <nav dir="rtl" className="mb-8" aria-labelledby="gymboree-product-bar-heading">
      <h2
        id="gymboree-product-bar-heading"
        className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3"
      >
        מוצרים בקטגוריה
      </h2>
      <div className="flex flex-wrap gap-2">
        {GYMBOREE_PRODUCTS.map((product) => {
          const isCurrent = product.id === currentProductId;

          return (
            <Link
              key={product.id}
              to="/products/$productId"
              params={{ productId: product.id }}
              aria-current={isCurrent ? "page" : undefined}
              className={`px-4 py-2 text-sm font-medium transition ${
                isCurrent
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-foreground hover:bg-accent/10 hover:text-accent"
              }`}
            >
              {product.subcategoryLabel}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
