import { userServices } from "@/public/api/userServices";
import { createAsyncThunk } from "@reduxjs/toolkit";
// Get Profile
export const getProfile = createAsyncThunk(
  "user/getProfile",
  async (params: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await userServices.profile();
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const createUser = createAsyncThunk(
  "user/createUser",
  async (params: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await userServices.createUser({ ...params });
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

// Update Profile
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (params: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await userServices.updateProfile(params);
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const updateUserType = createAsyncThunk(
  "user/updateUserType",
  async (params: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await userServices.updateUserType(params);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

// Update ens name
export const updateEnsNameUser = createAsyncThunk(
  "user/updateEnsNameUser",
  async (params: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await userServices.updateEnsNameUser(params);
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);
// Get ens name
export const getEnsNameUser = createAsyncThunk(
  "user/getEnsNameUser",
  async (params: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await userServices.getEnsNameUser(params);
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);
