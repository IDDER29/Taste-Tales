// src/features/ui/uiSlice.js
import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
    name: "ui",
    initialState: {
        mobileMenuOpen: false,
        showNotifications: false,
        notifications: [], // Replace with your actual initial notifications if needed
    },
    reducers: {
        toggleMobileMenu(state) {
            state.mobileMenuOpen = !state.mobileMenuOpen;
        },
        toggleNotifications(state) {
            state.showNotifications = !state.showNotifications;
        },
        setNotifications(state, action) {
            state.notifications = action.payload;
        },
    },
});

export const { toggleMobileMenu, toggleNotifications, setNotifications } = uiSlice.actions;

export const selectMobileMenuOpen = (state) => state.ui.mobileMenuOpen;
export const selectShowNotifications = (state) => state.ui.showNotifications;
export const selectNotifications = (state) => state.ui.notifications;

export default uiSlice.reducer;
