import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, MapPin, MessageCircle, Plus, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductMedia } from "@/components/site/ProductMedia";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/cart";
import { getCheckoutSuggestions } from "@/lib/checkout";
import {
  CONTACT_PHONE_DISPLAY,
  getOrderWhatsAppUrl,
} from "@/lib/contact";
import { COMPANY } from "@/data/legal";
import {
  PAYMENT_INSTALLMENTS_LABEL,
  PAYMENT_WHATSAPP_NOTICE,
} from "@/data/payment";
import type { Product } from "@/data/products";

type DeliveryMethod = "delivery" | "pickup";

function OrderSummary({
  subtotal,
  delivery,
}: {
  subtotal: number;
  delivery: DeliveryMethod;
}) {
  const { items } = useCart();
  const isPickup = delivery === "pickup";

  return (
    <div className="bg-card border border-border rounded-xl p-5 sticky top-24">
      <h2 className="font-bold text-lg text-foreground mb-4">סיכום הזמנה</h2>
      <ul className="space-y-3 mb-4 max-h-48 overflow-y-auto">
        {items.map((item) => (
          <li key={item.productId} className="flex justify-between gap-3 text-sm">
            <span className="text-muted-foreground line-clamp-2 flex-1">
              {item.title} × {item.quantity}
            </span>
            <span className="font-semibold text-foreground shrink-0">
              ₪{formatPrice(item.price * item.quantity)}
            </span>
          </li>
        ))}
      </ul>
      <div className="border-t border-border pt-4 space-y-2 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>סכום ביניים</span>
          <span>₪{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>משלוח</span>
          <span>{isPickup ? "איסוף עצמי" : "תיאום בוואטסאפ"}</span>
        </div>
        <div className="flex justify-between text-base font-bold text-foreground pt-2">
          <span>סה״כ מוצרים</span>
          <span>₪{formatPrice(subtotal)}</span>
        </div>
        <p className="text-xs text-muted-foreground pt-2 leading-relaxed">
          {PAYMENT_WHATSAPP_NOTICE} {PAYMENT_INSTALLMENTS_LABEL}.
        </p>
      </div>
    </div>
  );
}

function LastMinuteProduct({ product }: { product: Product }) {
  const { addItem, items } = useCart();
  const inCart = items.some((i) => i.productId === product.id);

  function handleAdd() {
    addItem(product, 1);
    toast.success("נוסף להזמנה", { description: product.title });
  }

  return (
    <article className="shrink-0 w-40 sm:w-44 bg-card border border-border rounded-xl overflow-hidden hover:border-accent/40 transition">
      <Link to="/products/$productId" params={{ productId: product.id }}>
        <div className="aspect-square bg-secondary overflow-hidden">
          <ProductMedia product={product} alt={product.title} />
        </div>
      </Link>
      <div className="p-3">
        <p className="text-xs font-semibold text-foreground line-clamp-2 min-h-[2.5rem] leading-snug">
          {product.title}
        </p>
        <p className="text-sm font-bold text-foreground mt-2">₪{formatPrice(product.price)}</p>
        <Button
          type="button"
          size="sm"
          variant={inCart ? "secondary" : "default"}
          className="w-full mt-2 h-8 text-xs font-semibold"
          onClick={handleAdd}
          disabled={inCart}
        >
          <Plus size={14} />
          {inCart ? "בעגלה" : "הוספה"}
        </Button>
      </div>
    </article>
  );
}

function CheckoutSuccess() {
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
        <MessageCircle className="text-accent" size={28} />
      </div>
      <h1 className="text-2xl md:text-3xl font-black text-foreground">ההזמנה נשלחה לוואטסאפ</h1>
      <p className="text-muted-foreground mt-3 leading-relaxed">
        המשיכו בשיחה בוואטסאפ כדי לתאם תשלום, אספקה ופרטים נוספים. נחזור אליכם בהקדם.
      </p>
      <p className="text-sm text-muted-foreground mt-4">
        מספר:{" "}
        <a
          href={`tel:${CONTACT_PHONE_DISPLAY.replace(/-/g, "")}`}
          className="font-semibold text-accent hover:underline"
          dir="ltr"
        >
          {CONTACT_PHONE_DISPLAY}
        </a>
      </p>
      <Button asChild className="mt-8 font-semibold">
        <Link to="/">חזרה לחנות</Link>
      </Button>
    </div>
  );
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, totalQuantity, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [delivery, setDelivery] = useState<DeliveryMethod>("pickup");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    notes: "",
  });

  const suggestions = getCheckoutSuggestions(items.map((i) => i.productId));

  const whatsappUrl = useMemo(
    () =>
      getOrderWhatsAppUrl({
        items,
        subtotal,
        delivery,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        notes: form.notes,
      }),
    [items, subtotal, delivery, form],
  );

  useEffect(() => {
    if (items.length === 0 && !submitted) {
      navigate({ to: "/cart" });
    }
  }, [items.length, submitted, navigate]);

  function handleWhatsAppOrder() {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    clearCart();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted) {
    return <CheckoutSuccess />;
  }

  if (items.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <Link
        to="/cart"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition mb-6"
      >
        <ChevronLeft size={16} />
        חזרה לעגלה
      </Link>

      <h1 className="text-2xl md:text-3xl font-black text-foreground mb-2">השלמת הזמנה בוואטסאפ</h1>
      <p className="text-muted-foreground mb-6">{totalQuantity} פריטים · ללא תשלום באתר</p>

      <div className="mb-8 rounded-xl border border-accent/40 bg-accent/5 p-4 md:p-5 flex gap-3">
        <MessageCircle className="text-accent shrink-0 mt-0.5" size={22} aria-hidden />
        <div>
          <p className="font-bold text-foreground">{PAYMENT_WHATSAPP_NOTICE}</p>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            בחרו אספקה, מלאו פרטים בקצרה ושלחו את ההזמנה בוואטסאפ — שם נשלים תשלום ותיאום.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        <div className="space-y-8">
          <section className="bg-card border border-border rounded-xl p-5 md:p-6">
            <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-accent" />
              אספקה
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              {(
                [
                  ["pickup", "איסוף עצמי מהחנות"],
                  ["delivery", "משלוח לכתובת"],
                ] as const
              ).map(([value, label]) => (
                <label
                  key={value}
                  className={`flex-1 flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition ${
                    delivery === value
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={value}
                    checked={delivery === value}
                    onChange={() => setDelivery(value)}
                    className="accent-accent"
                  />
                  <span className="text-sm font-semibold">{label}</span>
                </label>
              ))}
            </div>

            {delivery === "pickup" ? (
              <p className="text-sm text-muted-foreground">
                כתובת החנות: {COMPANY.address} · {COMPANY.phone}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground leading-relaxed">
                עלויות משלוח וזמני אספקה נקבעים בתיאום בוואטסאפ אחרי שליחת ההזמנה.
              </p>
            )}
          </section>

          <section className="bg-card border border-border rounded-xl p-5 md:p-6">
            <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <Smartphone size={18} className="text-accent" />
              פרטי קשר (מומלץ)
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">שם פרטי</Label>
                <Input
                  id="firstName"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">שם משפחה</Label>
                <Input
                  id="lastName"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="phone">טלפון</Label>
                <Input
                  id="phone"
                  type="tel"
                  dir="ltr"
                  className="text-start"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Label htmlFor="notes">הערות להזמנה (אופציונלי)</Label>
              <textarea
                id="notes"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="למשל: אגיע בשעות הערב…"
              />
            </div>
          </section>

          <Button
            type="button"
            onClick={handleWhatsAppOrder}
            className="w-full h-12 text-base font-bold lg:hidden"
          >
            <MessageCircle size={18} />
            שליחת הזמנה בוואטסאפ · ₪{formatPrice(subtotal)}
          </Button>
        </div>

        <div className="hidden lg:block">
          <OrderSummary subtotal={subtotal} delivery={delivery} />
          <Button
            type="button"
            onClick={handleWhatsAppOrder}
            className="w-full h-12 text-base font-bold mt-4"
          >
            <MessageCircle size={18} />
            שליחת הזמנה בוואטסאפ · ₪{formatPrice(subtotal)}
          </Button>
        </div>
      </div>

      {suggestions.length > 0 && (
        <section className="mt-14 pt-10 border-t border-border">
          <h2 className="text-xl font-bold text-foreground mb-1">רגע לפני ששולחים…</h2>
          <p className="text-sm text-muted-foreground mb-6">
            מוצרים פופולריים שאולי שכחתם — הוסיפו בלחיצה אחת
          </p>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory">
            {suggestions.map((product) => (
              <div key={product.id} className="snap-start">
                <LastMinuteProduct product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 p-4 bg-background/95 backdrop-blur border-t border-border">
        <Button type="button" onClick={handleWhatsAppOrder} className="w-full h-12 text-base font-bold">
          <MessageCircle size={18} />
          שליחת הזמנה בוואטסאפ · ₪{formatPrice(subtotal)}
        </Button>
      </div>
      <div className="lg:hidden h-20" aria-hidden />
    </div>
  );
}
