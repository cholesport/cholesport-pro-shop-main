import { createHmac, timingSafeEqual } from "node:crypto";
import { getServerConfig } from "@/lib/config.server";

const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

function safeEqual(a: string, b: string): boolean {
  if (!a || !b) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function normalizeAccountEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isAdminAccountEmail(email: string): boolean {
  const config = getServerConfig();
  return normalizeAccountEmail(email) === normalizeAccountEmail(config.adminAccountEmail);
}

export function verifyAdminAccountCredentials(email: string, password: string): boolean {
  const config = getServerConfig();
  if (!config.adminAccountPassword) return false;
  return (
    isAdminAccountEmail(email) && safeEqual(password, config.adminAccountPassword)
  );
}

export function createAdminAuthToken(email: string): string {
  const secret = getServerConfig().adminSessionSecret;
  if (!secret) {
    throw new Error("חסר ADMIN_SESSION_SECRET או ADMIN_ACCOUNT_PASSWORD בשרת.");
  }

  const expiry = Date.now() + SESSION_TTL_MS;
  const payload = `${normalizeAccountEmail(email)}:${expiry}`;
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${Buffer.from(payload, "utf8").toString("base64url")}.${signature}`;
}

export function verifyAdminAuthToken(token: string | undefined): string | null {
  if (!token) return null;

  const secret = getServerConfig().adminSessionSecret;
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

  const [email, expiryRaw] = payload.split(":");
  const expiry = Number(expiryRaw);
  if (!email || !Number.isFinite(expiry) || Date.now() > expiry) return null;
  if (!isAdminAccountEmail(email)) return null;

  return email;
}
