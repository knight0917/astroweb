/**
 * Lightweight HMAC-signed email identity tokens for stateless chart API authorization.
 * No auth provider required — tokens are verified server-side via a shared secret.
 *
 * Token format (base64url): "<email>:<expiresAt>:<hmac-sha256-hex>"
 */
import { createHmac, timingSafeEqual } from "crypto";

const DEFAULT_TTL_DAYS = 30;
const HEX_SIG_REGEX = /^[0-9a-f]{64}$/i;

function resolveHmacSecret(): string {
  const configured = process.env.EMAIL_HMAC_SECRET?.trim() || "";
  if (configured) return configured;

  if (process.env.NODE_ENV === "production") {
    throw new Error("[emailToken] EMAIL_HMAC_SECRET must be configured in production.");
  }

  return "dev-only-local-hmac-secret";
}

/**
 * Signs an email address into a short-lived token.
 * @param email    The user's email address (will be lowercased + trimmed)
 * @param ttlDays  Token lifetime in days (default: 30)
 * @returns        A base64url-encoded signed token string
 */
export function signEmailToken(email: string, ttlDays = DEFAULT_TTL_DAYS): string {
  const secret = resolveHmacSecret();
  const normEmail = email.trim().toLowerCase();
  const safeTtlDays = Number.isFinite(ttlDays) && ttlDays > 0 ? Math.min(365, ttlDays) : DEFAULT_TTL_DAYS;
  const expiresAt = Math.floor(Date.now() / 1000) + Math.floor(safeTtlDays * 86_400);
  const payload = `${normEmail}:${expiresAt}`;
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

/**
 * Verifies a token. Returns the normalized email if valid, null otherwise.
 * Verifies HMAC signature in constant time BEFORE inspecting claims or expiry.
 */
export function verifyEmailToken(token: string): string | null {
  if (!token || typeof token !== "string" || token.length > 512) return null;
  try {
    const secret = resolveHmacSecret();
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const lastColon = decoded.lastIndexOf(":");
    if (lastColon <= 0) return null;
    const payload = decoded.slice(0, lastColon);
    const sig = decoded.slice(lastColon + 1);
    if (!HEX_SIG_REGEX.test(sig)) return null;

    const prevColon = payload.lastIndexOf(":");
    if (prevColon <= 0) return null;
    const email = payload.slice(0, prevColon);
    const expiresStr = payload.slice(prevColon + 1);
    if (!/^\d+$/.test(expiresStr)) return null;

    // 1. Constant-time cryptographic verification FIRST
    const expectedSig = createHmac("sha256", secret).update(payload).digest("hex");
    const sigBuf = Buffer.from(sig, "hex");
    const expectedBuf = Buffer.from(expectedSig, "hex");
    if (sigBuf.length !== expectedBuf.length) return null;
    if (!timingSafeEqual(sigBuf, expectedBuf)) return null;

    // 2. Expiry check AFTER authenticity is established
    const expiresAt = Number(expiresStr);
    if (!Number.isFinite(expiresAt) || Date.now() / 1000 > expiresAt) return null;

    return email;
  } catch {
    return null;
  }
}
