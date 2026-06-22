import * as React from "react";
import { cn } from "../../utils/cn";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, ...props }, ref) => (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        "w-full rounded-lg border bg-white px-3 py-2.5 text-base text-gray-900 placeholder:text-gray-400",
        "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500",
        "disabled:cursor-not-allowed disabled:bg-gray-50",
        invalid ? "border-red-400 focus:ring-red-500 focus:border-red-500" : "border-gray-300",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
