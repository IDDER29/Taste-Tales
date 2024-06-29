import React from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegBookmark } from "react-icons/fa";

const TopCategoryRecipes = ({ recipes }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-4xl font-bold text-gray-800 mb-6">
        <span className="text-red-500">Top</span> Category Recipes
      </h2>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {recipes.map((recipe) => (
          <Link to={`/view-article/${recipe.id}`} key={recipe.id}>
            <div className="relative rounded-lg shadow-lg overflow-hidden">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-700">
                  {recipe.subtitle}
                </h3>
                <h2 className="text-xl font-bold text-gray-900">
                  {recipe.title}
                </h2>
                <div className="flex items-center mt-2">
                  <FaHeart className="text-red-500 mr-2" />
                  <span>{recipe.likes}</span>
                  <FaRegBookmark className="ml-4 text-gray-600" />
                </div>
                <div className="mt-2 text-gray-600 text-sm">
                  Views: {recipe.views}
                </div>
                <div className="mt-2 text-gray-600 text-sm">
                  Category: {recipe.category}
                </div>
                <div className="mt-2 text-gray-600 text-sm">
                  Published on: {recipe.publishedDate}
                </div>
                <div className="flex items-center mt-4">
                  <img
                    src={recipe.publisher.image}
                    alt={recipe.publisher.name}
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div className="text-gray-800 font-semibold">
                    {recipe.publisher.name}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopCategoryRecipes;
