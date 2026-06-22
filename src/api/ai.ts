import type { GeneratedRecipe } from "../types";

// AI recipe generation now runs through our own server route
// (/api/v1/ai/recipes/generate) so the Anthropic key never reaches the browser.
//
// NEXT_PUBLIC_AI_ENABLED is a non-secret UI flag: set it to "true" (alongside the
// server-side ANTHROPIC_API_KEY) so the client shows the AI feature.

export const isAiConfigured = (): boolean =>
  process.env.NEXT_PUBLIC_AI_ENABLED === "true";

/**
 * Ask the backend to invent a recipe from the given ingredients.
 * Surfaces a friendly message when the server reports AI is unavailable.
 */
export async function generateRecipeFromIngredients(
  ingredients: string[]
): Promise<GeneratedRecipe> {
  const res = await fetch("/api/v1/ai/recipes/generate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ingredients }),
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      body?.error?.message ||
      (res.status === 401
        ? "Please sign in to generate recipes."
        : res.status === 429
        ? "You've hit today's AI limit. Please try again later."
        : "AI generation is unavailable right now.");
    throw new Error(message);
  }

  return body.data as GeneratedRecipe;
}
