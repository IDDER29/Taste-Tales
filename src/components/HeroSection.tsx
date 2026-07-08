"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MagnifyingGlassIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useAppSelector } from "../app/hooks";
import { selectAllArticles } from "../features/article/articleSlice";

interface HeroSectionProps {
  // Called when the hero search is submitted (Home wires this to the filters).
  onSearch?: (query: string) => void;
}

const QUICK_TAGS = ["Breakfast", "Pasta", "Vegan", "30 min", "Dessert"];

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const articles = useAppSelector(selectAllArticles);

  const recipeCount = articles.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  const quickSearch = (term: string) => {
    setQuery(term);
    onSearch?.(term);
  };

  return (
    <section className="relative overflow-hidden bg-hero-mesh">
      {/* Soft grain / gradient wash */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-[rgb(var(--surface))]" />
      {/* Floating food photos on wide screens */}
      <div className="pointer-events-none absolute -right-10 top-16 hidden h-64 w-64 rotate-6 overflow-hidden rounded-4xl border-8 border-white shadow-lift lg:block xl:right-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=70"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
      <div className="pointer-events-none absolute right-40 top-72 hidden h-40 w-40 -rotate-6 overflow-hidden rounded-3xl border-8 border-white shadow-lift xl:block animate-float">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=400&q=70"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>

      <div className="container-page relative py-20 sm:py-28 lg:py-32">
        <div className="max-w-2xl">
          <span className="eyebrow animate-fade-up">
            <SparklesIcon className="h-4 w-4" />
            Fresh recipes from real home cooks
          </span>

          <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-sand-950 animate-fade-up sm:text-6xl lg:text-7xl">
            Where every flavor{" "}
            <span className="text-gradient">tells a story</span>
          </h1>

          <p
            className="mt-6 max-w-xl text-lg leading-relaxed text-sand-600 animate-fade-up"
            style={{ animationDelay: "80ms" }}
          >
            Discover, cook, and share recipes worth remembering. Search by
            ingredient, save your favorites, and turn what&apos;s in your pantry
            into your next great meal.
          </p>

          {/* Search */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 animate-fade-up"
            style={{ animationDelay: "140ms" }}
          >
            <div className="flex items-center gap-2 rounded-full border border-sand-200 bg-white p-2 shadow-card focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-500/15">
              <MagnifyingGlassIcon className="ml-3 h-5 w-5 flex-none text-sand-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search recipes, ingredients, or cuisines…"
                className="min-w-0 flex-1 bg-transparent px-1 py-2 text-base text-sand-950 placeholder:text-sand-400 focus:outline-none"
                aria-label="Search recipes"
              />
              <button
                type="submit"
                className="inline-flex flex-none items-center gap-1.5 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-700 hover:shadow-glow active:scale-[0.98]"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick tags */}
          <div
            className="mt-5 flex flex-wrap items-center gap-2 animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            <span className="text-sm text-sand-500">Popular:</span>
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => quickSearch(tag)}
                className="chip hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div
            className="mt-10 flex items-center gap-8 animate-fade-up"
            style={{ animationDelay: "260ms" }}
          >
            <div>
              <p className="font-display text-2xl font-semibold text-sand-950">
                {recipeCount > 0 ? `${recipeCount}+` : "500+"}
              </p>
              <p className="text-sm text-sand-500">Recipes</p>
            </div>
            <div className="h-10 w-px bg-sand-200" />
            <div>
              <p className="font-display text-2xl font-semibold text-sand-950">
                12k+
              </p>
              <p className="text-sm text-sand-500">Home cooks</p>
            </div>
            <div className="h-10 w-px bg-sand-200" />
            <div>
              <Link
                href="/cook"
                className="inline-flex items-center gap-1.5 font-display text-2xl font-semibold text-brand-600 transition-colors hover:text-brand-700"
              >
                AI
              </Link>
              <p className="text-sm text-sand-500">Pantry chef</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
