import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Ticket, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ActivityPass } from "@/data/passes";
import { PASS_STATUS_LABELS } from "@/data/passes";
import { TABLE_TENNIS_PRICING_SECTION_ID } from "@/data/tableTennis";
import { redeemCustomerPass } from "@/lib/api/passes.functions";
import { cn } from "@/lib/utils";

function PunchMeter({
  remaining,
  total,
}: {
  remaining: number;
  total: number;
}) {
  const used = Math.max(0, total - remaining);
  const percent = total > 0 ? Math.round((remaining / total) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-foreground">
          {remaining} ניקובים נותרו מתוך {total}
        </span>
        <span className="text-muted-foreground">{percent}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">נוצלו {used} ניקובים</p>
    </div>
  );
}

function PassCard({
  pass,
  customerToken,
  slotId,
  sessionDate,
  onRedeemed,
  compact = false,
}: {
  pass: ActivityPass;
  customerToken?: string;
  slotId?: string;
  sessionDate?: string;
  onRedeemed?: (pass: ActivityPass) => void;
  compact?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const canRedeem =
    Boolean(customerToken && slotId && sessionDate) &&
    pass.status === "active" &&
    pass.entriesRemaining > 0;

  async function handleRedeem() {
    if (!customerToken || !slotId || !sessionDate) return;
    setLoading(true);
    try {
      const result = await redeemCustomerPass({
        data: {
          customerToken,
          passId: pass.id,
          slotId,
          sessionDate,
        },
      });
      toast.success("נרשמתם בהצלחה!", {
        description: `נותרו ${result.pass.entriesRemaining} ניקובים בכרטיסייה.`,
      });
      onRedeemed?.(result.pass);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ההרשמה נכשלה.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <article
      className={cn(
        "rounded-xl border bg-card overflow-hidden",
        pass.status === "active" ? "border-accent/30" : "border-border",
      )}
    >
      <div className="bg-accent/10 px-5 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Ticket size={18} className="text-accent" />
          <div>
            <p className="font-bold text-foreground">{pass.planName}</p>
            <p className="text-xs text-muted-foreground">{pass.categoryName}</p>
          </div>
        </div>
        <Badge variant={pass.status === "active" ? "default" : "secondary"}>
          {PASS_STATUS_LABELS[pass.status]}
        </Badge>
      </div>
      <div className="p-5 space-y-4">
        <PunchMeter remaining={pass.entriesRemaining} total={pass.entriesTotal} />
        {!compact && (
          <p className="text-sm text-muted-foreground">
            משתתף/ת: <span className="font-medium text-foreground">{pass.participantName}</span>
          </p>
        )}
        {canRedeem && (
          <Button
            type="button"
            className="w-full font-bold"
            disabled={loading}
            onClick={() => void handleRedeem()}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                מבצע הרשמה...
              </>
            ) : (
              `הרשמה לשיעור (ינוכה ניקוב אחד)`
            )}
          </Button>
        )}
      </div>
    </article>
  );
}

export function CustomerPassesPanel({
  passes,
  customerToken,
  onPassesChange,
}: {
  passes: ActivityPass[];
  customerToken?: string;
  onPassesChange?: (passes: ActivityPass[]) => void;
}) {
  const activePasses = passes.filter((pass) => pass.status === "active");
  const otherPasses = passes.filter((pass) => pass.status !== "active");

  function handlePassUpdate(updated: ActivityPass) {
    onPassesChange?.(
      passes.map((pass) => (pass.id === updated.id ? updated : pass)),
    );
  }

  if (passes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-secondary/40 px-6 py-10 text-center">
        <p className="font-semibold text-foreground">אין כרטיסיות פעילות</p>
        <p className="mt-2 text-sm text-muted-foreground">
          לאחר רכישת כרטיסייה, תוכלו לראות כאן כמה ניקובים נותרו ולהירשם לשיעורים.
        </p>
        <Button asChild className="mt-5 font-semibold">
          <Link to="/table-tennis" hash={TABLE_TENNIS_PRICING_SECTION_ID}>
            לרכישת כרטיסייה
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activePasses.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-foreground">כרטיסיות פעילות</h3>
          {activePasses.map((pass) => (
            <PassCard
              key={pass.id}
              pass={pass}
              customerToken={customerToken}
              onRedeemed={handlePassUpdate}
            />
          ))}
        </div>
      )}
      {otherPasses.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-foreground">כרטיסיות קודמות</h3>
          {otherPasses.map((pass) => (
            <PassCard key={pass.id} pass={pass} compact />
          ))}
        </div>
      )}
    </div>
  );
}

export function CustomerPassQuickRegister({
  passes,
  customerToken,
  categoryId,
  slotId,
  sessionDate,
  onRedeemed,
}: {
  passes: ActivityPass[];
  customerToken?: string;
  categoryId: string;
  slotId: string;
  sessionDate: string;
  onRedeemed?: (pass: ActivityPass) => void;
}) {
  const matchingPass = passes.find(
    (pass) =>
      pass.categoryId === categoryId && pass.status === "active" && pass.entriesRemaining > 0,
  );

  if (!customerToken || !matchingPass) return null;

  return (
    <div className="mt-4 rounded-xl border-2 border-accent/40 bg-accent/5 p-4 space-y-3">
      <p className="text-sm font-semibold text-foreground">
        יש לכם כרטיסייה פעילה — {matchingPass.entriesRemaining} ניקובים נותרו
      </p>
      <PassCard
        pass={matchingPass}
        customerToken={customerToken}
        slotId={slotId}
        sessionDate={sessionDate}
        onRedeemed={onRedeemed}
        compact
      />
      <p className="text-xs text-muted-foreground">
        לאחר ההרשמה יורד ניקוב אחד מהכרטיסייה באופן אוטומטי.
      </p>
    </div>
  );
}
