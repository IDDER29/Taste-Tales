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
        "overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm",
        interactive &&
          "transition-shadow hover:shadow-lg focus-within:shadow-lg",
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
