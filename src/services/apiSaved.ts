import api from "../api/posts";
import type { Article } from "../types";
import { apiRecipeToArticle, type ApiRecipe, type Envelope } from "../api/mappers";

// Server-synced Recipe Box (authenticated users) over /api/v1/saved.

export const fetchSavedRecipes = async (): Promise<{ data: Article[] }> => {
    const res = await api.get<Envelope<ApiRecipe[]>>("/saved");
    return { data: res.data.data.map(apiRecipeToArticle) };
};

export const saveRecipeApi = (recipeId: string) =>
    api.post("/saved", { recipeId });

export const unsaveRecipeApi = (recipeId: string) =>
    api.delete(`/saved?recipeId=${encodeURIComponent(recipeId)}`);
