import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

// "Recipe Box" — saved recipe ids persisted to localStorage (no auth required).
const STORAGE_KEY = "tasteTales.savedRecipes";

interface SavedState {
    ids: string[];
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

const initialState: SavedState = {
    ids: loadSaved(),
};

const savedSlice = createSlice({
    name: "saved",
    initialState,
    reducers: {
        toggleSaved(state, action: PayloadAction<string>) {
            const id = action.payload;
            const idx = state.ids.indexOf(id);
            if (idx >= 0) {
                state.ids.splice(idx, 1);
            } else {
                state.ids.push(id);
            }
            persist(state.ids);
        },
        clearSaved(state) {
            state.ids = [];
            persist(state.ids);
        },
    },
});

export const { toggleSaved, clearSaved } = savedSlice.actions;

export const selectSavedIds = (state: RootState) => state.saved.ids;
export const selectIsSaved = (id: string) => (state: RootState) =>
    state.saved.ids.includes(id);
export const selectSavedCount = (state: RootState) => state.saved.ids.length;

export default savedSlice.reducer;
