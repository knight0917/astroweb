/**
 * In-process sliding-window rate limiter.
 * Suitable for Vercel serverless (per-instance) and local dev.
 * For multi-region production at scale, replace the Map with Upstash Redis.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number; // Unix ms timestamp when the window resets
}

const MAX_STORE_KEYS = 5_000;
const store = new Map<string, RateLimitRecord>();

/** Purge stale entries to prevent memory leaks in long-running instances. */
function pruneStore(): void {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    if (now > record.resetAt) store.delete(key);
  }
}

// Prune every 5 minutes in the background (.unref() prevents keeping test/CLI loops alive)
if (typeof setInterval !== "undefined") {
  const timer = setInterval(pruneStore, 5 * 60 * 1000);
  if (typeof (timer as NodeJS.Timeout).unref === "function") {
    (timer as NodeJS.Timeout).unref();
  }
}

/**
 * Extracts a trustworthy client IP from platform headers.
 * Prefers `x-real-ip` / `x-vercel-forwarded-for` over the rightmost `x-forwarded-for` hop
 * so clients cannot spoof arbitrary leftmost X-Forwarded-For headers.
 */
export function extractClientIp(headers: Headers): string {
  const vercelIp = headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  if (vercelIp) return vercelIp.slice(0, 64);

  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 64);

  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const hops = xff
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (hops.length > 0) {
      return hops[hops.length - 1].slice(0, 64);
    }
  }

  return "unknown";
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInMs: number;
  retryAfterSec: number;
}

/**
 * Checks whether `identifier` (e.g. client IP or hashed email) is within rate limits.
 *
 * @param identifier   Unique key to rate-limit on (IP address, hashed email, etc.)
 * @param maxRequests  Max allowed requests per window (default: 10)
 * @param windowMs     Sliding window duration in ms (default: 60 000 = 1 minute)
 */
export function checkRateLimit(
  identifier: string,
  maxRequests = 10,
  windowMs = 60_000
): RateLimitResult {
  const safeKey = (identifier || "unknown").slice(0, 128);
  const now = Date.now();
  const record = store.get(safeKey);

  if (!record || now > record.resetAt) {
    if (store.size >= MAX_STORE_KEYS) {
      pruneStore();
      if (store.size >= MAX_STORE_KEYS) {
        const oldestKey = store.keys().next().value;
        if (typeof oldestKey === "string") store.delete(oldestKey);
      }
    }
    store.set(safeKey, { count: 1, resetAt: now + windowMs });
    return {
      allowed: true,
      remaining: Math.max(0, maxRequests - 1),
      resetInMs: windowMs,
      retryAfterSec: 0,
    };
  }

  if (record.count >= maxRequests) {
    const resetInMs = record.resetAt - now;
    return {
      allowed: false,
      remaining: 0,
      resetInMs,
      retryAfterSec: Math.ceil(resetInMs / 1000),
    };
  }

  record.count++;
  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetInMs: record.resetAt - now,
    retryAfterSec: 0,
  };
}
