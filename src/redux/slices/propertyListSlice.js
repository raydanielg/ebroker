import { createSlice } from '@reduxjs/toolkit';

// --- Define Initial State (Filters & ViewType Only) ---
const initialState = {
    // Filters structure should match what PropertySideFilter uses
    filters: {
        propertyType: '', // 'sell', 'rent', or ''
        category: '',     // category slug or ID, or ''/ 'all'
        location: '',     // city name or search term
        price: { min: '', max: '' },
        postedTime: '',   // 'anytime', 'lastWeek', 'yesterday', or ''
        facilities: [],   // array of facility IDs
    },
    // UI Preferences
    viewType: 'grid', // 'grid' or 'list'
};

// --- Create Slice ---
const propertyListSlice = createSlice({
    name: 'propertyListFilters', // Renamed slice for clarity
    initialState,
    reducers: {
        // Action to set a single filter field
        setFilter(state, action) {
            const { key, value } = action.payload;
            if (key === 'minPrice' || key === 'maxPrice') {
                state.filters.price[key === 'minPrice' ? 'min' : 'max'] = value;
            } else if (key === 'facilities') {
                 // Handle facilities array toggle
                 const facilityId = value;
                 const index = state.filters.facilities.indexOf(facilityId);
                 if (index >= 0) {
                     state.filters.facilities.splice(index, 1); // Remove
                 } else {
                     state.filters.facilities.push(facilityId); // Add
                 }
            } else if (key in state.filters) { // Ensure the key exists in the filters object
                state.filters[key] = value;
            }
            // NOTE: We don't reset offset here as it's managed by the component now
        },
        // Action to replace all filters (e.g., applying context from URL)
        setAllFilters(state, action) {
            // Merge payload with initial state structure to ensure all keys exist
            state.filters = { ...initialState.filters, ...action.payload };
        },
        // Action to clear filters (respecting initial context passed in payload)
        clearFilters(state, action) {
            const baseFilters = action.payload || {}; // Get base filters (like {location: 'citySlug'})
            // Reset all filter fields to their initial empty/default values FIRST
            state.filters = { ...initialState.filters };
            // THEN re-apply the base context filters
            if (baseFilters.location) state.filters.location = baseFilters.location;
            if (baseFilters.category) state.filters.category = baseFilters.category;
            // state.filters.facilities = []; // Already handled by initialState spread
        },
        // Action to change view type
        setViewType(state, action) {
            state.viewType = action.payload;
        },
    },
    // No extraReducers or async thunks needed in this approach
});

// --- Export Actions and Reducer ---
export const {
    setFilter,
    setAllFilters,
    clearFilters,
    setViewType,
} = propertyListSlice.actions;

export default propertyListSlice.reducer; 