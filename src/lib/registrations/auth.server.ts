import { timingSafeEqual } from "node:crypto";
import { verifyAdminAuthToken } from "@/lib/auth/admin.server";

export function assertAdminRegistrationsAccess(authToken: string | undefined): void {
  const email = verifyAdminAuthToken(authToken);
  if (!email) {
    throw new Error("אין הרשאת ניהול. התחברו מחדש עם חשבון המנהל.");
  }
}
