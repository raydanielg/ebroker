import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLocationSet: false,
  latitude: 0,
  longitude: 0,
  formatted_address: "",
  radius: 1,
  city: "",
  state: "",
  country: "",
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocationAction: (state, action) => {
      state.isLocationSet = true;
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
      state.formatted_address = action.payload.formatted_address;
      state.radius = action.payload.radius;
      state.city = action.payload.city;
      state.state = action.payload.state;
      state.country = action.payload.country;
    },
    clearLocationAction: (state) => {
      state.isLocationSet = false;
      state.latitude = 0;
      state.longitude = 0;
      state.formatted_address = "";
      state.radius = 1;
      state.city = "";
      state.state = "";
      state.country = "";
    },
  },
});

export const { setLocationAction } = locationSlice.actions;

export default locationSlice.reducer;
