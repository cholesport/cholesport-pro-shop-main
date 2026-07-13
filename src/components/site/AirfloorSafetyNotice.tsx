import { ShieldAlert } from "lucide-react";
import { AIRFLOOR_SAFETY_NOTICE } from "@/data/airfloorMats";

export function AirfloorSafetyNotice() {
  return (
    <aside
      dir="rtl"
      className="mt-6 rounded-xl border-2 border-amber-400/60 bg-amber-50 p-4 md:p-5"
      aria-label="הודעת בטיחות — רוחב המזרן"
    >
      <div className="flex items-start gap-3">
        <ShieldAlert className="size-5 shrink-0 text-amber-600 mt-0.5" aria-hidden />
        <p className="text-sm leading-relaxed text-foreground">
          <strong className="font-bold">שימו לב:</strong>{" "}
          {AIRFLOOR_SAFETY_NOTICE.replace(/^שימו לב:\s*/, "")}
        </p>
      </div>
    </aside>
  );
}
