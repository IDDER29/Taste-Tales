// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "../features/ui/uiSlice";
import articleReducer from "../features/article/articleSlice";
import reviewReducer from "../features/review/reviewSlice";
import savedReducer from "../features/saved/savedSlice";
import { apiSlice } from "../features/api/apiSlice";

export const store = configureStore({
    reducer: {
        ui: uiReducer,
        article: articleReducer,
        review: reviewReducer,
        saved: savedReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
