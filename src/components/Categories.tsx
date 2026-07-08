"use client";

import React from "react";
import { CheckIcon } from "@heroicons/react/24/solid";
import { cn } from "../utils/cn";

const categories = [
  {
    id: 1,
    name: "Breakfast",
    image:
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=500&q=70",
  },
  {
    id: 2,
    name: "Main Course",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=70",
  },
  {
    id: 3,
    name: "Appetizer",
    image:
      "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=500&q=70",
  },
  {
    id: 4,
    name: "Dessert",
    image:
      "https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?auto=format&fit=crop&w=500&q=70",
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
                "group relative aspect-[4/5] overflow-hidden rounded-3xl shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30",
                active && "ring-4 ring-brand-500 ring-offset-2 ring-offset-[rgb(var(--surface))]"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sand-950/85 via-sand-950/20 to-transparent" />
              {active && (
                <span className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-white shadow-glow">
                  <CheckIcon className="h-4 w-4" />
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                <p className="font-display text-lg font-semibold text-white">
                  {category.name}
                </p>
                <p className="text-xs text-white/70">
                  {active ? "Showing" : "Explore"}
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
