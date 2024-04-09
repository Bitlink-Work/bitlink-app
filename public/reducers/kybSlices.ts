import { createSlice } from "@reduxjs/toolkit";

type KybData = {
  //company detail
  company_name: string;
  registration_number: string;
  registered_country: string;
  company_email: string;
  company_website: string;
  company_phone_number: string;
  registered_address: string;
  registered_person: string;
  // tax_residence: string;
  tax_id: string;
  // company_country: string;
  city: string;
  postcode: string;
  address_document_type: string;
  certificate_document_type: string;
  address_document: string;
  certificate_document: string;

  //representatives
  first_name: string;
  last_name: string;
  email: string;
  type_number: string;
  phone_number: string;
  card_type: string;
  card_first_name: string;
  card_last_name: string;
  dob: string;
  representative_country: string;
  address_document_name: string;
  certificate_document_name: string;

  //
  front_card: string;
  back_card: string;
  // document: string;

  //
  verified_link: string;
};

type KybFile = {
  address_document: any;
  certificate_document: any;
  // document: any;
};
interface KybState {
  step: number;
  kybData: KybData;
  kybFile: KybFile;
  kybStepStatus: boolean;
  isProcessing: boolean;
}

const initialState: KybState = {
  step: 1,
  kybData: {
    //company detail
    company_name: "",
    registration_number: "",
    registered_country: "",
    company_email: "",

    company_website: "",
    company_phone_number: "",
    registered_address: "",
    registered_person: "",

    tax_id: "",

    city: "",
    postcode: "",
    address_document: "",
    certificate_document: "",
    address_document_type: "",
    certificate_document_type: "",
    address_document_name: "",
    certificate_document_name: "",

    first_name: "",
    last_name: "",
    email: "",
    type_number: "",
    phone_number: "",
    card_type: "",
    card_first_name: "",
    card_last_name: "",
    dob: "",
    representative_country: "",
    front_card: "",
    back_card: "",

    verified_link: "",
  },
  kybFile: {
    address_document: {},
    certificate_document: {},
  },
  kybStepStatus: false,
  isProcessing: false,
};

const KybSlice = createSlice({
  name: "Kyb",
  initialState: initialState,
  reducers: {
    nextStep: (state, action) => {
      state.step = action.payload;
      // if (!state.isProcessing) {
      //   state.isProcessing = true;
      //   state.step += 1;
      // }
    },
    prevStep: (state, action) => {
      state.step = action.payload;
    },
    saveStep: (state) => {
      state.step = 1;
    },
    updateStatusStep: (state) => {
      state.kybStepStatus = true;
    },
    updateKybData: (state, action) => {
      state.kybData = action.payload;
    },
    updateKybFile: (state, action) => {
      state.kybFile = action.payload;
    },
    // finishProcessing: (state) => {
    //   state.isProcessing = false;
    // },
  },
});

export const {
  nextStep,
  prevStep,
  updateKybData,
  updateKybFile,
  saveStep,
  updateStatusStep,
  // finishProcessing,
} = KybSlice.actions;
export default KybSlice.reducer;
// export const selectKyb = (state: any) => state.kyb.kybData;
