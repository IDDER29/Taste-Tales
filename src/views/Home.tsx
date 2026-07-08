"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  SparklesIcon,
  BookmarkIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import HeroSection from "../components/HeroSection";
import RecipeBlog from "../components/RecipeBlogs";
import TrendyRecipes from "../components/TrendyRecipes";
import Categories from "../components/Categories";
import RecipeFilters from "../components/RecipeFilters";
import TopCategoryRecipes from "../components/TopCategoryRecipes";
import Subscription from "../components/Subscription";
import { filterRecipes } from "../utils/recipe";
import {
  setSelectedCategory,
  selectSelectedCategory,
  selectAllArticles,
} from "../features/article/articleSlice";
import type { FilterCriteria } from "../types";

function Home() {
  const selectedCategory = useAppSelector(selectSelectedCategory);
  const articles = useAppSelector(selectAllArticles);
  const dispatch = useAppDispatch();

  const [filters, setFilters] = useState<FilterCriteria>({
    query: "",
    cuisine: "",
    diets: [],
    maxTime: null,
  });

  const handleCategoryChange = (category: string | null) => {
    dispatch(setSelectedCategory(category));
  };

  // The hero search drives the same filter state as the filter bar.
  const handleHeroSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, query }));
    document.getElementById("browse")?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredArticles = useMemo(() => {
    const latest = [...articles].sort(
      (a, b) =>
        new Date(b.publishedDate ?? 0).getTime() -
        new Date(a.publishedDate ?? 0).getTime()
    );
    return filterRecipes(latest, { ...filters, category: selectedCategory });
  }, [articles, filters, selectedCategory]);

  return (
    <>
      <HeroSection onSearch={handleHeroSearch} />

      <RecipeBlog />

      <Categories
        selectedCategory={selectedCategory}
        setSelectedCategory={handleCategoryChange}
      />

      {/* Browse */}
      <section id="browse" className="container-page scroll-mt-24 py-16 sm:py-20">
        <div className="mb-6">
          <RecipeFilters value={filters} onChange={setFilters} />
        </div>
        <TopCategoryRecipes recipes={filteredArticles} />
      </section>

      {/* Flagship feature cards */}
      <section className="container-page py-4">
        <div className="grid gap-6 lg:grid-cols-2">
          <Link
            href="/cook"
            className="group relative flex items-center gap-5 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-accent-500 p-8 text-white shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <span className="relative flex h-16 w-16 flex-none items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <SparklesIcon className="h-8 w-8" />
            </span>
            <div className="relative">
              <h3 className="font-display text-2xl font-semibold">
                Cook from your pantry
              </h3>
              <p className="mt-1.5 text-white/85">
                Tell us what you have — we&apos;ll find matches or invent a new
                recipe with AI.
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold">
                Start cooking
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          <Link
            href="/saved"
            className="group relative flex items-center gap-5 overflow-hidden rounded-3xl border border-sand-200/70 bg-white p-8 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
          >
            <span className="relative flex h-16 w-16 flex-none items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <BookmarkIcon className="h-8 w-8" />
            </span>
            <div className="relative">
              <h3 className="font-display text-2xl font-semibold text-sand-950">
                Your recipe box
              </h3>
              <p className="mt-1.5 text-sand-600">
                Every recipe you save, kept in one tidy place for whenever
                you&apos;re ready to cook.
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                Open recipe box
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      <TrendyRecipes />

      <Subscription />
    </>
  );
}

export default Home;
