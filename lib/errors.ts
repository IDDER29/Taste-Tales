import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { ZodError } from "zod";
import { logger } from "./logger";
import { captureException } from "./observability";

// Stable, machine-readable error codes returned in the API error envelope.
export type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "SERVICE_UNAVAILABLE"
  | "INTERNAL";

const statusByCode: Record<ErrorCode, number> = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  SERVICE_UNAVAILABLE: 503,
  INTERNAL: 500,
};

export class ApiError extends Error {
  code: ErrorCode;
  status: number;
  details?: unknown;
  constructor(code: ErrorCode, message: string, details?: unknown) {
    super(message);
    this.code = code;
    this.status = statusByCode[code];
    this.details = details;
  }
}

interface OkInit {
  status?: number;
  meta?: unknown;
  headers?: HeadersInit;
}

// Success envelope: { data, meta? }
export function jsonOk<T>(data: T, init: OkInit = {}): NextResponse {
  const body: Record<string, unknown> = { data };
  if (init.meta !== undefined) body.meta = init.meta;
  return NextResponse.json(body, {
    status: init.status ?? 200,
    headers: init.headers,
  });
}

// Error envelope: { error: { code, message, details? } }
export function jsonError(err: ApiError, headers?: HeadersInit): NextResponse {
  return NextResponse.json(
    { error: { code: err.code, message: err.message, details: err.details } },
    { status: err.status, headers }
  );
}

// Convert any thrown value into a consistent error response.
export function toErrorResponse(err: unknown): NextResponse {
  if (err instanceof ApiError) return jsonError(err);
  if (err instanceof ZodError) {
    return jsonError(
      new ApiError(
        "VALIDATION_ERROR",
        "Invalid input.",
        err.issues.map((i) => ({ path: i.path.join("."), message: i.message }))
      )
    );
  }
  // Unexpected — log + report with a correlation id; never leak details.
  const requestId = randomUUID();
  logger.error("Unhandled API error", {
    requestId,
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
  });
  captureException(err, { requestId });
  return jsonError(
    new ApiError("INTERNAL", "Something went wrong.", { requestId })
  );
}

// Best-effort client identifier for rate limiting / logging.
export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "anonymous";
}
