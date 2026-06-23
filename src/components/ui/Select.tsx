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
        "w-full appearance-none rounded-lg border bg-white px-3 py-2.5 text-base text-gray-900",
        "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500",
        "disabled:cursor-not-allowed disabled:bg-gray-50",
        invalid ? "border-red-400" : "border-gray-300",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";
