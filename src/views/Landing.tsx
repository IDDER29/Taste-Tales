"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlassIcon,
  SparklesIcon,
  BookmarkIcon,
  ArrowRightIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import HeroSection from "../components/HeroSection";
import RecipeBlog from "../components/RecipeBlogs";
import TrendyRecipes from "../components/TrendyRecipes";
import CategoryStrip from "../components/CategoryStrip";
import Subscription from "../components/Subscription";
import { buttonVariants } from "../components/ui/Button";

const STEPS = [
  {
    icon: MagnifyingGlassIcon,
    title: "Discover",
    body: "Search hundreds of structured recipes by ingredient, cuisine, diet, or time — and save the ones you love.",
  },
  {
    icon: SparklesIcon,
    title: "Cook",
    body: "Scale servings, tick off ingredients, and follow clean step-by-step instructions with cook mode on.",
  },
  {
    icon: BookmarkIcon,
    title: "Share",
    body: "Publish your own recipes as beautiful, structured tales the whole community can cook from.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Taste-Tales is the only recipe site I trust — every recipe just works, and the pantry tool saved dinner more than once.",
    name: "Priya N.",
    role: "Home cook",
  },
  {
    quote:
      "I finally have one place for all my recipes. Publishing my own felt effortless and they look gorgeous.",
    name: "Marcus D.",
    role: "Weekend baker",
  },
  {
    quote:
      "The serving scaler and cook mode are genius. It feels like it was designed by people who actually cook.",
    name: "Elena R.",
    role: "Food blogger",
  },
];

const Landing: React.FC = () => {
  const router = useRouter();

  const handleSearch = (query: string) => {
    const q = query.trim();
    router.push(q ? `/recipes?q=${encodeURIComponent(q)}` : "/recipes");
  };

  return (
    <>
      <HeroSection onSearch={handleSearch} />

      {/* How it works */}
      <section className="container-page py-16 sm:py-20">
        <div className="mb-12 text-center">
          <span className="eyebrow">How it works</span>
          <h2 className="section-title mt-3">From craving to cooking in minutes</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className="relative rounded-3xl border border-sand-200/70 bg-white p-8 shadow-soft"
            >
              <span className="absolute right-6 top-6 font-display text-5xl font-semibold text-sand-100">
                {i + 1}
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <s.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold text-sand-950">
                {s.title}
              </h3>
              <p className="mt-2 text-sand-600">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured teaser */}
      <RecipeBlog />

      {/* Category teaser (links into /recipes) */}
      <CategoryStrip />

      {/* Flagship features */}
      <section className="container-page py-4">
        <div className="grid gap-6 lg:grid-cols-2">
          <Link
            href="/cook"
            className="group relative flex items-center gap-5 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-accent-500 p-8 text-white shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <span className="relative flex h-16 w-16 flex-none items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <SparklesIcon className="h-8 w-8" />
            </span>
            <div className="relative">
              <h3 className="font-display text-2xl font-semibold">Cook from your pantry</h3>
              <p className="mt-1.5 text-white/85">
                Tell us what you have — we&apos;ll find matches or invent a new
                recipe with AI.
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold">
                Start cooking
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          <Link
            href="/saved"
            className="group relative flex items-center gap-5 overflow-hidden rounded-3xl border border-sand-200/70 bg-white p-8 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
          >
            <span className="relative flex h-16 w-16 flex-none items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <BookmarkIcon className="h-8 w-8" />
            </span>
            <div className="relative">
              <h3 className="font-display text-2xl font-semibold text-sand-950">
                Your recipe box
              </h3>
              <p className="mt-1.5 text-sand-600">
                Every recipe you save, kept in one tidy place for whenever
                you&apos;re ready to cook.
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                Open recipe box
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Popular teaser */}
      <TrendyRecipes />

      {/* Testimonials */}
      <section className="container-page py-16 sm:py-20">
        <div className="mb-12 text-center">
          <span className="eyebrow">
            <StarIcon className="h-4 w-4" />
            Loved by home cooks
          </span>
          <h2 className="section-title mt-3">Cooks can&apos;t stop raving</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-3xl border border-sand-200/70 bg-white p-7 shadow-soft"
            >
              <div className="flex gap-0.5 text-accent-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarSolid key={i} className="h-4 w-4" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sand-700">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-5 border-t border-sand-100 pt-4">
                <p className="font-semibold text-sand-900">{t.name}</p>
                <p className="text-sm text-sand-500">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Final CTA before newsletter */}
      <section className="container-page">
        <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-brand-600 to-accent-500 px-6 py-14 text-center text-white shadow-lift sm:px-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
          <div className="relative mx-auto max-w-xl">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              Ready to find your next favorite meal?
            </h2>
            <p className="mt-3 text-white/85">
              Join thousands of home cooks discovering and sharing recipes worth
              remembering.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/recipes"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 font-semibold text-brand-700 shadow-soft transition-all hover:shadow-lift active:scale-[0.98]"
              >
                Browse recipes
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3 font-semibold text-white transition-colors hover:bg-white/10"
              >
                Create free account
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Subscription />
    </>
  );
};

export default Landing;
