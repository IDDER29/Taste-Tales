// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "../features/ui/uiSlice";
import articleReducer from "../features/article/articleSlice";
import reviewReducer from "../features/review/reviewSlice";
import savedReducer from "../features/saved/savedSlice";

export const store = configureStore({
    reducer: {
        ui: uiReducer,
        article: articleReducer,
        review: reviewReducer,
        saved: savedReducer,
    },
});
