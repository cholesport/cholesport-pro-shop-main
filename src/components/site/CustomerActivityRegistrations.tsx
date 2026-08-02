import { useCallback, useEffect, useState } from "react";
import { Calendar, Loader2, Ticket, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ActivityRegistration } from "@/data/registrations";
import { LATE_CANCELLATION_HOURS } from "@/data/registrations";
import {
  cancelCustomerActivityRegistration,
  listCustomerActivityRegistrations,
} from "@/lib/api/registrations.functions";
import { formatScheduleDateLong, parseScheduleDateIso } from "@/lib/activitySchedule";
import { getHoursUntilSessionStart } from "@/lib/registrations/cancellation";
import { formatRegistrationSlotLabel, getScheduleSlotById } from "@/lib/registrations/helpers";

function cancelToastMessage(passAction: "refunded" | "deducted" | "none", late: boolean) {
  if (passAction === "refunded") {
    return "ההרשמה בוטלה והניקוב הוחזר לכרטיסייה.";
  }
  if (passAction === "deducted") {
    return `ההרשמה בוטלה ונוכה ניקוב מהכרטיסייה (פחות מ-${LATE_CANCELLATION_HOURS} שעות לפני השיעור).`;
  }
  if (late) {
    return `ההרשמה בוטלה. הניקוב לא הוחזר (פחות מ-${LATE_CANCELLATION_HOURS} שעות לפני השיעור).`;
  }
  return "ההרשמה בוטלה בהצלחה.";
}

export function CustomerActivityRegistrations({
  customerToken,
  onPassUpdated,
}: {
  customerToken: string;
  onPassUpdated?: () => void;
}) {
  const [registrations, setRegistrations] = useState<ActivityRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const loadRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listCustomerActivityRegistrations({
        data: { customerToken },
      });
      setRegistrations(result.registrations);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "טעינת ההרשמות נכשלה.");
    } finally {
      setLoading(false);
    }
  }, [customerToken]);

  useEffect(() => {
    void loadRegistrations();
  }, [loadRegistrations]);

  async function handleCancel(registration: ActivityRegistration) {
    const slot = getScheduleSlotById(registration.slotId);
    const hoursUntil = slot
      ? getHoursUntilSessionStart(registration.sessionDate, slot.timeStart)
      : LATE_CANCELLATION_HOURS;
    const late = hoursUntil < LATE_CANCELLATION_HOURS;

    const confirmMessage = late
      ? `לבטל את ההרשמה לשיעור? פחות מ-${LATE_CANCELLATION_HOURS} שעות לפני השיעור — ייתכן שניכוי ניקוב מהכרטיסייה.`
      : "לבטל את ההרשמה לשיעור? אם נוכה ניקוב — הוא יוחזר לכרטיסייה.";

    if (!window.confirm(confirmMessage)) return;

    setCancellingId(registration.id);
    try {
      const result = await cancelCustomerActivityRegistration({
        data: { customerToken, registrationId: registration.id },
      });
      setRegistrations((prev) => prev.filter((row) => row.id !== registration.id));
      toast.success(cancelToastMessage(result.passAction, late));
      if (result.passAction !== "none") {
        onPassUpdated?.();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ביטול ההרשמה נכשל.");
    } finally {
      setCancellingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
        <Loader2 size={16} className="animate-spin" />
        טוען הרשמות לשיעורים...
      </div>
    );
  }

  if (registrations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
          <Calendar size={18} className="text-accent" />
          הרשמות קרובות לשיעורים
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          ביטול מעל {LATE_CANCELLATION_HOURS} שעות לפני השיעור מחזיר ניקוב לכרטיסייה. ביטול מאוחר
          עלול לנכות ניקוב.
        </p>
      </div>

      <ul className="space-y-3">
        {registrations.map((registration) => {
          const slot = getScheduleSlotById(registration.slotId);
          const hoursUntil = slot
            ? getHoursUntilSessionStart(registration.sessionDate, slot.timeStart)
            : null;
          const isLateWindow =
            hoursUntil !== null && hoursUntil < LATE_CANCELLATION_HOURS && hoursUntil > 0;

          return (
            <li
              key={registration.id}
              className="rounded-xl border bg-card p-4 flex flex-wrap items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <p className="font-bold text-foreground">
                  {formatRegistrationSlotLabel(registration)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatScheduleDateLong(parseScheduleDateIso(registration.sessionDate))}
                  {slot ? ` · ${slot.timeStart}–${slot.timeEnd}` : ""}
                </p>
                <p className="text-sm text-muted-foreground">
                  משתתף/ת: {registration.participantName}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {registration.passId && (
                    <Badge variant="secondary" className="text-xs gap-1">
                      <Ticket size={12} />
                      כרטיסייה
                    </Badge>
                  )}
                  {isLateWindow && (
                    <Badge variant="outline" className="text-xs">
                      ביטול מאוחר — עלול לנכות ניקוב
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="font-semibold shrink-0"
                disabled={cancellingId === registration.id}
                onClick={() => void handleCancel(registration)}
              >
                {cancellingId === registration.id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <X size={14} />
                )}
                ביטול הרשמה
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
