import api from "../api/posts";
import { Article } from "../types";

export const fetchArticles = () => api.get<Article[]>("/blogs");
export const createArticle = (data: Article) => api.post<Article>("/blogs", data);
export const deleteArticle = (id: string) => api.delete(`/blogs/${id}`);
export const updateArticle = (id: string, data: Article) =>
    api.put<Article>(`/blogs/${id}`, data);
export const fetchArticleById = (id: string) => api.get<Article>(`/blogs/${id}`);
