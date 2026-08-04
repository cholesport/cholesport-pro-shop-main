import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Dumbbell, Package, RefreshCw, UserRound, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  AdminCustomerAccountMeta,
  CommerceDomain,
  CustomerCommerceHistory,
  ServiceCustomerSummary,
  ShopCustomerSummary,
} from "@/data/commerce";
import type { ActivityPass } from "@/data/passes";
import { PASS_STATUS_LABELS } from "@/data/passes";
import { SHOP_ORDER_STATUS_LABELS } from "@/data/shopOrders";
import { REGISTRATION_STATUS_LABELS } from "@/data/registrations";
import { getUnifiedCustomer, listUnifiedCustomers } from "@/lib/api/commerce.functions";
import { formatShopOrderPrice } from "@/lib/orders/helpers";

function filterShopCustomers(customers: ShopCustomerSummary[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return customers;

  return customers.filter((customer) => {
    const haystack = [customer.name, customer.email ?? "", customer.phone, ...customer.categoryNames]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

function filterServiceCustomers(customers: ServiceCustomerSummary[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return customers;

  return customers.filter((customer) => {
    const haystack = [
      customer.name,
      customer.email ?? "",
      customer.phone,
      ...customer.categoryNames,
      ...(customer.interestLabels ?? []),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

type CustomerDetail = {
  history: CustomerCommerceHistory;
  passes: ActivityPass[];
  account?: AdminCustomerAccountMeta;
};

function CustomerInquiriesPanel({ account }: { account?: AdminCustomerAccountMeta }) {
  if (!account?.inquiries?.length && !account?.interests?.length) return null;

  return (
    <div className="rounded-xl border bg-card p-4 space-y-4">
      <div>
        <p className="font-semibold text-sm">עניין ופניות מהאתר</p>
        {account.accountType === "lead" && (
          <Badge variant="outline" className="mt-2">
            ליד — טרם השלים הרשמה מלאה
          </Badge>
        )}
      </div>

      {account.interests && account.interests.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {account.interests.map((interest) => (
            <Badge key={interest} variant="secondary">
              {interest}
            </Badge>
          ))}
        </div>
      )}

      {account.inquiries && account.inquiries.length > 0 && (
        <div className="space-y-3">
          {account.inquiries
            .slice()
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .map((inquiry) => (
              <div key={inquiry.id} className="rounded-lg bg-secondary/40 p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{inquiry.summary}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(inquiry.createdAt).toLocaleString("he-IL", {
                      timeZone: "Asia/Jerusalem",
                    })}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1">{inquiry.source}</p>
                {inquiry.details && (
                  <ul className="mt-2 space-y-1 text-muted-foreground">
                    {Object.entries(inquiry.details).map(([key, value]) => (
                      <li key={key}>
                        <span className="font-medium text-foreground">{key}:</span> {value}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

function CustomerDetailPanel({
  history,
  passes = [],
  domain,
  account,
}: {
  history: CustomerCommerceHistory;
  passes?: ActivityPass[];
  domain: CommerceDomain;
  account?: AdminCustomerAccountMeta;
}) {
  const hasShop = history.shopOrders.length > 0;
  const hasActivities = history.activities.length > 0;
  const hasPasses = passes.length > 0;
  const hasInquiries = Boolean(account?.inquiries?.length || account?.interests?.length);

  if (!hasShop && !hasActivities && !hasPasses && !hasInquiries) {
    return <p className="text-sm text-muted-foreground">אין נתונים להצגה ללקוח זה.</p>;
  }

  return (
    <div className="space-y-4">
      <CustomerInquiriesPanel account={account} />
      {domain === "shop" &&
        history.categories.map((group) => (
          <div key={`${group.domain}-${group.categoryKey}`} className="rounded-xl border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <p className="font-semibold text-sm">{group.categoryName}</p>
              <Badge variant="outline">מוצרים</Badge>
            </div>
            <div className="space-y-2">
              {group.shopOrders.map((order) => (
                <div key={order.id} className="rounded-lg bg-secondary/40 p-3 text-sm">
                  <div className="flex flex-wrap justify-between gap-2">
                    <span className="font-medium">#{order.orderNumber}</span>
                    <span>{SHOP_ORDER_STATUS_LABELS[order.status]}</span>
                  </div>
                  <ul className="mt-2 space-y-1 text-muted-foreground">
                    {order.items
                      .filter(
                        (item) =>
                          (item.categorySlug ?? item.productCat ?? "other") === group.categoryKey,
                      )
                      .map((item) => (
                        <li key={`${order.id}-${item.productId}`}>
                          {item.title} × {item.quantity} — ₪
                          {formatShopOrderPrice(item.price * item.quantity)}
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}

      {domain === "activities" && hasPasses && (
        <div className="rounded-xl border bg-card p-4 space-y-3">
          <p className="font-semibold text-sm">כרטיסיות פעילות</p>
          {passes.map((pass) => (
            <div key={pass.id} className="rounded-lg bg-secondary/40 p-3 text-sm">
              <div className="flex flex-wrap justify-between gap-2">
                <span className="font-medium">{pass.planName}</span>
                <Badge variant="outline">{PASS_STATUS_LABELS[pass.status]}</Badge>
              </div>
              <p className="text-muted-foreground mt-1">
                {pass.entriesRemaining}/{pass.entriesTotal} ניקובים · {pass.categoryName}
              </p>
            </div>
          ))}
        </div>
      )}

      {domain === "activities" &&
        history.categories.map((group) => (
          <div key={`${group.domain}-${group.categoryKey}`} className="rounded-xl border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <p className="font-semibold text-sm">{group.categoryName}</p>
              <Badge variant="outline">אימונים / חוגים</Badge>
            </div>
            <div className="space-y-2">
              {group.activities.map((activity) => (
                <div key={activity.id} className="rounded-lg bg-secondary/40 p-3 text-sm">
                  <div className="flex flex-wrap justify-between gap-2">
                    <span className="font-medium">
                      {activity.planName ?? activity.participantName}
                    </span>
                    <span>{REGISTRATION_STATUS_LABELS[activity.status]}</span>
                  </div>
                  <p className="text-muted-foreground mt-1">
                    {activity.participantName} · {activity.sessionDate}
                  </p>
                  {activity.isSubscription && (
                    <Badge variant="secondary" className="mt-2">
                      מנוי פעיל
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}

function AccountBadge({
  hasAccount,
  isLeadAccount,
}: {
  hasAccount: boolean;
  isLeadAccount?: boolean;
}) {
  if (isLeadAccount) {
    return (
      <Badge variant="outline" className="mt-1 border-accent/40 text-accent">
        ליד מהאתר
      </Badge>
    );
  }

  return hasAccount ? (
    <Badge variant="secondary" className="mt-1">
      חשבון רשום
    </Badge>
  ) : (
    <Badge variant="outline" className="mt-1">
      אורח
    </Badge>
  );
}

export function AdminCustomersPanel({ authToken }: { authToken: string }) {
  const [shopCustomers, setShopCustomers] = useState<ShopCustomerSummary[]>([]);
  const [serviceCustomers, setServiceCustomers] = useState<ServiceCustomerSummary[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<CommerceDomain>("shop");
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [detailLoadingKey, setDetailLoadingKey] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, CustomerDetail>>({});

  const filteredShop = useMemo(
    () => filterShopCustomers(shopCustomers, query),
    [shopCustomers, query],
  );
  const filteredService = useMemo(
    () => filterServiceCustomers(serviceCustomers, query),
    [serviceCustomers, query],
  );

  const overlapCount = useMemo(() => {
    const shopKeys = new Set(shopCustomers.map((customer) => customer.key));
    return serviceCustomers.filter((customer) => shopKeys.has(customer.key)).length;
  }, [shopCustomers, serviceCustomers]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listUnifiedCustomers({ data: { authToken } });
      setShopCustomers(result.shopCustomers);
      setServiceCustomers(result.serviceCustomers);
      setUpdatedAt(result.updatedAt);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "טעינת הלקוחות נכשלה.");
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    setExpandedKey(null);
  }, [activeTab]);

  async function handleExpand(customerKey: string, domain: CommerceDomain) {
    const detailKey = `${domain}:${customerKey}`;
    if (expandedKey === detailKey) {
      setExpandedKey(null);
      return;
    }

    setExpandedKey(detailKey);
    if (details[detailKey]) return;

    setDetailLoadingKey(detailKey);
    try {
      const result = await getUnifiedCustomer({
        data: { authToken, customerKey, domain },
      });
      setDetails((prev) => ({
        ...prev,
        [detailKey]: {
          history: result.history,
          passes: result.passes ?? [],
          account: result.account,
        },
      }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "טעינת פרטי הלקוח נכשלה.");
    } finally {
      setDetailLoadingKey(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-accent font-semibold text-sm mb-1">
            <Users size={16} />
            ניהול פנימי
          </div>
          <h2 className="text-2xl font-black text-foreground">לקוחות</h2>
          <p className="text-muted-foreground mt-1 text-sm max-w-2xl">
            שתי רשימות נפרדות — לקוחות שרכשו מוצרים מהחנות, ולקוחות שנרשמו לאימונים ושירותים.
            אותו אדם יכול להופיע בשתיהן.
          </p>
          {updatedAt && (
            <p className="text-xs text-muted-foreground mt-2">
              עודכן לאחרונה:{" "}
              {new Date(updatedAt).toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" })}
            </p>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void loadData()}
          disabled={loading}
        >
          <RefreshCw size={14} className="ms-1" />
          רענון
        </Button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-3xl font-black text-accent">{shopCustomers.length}</p>
          <p className="text-sm text-muted-foreground mt-1">לקוחות חנות (מוצרים)</p>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-3xl font-black text-accent">{serviceCustomers.length}</p>
          <p className="text-sm text-muted-foreground mt-1">לקוחות שירות (אימונים)</p>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-3xl font-black text-accent">{overlapCount}</p>
          <p className="text-sm text-muted-foreground mt-1">מופיעים בשתי הרשימות</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label>חיפוש</Label>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="שם, אימייל, טלפון, קטגוריה..."
        />
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as CommerceDomain)}>
        <TabsList>
          <TabsTrigger value="shop" className="gap-2">
            <Package size={14} />
            לקוחות חנות ({shopCustomers.length})
          </TabsTrigger>
          <TabsTrigger value="activities" className="gap-2">
            <Dumbbell size={14} />
            לקוחות שירות ({serviceCustomers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="shop" className="mt-4">
          <div className="rounded-2xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-end">לקוח</TableHead>
                  <TableHead className="text-end hidden md:table-cell">טלפון</TableHead>
                  <TableHead className="text-end hidden lg:table-cell">קטגוריות מוצרים</TableHead>
                  <TableHead className="text-end">הזמנות</TableHead>
                  <TableHead className="text-end">סה״כ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShop.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                      {loading ? "טוען..." : "אין לקוחות חנות להצגה."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredShop.map((customer) => {
                    const detailKey = `shop:${customer.key}`;
                    const expanded = expandedKey === detailKey;
                    return (
                      <Fragment key={customer.key}>
                        <TableRow
                          className="cursor-pointer"
                          onClick={() => void handleExpand(customer.key, "shop")}
                        >
                          <TableCell className="text-end">
                            <div className="flex items-center justify-end gap-2">
                              <UserRound size={14} className="text-muted-foreground" />
                              <div>
                                <p className="font-medium">{customer.name}</p>
                                {customer.email && (
                                  <p className="text-xs text-muted-foreground" dir="ltr">
                                    {customer.email}
                                  </p>
                                )}
                              </div>
                            </div>
                            <AccountBadge
                              hasAccount={customer.hasAccount}
                              isLeadAccount={customer.isLeadAccount}
                            />
                          </TableCell>
                          <TableCell className="text-end hidden md:table-cell" dir="ltr">
                            {customer.phone}
                          </TableCell>
                          <TableCell className="text-end hidden lg:table-cell">
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {customer.categoryNames.join(" · ") || "—"}
                            </p>
                          </TableCell>
                          <TableCell className="text-end">{customer.shopOrderCount}</TableCell>
                          <TableCell className="text-end font-semibold">
                            ₪{formatShopOrderPrice(customer.totalSpent)}
                          </TableCell>
                        </TableRow>
                        {expanded && (
                          <TableRow>
                            <TableCell colSpan={5} className="bg-secondary/30">
                              {detailLoadingKey === detailKey ? (
                                <p className="text-sm text-muted-foreground py-4">טוען פרטים...</p>
                              ) : details[detailKey] ? (
                                <CustomerDetailPanel
                                  history={details[detailKey].history}
                                  domain="shop"
                                  account={details[detailKey].account}
                                />
                              ) : (
                                <p className="text-sm text-muted-foreground py-4">
                                  לא נמצאו פרטים ללקוח.
                                </p>
                              )}
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="activities" className="mt-4">
          <div className="rounded-2xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-end">לקוח / משתתף</TableHead>
                  <TableHead className="text-end hidden md:table-cell">טלפון</TableHead>
                  <TableHead className="text-end hidden lg:table-cell">קטגוריות שירות</TableHead>
                  <TableHead className="text-end">הרשמות</TableHead>
                  <TableHead className="text-end">כרטיסיות</TableHead>
                  <TableHead className="text-end">פניות</TableHead>
                  <TableHead className="text-end">מנויים</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredService.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      {loading ? "טוען..." : "אין לקוחות שירות להצגה."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredService.map((customer) => {
                    const detailKey = `activities:${customer.key}`;
                    const expanded = expandedKey === detailKey;
                    return (
                      <Fragment key={customer.key}>
                        <TableRow
                          className="cursor-pointer"
                          onClick={() => void handleExpand(customer.key, "activities")}
                        >
                          <TableCell className="text-end">
                            <div className="flex items-center justify-end gap-2">
                              <UserRound size={14} className="text-muted-foreground" />
                              <div>
                                <p className="font-medium">{customer.name}</p>
                                {customer.email && (
                                  <p className="text-xs text-muted-foreground" dir="ltr">
                                    {customer.email}
                                  </p>
                                )}
                              </div>
                            </div>
                            <AccountBadge
                              hasAccount={customer.hasAccount}
                              isLeadAccount={customer.isLeadAccount}
                            />
                            {customer.standingCount > 0 && (
                              <Badge variant="outline" className="mt-1">
                                רישום קבוע
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-end hidden md:table-cell" dir="ltr">
                            {customer.phone}
                          </TableCell>
                          <TableCell className="text-end hidden lg:table-cell">
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {customer.categoryNames.join(" · ") || "—"}
                            </p>
                          </TableCell>
                          <TableCell className="text-end">{customer.activityCount}</TableCell>
                          <TableCell className="text-end">
                            {customer.passCount > 0
                              ? `${customer.activePassPunches} ניקובים`
                              : "—"}
                          </TableCell>
                          <TableCell className="text-end">{customer.inquiryCount || "—"}</TableCell>
                          <TableCell className="text-end">{customer.subscriptionCount}</TableCell>
                        </TableRow>
                        {expanded && (
                          <TableRow>
                            <TableCell colSpan={7} className="bg-secondary/30">
                              {detailLoadingKey === detailKey ? (
                                <p className="text-sm text-muted-foreground py-4">טוען פרטים...</p>
                              ) : details[detailKey] ? (
                                <CustomerDetailPanel
                                  history={details[detailKey].history}
                                  passes={details[detailKey].passes}
                                  domain="activities"
                                  account={details[detailKey].account}
                                />
                              ) : (
                                <p className="text-sm text-muted-foreground py-4">
                                  לא נמצאו פרטים ללקוח.
                                </p>
                              )}
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
