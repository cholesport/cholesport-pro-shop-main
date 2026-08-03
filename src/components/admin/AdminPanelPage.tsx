import type { ReactNode } from "react";
import { ErrorBoundary } from "@/components/site/ErrorBoundary";
import { useAdminAuth } from "@/context/AdminAuthContext";

type AdminPanelPageProps = {
  title: string;
  sectionLabel?: string;
  children: (authToken: string) => ReactNode;
};

export function AdminPanelPage({ title, sectionLabel, children }: AdminPanelPageProps) {
  const { session } = useAdminAuth();
  if (!session) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          ניהול מתאמנים, רישומים ותשלומים — פורטל מנהל בלבד.
        </p>
      </div>
      <ErrorBoundary sectionLabel={sectionLabel ?? title}>
        {children(session.authToken)}
      </ErrorBoundary>
    </div>
  );
}
