import React from "react";
import { hasStructuredRecipe, buildRecipeJsonLd } from "../utils/recipe";

// `rating` is an optional { value, count } that adds aggregateRating markup.
const RecipeJsonLd = ({ article, rating }) => {
  if (!hasStructuredRecipe(article)) return null;

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
