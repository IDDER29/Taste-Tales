import { cn } from "../../utils/cn";
import { Spinner } from "./Spinner";

interface LoadingStateProps {
  label?: string;
  className?: string;
}

// Centered spinner + label for in-flight data. Prefer Skeletons for content
// grids; use this for actions and small regions.
export function LoadingState({ label = "Loading…", className }: LoadingStateProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-12 text-gray-500",
        className
      )}
    >
      <Spinner className="h-7 w-7 text-brand-500" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
