import { useEffect, useMemo, useState } from "react";
import { Repeat, Search } from "lucide-react";
import { AdminPassChargePanel } from "@/components/site/AdminPassChargePanel";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import {
  ACTIVITIES_CATEGORIES,
  type ActivityCategoryId,
} from "@/data/activities";
import type { AdminRegistrationCustomerOption } from "@/data/adminRegistrationCustomers";
import {
  STANDING_STATUS_LABELS,
  type StandingRegistration,
  type StandingRegistrationStatus,
} from "@/data/passes";
import { listRegistrationCustomerOptions } from "@/lib/api/registrations.functions";
import { upsertStandingRegistration } from "@/lib/api/passes.functions";
import {
  formatStandingSlotLabel,
  getScheduleSlotsForCategory,
} from "@/lib/registrations/helpers";

const CATEGORY_IDS = ACTIVITIES_CATEGORIES.map((c) => c.id).filter(
  (id) => id !== "camps",
) as ActivityCategoryId[];

export type AdminStandingRegistrationPrefill = {
  categoryId?: ActivityCategoryId;
  slotId?: string;
  customerKey?: string;
  participantName?: string;
  participantAge?: string;
  guardianName?: string;
  phone?: string;
  email?: string;
};

type Props = {
  authToken: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
  standing?: StandingRegistration | null;
  prefill?: AdminStandingRegistrationPrefill;
};

export function AdminStandingRegistrationDialog({
  authToken,
  open,
  onOpenChange,
  onSaved,
  standing,
  prefill,
}: Props) {
  const [customers, setCustomers] = useState<AdminRegistrationCustomerOption[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState("");
  const [categoryId, setCategoryId] = useState<ActivityCategoryId>("ninja-kids");
  const [slotId, setSlotId] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [participantAge, setParticipantAge] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [passId, setPassId] = useState("none");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<StandingRegistrationStatus>("active");

  const categorySlots = useMemo(
    () => getScheduleSlotsForCategory(categoryId),
    [categoryId],
  );

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
    if (passId === "none") return;
    const pass = customerActivePasses.find((row) => row.id === passId);
    if (!pass || pass.categoryId !== categoryId) {
      setPassId("none");
    }
  }, [categoryId, passId, customerActivePasses]);

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
    if (!open) return;

    if (standing) {
      setCategoryId(standing.categoryId);
      setSlotId(standing.slotId);
      setParticipantName(standing.participantName);
      setParticipantAge(standing.participantAge ?? "");
      setGuardianName(standing.guardianName ?? "");
      setPhone(standing.phone);
      setEmail(standing.email ?? "");
      setPassId(standing.passId ?? "none");
      setNotes(standing.notes ?? "");
      setStatus(standing.status);
      setSelectedKey(
        standing.customerId
          ? `id:${standing.customerId}`
          : standing.email
            ? `email:${standing.email}`
            : `phone:${standing.phone}`,
      );
      return;
    }

    const nextCategory = prefill?.categoryId ?? "ninja-kids";
    const slots = getScheduleSlotsForCategory(nextCategory);
    setCategoryId(nextCategory);
    setSlotId(prefill?.slotId ?? slots[0]?.id ?? "");
    setSelectedKey(prefill?.customerKey ?? "");
    setParticipantName(prefill?.participantName ?? "");
    setParticipantAge(prefill?.participantAge ?? "");
    setGuardianName(prefill?.guardianName ?? "");
    setPhone(prefill?.phone ?? "");
    setEmail(prefill?.email ?? "");
    setPassId("none");
    setNotes("");
    setStatus("active");
    setQuery("");
  }, [open, standing, prefill]);

  useEffect(() => {
    if (!selectedCustomer) return;
    setParticipantName(selectedCustomer.fullName);
    setPhone(selectedCustomer.phone);
    setEmail(selectedCustomer.email ?? "");
    setPassId("none");
  }, [selectedCustomer]);

  useEffect(() => {
    if (categorySlots.some((slot) => slot.id === slotId)) return;
    setSlotId(categorySlots[0]?.id ?? "");
  }, [categorySlots, slotId]);

  function resetForm() {
    setQuery("");
    setSelectedKey("");
    setPassId("none");
    setNotes("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!participantName.trim() || !phone.trim()) {
      toast.error("נא למלא שם וטלפון.");
      return;
    }
    if (!slotId) {
      toast.error("נא לבחור שיעור קבוע.");
      return;
    }

    setSubmitting(true);
    try {
      await upsertStandingRegistration({
        data: {
          authToken,
          standing: {
            id: standing?.id,
            customerId: selectedCustomer?.customerId,
            categoryId,
            slotId,
            participantName: participantName.trim(),
            participantAge: participantAge.trim() || undefined,
            guardianName: guardianName.trim() || undefined,
            phone: phone.trim(),
            email: email.trim() || undefined,
            passId: passId === "none" ? undefined : passId,
            notes: notes.trim() || undefined,
            status,
          },
        },
      });

      toast.success(standing ? "הרישום הקבוע עודכן." : "הרישום הקבוע נוצר.");
      onSaved();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "שמירה נכשלה.");
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
            <Repeat size={18} />
            {standing ? "עריכת רישום קבוע" : "רישום קבוע חדש"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            הלקוח/ה יירשם אוטומטית לשיעור הקבוע — ניתן לרשום לשיעור הקרוב בלחיצה אחת.
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
            <div className="max-h-36 overflow-y-auto rounded-xl border bg-secondary/20 divide-y">
              {loadingCustomers ? (
                <p className="p-4 text-sm text-muted-foreground">טוען לקוחות...</p>
              ) : filteredCustomers.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">לא נמצאו לקוחות.</p>
              ) : (
                filteredCustomers.slice(0, 10).map((customer) => (
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
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>קטגוריה</Label>
              <Select
                value={categoryId}
                onValueChange={(value) => setCategoryId(value as ActivityCategoryId)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_IDS.map((id) => {
                    const category = ACTIVITIES_CATEGORIES.find((row) => row.id === id);
                    return (
                      <SelectItem key={id} value={id}>
                        {category?.title ?? id}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>שיעור קבוע *</Label>
              <Select value={slotId} onValueChange={setSlotId}>
                <SelectTrigger>
                  <SelectValue placeholder="בחרו שיעור" />
                </SelectTrigger>
                <SelectContent>
                  {categorySlots.map((slot) => (
                    <SelectItem key={slot.id} value={slot.id}>
                      {formatStandingSlotLabel(slot.id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="standingName">שם משתתף/ת *</Label>
              <Input
                id="standingName"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="standingPhone">טלפון *</Label>
              <Input
                id="standingPhone"
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="standingEmail">אימייל</Label>
              <Input
                id="standingEmail"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="standingAge">גיל</Label>
              <Input
                id="standingAge"
                value={participantAge}
                onChange={(e) => setParticipantAge(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="standingGuardian">שם הורה</Label>
              <Input
                id="standingGuardian"
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
              lessonCategoryId={categoryId}
              mode="standing"
            />
          )}

          <div className="space-y-2">
            <Label>סטטוס</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as StandingRegistrationStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(STANDING_STATUS_LABELS) as StandingRegistrationStatus[]).map(
                  (value) => (
                    <SelectItem key={value} value={value}>
                      {STANDING_STATUS_LABELS[value]}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="standingNotes">הערות</Label>
            <Textarea
              id="standingNotes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              ביטול
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "שומר..." : standing ? "שמירה" : "יצירת רישום קבוע"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
