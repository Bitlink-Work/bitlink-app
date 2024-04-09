import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getEnsNameUser } from "@/public/actions";

const initialState = {
  data: [],
  loading: false,
};

const getItemKeys = (items: any) => {
  let listdomain: any = [];
  for (const i of items) {
    if (i.list_domain.length > 0) {
      listdomain = [
        ...listdomain,
        ...i.list_domain.map((domain: any) => {
          return {
            chain_id: i.chain_id,
            domain,
          };
        }),
      ];
    }
  }
  return listdomain;
};

const ensName = createSlice({
  name: "ensName",
  initialState: initialState,
  reducers: {
    setListExplore(state, action: PayloadAction) {},
  },
  extraReducers: (builder) => {
    builder.addCase(getEnsNameUser.pending, (state: any, action: any) => {
      state.loading = true;
      state.data = [];
    });
    builder.addCase(getEnsNameUser.fulfilled, (state: any, action: any) => {
      state.data = getItemKeys(action.payload.items);
      state.loading = false;
    });
    builder.addCase(getEnsNameUser.rejected, (state: any, action: any) => {
      state.loading = false;
    });
  },
});

export default ensName.reducer;

export const selectEnsName = (state: any) => state?.ensName.data;
export const selectLoading = (state: any) => state?.ensName.loading;
