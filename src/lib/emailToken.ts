/**
 * Lightweight HMAC-signed email identity tokens for stateless chart API authorization.
 * No auth provider required — tokens are verified server-side via a shared secret.
 *
 * Token format (base64url): "<email>:<expiresAt>:<hmac-sha256-hex>"
 */
import { createHmac, timingSafeEqual } from "crypto";

const SECRET = process.env.EMAIL_HMAC_SECRET || "";
const DEFAULT_TTL_DAYS = 30;

/**
 * Warns at startup if the secret is not configured.
 * Does not throw — allows local dev without the env var set.
 */
if (!SECRET && process.env.NODE_ENV === "production") {
  console.error(
    "[emailToken] CRITICAL: EMAIL_HMAC_SECRET is not set. Chart API tokens will not be secure."
  );
}

/**
 * Signs an email address into a short-lived token.
 * @param email    The user's email address (will be lowercased + trimmed)
 * @param ttlDays  Token lifetime in days (default: 30)
 * @returns        A base64url-encoded signed token string
 */
export function signEmailToken(email: string, ttlDays = DEFAULT_TTL_DAYS): string {
  const normEmail = email.trim().toLowerCase();
  const expiresAt = Math.floor(Date.now() / 1000) + ttlDays * 86_400;
  const payload = `${normEmail}:${expiresAt}`;
  const sig = createHmac("sha256", SECRET || "dev-insecure-secret")
    .update(payload)
    .digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

/**
 * Verifies a token. Returns the normalized email if valid, null otherwise.
 * Uses timing-safe comparison to prevent timing attacks.
 */
export function verifyEmailToken(token: string): string | null {
  if (!token || typeof token !== "string") return null;
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const parts = decoded.split(":");
    // Expect exactly 3 parts: email, expiresAt, sig
    if (parts.length !== 3) return null;
    const [email, expiresStr, sig] = parts;
    const expiresAt = parseInt(expiresStr, 10);

    // Check expiry
    if (isNaN(expiresAt) || Date.now() / 1000 > expiresAt) return null;

    // Recompute expected signature
    const payload = `${email}:${expiresAt}`;
    const expectedSig = createHmac("sha256", SECRET || "dev-insecure-secret")
      .update(payload)
      .digest("hex");

    // Timing-safe comparison
    const sigBuf = Buffer.from(sig, "hex");
    const expectedBuf = Buffer.from(expectedSig, "hex");
    if (sigBuf.length !== expectedBuf.length) return null;
    if (!timingSafeEqual(sigBuf, expectedBuf)) return null;

    return email; // already normalized at sign time
  } catch {
    return null;
  }
}
