import { NINJA_ART_SUMMER_CAMP } from "@/data/camps";
import { NEW_CUSTOMER_NOTIFY_EMAIL } from "@/data/account";
import { getServerConfig } from "@/lib/config.server";

export type CampInquiryPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredSession?: string;
  message?: string;
  customerId?: string;
  createdAccount?: boolean;
};

export async function notifyAdminCampInquiry(data: CampInquiryPayload): Promise<void> {
  const to = getServerConfig().newCustomerNotifyEmail || NEW_CUSTOMER_NOTIFY_EMAIL;
  const when = new Date().toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" });
  const fullName = `${data.firstName} ${data.lastName}`.trim();

  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      _subject: `פנייה לקייטנה — ${NINJA_ART_SUMMER_CAMP.title} — ${fullName}`,
      _template: "table",
      _captcha: "false",
      camp: NINJA_ART_SUMMER_CAMP.title,
      name: fullName,
      email: data.email,
      phone: data.phone,
      preferredSession: data.preferredSession?.trim() || "לא צוין",
      submittedAt: when,
      customerId: data.customerId ?? "—",
      accountStatus: data.createdAccount ? "נוצר חשבון ליד חדש" : "עודכן חשבון קיים",
      message: [
        `פנייה חדשה לקייטנת ${NINJA_ART_SUMMER_CAMP.title}.`,
        "",
        `שם: ${fullName}`,
        `אימייל: ${data.email}`,
        `טלפון: ${data.phone}`,
        `מחזור מועדף: ${data.preferredSession?.trim() || "לא צוין"}`,
        data.message?.trim() ? `הערות: ${data.message.trim()}` : "",
        data.customerId ? `מזהה לקוח במערכת: ${data.customerId}` : "",
        data.createdAccount !== undefined
          ? `סטטוס חשבון: ${data.createdAccount ? "נוצר חשבון ליד חדש" : "עודכן חשבון קיים"}`
          : "",
        "",
        "נא לחזור ללקוח/ה בהקדם.",
      ]
        .filter(Boolean)
        .join("\n"),
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`שליחת פניית קייטנה נכשלה (${response.status}) ${detail}`.trim());
  }
}
