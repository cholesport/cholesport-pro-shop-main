import { createFileRoute } from "@tanstack/react-router";
import { AdminReportsPanel } from "@/components/site/AdminReportsPanel";
import { AdminPanelPage } from "@/components/admin/AdminPanelPage";

export const Route = createFileRoute("/admin/reports")({
  component: AdminReportsRoute,
});

function AdminReportsRoute() {
  return (
    <AdminPanelPage title="דוחות" sectionLabel="דוחות">
      {(authToken) => <AdminReportsPanel authToken={authToken} />}
    </AdminPanelPage>
  );
}
