"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  BookOpenIcon,
  FireIcon,
  EyeIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useAppSelector } from "../app/hooks";
import {
  selectAllArticles,
  selectArticlesStatus,
} from "../features/article/articleSlice";
import RecipeCard, { RecipeCardSkeleton } from "../components/RecipeCard";
import { Avatar } from "../components/ui/Avatar";
import { EmptyState } from "../components/ui/EmptyState";
import { buttonVariants } from "../components/ui/Button";

const ChefProfile = ({ id }: { id: string }) => {
  const articles = useAppSelector(selectAllArticles);
  const status = useAppSelector(selectArticlesStatus);
  const loading = status === "loading" || status === "idle";

  const recipes = useMemo(
    () =>
      [...articles]
        .filter((a) => a.authorId === id)
        .sort(
          (a, b) =>
            new Date(b.publishedDate ?? 0).getTime() -
            new Date(a.publishedDate ?? 0).getTime()
        ),
    [articles, id]
  );

  const chef = recipes[0]?.publisher;

  const stats = useMemo(() => {
    const likes = recipes.reduce((s, r) => s + (r.likes || 0), 0);
    const views = recipes.reduce((s, r) => s + (r.views || 0), 0);
    const cuisines = new Set(recipes.map((r) => r.cuisine).filter(Boolean));
    const dates = recipes
      .map((r) => (r.publishedDate ? new Date(r.publishedDate).getTime() : 0))
      .filter(Boolean);
    const since = dates.length
      ? new Date(Math.min(...dates)).getFullYear()
      : null;
    return { likes, views, cuisines: cuisines.size, since };
  }, [recipes]);

  // Still loading the article list.
  if (loading && recipes.length === 0) {
    return (
      <div className="container-page py-12">
        <div className="h-40 w-full animate-pulse rounded-3xl bg-sand-200/60" />
        <div className="-mt-12 ml-8 h-24 w-24 animate-pulse rounded-full border-4 border-[rgb(var(--surface))] bg-sand-200" />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Loaded, but no such chef.
  if (!chef) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-500">
          <MagnifyingGlassIcon className="h-8 w-8" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-semibold text-sand-950">
          Chef not found
        </h1>
        <p className="mt-2 max-w-md text-sand-600">
          We couldn&apos;t find a cook with any published recipes here.
        </p>
        <Link href="/recipes" className={`mt-6 ${buttonVariants({})}`}>
          Browse recipes
        </Link>
      </div>
    );
  }

  const STAT_ITEMS = [
    { icon: BookOpenIcon, value: recipes.length, label: recipes.length === 1 ? "Recipe" : "Recipes" },
    { icon: FireIcon, value: stats.likes.toLocaleString(), label: "Likes" },
    { icon: EyeIcon, value: stats.views.toLocaleString(), label: "Views" },
    { icon: GlobeAltIcon, value: stats.cuisines, label: stats.cuisines === 1 ? "Cuisine" : "Cuisines" },
  ];

  return (
    <div className="container-page py-8 lg:py-12">
      {/* Banner + identity */}
      <div className="overflow-hidden rounded-3xl border border-sand-200/70 bg-white shadow-card">
        <div className="relative h-40 bg-gradient-to-br from-brand-600 to-accent-500 sm:h-52">
          <div className="pointer-events-none absolute inset-0 bg-hero-mesh opacity-60" />
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
        </div>

        <div className="relative px-6 pb-6 sm:px-10 sm:pb-8">
          <div className="-mt-14 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
              <Avatar
                name={chef.name}
                src={chef.image}
                size="lg"
                className="h-24 w-24 border-4 border-white text-2xl shadow-lift sm:h-28 sm:w-28"
              />
              <div className="pb-1">
                <h1 className="font-display text-3xl font-semibold text-sand-950 sm:text-4xl">
                  {chef.name}
                </h1>
                <p className="mt-1 text-sand-600">
                  Home cook sharing {recipes.length}{" "}
                  {recipes.length === 1 ? "recipe" : "recipes"} the community
                  loves{stats.since ? ` · since ${stats.since}` : ""}.
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STAT_ITEMS.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-3 rounded-2xl border border-sand-200/70 bg-sand-50/60 px-4 py-3"
              >
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <s.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-xl font-semibold text-sand-950">
                    {s.value}
                  </p>
                  <p className="text-xs text-sand-500">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Their recipes */}
      <section className="mt-12">
        <div className="mb-6">
          <span className="eyebrow">Their kitchen</span>
          <h2 className="section-title mt-2">
            Recipes by {chef.name.split(" ")[0]}
          </h2>
        </div>
        {recipes.length === 0 ? (
          <EmptyState title="No recipes yet" description="This cook hasn't published anything." />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recipes.map((r, i) => (
              <RecipeCard key={r.id} recipe={r} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ChefProfile;
