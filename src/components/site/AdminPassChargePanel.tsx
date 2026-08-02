import { AlertCircle, CheckCircle2, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ActivityCategoryId } from "@/data/activities";
import { cn } from "@/lib/utils";

export type AdminPassChargeOption = {
  id: string;
  planName: string;
  categoryId: ActivityCategoryId;
  categoryName: string;
  entriesRemaining: number;
  entriesTotal: number;
};

type AdminPassChargePanelProps = {
  passes: AdminPassChargeOption[];
  passId: string;
  onPassIdChange: (passId: string) => void;
  lessonCategoryId: ActivityCategoryId;
  mode: "session" | "standing";
};

function PassOptionCard({
  pass,
  selected,
  suitable,
  onSelect,
}: {
  pass: AdminPassChargeOption;
  selected: boolean;
  suitable: boolean;
  onSelect: () => void;
}) {
  const percent =
    pass.entriesTotal > 0 ? Math.round((pass.entriesRemaining / pass.entriesTotal) * 100) : 0;

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={!suitable}
      className={cn(
        "w-full text-start rounded-lg border px-4 py-3 transition",
        !suitable && "opacity-60 cursor-not-allowed",
        selected
          ? "border-accent bg-accent/10 ring-2 ring-accent/30"
          : suitable
            ? "border-border bg-card hover:border-accent/40"
            : "border-dashed border-border bg-secondary/30",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="space-y-1">
          <span className="font-semibold text-foreground block">{pass.planName}</span>
          <span className="text-xs text-muted-foreground">{pass.categoryName}</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-sm font-bold text-accent tabular-nums">
            {pass.entriesRemaining}/{pass.entriesTotal} ניקובים
          </span>
          {suitable ? (
            <Badge variant="secondary" className="text-[10px] gap-1">
              <CheckCircle2 size={10} />
              מתאים לשיעור
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px] gap-1">
              <AlertCircle size={10} />
              קטגוריה אחרת
            </Badge>
          )}
        </div>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </button>
  );
}

export function AdminPassChargePanel({
  passes,
  passId,
  onPassIdChange,
  lessonCategoryId,
  mode,
}: AdminPassChargePanelProps) {
  if (passes.length === 0) return null;

  const usePass = passId !== "none";
  const selectedPass = passes.find((pass) => pass.id === passId);

  const suitablePasses = passes.filter((pass) => pass.categoryId === lessonCategoryId);
  const otherPasses = passes.filter((pass) => pass.categoryId !== lessonCategoryId);

  const description =
    mode === "standing"
      ? "בכל רישום לשיעור (ידני או «שיעור קרוב») — ירד ניקוב אחד מהכרטיסייה שתבחרו."
      : "בהרשמה לשיעור הזה ירד ניקוב אחד מהכרטיסייה שתבחרו.";

  function enablePassCharge() {
    const defaultPass = suitablePasses[0] ?? passes[0];
    onPassIdChange(defaultPass?.id ?? "none");
  }

  return (
    <div className="rounded-xl border-2 border-accent/35 bg-accent/5 p-4 space-y-4">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-accent/15 p-2 shrink-0">
          <Ticket size={18} className="text-accent" />
        </div>
        <div>
          <p className="font-bold text-foreground">
            {passes.length} כרטיסיות פעילות ללקוח/ה
          </p>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{description}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant={usePass ? "outline" : "default"}
          className={cn("font-bold h-auto py-3", !usePass && "ring-2 ring-accent/40")}
          onClick={() => onPassIdChange("none")}
        >
          רישום בלי כרטיסייה
        </Button>
        <Button
          type="button"
          variant={usePass ? "default" : "outline"}
          className={cn("font-bold h-auto py-3", usePass && "ring-2 ring-accent/40")}
          onClick={enablePassCharge}
        >
          חייב מכרטיסייה
        </Button>
      </div>

      {usePass && (
        <div className="space-y-4">
          {suitablePasses.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-foreground">
                מתאימות לשיעור ({suitablePasses.length})
              </p>
              <div className="space-y-2">
                {suitablePasses.map((pass) => (
                  <PassOptionCard
                    key={pass.id}
                    pass={pass}
                    selected={pass.id === passId}
                    suitable
                    onSelect={() => onPassIdChange(pass.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {otherPasses.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground">
                כרטיסיות בקטגוריות אחרות ({otherPasses.length})
              </p>
              <p className="text-xs text-muted-foreground">
                לא ניתן לחייב כרטיסייה שלא מתאימה לקטגוריית השיעור.
              </p>
              <div className="space-y-2">
                {otherPasses.map((pass) => (
                  <PassOptionCard
                    key={pass.id}
                    pass={pass}
                    selected={pass.id === passId}
                    suitable={false}
                    onSelect={() => undefined}
                  />
                ))}
              </div>
            </div>
          )}

          {suitablePasses.length === 0 && (
            <p className="text-sm text-destructive rounded-lg border border-destructive/30 bg-destructive/5 p-3">
              אין כרטיסייה פעילה שמתאימה לקטגוריית השיעור. בחרו «רישום בלי כרטיסייה» או שנו את
              השיעור.
            </p>
          )}

          {selectedPass && selectedPass.categoryId === lessonCategoryId && (
            <p className="text-xs text-muted-foreground">
              לאחר הרישום יישארו {Math.max(0, selectedPass.entriesRemaining - 1)} ניקובים
              בכרטיסייה «{selectedPass.planName}».
            </p>
          )}
        </div>
      )}
    </div>
  );
}
