import { createSlice } from "@reduxjs/toolkit";

// "Recipe Box" — saved recipe ids persisted to localStorage (no auth required).
const STORAGE_KEY = "tasteTales.savedRecipes";

const loadSaved = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const persist = (ids) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
        /* ignore quota / unavailable storage */
    }
};

const savedSlice = createSlice({
    name: "saved",
    initialState: {
        ids: loadSaved(),
    },
    reducers: {
        toggleSaved(state, action) {
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

export const selectSavedIds = (state) => state.saved.ids;
export const selectIsSaved = (id) => (state) => state.saved.ids.includes(id);
export const selectSavedCount = (state) => state.saved.ids.length;

export default savedSlice.reducer;
