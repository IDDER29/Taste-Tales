import * as React from "react";
import { cn } from "../../utils/cn";

interface FieldProps {
  label?: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

// Form field wrapper: label + control + hint/error, with accessible associations.
export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="mb-1.5 block text-sm font-medium text-sand-800"
        >
          {label}
          {required && <span className="ml-0.5 text-brand-500">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="mt-1.5 text-sm text-brand-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-sm text-sand-500">{hint}</p>
      ) : null}
    </div>
  );
}
