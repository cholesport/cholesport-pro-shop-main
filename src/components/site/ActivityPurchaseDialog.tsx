import { useEffect, useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ActivityPricingPlan } from "@/data/activities";
import { createActivityPaymentRegistration } from "@/lib/api/registrations.functions";
import { loadAccountSession } from "@/lib/accountSession";
import { formatActivityPrice, getActivityPriceLabel } from "@/lib/activities";
import { safeAction } from "@/lib/safeAction";

type ActivityPurchaseDialogProps = {
  plan: ActivityPricingPlan;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ActivityPurchaseDialog({ plan, open, onOpenChange }: ActivityPurchaseDialogProps) {
  const [participantName, setParticipantName] = useState("");
  const [participantAge, setParticipantAge] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [customerToken, setCustomerToken] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    const session = loadAccountSession();
    if (!session || session.isAdmin) return;
    setCustomerToken(session.customerToken);
    setParticipantName(
      [session.firstName, session.lastName].filter(Boolean).join(" ").trim(),
    );
    setPhone(session.phone || "");
    setEmail(session.email || "");
  }, [open]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!participantName.trim() || !phone.trim()) {
      toast.error("נא למלא שם משתתף וטלפון.");
      return;
    }

    setSubmitting(true);
    const result = await safeAction(
      () =>
        createActivityPaymentRegistration({
          data: {
            customerToken,
            planId: plan.id,
            participantName: participantName.trim(),
            participantAge: participantAge.trim() || undefined,
            guardianName: guardianName.trim() || undefined,
            phone: phone.trim(),
            email: email.trim() || undefined,
            notes: notes.trim() || undefined,
          },
        }),
      {
        fallbackMessage: "לא הצלחנו לשמור את הרישום. נסו שוב או פנו בוואטסאפ.",
      },
    );
    setSubmitting(false);

    if (!result) return;

    onOpenChange(false);
    toast.success("הרישום נשמר — מעבירים לדף התשלום המאובטח.");
    window.open(result.paymentUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>רכישה / הרשמה — {plan.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            לפני מעבר לתשלום, נשמור את הפרטים שלכם בלוח הניהול כדי שנוכל לאשר ולתאם שיעור.
          </p>

          <div className="rounded-lg border bg-secondary/40 px-4 py-3">
            <p className="text-2xl font-black text-foreground">
              ₪{formatActivityPrice(plan.price)}
              <span className="text-sm font-semibold text-muted-foreground ms-2">
                {getActivityPriceLabel(plan)}
              </span>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchase-participant">שם המשתתף *</Label>
            <Input
              id="purchase-participant"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="purchase-age">גיל</Label>
              <Input
                id="purchase-age"
                value={participantAge}
                onChange={(e) => setParticipantAge(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchase-guardian">שם הורה</Label>
              <Input
                id="purchase-guardian"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchase-phone">טלפון *</Label>
            <Input
              id="purchase-phone"
              type="tel"
              dir="ltr"
              className="text-end"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchase-email">אימייל</Label>
            <Input
              id="purchase-email"
              type="email"
              dir="ltr"
              className="text-end"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchase-notes">הערות</Label>
            <Textarea
              id="purchase-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <DialogFooter className="gap-2 sm:justify-start">
            <Button type="submit" className="font-bold" disabled={submitting}>
              {submitting ? (
                <Loader2 size={16} className="animate-spin" aria-hidden />
              ) : (
                <CreditCard size={16} aria-hidden />
              )}
              המשך לתשלום מאובטח
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              ביטול
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
