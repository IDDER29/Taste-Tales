"use client";

import React from "react";
import Link from "next/link";
import { StarIcon } from "@heroicons/react/24/solid";
import Brand from "./Brand";

interface AuthLayoutProps {
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  /** Link row rendered under the form card. */
  footer?: React.ReactNode;
}

const HIGHLIGHTS = [
  "Save recipes to your personal box",
  "Cook from what's already in your pantry",
  "Share your own tales with the community",
];

/**
 * Split-screen shell for every auth screen: an editorial brand panel beside a
 * focused form card. Collapses to a single centered column on small screens.
 */
export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="container-page grid min-h-[calc(100vh-4rem)] items-center gap-10 py-12 lg:grid-cols-2 lg:gap-16 lg:py-16">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden rounded-4xl bg-sand-950 p-10 text-white lg:flex lg:min-h-[36rem] lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-hero-mesh opacity-60" />
          <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-brand-500/30 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-accent-500/20 blur-3xl" />
          {/* subtle floating food glyphs */}
          <span className="absolute right-8 top-24 text-5xl opacity-25">🍋</span>
          <span className="absolute right-24 top-1/2 text-4xl opacity-20">🌿</span>
        </div>

        <Brand inverted className="relative" />

        <div className="relative">
          <h2 className="font-display text-4xl font-semibold leading-tight">
            Cook something worth telling a story about.
          </h2>
          <ul className="mt-8 space-y-3">
            {HIGHLIGHTS.map((h) => (
              <li key={h} className="flex items-center gap-3 text-white/85">
                <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand-500/90 text-xs">
                  ✓
                </span>
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <div className="flex text-accent-300">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className="h-4 w-4" />
              ))}
            </div>
            <p className="text-sm text-white/80">
              Loved by <strong className="text-white">12,000+</strong> home cooks
            </p>
          </div>
        </div>
      </div>

      {/* Form column */}
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 flex justify-center lg:hidden">
          <Brand />
        </div>
        <h1 className="text-center font-display text-3xl font-semibold text-sand-950 sm:text-left sm:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-center text-sand-600 sm:text-left">{subtitle}</p>
        )}

        <div className="mt-8 rounded-3xl border border-sand-200/70 bg-white p-6 shadow-card sm:p-8">
          {children}
        </div>

        {footer && (
          <div className="mt-6 text-center text-sm text-sand-600">{footer}</div>
        )}
      </div>
    </div>
  );
}

// Shared labeled field for auth forms.
export function AuthField({
  id,
  label,
  hint,
  children,
  action,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-sand-800">
          {label}
        </label>
        {action}
      </div>
      {children}
      {hint && <p className="mt-1.5 text-xs text-sand-500">{hint}</p>}
    </div>
  );
}

// Shared inline error / notice banners.
export function AuthAlert({
  variant = "error",
  children,
}: {
  variant?: "error" | "success";
  children: React.ReactNode;
}) {
  const styles =
    variant === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-brand-200 bg-brand-50 text-brand-700";
  return (
    <p className={`rounded-xl border px-3.5 py-3 text-sm ${styles}`} role="alert">
      {children}
    </p>
  );
}

export { Link };
