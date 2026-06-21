import React from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegBookmark } from "react-icons/fa";
import { formatMinutes, totalMinutes } from "../utils/recipe";

const TopCategoryRecipes = ({ recipes }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-4xl font-bold text-gray-800 mb-6">
        <span className="text-red-500">Top</span> Category Recipes
      </h2>
      {recipes.length === 0 ? (
        <p className="text-gray-600 text-lg py-8 text-center">
          No recipes match your filters.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {recipes.map((recipe) => {
            const time = formatMinutes(totalMinutes(recipe));
            const diets = recipe.diet || [];
            return (
              <Link to={`/articles/${recipe.id}`} key={recipe.id}>
                <div className="relative rounded-lg shadow-lg overflow-hidden">
                  <img
                    src={recipe.imageUrl}
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
                    {(time || recipe.servings) && (
                      <div className="mt-2 text-gray-600 text-sm">
                        {time && <span>{time}</span>}
                        {time && recipe.servings && <span> &middot; </span>}
                        {recipe.servings && (
                          <span>{recipe.servings} servings</span>
                        )}
                      </div>
                    )}
                    {(recipe.cuisine || diets.length > 0) && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {recipe.cuisine && (
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs">
                            {recipe.cuisine}
                          </span>
                        )}
                        {diets.map((diet) => (
                          <span
                            key={diet}
                            className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-xs"
                          >
                            {diet}
                          </span>
                        ))}
                      </div>
                    )}
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TopCategoryRecipes;
