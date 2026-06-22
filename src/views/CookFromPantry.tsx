"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { FaTimes, FaMagic } from "react-icons/fa";
import { useAppSelector } from "../app/hooks";
import { selectAllArticles } from "../features/article/articleSlice";
import {
  matchPantry,
  formatMinutes,
  totalMinutes,
  ingredientToLine,
} from "../utils/recipe";
import { isAiConfigured, generateRecipeFromIngredients } from "../api/ai";
import type { GeneratedRecipe } from "../types";

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

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        <span className="text-red-500">Cook</span> From Your Pantry
      </h1>
      <p className="text-gray-600 mb-6">
        Add the ingredients you have on hand. We'll find recipes you can almost
        make{aiReady ? ", or invent a brand-new one with AI." : "."}
      </p>

      {/* Ingredient input */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <label
          htmlFor="ingredient"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          Your ingredients
        </label>
        <input
          id="ingredient"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type an ingredient and press Enter (e.g. chicken, rice, garlic)"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
        />
        {owned.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {owned.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-full text-sm"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeIngredient(item)}
                  aria-label={`Remove ${item}`}
                  className="hover:text-red-200"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Local matches */}
      {owned.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Recipes you can (almost) make
          </h2>
          {matches.length === 0 ? (
            <p className="text-gray-600">
              No existing recipes match those ingredients yet.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {matches.map(({ recipe, have, missing, score }) => (
                <Link
                  href={`/articles/${recipe.id}`}
                  key={recipe.id}
                  className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="flex">
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className="w-28 h-28 object-cover flex-none"
                    />
                    <div className="p-3">
                      <h3 className="font-bold text-gray-900">{recipe.title}</h3>
                      <p className="text-sm text-green-600 font-medium">
                        {Math.round(score * 100)}% of ingredients on hand
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Have {have.length} · need {missing.length} more
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* AI generation */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Invent something new
        </h2>
        {aiReady ? (
          <button
            type="button"
            onClick={handleGenerate}
            disabled={owned.length === 0 || loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-bold rounded-lg shadow hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaMagic />
            {loading ? "Generating..." : "Generate a recipe with AI"}
          </button>
        ) : (
          <p className="text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            AI generation is disabled. Set{" "}
            <code className="bg-yellow-100 px-1 rounded">
              NEXT_PUBLIC_ANTHROPIC_API_KEY
            </code>{" "}
            in your <code className="bg-yellow-100 px-1 rounded">.env</code> to
            enable it. The pantry matcher above works without a key.
          </p>
        )}

        {error && (
          <p className="text-red-600 mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
            {error}
          </p>
        )}

        {generated && (
          <article className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h3 className="text-3xl font-extrabold text-gray-900">
              {generated.title}
            </h3>
            <p className="text-lg text-gray-700 mb-4">{generated.subtitle}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
              <span className="px-2 py-1 bg-gray-100 rounded-full">
                {generated.cuisine}
              </span>
              {totalMinutes(generated) > 0 && (
                <span>{formatMinutes(totalMinutes(generated))} total</span>
              )}
              {generated.servings > 0 && <span>{generated.servings} servings</span>}
            </div>

            <h4 className="text-xl font-bold text-gray-800 mb-2">Ingredients</h4>
            <ul className="list-disc list-inside mb-6 text-gray-700 space-y-1">
              {generated.ingredients.map((ing, i) => (
                <li key={i}>{ingredientToLine(ing)}</li>
              ))}
            </ul>

            <h4 className="text-xl font-bold text-gray-800 mb-2">Instructions</h4>
            <ol className="list-decimal list-inside mb-6 text-gray-700 space-y-2">
              {generated.instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>

            {generated.tip && (
              <p className="bg-green-50 border-l-4 border-green-500 p-3 text-gray-700">
                <span className="font-semibold">Chef's tip:</span> {generated.tip}
              </p>
            )}

            <p className="text-xs text-gray-400 mt-4">
              Generated by AI — review before cooking.
            </p>
          </article>
        )}
      </section>
    </div>
  );
};

export default CookFromPantry;
