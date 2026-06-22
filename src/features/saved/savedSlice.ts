import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import type { Article } from "../../types";
import {
    fetchSavedRecipes,
    saveRecipeApi,
    unsaveRecipeApi,
} from "../../services/apiSaved";

// "Recipe Box". Guests use localStorage (no auth); authenticated users are
// server-synced via /api/v1/saved, and their guest saves are merged on login.
// `ids` stays the source of truth for isSaved/count in both modes; `items`
// holds the resolved recipes for authenticated users.
const STORAGE_KEY = "tasteTales.savedRecipes";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface SavedState {
    ids: string[];
    items: Article[];
    status: RequestStatus;
}

const loadSaved = (): string[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const persist = (ids: string[]): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
        /* ignore quota / unavailable storage */
    }
};

// ---- Authenticated (server-synced) thunks ----

export const fetchSaved = createAsyncThunk("saved/fetch", async () => {
    const res = await fetchSavedRecipes();
    return res.data;
});

export const saveRecipe = createAsyncThunk("saved/save", async (id: string) => {
    await saveRecipeApi(id);
    return id;
});

export const unsaveRecipe = createAsyncThunk(
    "saved/unsave",
    async (id: string) => {
        await unsaveRecipeApi(id);
        return id;
    }
);

// On login: merge any guest (localStorage) saves into the account, then load the
// authoritative server list and stop persisting to localStorage.
export const syncSavedOnLogin = createAsyncThunk(
    "saved/sync",
    async (_: void, { getState }) => {
        const localIds = (getState() as RootState).saved.ids;
        if (localIds.length) {
            await Promise.allSettled(localIds.map((id) => saveRecipeApi(id)));
        }
        const res = await fetchSavedRecipes();
        return res.data;
    }
);

const initialState: SavedState = {
    ids: loadSaved(),
    items: [],
    status: "idle",
};

const removeId = (ids: string[], id: string) => {
    const idx = ids.indexOf(id);
    if (idx >= 0) ids.splice(idx, 1);
};

const savedSlice = createSlice({
    name: "saved",
    initialState,
    reducers: {
        // Guest toggle (localStorage-backed).
        toggleSaved(state, action: PayloadAction<string>) {
            const id = action.payload;
            if (state.ids.includes(id)) {
                removeId(state.ids, id);
            } else {
                state.ids.push(id);
            }
            persist(state.ids);
        },
        clearSaved(state) {
            state.ids = [];
            state.items = [];
            persist(state.ids);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSaved.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchSaved.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload;
                state.ids = action.payload.map((a) => a.id);
            })
            .addCase(fetchSaved.rejected, (state) => {
                state.status = "failed";
            })
            // Optimistic save: reflect immediately, roll back on failure.
            .addCase(saveRecipe.pending, (state, action) => {
                if (!state.ids.includes(action.meta.arg)) {
                    state.ids.push(action.meta.arg);
                }
            })
            .addCase(saveRecipe.rejected, (state, action) => {
                removeId(state.ids, action.meta.arg);
            })
            // Optimistic unsave.
            .addCase(unsaveRecipe.pending, (state, action) => {
                removeId(state.ids, action.meta.arg);
                state.items = state.items.filter((a) => a.id !== action.meta.arg);
            })
            .addCase(unsaveRecipe.rejected, (state, action) => {
                if (!state.ids.includes(action.meta.arg)) {
                    state.ids.push(action.meta.arg);
                }
            })
            .addCase(syncSavedOnLogin.fulfilled, (state, action) => {
                state.items = action.payload;
                state.ids = action.payload.map((a) => a.id);
                // Server is now the source of truth; clear the guest cache.
                persist([]);
            });
    },
});

export const { toggleSaved, clearSaved } = savedSlice.actions;

export const selectSavedIds = (state: RootState) => state.saved.ids;
export const selectSavedItems = (state: RootState) => state.saved.items;
export const selectIsSaved = (id: string) => (state: RootState) =>
    state.saved.ids.includes(id);
export const selectSavedCount = (state: RootState) => state.saved.ids.length;

export default savedSlice.reducer;
