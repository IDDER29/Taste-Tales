"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  XMarkIcon,
  SparklesIcon,
  PlusIcon,
  LightBulbIcon,
  ClockIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useAppSelector } from "../app/hooks";
import { selectAllArticles } from "../features/article/articleSlice";
import {
  matchPantry,
  formatMinutes,
  totalMinutes,
  ingredientToLine,
} from "../utils/recipe";
import { isAiConfigured, generateRecipeFromIngredients } from "../api/ai";
import { AppImage } from "../components/ui/AppImage";
import type { GeneratedRecipe } from "../types";

const SUGGESTIONS = ["Chicken", "Rice", "Garlic", "Tomato", "Onion", "Eggs", "Pasta"];

const CookFromPantry = () => {
  const articles = useAppSelector(selectAllArticles);
  const [input, setInput] = useState("");
  const [owned, setOwned] = useState<string[]>([]);
  const [generated, setGenerated] = useState<GeneratedRecipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const aiReady = isAiConfigured();

  const matches = useMemo(
    () => matchPantry(articles, owned).slice(0, 6),
    [articles, owned]
  );

  const addIngredient = (value: string) => {
    const cleaned = value.trim().replace(/,$/, "").trim();
    if (cleaned && !owned.includes(cleaned.toLowerCase())) {
      setOwned([...owned, cleaned.toLowerCase()]);
    }
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addIngredient(input);
    }
  };

  const removeIngredient = (item: string) => {
    setOwned(owned.filter((i) => i !== item));
  };

  const handleGenerate = async () => {
    setError(null);
    setGenerated(null);
    setLoading(true);
    try {
      const recipe = await generateRecipeFromIngredients(owned);
      setGenerated(recipe);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const availableSuggestions = SUGGESTIONS.filter(
    (s) => !owned.includes(s.toLowerCase())
  );

  return (
    <div className="container-page py-12 lg:py-16">
      {/* Hero */}
      <div className="mx-auto max-w-3xl text-center">
        <span className="eyebrow justify-center">
          <SparklesIcon className="h-4 w-4" />
          Pantry chef
        </span>
        <h1 className="mt-3 font-display text-4xl font-semibold text-sand-950 sm:text-5xl">
          Cook from what you have
        </h1>
        <p className="mt-3 text-lg text-sand-600">
          Add the ingredients in your kitchen. We&apos;ll find recipes you can
          almost make{aiReady ? " — or invent a brand-new one with AI." : "."}
        </p>
      </div>

      {/* Ingredient input */}
      <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-sand-200/70 bg-white p-6 shadow-card sm:p-8">
        <label
          htmlFor="ingredient"
          className="mb-2 block font-display text-lg font-semibold text-sand-950"
        >
          What&apos;s in your pantry?
        </label>
        <div className="flex items-center gap-2 rounded-full border border-sand-300 bg-white p-1.5 focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-500/15">
          <input
            id="ingredient"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type an ingredient and press Enter…"
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-base text-sand-950 placeholder:text-sand-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => addIngredient(input)}
            disabled={!input.trim()}
            className="inline-flex flex-none items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-40"
          >
            <PlusIcon className="h-4 w-4" />
            Add
          </button>
        </div>

        {/* Selected ingredients */}
        {owned.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {owned.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium capitalize text-brand-700"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeIngredient(item)}
                  aria-label={`Remove ${item}`}
                  className="rounded-full text-brand-400 transition-colors hover:text-brand-700"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Suggestions */}
        {availableSuggestions.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-sand-500">Try:</span>
            {availableSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addIngredient(s)}
                className="chip hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
              >
                + {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {owned.length === 0 ? (
        <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-dashed border-sand-300 bg-sand-50/50 p-10 text-center">
          <LightBulbIcon className="mx-auto h-10 w-10 text-sand-300" />
          <p className="mt-3 text-sand-600">
            Add a few ingredients to see what you can cook.
          </p>
        </div>
      ) : (
        <>
          {/* Local matches */}
          <section className="mx-auto mt-14 max-w-5xl">
            <h2 className="font-display text-2xl font-semibold text-sand-950">
              Recipes you can (almost) make
            </h2>
            {matches.length === 0 ? (
              <p className="mt-4 text-sand-600">
                No existing recipes match those ingredients yet — try the AI chef
                below.
              </p>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {matches.map(({ recipe, have, missing, score }) => (
                  <Link
                    href={`/articles/${recipe.id}`}
                    key={recipe.id}
                    className="group flex overflow-hidden rounded-2xl border border-sand-200/70 bg-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
                  >
                    <div className="relative aspect-square h-32 w-32 flex-none overflow-hidden">
                      <AppImage
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        ratio=""
                        wrapperClassName="absolute inset-0 h-full w-full"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex min-w-0 flex-col justify-center p-4">
                      <h3 className="font-display text-lg font-semibold text-sand-950 line-clamp-1 group-hover:text-brand-700">
                        {recipe.title}
                      </h3>
                      {/* Match bar */}
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sand-100">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
                            style={{ width: `${Math.round(score * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-brand-600">
                          {Math.round(score * 100)}%
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-sand-500">
                        Have {have.length} · need {missing.length} more
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* AI generation */}
          <section className="mx-auto mt-14 max-w-3xl">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-accent-500 p-8 text-white shadow-card">
              <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
              <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-display text-2xl font-semibold">
                    Invent something new
                  </h2>
                  <p className="mt-1 max-w-md text-white/85">
                    Let our AI chef improvise a recipe from your{" "}
                    {owned.length} ingredient{owned.length === 1 ? "" : "s"}.
                  </p>
                </div>
                {aiReady && (
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={owned.length === 0 || loading}
                    className="inline-flex flex-none items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-brand-700 shadow-soft transition-all hover:shadow-lift active:scale-[0.98] disabled:opacity-60"
                  >
                    <SparklesIcon className="h-5 w-5" />
                    {loading ? "Cooking up…" : "Generate recipe"}
                  </button>
                )}
              </div>

              {!aiReady && (
                <p className="relative mt-4 rounded-2xl border border-white/20 bg-white/10 p-4 text-sm text-white/90 backdrop-blur">
                  AI generation is disabled. Set the server-side{" "}
                  <code className="rounded bg-white/20 px-1">ANTHROPIC_API_KEY</code>{" "}
                  and{" "}
                  <code className="rounded bg-white/20 px-1">
                    NEXT_PUBLIC_AI_ENABLED=true
                  </code>{" "}
                  to enable it. The pantry matcher above works without a key.
                </p>
              )}
            </div>

            {error && (
              <p className="mt-4 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-brand-700">
                {error}
              </p>
            )}

            {generated && (
              <article className="mt-6 rounded-3xl border border-sand-200/70 bg-white p-6 shadow-card sm:p-8">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-700">
                  <SparklesIcon className="h-3.5 w-3.5" />
                  AI generated
                </span>
                <h3 className="mt-3 font-display text-3xl font-semibold text-sand-950">
                  {generated.title}
                </h3>
                <p className="mt-1.5 text-lg text-sand-600">{generated.subtitle}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-sm text-sand-600">
                  {generated.cuisine && (
                    <span className="rounded-full bg-sand-100 px-3 py-1">
                      {generated.cuisine}
                    </span>
                  )}
                  {totalMinutes(generated) > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sand-100 px-3 py-1">
                      <ClockIcon className="h-4 w-4" />
                      {formatMinutes(totalMinutes(generated))}
                    </span>
                  )}
                  {generated.servings > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sand-100 px-3 py-1">
                      <UserGroupIcon className="h-4 w-4" />
                      {generated.servings} servings
                    </span>
                  )}
                </div>

                <div className="mt-6 grid gap-8 sm:grid-cols-[1fr_1.4fr]">
                  <div>
                    <h4 className="font-display text-lg font-semibold text-sand-950">
                      Ingredients
                    </h4>
                    <ul className="mt-3 space-y-2">
                      {generated.ingredients.map((ing, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sand-700"
                        >
                          <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-brand-400" />
                          {ingredientToLine(ing)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-semibold text-sand-950">
                      Instructions
                    </h4>
                    <ol className="mt-3 space-y-4">
                      {generated.instructions.map((step, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                            {i + 1}
                          </span>
                          <p className="pt-0.5 leading-relaxed text-sand-700">
                            {step}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                {generated.tip && (
                  <p className="mt-6 flex items-start gap-2 rounded-2xl border-l-4 border-accent-400 bg-accent-50/60 p-4 text-sand-700">
                    <LightBulbIcon className="mt-0.5 h-5 w-5 flex-none text-accent-500" />
                    <span>
                      <span className="font-semibold text-sand-900">
                        Chef&apos;s tip:
                      </span>{" "}
                      {generated.tip}
                    </span>
                  </p>
                )}

                <p className="mt-4 text-xs text-sand-400">
                  Generated by AI — review before cooking.
                </p>
              </article>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default CookFromPantry;
