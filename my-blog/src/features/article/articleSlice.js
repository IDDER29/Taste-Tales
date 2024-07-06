// src/features/article/articleSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchArticles, createArticle, deleteArticle, updateArticle } from '../../services/apiPostes';

export const getAllArticles = createAsyncThunk('articles/getAll', async () => {
    const response = await fetchArticles();
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
        selectedCategory: null, // Add selected category to the initial state
        status: null,
    },
    reducers: {
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllArticles.fulfilled, (state, action) => {
                state.articles = action.payload;
            })
            .addCase(addArticle.fulfilled, (state, action) => {
                state.articles.push(action.payload);
            })
            .addCase(deleteAnArticle.fulfilled, (state, action) => {
                state.articles = state.articles.filter((article) => article.id !== action.payload);
            })
            .addCase(updateAnArticle.fulfilled, (state, action) => {
                const index = state.articles.findIndex((article) => article.id === action.payload.id);
                if (index !== -1) {
                    state.articles[index] = action.payload;
                }
            });
    },
});

export const { setSelectedCategory } = articleSlice.actions;

export default articleSlice.reducer;
