import React from "react";
import RecipeBlog from "../components/RecipeBlogs";
import TrendyRecipes from "../components/TrendyRecipes";
import Categories from "../components/Categories";
import TopCategoryRecipes from "../components/TopCategoryRecipes";
import Subscription from "../components/Subscription";

function Home({ articles }) {
  return (
    <>
      <RecipeBlog />
      <TrendyRecipes />
      <Categories />
      <TopCategoryRecipes recipes={articles} />
      <Subscription />
    </>
  );
}

export default Home;
