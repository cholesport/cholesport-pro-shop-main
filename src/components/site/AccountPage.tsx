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
  Briefcase,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ACCOUNT_PASSWORD_MIN_LENGTH,
  MOCK_USER,
  formatPrice,
  getAccountAddresses,
  getAccountOrders,
  validateRegisterForm,
  type Address,
  type Order,
  type OrderStatus,
  type UserProfile,
} from "@/data/account";
import { useCart } from "@/context/CartContext";
import { notifyNewCustomerSignup } from "@/lib/api/signup.functions";
import {
  clearAccountSession,
  loadAccountSession,
  resetClientShopData,
  saveAccountSession,
} from "@/lib/accountSession";

type Section = "overview" | "orders" | "profile" | "addresses";

const NAV: { id: Section; label: string; icon: typeof User }[] = [
  { id: "overview", label: "סקירה", icon: Home },
  { id: "orders", label: "הזמנות", icon: Package },
  { id: "profile", label: "פרטים אישיים", icon: User },
  { id: "addresses", label: "כתובות", icon: MapPin },
];

function statusVariant(status: OrderStatus) {
  switch (status) {
    case "נמסר":
      return "secondary" as const;
    case "בדרך":
      return "default" as const;
    case "בטיפול":
      return "outline" as const;
    case "בוטל":
      return "destructive" as const;
  }
}

type AuthSubmitResult = {
  profile: UserProfile;
  isRegister: boolean;
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
      const error = validateRegisterForm(form);
      if (error) {
        toast.error(error);
        return;
      }
      const registeredAt = new Date().toLocaleString("he-IL", {
        timeZone: "Asia/Jerusalem",
      });
      await onSubmitAuth({
        isRegister: true,
        profile: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          isNew: true,
          registeredAt,
        },
      });
      return;
    }

    await onSubmitAuth({
      isRegister: false,
      profile: {
        ...MOCK_USER,
        email: form.email.trim() || MOCK_USER.email,
        isNew: false,
      },
    });
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
                    placeholder="ישראל"
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
                    placeholder="ישראלי"
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
                  placeholder="name@example.com"
                />
              </div>

              {mode === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="phone">טלפון נייד *</Label>
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
                    placeholder="054-0000000"
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
                    placeholder="••••••••"
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
                  <button type="button" className="text-sm text-accent hover:underline">
                    שכחתם סיסמה?
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

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-accent/40 transition">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-bold text-foreground">הזמנה #{order.id}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{order.date}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
          <p className="font-bold text-foreground">₪{formatPrice(order.total)}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="text-sm text-accent hover:underline mt-3"
      >
        {expanded ? "הסתר פרטים" : `צפייה ב-${order.items.length} פריטים`}
      </button>

      {expanded && (
        <ul className="mt-4 pt-4 border-t border-border space-y-2">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between text-sm">
              <span className="text-foreground">
                {item.title} × {item.qty}
              </span>
              <span className="text-muted-foreground font-medium">
                ₪{formatPrice(item.price * item.qty)}
              </span>
            </li>
          ))}
        </ul>
      )}
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
  orders,
  addresses,
  section,
  onSectionChange,
  onLogout,
}: {
  profile: UserProfile;
  orders: Order[];
  addresses: Address[];
  section: Section;
  onSectionChange: (s: Section) => void;
  onLogout: () => void;
}) {
  const [editedProfile, setEditedProfile] = useState(profile);
  const activeOrders = orders.filter((o) => o.status !== "נמסר" && o.status !== "בוטל");

  return (
    <div className="grid lg:grid-cols-[240px_1fr] gap-8">
      <aside className="space-y-2">
        <div className="bg-card border border-border rounded-xl p-5 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mb-3">
            {profile.firstName.charAt(0)}
            {profile.lastName.charAt(0)}
          </div>
          <p className="font-bold text-foreground">
            {profile.firstName} {profile.lastName}
          </p>
          <p className="text-sm text-muted-foreground truncate" dir="ltr">
            {profile.email}
          </p>
        </div>

        <nav className="hidden lg:block space-y-1">
          {NAV.map(({ id, label, icon: Icon }) => (
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
            {NAV.map(({ id, label }) => (
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
                  ? "החשבון שלכם מוכן — אפשר להתחיל לקנות מאפס"
                  : "ברוכים השבים ל-CHOLE sport"}
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: "הזמנות פעילות", value: activeOrders.length },
                { label: "סה״כ הזמנות", value: orders.length },
                { label: "כתובות שמורות", value: addresses.length },
              ].map(({ label, value }) => (
                <div key={label} className="bg-card border border-border rounded-xl p-5 text-center">
                  <p className="text-3xl font-black text-accent">{value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{label}</p>
                </div>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-foreground">הזמנה אחרונה</h3>
                <button
                  type="button"
                  onClick={() => onSectionChange("orders")}
                  className="text-sm text-accent hover:underline"
                >
                  כל ההזמנות
                </button>
              </div>
              {orders[0] ? (
                <OrderCard order={orders[0]} />
              ) : (
                <EmptyState
                  title="עדיין אין הזמנות"
                  text="החשבון ריק ומוכן — ברגע שתשלחו הזמנה היא תופיע כאן."
                />
              )}
            </div>
          </div>
        )}

        {section === "orders" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-foreground">ההזמנות שלי</h2>
            {orders.length === 0 ? (
              <EmptyState
                title="אין הזמנות עדיין"
                text="ברגע שתושלם הזמנה ראשונה, תוכלו לעקוב אחריה מכאן."
              />
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </div>
        )}

        {section === "profile" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-foreground">פרטים אישיים</h2>
            <div className="bg-card border border-border rounded-xl p-6 space-y-5 max-w-lg">
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
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, email: e.target.value })
                  }
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
              <Button className="font-semibold">שמירת שינויים</Button>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 max-w-lg">
              <h3 className="font-bold text-foreground mb-4">שינוי סיסמה</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">סיסמה נוכחית</Label>
                  <Input id="currentPassword" type="password" dir="ltr" className="text-start" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">סיסמה חדשה</Label>
                  <Input id="newPassword" type="password" dir="ltr" className="text-start" />
                </div>
                <Button variant="outline">עדכון סיסמה</Button>
              </div>
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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [section, setSection] = useState<Section>("overview");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setProfile(loadAccountSession());
  }, []);

  async function handleAuthSubmit({ profile: nextProfile, isRegister }: AuthSubmitResult) {
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
              "לא הצלחנו לשלוח את התראת המייל כרגע — נסו שוב מאוחר יותר אם צריך.",
          });
        }

        toast.success("החשבון נוצר בהצלחה", {
          description: "התחלתם מדף נקי — בלי הזמנות או כתובות קודמות.",
        });
      }

      setProfile(nextProfile);
      saveAccountSession(nextProfile);
      setSection("overview");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleLogout() {
    setProfile(null);
    clearAccountSession();
    setSection("overview");
  }

  const orders = profile ? getAccountOrders(profile) : [];
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
          orders={orders}
          addresses={addresses}
          section={section}
          onSectionChange={setSection}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
