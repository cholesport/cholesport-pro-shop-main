import { NEW_CUSTOMER_NOTIFY_EMAIL } from "@/data/account";
import { ACTIVITIES_PRICING } from "@/data/activities";
import {
  REGISTRATION_SOURCE_LABELS,
  REGISTRATION_STATUS_LABELS,
  type ActivityRegistration,
} from "@/data/registrations";
import { getServerConfig } from "@/lib/config.server";
import { getActivityPlanLabel } from "@/lib/registrations/helpers";

function formatPrice(amount: number): string {
  return amount.toLocaleString("he-IL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export async function notifyAdminActivityPayment(
  registration: ActivityRegistration,
): Promise<void> {
  const to = getServerConfig().newCustomerNotifyEmail || NEW_CUSTOMER_NOTIFY_EMAIL;
  const plan = ACTIVITIES_PRICING.find((row) => row.id === registration.planId);
  const when = new Date(registration.createdAt).toLocaleString("he-IL", {
    timeZone: "Asia/Jerusalem",
  });

  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      _subject: `רישום חדש לתשלום — ${registration.participantName}`,
      _template: "table",
      _captcha: "false",
      participant: registration.participantName,
      phone: registration.phone,
      email: registration.email || "לא צוין",
      plan: getActivityPlanLabel(registration.planId),
      price: plan ? `₪${formatPrice(plan.price)}` : "—",
      status: REGISTRATION_STATUS_LABELS[registration.status],
      source: REGISTRATION_SOURCE_LABELS[registration.source],
      guardian: registration.guardianName || "—",
      notes: registration.notes?.trim() || "—",
      createdAt: when,
      message: [
        "לקוח/ה התחיל/ה תהליך רכישה/הרשמה לחוג דרך האתר.",
        "לאחר התשלום החיצוני — עדכנו את הרישום בלוח הניהול ותאמו שיעור.",
        "",
        `משתתף: ${registration.participantName}`,
        `טלפון: ${registration.phone}`,
        `מסלול: ${getActivityPlanLabel(registration.planId)}`,
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`שליחת מייל רישום נכשלה (${response.status}) ${detail}`.trim());
  }
}
