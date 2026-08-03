import { useEffect, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ExternalLink, LogOut } from "lucide-react";
import logo from "@/assets/chole-sport-logo.png";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import {
  ADMIN_NAV,
  ADMIN_SITE_URL,
  canUseAdminPortal,
  MAIN_SITE_URL,
} from "@/data/adminSite";
import { AdminAuthProvider, useAdminAuth } from "@/context/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function AdminShellInner({ children }: { children: ReactNode }) {
  const { session, isReady, logout } = useAdminAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!canUseAdminPortal(window.location.hostname)) {
      window.location.replace(`${ADMIN_SITE_URL}${pathname}`);
    }
  }, [pathname]);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        טוען...
      </div>
    );
  }

  if (!session) {
    return <AdminLoginForm />;
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <img src={logo} alt="CHOLE sport" className="h-10 w-auto shrink-0" />
            <div className="min-w-0">
              <p className="font-black text-foreground leading-tight">מערכת ניהול</p>
              <p className="text-xs text-muted-foreground truncate">
                {session.firstName} {session.lastName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <a href={MAIN_SITE_URL} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={14} />
                לאתר הציבורי
              </a>
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={logout}>
              <LogOut size={14} />
              התנתקות
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-6 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                "shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition",
                pathname === item.path || pathname.startsWith(`${item.path}/`)
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "bg-secondary/60 text-foreground hover:bg-secondary",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <main id="main-content" className="min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShellInner>{children}</AdminShellInner>
    </AdminAuthProvider>
  );
}
