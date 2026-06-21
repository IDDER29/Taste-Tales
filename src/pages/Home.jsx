import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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

function Home() {
  const selectedCategory = useSelector(selectSelectedCategory);
  const articles = useSelector(selectAllArticles);
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({
    query: "",
    cuisine: "",
    diets: [],
    maxTime: null,
  });

  const handleCategoryChange = (category) => {
    dispatch(setSelectedCategory(category));
  };

  const filteredArticles = useMemo(() => {
    const latest = [...articles].sort(
      (a, b) => new Date(b.publishedDate) - new Date(a.publishedDate)
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
