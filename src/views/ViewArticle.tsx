"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  HomeIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import ArticleHeader from "../components/ArticleHeader";
import Sidebar from "../components/Sidebar";
import RecipeJsonLd from "../components/RecipeJsonLd";
import Reviews from "../components/Reviews";
import { Skeleton } from "../components/ui/Skeleton";
import { buttonVariants } from "../components/ui/Button";
import {
  getArticleById,
  deleteAnArticle,
  selectArticleById,
  selectArticlesStatus,
} from "../features/article/articleSlice";
import { getReviews, selectReviewsForBlog } from "../features/review/reviewSlice";
import { averageRating } from "../utils/recipe";

function ArticleSkeleton() {
  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="rounded-3xl border border-sand-200/70 bg-white p-8 shadow-card">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="mt-4 h-10 w-3/4" />
          <Skeleton className="mt-3 h-5 w-1/2" />
          <Skeleton className="mt-6 aspect-[16/10] w-full rounded-2xl" />
          <div className="mt-6 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    </div>
  );
}

const ArticlePage = ({ id }: { id: string }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: session } = useSession();

  const article = useAppSelector(selectArticleById(id));
  const status = useAppSelector(selectArticlesStatus);
  const reviews = useAppSelector(selectReviewsForBlog(id));
  const rating = averageRating(reviews);

  useEffect(() => {
    if (!article) {
      dispatch(getArticleById(id));
    }
  }, [dispatch, id, article]);

  useEffect(() => {
    dispatch(getReviews(id));
  }, [dispatch, id]);

  const handleDelete = async () => {
    await dispatch(deleteAnArticle(id));
    router.push("/");
  };

  if (!article) {
    if (status === "loading" || status === "idle") {
      return <ArticleSkeleton />;
    }
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-500">
          <MagnifyingGlassIcon className="h-8 w-8" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-semibold text-sand-950">
          Recipe not found
        </h1>
        <p className="mt-2 max-w-md text-sand-600">
          The recipe you&apos;re looking for doesn&apos;t exist or could not be
          loaded.
        </p>
        <Link href="/" className={`mt-6 ${buttonVariants({})}`}>
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-8 lg:py-10">
      <RecipeJsonLd article={article} rating={rating} />

      {/* Breadcrumb */}
      <nav
        className="mb-6 flex items-center gap-1.5 text-sm text-sand-500"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="inline-flex items-center gap-1 hover:text-brand-600">
          <HomeIcon className="h-4 w-4" />
          Home
        </Link>
        <ChevronRightIcon className="h-4 w-4 text-sand-300" />
        <Link href="/#browse" className="hover:text-brand-600">
          Recipes
        </Link>
        <ChevronRightIcon className="h-4 w-4 text-sand-300" />
        <span className="truncate text-sand-700">{article.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <ArticleHeader
            articleData={article}
            onDelete={handleDelete}
            canManage={
              !!session?.user &&
              (session.user.id === article.authorId ||
                session.user.role === "ADMIN")
            }
          />
          <Reviews blogId={id} />
        </div>

        <div>
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
