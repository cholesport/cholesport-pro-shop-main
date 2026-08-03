import { useEffect, useState } from "react";
import {
  User,
  Package,
  MapPin,
  LogOut,
  ChevronLeft,
  Eye,
  EyeOff,
  Home,
  Ticket,
} from "lucide-react";
import { Link, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ACCOUNT_PASSWORD_MIN_LENGTH,
  isAdminAccountEmail,
  getAccountAddresses,
  validateRegisterForm,
  type AccountSession,
  type Address,
  type UserProfile,
} from "@/data/account";
import { getAdminPortalUrl, legacyAccountSectionToAdminPath } from "@/data/adminSite";
import { useCart } from "@/context/CartContext";
import {
  getCustomerProfile,
  loginCustomer,
  registerCustomer,
  requestCustomerPasswordReset,
  updateCustomerAvatar,
  updateCustomerProfile,
} from "@/lib/api/customers.functions";
import { notifyNewCustomerSignup } from "@/lib/api/signup.functions";
import {
  clearAccountSession,
  loadAccountSession,
  resetClientShopData,
  saveAccountSession,
} from "@/lib/accountSession";
import { AccountAvatarBadge, AccountAvatarEditor } from "@/components/site/AccountAvatarEditor";
import { ErrorBoundary } from "@/components/site/ErrorBoundary";
import {
  CustomerCommerceOverview,
  CustomerCommerceView,
} from "@/components/site/CustomerCommerceView";
import { CustomerPassesPanel } from "@/components/site/CustomerPassesPanel";
import { CustomerActivityRegistrations } from "@/components/site/CustomerActivityRegistrations";
import { getCustomerCommerceHistory } from "@/lib/api/commerce.functions";
import { listCustomerPasses } from "@/lib/api/passes.functions";
import { DEMO_CUSTOMER_HINT } from "@/data/demo";
import type { CustomerCommerceHistory } from "@/data/commerce";
import type { ActivityPass } from "@/data/passes";

type Section = "overview" | "orders" | "passes" | "profile" | "addresses";

const BASE_NAV: { id: Section; label: string; icon: typeof User }[] = [
  { id: "overview", label: "סקירה", icon: Home },
  { id: "passes", label: "כרטיסיות", icon: Ticket },
  { id: "orders", label: "רכישות", icon: Package },
  { id: "profile", label: "פרטים אישיים", icon: User },
  { id: "addresses", label: "כתובות", icon: MapPin },
];

type AuthSubmitResult = {
  profile: UserProfile;
  isRegister: boolean;
  customerToken?: string;
};

function AuthForm({
  onSubmitAuth,
  isSubmitting,
}: {
  onSubmitAuth: (result: AuthSubmitResult) => void | Promise<void>;
  isSubmitting: boolean;
}) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [resetSending, setResetSending] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "register") {
      if (isAdminAccountEmail(form.email)) {
        toast.error("כתובת האימייל הזו מיועדת לחשבון המנהל בלבד.");
        return;
      }
      const error = validateRegisterForm(form);
      if (error) {
        toast.error(error);
        return;
      }
      const registeredAt = new Date().toLocaleString("he-IL", {
        timeZone: "Asia/Jerusalem",
      });
      try {
        const result = await registerCustomer({
          data: {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            password: form.password,
          },
        });
        await onSubmitAuth({
          isRegister: true,
          profile: { ...result.profile, registeredAt },
          customerToken: result.customerToken,
        });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "ההרשמה נכשלה.");
      }
      return;
    }

    if (isAdminAccountEmail(form.email)) {
      window.location.href = getAdminPortalUrl("/admin/registrations");
      return;
    }

    try {
      const customerLogin = await loginCustomer({
        data: {
          email: form.email.trim(),
          password: form.password,
        },
      });
      if (!customerLogin.found) {
        toast.error("אימייל או סיסמה שגויים.");
        return;
      }
      await onSubmitAuth({
        isRegister: false,
        profile: customerLogin.profile,
        customerToken: customerLogin.customerToken,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "התחברות נכשלה.");
    }
  }

  async function handleForgotPassword() {
    if (!form.email.trim()) {
      toast.error("הזינו את האימייל שלכם ולחצו שוב על «שכחתם סיסמה?»");
      return;
    }
    setResetSending(true);
    try {
      const result = await requestCustomerPasswordReset({
        data: { email: form.email.trim() },
      });
      toast.success(result.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "שליחת הקישור נכשלה.");
    } finally {
      setResetSending(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <User className="text-accent" size={32} />
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-foreground">החשבון שלי</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          {mode === "login"
            ? "התחברו כדי לצפות בהזמנות ולנהל את הפרופיל"
            : "צרו חשבון חדש ב-CHOLE sport"}
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-[var(--shadow-card)]">
        <Tabs value={mode} onValueChange={(v) => setMode(v as "login" | "register")}>
          <TabsList className="grid w-full grid-cols-2 mb-6 h-10">
            <TabsTrigger value="login" disabled={isSubmitting}>
              התחברות
            </TabsTrigger>
            <TabsTrigger value="register" disabled={isSubmitting}>
              הרשמה
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="register" className="space-y-4 mt-0">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName">שם פרטי *</Label>
                  <Input
                    id="firstName"
                    required={mode === "register"}
                    autoComplete="given-name"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">שם משפחה *</Label>
                  <Input
                    id="lastName"
                    required={mode === "register"}
                    autoComplete="family-name"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  />
                </div>
              </div>
            </TabsContent>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">אימייל *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  dir="ltr"
                  className="text-start"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              {mode === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="phone">טלפון *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    dir="ltr"
                    className="text-start"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">
                  סיסמה *{mode === "register" ? ` (לפחות ${ACCOUNT_PASSWORD_MIN_LENGTH} תווים)` : ""}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete={mode === "register" ? "new-password" : "current-password"}
                    minLength={mode === "register" ? ACCOUNT_PASSWORD_MIN_LENGTH : undefined}
                    dir="ltr"
                    className="text-start pe-10"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                    aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {mode === "login" && (
                <div className="text-end">
                  <button
                    type="button"
                    className="text-sm text-accent hover:underline disabled:opacity-50"
                    disabled={isSubmitting || resetSending}
                    onClick={() => void handleForgotPassword()}
                  >
                    {resetSending ? "שולח קישור..." : "שכחתם סיסמה?"}
                  </button>
                </div>
              )}

              <Button type="submit" className="w-full h-11 font-semibold" disabled={isSubmitting}>
                {isSubmitting
                  ? "רגע..."
                  : mode === "login"
                    ? "התחברות"
                    : "יצירת חשבון"}
              </Button>
            </div>
          </form>
        </Tabs>

        <p className="text-xs text-muted-foreground text-center mt-6">
          {DEMO_CUSTOMER_HINT}
        </p>

        <p className="text-xs text-muted-foreground text-center mt-3">
          בהמשך תהליך ההתחברות אתם מסכימים ל
          <Link to="/terms" className="text-accent hover:underline mx-1">
            תנאי השימוש
          </Link>
          ול
          <Link to="/privacy" className="text-accent hover:underline mx-1">
            מדיניות הפרטיות
          </Link>
        </p>
      </div>
    </div>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-secondary/40 px-6 py-10 text-center">
      <p className="font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
      <Button asChild className="mt-5 font-semibold">
        <Link to="/">להתחלת קניות</Link>
      </Button>
    </div>
  );
}

function Dashboard({
  profile,
  commerceHistory,
  commerceLoading,
  passes,
  passesLoading,
  onPassesChange,
  addresses,
  section,
  onSectionChange,
  onLogout,
  customerToken,
  onProfileUpdate,
}: {
  profile: UserProfile;
  commerceHistory: CustomerCommerceHistory | null;
  commerceLoading: boolean;
  passes: ActivityPass[];
  passesLoading: boolean;
  onPassesChange: (passes: ActivityPass[]) => void;
  addresses: Address[];
  section: Section;
  onSectionChange: (s: Section) => void;
  onLogout: () => void;
  customerToken?: string;
  onProfileUpdate: (profile: UserProfile) => void;
}) {
  const [editedProfile, setEditedProfile] = useState(profile);
  const [savingProfile, setSavingProfile] = useState(false);
  const [resetSending, setResetSending] = useState(false);
  const nav = BASE_NAV;

  useEffect(() => {
    setEditedProfile(profile);
  }, [profile]);

  async function refreshPasses() {
    if (!customerToken) return;
    try {
      const result = await listCustomerPasses({ data: { customerToken } });
      onPassesChange(result.passes);
    } catch {
      // Parent list may still be stale; cancel toast already shown.
    }
  }

  async function handleSaveProfile() {
    if (!customerToken) return;
    setSavingProfile(true);
    try {
      const result = await updateCustomerProfile({
        data: {
          customerToken,
          firstName: editedProfile.firstName,
          lastName: editedProfile.lastName,
          phone: editedProfile.phone,
        },
      });
      onProfileUpdate(result.profile);
      toast.success("הפרטים נשמרו.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "שמירה נכשלה.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleAvatarChange(avatarUrl?: string) {
    if (!customerToken) return;
    const result = await updateCustomerAvatar({
      data: { customerToken, avatarDataUrl: avatarUrl },
    });
    onProfileUpdate(result.profile);
  }

  async function handlePasswordResetRequest() {
    setResetSending(true);
    try {
      const result = await requestCustomerPasswordReset({
        data: { email: profile.email },
      });
      toast.success(result.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "שליחת הקישור נכשלה.");
    } finally {
      setResetSending(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-[240px_1fr] gap-8">
      <aside className="space-y-2">
        <div className="bg-card border border-border rounded-xl p-5 mb-4">
          <div className="mb-3">
            <AccountAvatarBadge profile={profile} />
          </div>
          <p className="font-bold text-foreground">
            {profile.firstName} {profile.lastName}
          </p>
          <p className="text-sm text-muted-foreground truncate" dir="ltr">
            {profile.email}
          </p>
        </div>

        <nav className="hidden lg:block space-y-1">
          {nav.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onSectionChange(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                section === id
                  ? "bg-accent/10 text-accent"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition"
          >
            <LogOut size={18} />
            התנתקות
          </button>
        </nav>

        <div className="lg:hidden overflow-x-auto pb-2 -mx-1 px-1">
          <div className="flex gap-2 min-w-max">
            {nav.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => onSectionChange(id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  section === id
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        {section === "overview" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-foreground">שלום, {profile.firstName}</h2>
              <p className="text-muted-foreground mt-1">
                {profile.isNew
                  ? "החשבון שלכם מוכן - אפשר להתחיל לקנות מאפס"
                  : "ברוכים השבים ל-CHOLE sport"}
              </p>
            </div>

            {commerceLoading || passesLoading ? (
              <p className="text-sm text-muted-foreground">טוען את הרכישות שלכם...</p>
            ) : commerceHistory || passes.length > 0 ? (
              <CustomerCommerceOverview
                history={
                  commerceHistory ?? {
                    shopOrders: [],
                    activities: [],
                    categories: [],
                    stats: {
                      shopOrderCount: 0,
                      activityCount: 0,
                      subscriptionCount: 0,
                    },
                  }
                }
                passes={passes}
                onViewAll={() => onSectionChange("orders")}
                onViewPasses={() => onSectionChange("passes")}
              />
            ) : (
              <EmptyState
                title="עדיין אין רכישות"
                text="החשבון ריק ומוכן - ברגע שתשלחו הזמנה או תירשמו לחוג היא תופיע כאן."
              />
            )}

            <div className="grid sm:grid-cols-1 gap-4 max-w-sm">
              <div className="bg-card border border-border rounded-xl p-5 text-center">
                <p className="text-3xl font-black text-accent">{addresses.length}</p>
                <p className="text-sm text-muted-foreground mt-1">כתובות שמורות</p>
              </div>
            </div>
          </div>
        )}

        {section === "passes" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-foreground">הכרטיסיות שלי</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                צפו בניקובים שנותרו והירשמו לשיעורים ישירות מהמערכת.
              </p>
            </div>
            {passesLoading ? (
              <p className="text-sm text-muted-foreground">טוען כרטיסיות...</p>
            ) : (
              <>
                <ErrorBoundary sectionLabel="הרשמות וכרטיסיות">
                  {customerToken && (
                    <CustomerActivityRegistrations
                      customerToken={customerToken}
                      onPassUpdated={() => void refreshPasses()}
                    />
                  )}
                  <CustomerPassesPanel
                    passes={passes}
                    customerToken={customerToken}
                    onPassesChange={onPassesChange}
                  />
                </ErrorBoundary>
              </>
            )}
          </div>
        )}

        {section === "orders" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-foreground">הרכישות שלי</h2>
            {commerceLoading ? (
              <p className="text-sm text-muted-foreground">טוען...</p>
            ) : commerceHistory ? (
              <CustomerCommerceView history={commerceHistory} />
            ) : (
              <EmptyState
                title="אין רכישות עדיין"
                text="הזמנות מהחנות והרשמות לחוגים יופיעו כאן לפי קטגוריות."
              />
            )}
          </div>
        )}

        {section === "profile" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-foreground">פרטים אישיים</h2>
            <div className="bg-card border border-border rounded-xl p-6 space-y-5 max-w-lg">
              <AccountAvatarEditor
                profile={profile}
                onAvatarChange={handleAvatarChange}
                disabled={!customerToken}
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editFirstName">שם פרטי</Label>
                  <Input
                    id="editFirstName"
                    value={editedProfile.firstName}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, firstName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editLastName">שם משפחה</Label>
                  <Input
                    id="editLastName"
                    value={editedProfile.lastName}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, lastName: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEmail">אימייל</Label>
                <Input
                  id="editEmail"
                  type="email"
                  dir="ltr"
                  className="text-start"
                  value={editedProfile.email}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPhone">טלפון</Label>
                <Input
                  id="editPhone"
                  type="tel"
                  dir="ltr"
                  className="text-start"
                  value={editedProfile.phone}
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, phone: e.target.value })
                  }
                />
              </div>
              <Button
                className="font-semibold"
                disabled={savingProfile || !customerToken}
                onClick={() => void handleSaveProfile()}
              >
                {savingProfile ? "שומר..." : "שמירת שינויים"}
              </Button>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 max-w-lg">
              <h3 className="font-bold text-foreground mb-2">שינוי סיסמה</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                נשלח אליכם קישור מאומת למייל ({profile.email}) לבחירת סיסמה חדשה. הקישור תקף
                לשעה אחת.
              </p>
              <Button
                variant="outline"
                disabled={resetSending}
                onClick={() => void handlePasswordResetRequest()}
              >
                {resetSending ? "שולח קישור..." : "שליחת קישור לאיפוס סיסמה"}
              </Button>
            </div>
          </div>
        )}

        {section === "addresses" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black text-foreground">כתובות למשלוח</h2>
              <Button variant="outline" size="sm">
                + הוספת כתובת
              </Button>
            </div>
            {addresses.length === 0 ? (
              <EmptyState
                title="אין כתובות שמורות"
                text="הוסיפו כתובת למשלוח כשתהיו מוכנים להזמנה הבאה."
              />
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`bg-card border rounded-xl p-5 ${
                      addr.isDefault ? "border-accent" : "border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        {addr.label === "בית" ? (
                          <Home size={18} className="text-accent" />
                        ) : (
                          <Briefcase size={18} className="text-accent" />
                        )}
                        <span className="font-bold text-foreground">{addr.label}</span>
                      </div>
                      {addr.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          ברירת מחדל
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-foreground font-medium">{addr.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {addr.street}, {addr.city} {addr.zip}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5" dir="ltr">
                      {addr.phone}
                    </p>
                    <div className="flex gap-3 mt-4">
                      <button type="button" className="text-sm text-accent hover:underline">
                        עריכה
                      </button>
                      {!addr.isDefault && (
                        <button
                          type="button"
                          className="text-sm text-muted-foreground hover:underline"
                        >
                          מחיקה
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={onLogout}
          className="lg:hidden mt-8 flex items-center gap-2 text-sm text-destructive font-medium"
        >
          <LogOut size={16} />
          התנתקות
        </button>
      </div>
    </div>
  );
}

export function AccountPage() {
  const { clearCart } = useCart();
  const search = useSearch({ from: "/account" });
  const [profile, setProfile] = useState<AccountSession | null>(null);
  const [section, setSection] = useState<Section>("overview");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commerceHistory, setCommerceHistory] = useState<CustomerCommerceHistory | null>(null);
  const [commerceLoading, setCommerceLoading] = useState(false);
  const [passes, setPasses] = useState<ActivityPass[]>([]);
  const [passesLoading, setPassesLoading] = useState(false);

  useEffect(() => {
    if (search.section) {
      const adminPath = legacyAccountSectionToAdminPath(search.section);
      if (adminPath) {
        window.location.href = getAdminPortalUrl(adminPath);
        return;
      }
    }

    const saved = loadAccountSession();
    if (saved?.isAdmin) {
      clearAccountSession();
      window.location.href = getAdminPortalUrl("/admin/registrations");
      return;
    }

    setProfile(saved);

    if (search.section) {
      setSection(search.section);
    }

    if (saved?.customerToken) {
      void getCustomerProfile({ data: { customerToken: saved.customerToken } })
        .then((result) => {
          setProfile((current) =>
            current
              ? { ...current, ...result.profile, customerToken: saved.customerToken }
              : current,
          );
        })
        .catch(() => {
          clearAccountSession();
          setProfile(null);
        });
    }
  }, [search.section]);

  useEffect(() => {
    if (!profile?.customerToken) {
      setCommerceHistory(null);
      return;
    }

    setCommerceLoading(true);
    void getCustomerCommerceHistory({ data: { customerToken: profile.customerToken } })
      .then((result) => setCommerceHistory(result.history))
      .catch(() => setCommerceHistory(null))
      .finally(() => setCommerceLoading(false));
  }, [profile?.customerToken, profile?.email, profile?.phone]);

  useEffect(() => {
    if (!profile?.customerToken) {
      setPasses([]);
      return;
    }

    setPassesLoading(true);
    void listCustomerPasses({ data: { customerToken: profile.customerToken } })
      .then((result) => setPasses(result.passes))
      .catch(() => setPasses([]))
      .finally(() => setPassesLoading(false));
  }, [profile?.customerToken]);

  async function handleAuthSubmit({
    profile: nextProfile,
    isRegister,
    customerToken,
  }: AuthSubmitResult) {
    setIsSubmitting(true);
    try {
      if (isRegister) {
        resetClientShopData();
        clearCart();

        try {
          await notifyNewCustomerSignup({
            data: {
              firstName: nextProfile.firstName,
              lastName: nextProfile.lastName,
              email: nextProfile.email,
              phone: nextProfile.phone,
              registeredAt: nextProfile.registeredAt,
            },
          });
        } catch (error) {
          console.error(error);
          toast.message("החשבון נוצר", {
            description:
              "לא הצלחנו לשלוח את התראת המייל כרגע - נסו שוב מאוחר יותר אם צריך.",
          });
        }

        toast.success("החשבון נוצר בהצלחה", {
          description: "התחלתם מדף נקי - בלי הזמנות או כתובות קודמות.",
        });
      } else {
        toast.success("ברוכים השבים!");
      }

      const session: AccountSession = {
        ...nextProfile,
        ...(customerToken ? { customerToken } : {}),
      };
      setProfile(session);
      saveAccountSession(session);
      setSection("overview");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleProfileUpdate(nextProfile: UserProfile) {
    setProfile((current) => {
      if (!current) return current;
      const session: AccountSession = { ...current, ...nextProfile };
      saveAccountSession(session);
      return session;
    });
  }

  function handleLogout() {
    setProfile(null);
    clearAccountSession();
    setSection("overview");
  }

  const addresses = profile ? getAccountAddresses(profile) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition mb-6"
      >
        <ChevronLeft size={16} />
        חזרה לחנות
      </Link>

      {!profile ? (
        <AuthForm onSubmitAuth={handleAuthSubmit} isSubmitting={isSubmitting} />
      ) : (
        <Dashboard
          profile={profile}
          commerceHistory={commerceHistory}
          commerceLoading={commerceLoading}
          passes={passes}
          passesLoading={passesLoading}
          onPassesChange={setPasses}
          addresses={addresses}
          section={section}
          onSectionChange={setSection}
          onLogout={handleLogout}
          customerToken={profile.customerToken}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
}
