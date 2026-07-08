"use client";

import React from "react";
import Link from "next/link";
import { ArrowRightIcon, FireIcon } from "@heroicons/react/24/outline";
import { useAppSelector } from "../app/hooks";
import { selectTopArticlesByViews } from "../features/article/articleSlice";
import RecipeCard from "./RecipeCard";

const TrendyRecipes: React.FC = () => {
  const topArticles = useAppSelector(selectTopArticlesByViews);
  if (!topArticles.length) return null;

  return (
    <section className="bg-sand-100/60 py-16 sm:py-20">
      <div className="container-page">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="eyebrow">
              <FireIcon className="h-4 w-4" />
              Trending now
            </span>
            <h2 className="section-title mt-3">What everyone&apos;s cooking</h2>
          </div>
          <Link
            href="/recipes"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            See all
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topArticles.slice(0, 6).map((article, i) => (
            <RecipeCard key={article.id} recipe={article} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendyRecipes;
