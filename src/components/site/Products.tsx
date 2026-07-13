import { HOMEPAGE_PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/site/ProductCard";

export function Products() {
  return (
    <section id="products" className="max-w-7xl mx-auto px-4 py-16 md:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div className="max-w-lg">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">נבחרת CHOLE</h2>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            מוצרים מובילים מהחנות — מחירים ישירים, בלי רעש של מבצעי קטלוג.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
        {HOMEPAGE_PRODUCTS.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
