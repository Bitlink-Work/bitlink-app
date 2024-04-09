import axiosClient from "./axiosClient";
import {
  CREATE_USER,
  GET_ENS_NAME_USER,
  GET_PROFILE,
  UPDATE_ENS_NAME_USER,
  UPDATE_PROFILE,
  UPDATE_USER_TYPE,
} from "./endpoint";

export const userServices = {
  profile: () => {
    return axiosClient.get(`${GET_PROFILE}`);
  },

  createUser: (bodyParams: any) => {
    return axiosClient.post(CREATE_USER, bodyParams);
  },

  updateProfile: (bodyParams: any) => {
    return axiosClient.put(UPDATE_PROFILE, bodyParams);
  },

  updateUserType: (bodyParams: any) => {
    return axiosClient.put(UPDATE_USER_TYPE, bodyParams);
  },

  getEnsNameUser: (params: any) => {
    return axiosClient.get(GET_ENS_NAME_USER, { params });
  },
  updateEnsNameUser: (bodyParams: any) => {
    return axiosClient.put(UPDATE_ENS_NAME_USER, bodyParams);
  },
};
