import { createSlice } from "@reduxjs/toolkit";
import { getPartner } from "../actions/invoice.action";

type KycData = {
  first_name: string;
  last_name: string;
  email: string;
  country: string;
  card_type: string;
  card_first_name: string;
  card_last_name: string;
  card_number: string;
  dob: string;
  front_card: string;
  back_card: string;
  verify_image: string;
  verified_link: string;
};
interface kycState {
  step: number;
  kycData: KycData;
  kycStepStatus: boolean;
}

const initialState: kycState = {
  step: 1,
  kycData: {
    first_name: "",
    last_name: "",
    email: "",
    country: "",
    card_type: "",
    card_first_name: "",
    card_last_name: "",
    card_number: "",
    dob: "",
    front_card: "",
    back_card: "",
    verify_image: "",
    verified_link: "",
  },
  kycStepStatus: false,
};

const kycSlice = createSlice({
  name: "kyc",
  initialState: initialState,
  reducers: {
    nextStep: (state, action) => {
      state.step = action.payload;
    },
    prevStep: (state, action) => {
      state.step = action.payload;
    },
    saveStepKYC: (state) => {
      state.step = 1;
    },
    updateStatusStepKyc: (state) => {
      state.kycStepStatus = true;
    },
    updateKycData: (state, action) => {
      state.kycData = action.payload;
    },
  },
});

export const {
  nextStep,
  prevStep,
  updateKycData,
  saveStepKYC,
  updateStatusStepKyc,
} = kycSlice.actions;
export default kycSlice.reducer;
