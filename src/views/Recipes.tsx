"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useAppSelector } from "../app/hooks";
import { selectAllArticles, selectArticlesStatus } from "../features/article/articleSlice";
import RecipeFilters from "../components/RecipeFilters";
import RecipeCard, { RecipeCardSkeleton } from "../components/RecipeCard";
import { EmptyState } from "../components/ui/EmptyState";
import { buttonVariants } from "../components/ui/Button";
import { filterRecipes, totalMinutes, CATEGORY_OPTIONS } from "../utils/recipe";
import { cn } from "../utils/cn";
import type { FilterCriteria } from "../types";

type SortKey = "newest" | "popular" | "liked" | "quick";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most popular" },
  { value: "liked", label: "Most liked" },
  { value: "quick", label: "Quickest" },
];

const PAGE_SIZE = 12;

const Recipes: React.FC = () => {
  const params = useSearchParams();
  const articles = useAppSelector(selectAllArticles);
  const status = useAppSelector(selectArticlesStatus);
  const loading = status === "loading" || status === "idle";

  // Seed filters from the URL so category/search links from elsewhere deep-link.
  const [category, setCategory] = useState<string | null>(
    params.get("category")
  );
  const [filters, setFilters] = useState<FilterCriteria>({
    query: params.get("q") ?? "",
    cuisine: params.get("cuisine") ?? "",
    diets: params.get("diet") ? [params.get("diet") as string] : [],
    maxTime: params.get("maxTime") ? Number(params.get("maxTime")) : null,
  });
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const results = useMemo(() => {
    const filtered = filterRecipes(articles, { ...filters, category });
    const arr = [...filtered];
    switch (sortBy) {
      case "popular":
        return arr.sort((a, b) => b.views - a.views);
      case "liked":
        return arr.sort((a, b) => b.likes - a.likes);
      case "quick":
        return arr.sort((a, b) => totalMinutes(a) - totalMinutes(b));
      default:
        return arr.sort(
          (a, b) =>
            new Date(b.publishedDate ?? 0).getTime() -
            new Date(a.publishedDate ?? 0).getTime()
        );
    }
  }, [articles, filters, category, sortBy]);

  const shown = results.slice(0, visible);

  return (
    <div className="container-page py-10 lg:py-14">
      {/* Header */}
      <header className="mb-8">
        <span className="eyebrow">Discover</span>
        <h1 className="mt-3 font-display text-4xl font-semibold text-sand-950 sm:text-5xl">
          All recipes
        </h1>
        <p className="mt-2 text-sand-600">
          Search the whole collection, then filter and sort to find your next
          cook.
        </p>
      </header>

      {/* Category pills */}
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          onClick={() => setCategory(null)}
          className={cn("chip", category === null && "chip-active")}
        >
          All
        </button>
        {CATEGORY_OPTIONS.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(category === c ? null : c)}
            className={cn("chip", category === c && "chip-active")}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Filters */}
      <RecipeFilters value={filters} onChange={setFilters} />

      {/* Result count + sort */}
      <div className="mb-6 mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-sand-500">
          {loading
            ? "Loading recipes…"
            : `${results.length} ${results.length === 1 ? "recipe" : "recipes"}`}
        </p>
        <label className="flex items-center gap-2 text-sm text-sand-600">
          Sort by
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="h-10 rounded-xl border border-sand-300 bg-white px-3 text-sm font-medium text-sand-800 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Grid */}
      {loading && results.length === 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      ) : results.length === 0 ? (
        <EmptyState
          icon={<MagnifyingGlassIcon className="h-8 w-8" />}
          title="No recipes match your filters"
          description="Try a different search, clear a filter, or explore another category."
          action={
            <Link href="/articles" className={buttonVariants({ variant: "outline" })}>
              Share your own recipe
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {shown.map((recipe, i) => (
              <RecipeCard key={recipe.id} recipe={recipe} index={i} />
            ))}
          </div>
          {visible < results.length && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                Load more recipes
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Recipes;
