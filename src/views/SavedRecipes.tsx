"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  selectSavedIds,
  selectSavedItems,
  fetchSaved,
} from "../features/saved/savedSlice";
import { selectAllArticles } from "../features/article/articleSlice";
import RecipeCard from "../components/RecipeCard";
import { EmptyState } from "../components/ui/EmptyState";
import { buttonVariants } from "../components/ui/Button";
import type { Article } from "../types";

// "My Recipe Box". Signed-in users read the server-synced list; guests resolve
// their localStorage ids against the loaded articles.
const SavedRecipes = () => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const savedIds = useAppSelector(selectSavedIds);
  const savedItems = useAppSelector(selectSavedItems);
  const articles = useAppSelector(selectAllArticles);

  useEffect(() => {
    if (session?.user) dispatch(fetchSaved());
  }, [session, dispatch]);

  let savedArticles: Article[];
  if (session?.user) {
    savedArticles = savedItems;
  } else {
    // Preserve save order; drop ids that don't resolve to a loaded article.
    const byId = new Map<string, Article>(
      articles.map((article) => [article.id, article])
    );
    savedArticles = savedIds
      .map((id) => byId.get(id))
      .filter((article): article is Article => Boolean(article));
  }

  return (
    <div className="container-page py-12 lg:py-16">
      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="eyebrow">
            <BookmarkIcon className="h-4 w-4" />
            Your collection
          </span>
          <h1 className="mt-3 font-display text-4xl font-semibold text-sand-950 sm:text-5xl">
            My recipe box
          </h1>
          <p className="mt-2 text-sand-600">
            {savedArticles.length > 0
              ? `${savedArticles.length} recipe${
                  savedArticles.length === 1 ? "" : "s"
                } saved for later.`
              : "Everything you save lives here."}
          </p>
        </div>
        {savedArticles.length > 0 && (
          <Link href="/recipes" className={buttonVariants({ variant: "outline" })}>
            Find more recipes
          </Link>
        )}
      </header>

      {savedArticles.length === 0 ? (
        <EmptyState
          icon={<BookmarkIcon className="h-8 w-8" />}
          title="No saved recipes yet"
          description="Tap the bookmark on any recipe to keep it here for whenever you're ready to cook."
          action={
            <Link href="/recipes" className={buttonVariants({})}>
              Browse recipes
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {savedArticles.map((article, i) => (
            <RecipeCard key={article.id} recipe={article} index={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedRecipes;
