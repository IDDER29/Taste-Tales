// Taste-Tales UI primitives — single import surface.
// Example: import { Button, Card, useToast } from "@/src/components/ui";

export { Button, buttonVariants, type ButtonProps } from "./Button";
export { Badge, badgeVariants, type BadgeProps } from "./Badge";
export { Card, CardBody, type CardProps } from "./Card";
export { Input, type InputProps } from "./Input";
export { Textarea, type TextareaProps } from "./Textarea";
export { Select, type SelectProps } from "./Select";
export { Field } from "./Field";
export { Avatar } from "./Avatar";
export { Spinner } from "./Spinner";
export { Skeleton } from "./Skeleton";
export { Rating } from "./Rating";
export { Tabs } from "./Tabs";
export { Modal } from "./Modal";
export { AppImage, type AppImageProps } from "./AppImage";

// State sets
export { EmptyState } from "./EmptyState";
export { LoadingState } from "./LoadingState";
export { ErrorState } from "./ErrorState";
export { AsyncBoundary } from "./AsyncBoundary";

// Providers + hooks
export { UIProvider } from "./UIProvider";
export { ToastProvider, useToast } from "./toast";
export { ConfirmProvider, useConfirm } from "./confirm";
