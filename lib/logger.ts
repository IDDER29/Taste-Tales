// Minimal structured (JSON) logger. No dependencies; emits one JSON object per
// line so logs are queryable in any aggregator (Axiom, Better Stack, Vercel).
type Level = "debug" | "info" | "warn" | "error";

export type LogContext = Record<string, unknown>;

function emit(level: Level, message: string, context?: LogContext): void {
  const entry = {
    level,
    message,
    time: new Date().toISOString(),
    ...context,
  };
  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  debug: (message: string, context?: LogContext) => emit("debug", message, context),
  info: (message: string, context?: LogContext) => emit("info", message, context),
  warn: (message: string, context?: LogContext) => emit("warn", message, context),
  error: (message: string, context?: LogContext) => emit("error", message, context),
};
