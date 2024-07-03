import React, { useContext, createContext } from "react";
import RecipeBlog from "../components/RecipeBlogs";
import TrendyRecipes from "../components/TrendyRecipes";
import Categories from "../components/Categories";
import TopCategoryRecipes from "../components/TopCategoryRecipes";
import Subscription from "../components/Subscription";
export const FilteredArticlesByViewContext = createContext();
export const SelectedCategoryContext = createContext();

function Home({ articles, selectedCategory, setSelectedCategory }) {
  const sortedArticlesByLatestDate = [...articles].sort((a, b) => {
    return new Date(b.publishedDate) - new Date(a.publishedDate);
  });
  const filteredArticles = selectedCategory
    ? sortedArticlesByLatestDate.filter(
        (article) => article.category === selectedCategory
      )
    : sortedArticlesByLatestDate;
  const filteredArticlesByViews = articles
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);
  return (
    <>
      <FilteredArticlesByViewContext.Provider value={filteredArticlesByViews}>
        <RecipeBlog />
        <TrendyRecipes />
      </FilteredArticlesByViewContext.Provider>

      <SelectedCategoryContext.Provider value={filteredArticles}>
        <Categories
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <TopCategoryRecipes />
      </SelectedCategoryContext.Provider>

      <Subscription />
    </>
  );
}

export default Home;
