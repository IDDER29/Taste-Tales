"use client";

import React from "react";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import RecipeCard, { RecipeCardSkeleton } from "./RecipeCard";
import { EmptyState } from "./ui/EmptyState";
import { buttonVariants } from "./ui/Button";
import type { Article } from "../types";

interface TopCategoryRecipesProps {
  recipes: Article[];
  loading?: boolean;
}

const TopCategoryRecipes: React.FC<TopCategoryRecipesProps> = ({
  recipes,
  loading,
}) => {
  return (
    <div>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <span className="eyebrow">The collection</span>
          <h2 className="section-title mt-3">Fresh from the kitchen</h2>
        </div>
        {recipes.length > 0 && (
          <p className="hidden text-sm text-sand-500 sm:block">
            {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
          </p>
        )}
      </div>

      {loading && recipes.length === 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <EmptyState
          icon={<MagnifyingGlassIcon className="h-8 w-8" />}
          title="No recipes match your filters"
          description="Try adjusting your search, clearing a filter, or exploring a different category."
          action={
            <Link href="/articles" className={buttonVariants({ variant: "outline" })}>
              Share your own recipe
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recipes.map((recipe, i) => (
            <RecipeCard key={recipe.id} recipe={recipe} index={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TopCategoryRecipes;
