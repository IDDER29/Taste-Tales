"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { SessionProvider, useSession } from "next-auth/react";
import { store } from "../src/app/store";
import { useAppDispatch } from "../src/app/hooks";
import { getAllArticles } from "../src/features/article/articleSlice";
import { syncSavedOnLogin } from "../src/features/saved/savedSlice";
import { UIProvider } from "../src/components/ui";

// Loads the article list once on mount, and syncs the Recipe Box (merging guest
// saves) whenever the user becomes authenticated.
function AppInit() {
  const dispatch = useAppDispatch();
  const { status } = useSession();

  useEffect(() => {
    dispatch(getAllArticles());
  }, [dispatch]);

  useEffect(() => {
    if (status === "authenticated") {
      dispatch(syncSavedOnLogin());
    }
  }, [status, dispatch]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <UIProvider>
          <AppInit />
          {children}
        </UIProvider>
      </Provider>
    </SessionProvider>
  );
}
