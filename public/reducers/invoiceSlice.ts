import { createSlice } from "@reduxjs/toolkit";
import {
  getAllCreatedInvoice,
  getAllReceivedInvoice,
  getChainCurrency,
  getCreatedData,
  getCreatedInvoice,
  getReceivedData,
  getReceivedInvoice,
} from "../actions/invoice.action";

interface InvoiceState {
  createdInvoices: any[];
  createdData: any[];
  listCreatedInvoices: any[];
  receivedInvoices: any[];
  receivedData: any[];
  listReceivedInvoices: any[];
  currency: any[];
  logo: any;
}

const initialState: InvoiceState = {
  createdInvoices: [],
  createdData: [],
  listCreatedInvoices: [],
  receivedInvoices: [],
  receivedData: [],
  listReceivedInvoices: [],
  currency: [],
  logo: null,
};

const invoiceSlice = createSlice({
  name: "invoice",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCreatedInvoice.fulfilled, (state: any, action: any) => {
      state.createdInvoices = action.payload;
    });
    builder.addCase(getChainCurrency.fulfilled, (state: any, action: any) => {
      state.currency = action.payload;
    });
    builder.addCase(
      getAllCreatedInvoice.fulfilled,
      (state: any, action: any) => {
        state.listCreatedInvoices = action.payload;
      },
    );
    builder.addCase(getReceivedInvoice.fulfilled, (state: any, action: any) => {
      state.receivedInvoices = action.payload;
    });
    builder.addCase(
      getAllReceivedInvoice.fulfilled,
      (state: any, action: any) => {
        state.listReceivedInvoices = action.payload;
      },
    );
    builder.addCase(getCreatedData.fulfilled, (state: any, action: any) => {
      state.createdData = action.payload;
    });
    builder.addCase(getReceivedData.fulfilled, (state: any, action: any) => {
      state.receivedData = action.payload;
    });
  },
});

export const {} = invoiceSlice.actions;
export default invoiceSlice.reducer;
export const selectListCreatedInvoices = (state: any) =>
  state.invoice.createdInvoices;
export const selectCreatedData = (state: any) => state.invoice.createdData;
export const selectAllListCreatedInvoices = (state: any) =>
  state.invoice.listCreatedInvoices;
export const selectAllListReceivedInvoices = (state: any) =>
  state.invoice.listReceivedInvoices;
export const selectLogo = (state: any) => state.invoice.logo;
export const selectCurrency = (state: any) => state.invoice.currency;
export const selectListReceivedInvoices = (state: any) =>
  state.invoice.receivedInvoices;
export const selectReceivedData = (state: any) => state.invoice.receivedData;
