"use client";

import * as React from "react";
import { ToastProvider } from "./toast";
import { ConfirmProvider } from "./confirm";

// Mounts the global toast + confirm hosts. Place near the app root so any client
// component can call useToast()/useConfirm().
export function UIProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ConfirmProvider>{children}</ConfirmProvider>
    </ToastProvider>
  );
}
