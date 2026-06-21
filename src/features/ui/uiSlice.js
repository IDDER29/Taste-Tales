// src/features/ui/uiSlice.js
import { createSlice } from "@reduxjs/toolkit";

// UI-only state. Notifications live in articleSlice (single source of truth) —
// they used to be duplicated here but were always empty and unused.
const uiSlice = createSlice({
    name: "ui",
    initialState: {
        mobileMenuOpen: false,
        showNotifications: false,
    },
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

export const selectMobileMenuOpen = (state) => state.ui.mobileMenuOpen;
export const selectShowNotifications = (state) => state.ui.showNotifications;

export default uiSlice.reducer;
