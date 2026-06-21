import React from "react";
import { hasStructuredRecipe, buildRecipeJsonLd } from "../utils/recipe";

const RecipeJsonLd = ({ article }) => {
  if (!hasStructuredRecipe(article)) return null;

  const jsonLd = buildRecipeJsonLd(article);
  if (!jsonLd) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default RecipeJsonLd;
