import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CustomerCommerceHistory } from "@/data/commerce";
import { formatPrice } from "@/data/account";
import { SHOP_ORDER_STATUS_LABELS } from "@/data/shopOrders";
import { REGISTRATION_STATUS_LABELS } from "@/data/registrations";

function EmptyCommerceState() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-secondary/40 px-6 py-10 text-center">
      <p className="font-semibold text-foreground">עדיין אין רכישות או הרשמות</p>
      <p className="mt-2 text-sm text-muted-foreground">
        הזמנות מהחנות והרשמות לחוגים יופיעו כאן — מסודרות לפי קטגוריות.
      </p>
      <Button asChild className="mt-5 font-semibold">
        <Link to="/">להתחלת קניות</Link>
      </Button>
    </div>
  );
}

export function CustomerCommerceView({ history }: { history: CustomerCommerceHistory }) {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  if (
    history.stats.shopOrderCount === 0 &&
    history.stats.activityCount === 0
  ) {
    return <EmptyCommerceState />;
  }

  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "הזמנות מהחנות", value: history.stats.shopOrderCount },
          { label: "הרשמות לפעילויות", value: history.stats.activityCount },
          { label: "מנויים פעילים", value: history.stats.subscriptionCount },
        ].map(({ label, value }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-5 text-center">
            <p className="text-3xl font-black text-accent">{value}</p>
            <p className="text-sm text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      {history.categories.map((group) => (
        <section key={`${group.domain}-${group.categoryKey}`} className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-lg text-foreground">{group.categoryName}</h3>
            <Badge variant="outline">
              {group.domain === "shop" ? "מוצרים" : "פעילויות"}
            </Badge>
            {group.activeSubscriptions.length > 0 && (
              <Badge variant="secondary">מנוי פעיל</Badge>
            )}
          </div>

          {group.shopOrders.length > 0 && (
            <div className="space-y-3">
              {group.shopOrders.map((order) => {
                const expanded = expandedOrderId === order.id;
                const relevantItems = order.items.filter(
                  (item) =>
                    (item.categorySlug ?? item.productCat ?? "other") === group.categoryKey,
                );
                const relevantTotal = relevantItems.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0,
                );

                return (
                  <div
                    key={order.id}
                    className="bg-card border border-border rounded-xl p-5 hover:border-accent/40 transition"
                  >
                    <button
                      type="button"
                      className="w-full text-start"
                      onClick={() => setExpandedOrderId(expanded ? null : order.id)}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-foreground">הזמנה #{order.orderNumber}</p>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString("he-IL", {
                              timeZone: "Asia/Jerusalem",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">
                            {SHOP_ORDER_STATUS_LABELS[order.status]}
                          </Badge>
                          <p className="font-bold text-foreground">
                            ₪{formatPrice(relevantTotal)}
                          </p>
                        </div>
                      </div>
                    </button>
                    {expanded && (
                      <ul className="mt-4 space-y-2 text-sm border-t border-border pt-4">
                        {relevantItems.map((item) => (
                          <li
                            key={`${order.id}-${item.productId}`}
                            className="flex justify-between gap-3"
                          >
                            <span>
                              {item.title} × {item.quantity}
                            </span>
                            <span className="shrink-0 font-semibold text-foreground">
                              ₪{formatPrice(item.price * item.quantity)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {group.activities.length > 0 && (
            <div className="space-y-3">
              {group.activities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-card border border-border rounded-xl p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-foreground">
                        {activity.planName ?? "הרשמה לשיעור"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {activity.participantName} · {activity.sessionDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {activity.isSubscription && (
                        <Badge variant="secondary">מנוי</Badge>
                      )}
                      <Badge variant="outline">
                        {REGISTRATION_STATUS_LABELS[activity.status]}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

export function CustomerCommerceOverview({
  history,
  passes = [],
  onViewAll,
  onViewPasses,
}: {
  history: CustomerCommerceHistory;
  passes?: Array<{ entriesRemaining: number; entriesTotal: number; status: string }>;
  onViewAll: () => void;
  onViewPasses?: () => void;
}) {
  const latestShopOrder = history.shopOrders[0];
  const latestActivity = history.activities[0];
  const activePasses = passes.filter((pass) => pass.status === "active");
  const totalPunches = activePasses.reduce((sum, pass) => sum + pass.entriesRemaining, 0);

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { label: "ניקובים בכרטיסיות", value: totalPunches },
          { label: "הזמנות מהחנות", value: history.stats.shopOrderCount },
          { label: "הרשמות לפעילויות", value: history.stats.activityCount },
          { label: "מנויים פעילים", value: history.stats.subscriptionCount },
        ].map(({ label, value }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-5 text-center">
            <p className="text-3xl font-black text-accent">{value}</p>
            <p className="text-sm text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-foreground">פעילות אחרונה</h3>
          <div className="flex gap-3">
            {onViewPasses && activePasses.length > 0 && (
              <button
                type="button"
                onClick={onViewPasses}
                className="text-sm text-accent hover:underline"
              >
                הכרטיסיות שלי
              </button>
            )}
            <button
              type="button"
              onClick={onViewAll}
              className="text-sm text-accent hover:underline"
            >
              כל הרכישות
            </button>
          </div>
        </div>
        {latestShopOrder ? (
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="font-bold text-foreground">הזמנה #{latestShopOrder.orderNumber}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {SHOP_ORDER_STATUS_LABELS[latestShopOrder.status]} · ₪
              {formatPrice(latestShopOrder.subtotal)}
            </p>
          </div>
        ) : latestActivity ? (
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="font-bold text-foreground">
              {latestActivity.planName ?? latestActivity.categoryName}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {latestActivity.participantName} · {latestActivity.sessionDate}
            </p>
          </div>
        ) : (
          <EmptyCommerceState />
        )}
      </div>
    </div>
  );
}
