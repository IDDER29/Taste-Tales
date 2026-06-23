import { Redis } from "@upstash/redis";

// Single shared Upstash Redis client (used by rate limiting + idempotency).
// Null when not configured, so callers degrade gracefully.
const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = url && token ? new Redis({ url, token }) : null;
export const isRedisConfigured = (): boolean => redis !== null;
