import { BALANCE_PITA_COLORS } from "@/data/trainingAccessories";

/** Color choice notice for balance pita — selection is confirmed via WhatsApp order. */
export function BalancePitaColorOptions() {
  return (
    <div className="mt-6 rounded-xl border border-border bg-secondary/40 p-4">
      <p className="text-sm font-semibold text-foreground">אפשרות בחירת צבע</p>
      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
        בחרו צבע בהזמנה בוואטסאפ — זמין בארבעה צבעים:
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {BALANCE_PITA_COLORS.map((color) => (
          <li
            key={color}
            className="px-3 py-1.5 text-sm font-medium bg-background border border-border text-foreground"
          >
            {color}
          </li>
        ))}
      </ul>
    </div>
  );
}
