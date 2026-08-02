import { useEffect, useMemo, useState } from "react";
import { Search, UserPlus } from "lucide-react";
import { AdminPassChargePanel } from "@/components/site/AdminPassChargePanel";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ActivityScheduleSlot } from "@/data/activities";
import type { AdminRegistrationCustomerOption } from "@/data/adminRegistrationCustomers";
import {
  adminRegisterToSession,
  listRegistrationCustomerOptions,
} from "@/lib/api/registrations.functions";
import { upsertStandingRegistration } from "@/lib/api/passes.functions";
import { formatScheduleDateLong, parseScheduleDateIso } from "@/lib/activitySchedule";
import { getPricingPlansForCategory } from "@/lib/registrations/helpers";

type RegisterDialogProps = {
  authToken: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slot: ActivityScheduleSlot;
  sessionDate: string;
  onRegistered: () => void;
};

export function AdminScheduleRegisterDialog({
  authToken,
  open,
  onOpenChange,
  slot,
  sessionDate,
  onRegistered,
}: RegisterDialogProps) {
  const [customers, setCustomers] = useState<AdminRegistrationCustomerOption[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [passId, setPassId] = useState<string>("none");
  const [planId, setPlanId] = useState<string>("none");
  const [participantAge, setParticipantAge] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [notes, setNotes] = useState("");
  const [alsoStanding, setAlsoStanding] = useState(false);

  const [manualName, setManualName] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [manualEmail, setManualEmail] = useState("");

  const plans = useMemo(() => getPricingPlansForCategory(slot.categoryId), [slot.categoryId]);

  const filteredCustomers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((customer) =>
      [customer.fullName, customer.phone, customer.email ?? ""].join(" ").toLowerCase().includes(q),
    );
  }, [customers, query]);

  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.key === selectedKey),
    [customers, selectedKey],
  );

  const customerActivePasses = selectedCustomer?.activePasses ?? [];

  useEffect(() => {
    if (!open) return;

    setLoadingCustomers(true);
    void listRegistrationCustomerOptions({ data: { authToken } })
      .then((result) => setCustomers(result.customers))
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "טעינת הלקוחות נכשלה.");
      })
      .finally(() => setLoadingCustomers(false));
  }, [authToken, open]);

  useEffect(() => {
    if (!selectedCustomer) return;
    setManualName(selectedCustomer.fullName);
    setManualPhone(selectedCustomer.phone);
    setManualEmail(selectedCustomer.email ?? "");
    setPassId("none");
  }, [selectedCustomer]);

  function resetForm() {
    setQuery("");
    setSelectedKey("");
    setPassId("none");
    setPlanId("none");
    setParticipantAge("");
    setGuardianName("");
    setNotes("");
    setManualName("");
    setManualPhone("");
    setManualEmail("");
    setAlsoStanding(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!manualName.trim() || !manualPhone.trim()) {
      toast.error("נא למלא שם וטלפון.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await adminRegisterToSession({
        data: {
          authToken,
          slotId: slot.id,
          sessionDate,
          customerKey: selectedKey || undefined,
          participantName: manualName.trim(),
          participantAge: participantAge.trim() || undefined,
          guardianName: guardianName.trim() || undefined,
          phone: manualPhone.trim(),
          email: manualEmail.trim() || undefined,
          passId: passId === "none" ? undefined : passId,
          planId: planId === "none" ? undefined : planId,
          notes: notes.trim() || undefined,
          status: "confirmed",
        },
      });

      if ("pass" in result && result.pass) {
        toast.success("נרשם בהצלחה ונוכה ניקוב מהכרטיסייה.", {
          description: `נותרו ${result.pass.entriesRemaining} ניקובים.`,
        });
      } else {
        toast.success("הלקוח נרשם לשיעור.");
      }

      if (alsoStanding) {
        await upsertStandingRegistration({
          data: {
            authToken,
            standing: {
              customerId: selectedCustomer?.customerId,
              categoryId: slot.categoryId,
              slotId: slot.id,
              participantName: manualName.trim(),
              participantAge: participantAge.trim() || undefined,
              guardianName: guardianName.trim() || undefined,
              phone: manualPhone.trim(),
              email: manualEmail.trim() || undefined,
              passId: passId === "none" ? undefined : passId,
              planId: planId === "none" ? undefined : planId,
              notes: notes.trim() || undefined,
              status: "active",
            },
          },
        });
        toast.success("נוצר גם רישום קבוע לשיעור.");
      }

      onRegistered();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ההרשמה נכשלה.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) resetForm();
      }}
    >
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus size={18} />
            רישום לשיעור
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {slot.title} · {slot.timeStart}–{slot.timeEnd} ·{" "}
            {formatScheduleDateLong(parseScheduleDateIso(sessionDate))}
          </p>
        </DialogHeader>

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
          <div className="space-y-2">
            <Label>בחירת לקוח קיים</Label>
            <div className="relative">
              <Search
                size={16}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="חיפוש לפי שם, טלפון או אימייל..."
                className="pe-9"
              />
            </div>
            <div className="max-h-40 overflow-y-auto rounded-xl border bg-secondary/20 divide-y">
              {loadingCustomers ? (
                <p className="p-4 text-sm text-muted-foreground">טוען לקוחות...</p>
              ) : filteredCustomers.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">לא נמצאו לקוחות.</p>
              ) : (
                filteredCustomers.slice(0, 12).map((customer) => (
                  <button
                    key={customer.key}
                    type="button"
                    onClick={() => setSelectedKey(customer.key)}
                    className={`w-full text-start px-4 py-3 transition hover:bg-secondary/60 ${
                      selectedKey === customer.key ? "bg-accent/10" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{customer.fullName}</span>
                      {customer.hasAccount && (
                        <Badge variant="secondary" className="text-xs">
                          חשבון
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5" dir="ltr">
                      {customer.phone}
                      {customer.email ? ` · ${customer.email}` : ""}
                    </p>
                    {customer.activePasses.length > 0 && (
                      <p className="text-xs text-accent mt-1">
                        {customer.activePasses.length} כרטיסיות פעילות
                      </p>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="participantName">שם משתתף/ת *</Label>
              <Input
                id="participantName"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">טלפון *</Label>
              <Input
                id="phone"
                dir="ltr"
                value={manualPhone}
                onChange={(e) => setManualPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">אימייל</Label>
              <Input
                id="email"
                dir="ltr"
                value={manualEmail}
                onChange={(e) => setManualEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="participantAge">גיל</Label>
              <Input
                id="participantAge"
                value={participantAge}
                onChange={(e) => setParticipantAge(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guardianName">שם הורה</Label>
              <Input
                id="guardianName"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
              />
            </div>
          </div>

          {customerActivePasses.length > 0 && (
            <AdminPassChargePanel
              passes={customerActivePasses}
              passId={passId}
              onPassIdChange={setPassId}
              lessonCategoryId={slot.categoryId}
              mode="session"
            />
          )}

          <div className="space-y-2">
            <Label>מסלול / מנוי (אופציונלי)</Label>
            <Select value={planId} onValueChange={setPlanId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">לא צוין</SelectItem>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">הערות</Label>
            <Textarea
              id="notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <label className="flex items-start gap-3 rounded-xl border bg-secondary/30 p-4 cursor-pointer">
            <Checkbox
              checked={alsoStanding}
              onCheckedChange={(checked) => setAlsoStanding(checked === true)}
              className="mt-0.5"
            />
            <div>
              <p className="font-medium text-sm">גם רישום קבוע לשיעור הזה</p>
              <p className="text-xs text-muted-foreground mt-1">
                הלקוח/ה יישארו משויכים לשיעור הקבוע — ניתן לרשום לשיעור הקרוב בלחיצה אחת.
              </p>
            </div>
          </label>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              ביטול
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "שומר..." : "רישום לשיעור"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
