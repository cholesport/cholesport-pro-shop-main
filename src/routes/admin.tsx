import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { canUseAdminPortal } from "@/data/adminSite";
import { buildPageSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/admin")({
  head: () => {
    const seo = buildPageSeoHead({
      title: "מערכת ניהול CHOLE",
      description: "ניהול רישומים, לקוחות והזמנות — כניסה למנהל בלבד.",
      path: "/admin",
      noIndex: true,
    });
    return { meta: seo.meta, links: seo.links };
  },
  beforeLoad: () => {
    if (typeof window !== "undefined" && !canUseAdminPortal(window.location.hostname)) {
      throw redirect({ href: "https://admin.cholesport.co.il/admin/registrations" });
    }
  },
  component: AdminLayoutRoute,
});

function AdminLayoutRoute() {
  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
