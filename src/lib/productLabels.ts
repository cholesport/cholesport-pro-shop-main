/** Only these product labels are shown in the storefront UI. */
export const QUANTITY_DEAL_BADGE = "דיל כמות";
export const LAST_UNITS_STOCK_NOTE = "נותרו יחידות אחרונות";
export const OUT_OF_STOCK_NOTE = "אזל מהמלאי";

export function isAllowedProductBadge(badge?: string) {
  return badge === QUANTITY_DEAL_BADGE;
}

export function isAllowedStockNote(note?: string) {
  return note === LAST_UNITS_STOCK_NOTE || note === OUT_OF_STOCK_NOTE;
}

export function isOutOfStockNote(note?: string) {
  return note === OUT_OF_STOCK_NOTE;
}
