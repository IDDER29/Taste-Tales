"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaEye,
  FaHeart,
  FaPenToSquare,
  FaTrash,
  FaShareNodes,
} from "react-icons/fa6";
import { hasStructuredRecipe, averageRating } from "../utils/recipe";
import { sanitizeHtml } from "../utils/sanitize";
import { useAppSelector } from "../app/hooks";
import { selectReviewsForBlog } from "../features/review/reviewSlice";
import RecipeDetails from "./RecipeDetails";
import SaveButton from "./SaveButton";
import ReportButton from "./ReportButton";
import StarRating from "./StarRating";
import { AppImage } from "./ui/AppImage";
import { Avatar } from "./ui/Avatar";
import { useConfirm, useToast } from "./ui";
import { cn } from "../utils/cn";
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
  const { toast } = useToast();
  const reviews = useAppSelector(selectReviewsForBlog(articleData.id));
  const rating = averageRating(reviews);

  const handleEdit = () => router.push(`/edit-article/${articleData.id}`);

  const handleDelete = async () => {
    const ok = await confirm({
      title: "Delete this recipe?",
      description: "This can't be undone.",
      confirmLabel: "Delete",
      danger: true,
    });
    if (ok) onDelete(articleData.id);
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: articleData.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast({ title: "Link copied to clipboard", variant: "success" });
      }
    } catch {
      /* user cancelled share */
    }
  };

  const structured = hasStructuredRecipe(
    articleData as unknown as Parameters<typeof hasStructuredRecipe>[0]
  );

  return (
    <article className="overflow-hidden rounded-3xl border border-sand-200/70 bg-white shadow-card">
      {/* Header */}
      <header className="px-6 pt-8 sm:px-10 sm:pt-10">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
          {articleData.category && (
            <span className="rounded-full bg-brand-50 px-3 py-1 font-semibold text-brand-700">
              {articleData.category}
            </span>
          )}
          {articleData.cuisine && (
            <span className="rounded-full bg-sand-100 px-3 py-1 text-sand-700">
              {articleData.cuisine}
            </span>
          )}
        </div>

        <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-sand-950 sm:text-5xl">
          {articleData.title}
        </h1>
        {articleData.subtitle && (
          <p className="mt-3 text-lg text-sand-600">{articleData.subtitle}</p>
        )}

        {/* Author + rating + actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-sand-100 pb-6">
          {(() => {
            const inner = (
              <>
                <Avatar
                  name={articleData.publisher?.name}
                  src={articleData.publisher?.image}
                  size="md"
                />
                <div>
                  <p className="font-semibold text-sand-900 transition-colors group-hover:text-brand-700">
                    {articleData.publisher?.name}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-sand-500">
                    <span>{articleData.publishedDate}</span>
                    {rating.count > 0 && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-sand-300" />
                        <span className="inline-flex items-center gap-1">
                          <StarRating value={rating.value} size="text-sm" />
                          {rating.value}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </>
            );
            return articleData.authorId ? (
              <Link
                href={`/chefs/${articleData.authorId}`}
                className="group flex items-center gap-3"
              >
                {inner}
              </Link>
            ) : (
              <div className="flex items-center gap-3">{inner}</div>
            );
          })()}

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-sand-300 px-4 text-sm font-semibold text-sand-800 transition-colors hover:bg-sand-50"
            >
              <FaShareNodes className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <SaveButton
              id={articleData.id}
              className="h-10 w-10 border border-sand-200 !bg-white shadow-none hover:!bg-sand-50"
            />
          </div>
        </div>
      </header>

      {/* Hero image */}
      <figure className="px-6 pt-6 sm:px-10">
        <AppImage
          src={articleData.imageUrl}
          alt={articleData.title}
          ratio="aspect-[16/10]"
          wrapperClassName="rounded-2xl shadow-soft"
          className="object-cover"
        />
        <figcaption className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-sand-500">
          <span className="inline-flex items-center gap-1.5">
            <FaEye className="h-4 w-4 text-sand-400" />
            {articleData.views} views
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FaHeart className="h-4 w-4 text-brand-400" />
            {articleData.likes} likes
          </span>
          <span className="ml-auto">
            <ReportButton recipeId={articleData.id} hidden={canManage} />
          </span>
        </figcaption>
      </figure>

      {/* Body */}
      <div className="px-6 py-8 sm:px-10">
        {articleData.content && (
          <section className="prose prose-lg max-w-none text-sand-800">
            <div
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(articleData.content),
              }}
            />
          </section>
        )}

        {structured && <RecipeDetails article={articleData} />}

        {canManage && (
          <footer className="mt-8 flex justify-end gap-3 border-t border-sand-100 pt-6">
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-2 rounded-full border border-sand-300 px-5 py-2.5 text-sm font-semibold text-sand-800 transition-colors hover:bg-sand-50"
            >
              <FaPenToSquare className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className={cn(
                "inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-red-700"
              )}
            >
              <FaTrash className="h-4 w-4" />
              Delete
            </button>
          </footer>
        )}
      </div>
    </article>
  );
};

export default ArticleHeader;
