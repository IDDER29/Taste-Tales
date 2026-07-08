"use client";

import React from "react";
import { CheckIcon } from "@heroicons/react/24/solid";
import { cn } from "../utils/cn";

// Self-contained tiles (emoji + brand gradient) so the section always renders
// crisp — no dependency on external image hosts.
const categories = [
  {
    id: 1,
    name: "Breakfast",
    emoji: "🍳",
    blurb: "Bright morning starts",
    gradient: "from-accent-400 to-brand-500",
  },
  {
    id: 2,
    name: "Main Course",
    emoji: "🍝",
    blurb: "Hearty centerpieces",
    gradient: "from-brand-500 to-brand-700",
  },
  {
    id: 3,
    name: "Appetizer",
    emoji: "🥗",
    blurb: "Small, shareable bites",
    gradient: "from-accent-500 to-brand-600",
  },
  {
    id: 4,
    name: "Dessert",
    emoji: "🍰",
    blurb: "Sweet finishes",
    gradient: "from-brand-600 to-accent-500",
  },
];

interface CategoriesProps {
  selectedCategory: string | null;
  setSelectedCategory: (name: string | null) => void;
}

const Categories: React.FC<CategoriesProps> = ({
  selectedCategory,
  setSelectedCategory,
}) => {
  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(
      selectedCategory === categoryName ? null : categoryName
    );
  };

  return (
    <section className="container-page py-16 sm:py-20">
      <div className="mb-10 text-center">
        <span className="eyebrow">Find your craving</span>
        <h2 className="section-title mt-3">Browse by category</h2>
        <p className="mx-auto mt-3 max-w-md text-sand-600">
          Pick a mood — we&apos;ll bring the recipes to match.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
        {categories.map((category) => {
          const active = selectedCategory === category.name;
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              aria-pressed={active}
              className={cn(
                "group relative aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30",
                category.gradient,
                active && "ring-4 ring-brand-500 ring-offset-2 ring-offset-[rgb(var(--surface))]"
              )}
            >
              {/* soft glow + emoji */}
              <span className="pointer-events-none absolute -right-6 -top-8 h-28 w-28 rounded-full bg-white/15 blur-2xl" />
              <span className="absolute inset-0 flex items-center justify-center text-6xl drop-shadow-sm transition-transform duration-500 group-hover:scale-110 sm:text-7xl">
                {category.emoji}
              </span>
              <div className="absolute inset-0 bg-gradient-to-t from-sand-950/55 via-transparent to-transparent" />
              {active && (
                <span className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-brand-600 shadow-glow">
                  <CheckIcon className="h-4 w-4" />
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                <p className="font-display text-lg font-semibold text-white">
                  {category.name}
                </p>
                <p className="text-xs text-white/80">
                  {active ? "Showing" : category.blurb}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default Categories;
