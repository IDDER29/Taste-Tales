import { redis } from "./redis";

// Optional idempotency for create endpoints. When Redis is configured and the
// client sends an `Idempotency-Key` header, the first response is cached and
// replayed for retries (24h), so a flaky-network retry never double-creates.
// Without Redis or a key, the operation just runs (no-op wrapper).
export async function withIdempotency<T>(
  key: string | null | undefined,
  scope: string,
  fn: () => Promise<T>
): Promise<T> {
  if (!redis || !key) return fn();

  const cacheKey = `idem:${scope}:${key}`;
  const cached = await redis.get<T>(cacheKey);
  if (cached !== null && cached !== undefined) return cached;

  const result = await fn();
  // Best-effort cache; never fail the request if caching fails.
  try {
    await redis.set(cacheKey, result, { ex: 60 * 60 * 24 });
  } catch {
    /* ignore */
  }
  return result;
}
