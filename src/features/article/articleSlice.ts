import { createSlice, createAsyncThunk, createSelector, PayloadAction } from "@reduxjs/toolkit";
import {
    fetchArticles,
    fetchArticleById,
    createArticle,
    deleteArticle,
    updateArticle,
} from "../../services/apiPostes";
import type { RootState } from "../../app/store";
import type { Article, AppNotification } from "../../types";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface ArticleState {
    articles: Article[];
    selectedCategory: string | null;
    status: RequestStatus;
    error: string | null;
    notifications: AppNotification[];
}

export const getAllArticles = createAsyncThunk("articles/getAll", async () => {
    const response = await fetchArticles();
    return response.data;
});

export const getArticleById = createAsyncThunk("articles/getById", async (id: string) => {
    const response = await fetchArticleById(id);
    return response.data;
});

export const addArticle = createAsyncThunk("articles/add", async (data: Article) => {
    const response = await createArticle(data);
    return response.data;
});

export const deleteAnArticle = createAsyncThunk("articles/delete", async (id: string) => {
    await deleteArticle(id);
    return id;
});

export const updateAnArticle = createAsyncThunk(
    "articles/update",
    async ({ id, data }: { id: string; data: Article }) => {
        const response = await updateArticle(id, data);
        return response.data;
    }
);

const initialState: ArticleState = {
    articles: [],
    selectedCategory: null,
    status: "idle",
    error: null,
    notifications: [],
};

const articleSlice = createSlice({
    name: "article",
    initialState,
    reducers: {
        setSelectedCategory: (state, action: PayloadAction<string | null>) => {
            state.selectedCategory = action.payload;
        },
        addNotification: (state, action: PayloadAction<AppNotification>) => {
            state.notifications.push(action.payload);
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // getAllArticles — drives the list-level loading/error UI
            .addCase(getAllArticles.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(getAllArticles.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.articles = action.payload;
            })
            .addCase(getAllArticles.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error?.message || "Failed to load articles";
            })
            .addCase(getArticleById.fulfilled, (state, action) => {
                const articleIndex = state.articles.findIndex(
                    (article) => article.id === action.payload.id
                );
                if (articleIndex >= 0) {
                    state.articles[articleIndex] = action.payload;
                } else {
                    state.articles.push(action.payload);
                }
            })
            .addCase(addArticle.fulfilled, (state, action) => {
                state.articles.push(action.payload);
                state.notifications.push({ type: "new", message: "New article created!" });
            })
            .addCase(deleteAnArticle.fulfilled, (state, action) => {
                state.articles = state.articles.filter(
                    (article) => article.id !== action.payload
                );
                state.notifications.push({ type: "delete", message: "Article deleted!" });
            })
            .addCase(updateAnArticle.fulfilled, (state, action) => {
                const index = state.articles.findIndex(
                    (article) => article.id === action.payload.id
                );
                if (index >= 0) {
                    state.articles[index] = action.payload;
                }
                state.notifications.push({ type: "edit", message: "Article updated!" });
            });
    },
});

export const { setSelectedCategory, addNotification, clearNotifications } =
    articleSlice.actions;

// ---- Selectors (single source of truth for derived article data) ----

export const selectAllArticles = (state: RootState) => state.article.articles;
export const selectArticlesStatus = (state: RootState) => state.article.status;
export const selectArticlesError = (state: RootState) => state.article.error;
export const selectSelectedCategory = (state: RootState) => state.article.selectedCategory;
export const selectNotifications = (state: RootState) => state.article.notifications;

// Memoized: top 3 articles by view count (used by RecipeBlogs/TrendyRecipes/Home).
export const selectTopArticlesByViews = createSelector([selectAllArticles], (articles) =>
    [...articles].sort((a, b) => b.views - a.views).slice(0, 3)
);

// Memoized: articles sorted newest-first, optionally filtered by selected category.
export const selectArticlesByLatest = createSelector(
    [selectAllArticles, selectSelectedCategory],
    (articles, selectedCategory) => {
        const sorted = [...articles].sort(
            (a, b) =>
                new Date(b.publishedDate || 0).getTime() -
                new Date(a.publishedDate || 0).getTime()
        );
        return selectedCategory
            ? sorted.filter((article) => article.category === selectedCategory)
            : sorted;
    }
);

// Factory selector: look up a single article by id.
export const selectArticleById = (id: string) => (state: RootState) =>
    state.article.articles.find((article) => article.id === id);

export default articleSlice.reducer;
