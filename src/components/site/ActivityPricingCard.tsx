import { useState } from "react";
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
import { ActivityPurchaseDialog } from "@/components/site/ActivityPurchaseDialog";

export function ActivityPricingCard({ plan }: { plan: ActivityPricingPlan }) {
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const paymentUrl = plan.paymentUrl ?? ACTIVITIES_EXTERNAL_PAYMENT_URL;
  const hasPayment = Boolean(paymentUrl);

  return (
    <>
      <article className="flex h-full flex-col rounded-lg border border-border bg-card p-3 md:rounded-xl md:p-6">
        {plan.isSubscription && (
          <span className="mb-1.5 inline-flex items-center gap-1 self-start rounded-md bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent md:mb-3 md:gap-1.5 md:px-2.5 md:py-1 md:text-xs">
            <Repeat size={10} className="md:size-3" aria-hidden />
            מנוי · הוראת קבע
          </span>
        )}
        {isPunchCardPlan(plan) && (
          <span className="mb-1.5 inline-flex items-center gap-1 self-start rounded-md bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent md:mb-3 md:gap-1.5 md:px-2.5 md:py-1 md:text-xs">
            <Ticket size={10} className="md:size-3" aria-hidden />
            <span className="max-md:sr-only">כרטיסייה · </span>
            {plan.entryCount ?? ""} ניקובים
          </span>
        )}
        <h3 className="text-sm font-bold leading-snug text-foreground md:text-lg">{plan.name}</h3>
        {plan.description && (
          <p className="mt-1.5 hidden flex-1 text-sm leading-relaxed text-muted-foreground md:mt-2 md:block">
            {plan.description}
          </p>
        )}
        {plan.isSubscription && (
          <p className="mt-3 hidden rounded-lg border border-border bg-secondary/50 p-3 text-xs leading-relaxed text-muted-foreground md:block">
            {ACTIVITIES_SUBSCRIPTION_NOTICE}
          </p>
        )}
        <div className="mt-2 border-t border-border pt-2 md:mt-5 md:pt-4">
          <p className="text-lg font-black text-foreground md:text-2xl">
            ₪{formatActivityPrice(plan.price)}
            <span className="ms-1 block text-[10px] font-semibold text-muted-foreground md:ms-2 md:inline md:text-sm">
              {getActivityPriceLabel(plan)}
            </span>
          </p>
          <div className="mt-2 grid grid-cols-2 gap-1.5 md:mt-4 md:flex md:flex-col md:gap-2">
            {hasPayment && (
              <Button
                type="button"
                size="sm"
                className="h-8 w-full px-2 text-[11px] font-bold md:h-10 md:px-4 md:text-sm"
                onClick={() => setPurchaseOpen(true)}
              >
                <CreditCard size={14} className="md:size-4" />
                <span className="md:hidden">
                  {plan.isSubscription ? "הרשמה" : "רכישה"}
                </span>
                <span className="hidden md:inline">
                  {plan.isSubscription ? "הרשמה למנוי (הוראת קבע)" : "רכישה / הרשמה"}
                </span>
              </Button>
            )}
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-8 w-full px-2 text-[11px] font-semibold md:h-10 md:px-4 md:text-sm"
            >
              <a href={getActivitiesWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={14} className="md:size-4" />
                <span className="md:hidden">וואטסאפ</span>
                <span className="hidden md:inline">שאלה בוואטסאפ</span>
              </a>
            </Button>
          </div>
        </div>
      </article>

      {hasPayment && (
        <ActivityPurchaseDialog
          plan={plan}
          open={purchaseOpen}
          onOpenChange={setPurchaseOpen}
        />
      )}
    </>
  );
}
