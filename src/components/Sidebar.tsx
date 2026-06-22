import React from "react";
import { Link } from "react-router-dom";
import { FaMagic } from "react-icons/fa";
import { useAppSelector } from "../app/hooks";
import {
  selectAllArticles,
  selectTopArticlesByViews,
} from "../features/article/articleSlice";

const Sidebar: React.FC = () => {
  const topArticles = useAppSelector(selectTopArticlesByViews);
  const allArticles = useAppSelector(selectAllArticles);

  const recent = [...allArticles]
    .sort(
      (a, b) =>
        new Date(b.publishedDate ?? 0).getTime() -
        new Date(a.publishedDate ?? 0).getTime()
    )
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Cook CTA */}
      <Link
        to="/cook"
        className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-red-500 to-orange-400 p-4 text-white shadow-lg hover:shadow-xl transition-shadow"
      >
        <FaMagic className="h-6 w-6 flex-none" />
        <div>
          <p className="font-bold">Cook From Your Pantry</p>
          <p className="text-xs opacity-90">Got ingredients? Find a recipe.</p>
        </div>
      </Link>

      {/* Most popular */}
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Most Popular</h2>
        {topArticles.length === 0 ? (
          <p className="text-gray-500">No recipes yet.</p>
        ) : (
          <ul className="space-y-4">
            {topArticles.map((article) => (
              <li key={article.id}>
                <Link
                  to={`/articles/${article.id}`}
                  className="text-lg text-blue-500 hover:underline"
                >
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Recently published */}
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Recently Published</h2>
        {recent.length === 0 ? (
          <p className="text-gray-500">No recipes yet.</p>
        ) : (
          <ul className="space-y-4">
            {recent.map((article) => (
              <li key={article.id}>
                <Link
                  to={`/articles/${article.id}`}
                  className="text-lg text-blue-500 hover:underline"
                >
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
