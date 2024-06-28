import React from "react";
import RecipeBlog from "../components/RecipeBlogs";
import TrendyRecipes from "../components/TrendyRecipes";
import Categories from "../components/Categories";
import TopCategoryRecipes from "../components/TopCategoryRecipes";
import Subscription from "../components/Subscription";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <RecipeBlog />
      <TrendyRecipes />
      <Categories />
      <TopCategoryRecipes />
      <Subscription />
    </>
  );
}

export default Home;
