"use client";

import React from "react";
import Link from "next/link";
import {
  Squares2X2Icon,
  MagnifyingGlassIcon,
  ScaleIcon,
  StarIcon,
  BookmarkIcon,
  SparklesIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { buttonVariants } from "../components/ui/Button";

const FEATURES = [
  {
    icon: Squares2X2Icon,
    title: "Structured recipes",
    body: "Real ingredients with quantities, numbered steps, prep & cook times, servings, and nutrition — not just a wall of text.",
  },
  {
    icon: MagnifyingGlassIcon,
    title: "Smart search & filters",
    body: "Find recipes by name or ingredient, and filter by cuisine, diet, and total time.",
  },
  {
    icon: ScaleIcon,
    title: "Serving scaler & cook mode",
    body: "Scale ingredients to any number of servings, tick off items as you go, and keep your screen awake while cooking.",
  },
  {
    icon: StarIcon,
    title: "Ratings & reviews",
    body: "Rate recipes and read what other cooks thought before you start.",
  },
  {
    icon: BookmarkIcon,
    title: "Your recipe box",
    body: "Save the recipes you love and keep them in one place for later.",
  },
  {
    icon: SparklesIcon,
    title: "Cook from your pantry",
    body: "Enter the ingredients you have to find matching recipes — or generate a brand-new one with AI.",
  },
];

const STATS = [
  { value: "500+", label: "Recipes" },
  { value: "12k+", label: "Home cooks" },
  { value: "40+", label: "Cuisines" },
  { value: "4.8★", label: "Avg. rating" },
];

const AboutPage = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-mesh">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/0 to-[rgb(var(--surface))]" />
        <div className="container-page relative py-20 text-center sm:py-28">
          <span className="eyebrow justify-center">
            <SparklesIcon className="h-4 w-4" />
            Our story
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl font-display text-5xl font-semibold leading-tight tracking-tight text-sand-950 sm:text-6xl">
            Great recipes, made <span className="text-gradient">effortless</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-sand-600">
            Taste-Tales is a community recipe blog for home cooks. Discover
            recipes worth remembering, then create and share your own — each
            captured as structured data that&apos;s easy to read, search, scale,
            and cook from.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/recipes" className={buttonVariants({ size: "lg" })}>
              Browse recipes
            </Link>
            <Link
              href="/articles"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Share a recipe
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container-page -mt-6">
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-sand-200/70 bg-white p-6 shadow-card sm:grid-cols-4 sm:p-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-semibold text-sand-950 sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-sand-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container-page py-16 sm:py-20">
        <div className="mb-10 text-center">
          <span className="eyebrow">Everything you need</span>
          <h2 className="section-title mt-3">What you can do</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group rounded-3xl border border-sand-200/70 bg-white p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold text-sand-950">
                {f.title}
              </h3>
              <p className="mt-2 text-sand-600">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-20">
        <div className="relative overflow-hidden rounded-4xl bg-sand-950 px-6 py-14 text-center shadow-lift sm:px-12">
          <div className="pointer-events-none absolute inset-0 bg-hero-mesh opacity-60" />
          <div className="relative mx-auto max-w-xl">
            <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
              Ready to start cooking?
            </h2>
            <p className="mt-3 text-white/70">
              Browse the latest recipes or share one of your own with the
              community.
            </p>
            <Link
              href="/recipes"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand-500 px-7 py-3 font-semibold text-white shadow-glow transition-all hover:bg-brand-600 active:scale-[0.98]"
            >
              Explore recipes
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
