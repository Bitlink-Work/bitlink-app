import { createSlice } from "@reduxjs/toolkit";
import { getProfile } from "../actions";

const initialState = {
  listNFTs: [] as any[],
  profileInfo: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState: initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profileInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProfile.fulfilled, (state: any, action: any) => {
      state.profileInfo = action.payload;
    });
  },
});

export const { setProfile } = profileSlice.actions;

export default profileSlice.reducer;

// export const selectNftDetailSlice = (state: any) => state.profile.listNFTs;
export const selectProfile = (state: any) => state.profile.profileInfo;
