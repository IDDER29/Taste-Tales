"use client";

import * as React from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { cn } from "../../utils/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-2xl" };

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  className,
}: ModalProps) {
  return (
    <Transition show={open} as={React.Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <TransitionChild
          as={React.Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={React.Fragment}
            enter="ease-out duration-150"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel
              className={cn(
                "w-full rounded-xl bg-white p-6 shadow-xl",
                sizes[size],
                className
              )}
            >
              {title && (
                <DialogTitle className="text-lg font-bold text-gray-900">
                  {title}
                </DialogTitle>
              )}
              {description && (
                <p className="mt-1 text-sm text-gray-600">{description}</p>
              )}
              {children && <div className="mt-4">{children}</div>}
              {footer && (
                <div className="mt-6 flex justify-end gap-3">{footer}</div>
              )}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
