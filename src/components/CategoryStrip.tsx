"use client";

import React from "react";
import Link from "next/link";
import { CATEGORY_TILES } from "./categoryTiles";
import { cn } from "../utils/cn";

interface CategoryStripProps {
  /** Optional section heading; omit to render just the tiles. */
  heading?: boolean;
  className?: string;
}

/**
 * Category tiles that LINK into the browse page (`/recipes?category=…`).
 * Used on the landing page and the signed-in home feed as a discovery teaser
 * (the interactive filter version lives in <Categories/> on the browse page).
 */
export default function CategoryStrip({ heading = true, className }: CategoryStripProps) {
  return (
    <section className={cn("container-page py-16 sm:py-20", className)}>
      {heading && (
        <div className="mb-10 text-center">
          <span className="eyebrow">Find your craving</span>
          <h2 className="section-title mt-3">Browse by category</h2>
          <p className="mx-auto mt-3 max-w-md text-sand-600">
            Pick a mood — we&apos;ll bring the recipes to match.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
        {CATEGORY_TILES.map((c) => (
          <Link
            key={c.name}
            href={`/recipes?category=${encodeURIComponent(c.name)}`}
            className={cn(
              "group relative aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30",
              c.gradient
            )}
          >
            <span className="pointer-events-none absolute -right-6 -top-8 h-28 w-28 rounded-full bg-white/15 blur-2xl" />
            <span className="absolute inset-0 flex items-center justify-center text-6xl drop-shadow-sm transition-transform duration-500 group-hover:scale-110 sm:text-7xl">
              {c.emoji}
            </span>
            <div className="absolute inset-0 bg-gradient-to-t from-sand-950/55 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-left">
              <p className="font-display text-lg font-semibold text-white">{c.name}</p>
              <p className="text-xs text-white/80">{c.blurb}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
