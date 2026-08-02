import { useState } from "react";
import { Link, useSearch } from "@tanstack/react-router";
import { ChevronLeft, Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ACCOUNT_PASSWORD_MIN_LENGTH } from "@/data/account";
import { resetCustomerPassword } from "@/lib/api/customers.functions";

export function ResetPasswordPage() {
  const { token } = useSearch({ from: "/account/reset-password" });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!token) {
      toast.error("קישור לא תקין.");
      return;
    }
    if (password.length < ACCOUNT_PASSWORD_MIN_LENGTH) {
      toast.error(`הסיסמה חייבת להכיל לפחות ${ACCOUNT_PASSWORD_MIN_LENGTH} תווים.`);
      return;
    }
    if (password !== confirmPassword) {
      toast.error("הסיסמאות אינן תואמות.");
      return;
    }

    setSubmitting(true);
    try {
      await resetCustomerPassword({ data: { token, password } });
      setDone(true);
      toast.success("הסיסמה עודכנה בהצלחה.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "איפוס הסיסמה נכשל.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-black">קישור לא תקין</h1>
        <p className="text-muted-foreground mt-3">הקישור לאיפוס סיסמה חסר או פג תוקף.</p>
        <Button asChild className="mt-6">
          <Link to="/account">חזרה לחשבון</Link>
        </Button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-black">הסיסמה עודכנה</h1>
        <p className="text-muted-foreground mt-3">אפשר להתחבר עכשיו עם הסיסמה החדשה.</p>
        <Button asChild className="mt-6">
          <Link to="/account">התחברות לחשבון</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <Link
        to="/account"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition mb-6"
      >
        <ChevronLeft size={16} />
        חזרה לחשבון
      </Link>

      <div className="rounded-2xl border bg-card p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Lock size={22} />
          </div>
          <div>
            <h1 className="text-xl font-black">בחירת סיסמה חדשה</h1>
            <p className="text-sm text-muted-foreground">הקישור מאומת למייל שלכם</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">סיסמה חדשה</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                dir="ltr"
                className="text-start pe-10"
                minLength={ACCOUNT_PASSWORD_MIN_LENGTH}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">אימות סיסמה</Label>
            <Input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              dir="ltr"
              className="text-start"
              minLength={ACCOUNT_PASSWORD_MIN_LENGTH}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full font-semibold" disabled={submitting}>
            {submitting ? "שומר..." : "עדכון סיסמה"}
          </Button>
        </form>
      </div>
    </div>
  );
}
