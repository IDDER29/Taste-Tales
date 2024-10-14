import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchArticles, fetchArticleById, createArticle, deleteArticle, updateArticle } from '../../services/apiPostes';

export const getAllArticles = createAsyncThunk('articles/getAll', async () => {
    const response = await fetchArticles();
    return response.data;
});

export const getArticleById = createAsyncThunk('articles/getById', async (id) => {
    const response = await fetchArticleById(id);
    return response.data;
});

export const addArticle = createAsyncThunk('articles/add', async (data) => {
    const response = await createArticle(data);
    return response.data;
});

export const deleteAnArticle = createAsyncThunk('articles/delete', async (id) => {
    await deleteArticle(id);
    return id;
});

export const updateAnArticle = createAsyncThunk('articles/update', async ({ id, data }) => {
    const response = await updateArticle(id, data);
    return response.data;
});

const articleSlice = createSlice({
    name: 'article',
    initialState: {
        articles: [],
        selectedCategory: null,
        status: null,
        notifications: [],
    },
    reducers: {
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload;
        },
        addNotification: (state, action) => {
            state.notifications.push(action.payload);
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllArticles.fulfilled, (state, action) => {
                state.articles = action.payload;
            })
            .addCase(getArticleById.fulfilled, (state, action) => {
                const articleIndex = state.articles.findIndex(article => article.id === action.payload.id);
                if (articleIndex >= 0) {
                    state.articles[articleIndex] = action.payload;
                } else {
                    state.articles.push(action.payload);
                }
            })
            .addCase(addArticle.fulfilled, (state, action) => {
                state.articles.push(action.payload);
                state.notifications.push({ type: 'new', message: 'New article created!' });
            })
            .addCase(deleteAnArticle.fulfilled, (state, action) => {
                state.articles = state.articles.filter(article => article.id !== action.payload);
                state.notifications.push({ type: 'delete', message: 'Article deleted!' });
            })
            .addCase(updateAnArticle.fulfilled, (state, action) => {
                const index = state.articles.findIndex(article => article.id === action.payload.id);
                if (index >= 0) {
                    state.articles[index] = action.payload;
                }
            });
    },
});

export const { setSelectedCategory, addNotification, clearNotifications } = articleSlice.actions;
export default articleSlice.reducer;
