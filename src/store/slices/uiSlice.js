import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    theme: 'light', // 'light' | 'dark'
    sidebarCollapsed: false,
    activeTab: 'dashboard',
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
            // Side effect for Tailwind generic dark mode can be handled in a subscriber or useEffect
            if (state.theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
        },
        toggleSidebar: (state) => {
            state.sidebarCollapsed = !state.sidebarCollapsed;
        },
        setSidebarCollapsed: (state, action) => {
            state.sidebarCollapsed = action.payload;
        },
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        }
    },
});

export const { toggleTheme, setTheme, toggleSidebar, setSidebarCollapsed, setActiveTab } = uiSlice.actions;
export default uiSlice.reducer;
