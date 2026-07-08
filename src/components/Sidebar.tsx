"use client";

import React from "react";
import Link from "next/link";
import { SparklesIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { useAppSelector } from "../app/hooks";
import {
  selectAllArticles,
  selectTopArticlesByViews,
} from "../features/article/articleSlice";
import { AppImage } from "./ui/AppImage";
import { formatMinutes, totalMinutes } from "../utils/recipe";
import type { Article } from "../types";

function MiniList({ title, items }: { title: string; items: Article[] }) {
  if (!items.length) return null;
  return (
    <div className="rounded-2xl border border-sand-200/70 bg-white p-5 shadow-soft">
      <h2 className="font-display text-lg font-semibold text-sand-950">{title}</h2>
      <ul className="mt-4 space-y-4">
        {items.map((article) => {
          const time = formatMinutes(totalMinutes(article));
          return (
            <li key={article.id}>
              <Link
                href={`/articles/${article.id}`}
                className="group flex items-center gap-3"
              >
                <div className="relative aspect-square h-14 w-14 flex-none overflow-hidden rounded-xl">
                  <AppImage
                    src={article.imageUrl}
                    alt={article.title}
                    ratio=""
                    wrapperClassName="absolute inset-0 h-full w-full"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-semibold text-sand-900 group-hover:text-brand-700">
                    {article.title}
                  </p>
                  <p className="mt-0.5 text-xs text-sand-500">
                    {time || article.category}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

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
    <div className="space-y-6 lg:sticky lg:top-24">
      {/* Cook CTA */}
      <Link
        href="/cook"
        className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-accent-500 p-5 text-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
      >
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-xl" />
        <span className="relative flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-white/15 backdrop-blur">
          <SparklesIcon className="h-6 w-6" />
        </span>
        <div className="relative">
          <p className="font-semibold">Cook from your pantry</p>
          <p className="text-xs text-white/85">Got ingredients? Find a recipe.</p>
        </div>
        <ArrowRightIcon className="relative ml-auto h-5 w-5 transition-transform group-hover:translate-x-1" />
      </Link>

      <MiniList title="Most popular" items={topArticles.slice(0, 4)} />
      <MiniList title="Recently published" items={recent} />
    </div>
  );
};

export default Sidebar;
