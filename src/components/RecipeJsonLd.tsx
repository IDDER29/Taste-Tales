"use client";

import React from "react";
import { hasStructuredRecipe, buildRecipeJsonLd } from "../utils/recipe";
import type { Article, Rating } from "../types";

interface RecipeJsonLdProps {
  article: Article;
  rating?: Rating;
}

// `rating` is an optional { value, count } that adds aggregateRating markup.
const RecipeJsonLd = ({ article, rating }: RecipeJsonLdProps) => {
  if (
    !hasStructuredRecipe(
      article as unknown as Parameters<typeof hasStructuredRecipe>[0]
    )
  )
    return null;

  const jsonLd = buildRecipeJsonLd(article, rating);
  if (!jsonLd) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default RecipeJsonLd;
