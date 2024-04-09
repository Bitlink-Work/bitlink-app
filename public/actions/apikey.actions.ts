import { ApiKeyServices } from "@/public/api/apiKeyService";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createApiKeys = createAsyncThunk(
  "apikey/createApiKeys",
  async (params: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await ApiKeyServices.createApiKey(params);
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);
export const getApikeys = createAsyncThunk(
  "apikey/getApikeys",
  async (params: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await ApiKeyServices.getApiKeys(params);
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);
export const deleteApiKey = createAsyncThunk(
  "apikey/deleteApiKey",
  async (params: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await ApiKeyServices.deleteApiKey(params);
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);
export const updateApiKey = createAsyncThunk(
  "apikey/updateApiKey",
  async (params: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await ApiKeyServices.updateApiKey(params);
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);
export const updateURLCallBack = createAsyncThunk(
  "apikey/updateURLCallBack",
  async (params: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await ApiKeyServices.updateURLCallBack(params);
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);
