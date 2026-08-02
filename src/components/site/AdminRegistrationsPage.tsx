import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, Pencil, Plus, RefreshCw, Repeat, Trash2, UserPlus, UserX, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ACTIVITIES_CATEGORIES,
  type ActivityCategoryId,
  type ActivityScheduleSlot,
} from "@/data/activities";
import { AdminScheduleRegisterDialog } from "@/components/site/AdminScheduleRegisterDialog";
import {
  AdminStandingRegistrationDialog,
  type AdminStandingRegistrationPrefill,
} from "@/components/site/AdminStandingRegistrationDialog";
import {
  REGISTRATION_SOURCE_LABELS,
  REGISTRATION_STATUS_LABELS,
  type ActivityRegistration,
  type ActivityRegistrationSource,
  type ActivityRegistrationStatus,
} from "@/data/registrations";
import { STANDING_STATUS_LABELS, type ActivityPass, type StandingRegistration } from "@/data/passes";
import {
  deleteActivityRegistration,
  listActivityRegistrations,
  upsertActivityRegistration,
} from "@/lib/api/registrations.functions";
import {
  deleteStandingRegistration,
  listAdminPasses,
  registerAllStandingForNextSession,
  registerStandingForNextSession,
} from "@/lib/api/passes.functions";
import {
  formatScheduleDateIso,
  formatScheduleDateLong,
  formatScheduleStripLabel,
  getUpcomingScheduleDays,
  isSameDay,
  SCHEDULE_CALENDAR_DAYS,
} from "@/lib/activitySchedule";
import {
  filterRegistrations,
  formatRegistrationSlotLabel,
  formatStandingSlotLabel,
  getActivityPlanLabel,
  getPricingPlansForCategory,
  getRegistrationSourceLabel,
  getRegistrationStatusLabel,
  getScheduleSlotById,
  getSlotsForCategoryAndDate,
} from "@/lib/registrations/helpers";
import { cn } from "@/lib/utils";

const CATEGORY_IDS = ACTIVITIES_CATEGORIES.map((c) => c.id).filter(
  (id) => id !== "camps",
) as ActivityCategoryId[];

type RegistrationFormState = {
  id?: string;
  categoryId: ActivityCategoryId;
  slotId: string;
  sessionDate: string;
  participantName: string;
  participantAge: string;
  guardianName: string;
  phone: string;
  email: string;
  planId: string;
  notes: string;
  status: ActivityRegistrationStatus;
  source: ActivityRegistrationSource;
};

function emptyForm(
  categoryId: ActivityCategoryId,
  sessionDate: string,
  slotId = "",
): RegistrationFormState {
  return {
    categoryId,
    slotId,
    sessionDate,
    participantName: "",
    participantAge: "",
    guardianName: "",
    phone: "",
    email: "",
    planId: "",
    notes: "",
    status: "confirmed",
    source: "manual",
  };
}

function registrationToForm(row: ActivityRegistration): RegistrationFormState {
  return {
    id: row.id,
    categoryId: row.categoryId,
    slotId: row.slotId,
    sessionDate: row.sessionDate,
    participantName: row.participantName,
    participantAge: row.participantAge ?? "",
    guardianName: row.guardianName ?? "",
    phone: row.phone,
    email: row.email ?? "",
    planId: row.planId ?? "",
    notes: row.notes ?? "",
    status: row.status,
    source: row.source,
  };
}

function statusVariant(status: ActivityRegistrationStatus) {
  switch (status) {
    case "confirmed":
      return "default" as const;
    case "pending":
      return "secondary" as const;
    case "cancelled":
      return "destructive" as const;
  }
}

export function AdminRegistrationsPanel({ authToken }: { authToken: string }) {
  const [registrations, setRegistrations] = useState<ActivityRegistration[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [categoryId, setCategoryId] = useState<ActivityCategoryId>("ninja-kids");
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [slotId, setSlotId] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<ActivityRegistrationStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [registerSlot, setRegisterSlot] = useState<ActivityScheduleSlot | null>(null);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [standing, setStanding] = useState<StandingRegistration[]>([]);
  const [passes, setPasses] = useState<ActivityPass[]>([]);
  const [standingDialogOpen, setStandingDialogOpen] = useState(false);
  const [standingEdit, setStandingEdit] = useState<StandingRegistration | null>(null);
  const [standingPrefill, setStandingPrefill] = useState<AdminStandingRegistrationPrefill | undefined>();
  const [standingQuery, setStandingQuery] = useState("");
  const [form, setForm] = useState<RegistrationFormState>(() =>
    emptyForm("ninja-kids", formatScheduleDateIso(new Date())),
  );

  const calendarDays = useMemo(() => getUpcomingScheduleDays(SCHEDULE_CALENDAR_DAYS), []);
  const sessionDateIso = formatScheduleDateIso(selectedDate);
  const slotsForDay = useMemo(
    () => getSlotsForCategoryAndDate(categoryId, selectedDate),
    [categoryId, selectedDate],
  );
  const formSlots = useMemo(() => {
    const [year, month, day] = form.sessionDate.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return getSlotsForCategoryAndDate(form.categoryId, date);
  }, [form.categoryId, form.sessionDate]);
  const formPlans = useMemo(
    () => getPricingPlansForCategory(form.categoryId),
    [form.categoryId],
  );

  const filtered = useMemo(
    () =>
      filterRegistrations(registrations, {
        categoryId,
        sessionDate: sessionDateIso,
        slotId: slotId === "all" ? undefined : slotId,
        status: statusFilter === "all" ? undefined : statusFilter,
        query,
      }),
    [registrations, categoryId, sessionDateIso, slotId, statusFilter, query],
  );

  const confirmedCount = filtered.filter((row) => row.status === "confirmed").length;

  const filteredStanding = useMemo(() => {
    const q = standingQuery.trim().toLowerCase();
    return standing.filter((row) => {
      if (!q) return true;
      const haystack = [row.participantName, row.phone, row.email, row.notes]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [standing, standingQuery]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [registrationsResult, passesResult] = await Promise.all([
        listActivityRegistrations({ data: { authToken } }),
        listAdminPasses({ data: { authToken } }),
      ]);
      setRegistrations(registrationsResult.registrations);
      setUpdatedAt(registrationsResult.updatedAt);
      setStanding(passesResult.standingRegistrations);
      setPasses(passesResult.passes);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "טעינת הנתונים נכשלה.");
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    if (slotId !== "all" && !slotsForDay.some((slot) => slot.id === slotId)) {
      setSlotId("all");
    }
  }, [slotsForDay, slotId]);

  function openRegisterForSlot(slot: ActivityScheduleSlot) {
    setRegisterSlot(slot);
    setRegisterDialogOpen(true);
  }

  function openStandingDialog(opts?: AdminStandingRegistrationPrefill, edit?: StandingRegistration) {
    setStandingEdit(edit ?? null);
    setStandingPrefill(opts);
    setStandingDialogOpen(true);
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
      if (failed > 0) {
        toast.warning(`${ok} נרשמו, ${failed} נכשלו.`);
      } else {
        toast.success(`כל הרישומים הקבועים נרשמו לשיעור הקרוב (${ok}).`);
      }
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ההרשמה נכשלה.");
    }
  }

  async function handleDeleteStanding(id: string) {
    try {
      await deleteStandingRegistration({ data: { authToken, id } });
      toast.success("הרישום הקבוע נמחק.");
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "מחיקה נכשלה.");
    }
  }

  function openCreateDialog() {
    const defaultSlot = slotsForDay[0]?.id ?? "";
    setForm(emptyForm(categoryId, sessionDateIso, defaultSlot));
    setDialogOpen(true);
  }

  function openEditDialog(row: ActivityRegistration) {
    setForm(registrationToForm(row));
    setCategoryId(row.categoryId);
    const [year, month, day] = row.sessionDate.split("-").map(Number);
    setSelectedDate(new Date(year, month - 1, day));
    setDialogOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.participantName.trim() || !form.phone.trim() || !form.slotId) {
      toast.error("מלאו שם משתתף, טלפון ושיעור.");
      return;
    }

    try {
      const slot = getScheduleSlotById(form.slotId);
      const result = await upsertActivityRegistration({
        data: {
          authToken,
          registration: {
            ...form,
            id: form.id,
            categoryId: slot?.categoryId ?? form.categoryId,
            email: form.email || undefined,
            planId: form.planId || undefined,
          },
        },
      });
      setRegistrations((prev) => {
        const without = prev.filter((row) => row.id !== result.registration.id);
        return [...without, result.registration];
      });
      setUpdatedAt(result.updatedAt);
      setDialogOpen(false);
      toast.success(form.id ? "הרשומה עודכנה." : "נרשם נוסף.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "שמירה נכשלה.");
    }
  }

  async function handleRemoveFromSession(registration: ActivityRegistration) {
    const message = registration.passId
      ? "להסיר את המתאמן/ת מהשיעור? הניקוב יוחזר אוטומטית לכרטיסייה."
      : "להסיר את המתאמן/ת מהשיעור?";
    if (!window.confirm(message)) return;

    try {
      const result = await deleteActivityRegistration({ data: { authToken, id: registration.id } });
      setRegistrations((prev) =>
        prev.map((row) => (row.id === registration.id ? result.registration : row)),
      );
      setUpdatedAt(result.updatedAt);
      if (result.passAction === "refunded") {
        toast.success("הוסר מהשיעור והניקוב הוחזר לכרטיסייה.");
        await loadData();
      } else {
        toast.success("הוסר מהשיעור.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ההסרה נכשלה.");
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("לבטל את ההרשמה?")) return;
    try {
      const result = await deleteActivityRegistration({ data: { authToken, id } });
      setRegistrations((prev) =>
        prev.map((row) => (row.id === id ? result.registration : row)),
      );
      setUpdatedAt(result.updatedAt);
      if (result.passAction === "refunded") {
        toast.success("ההרשמה בוטלה והניקוב הוחזר לכרטיסייה.");
        await loadData();
      } else {
        toast.success("ההרשמה בוטלה.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ביטול נכשל.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-accent font-semibold text-sm mb-1">
            <Users size={16} />
            ניהול פנימי
          </div>
          <h2 className="text-2xl font-black text-foreground">לוח שיעורים וניהול נרשמים</h2>
          <p className="text-muted-foreground mt-1 text-sm max-w-2xl">
            רישום לקוחות קיימים ללוז — בלי וואטסאפ ובלי תשלום אונליין. הסרה מהשיעור מחזירה ניקוב
            לכרטיסייה אוטומטית.
          </p>
          {updatedAt && (
            <p className="text-xs text-muted-foreground mt-2">
              עודכן לאחרונה:{" "}
              {new Date(updatedAt).toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" })}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => void loadData()} disabled={loading}>
            <RefreshCw size={14} className="ms-1" />
            רענון
          </Button>
          <Button type="button" size="sm" onClick={openCreateDialog}>
            <Plus size={14} className="ms-1" />
            הוספת נרשם
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-3xl font-black text-accent">{filtered.length}</p>
          <p className="text-sm text-muted-foreground mt-1">נרשמים ביום שנבחר</p>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-3xl font-black text-accent">{confirmedCount}</p>
          <p className="text-sm text-muted-foreground mt-1">מאושרים</p>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-3xl font-black text-accent">{registrations.length}</p>
          <p className="text-sm text-muted-foreground mt-1">סה״כ במערכת</p>
        </div>
      </div>

      <Tabs defaultValue="schedule">
        <TabsList>
          <TabsTrigger value="schedule">לוח והרשמה</TabsTrigger>
          <TabsTrigger value="standing">רישום קבוע</TabsTrigger>
          <TabsTrigger value="roster">רשימת נרשמים</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-6 mt-6">
      <div className="flex flex-wrap gap-2">
        {CATEGORY_IDS.map((id) => {
          const category = ACTIVITIES_CATEGORIES.find((c) => c.id === id);
          if (!category) return null;
          return (
            <Button
              key={id}
              type="button"
              size="sm"
              variant={categoryId === id ? "default" : "outline"}
              onClick={() => setCategoryId(id)}
            >
              {category.title}
            </Button>
          );
        })}
      </div>

      <div className="rounded-2xl border bg-card p-4">
        <div className="flex items-center gap-2 mb-3 text-sm font-semibold">
          <CalendarDays size={16} />
          {formatScheduleDateLong(selectedDate)}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {calendarDays.map((day) => {
            const { weekday, day: dayNum, month } = formatScheduleStripLabel(day);
            const selected = isSameDay(day, selectedDate);
            const count = getSlotsForCategoryAndDate(categoryId, day).length;
            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "shrink-0 flex flex-col items-center min-w-[4rem] px-2 py-2 rounded-xl border transition",
                  selected
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border bg-background hover:border-accent/40",
                )}
              >
                <span className="text-[10px] font-semibold">{weekday}</span>
                <span className="text-lg font-black">{dayNum}</span>
                <span className="text-[10px] opacity-80">{month}</span>
                {count > 0 && (
                  <span className="text-[9px] mt-1 font-bold">{count} שיעורים</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg text-foreground">שיעורים ביום שנבחר</h3>
        {slotsForDay.length === 0 ? (
          <p className="text-sm text-muted-foreground rounded-xl border border-dashed p-6 text-center">
            אין שיעורים בקטגוריה ובתאריך שנבחרו.
          </p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {slotsForDay.map((slot) => {
              const slotRegistrations = registrations.filter(
                (row) =>
                  row.slotId === slot.id &&
                  row.sessionDate === sessionDateIso &&
                  row.status !== "cancelled",
              );
              return (
                <article
                  key={slot.id}
                  className="rounded-2xl border bg-card p-5 space-y-4 hover:border-accent/30 transition"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-accent">
                        {slot.timeStart}–{slot.timeEnd}
                      </p>
                      <h4 className="text-lg font-bold text-foreground">{slot.title}</h4>
                      {slot.ageRange && (
                        <p className="text-sm text-muted-foreground mt-1">גילאים {slot.ageRange}</p>
                      )}
                    </div>
                    <Badge variant="secondary">{slotRegistrations.length} נרשמים</Badge>
                  </div>

                  {slotRegistrations.length > 0 && (
                    <ul className="space-y-2 text-sm">
                      {slotRegistrations.map((row) => (
                        <li
                          key={row.id}
                          className="flex items-center justify-between gap-2 rounded-lg bg-secondary/40 px-3 py-2"
                        >
                          <div className="min-w-0">
                            <span className="font-medium">{row.participantName}</span>
                            <span className="text-muted-foreground ms-2" dir="ltr">
                              {row.phone}
                            </span>
                            {row.passId && (
                              <Badge variant="secondary" className="ms-2 text-[10px]">
                                כרטיסייה
                              </Badge>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="shrink-0 text-destructive hover:text-destructive"
                            onClick={() => void handleRemoveFromSession(row)}
                            aria-label={`הסרת ${row.participantName} מהשיעור`}
                          >
                            <UserX size={16} />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex flex-col gap-2">
                    <Button type="button" className="font-bold w-full" onClick={() => openRegisterForSlot(slot)}>
                      <UserPlus size={16} />
                      רישום לקוח לשיעור
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="font-bold w-full"
                      onClick={() =>
                        openStandingDialog({
                          categoryId: slot.categoryId,
                          slotId: slot.id,
                        })
                      }
                    >
                      <Repeat size={16} />
                      רישום קבוע לשיעור
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
        </TabsContent>

        <TabsContent value="standing" className="space-y-6 mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground max-w-xl">
              רישום קבוע מקשר לקוח לשיעור חוזר. ניתן לרשום לשיעור הקרוב בלחיצה — עם או בלי חיוב מכרטיסייה.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => void handleRegisterAllStanding()}>
                <CalendarDays size={16} />
                הרשם את כולם לשיעור הקרוב
              </Button>
              <Button type="button" onClick={() => openStandingDialog()}>
                <Plus size={16} />
                רישום קבוע חדש
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="standing-search">חיפוש</Label>
            <Input
              id="standing-search"
              value={standingQuery}
              onChange={(e) => setStandingQuery(e.target.value)}
              placeholder="שם, טלפון או אימייל..."
            />
          </div>

          <div className="rounded-2xl border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-end">מתאמן/ת</TableHead>
                  <TableHead className="text-end">שיעור קבוע</TableHead>
                  <TableHead className="text-end hidden md:table-cell">כרטיסייה</TableHead>
                  <TableHead className="text-end">סטטוס</TableHead>
                  <TableHead className="text-end">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStanding.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                      {loading ? "טוען..." : "אין רישומים קבועים."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStanding.map((row) => {
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
                        <TableCell className="text-end text-sm hidden md:table-cell">
                          {linkedPass
                            ? `${linkedPass.entriesRemaining}/${linkedPass.entriesTotal}`
                            : "—"}
                        </TableCell>
                        <TableCell className="text-end">
                          <Badge variant="outline">{STANDING_STATUS_LABELS[row.status]}</Badge>
                        </TableCell>
                        <TableCell className="text-end">
                          <div className="flex flex-wrap gap-1 justify-end">
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => void handleRegisterStanding(row.id)}
                              disabled={row.status !== "active"}
                            >
                              <Repeat size={14} />
                              שיעור קרוב
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => openStandingDialog(undefined, row)}
                              aria-label="עריכה"
                            >
                              <Pencil size={14} />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => void handleDeleteStanding(row.id)}
                              aria-label="מחיקה"
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
            <div className="border-t px-4 py-3 text-sm text-muted-foreground">
              {filteredStanding.length} רישומים קבועים
            </div>
          </div>
        </TabsContent>

        <TabsContent value="roster" className="space-y-6 mt-6">
      <div className="grid gap-3 md:grid-cols-3">
        <div className="space-y-2">
          <Label>שיעור</Label>
          <Select value={slotId} onValueChange={setSlotId}>
            <SelectTrigger>
              <SelectValue placeholder="כל השיעורים ביום" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל השיעורים ביום</SelectItem>
              {slotsForDay.map((slot) => (
                <SelectItem key={slot.id} value={slot.id}>
                  {slot.title} · {slot.timeStart}–{slot.timeEnd}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>סטטוס</Label>
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as ActivityRegistrationStatus | "all")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">הכל</SelectItem>
              {(Object.keys(REGISTRATION_STATUS_LABELS) as ActivityRegistrationStatus[]).map(
                (status) => (
                  <SelectItem key={status} value={status}>
                    {REGISTRATION_STATUS_LABELS[status]}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>חיפוש</Label>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="שם, טלפון, הערות..."
          />
        </div>
      </div>

      <div className="rounded-2xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-end">משתתף</TableHead>
              <TableHead className="text-end">טלפון</TableHead>
              <TableHead className="text-end hidden md:table-cell">מנוי / כרטיסייה</TableHead>
              <TableHead className="text-end hidden lg:table-cell">שיעור</TableHead>
              <TableHead className="text-end hidden md:table-cell">הורה</TableHead>
              <TableHead className="text-end">סטטוס</TableHead>
              <TableHead className="text-end w-[100px]">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  {loading ? "טוען..." : "אין נרשמים לסינון שנבחר."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium text-end">
                    <div>{row.participantName}</div>
                    {row.participantAge && (
                      <div className="text-xs text-muted-foreground">גיל {row.participantAge}</div>
                    )}
                    {row.email && (
                      <div className="text-xs text-muted-foreground" dir="ltr">
                        {row.email}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-end" dir="ltr">
                    {row.phone}
                  </TableCell>
                  <TableCell className="text-end hidden md:table-cell">
                    {getActivityPlanLabel(row.planId)}
                  </TableCell>
                  <TableCell className="text-end hidden lg:table-cell text-sm">
                    {formatRegistrationSlotLabel(row)}
                  </TableCell>
                  <TableCell className="text-end hidden md:table-cell">
                    {row.guardianName || "—"}
                  </TableCell>
                  <TableCell className="text-end">
                    <Badge variant={statusVariant(row.status)}>
                      {getRegistrationStatusLabel(row.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-end">
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(row)}
                        aria-label="עריכה"
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => void handleDelete(row.id)}
                        aria-label="מחיקה"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="border-t px-4 py-3 text-sm text-muted-foreground">
          {filtered.length} נרשמים · {formatScheduleDateLong(selectedDate)}
        </div>
      </div>
        </TabsContent>
      </Tabs>

      {registerSlot && (
        <AdminScheduleRegisterDialog
          authToken={authToken}
          open={registerDialogOpen}
          onOpenChange={setRegisterDialogOpen}
          slot={registerSlot}
          sessionDate={sessionDateIso}
          onRegistered={() => void loadData()}
        />
      )}

      <AdminStandingRegistrationDialog
        authToken={authToken}
        open={standingDialogOpen}
        onOpenChange={setStandingDialogOpen}
        standing={standingEdit}
        prefill={standingPrefill}
        onSaved={() => void loadData()}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{form.id ? "עריכת נרשם" : "הוספת נרשם"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>שיעור *</Label>
                <Select
                  value={form.slotId}
                  onValueChange={(value) => {
                    const slot = getScheduleSlotById(value);
                    setForm((prev) => ({
                      ...prev,
                      slotId: value,
                      categoryId: slot?.categoryId ?? prev.categoryId,
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחרו שיעור" />
                  </SelectTrigger>
                  <SelectContent>
                    {formSlots.map((slot) => (
                      <SelectItem key={slot.id} value={slot.id}>
                        {slot.title} · {slot.timeStart}–{slot.timeEnd}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>מנוי / כרטיסייה</Label>
                <Select
                  value={form.planId || "none"}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, planId: value === "none" ? "" : value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחרו מסלול" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">לא צוין</SelectItem>
                    {formPlans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="participantName">שם משתתף *</Label>
                <Input
                  id="participantName"
                  value={form.participantName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, participantName: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="participantAge">גיל</Label>
                <Input
                  id="participantAge"
                  value={form.participantAge}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, participantAge: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guardianName">שם הורה / אפוטרופוס</Label>
                <Input
                  id="guardianName"
                  value={form.guardianName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, guardianName: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">טלפון *</Label>
                <Input
                  id="phone"
                  dir="ltr"
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="email">אימייל</Label>
                <Input
                  id="email"
                  type="email"
                  dir="ltr"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>סטטוס</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      status: value as ActivityRegistrationStatus,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(REGISTRATION_STATUS_LABELS) as ActivityRegistrationStatus[]).map(
                      (status) => (
                        <SelectItem key={status} value={status}>
                          {REGISTRATION_STATUS_LABELS[status]}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>מקור</Label>
                <Select
                  value={form.source}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      source: value as ActivityRegistrationSource,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(REGISTRATION_SOURCE_LABELS) as ActivityRegistrationSource[]).map(
                      (source) => (
                        <SelectItem key={source} value={source}>
                          {getRegistrationSourceLabel(source)}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="notes">הערות</Label>
                <Textarea
                  id="notes"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                ביטול
              </Button>
              <Button type="submit">שמירה</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
