import type { UserProfile } from "@/data/account";

export const ADMIN_SESSION_KEY = "chole-admin-session";

export type AdminSession = UserProfile & {
  authToken: string;
};

export function loadAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AdminSession;
    if (!parsed?.authToken || !parsed.isAdmin) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveAdminSession(session: AdminSession): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    return true;
  } catch {
    return false;
  }
}

export function clearAdminSession() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  } catch {
    /* ignore */
  }
}
