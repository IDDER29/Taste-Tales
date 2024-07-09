// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "../features/ui/uiSlice";
import articleReducer from "../features/article/articleSlice";

export const store = configureStore({
    reducer: {
        ui: uiReducer,
        article: articleReducer,
    },
});
