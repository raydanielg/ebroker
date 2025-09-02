import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  default_language: "", // The system default language from API
  active_language: "", // The currently active language (user selected or default)
  current_language: {}, // Language data/translations
  languages: [], // Available languages
  isFetched: false, // Whether language data has been fetched
  manual_change: false, // Track if language was changed manually by user
  isLanguageLoaded: false, // Track if language data is loaded completely
};

const languageSlice = createSlice({
  name: "LanguageSettings",
  initialState,
  reducers: {
    setDefaultLanguage: (state, action) => {
      state.default_language = action.payload.data;
      // If active language is not set, use default language
      if (!state.active_language) {
        state.active_language = action.payload.data;
      }
    },
    setActiveLanguage: (state, action) => {
      state.active_language = action.payload.data;
    },
    setCurrentLanguage: (state, action) => {
      state.current_language = action.payload.data;
      state.isLanguageLoaded = true;
    },
    setLanguages: (state, action) => {
      state.languages = action.payload.data;
    },
    setIsFetched: (state, action) => {
      state.isFetched = action.payload.data;
    },
    setManualChange: (state, action) => {
      state.manual_change = action.payload.data;
    },
    setIsLanguageLoaded: (state, action) => {
      state.isLanguageLoaded = action.payload.data;
    },
  },
});

export const {
  setDefaultLanguage,
  setActiveLanguage,
  setCurrentLanguage,
  setLanguages,
  setIsFetched,
  setManualChange,
  setIsLanguageLoaded,
} = languageSlice.actions;

export default languageSlice.reducer;
