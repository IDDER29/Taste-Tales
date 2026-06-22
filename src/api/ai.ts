import type { GeneratedRecipe } from "../types";

// We call the Anthropic Messages API directly with fetch rather than the
// official @anthropic-ai/sdk: the SDK pulls in Node built-ins (node:fs, …) that
// Create React App's webpack 5 cannot bundle for the browser without ejecting.
//
// NOTE: calling the API directly from the browser exposes the API key in the
// client bundle — acceptable for a local/demo build only. A production app
// should proxy these calls through a backend so the key never reaches the
// browser. The `anthropic-dangerous-direct-browser-access` header is required
// for direct browser requests.

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const API_KEY = process.env.REACT_APP_ANTHROPIC_API_KEY;
// Default to the most capable model; override via env (e.g. claude-haiku-4-5
// for a cheaper/faster demo).
const MODEL = process.env.REACT_APP_ANTHROPIC_MODEL || "claude-opus-4-8";

// True when an API key is present, so the UI can hide/disable AI features.
export const isAiConfigured = (): boolean => Boolean(API_KEY);

// JSON schema for the structured recipe, used as a forced tool call so the
// model returns a guaranteed object shape rather than free-form text.
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
    "title",
    "subtitle",
    "cuisine",
    "servings",
    "prepTime",
    "cookTime",
    "ingredients",
    "instructions",
    "tip",
  ],
};

interface ToolUseBlock {
  type: "tool_use";
  name: string;
  input: unknown;
}

/**
 * Ask Claude to invent a single recipe that primarily uses the given
 * ingredients. Returns a structured recipe via a forced tool call.
 */
export async function generateRecipeFromIngredients(
  ingredients: string[]
): Promise<GeneratedRecipe> {
  if (!API_KEY) {
    throw new Error(
      "AI is not configured. Set REACT_APP_ANTHROPIC_API_KEY to enable recipe generation."
    );
  }

  const response = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
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

  if (!response.ok) {
    let message = `Anthropic API error (${response.status})`;
    try {
      const body = await response.json();
      if (body?.error?.message) message = body.error.message;
    } catch {
      /* non-JSON error body */
    }
    throw new Error(message);
  }

  const data = await response.json();
  const blocks: ToolUseBlock[] = Array.isArray(data?.content) ? data.content : [];
  const toolUse = blocks.find((b) => b.type === "tool_use");
  if (!toolUse) {
    throw new Error("The model did not return a recipe. Please try again.");
  }

  return toolUse.input as GeneratedRecipe;
}
