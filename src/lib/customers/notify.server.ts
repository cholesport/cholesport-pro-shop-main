import { getServerConfig } from "@/lib/config.server";
import { buildPasswordResetUrl } from "@/lib/customers/reset.server";

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetUrl = buildPasswordResetUrl(token);
  const when = new Date().toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" });

  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(email)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      _subject: "איפוס סיסמה — CHOLE sport",
      _template: "table",
      _captcha: "false",
      email,
      requestedAt: when,
      resetLink: resetUrl,
      message: [
        "ביקשתם לאפס את הסיסמה בחשבון CHOLE sport.",
        "",
        "לחצו על הקישור הבא כדי לבחור סיסמה חדשה (תקף לשעה אחת):",
        resetUrl,
        "",
        "אם לא ביקשתם לאפס את הסיסמה — אפשר להתעלם מהמייל הזה.",
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`שליחת מייל איפוס סיסמה נכשלה (${response.status}) ${detail}`.trim());
  }
}
