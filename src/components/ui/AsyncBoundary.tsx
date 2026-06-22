import * as React from "react";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";

interface AsyncBoundaryProps {
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  onRetry?: () => void;
  /** Custom node to show while loading (e.g. skeletons). Defaults to a spinner. */
  loadingFallback?: React.ReactNode;
  /** Node to show when there is no data. */
  emptyFallback?: React.ReactNode;
  errorTitle?: string;
  errorDescription?: string;
  children: React.ReactNode;
}

// One place to render the loading/error/empty/success state set consistently
// around any data-driven region.
export function AsyncBoundary({
  isLoading,
  isError,
  isEmpty,
  onRetry,
  loadingFallback,
  emptyFallback,
  errorTitle,
  errorDescription,
  children,
}: AsyncBoundaryProps) {
  if (isLoading) return <>{loadingFallback ?? <LoadingState />}</>;
  if (isError)
    return (
      <ErrorState
        title={errorTitle}
        description={errorDescription}
        onRetry={onRetry}
      />
    );
  if (isEmpty && emptyFallback) return <>{emptyFallback}</>;
  return <>{children}</>;
}
