"use client";

import * as React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

type ConfirmFn = (opts: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = React.createContext<ConfirmFn | null>(null);

export function useConfirm(): ConfirmFn {
  const ctx = React.useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within <ConfirmProvider>");
  return ctx;
}

interface PendingState extends ConfirmOptions {
  resolve: (value: boolean) => void;
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = React.useState<PendingState | null>(null);

  const confirm = React.useCallback<ConfirmFn>(
    (opts) =>
      new Promise<boolean>((resolve) => {
        setPending({ ...opts, resolve });
      }),
    []
  );

  const settle = (value: boolean) => {
    pending?.resolve(value);
    setPending(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal
        open={!!pending}
        onClose={() => settle(false)}
        title={pending?.title}
        description={pending?.description}
        size="sm"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => settle(false)}>
              {pending?.cancelLabel ?? "Cancel"}
            </Button>
            <Button
              variant={pending?.danger ? "danger" : "primary"}
              size="sm"
              onClick={() => settle(true)}
            >
              {pending?.confirmLabel ?? "Confirm"}
            </Button>
          </>
        }
      />
    </ConfirmContext.Provider>
  );
}
