import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/public/hook/store";

const initialState = {
  isOpenModal: false,
  isSuccess: false,
  data: {
    title: "",
    message: "",
  },
};

const modalAwaitingSlice = createSlice({
  name: "Awaiting",
  initialState: initialState,
  reducers: {
    openModalAwaiting(state, action) {
      (state.isSuccess = false), (state.isOpenModal = action.payload.isOpen);
      state.data = {
        ...state.data,
        ...action.payload?.data,
      };
    },
    updateSuccessAwaiting(state, action) {
      (state.isSuccess = true),
        (state.data = {
          ...state.data,
          ...action.payload?.data,
        });
    },
  },
  extraReducers: (builder) => {},
});

export const { openModalAwaiting, updateSuccessAwaiting } =
  modalAwaitingSlice.actions;

export default modalAwaitingSlice.reducer;

// create and export the selector
export const selectIsOpenModalAwaiting = (state: RootState) =>
  state.modalAwaiting.isOpenModal;
export const selectIsSuccessModalAwaiting = (state: RootState) =>
  state.modalAwaiting.isSuccess;
export const selectDataModalAwaiting = (state: RootState) =>
  state.modalAwaiting.data;
