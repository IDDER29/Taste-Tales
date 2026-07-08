"use client";

import React from "react";
import Link from "next/link";
import { ArrowRightIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useAppSelector } from "../app/hooks";
import { selectTopArticlesByViews } from "../features/article/articleSlice";
import { formatMinutes, totalMinutes } from "../utils/recipe";
import { AppImage } from "./ui/AppImage";
import { Avatar } from "./ui/Avatar";

const RecipeBlog: React.FC = () => {
  const topArticles = useAppSelector(selectTopArticlesByViews);
  if (!topArticles.length) return null;

  const [hero, ...rest] = topArticles;
  const secondary = rest.slice(0, 3);
  const heroTime = formatMinutes(totalMinutes(hero));

  return (
    <section className="container-page py-16 sm:py-20">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="eyebrow">Editor&apos;s picks</span>
          <h2 className="section-title mt-3">Featured this week</h2>
        </div>
        <Link
          href="/#browse"
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          Browse all recipes
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Hero feature */}
        <Link
          href={`/articles/${hero.id}`}
          className="group relative flex min-h-[24rem] flex-col justify-end overflow-hidden rounded-3xl shadow-card"
        >
          <AppImage
            src={hero.imageUrl}
            alt={hero.title}
            ratio=""
            wrapperClassName="absolute inset-0 h-full w-full"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sand-950/90 via-sand-950/30 to-transparent" />
          <div className="relative p-7 text-white">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
              {hero.category && (
                <span className="rounded-full bg-brand-600 px-2.5 py-1">
                  {hero.category}
                </span>
              )}
              {heroTime && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 backdrop-blur">
                  <ClockIcon className="h-3.5 w-3.5" />
                  {heroTime}
                </span>
              )}
            </div>
            <h3 className="mt-4 font-display text-3xl font-semibold leading-tight">
              {hero.title}
            </h3>
            {hero.subtitle && (
              <p className="mt-2 max-w-lg text-white/80 line-clamp-2">
                {hero.subtitle}
              </p>
            )}
            <div className="mt-5 flex items-center gap-2.5">
              <Avatar name={hero.publisher?.name} src={hero.publisher?.image} size="sm" />
              <span className="text-sm font-medium text-white/90">
                {hero.publisher?.name}
              </span>
            </div>
          </div>
        </Link>

        {/* Secondary list */}
        <div className="flex flex-col gap-5">
          {secondary.map((article) => {
            const time = formatMinutes(totalMinutes(article));
            return (
              <Link
                key={article.id}
                href={`/articles/${article.id}`}
                className="group flex gap-4 overflow-hidden rounded-2xl border border-sand-200/70 bg-white p-3 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
              >
                <div className="relative aspect-square h-28 w-28 flex-none overflow-hidden rounded-xl">
                  <AppImage
                    src={article.imageUrl}
                    alt={article.title}
                    ratio=""
                    wrapperClassName="absolute inset-0 h-full w-full"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex min-w-0 flex-col justify-center py-1">
                  {article.category && (
                    <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                      {article.category}
                    </span>
                  )}
                  <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-sand-950 line-clamp-2 group-hover:text-brand-700">
                    {article.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-3 text-xs text-sand-500">
                    <span>{article.publisher?.name}</span>
                    {time && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-sand-300" />
                        <span className="inline-flex items-center gap-1">
                          <ClockIcon className="h-3.5 w-3.5" />
                          {time}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RecipeBlog;
