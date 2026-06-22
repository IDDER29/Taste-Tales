import React from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectSavedIds } from "../features/saved/savedSlice";
import { selectAllArticles } from "../features/article/articleSlice";
import { formatMinutes, totalMinutes } from "../utils/recipe";
import SaveButton from "../components/SaveButton";
import type { Article } from "../types";

// "My Recipe Box" — the saved recipes the user has bookmarked. Driven entirely
// by the persisted saved id set intersected with the loaded articles.
const SavedRecipes = () => {
  const savedIds = useAppSelector(selectSavedIds);
  const articles = useAppSelector(selectAllArticles);

  // Preserve the order in which recipes were saved (savedIds order), and drop
  // any ids that no longer resolve to a loaded article.
  const byId = new Map<string, Article>(
    articles.map((article) => [article.id, article])
  );
  const savedArticles = savedIds
    .map((id) => byId.get(id))
    .filter((article): article is Article => Boolean(article));

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        My <span className="text-red-500">Recipe Box</span>
      </h1>

      {savedArticles.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 text-lg mb-6">
            You haven't saved any recipes yet.
          </p>
          <Link
            to="/"
            className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Browse recipes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedArticles.map((article) => {
            const total = totalMinutes(article);
            const meta = [
              total > 0 ? formatMinutes(total) : null,
              article.servings ? `${article.servings} servings` : null,
            ].filter(Boolean);

            return (
              <Link
                to={`/articles/${article.id}`}
                key={article.id}
                className="group bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
              >
                <div className="relative">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  <SaveButton id={article.id} className="absolute top-3 right-3" />
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h2 className="text-xl font-semibold text-gray-800 group-hover:text-red-500 transition-colors">
                    {article.title}
                  </h2>
                  {article.subtitle && (
                    <p className="text-gray-600 mt-1 line-clamp-2">
                      {article.subtitle}
                    </p>
                  )}

                  {meta.length > 0 && (
                    <p className="text-sm text-gray-500 mt-3">
                      {meta.join(" · ")}
                    </p>
                  )}

                  {article.publisher?.name && (
                    <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
                      {article.publisher.image && (
                        <img
                          src={article.publisher.image}
                          alt={article.publisher.name}
                          className="w-8 h-8 rounded-full object-cover mr-2"
                        />
                      )}
                      <span className="text-sm text-gray-700">
                        {article.publisher.name}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedRecipes;
