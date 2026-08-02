import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Package, RefreshCw, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  SHOP_ORDER_STATUS_LABELS,
  type ShopOrder,
  type ShopOrderStatus,
} from "@/data/shopOrders";
import { listShopOrders, updateShopOrderStatus } from "@/lib/api/orders.functions";
import {
  filterShopOrders,
  formatShopOrderPrice,
  getShopDeliveryLabel,
  getShopOrderCustomerName,
  getShopOrderItemCount,
  getShopOrderStatusLabel,
  shopOrderStatusVariant,
} from "@/lib/orders/helpers";

export function AdminOrdersPanel({ authToken }: { authToken: string }) {
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ShopOrderStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      filterShopOrders(orders, {
        status: statusFilter === "all" ? undefined : statusFilter,
        query,
      }),
    [orders, statusFilter, query],
  );

  const pendingCount = orders.filter((order) => order.status === "pending_payment").length;
  const activeCount = orders.filter((order) =>
    ["paid", "processing", "shipped"].includes(order.status),
  ).length;

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listShopOrders({ data: { authToken } });
      setOrders(result.orders);
      setUpdatedAt(result.updatedAt);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "טעינת ההזמנות נכשלה.");
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function handleStatusChange(orderId: string, status: ShopOrderStatus) {
    try {
      const result = await updateShopOrderStatus({
        data: { authToken, id: orderId, status },
      });
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? result.order : order)),
      );
      setUpdatedAt(result.updatedAt);
      toast.success("סטטוס ההזמנה עודכן.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "עדכון סטטוס נכשל.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-accent font-semibold text-sm mb-1">
            <ShoppingBag size={16} />
            ניהול פנימי
          </div>
          <h2 className="text-2xl font-black text-foreground">הזמנות מהאתר</h2>
          <p className="text-muted-foreground mt-1 text-sm max-w-2xl">
            מעקב מלא אחר לקוחות שרכשו דרך האתר — כולל פרטי קשר ומוצרים.
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
          <p className="text-3xl font-black text-accent">{orders.length}</p>
          <p className="text-sm text-muted-foreground mt-1">סה״כ הזמנות</p>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-3xl font-black text-accent">{pendingCount}</p>
          <p className="text-sm text-muted-foreground mt-1">ממתינות לתשלום</p>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-3xl font-black text-accent">{activeCount}</p>
          <p className="text-sm text-muted-foreground mt-1">בטיפול / בדרך</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <Label>סטטוס</Label>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as ShopOrderStatus | "all")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">הכל</SelectItem>
              {(Object.keys(SHOP_ORDER_STATUS_LABELS) as ShopOrderStatus[]).map((status) => (
                <SelectItem key={status} value={status}>
                  {SHOP_ORDER_STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>חיפוש</Label>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="מספר הזמנה, שם, טלפון, מוצר..."
          />
        </div>
      </div>

      <div className="rounded-2xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-end">הזמנה</TableHead>
              <TableHead className="text-end">לקוח</TableHead>
              <TableHead className="text-end hidden md:table-cell">טלפון</TableHead>
              <TableHead className="text-end hidden lg:table-cell">פריטים</TableHead>
              <TableHead className="text-end">סכום</TableHead>
              <TableHead className="text-end">סטטוס</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  {loading ? "טוען..." : "אין הזמנות להצגה."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((order) => {
                const expanded = expandedId === order.id;
                return (
                  <Fragment key={order.id}>
                    <TableRow
                      key={order.id}
                      className="cursor-pointer"
                      onClick={() => setExpandedId(expanded ? null : order.id)}
                    >
                      <TableCell className="text-end font-medium">
                        <div>#{order.orderNumber}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleString("he-IL", {
                            timeZone: "Asia/Jerusalem",
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="text-end">
                        {getShopOrderCustomerName(order)}
                      </TableCell>
                      <TableCell className="text-end hidden md:table-cell" dir="ltr">
                        {order.customer.phone}
                      </TableCell>
                      <TableCell className="text-end hidden lg:table-cell">
                        {getShopOrderItemCount(order)} פריטים
                      </TableCell>
                      <TableCell className="text-end font-semibold">
                        ₪{formatShopOrderPrice(order.subtotal)}
                      </TableCell>
                      <TableCell className="text-end">
                        <Badge variant={shopOrderStatusVariant(order.status)}>
                          {getShopOrderStatusLabel(order.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    {expanded && (
                      <TableRow key={`${order.id}-details`}>
                        <TableCell colSpan={6} className="bg-secondary/30">
                          <div className="grid gap-4 md:grid-cols-2 py-2">
                            <div className="space-y-2 text-sm">
                              <p>
                                <span className="font-semibold">אספקה:</span>{" "}
                                {getShopDeliveryLabel(order.delivery)}
                              </p>
                              {order.customer.email && (
                                <p dir="ltr" className="text-end md:text-start">
                                  <span className="font-semibold">אימייל:</span>{" "}
                                  {order.customer.email}
                                </p>
                              )}
                              {order.notes && (
                                <p>
                                  <span className="font-semibold">הערות:</span> {order.notes}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label>עדכון סטטוס</Label>
                              <Select
                                value={order.status}
                                onValueChange={(value) =>
                                  void handleStatusChange(order.id, value as ShopOrderStatus)
                                }
                              >
                                <SelectTrigger onClick={(e) => e.stopPropagation()}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {(Object.keys(SHOP_ORDER_STATUS_LABELS) as ShopOrderStatus[]).map(
                                    (status) => (
                                      <SelectItem key={status} value={status}>
                                        {SHOP_ORDER_STATUS_LABELS[status]}
                                      </SelectItem>
                                    ),
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="mt-4 rounded-xl border bg-card p-4">
                            <p className="font-semibold text-sm mb-3 flex items-center gap-2">
                              <Package size={14} />
                              מוצרים בהזמנה
                            </p>
                            <ul className="space-y-2 text-sm">
                              {order.items.map((item) => (
                                <li
                                  key={`${order.id}-${item.productId}`}
                                  className="flex justify-between gap-3"
                                >
                                  <span>
                                    {item.title} × {item.quantity}
                                    {item.categoryName && (
                                      <span className="text-muted-foreground">
                                        {" "}
                                        · {item.categoryName}
                                      </span>
                                    )}
                                  </span>
                                  <span className="font-semibold shrink-0">
                                    ₪{formatShopOrderPrice(item.price * item.quantity)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
        <div className="border-t px-4 py-3 text-sm text-muted-foreground">
          {filtered.length} הזמנות · לחצו על שורה לפרטים מלאים
        </div>
      </div>
    </div>
  );
}
