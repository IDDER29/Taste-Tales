"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "../src/app/store";
import { useAppDispatch } from "../src/app/hooks";
import { getAllArticles } from "../src/features/article/articleSlice";

// Loads the article list once on mount (previously done in App.js).
function AppInit() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllArticles());
  }, [dispatch]);
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AppInit />
      {children}
    </Provider>
  );
}
