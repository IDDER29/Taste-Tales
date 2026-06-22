import { z } from "zod";

// ---- Auth ----

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1).max(80).optional(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

// ---- Recipes ----

const ingredientSchema = z.object({
  quantity: z.number().nullable(),
  unit: z.string(),
  name: z.string().min(1),
});

const nutritionSchema = z
  .object({
    calories: z.number().nullable(),
    protein: z.number().nullable(),
    carbs: z.number().nullable(),
    fat: z.number().nullable(),
  })
  .partial();

export const recipeInputSchema = z.object({
  title: z.string().min(1).max(160),
  subtitle: z.string().max(200).optional().default(""),
  category: z.string().min(1),
  cuisine: z.string().optional().default(""),
  diet: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  imageUrl: z.url(),
  prepTime: z.number().int().nonnegative().nullable().optional(),
  cookTime: z.number().int().nonnegative().nullable().optional(),
  servings: z.number().int().positive().nullable().optional(),
  nutrition: nutritionSchema.nullable().optional(),
  ingredients: z.array(ingredientSchema).default([]),
  instructions: z.array(z.string()).default([]),
  content: z.string().optional().default(""),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional().default("PUBLISHED"),
});

export const reviewInputSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional().default(""),
});

// ---- Saved recipes ----
export const savedInputSchema = z.object({
  recipeId: z.string().min(1),
});

// ---- AI generation ----
export const aiGenerateSchema = z.object({
  ingredients: z.array(z.string().min(1)).min(1).max(50),
});

// ---- Uploads ----
export const uploadSignSchema = z.object({
  folder: z
    .string()
    .regex(/^[a-z0-9_\-/]+$/i)
    .max(60)
    .optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type RecipeInput = z.infer<typeof recipeInputSchema>;
export type ReviewInput = z.infer<typeof reviewInputSchema>;
export type SavedInput = z.infer<typeof savedInputSchema>;
export type AiGenerateInput = z.infer<typeof aiGenerateSchema>;
