/** Paths where a back control would be confusing (already at the site root). */
export const BACK_NAV_HIDDEN_PATHS = new Set(["/"]);

export function shouldShowBackNav(pathname: string): boolean {
  if (BACK_NAV_HIDDEN_PATHS.has(pathname)) return false;
  // Admin root — stay on admin without a consumer-style back control.
  if (pathname === "/admin" || pathname === "/admin/") return false;
  return true;
}

/**
 * Sensible parent page when browser history cannot go back
 * (direct link, new tab, or first visit in the session).
 */
export function getBackFallbackPath(pathname: string): string {
  if (pathname.startsWith("/admin/")) return "/admin/registrations";
  if (pathname.startsWith("/products/")) return "/categories";
  if (pathname.startsWith("/categories/") && pathname !== "/categories") {
    return "/categories";
  }
  if (pathname === "/categories") return "/";
  if (pathname === "/checkout") return "/cart";
  if (pathname === "/cart") return "/categories";
  if (pathname.startsWith("/account")) return "/";
  if (
    pathname === "/kids" ||
    pathname === "/table-tennis" ||
    pathname === "/functional" ||
    pathname === "/club" ||
    pathname === "/about" ||
    pathname === "/privacy" ||
    pathname === "/terms" ||
    pathname === "/register"
  ) {
    return "/";
  }
  return "/";
}

type HistoryStateWithIndex = {
  idx?: number;
};

/** True when the session has an in-app previous entry we can return to. */
export function canNavigateBackInHistory(): boolean {
  if (typeof window === "undefined") return false;
  const state = window.history.state as HistoryStateWithIndex | null;
  if (typeof state?.idx === "number") {
    return state.idx > 0;
  }
  return window.history.length > 1;
}
