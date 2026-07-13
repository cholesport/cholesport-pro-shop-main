import { Link } from "@tanstack/react-router";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import {
  getProductByIdOrThrow,
  PONG_BOT_NOVA_S_PRO_ID,
  TABLE_TENNIS_EQUIPMENT_CATEGORY_SLUG,
  type Product,
} from "@/data/products";
import { PAYMENT_INSTALLMENTS_LABEL } from "@/data/payment";

const SECTION_TITLE = "ציוד משלים למקצוענים: רובוט אימון NOVA S PRO";

const SECTION_DESCRIPTION =
  "רובוט האימון NOVA S PRO מבית PONG BOT הוא ה-Ultimate Partner לאימון אישי — " +
  "מגיע עם 100 כדורי טניס שולחן, רשת איסוף מקצועית, ומהווה את פתרון ה-All-in-one " +
  "הכי מתקדם שיש לשחקנים שרוצים להתאמן בקצב שלהם.";

function formatPrice(n: number) {
  return n.toLocaleString("he-IL");
}

type ComplementaryEquipmentSectionProps = {
  product?: Product;
};

export function ComplementaryEquipmentSection({
  product = getProductByIdOrThrow(PONG_BOT_NOVA_S_PRO_ID),
}: ComplementaryEquipmentSectionProps) {
  const { addItem } = useCart();

  function handleAddToCart() {
    addItem(product, 1);
    toast.success("נוסף לעגלה", { description: product.title });
  }

  return (
    <section className="mt-16 pt-10 border-t border-border" aria-labelledby="complementary-equipment-heading">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 id="complementary-equipment-heading" className="text-xl md:text-2xl font-black text-foreground">
          {SECTION_TITLE}
        </h2>
        <Link
          to="/categories/$categorySlug"
          params={{ categorySlug: TABLE_TENNIS_EQUIPMENT_CATEGORY_SLUG }}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent bg-accent/10 px-3 py-1.5 rounded-full hover:bg-accent/20 transition"
        >
          ציוד טניס שולחן
          <ArrowLeft size={14} />
        </Link>
      </div>

      <article className="group grid md:grid-cols-2 gap-0 rounded-2xl border-2 border-accent/30 bg-card overflow-hidden shadow-[var(--shadow-card)] hover:border-accent/60 transition">
        <Link
          to="/products/$productId"
          params={{ productId: product.id }}
          className="relative bg-white aspect-[4/3] md:aspect-auto md:min-h-[320px] overflow-hidden block"
        >
          <img
            src={product.img}
            alt={product.title}
            className="w-full h-full object-contain p-6 md:p-10 group-hover:scale-[1.02] transition duration-500"
            loading="lazy"
          />
          {product.badge && (
            <span className="absolute top-4 start-4 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wide px-3 py-1 rounded">
              {product.badge}
            </span>
          )}
        </Link>

        <div className="flex flex-col justify-center p-6 md:p-8 lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{product.brand}</p>
          <Link to="/products/$productId" params={{ productId: product.id }}>
            <h3 className="mt-1 text-lg md:text-xl font-bold text-foreground leading-snug hover:text-accent transition">
              {product.title}
            </h3>
          </Link>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{SECTION_DESCRIPTION}</p>

          <div className="mt-6 flex items-baseline gap-2">
            <span className="text-2xl font-black text-foreground">{formatPrice(product.price)} ₪</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{PAYMENT_INSTALLMENTS_LABEL}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={handleAddToCart}
              className="font-bold gap-2"
            >
              <ShoppingCart size={18} />
              הוספה לעגלה
            </Button>
            <Button asChild variant="outline" className="font-semibold">
              <Link to="/products/$productId" params={{ productId: product.id }}>
                לדף המוצר המלא
              </Link>
            </Button>
          </div>
        </div>
      </article>
    </section>
  );
}
