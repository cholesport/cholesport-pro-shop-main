import { createHmac, timingSafeEqual } from "node:crypto";
import { getServerConfig } from "@/lib/config.server";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function createCustomerSessionToken(customerId: string, email: string): string {
  const secret = getServerConfig().customerSessionSecret;
  if (!secret) {
    throw new Error("חסר CUSTOMER_SESSION_SECRET בשרת.");
  }

  const expiry = Date.now() + SESSION_TTL_MS;
  const payload = `${customerId}:${email.trim().toLowerCase()}:${expiry}`;
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${Buffer.from(payload, "utf8").toString("base64url")}.${signature}`;
}

export function verifyCustomerSessionToken(
  token: string | undefined,
): { customerId: string; email: string } | null {
  if (!token) return null;

  const secret = getServerConfig().customerSessionSecret;
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

  const [customerId, email, expiryRaw] = payload.split(":");
  const expiry = Number(expiryRaw);
  if (!customerId || !email || !Number.isFinite(expiry) || Date.now() > expiry) return null;

  return { customerId, email };
}
