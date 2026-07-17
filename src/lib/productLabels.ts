/** Only these product labels are shown in the storefront UI. */
export const QUANTITY_DEAL_BADGE = "דיל כמות";
export const LAST_UNITS_STOCK_NOTE = "נותרו יחידות אחרונות";

export function isAllowedProductBadge(badge?: string) {
  return badge === QUANTITY_DEAL_BADGE;
}

export function isAllowedStockNote(note?: string) {
  return note === LAST_UNITS_STOCK_NOTE;
}
