import { createFileRoute } from "@tanstack/react-router";
import { AdminRegistrationsPanel } from "@/components/site/AdminRegistrationsPage";
import { AdminPanelPage } from "@/components/admin/AdminPanelPage";

export const Route = createFileRoute("/admin/registrations")({
  component: AdminRegistrationsRoute,
});

function AdminRegistrationsRoute() {
  return (
    <AdminPanelPage title="לוח שיעורים ורישומים">
      {(authToken) => <AdminRegistrationsPanel authToken={authToken} />}
    </AdminPanelPage>
  );
}
