import { useCallback, useEffect, useMemo, useState } from "react";
import { ClipboardList, CreditCard, RefreshCw, Ticket } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  ActivePassReportRow,
  ActiveSubscriptionReportRow,
  AdminReportsSnapshot,
} from "@/data/adminReports";
import { PASS_STATUS_LABELS } from "@/data/passes";
import { REGISTRATION_STATUS_LABELS } from "@/data/registrations";
import { listAdminReports } from "@/lib/api/reports.functions";

function filterRows<T extends { participantName: string; phone: string; email?: string; categoryName: string; planName: string }>(
  rows: T[],
  query: string,
): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return rows;

  return rows.filter((row) =>
    [row.participantName, row.phone, row.email ?? "", row.categoryName, row.planName]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
}

function formatReportDate(iso: string) {
  return new Date(iso).toLocaleDateString("he-IL", { timeZone: "Asia/Jerusalem" });
}

function AccountBadge({ hasAccount }: { hasAccount: boolean }) {
  return (
    <Badge variant={hasAccount ? "secondary" : "outline"} className="text-xs">
      {hasAccount ? "חשבון" : "אורח"}
    </Badge>
  );
}

export function AdminReportsPanel({ authToken }: { authToken: string }) {
  const [reports, setReports] = useState<AdminReportsSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const subscriptions = useMemo(
    () => filterRows(reports?.activeSubscriptions ?? [], query),
    [reports, query],
  );
  const passes = useMemo(
    () => filterRows(reports?.activePasses ?? [], query),
    [reports, query],
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listAdminReports({ data: { authToken } });
      setReports(result);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "טעינת הדוחות נכשלה.");
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-accent font-semibold text-sm mb-1">
            <ClipboardList size={16} />
            ניהול פנימי
          </div>
          <h2 className="text-2xl font-black text-foreground">דוחות מנהל</h2>
          <p className="text-muted-foreground mt-1 text-sm max-w-2xl">
            כרטסת מסודרת — הוראות קבע פעילות ולקוחות עם כרטיסיות פעילות.
          </p>
          {reports?.updatedAt && (
            <p className="text-xs text-muted-foreground mt-2">
              עודכן לאחרונה:{" "}
              {new Date(reports.updatedAt).toLocaleString("he-IL", {
                timeZone: "Asia/Jerusalem",
              })}
            </p>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void loadData()}
          disabled={loading}
        >
          <RefreshCw size={14} className="ms-1" />
          רענון
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-3xl font-black text-accent">
            {reports?.activeSubscriptions.length ?? 0}
          </p>
          <p className="text-sm text-muted-foreground mt-1">הוראות קבע פעילות</p>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-3xl font-black text-accent">{reports?.activePasses.length ?? 0}</p>
          <p className="text-sm text-muted-foreground mt-1">כרטיסיות פעילות</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label>חיפוש בכל הדוחות</Label>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="שם, טלפון, אימייל, מנוי, קטגוריה..."
        />
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard size={18} className="text-accent" />
          <h3 className="text-xl font-bold text-foreground">הוראות קבע פעילות</h3>
          <Badge variant="outline">{subscriptions.length}</Badge>
        </div>

        <div className="rounded-2xl border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-end whitespace-nowrap">משתתף/ת</TableHead>
                <TableHead className="text-end whitespace-nowrap">טלפון</TableHead>
                <TableHead className="text-end whitespace-nowrap hidden md:table-cell">אימייל</TableHead>
                <TableHead className="text-end whitespace-nowrap">מנוי</TableHead>
                <TableHead className="text-end whitespace-nowrap hidden lg:table-cell">קטגוריה</TableHead>
                <TableHead className="text-end whitespace-nowrap">סטטוס</TableHead>
                <TableHead className="text-end whitespace-nowrap hidden lg:table-cell">עודכן</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    {loading ? "טוען..." : "אין הוראות קבע פעילות."}
                  </TableCell>
                </TableRow>
              ) : (
                subscriptions.map((row: ActiveSubscriptionReportRow) => (
                  <TableRow key={row.id}>
                    <TableCell className="text-end">
                      <p className="font-medium">{row.participantName}</p>
                      <AccountBadge hasAccount={row.hasAccount} />
                    </TableCell>
                    <TableCell className="text-end" dir="ltr">
                      {row.phone}
                    </TableCell>
                    <TableCell className="text-end hidden md:table-cell" dir="ltr">
                      {row.email ?? "—"}
                    </TableCell>
                    <TableCell className="text-end font-medium">{row.planName}</TableCell>
                    <TableCell className="text-end hidden lg:table-cell text-sm text-muted-foreground">
                      {row.categoryName}
                    </TableCell>
                    <TableCell className="text-end">
                      <Badge variant="outline">{REGISTRATION_STATUS_LABELS[row.status]}</Badge>
                    </TableCell>
                    <TableCell className="text-end hidden lg:table-cell text-sm text-muted-foreground">
                      {formatReportDate(row.updatedAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Ticket size={18} className="text-accent" />
          <h3 className="text-xl font-bold text-foreground">לקוחות עם כרטיסיות פעילות</h3>
          <Badge variant="outline">{passes.length}</Badge>
        </div>

        <div className="rounded-2xl border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-end whitespace-nowrap">משתתף/ת</TableHead>
                <TableHead className="text-end whitespace-nowrap">טלפון</TableHead>
                <TableHead className="text-end whitespace-nowrap hidden md:table-cell">אימייל</TableHead>
                <TableHead className="text-end whitespace-nowrap">כרטיסייה</TableHead>
                <TableHead className="text-end whitespace-nowrap hidden lg:table-cell">קטגוריה</TableHead>
                <TableHead className="text-end whitespace-nowrap">ניקובים</TableHead>
                <TableHead className="text-end whitespace-nowrap">סטטוס</TableHead>
                <TableHead className="text-end whitespace-nowrap hidden lg:table-cell">נרכש</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {passes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                    {loading ? "טוען..." : "אין כרטיסיות פעילות."}
                  </TableCell>
                </TableRow>
              ) : (
                passes.map((row: ActivePassReportRow) => (
                  <TableRow key={row.id}>
                    <TableCell className="text-end">
                      <p className="font-medium">{row.participantName}</p>
                      <AccountBadge hasAccount={row.hasAccount} />
                    </TableCell>
                    <TableCell className="text-end" dir="ltr">
                      {row.phone}
                    </TableCell>
                    <TableCell className="text-end hidden md:table-cell" dir="ltr">
                      {row.email ?? "—"}
                    </TableCell>
                    <TableCell className="text-end font-medium">{row.planName}</TableCell>
                    <TableCell className="text-end hidden lg:table-cell text-sm text-muted-foreground">
                      {row.categoryName}
                    </TableCell>
                    <TableCell className="text-end font-bold text-accent whitespace-nowrap">
                      {row.entriesRemaining}/{row.entriesTotal}
                    </TableCell>
                    <TableCell className="text-end">
                      <Badge variant="outline">{PASS_STATUS_LABELS[row.status]}</Badge>
                    </TableCell>
                    <TableCell className="text-end hidden lg:table-cell text-sm text-muted-foreground">
                      {formatReportDate(row.purchasedAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
