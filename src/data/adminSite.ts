/** Admin portal host and navigation — separate from the public shop site. */

export const ADMIN_HOSTNAME = "admin.cholesport.co.il";
export const MAIN_SITE_URL = "https://cholesport.co.il";
export const ADMIN_SITE_URL = `https://${ADMIN_HOSTNAME}`;

export type AdminSectionId =
  | "reports"
  | "customers"
  | "passes"
  | "orders"
  | "registrations";

export const ADMIN_NAV: {
  id: AdminSectionId;
  label: string;
  path: `/admin/${AdminSectionId}`;
}[] = [
  { id: "reports", label: "דוחות", path: "/admin/reports" },
  { id: "customers", label: "לקוחות", path: "/admin/customers" },
  { id: "passes", label: "כרטיסיות", path: "/admin/passes" },
  { id: "orders", label: "הזמנות מהאתר", path: "/admin/orders" },
  { id: "registrations", label: "לוח שיעורים", path: "/admin/registrations" },
];

export function isAdminHostname(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return host === ADMIN_HOSTNAME || host.startsWith("admin.cholesport.");
}

export function isLocalDevHostname(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return host === "localhost" || host === "127.0.0.1" || host.endsWith(".local");
}

/** Admin portal is served on the admin subdomain (or localhost for /admin in dev). */
export function canUseAdminPortal(hostname: string): boolean {
  return isAdminHostname(hostname) || isLocalDevHostname(hostname);
}

export function getAdminPortalUrl(path = "/admin/registrations"): string {
  if (typeof window !== "undefined" && isLocalDevHostname(window.location.hostname)) {
    return path;
  }
  return `${ADMIN_SITE_URL}${path}`;
}

/** Legacy account sections that moved to the admin portal. */
export const LEGACY_ADMIN_ACCOUNT_SECTIONS = new Set([
  "registrations",
  "customers",
  "admin-passes",
  "reports",
  "shop-orders",
]);

export function legacyAccountSectionToAdminPath(section: string): string | null {
  switch (section) {
    case "registrations":
      return "/admin/registrations";
    case "customers":
      return "/admin/customers";
    case "admin-passes":
      return "/admin/passes";
    case "reports":
      return "/admin/reports";
    case "shop-orders":
      return "/admin/orders";
    default:
      return null;
  }
}
