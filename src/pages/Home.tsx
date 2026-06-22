import React, { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
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
      <RecipeBlog />
      <TrendyRecipes />
      <Categories
        selectedCategory={selectedCategory}
        setSelectedCategory={handleCategoryChange}
      />
      <RecipeFilters value={filters} onChange={setFilters} />
      <TopCategoryRecipes recipes={filteredArticles} />
      <Subscription />
    </>
  );
}

export default Home;
