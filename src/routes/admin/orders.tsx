import { createFileRoute } from "@tanstack/react-router";
import { AdminOrdersPanel } from "@/components/site/AdminOrdersPanel";
import { AdminPanelPage } from "@/components/admin/AdminPanelPage";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrdersRoute,
});

function AdminOrdersRoute() {
  return (
    <AdminPanelPage title="הזמנות מהאתר" sectionLabel="ניהול הזמנות">
      {(authToken) => <AdminOrdersPanel authToken={authToken} />}
    </AdminPanelPage>
  );
}
