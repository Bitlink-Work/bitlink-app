import { createSlice } from "@reduxjs/toolkit";

type SignData = {
  doc_url: string;
};

interface signState {
  step: number;
  signData: SignData;
}

const initialState: signState = {
  step: 1,
  signData: {
    doc_url: "",
  },
};

const signSlice = createSlice({
  name: "sign",
  initialState: initialState,
  reducers: {
    nextStep: (state, action) => {
      state.step = action.payload;
    },
    prevStep: (state, action) => {
      state.step = action.payload;
    },
    saveStepSign: (state) => {
      state.step = 1;
    },
    updateSignData: (state, action) => {
      state.signData = action.payload;
    },
  },
});

export const { nextStep, prevStep, saveStepSign, updateSignData } =
  signSlice.actions;
export default signSlice.reducer;
