import React from "react";
import { useSelector, useDispatch } from "react-redux";
import RecipeBlog from "../components/RecipeBlogs";
import TrendyRecipes from "../components/TrendyRecipes";
import Categories from "../components/Categories";
import TopCategoryRecipes from "../components/TopCategoryRecipes";
import Subscription from "../components/Subscription";
import {
  setSelectedCategory,
  selectSelectedCategory,
  selectArticlesByLatest,
} from "../features/article/articleSlice";

function Home() {
  const selectedCategory = useSelector(selectSelectedCategory);
  const filteredArticles = useSelector(selectArticlesByLatest);
  const dispatch = useDispatch();

  const handleCategoryChange = (category) => {
    dispatch(setSelectedCategory(category));
  };

  return (
    <>
      <RecipeBlog />
      <TrendyRecipes />
      <Categories
        selectedCategory={selectedCategory}
        setSelectedCategory={handleCategoryChange}
      />
      <TopCategoryRecipes recipes={filteredArticles} />
      <Subscription />
    </>
  );
}

export default Home;
