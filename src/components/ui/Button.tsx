"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import { Spinner } from "./Spinner";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-600 text-white shadow-soft hover:bg-brand-700 hover:shadow-glow",
        secondary:
          "bg-sand-100 text-sand-900 hover:bg-sand-200 focus-visible:ring-sand-400/40",
        outline:
          "border border-sand-300 bg-white text-sand-900 hover:border-sand-400 hover:bg-sand-50 focus-visible:ring-sand-400/40",
        ghost:
          "text-sand-700 hover:bg-sand-100 focus-visible:ring-sand-400/40",
        danger:
          "bg-red-600 text-white shadow-soft hover:bg-red-700 focus-visible:ring-red-600/30",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-base",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10",
      },
      block: { true: "w-full" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, block, loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, block }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  )
);
Button.displayName = "Button";

export { buttonVariants };
