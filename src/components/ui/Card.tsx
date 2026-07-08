import * as React from "react";
import { cn } from "../../utils/cn";

// Surface container. `interactive` adds hover elevation for clickable cards.
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden rounded-2xl border border-sand-200/70 bg-white shadow-soft",
        interactive &&
          "transition-all duration-300 hover:-translate-y-1 hover:shadow-lift focus-within:shadow-lift",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export function CardBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4", className)} {...props} />;
}
