import { configureStore } from '@reduxjs/toolkit';
import articleReducer from '../features/article/articleSlice';

export const store = configureStore({
    reducer: {
        article: articleReducer
    }
});
