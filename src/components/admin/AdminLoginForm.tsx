import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ADMIN_SITE_URL } from "@/data/adminSite";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { safeAction } from "@/lib/safeAction";
import logo from "@/assets/chole-sport-logo.png";

export function AdminLoginForm() {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim() || !password) {
      toast.error("נא למלא אימייל וסיסמה.");
      return;
    }

    setSubmitting(true);
    const ok = await safeAction(
      () => login(email, password),
      { fallbackMessage: "התחברות נכשלה. בדקו את הפרטים ונסו שוב." },
    );
    setSubmitting(false);

    if (ok !== null) {
      toast.success("ברוך הבא למערכת הניהול");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary via-slate-900 to-slate-800 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-card p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <img src={logo} alt="CHOLE sport" className="mx-auto h-14 w-auto mb-4" />
          <h1 className="text-2xl font-black text-foreground">מערכת ניהול CHOLE</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            כניסה למנהל בלבד · {ADMIN_SITE_URL.replace("https://", "")}
          </p>
        </div>

        <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">אימייל מנהל</Label>
            <Input
              id="admin-email"
              type="email"
              dir="ltr"
              className="text-end"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-password">סיסמה</Label>
            <div className="relative">
              <Input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                dir="ltr"
                className="text-end pe-10"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full font-bold" disabled={submitting}>
            <Lock size={16} aria-hidden />
            כניסה למערכת
          </Button>
        </form>
      </div>
    </div>
  );
}
