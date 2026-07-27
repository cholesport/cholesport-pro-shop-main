/**
 * Public Boost App (1pa.co) hosted checkout links per product.
 * These URLs are safe to expose in the frontend - they open Boost's secure payment page.
 * Never put Boost API keys here (those belong only in server env if needed later).
 */
import { PAYMENT_SECURE_NOTICE, PAYMENT_SUMMARY } from "@/data/payment";

export const BOOST_PRODUCT_PAYMENT_URLS: Record<string, string> = {
  "chole-pro-25": "https://1pa.co/oyqJ1z_5Sj",
  "gymboree-climb-slide-3pc": "https://1pa.co/SNPICwUGdp",
};

export const BOOST_PAYMENT_CTA = PAYMENT_SUMMARY;
export const BOOST_PAYMENT_HINT = PAYMENT_SECURE_NOTICE;

export function getBoostPaymentUrl(productId: string): string | undefined {
  return BOOST_PRODUCT_PAYMENT_URLS[productId];
}

/** When the cart is a single Boost-linked product (qty 1+), return that payment URL. */
export function getBoostPaymentUrlForCart(
  items: Array<{ productId: string; quantity: number }>,
): string | undefined {
  if (items.length !== 1) return undefined;
  const only = items[0];
  if (!only) return undefined;
  return getBoostPaymentUrl(only.productId);
}
