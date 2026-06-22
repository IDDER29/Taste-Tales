import type { GeneratedRecipe } from "@/src/types";
import { ApiError } from "./errors";

// Server-side Anthropic integration. The API key lives ONLY here (server env),
// never in the browser bundle. Calls the Messages API directly via fetch.
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";

export const isAiConfigured = (): boolean => Boolean(API_KEY);

// Forced tool schema so the model returns a guaranteed object shape.
const recipeToolSchema = {
  type: "object",
  properties: {
    title: { type: "string", description: "Short, appealing recipe name" },
    subtitle: { type: "string", description: "One-line description" },
    cuisine: { type: "string", description: "e.g. Italian, Mexican, American" },
    servings: { type: "integer", description: "Number of servings" },
    prepTime: { type: "integer", description: "Prep time in minutes" },
    cookTime: { type: "integer", description: "Cook time in minutes" },
    ingredients: {
      type: "array",
      description: "Ingredient list",
      items: {
        type: "object",
        properties: {
          quantity: {
            anyOf: [{ type: "number" }, { type: "null" }],
            description: "Numeric amount, or null for 'to taste'",
          },
          unit: { type: "string", description: "e.g. cup, tbsp, g; empty if none" },
          name: { type: "string" },
        },
        required: ["quantity", "unit", "name"],
      },
    },
    instructions: {
      type: "array",
      description: "Ordered preparation steps",
      items: { type: "string" },
    },
    tip: { type: "string", description: "One helpful cooking tip" },
  },
  required: [
    "title", "subtitle", "cuisine", "servings", "prepTime", "cookTime",
    "ingredients", "instructions", "tip",
  ],
};

interface ToolUseBlock {
  type: string;
  name: string;
  input: unknown;
}

/**
 * Ask Claude to invent a single recipe from the given ingredients.
 * Throws ApiError("SERVICE_UNAVAILABLE") when no key is configured.
 */
export async function generateRecipeFromIngredients(
  ingredients: string[]
): Promise<GeneratedRecipe> {
  if (!API_KEY) {
    throw new ApiError(
      "SERVICE_UNAVAILABLE",
      "AI generation is not configured."
    );
  }

  // Hard timeout so a slow upstream never hangs the function.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);

  let response: Response;
  try {
    response = await fetch(ANTHROPIC_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "content-type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2048,
        system:
          "You are a creative, practical home chef. Invent ONE realistic recipe " +
          "that primarily uses the ingredients the user has on hand. You may assume " +
          "common pantry staples (salt, pepper, oil, water, basic spices) are " +
          "available. Keep quantities sensible and instructions concise and clear. " +
          "Always respond by calling the format_recipe tool.",
        tools: [
          {
            name: "format_recipe",
            description: "Return the generated recipe in structured form.",
            input_schema: recipeToolSchema,
          },
        ],
        tool_choice: { type: "tool", name: "format_recipe" },
        messages: [
          {
            role: "user",
            content: `I have these ingredients: ${ingredients.join(
              ", "
            )}. Invent one recipe I can make with them.`,
          },
        ],
      }),
    });
  } catch (err) {
    throw new ApiError(
      "SERVICE_UNAVAILABLE",
      err instanceof Error && err.name === "AbortError"
        ? "AI generation timed out. Please try again."
        : "Could not reach the AI service. Please try again."
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    let message = `AI service error (${response.status}).`;
    try {
      const body = await response.json();
      if (body?.error?.message) message = body.error.message;
    } catch {
      /* non-JSON body */
    }
    throw new ApiError("SERVICE_UNAVAILABLE", message);
  }

  const data = await response.json();
  const blocks: ToolUseBlock[] = Array.isArray(data?.content) ? data.content : [];
  const toolUse = blocks.find((b) => b.type === "tool_use");
  if (!toolUse) {
    throw new ApiError(
      "SERVICE_UNAVAILABLE",
      "The model did not return a recipe. Please try again."
    );
  }

  return toolUse.input as GeneratedRecipe;
}
