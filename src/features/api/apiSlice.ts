import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Article, Review, Nutrition, Ingredient } from "../../types";
import type { RecipeInput } from "@/lib/validation";

// ---- Backend (Prisma) response shapes returned by /api/v1 ----

interface ApiAuthor {
  id: string;
  name: string | null;
  avatarUrl: string | null;
}

interface ApiRecipe {
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

interface ApiReview {
  id: string;
  recipeId: string;
  authorId: string;
  rating: number;
  comment: string;
  createdAt: string;
  author?: ApiAuthor;
}

// All responses use the envelope { data, meta? }.
interface Envelope<T> {
  data: T;
  meta?: { total: number; page: number; pageSize: number };
}

export interface RecipeListResult {
  items: Article[];
  total: number;
  page: number;
  pageSize: number;
}

// ---- Mappers: API shape -> the app's existing domain types ----

const toArticle = (r: ApiRecipe): Article => ({
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
});

const toReview = (r: ApiReview): Review => ({
  id: r.id,
  blogId: r.recipeId,
  author: r.author?.name ?? "Anonymous",
  rating: r.rating,
  comment: r.comment,
  date: r.createdAt,
});

// ---- The data layer. Views switch from the json-server thunks to these hooks
// once the backend is live (baseUrl points at the in-app /api/v1). ----

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  tagTypes: ["Recipe", "Review", "Saved"],
  endpoints: (builder) => ({
    getRecipes: builder.query<
      RecipeListResult,
      { page?: number; pageSize?: number; category?: string; q?: string; sort?: string } | void
    >({
      query: (args) => {
        const { page = 1, pageSize = 12, category, q, sort } = args ?? {};
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
        });
        if (category) params.set("category", category);
        if (q) params.set("q", q);
        if (sort) params.set("sort", sort);
        return `/recipes?${params.toString()}`;
      },
      transformResponse: (res: Envelope<ApiRecipe[]>): RecipeListResult => ({
        items: res.data.map(toArticle),
        total: res.meta?.total ?? res.data.length,
        page: res.meta?.page ?? 1,
        pageSize: res.meta?.pageSize ?? res.data.length,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((a) => ({ type: "Recipe" as const, id: a.id })),
              { type: "Recipe" as const, id: "LIST" },
            ]
          : [{ type: "Recipe" as const, id: "LIST" }],
    }),

    getRecipe: builder.query<Article, string>({
      query: (id) => `/recipes/${id}`,
      transformResponse: (res: Envelope<ApiRecipe>) => toArticle(res.data),
      providesTags: (_r, _e, id) => [{ type: "Recipe", id }],
    }),

    createRecipe: builder.mutation<Article, RecipeInput>({
      query: (body) => ({ url: "/recipes", method: "POST", body }),
      transformResponse: (res: Envelope<ApiRecipe>) => toArticle(res.data),
      invalidatesTags: [{ type: "Recipe", id: "LIST" }],
    }),

    updateRecipe: builder.mutation<Article, { id: string; data: RecipeInput }>({
      query: ({ id, data }) => ({ url: `/recipes/${id}`, method: "PUT", body: data }),
      transformResponse: (res: Envelope<ApiRecipe>) => toArticle(res.data),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Recipe", id },
        { type: "Recipe", id: "LIST" },
      ],
    }),

    deleteRecipe: builder.mutation<{ id: string }, string>({
      query: (id) => ({ url: `/recipes/${id}`, method: "DELETE" }),
      transformResponse: (res: Envelope<{ id: string }>) => res.data,
      invalidatesTags: (_r, _e, id) => [
        { type: "Recipe", id },
        { type: "Recipe", id: "LIST" },
        { type: "Saved", id: "LIST" },
      ],
    }),

    getReviews: builder.query<Review[], string>({
      query: (recipeId) => `/recipes/${recipeId}/reviews`,
      transformResponse: (res: Envelope<ApiReview[]>) => res.data.map(toReview),
      providesTags: (_r, _e, recipeId) => [{ type: "Review", id: recipeId }],
    }),

    addReview: builder.mutation<
      Review,
      { recipeId: string; rating: number; comment: string }
    >({
      query: ({ recipeId, ...body }) => ({
        url: `/recipes/${recipeId}/reviews`,
        method: "POST",
        body,
      }),
      transformResponse: (res: Envelope<ApiReview>) => toReview(res.data),
      invalidatesTags: (_r, _e, { recipeId }) => [
        { type: "Review", id: recipeId },
        { type: "Recipe", id: recipeId },
      ],
    }),

    // ---- Saved recipes (server-synced Recipe Box) ----
    getSaved: builder.query<Article[], void>({
      query: () => "/saved",
      transformResponse: (res: Envelope<ApiRecipe[]>) => res.data.map(toArticle),
      providesTags: (result) =>
        result
          ? [
              ...result.map((a) => ({ type: "Saved" as const, id: a.id })),
              { type: "Saved" as const, id: "LIST" },
            ]
          : [{ type: "Saved" as const, id: "LIST" }],
    }),

    saveRecipe: builder.mutation<{ recipeId: string; saved: boolean }, string>({
      query: (recipeId) => ({ url: "/saved", method: "POST", body: { recipeId } }),
      transformResponse: (res: Envelope<{ recipeId: string; saved: boolean }>) =>
        res.data,
      invalidatesTags: [{ type: "Saved", id: "LIST" }],
    }),

    unsaveRecipe: builder.mutation<{ recipeId: string; saved: boolean }, string>({
      query: (recipeId) => ({ url: `/saved?recipeId=${recipeId}`, method: "DELETE" }),
      transformResponse: (res: Envelope<{ recipeId: string; saved: boolean }>) =>
        res.data,
      invalidatesTags: (_r, _e, recipeId) => [
        { type: "Saved", id: recipeId },
        { type: "Saved", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetRecipesQuery,
  useGetRecipeQuery,
  useCreateRecipeMutation,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
  useGetReviewsQuery,
  useAddReviewMutation,
  useGetSavedQuery,
  useSaveRecipeMutation,
  useUnsaveRecipeMutation,
} = apiSlice;
