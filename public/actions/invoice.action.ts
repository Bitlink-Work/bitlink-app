import { createAsyncThunk } from "@reduxjs/toolkit";
import { invoiceServices } from "../api/invoiceServices";
import { setListBillingOfPartner } from "../reducers/partnerSlice";

export const createInvoice = createAsyncThunk(
  "invoice/createInvoice",
  async (params: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await invoiceServices.createInvoice(params);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const updateInvoice = createAsyncThunk(
  "invoice/updateInvoice",
  async (params: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await invoiceServices.updateInvoice(params);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const deleteInvoice = createAsyncThunk(
  "invoice/deleteInvoice",
  async (params: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await invoiceServices.deleteInvoice(params);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const uploadLogo = createAsyncThunk(
  "invoice/uploadLogo",
  async (param: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await invoiceServices.uploadLogo(param);
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const getCreatedInvoice = createAsyncThunk(
  "invoice/getCreatedInvoice",
  async (params: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await invoiceServices.getCreatedInvoice({ ...params });
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const getAllCreatedInvoice = createAsyncThunk(
  "invoice/getAllCreatedInvoice",
  async (params: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await invoiceServices.getAllCreatedInvoice({
        ...params,
      });
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const getCreatedData = createAsyncThunk(
  "invoice/getCreatedData",
  async (params: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await invoiceServices.getCreatedData();
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const getReceivedInvoice = createAsyncThunk(
  "invoice/getReceivedInvoice",
  async (params: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await invoiceServices.getReceivedInvoice({ ...params });
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const getAllReceivedInvoice = createAsyncThunk(
  "invoice/getAllReceivedInvoice",
  async (params: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await invoiceServices.getAllReceivedInvoice({
        ...params,
      });
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const getReceivedData = createAsyncThunk(
  "invoice/getReceivedData",
  async (params: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await invoiceServices.getReceivedData();
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const sendMail = createAsyncThunk(
  "invoice/sendMail",
  async (param: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await invoiceServices.sendMail(param);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const createPartner = createAsyncThunk(
  "invoice/createPartner",
  async (param: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await invoiceServices.createPartner(param);
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const updatePartner = createAsyncThunk(
  "invoice/updatePartner",
  async (param: IPartnerUpdate, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await invoiceServices.updatePartner(param);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const getPartner = createAsyncThunk(
  "invoices/getPartner",
  async (param: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await invoiceServices.getPartner();
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const getPartnerBilling = createAsyncThunk(
  "invoices/getPartnerBilling",
  async (param: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await invoiceServices.getPartnerBilling({ ...param });
      dispatch(
        setListBillingOfPartner({
          partner_id: param?.partner_id,
          items: response,
        }),
      );
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const getChainCurrency = createAsyncThunk(
  "invoices/getChainCurrency",
  async (param: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await invoiceServices.getCurrency();
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);
