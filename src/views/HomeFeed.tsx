"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  PlusIcon,
  SparklesIcon,
  BookmarkIcon,
  ArrowRightIcon,
  FireIcon,
} from "@heroicons/react/24/outline";
import { useAppSelector } from "../app/hooks";
import {
  selectAllArticles,
  selectTopArticlesByViews,
} from "../features/article/articleSlice";
import { selectSavedIds, selectSavedItems } from "../features/saved/savedSlice";
import RecipeCard from "../components/RecipeCard";
import CategoryStrip from "../components/CategoryStrip";
import { buttonVariants } from "../components/ui/Button";
import { cn } from "../utils/cn";
import type { Article } from "../types";

function SectionHeader({
  eyebrow,
  title,
  href,
  linkLabel = "See all",
  icon,
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  linkLabel?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <span className="eyebrow">
            {icon}
            {eyebrow}
          </span>
        )}
        <h2 className="section-title mt-2">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex flex-none items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          {linkLabel}
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

const QUICK_ACTIONS = [
  {
    href: "/articles",
    icon: PlusIcon,
    title: "Share a recipe",
    desc: "Publish your own tale",
    accent: true,
  },
  {
    href: "/cook",
    icon: SparklesIcon,
    title: "Cook from pantry",
    desc: "Turn ingredients into dinner",
  },
  {
    href: "/saved",
    icon: BookmarkIcon,
    title: "Recipe box",
    desc: "Your saved recipes",
  },
];

const HomeFeed: React.FC = () => {
  const { data: session } = useSession();
  const articles = useAppSelector(selectAllArticles);
  const topByViews = useAppSelector(selectTopArticlesByViews);
  const savedIds = useAppSelector(selectSavedIds);
  const savedItems = useAppSelector(selectSavedItems);

  const firstName = (session?.user?.name || "there").split(" ")[0];

  const recent = useMemo(
    () =>
      [...articles]
        .sort(
          (a, b) =>
            new Date(b.publishedDate ?? 0).getTime() -
            new Date(a.publishedDate ?? 0).getTime()
        )
        .slice(0, 8),
    [articles]
  );

  const saved = useMemo<Article[]>(() => {
    if (savedItems.length) return savedItems.slice(0, 4);
    const byId = new Map(articles.map((a) => [a.id, a]));
    return savedIds
      .map((id) => byId.get(id))
      .filter((a): a is Article => Boolean(a))
      .slice(0, 4);
  }, [savedItems, savedIds, articles]);

  const mine = useMemo(
    () =>
      session?.user?.id
        ? articles.filter((a) => a.authorId === session.user!.id).slice(0, 4)
        : [],
    [articles, session]
  );

  return (
    <div className="container-page py-10 lg:py-14">
      {/* Welcome */}
      <header className="mb-10">
        <span className="eyebrow">Welcome back</span>
        <h1 className="mt-3 font-display text-4xl font-semibold text-sand-950 sm:text-5xl">
          Hi {firstName} 👋
        </h1>
        <p className="mt-2 text-sand-600">Here&apos;s what&apos;s cooking today.</p>
      </header>

      {/* Quick actions */}
      <div className="mb-14 grid gap-4 sm:grid-cols-3">
        {QUICK_ACTIONS.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className={cn(
              "group flex items-center gap-4 rounded-2xl border p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card",
              a.accent
                ? "border-transparent bg-gradient-to-br from-brand-600 to-accent-500 text-white"
                : "border-sand-200/70 bg-white"
            )}
          >
            <span
              className={cn(
                "flex h-12 w-12 flex-none items-center justify-center rounded-xl",
                a.accent ? "bg-white/15 text-white" : "bg-brand-50 text-brand-600"
              )}
            >
              <a.icon className="h-6 w-6" />
            </span>
            <div>
              <p
                className={cn(
                  "font-semibold",
                  a.accent ? "text-white" : "text-sand-950"
                )}
              >
                {a.title}
              </p>
              <p className={cn("text-sm", a.accent ? "text-white/85" : "text-sand-500")}>
                {a.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Your recipe box */}
      <section className="mb-16">
        <SectionHeader
          eyebrow="Your collection"
          title="From your recipe box"
          href="/saved"
          icon={<BookmarkIcon className="h-4 w-4" />}
        />
        {saved.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {saved.map((r, i) => (
              <RecipeCard key={r.id} recipe={r} index={i} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-sand-300 bg-sand-50/50 p-10 text-center">
            <BookmarkIcon className="mx-auto h-9 w-9 text-sand-300" />
            <p className="mt-3 text-sand-600">
              You haven&apos;t saved any recipes yet.
            </p>
            <Link
              href="/recipes"
              className={cn("mt-4", buttonVariants({ variant: "outline" }))}
            >
              Find recipes to save
            </Link>
          </div>
        )}
      </section>

      {/* Popular */}
      {topByViews.length > 0 && (
        <section className="mb-16">
          <SectionHeader
            eyebrow="Trending now"
            title="Popular right now"
            href="/recipes"
            icon={<FireIcon className="h-4 w-4" />}
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {topByViews.slice(0, 4).map((r, i) => (
              <RecipeCard key={r.id} recipe={r} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Fresh */}
      {recent.length > 0 && (
        <section className="mb-16">
          <SectionHeader eyebrow="Just added" title="Fresh this week" href="/recipes" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recent.slice(0, 4).map((r, i) => (
              <RecipeCard key={r.id} recipe={r} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Your recipes */}
      <section className="mb-4">
        <SectionHeader
          eyebrow="Your kitchen"
          title="Recipes you've shared"
          href={mine.length ? "/articles" : undefined}
          linkLabel="Share another"
        />
        {mine.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {mine.map((r, i) => (
              <RecipeCard key={r.id} recipe={r} index={i} />
            ))}
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-3xl bg-sand-950 p-10 text-center text-white">
            <div className="pointer-events-none absolute inset-0 bg-hero-mesh opacity-50" />
            <div className="relative mx-auto max-w-md">
              <h3 className="font-display text-2xl font-semibold">
                Share your first recipe
              </h3>
              <p className="mt-2 text-white/75">
                Turn a family favorite into a beautiful, structured tale the whole
                community can cook from.
              </p>
              <Link
                href="/articles"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 font-semibold text-white shadow-glow transition-all hover:bg-brand-600 active:scale-[0.98]"
              >
                <PlusIcon className="h-5 w-5" />
                Share a recipe
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Categories */}
      <CategoryStrip />
    </div>
  );
};

export default HomeFeed;
