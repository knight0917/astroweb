/**
 * In-process sliding-window rate limiter.
 * Suitable for Vercel serverless (per-instance) and local dev.
 * For multi-region production at scale, replace the Map with Upstash Redis.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number; // Unix ms timestamp when the window resets
}

const store = new Map<string, RateLimitRecord>();

/** Purge stale entries to prevent memory leaks in long-running instances. */
function pruneStore(): void {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    if (now > record.resetAt) store.delete(key);
  }
}

// Prune every 5 minutes in the background
if (typeof setInterval !== "undefined") {
  setInterval(pruneStore, 5 * 60 * 1000);
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
  const now = Date.now();
  const record = store.get(identifier);

  if (!record || now > record.resetAt) {
    // New window
    store.set(identifier, { count: 1, resetAt: now + windowMs });
    return {
      allowed: true,
      remaining: maxRequests - 1,
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
