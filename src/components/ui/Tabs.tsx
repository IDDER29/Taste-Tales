"use client";

import * as React from "react";
import { cn } from "../../utils/cn";

interface TabItem {
  id: string;
  label: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}

// Accessible tab list (controlled). Render panels yourself based on `value`.
export function Tabs({ tabs, value, onChange, className }: TabsProps) {
  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={cn("flex gap-1 border-b border-gray-200", className)}
    >
      {tabs.map((tab) => {
        const selected = tab.id === value;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={cn(
              "-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
              selected
                ? "border-brand-500 text-brand-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
