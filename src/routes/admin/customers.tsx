import { createFileRoute } from "@tanstack/react-router";
import { AdminCustomersPanel } from "@/components/site/AdminCustomersPanel";
import { AdminPanelPage } from "@/components/admin/AdminPanelPage";

export const Route = createFileRoute("/admin/customers")({
  component: AdminCustomersRoute,
});

function AdminCustomersRoute() {
  return (
    <AdminPanelPage title="לקוחות" sectionLabel="ניהול לקוחות">
      {(authToken) => <AdminCustomersPanel authToken={authToken} />}
    </AdminPanelPage>
  );
}
