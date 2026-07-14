import { Link } from "@tanstack/react-router";
import { MessageCircle, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuantityInput } from "@/components/site/QuantityInput";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/cart";
import { PAYMENT_SUMMARY, PAYMENT_WHATSAPP_NOTICE } from "@/data/payment";
import {
  getPuzzleMatDealLabel,
  isPuzzleMatProductId,
  PUZZLE_MAT_UNIT_PRICE,
} from "@/data/trainingAccessories";

export function CartPage() {
  const { items, subtotal, totalQuantity, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={36} className="text-muted-foreground" />
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-foreground">העגלה ריקה</h1>
        <p className="text-muted-foreground mt-3">עדיין לא הוספתם מוצרים לעגלה.</p>
        <Button asChild className="mt-8 font-semibold">
          <Link to="/">חזרה לקניות</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground">עגלת קניות</h1>
          <p className="text-muted-foreground mt-1">{totalQuantity} פריטים בעגלה</p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-sm text-muted-foreground hover:text-destructive transition"
        >
          ריקון עגלה
        </button>
      </div>

      <div className="mb-6 rounded-xl border border-accent/40 bg-accent/5 p-4 flex gap-3">
        <MessageCircle className="text-accent shrink-0 mt-0.5" size={20} aria-hidden />
        <p className="text-sm text-foreground leading-relaxed">
          <span className="font-bold">{PAYMENT_WHATSAPP_NOTICE}</span> אחרי העגלה תעברו לשליחת
          הזמנה בוואטסאפ.
        </p>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const dealLabel = isPuzzleMatProductId(item.productId)
            ? getPuzzleMatDealLabel(item.quantity)
            : null;

          return (
            <article
              key={item.productId}
              className="flex gap-4 p-4 bg-card border border-border rounded-xl"
            >
              <Link
                to="/products/$productId"
                params={{ productId: item.productId }}
                className="shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-secondary flex items-center justify-center px-2"
              >
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-semibold text-center leading-snug text-foreground/80 line-clamp-4">
                    {item.title}
                  </span>
                )}
              </Link>

              <div className="flex-1 min-w-0 flex flex-col">
                <Link
                  to="/products/$productId"
                  params={{ productId: item.productId }}
                  className="font-semibold text-foreground hover:text-accent transition line-clamp-2"
                >
                  {item.title}
                </Link>
                <p className="text-xs text-muted-foreground mt-1">{item.brand}</p>
                <div className="mt-auto flex flex-wrap items-baseline gap-2">
                  <p className="text-lg font-bold text-foreground">₪{formatPrice(item.price)}</p>
                  <span className="text-xs text-muted-foreground">ליחידה</span>
                  {isPuzzleMatProductId(item.productId) && item.price < PUZZLE_MAT_UNIT_PRICE && (
                    <span className="text-xs text-muted-foreground line-through">
                      ₪{formatPrice(PUZZLE_MAT_UNIT_PRICE)}
                    </span>
                  )}
                </div>
                {dealLabel && (
                  <p className="text-xs font-medium text-accent mt-1">{dealLabel}</p>
                )}
              </div>

              <div className="flex flex-col items-end justify-between gap-3">
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="text-muted-foreground hover:text-destructive transition p-1"
                  aria-label={`הסרת ${item.title} מהעגלה`}
                >
                  <Trash2 size={18} />
                </button>

                <QuantityInput
                  value={item.quantity}
                  onChange={(qty) => updateQuantity(item.productId, qty)}
                  size="sm"
                />

                <p className="text-sm font-bold text-foreground">
                  ₪{formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-8 p-6 bg-card border border-border rounded-xl">
        <div className="flex items-center justify-between text-lg font-bold text-foreground mb-6">
          <span>סה״כ מוצרים</span>
          <span>₪{formatPrice(subtotal)}</span>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          איסוף עצמי מהחנות ללא עלות · משלוח בתיאום בוואטסאפ · {PAYMENT_SUMMARY}
        </p>
        <Button asChild className="w-full h-12 text-base font-bold">
          <Link to="/checkout">
            <MessageCircle size={18} />
            המשך להזמנה בוואטסאפ
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full h-11 mt-3 font-semibold">
          <Link to="/">המשך בקניות</Link>
        </Button>
      </div>
    </div>
  );
}
