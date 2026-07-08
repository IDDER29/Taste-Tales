import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-medium",
  {
    variants: {
      variant: {
        brand: "bg-brand-50 text-brand-700",
        neutral: "bg-sand-100 text-sand-700",
        success: "bg-emerald-50 text-emerald-700",
        warning: "bg-accent-50 text-accent-700",
        danger: "bg-red-50 text-red-700",
        outline: "border border-sand-300 text-sand-700",
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
