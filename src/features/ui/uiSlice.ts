// src/features/ui/uiSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

// UI-only state. Notifications live in articleSlice (single source of truth) —
// they used to be duplicated here but were always empty and unused.
interface UiState {
    mobileMenuOpen: boolean;
    showNotifications: boolean;
}

const initialState: UiState = {
    mobileMenuOpen: false,
    showNotifications: false,
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        toggleMobileMenu(state) {
            state.mobileMenuOpen = !state.mobileMenuOpen;
        },
        toggleNotifications(state) {
            state.showNotifications = !state.showNotifications;
        },
    },
});

export const { toggleMobileMenu, toggleNotifications } = uiSlice.actions;

export const selectMobileMenuOpen = (state: RootState) => state.ui.mobileMenuOpen;
export const selectShowNotifications = (state: RootState) => state.ui.showNotifications;

export default uiSlice.reducer;
