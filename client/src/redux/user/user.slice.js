import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIN: false,
  user: null, // always start as null
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isLoggedIN = true;
      state.user = action.payload;
    },
    removeUser: (state) => {
      state.isLoggedIN = false;
      state.user = null; // reset to null consistently
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
