// Mappers + shared response types between the /api/v1 backend and the app's
// existing domain types (Article/Review). One source of truth for the shape
// translation so services and the store stay consistent.
import type { Article, Review, Nutrition, Ingredient } from "../types";
import type { RecipeInput } from "@/lib/validation";

export interface Envelope<T> {
  data: T;
  meta?: { total: number; page: number; pageSize: number };
}

export interface ApiAuthor {
  id: string;
  name: string | null;
  avatarUrl: string | null;
}

export interface ApiRecipe {
  id: string;
  slug: string;
  authorId: string;
  title: string;
  subtitle: string | null;
  category: string;
  cuisine: string | null;
  diet: string[];
  tags: string[];
  imageUrl: string;
  prepTime: number | null;
  cookTime: number | null;
  servings: number | null;
  nutrition: Nutrition | null;
  ingredients: Ingredient[];
  instructions: string[];
  content: string | null;
  status: string;
  views: number;
  likes: number;
  ratingAvg: number;
  ratingCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author?: ApiAuthor;
}

export interface ApiReview {
  id: string;
  recipeId: string;
  authorId: string;
  rating: number;
  comment: string;
  createdAt: string;
  author?: ApiAuthor;
}

// API recipe -> the app's Article shape used throughout the views.
export function apiRecipeToArticle(r: ApiRecipe): Article {
  return {
    id: r.id,
    title: r.title,
    imageUrl: r.imageUrl,
    category: r.category,
    views: r.views,
    likes: r.likes,
    publisher: {
      name: r.author?.name ?? "Unknown",
      image: r.author?.avatarUrl ?? "",
    },
    authorId: r.authorId,
    subtitle: r.subtitle ?? undefined,
    cuisine: r.cuisine ?? undefined,
    diet: r.diet,
    tags: r.tags,
    prepTime: r.prepTime,
    cookTime: r.cookTime,
    servings: r.servings,
    nutrition: r.nutrition,
    ingredients: r.ingredients,
    instructions: r.instructions,
    content: r.content ?? undefined,
    publishedDate: r.publishedAt ?? undefined,
  };
}

// Article (from the create/edit form) -> the RecipeInput the API validates.
// Drops client-only fields (id, publisher, views, likes) — the server owns those.
export function articleToRecipeInput(a: Article): RecipeInput {
  return {
    title: a.title,
    subtitle: a.subtitle ?? "",
    category: a.category,
    cuisine: a.cuisine ?? "",
    diet: a.diet ?? [],
    tags: a.tags ?? [],
    imageUrl: a.imageUrl,
    prepTime: a.prepTime ?? null,
    cookTime: a.cookTime ?? null,
    servings: a.servings ?? null,
    nutrition: a.nutrition ?? null,
    ingredients: a.ingredients ?? [],
    instructions: a.instructions ?? [],
    content: a.content ?? "",
    status: "PUBLISHED",
  };
}

// API review -> the app's Review shape.
export function apiReviewToReview(r: ApiReview): Review {
  return {
    id: r.id,
    blogId: r.recipeId,
    author: r.author?.name ?? "Anonymous",
    rating: r.rating,
    comment: r.comment,
    date: r.createdAt,
  };
}
