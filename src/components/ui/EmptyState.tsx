import * as React from "react";
import { cn } from "../../utils/cn";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

// Friendly empty placeholder with optional icon, message, and call to action.
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-sand-300 bg-sand-50/50 px-6 py-14 text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-3xl text-brand-500">
          {icon}
        </div>
      )}
      <h3 className="font-display text-xl font-semibold text-sand-950">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-sand-600">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
