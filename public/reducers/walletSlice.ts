import { RootState } from "@/public/hook/store";
import { WalletState } from "@/public/models/redux-models";
import { LocalStorage } from "@/public/utils/LocalStorage";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getProfile } from "./../actions/user.action";

const initialState: WalletState = {
  addressWallet: null,
  chainId: Number(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID),
  // chainId:1,
  isOpenModal: false,
  connected: false,
  provider: null,
  loading: false,
  profile: null,
  connectorType: "",
  option: {},
};

const walletSlice = createSlice({
  name: "wallet",
  initialState: initialState,
  reducers: {
    openModal(state, action: PayloadAction<any>) {
      state.isOpenModal = true;
      state.option = action.payload.option;
    },
    setChainIdWallet(state, action: PayloadAction<any>) {
      if (action.payload) {
        state.chainId = Number(action.payload);
      }
    },
    closeModal(state) {
      state.isOpenModal = false;
    },
    connectWallet(state, action: PayloadAction<any>) {
      state.connected = true;
      state.provider = action.payload;
    },
    disconnectWallet(state) {
      state.connected = false;
      state.provider = null;
      state.addressWallet = null;
    },
    setProfile(state, action: PayloadAction<any>) {
      state.profile = action.payload;
      state.addressWallet = action.payload?.public_address;
    },
    clearProfile(state) {
      state.profile = null;
      state.addressWallet = null;
      state.connected = false;
      LocalStorage.clearToken();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProfile.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getProfile.fulfilled, (state, action: any) => {
      state.profile = action.payload;
      state.addressWallet = action.payload?.public_address;
      state.loading = false;
      state.connected = true;
    });
    builder.addCase(getProfile.rejected, (state, action) => {
      state.profile = null;
      state.loading = false;
    });
    // update profile
  },
});

export const {
  setChainIdWallet,
  connectWallet,
  disconnectWallet,
  setProfile,
  clearProfile,
  openModal,
  closeModal,
} = walletSlice.actions;
export default walletSlice.reducer;

// create and export the selector
export const selectIsOpenModal = (state: RootState) => state.wallet.isOpenModal;
export const selectWalletConnected = (state: RootState) =>
  state.wallet.connected;
export const selectProfile = (state: RootState) => state.wallet.profile;
export const selectLoadingProfile = (state: RootState) => state.wallet.loading;
export const selectWalletChainID = (state: RootState) => state.wallet.chainId;
export const selectAddressWallet = (state: RootState) =>
  state.wallet.addressWallet;
export const selectConnectorType = (state: RootState) =>
  state.wallet.connectorType;
export const selectConnectOption = (state: RootState) => state.wallet.option;
