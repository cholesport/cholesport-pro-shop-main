import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { NEW_CUSTOMER_NOTIFY_EMAIL } from "@/data/account";
import { getServerConfig } from "@/lib/config.server";

const signupSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  registeredAt: z.string().optional(),
});

/**
 * Notifies the store owner by email when a new customer registers.
 * Uses FormSubmit (no API key). The first request may require confirming
 * an activation email sent to the notify inbox.
 */
export const notifyNewCustomerSignup = createServerFn({ method: "POST" })
  .inputValidator(signupSchema)
  .handler(async ({ data }) => {
    const to = getServerConfig().newCustomerNotifyEmail || NEW_CUSTOMER_NOTIFY_EMAIL;
    const when =
      data.registeredAt ||
      new Date().toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" });
    const fullName = `${data.firstName} ${data.lastName}`.trim();

    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: `לקוח חדש ב-CHOLE sport - ${fullName}`,
        _template: "table",
        _captcha: "false",
        name: fullName,
        email: data.email,
        phone: data.phone?.trim() || "לא צוין",
        registeredAt: when,
        message: [
          "לקוח חדש נרשם לאתר CHOLE sport.",
          "",
          `שם: ${fullName}`,
          `אימייל: ${data.email}`,
          `טלפון: ${data.phone?.trim() || "לא צוין"}`,
          `זמן הרשמה: ${when}`,
        ].join("\n"),
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`שליחת התראת הרשמה נכשלה (${response.status}) ${detail}`.trim());
    }

    return { ok: true as const, notifiedEmail: to };
  });
