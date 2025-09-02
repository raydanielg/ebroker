import { createSlice } from "@reduxjs/toolkit";
import { store } from "../store";

const initialState = {
  data: null,
  fcmToken: "",
};

export const webSettingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    setWebSettings: (state, action) => {
      state.data = action.payload.data;
    },
    setFcmToken: (state, action) => {
      state.fcmToken = action.payload.data;
    },
  },
});


export const { setWebSettings, setFcmToken } = webSettingSlice.actions;
export default webSettingSlice.reducer;

export const setFCMToken = (data) => {
  store.dispatch(setFcmToken({ data }));
};