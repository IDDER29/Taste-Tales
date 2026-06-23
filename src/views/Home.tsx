"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { FaMagic, FaBookmark } from "react-icons/fa";
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
    document
      .getElementById("browse")
      ?.scrollIntoView({ behavior: "smooth" });
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
      <TrendyRecipes />

      {/* Surface the flagship features */}
      <div className="grid gap-6 sm:grid-cols-2 p-6">
        <Link
          href="/cook"
          className="group flex items-center gap-4 rounded-lg bg-gradient-to-r from-red-500 to-orange-400 p-6 text-white shadow-md hover:shadow-lg transition-shadow"
        >
          <FaMagic className="h-8 w-8 flex-none" />
          <div>
            <h3 className="text-xl font-bold">Cook From Your Pantry</h3>
            <p className="text-sm opacity-90">
              Tell us what you have — find matches or generate a new recipe with AI.
            </p>
          </div>
        </Link>
        <Link
          href="/saved"
          className="group flex items-center gap-4 rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition-shadow"
        >
          <FaBookmark className="h-8 w-8 flex-none text-red-500" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">Your Recipe Box</h3>
            <p className="text-sm text-gray-600">
              Every recipe you save, kept in one place for later.
            </p>
          </div>
        </Link>
      </div>

      <Categories
        selectedCategory={selectedCategory}
        setSelectedCategory={handleCategoryChange}
      />
      <div id="browse">
        <RecipeFilters value={filters} onChange={setFilters} />
        <TopCategoryRecipes recipes={filteredArticles} />
      </div>
      <Subscription />
    </>
  );
}

export default Home;
