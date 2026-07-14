import { Link } from "@tanstack/react-router";
import { getTrainingAccessoryNavProducts, isHurdleProduct } from "@/data/trainingAccessories";

type TrainingAccessoriesProductBarProps = {
  currentProductId: string;
};

export function TrainingAccessoriesProductBar({
  currentProductId,
}: TrainingAccessoriesProductBarProps) {
  return (
    <nav dir="rtl" className="mb-8" aria-labelledby="training-accessories-product-bar-heading">
      <h2
        id="training-accessories-product-bar-heading"
        className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3"
      >
        מוצרים בקטגוריה
      </h2>
      <div className="flex flex-wrap gap-2">
        {getTrainingAccessoryNavProducts().map((product) => {
          const isCurrent = isHurdleProduct(currentProductId)
            ? isHurdleProduct(product.id)
            : product.id === currentProductId;

          return (
            <Link
              key={product.subcategoryLabel}
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
