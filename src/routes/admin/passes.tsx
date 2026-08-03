import { createFileRoute } from "@tanstack/react-router";
import { AdminPassesPanel } from "@/components/site/AdminPassesPanel";
import { AdminPanelPage } from "@/components/admin/AdminPanelPage";

export const Route = createFileRoute("/admin/passes")({
  component: AdminPassesRoute,
});

function AdminPassesRoute() {
  return (
    <AdminPanelPage title="כרטיסיות" sectionLabel="ניהול כרטיסיות">
      {(authToken) => <AdminPassesPanel authToken={authToken} />}
    </AdminPanelPage>
  );
}
