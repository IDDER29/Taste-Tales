import * as React from "react";
import { cn } from "../../utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        "w-full rounded-xl border bg-white px-3.5 py-2.5 text-base text-sand-950 placeholder:text-sand-400 transition-shadow",
        "focus:outline-none focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500",
        "disabled:cursor-not-allowed disabled:bg-sand-50",
        invalid ? "border-brand-400 focus:ring-brand-500/20 focus:border-brand-500" : "border-sand-300",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
