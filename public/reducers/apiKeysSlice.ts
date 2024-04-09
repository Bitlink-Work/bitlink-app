import { getApikeys } from "@/public/actions/apikey.actions";
import { createSlice } from "@reduxjs/toolkit";

// interface IBlock {
//     data: IItemDataBlock;
//     _id: string;
//     block_type: string;
//     user_template_id: string;
//     user_id: string;
//     changeStatus: any | boolean;
// }

const initialState = {
  keyItem: {
    items: [],
    num_of_page: 1,
    page: 1,
    callback_url: "",
  },
};

const apiKeysSlice = createSlice({
  name: "apiKeys",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getApikeys.fulfilled, (state, action) => {
      state.keyItem.items = action.payload.keys;
      state.keyItem.num_of_page = action.payload.num_of_page;
      state.keyItem.page = action.payload.page;
    });
  },
});

export default apiKeysSlice.reducer;
export const selectApiKeys = (state: any) => state.apiKeys.keyItem;
