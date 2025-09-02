import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  categories: [],
  articleCategoryId: "",
  cacheChat: null,
};

const cacheSlice = createSlice({
  name: "cacheData",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload.data;
    },
    setArticleCategoryId: (state, action) => {
      state.articleCategoryId = action.payload.data;
    },
    setCacheChat: (state, action) => {
      state.cacheChat = action.payload;
    },
  },
});

export const { setCategories, setArticleCategoryId, setCacheChat } =
  cacheSlice.actions;

export default cacheSlice.reducer;
