import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-medium",
  {
    variants: {
      variant: {
        brand: "bg-brand-100 text-brand-700",
        neutral: "bg-gray-100 text-gray-700",
        success: "bg-green-100 text-green-700",
        warning: "bg-yellow-100 text-yellow-800",
        danger: "bg-red-100 text-red-700",
        outline: "border border-gray-300 text-gray-700",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: { variant: "neutral", size: "sm" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { badgeVariants };
