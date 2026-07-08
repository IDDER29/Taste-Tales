import * as React from "react";
import { cn } from "../../utils/cn";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

// Native styled <select>. For rich multi-select keep using react-select where needed.
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, invalid, children, ...props }, ref) => (
    <select
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        "w-full appearance-none rounded-xl border bg-white px-3.5 py-2.5 text-base text-sand-950 transition-shadow",
        "focus:outline-none focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500",
        "disabled:cursor-not-allowed disabled:bg-sand-50",
        invalid ? "border-brand-400" : "border-sand-300",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";
