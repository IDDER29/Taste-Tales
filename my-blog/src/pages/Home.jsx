import React from "react";
import RecipeBlog from "../components/RecipeBlogs";
import TrendyRecipes from "../components/TrendyRecipes";
import Categories from "../components/Categories";
import TopCategoryRecipes from "../components/TopCategoryRecipes";
import Subscription from "../components/Subscription";

function Home({ articles, selectedCategory, setSelectedCategory }) {
  const filteredArticles = selectedCategory
    ? articles.filter((article) => article.category === selectedCategory)
    : articles;
  const filteredArticlesByViews = articles
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  return (
    <>
      <RecipeBlog articles={filteredArticlesByViews} />
      <TrendyRecipes articles={filteredArticlesByViews} />
      <Categories
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <TopCategoryRecipes recipes={filteredArticles} />
      <Subscription />
    </>
  );
}

export default Home;
