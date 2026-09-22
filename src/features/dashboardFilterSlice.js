import { createSlice } from '@reduxjs/toolkit';

const SAVED_FILTERS_KEY = 'dashboard_filters_v2';

const loadSavedFilters = () => {
    try {
        const saved = localStorage.getItem(SAVED_FILTERS_KEY);
        if (saved) return JSON.parse(saved);
    } catch (e) {
        console.error('Failed to load dashboard filters from localStorage', e);
    }
    return {
        area: '',
        analyst: '',
        phase: '',
        period: '',
    };
};

export const dashboardFilterSlice = createSlice({
    name: 'dashboardFilter',
    initialState: loadSavedFilters(),
    reducers: {
        setDashboardFilter: (state, action) => {
            const { name, value } = action.payload;
            state[name] = value;
            localStorage.setItem(SAVED_FILTERS_KEY, JSON.stringify(state));
        },
        resetDashboardFilters: (state) => {
            state.area = '';
            state.analyst = '';
            state.phase = '';
            state.period = '';
            localStorage.removeItem(SAVED_FILTERS_KEY);
        }
    }
});

export const { setDashboardFilter, resetDashboardFilters } = dashboardFilterSlice.actions;
export default dashboardFilterSlice.reducer;
