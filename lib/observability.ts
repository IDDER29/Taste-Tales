import * as Sentry from "@sentry/nextjs";

// Thin wrapper over Sentry. When no DSN is configured the SDK is disabled, so
// these calls are safe no-ops — capture is enabled simply by setting the DSN.
export function captureException(
  error: unknown,
  context?: Record<string, unknown>
): void {
  try {
    Sentry.captureException(error, context ? { extra: context } : undefined);
  } catch {
    /* never let telemetry break a request */
  }
}

export { Sentry };
