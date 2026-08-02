import {
  ACCOUNT_SESSION_KEY,
  type AccountSession,
} from "@/data/account";
import { CART_STORAGE_KEY } from "@/lib/cart";
import {
  readSessionStorage,
  removeLocalStorage,
  removeSessionStorage,
  writeSessionStorage,
} from "@/lib/safeStorage";

/** Clear shop session data so a new customer starts on a clean slate. */
export function resetClientShopData() {
  removeLocalStorage(CART_STORAGE_KEY);
}

export function loadAccountSession(): AccountSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = readSessionStorage(ACCOUNT_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AccountSession;
    if (!parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveAccountSession(profile: AccountSession): boolean {
  return writeSessionStorage(ACCOUNT_SESSION_KEY, JSON.stringify(profile));
}

export function clearAccountSession() {
  removeSessionStorage(ACCOUNT_SESSION_KEY);
}
