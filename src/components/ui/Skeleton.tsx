import { cn } from "../../utils/cn";

// Gray placeholder block for loading states. Compose with width/height classes.
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-sand-200/70", className)}
      aria-hidden="true"
    />
  );
}
