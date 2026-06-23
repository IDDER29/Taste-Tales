import { Ratelimit } from "@upstash/ratelimit";
import { ApiError } from "./errors";
import { redis } from "./redis";

// Upstash Redis is optional: when its env vars are absent (e.g. local dev or
// before infra is provisioned) rate limiting is a no-op that allows the request.
// Add UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN to turn it on — no code change.
export const isRateLimitConfigured = (): boolean => redis !== null;

type Duration = `${number} ${"s" | "m" | "h" | "d"}`;

const limiters = new Map<string, Ratelimit>();

function getLimiter(name: string, limit: number, window: Duration): Ratelimit | null {
  if (!redis) return null;
  const key = `${name}:${limit}:${window}`;
  let limiter = limiters.get(key);
  if (!limiter) {
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, window),
      prefix: `rl:${name}`,
      analytics: false,
    });
    limiters.set(key, limiter);
  }
  return limiter;
}

interface RateLimitOptions {
  /** Logical bucket name, e.g. "auth:register", "ai:generate". */
  name: string;
  /** Per-identifier key (userId or IP). */
  identifier: string;
  limit: number;
  window: Duration;
}

/**
 * Throws ApiError("RATE_LIMITED") when the caller exceeds the window.
 * No-op (allows) when Redis isn't configured.
 */
export async function enforceRateLimit(opts: RateLimitOptions): Promise<void> {
  const limiter = getLimiter(opts.name, opts.limit, opts.window);
  if (!limiter) return;
  const { success, reset } = await limiter.limit(opts.identifier);
  if (!success) {
    const retryAfter = Math.max(0, Math.ceil((reset - Date.now()) / 1000));
    throw new ApiError(
      "RATE_LIMITED",
      `Too many requests. Try again in ${retryAfter}s.`,
      { retryAfter }
    );
  }
}
