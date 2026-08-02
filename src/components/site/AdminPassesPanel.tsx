import { useCallback, useEffect, useState } from "react";
import {
  CalendarPlus,
  Pencil,
  Plus,
  RefreshCw,
  Repeat,
  Ticket,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DEMO_CUSTOMER_HINT } from "@/data/demo";
import type { ActivityPass, StandingRegistration } from "@/data/passes";
import { PASS_STATUS_LABELS, STANDING_STATUS_LABELS } from "@/data/passes";
import { AdminStandingRegistrationDialog } from "@/components/site/AdminStandingRegistrationDialog";
import { getPunchCardPlans } from "@/lib/activities";
import {
  adjustAdminPass,
  deleteStandingRegistration,
  issueAdminPass,
  listAdminPasses,
  registerAllStandingForNextSession,
  registerStandingForNextSession,
} from "@/lib/api/passes.functions";
import { formatStandingSlotLabel } from "@/lib/registrations/helpers";

const PUNCH_PLANS = getPunchCardPlans();

type IssuePassForm = {
  email: string;
  phone: string;
  planId: string;
  participantName: string;
  participantAge: string;
  entriesRemaining: string;
};

function emptyIssueForm(): IssuePassForm {
  return {
    email: "",
    phone: "",
    planId: PUNCH_PLANS[0]?.id ?? "",
    participantName: "",
    participantAge: "",
    entriesRemaining: "",
  };
}

export function AdminPassesPanel({ authToken }: { authToken: string }) {
  const [passes, setPasses] = useState<ActivityPass[]>([]);
  const [standing, setStanding] = useState<StandingRegistration[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [issueOpen, setIssueOpen] = useState(false);
  const [standingOpen, setStandingOpen] = useState(false);
  const [standingEdit, setStandingEdit] = useState<StandingRegistration | null>(null);
  const [issueForm, setIssueForm] = useState<IssuePassForm>(emptyIssueForm);
  const [adjustingPassId, setAdjustingPassId] = useState<string | null>(null);
  const [adjustValue, setAdjustValue] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listAdminPasses({ data: { authToken } });
      setPasses(result.passes);
      setStanding(result.standingRegistrations);
      setUpdatedAt(result.updatedAt);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "טעינת הכרטיסיות נכשלה.");
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function handleIssuePass() {
    try {
      const entriesRemaining = issueForm.entriesRemaining
        ? Number(issueForm.entriesRemaining)
        : undefined;
      await issueAdminPass({
        data: {
          authToken,
          email: issueForm.email.trim() || undefined,
          phone: issueForm.phone.trim() || undefined,
          planId: issueForm.planId,
          participantName: issueForm.participantName.trim(),
          participantAge: issueForm.participantAge.trim() || undefined,
          entriesRemaining,
        },
      });
      toast.success("הכרטיסייה הונפקה.");
      setIssueOpen(false);
      setIssueForm(emptyIssueForm());
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "הנפקת הכרטיסייה נכשלה.");
    }
  }

  async function handleAdjustPass(passId: string) {
    const value = Number(adjustValue);
    if (Number.isNaN(value) || value < 0) {
      toast.error("נא להזין מספר ניקובים תקין.");
      return;
    }
    try {
      await adjustAdminPass({
        data: { authToken, passId, entriesRemaining: value },
      });
      toast.success("מספר הניקובים עודכן.");
      setAdjustingPassId(null);
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "עדכון נכשל.");
    }
  }

  async function handleRegisterStanding(id: string) {
    try {
      const result = await registerStandingForNextSession({
        data: { authToken, standingId: id },
      });
      toast.success(`נרשם לשיעור ב-${result.sessionDate}`);
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ההרשמה נכשלה.");
    }
  }

  async function handleRegisterAllStanding() {
    try {
      const result = await registerAllStandingForNextSession({ data: { authToken } });
      const ok = result.results.filter((row) => row.ok).length;
      const failed = result.results.length - ok;
      toast.message(`הושלם: ${ok} הצליחו, ${failed} נכשלו`);
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ההרשמה נכשלה.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-accent font-semibold text-sm mb-1">
            <Ticket size={16} />
            ניהול פנימי
          </div>
          <h2 className="text-2xl font-black text-foreground">כרטיסיות ורישום קבוע</h2>
          <p className="text-muted-foreground mt-1 text-sm max-w-2xl">
            הנפקת כרטיסיות, מעקב ניקובים, ורישום קבוע למתאמנים.
          </p>
          <p className="text-xs text-accent mt-2">{DEMO_CUSTOMER_HINT}</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => void loadData()} disabled={loading}>
          <RefreshCw size={14} className="ms-1" />
          רענון
        </Button>
      </div>

      <Tabs defaultValue="passes">
        <TabsList>
          <TabsTrigger value="passes">כרטיסיות</TabsTrigger>
          <TabsTrigger value="standing">רישום קבוע</TabsTrigger>
        </TabsList>

        <TabsContent value="passes" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button type="button" onClick={() => setIssueOpen(true)}>
              <Plus size={16} />
              הנפקת כרטיסייה
            </Button>
          </div>

          <div className="rounded-2xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-end">משתתף</TableHead>
                  <TableHead className="text-end">כרטיסייה</TableHead>
                  <TableHead className="text-end">ניקובים</TableHead>
                  <TableHead className="text-end">סטטוס</TableHead>
                  <TableHead className="text-end">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {passes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                      {loading ? "טוען..." : "אין כרטיסיות."}
                    </TableCell>
                  </TableRow>
                ) : (
                  passes.map((pass) => (
                    <TableRow key={pass.id}>
                      <TableCell className="text-end">
                        <p className="font-medium">{pass.participantName}</p>
                        <p className="text-xs text-muted-foreground" dir="ltr">
                          {pass.phone}
                        </p>
                      </TableCell>
                      <TableCell className="text-end">
                        <p>{pass.planName}</p>
                        <p className="text-xs text-muted-foreground">{pass.categoryName}</p>
                      </TableCell>
                      <TableCell className="text-end font-bold text-accent">
                        {pass.entriesRemaining}/{pass.entriesTotal}
                      </TableCell>
                      <TableCell className="text-end">
                        <Badge variant="outline">{PASS_STATUS_LABELS[pass.status]}</Badge>
                      </TableCell>
                      <TableCell className="text-end">
                        {adjustingPassId === pass.id ? (
                          <div className="flex items-center gap-2 justify-end">
                            <Input
                              className="w-20"
                              value={adjustValue}
                              onChange={(e) => setAdjustValue(e.target.value)}
                              inputMode="numeric"
                            />
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => void handleAdjustPass(pass.id)}
                            >
                              שמור
                            </Button>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setAdjustingPassId(pass.id);
                              setAdjustValue(String(pass.entriesRemaining));
                            }}
                          >
                            <Pencil size={14} />
                            עדכון ניקובים
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="standing" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => void handleRegisterAllStanding()}>
              <CalendarPlus size={16} />
              הרשם את כולם לשיעור הקרוב
            </Button>
            <Button
              type="button"
              onClick={() => {
                setStandingEdit(null);
                setStandingOpen(true);
              }}
            >
              <Plus size={16} />
              רישום קבוע חדש
            </Button>
          </div>

          <div className="rounded-2xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-end">מתאמן/ת</TableHead>
                  <TableHead className="text-end">שיעור קבוע</TableHead>
                  <TableHead className="text-end">כרטיסייה</TableHead>
                  <TableHead className="text-end">סטטוס</TableHead>
                  <TableHead className="text-end">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {standing.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                      {loading ? "טוען..." : "אין רישומים קבועים."}
                    </TableCell>
                  </TableRow>
                ) : (
                  standing.map((row) => {
                    const linkedPass = passes.find((pass) => pass.id === row.passId);
                    return (
                      <TableRow key={row.id}>
                        <TableCell className="text-end">
                          <p className="font-medium">{row.participantName}</p>
                          <p className="text-xs text-muted-foreground" dir="ltr">
                            {row.phone}
                          </p>
                        </TableCell>
                        <TableCell className="text-end text-sm">
                          {formatStandingSlotLabel(row.slotId)}
                        </TableCell>
                        <TableCell className="text-end text-sm">
                          {linkedPass
                            ? `${linkedPass.entriesRemaining}/${linkedPass.entriesTotal}`
                            : "—"}
                        </TableCell>
                        <TableCell className="text-end">
                          <Badge variant="outline">{STANDING_STATUS_LABELS[row.status]}</Badge>
                        </TableCell>
                        <TableCell className="text-end">
                          <div className="flex flex-wrap gap-2 justify-end">
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => void handleRegisterStanding(row.id)}
                              disabled={row.status !== "active"}
                            >
                              <Repeat size={14} />
                              הרשם לשיעור הקרוב
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setStandingEdit(row);
                                setStandingOpen(true);
                              }}
                            >
                              <Pencil size={14} />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                void deleteStandingRegistration({
                                  data: { authToken, id: row.id },
                                }).then(() => loadData())
                              }
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {updatedAt && (
        <p className="text-xs text-muted-foreground">
          עודכן לאחרונה:{" "}
          {new Date(updatedAt).toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" })}
        </p>
      )}

      <Dialog open={issueOpen} onOpenChange={setIssueOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>הנפקת כרטיסייה</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>מסלול</Label>
              <Select
                value={issueForm.planId}
                onValueChange={(value) => setIssueForm({ ...issueForm, planId: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PUNCH_PLANS.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>אימייל לקוח</Label>
                <Input
                  dir="ltr"
                  value={issueForm.email}
                  onChange={(e) => setIssueForm({ ...issueForm, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>טלפון</Label>
                <Input
                  dir="ltr"
                  value={issueForm.phone}
                  onChange={(e) => setIssueForm({ ...issueForm, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>שם משתתף/ת *</Label>
                <Input
                  value={issueForm.participantName}
                  onChange={(e) =>
                    setIssueForm({ ...issueForm, participantName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>גיל</Label>
                <Input
                  value={issueForm.participantAge}
                  onChange={(e) =>
                    setIssueForm({ ...issueForm, participantAge: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>ניקובים נותרים (אופציונלי)</Label>
              <Input
                inputMode="numeric"
                placeholder="ברירת מחדל: מלא כרטיסייה"
                value={issueForm.entriesRemaining}
                onChange={(e) =>
                  setIssueForm({ ...issueForm, entriesRemaining: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIssueOpen(false)}>
              ביטול
            </Button>
            <Button type="button" onClick={() => void handleIssuePass()}>
              הנפקה
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AdminStandingRegistrationDialog
        authToken={authToken}
        open={standingOpen}
        onOpenChange={setStandingOpen}
        standing={standingEdit}
        onSaved={() => void loadData()}
      />
    </div>
  );
}
