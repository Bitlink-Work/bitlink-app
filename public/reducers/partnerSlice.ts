import { createSlice } from "@reduxjs/toolkit";
import { getPartner } from "../actions/invoice.action";

interface InvoiceState {
  listPartner: any[];
  listBillingOfPartner: Record<string, any>;
  partnersLogoBackground: Record<string, string>;
}

const initialState: InvoiceState = {
  listPartner: [],
  listBillingOfPartner: {},
  partnersLogoBackground: {},
};

const partnerSlice = createSlice({
  name: "partner",
  initialState: initialState,
  reducers: {
    setListBillingOfPartner: (state, action) => {
      state.listBillingOfPartner[action.payload.partner_id] =
        action.payload.items;
    },
    setPartnerLogoBackground: (state, action) => {
      state.partnersLogoBackground[action.payload.partner_id] =
        action.payload.color;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPartner.fulfilled, (state: any, action: any) => {
      state.listPartner = action.payload;
    });
    // builder.addCase(getReceivedInvoice.fulfilled, (state: any, action: any) => {
    //   state.receivedInvoices = action.payload;
    // });
  },
});

export const { setListBillingOfPartner, setPartnerLogoBackground } =
  partnerSlice.actions;
export default partnerSlice.reducer;
export const selectListPartners = (state: any) => state.partner.listPartner;
export const selectListBillingOfPartners = (state: any) =>
  state.partner.listBillingOfPartner;
export const selectPartnersLogoBackground = (state: any) =>
  state.partner.partnersLogoBackground;
