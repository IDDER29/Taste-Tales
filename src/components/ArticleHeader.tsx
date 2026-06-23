"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaHeart, FaTag } from "react-icons/fa";
import { hasStructuredRecipe } from "../utils/recipe";
import { sanitizeHtml } from "../utils/sanitize";
import RecipeDetails from "./RecipeDetails";
import SaveButton from "./SaveButton";
import ReportButton from "./ReportButton";
import { useConfirm } from "./ui";
import type { Article } from "../types";

interface ArticleHeaderProps {
  articleData: Article;
  onDelete: (id: string) => void;
  // Whether the current user may edit/delete this recipe (owner or admin).
  canManage?: boolean;
}

const ArticleHeader = ({
  articleData,
  onDelete,
  canManage = false,
}: ArticleHeaderProps) => {
  const router = useRouter();
  const confirm = useConfirm();

  const handleEdit = () => {
    router.push(`/edit-article/${articleData.id}`);
  };

  const handleDelete = async () => {
    const ok = await confirm({
      title: "Delete this recipe?",
      description: "This can't be undone.",
      confirmLabel: "Delete",
      danger: true,
    });
    if (ok) onDelete(articleData.id);
  };

  return (
    <article className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <header className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-4xl font-extrabold text-gray-900">
            {articleData.title}
          </h1>
          <SaveButton id={articleData.id} className="shrink-0" />
        </div>
        <p className="text-xl text-gray-700 mb-4">{articleData.subtitle}</p>
        <div className="flex justify-center items-center space-x-3 text-sm text-gray-600">
          <img
            src={articleData.publisher.image}
            alt={articleData.publisher.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p>{articleData.publisher.name}</p>
            <p className="text-xs text-gray-500">{articleData.publishedDate}</p>
          </div>
        </div>
      </header>

      <figure className="mb-8">
        <img
          src={articleData.imageUrl}
          alt={articleData.title}
          className="w-full h-auto rounded-lg shadow-md"
        />
      </figure>

      <section className="mb-8">
        <div className="flex justify-center space-x-6 text-sm text-gray-600">
          <span className="flex items-center space-x-2">
            <FaEye className="w-5 h-5 text-blue-500" />
            <span>{articleData.views} Views</span>
          </span>
          <span className="flex items-center space-x-2">
            <FaHeart className="w-5 h-5 text-red-500" />
            <span>{articleData.likes} Likes</span>
          </span>
          <span className="flex items-center space-x-2">
            <FaTag className="w-5 h-5 text-green-500" />
            <span>{articleData.category}</span>
          </span>
        </div>
      </section>

      <div className="flex justify-end mb-4">
        <ReportButton recipeId={articleData.id} hidden={canManage} />
      </div>

      {hasStructuredRecipe(
        articleData as unknown as Parameters<typeof hasStructuredRecipe>[0]
      ) ? (
        <>
          {articleData.content && (
            <section className="prose lg:prose-xl prose-blue mb-8 text-left">
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(articleData.content),
                }}
                className="text-lg leading-relaxed"
              ></div>
            </section>
          )}
          <RecipeDetails article={articleData} />
        </>
      ) : (
        <section className="prose lg:prose-xl prose-blue mb-8 text-left">
          <div
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(articleData.content),
            }}
            className="text-lg leading-relaxed"
          ></div>
        </section>
      )}

      {canManage && (
        <footer className="flex justify-end space-x-4">
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-indigo-500 text-white rounded-md shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
          >
            Delete
          </button>
        </footer>
      )}
    </article>
  );
};

export default ArticleHeader;
