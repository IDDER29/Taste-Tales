// src/pages/Home.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import RecipeBlog from "../components/RecipeBlogs";
import TrendyRecipes from "../components/TrendyRecipes";
import Categories from "../components/Categories";
import TopCategoryRecipes from "../components/TopCategoryRecipes";
import Subscription from "../components/Subscription";
import { setSelectedCategory } from "../features/article/articleSlice";

function Home() {
  const articles = useSelector((state) => state.article.articles);
  const selectedCategory = useSelector(
    (state) => state.article.selectedCategory
  );
  const dispatch = useDispatch();

  // Create a new array before sorting to avoid mutating the original array
  const sortedArticlesByLatestDate = [...articles].sort((a, b) => {
    return new Date(b.publishedDate) - new Date(a.publishedDate);
  });

  // Filter the sorted articles
  const filteredArticles = selectedCategory
    ? sortedArticlesByLatestDate.filter(
        (article) => article.category === selectedCategory
      )
    : sortedArticlesByLatestDate;

  // Create a new array before sorting by views to avoid mutating the original array
  const filteredArticlesByViews = [...articles]
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  const handleCategoryChange = (category) => {
    dispatch(setSelectedCategory(category));
  };

  return (
    <>
      <RecipeBlog articles={filteredArticlesByViews} />
      <TrendyRecipes articles={filteredArticlesByViews} />
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
