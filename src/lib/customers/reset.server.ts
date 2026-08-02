import { createHmac, timingSafeEqual } from "node:crypto";
import { getServerConfig } from "@/lib/config.server";
import { normalizeCustomerEmail } from "@/lib/customers/store.server";

const RESET_TTL_MS = 60 * 60 * 1000;

export function createPasswordResetToken(email: string): string {
  const secret = getServerConfig().passwordResetSecret;
  if (!secret) {
    throw new Error("חסר PASSWORD_RESET_SECRET בשרת.");
  }

  const normalized = normalizeCustomerEmail(email);
  const expiry = Date.now() + RESET_TTL_MS;
  const payload = `reset:${normalized}:${expiry}`;
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${Buffer.from(payload, "utf8").toString("base64url")}.${signature}`;
}

export function verifyPasswordResetToken(token: string | undefined): string | null {
  if (!token) return null;

  const secret = getServerConfig().passwordResetSecret;
  if (!secret) return null;

  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return null;

  const payload = Buffer.from(payloadB64, "base64url").toString("utf8");
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");

  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  const [kind, email, expiryRaw] = payload.split(":");
  const expiry = Number(expiryRaw);
  if (kind !== "reset" || !email || !Number.isFinite(expiry) || Date.now() > expiry) {
    return null;
  }

  return email;
}

export function buildPasswordResetUrl(token: string): string {
  const siteUrl = getServerConfig().siteUrl.replace(/\/$/, "");
  return `${siteUrl}/account/reset-password?token=${encodeURIComponent(token)}`;
}
