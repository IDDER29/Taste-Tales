import { cn } from "../../utils/cn";
import { Button } from "./Button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

// Inline, actionable error with an optional retry. Never a blank screen.
export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-red-100 bg-red-50 px-6 py-10 text-center",
        className
      )}
    >
      <h3 className="text-base font-semibold text-red-700">{title}</h3>
      <p className="max-w-sm text-sm text-red-600">{description}</p>
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
