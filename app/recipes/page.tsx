import { Suspense } from "react";
import Recipes from "../../src/views/Recipes";

export const metadata = {
  title: "All recipes — Taste-Tales",
  description:
    "Search and filter the full Taste-Tales collection by cuisine, diet, time, and category.",
};

export default function RecipesPage() {
  return (
    <Suspense fallback={null}>
      <Recipes />
    </Suspense>
  );
}
