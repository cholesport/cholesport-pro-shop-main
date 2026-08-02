import { CreditCard, MessageCircle, Repeat, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ACTIVITIES_EXTERNAL_PAYMENT_URL,
  ACTIVITIES_SUBSCRIPTION_NOTICE,
  getActivitiesWhatsAppUrl,
  type ActivityPricingPlan,
} from "@/data/activities";
import {
  formatActivityPrice,
  getActivityPriceLabel,
  isPunchCardPlan,
} from "@/lib/activities";

export function ActivityPricingCard({ plan }: { plan: ActivityPricingPlan }) {
  const paymentUrl = plan.paymentUrl ?? ACTIVITIES_EXTERNAL_PAYMENT_URL;

  return (
    <article className="flex flex-col rounded-xl border border-border bg-card p-5 md:p-6 h-full">
      {plan.isSubscription && (
        <span className="inline-flex items-center gap-1.5 self-start rounded-md bg-accent/10 px-2.5 py-1 text-xs font-bold text-accent mb-3">
          <Repeat size={12} aria-hidden />
          מנוי · הוראת קבע
        </span>
      )}
      {isPunchCardPlan(plan) && (
        <span className="inline-flex items-center gap-1.5 self-start rounded-md bg-accent/10 px-2.5 py-1 text-xs font-bold text-accent mb-3">
          <Ticket size={12} aria-hidden />
          כרטיסייה · {plan.entryCount ?? ""} ניקובים
        </span>
      )}
      <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
      {plan.description && (
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
          {plan.description}
        </p>
      )}
      {plan.isSubscription && (
        <p className="mt-3 text-xs text-muted-foreground leading-relaxed rounded-lg border border-border bg-secondary/50 p-3">
          {ACTIVITIES_SUBSCRIPTION_NOTICE}
        </p>
      )}
      <div className="mt-5 pt-4 border-t border-border">
        <p className="text-2xl font-black text-foreground">
          ₪{formatActivityPrice(plan.price)}
          <span className="text-sm font-semibold text-muted-foreground ms-2">
            {getActivityPriceLabel(plan)}
          </span>
        </p>
        <div className="mt-4 flex flex-col gap-2">
          {paymentUrl && (
            <Button asChild className="w-full font-bold">
              <a href={paymentUrl} target="_blank" rel="noopener noreferrer">
                <CreditCard size={16} />
                {plan.isSubscription ? "הרשמה למנוי (הוראת קבע)" : "רכישה / הרשמה"}
              </a>
            </Button>
          )}
          <Button asChild variant="outline" className="w-full font-semibold">
            <a href={getActivitiesWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={16} />
              שאלה בוואטסאפ
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}
