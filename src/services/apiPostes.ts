import api from "../api/posts";
import type { Article } from "../types";
import {
    apiRecipeToArticle,
    articleToRecipeInput,
    type ApiRecipe,
    type Envelope,
} from "../api/mappers";

// CRUD wrappers over the /api/v1/recipes resource. Each returns `{ data }` (the
// app's Article shape) so the article thunks consume them unchanged.

export const fetchArticles = async (): Promise<{ data: Article[] }> => {
    const res = await api.get<Envelope<ApiRecipe[]>>("/recipes", {
        params: { pageSize: 50, sort: "-publishedAt" },
    });
    return { data: res.data.data.map(apiRecipeToArticle) };
};

export const fetchArticleById = async (
    id: string
): Promise<{ data: Article }> => {
    const res = await api.get<Envelope<ApiRecipe>>(`/recipes/${id}`);
    return { data: apiRecipeToArticle(res.data.data) };
};

export const createArticle = async (
    data: Article
): Promise<{ data: Article }> => {
    const res = await api.post<Envelope<ApiRecipe>>(
        "/recipes",
        articleToRecipeInput(data)
    );
    return { data: apiRecipeToArticle(res.data.data) };
};

export const updateArticle = async (
    id: string,
    data: Article
): Promise<{ data: Article }> => {
    const res = await api.put<Envelope<ApiRecipe>>(
        `/recipes/${id}`,
        articleToRecipeInput(data)
    );
    return { data: apiRecipeToArticle(res.data.data) };
};

export const deleteArticle = async (id: string): Promise<{ data: string }> => {
    await api.delete(`/recipes/${id}`);
    return { data: id };
};
