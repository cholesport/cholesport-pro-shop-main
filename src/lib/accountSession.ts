import {
  ACCOUNT_SESSION_KEY,
  type UserProfile,
} from "@/data/account";
import { CART_STORAGE_KEY } from "@/lib/cart";

/** Clear shop session data so a new customer starts on a clean slate. */
export function resetClientShopData() {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function loadAccountSession(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(ACCOUNT_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserProfile;
    if (!parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveAccountSession(profile: UserProfile) {
  sessionStorage.setItem(ACCOUNT_SESSION_KEY, JSON.stringify(profile));
}

export function clearAccountSession() {
  sessionStorage.removeItem(ACCOUNT_SESSION_KEY);
}
