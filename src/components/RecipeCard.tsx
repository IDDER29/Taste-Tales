"use client";

import React from "react";
import Link from "next/link";
import { ClockIcon, UserGroupIcon, FireIcon } from "@heroicons/react/24/outline";
import { formatMinutes, totalMinutes } from "../utils/recipe";
import { AppImage } from "./ui/AppImage";
import { Avatar } from "./ui/Avatar";
import SaveButton from "./SaveButton";
import { cn } from "../utils/cn";
import type { Article } from "../types";

interface RecipeCardProps {
  recipe: Article;
  /** Larger hero-style card for featured placements. */
  featured?: boolean;
  className?: string;
  /** Fade-up stagger index for entrance animation. */
  index?: number;
}

/**
 * The canonical recipe card used across the app (browse grid, trendy, saved).
 * A single, polished pattern instead of the previous one-off card markup:
 * hover-zoom image, category tag, save button, tidy meta row and author.
 */
const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  featured,
  className,
  index = 0,
}) => {
  const time = formatMinutes(totalMinutes(recipe));
  const diets = recipe.diet || [];

  return (
    <Link
      href={`/articles/${recipe.id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-sand-200/70 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25 animate-fade-up",
        className
      )}
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      {/* Media */}
      <div
        className={cn(
          "relative overflow-hidden",
          featured ? "aspect-[16/10]" : "aspect-[4/3]"
        )}
      >
        <AppImage
          src={recipe.imageUrl}
          alt={recipe.title}
          wrapperClassName="absolute inset-0 h-full w-full"
          ratio=""
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-sand-950/50 via-transparent to-transparent opacity-70" />

        {/* Category tag */}
        {recipe.category && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-sand-800 shadow-soft backdrop-blur">
            {recipe.category}
          </span>
        )}

        {/* Save */}
        <SaveButton id={recipe.id} className="absolute right-3 top-3 z-10" />

        {/* Time badge on image */}
        {time && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-sand-950/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            <ClockIcon className="h-3.5 w-3.5" />
            {time}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        {recipe.cuisine && (
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
            {recipe.cuisine}
          </span>
        )}
        <h3
          className={cn(
            "mt-1 font-display font-semibold leading-snug text-sand-950 line-clamp-2 transition-colors group-hover:text-brand-700",
            featured ? "text-xl" : "text-lg"
          )}
        >
          {recipe.title}
        </h3>
        {recipe.subtitle && (
          <p className="mt-1.5 line-clamp-2 text-sm text-sand-600">
            {recipe.subtitle}
          </p>
        )}

        {/* Meta row */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-sand-600">
          {recipe.servings ? (
            <span className="inline-flex items-center gap-1.5">
              <UserGroupIcon className="h-4 w-4 text-sand-400" />
              {recipe.servings} servings
            </span>
          ) : null}
          {recipe.likes ? (
            <span className="inline-flex items-center gap-1.5">
              <FireIcon className="h-4 w-4 text-brand-400" />
              {recipe.likes}
            </span>
          ) : null}
        </div>

        {/* Diet chips */}
        {diets.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {diets.slice(0, 3).map((diet) => (
              <span
                key={diet}
                className="rounded-full bg-accent-50 px-2 py-0.5 text-xs font-medium text-accent-700"
              >
                {diet}
              </span>
            ))}
          </div>
        )}

        {/* Author */}
        <div className="mt-auto flex items-center gap-2.5 pt-4">
          <Avatar
            name={recipe.publisher?.name}
            src={recipe.publisher?.image}
            size="sm"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-sand-800">
              {recipe.publisher?.name}
            </p>
            {recipe.publishedDate && (
              <p className="truncate text-xs text-sand-500">
                {recipe.publishedDate}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;

// Matching skeleton placeholder for loading grids.
export function RecipeCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-sand-200/70 bg-white shadow-soft">
      <div className="aspect-[4/3] w-full animate-pulse bg-sand-200/70" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-16 animate-pulse rounded-full bg-sand-200/70" />
        <div className="h-5 w-3/4 animate-pulse rounded-md bg-sand-200/70" />
        <div className="h-4 w-full animate-pulse rounded-md bg-sand-200/60" />
        <div className="flex items-center gap-2.5 pt-3">
          <div className="h-8 w-8 animate-pulse rounded-full bg-sand-200/70" />
          <div className="h-3 w-24 animate-pulse rounded-md bg-sand-200/60" />
        </div>
      </div>
    </div>
  );
}
