import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ADMIN_ACCOUNT_PROFILE } from "@/data/account";
import { loginAccount } from "@/lib/api/auth.functions";
import {
  clearAdminSession,
  loadAdminSession,
  saveAdminSession,
  type AdminSession,
} from "@/lib/adminSession";

type AdminAuthContextValue = {
  session: AdminSession | null;
  isReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setSession(loadAdminSession());
    setIsReady(true);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginAccount({
      data: { email: email.trim(), password },
    });
    if (!result.isAdmin) {
      throw new Error("אין הרשאת מנהל לחשבון זה.");
    }

    const next: AdminSession = {
      ...ADMIN_ACCOUNT_PROFILE,
      ...result.profile,
      isAdmin: true,
      authToken: result.authToken,
    };
    saveAdminSession(next);
    setSession(next);
  }, []);

  const logout = useCallback(() => {
    clearAdminSession();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({ session, isReady, login, logout }),
    [session, isReady, login, logout],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return ctx;
}
